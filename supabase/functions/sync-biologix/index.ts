import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { BiologixClient } from './biologix-client.ts';
import { ExamDto, EXAM_TYPE, EXAM_STATUS, IDO_CATEGORY } from './types.ts';
import { criarAlertaCritico, existeAlertaPendente } from './alertas.ts';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  BIOLOGIX_USERNAME: string;
  BIOLOGIX_PASSWORD: string;
  BIOLOGIX_SOURCE: number; // Number as string from env
  BIOLOGIX_PARTNER_ID: string; // Partner ID fornecido pela Biologix (ID do centro)
}

/**
 * Extracts CPF from username using regex
 * Username format may contain CPF embedded, we extract only numbers
 */
function extractCPF(username: string): string | null {
  const cpfMatch = username.match(/\d{11}/);
  if (cpfMatch) {
    return cpfMatch[0];
  }
  // Try to extract all numbers and check if it's 11 digits
  const numbers = username.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers;
  }
  return null;
}

/**
 * Safely converts a numeric value to fit into a NUMERIC column with limited precision/scale.
 * Used to avoid "numeric field overflow" when values from Biologix exceed DB limits.
 */
function clampNumeric(
  value: number | null | undefined,
  maxAbs: number,
): number | null {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;

  if (num > maxAbs) {
    console.warn(`Clamping numeric value ${num} to max ${maxAbs}`);
    return maxAbs;
  }

  if (num < -maxAbs) {
    console.warn(`Clamping numeric value ${num} to min ${-maxAbs}`);
    return -maxAbs;
  }

  return num;
}

/**
 * Calculates snoring score: (baixo × 1 + medio × 2 + alto × 3) / 3
 */
function calculateScoreRonco(
  baixo: number,
  medio: number,
  alto: number
): number | null {
  const total = baixo + medio + alto;
  if (total === 0) {
    return null;
  }
  return Number(((baixo * 1 + medio * 2 + alto * 3) / 3).toFixed(2));
}

/**
 * Retry with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message;
      
      // Detectar rate limiting (429) e aguardar mais tempo
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('tooManyRequests');
      
      if (attempt < maxRetries) {
        let delay: number;
        
        if (isRateLimit) {
          // Para rate limiting, aguardar mais tempo: 60 segundos + backoff exponencial
          delay = 60000 + (baseDelay * Math.pow(2, attempt));
          console.log(`Rate limit detected. Waiting ${delay/1000} seconds before retry...`);
        } else {
          // Para outros erros, usar backoff exponencial normal
          delay = baseDelay * Math.pow(2, attempt);
          console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Main handler for sync-biologix Edge Function
 */
Deno.serve(async (req: Request) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const biologixUsername = Deno.env.get('BIOLOGIX_USERNAME');
    const biologixPassword = Deno.env.get('BIOLOGIX_PASSWORD');
    const biologixSource = Deno.env.get('BIOLOGIX_SOURCE');
    const biologixPartnerId = Deno.env.get('BIOLOGIX_PARTNER_ID');

    // Log para debug - verificar valores das variáveis de ambiente
    console.log('=== Environment Variables Check ===');
    console.log('BIOLOGIX_USERNAME:', biologixUsername ? `${biologixUsername.substring(0, 10)}...` : 'NOT SET');
    console.log('BIOLOGIX_PASSWORD:', biologixPassword ? '***SET***' : 'NOT SET');
    console.log('BIOLOGIX_SOURCE:', biologixSource);
    console.log('BIOLOGIX_PARTNER_ID:', biologixPartnerId);
    console.log('BIOLOGIX_PARTNER_ID length:', biologixPartnerId?.length || 0);

    if (!supabaseUrl || !supabaseServiceKey || !biologixUsername || !biologixPassword || !biologixSource || !biologixPartnerId) {
      throw new Error('Missing required environment variables. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BIOLOGIX_USERNAME, BIOLOGIX_PASSWORD, BIOLOGIX_SOURCE, BIOLOGIX_PARTNER_ID');
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create Biologix client
    // partnerId is provided by Biologix (ID do centro) and used in the URL
    // userId from session is used for Basic Auth
    const biologixClient = new BiologixClient(
      biologixUsername,
      biologixPassword,
      parseInt(biologixSource),
      biologixPartnerId
    );

    console.log('Opening Biologix session...');
    await biologixClient.openSession();
    console.log('Session opened successfully');

    // Fetch ALL DONE exams with automatic pagination
    console.log('Fetching ALL DONE exams from Biologix (with pagination)...');
    const exams = await retryWithBackoff(() => biologixClient.getAllDoneExams());
    console.log(`Found ${exams.length} DONE exams from Biologix API`);

    let processed = 0;
    let created = 0;
    let updated = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    // Process each exam
    for (const exam of exams) {
      try {
        // Extract CPF from patient username (optional, used as fallback)
        const cpf = extractCPF(exam.patient.username);
        
        // Get biologix_id from exam (this is the primary identifier)
        const biologixId = exam.patientUserId;

        // Find or create paciente
        let pacienteId: string;
        let pacienteExisted = false;
        
        // 1. Try to find by biologix_id first (primary method)
        let { data: existingPaciente } = await supabase
          .from('pacientes')
          .select('id, biologix_id, cpf, data_nascimento')
          .eq('biologix_id', biologixId)
          .single();

        if (existingPaciente) {
          pacienteId = existingPaciente.id;
          pacienteExisted = true;
          console.log(`Found paciente by biologix_id: ${biologixId} (${exam.patient.name})`);
        } else if (cpf) {
          // 2. Fallback: Try to find by CPF if biologix_id not found
          const { data: pacienteByCpf } = await supabase
            .from('pacientes')
            .select('id, biologix_id, cpf, data_nascimento')
            .eq('cpf', cpf)
            .single();

          if (pacienteByCpf) {
            pacienteId = pacienteByCpf.id;
            pacienteExisted = true;
            
            // Update paciente with biologix_id if missing
            if (!pacienteByCpf.biologix_id) {
              const { error: updateError } = await supabase
                .from('pacientes')
                .update({ biologix_id: biologixId })
                .eq('id', pacienteByCpf.id);
              
              if (updateError) {
                console.warn(`Failed to update biologix_id for paciente ${pacienteByCpf.id}: ${updateError.message}`);
              } else {
                console.log(`Updated paciente with biologix_id: ${biologixId} (found by CPF: ${cpf})`);
              }
            }
            
            console.log(`Found paciente by CPF: ${cpf} (${exam.patient.name})`);
          }
        }

        // 3. If paciente already exists, try to backfill missing data_nascimento using Biologix data
        if (pacienteExisted && exam.patient.birthDate) {
          const currentBirthDate =
            existingPaciente?.data_nascimento ??
            // If we found by CPF, use that record as fallback
            (typeof pacienteByCpf !== 'undefined' ? (pacienteByCpf as any).data_nascimento : null);

          // Only update if birth date is not set yet
          if (!currentBirthDate) {
            const { error: birthDateUpdateError } = await supabase
              .from('pacientes')
              .update({ data_nascimento: exam.patient.birthDate })
              .eq('id', pacienteId);

            if (birthDateUpdateError) {
              console.warn(
                `Failed to backfill data_nascimento for paciente ${pacienteId}: ${birthDateUpdateError.message}`,
              );
            } else {
              console.log(
                `Backfilled data_nascimento for paciente ${pacienteId} with ${exam.patient.birthDate}`,
              );
            }
          }
        }

        // 4. Create new paciente if not found
        if (!pacienteId) {
          // Validate that we have at least CPF or can create without it
          if (!cpf && !biologixId) {
            console.warn(`Cannot create paciente: missing both CPF and biologix_id (examId: ${exam.examId})`);
            errors++;
            errorDetails.push(`Exam ${exam.examId}: Cannot create paciente - missing CPF and biologix_id`);
            continue;
          }

          // Create new paciente as 'lead'
          const newPacienteData: any = {
            biologix_id: biologixId,
            nome: exam.patient.name,
            email: exam.patient.email || null,
            telefone: exam.patient.phone || null,
            data_nascimento: exam.patient.birthDate || null,
            genero: exam.patient.gender === 'm' ? 'M' : exam.patient.gender === 'f' ? 'F' : 'Outro',
            status: 'lead',
          };

          // Only include CPF if we have it
          if (cpf) {
            newPacienteData.cpf = cpf;
          }

          const { data: newPaciente, error: createError } = await supabase
            .from('pacientes')
            .insert(newPacienteData)
            .select('id')
            .single();

          if (createError || !newPaciente) {
            throw new Error(`Failed to create paciente: ${createError?.message}`);
          }

          pacienteId = newPaciente.id;
          console.log(`Created new paciente: biologix_id=${biologixId}, cpf=${cpf || 'N/A'} (${exam.patient.name})`);
        }

        // Calculate score_ronco if exam type is Ronco (0) and has snoring data
        let scoreRonco: number | null = null;
        if (exam.type === EXAM_TYPE.RONCO && exam.result?.snoring) {
          const snoring = exam.result.snoring;
          scoreRonco = calculateScoreRonco(
            snoring.lowDurationPercent,
            snoring.mediumDurationPercent,
            snoring.highDurationPercent
          );
        }

        // Parse conditions array to boolean fields
        const conditions = exam.base?.conditions || [];
        const hasCondition = (condition: string) => conditions.includes(condition);

        // Parse treatments array to boolean fields
        const treatments = exam.base?.treatments || [];
        const hasTreatment = (treatment: string) => treatments.includes(treatment);

        // Calculate end time from start time + duration
        let horaInicio: string | null = null;
        let horaFim: string | null = null;
        if (exam.base?.startTime) {
          horaInicio = exam.base.startTime;
          if (exam.base.durationSecs) {
            const startDate = new Date(exam.base.startTime);
            const endDate = new Date(startDate.getTime() + exam.base.durationSecs * 1000);
            horaFim = endDate.toISOString();
          }
        }

        // Prepare exam data
        const examData: any = {
          paciente_id: pacienteId,
          biologix_exam_id: exam.examId,
          biologix_exam_key: exam.examKey,
          tipo: exam.type,
          status: exam.status,
          data_exame: exam.base?.startTime ? exam.base.startTime.split('T')[0] : new Date().toISOString().split('T')[0],
          
          // Campos de tempo
          hora_inicio: horaInicio,
          hora_fim: horaFim,
          duracao_total_seg: exam.base?.durationSecs || null,
          duracao_valida_seg: exam.result?.oximetry?.validDurationSecs || exam.result?.snoring?.validDurationSecs || null,
          
          // Dados do paciente
          peso_kg: exam.base?.weightKg || null,
          altura_cm: exam.base?.heightCm || null,
          // IMC will be calculated by trigger
          
          // Condições na noite do exame
          consumo_alcool: hasCondition('Álcool') || hasCondition('Alcool') || hasCondition('Alcohol'),
          congestao_nasal: hasCondition('Congestão Nasal') || hasCondition('Congestao Nasal'),
          sedativos: hasCondition('Sedativos'),
          placa_bruxismo: hasCondition('Placa de Bruxismo') || hasCondition('Bruxismo'),
          marcapasso: hasCondition('Marcapasso'),
          
          // Tratamentos na noite do exame
          cpap: hasTreatment('CPAP'),
          aparelho_avanco: hasTreatment('Aparelho de Avanço Mandibular') || hasTreatment('AAM'),
          terapia_posicional: hasTreatment('Terapia Posicional'),
          oxigenio: hasTreatment('Oxigênio') || hasTreatment('Oxigenio'),
          suporte_ventilatorio: hasTreatment('Suporte Ventilatório') || hasTreatment('Ventilacao'),
          
          // Ficha médica (arrays convertidos para TEXT separado por vírgula)
          condicoes: conditions.length > 0 ? conditions.join(', ') : null,
          sintomas: exam.base?.symptoms && exam.base.symptoms.length > 0 ? exam.base.symptoms.join(', ') : null,
          doencas: exam.base?.illnesses && exam.base.illnesses.length > 0 ? exam.base.illnesses.join(', ') : null,
          medicamentos: exam.base?.medicines && exam.base.medicines.length > 0 ? exam.base.medicines.join(', ') : null,
          
          // Ronco
          ronco_duracao_seg: exam.result?.snoring?.snoringDurationSecs || null,
          ronco_silencio_pct: exam.result?.snoring?.silentDurationPercent || null,
          ronco_baixo_pct: exam.result?.snoring?.lowDurationPercent || null,
          ronco_medio_pct: exam.result?.snoring?.mediumDurationPercent || null,
          ronco_alto_pct: exam.result?.snoring?.highDurationPercent || null,
          score_ronco: scoreRonco,
          
          // Oximetria
          // DB column ido is NUMERIC(4,2) -> max ~99.99; clamp to avoid overflow
          ido: clampNumeric(exam.result?.oximetry?.odi, 99.99),
          ido_sono: clampNumeric(exam.result?.oximetry?.odi, 99.99), // IDOs (mesmo valor que IDO para agora)
          ido_categoria: exam.result?.oximetry?.odiCategory ?? null,
          // SpO2 columns are NUMERIC(4,2) as well; SpO2 clínica pode ser 100,
          // então clamp em 99.99 para caber no tipo
          spo2_min: clampNumeric(exam.result?.oximetry?.spO2Min, 99.99),
          spo2_avg: clampNumeric(exam.result?.oximetry?.spO2Avg, 99.99),
          spo2_max: clampNumeric(exam.result?.oximetry?.spO2Max, 99.99),
          tempo_spo2_90_seg: exam.result?.oximetry?.spO2Under90Secs || null,
          tempo_spo2_80_seg: exam.result?.oximetry?.spO2Under80Secs || null,
          num_dessaturacoes: exam.result?.oximetry?.nbDesaturations || null,
          num_eventos_hipoxemia: exam.result?.oximetry?.nbHypoxemiaEvents || null,
          tempo_hipoxemia_seg: exam.result?.oximetry?.hypoxemiaTotalDurationSecs || null,
          carga_hipoxica: clampNumeric(exam.result?.oximetry?.hypoxicBurden, 999.99),
          
          // Frequência cardíaca
          bpm_min: exam.result?.oximetry?.hrMin || null,
          bpm_medio: exam.result?.oximetry?.hrAvg || null,
          bpm_max: exam.result?.oximetry?.hrMax || null,
          
          // Sono estimado
          tempo_sono_seg: exam.result?.oximetry?.sleepDurationSecs || null,
          tempo_dormir_seg: exam.result?.oximetry?.sleepLatencySecs || null,
          tempo_acordado_seg: exam.result?.oximetry?.wakeTimeAfterSleepSecs || null,
          eficiencia_sono_pct: clampNumeric(exam.result?.oximetry?.sleepEfficiencyPercent, 100),
          
          // Cardiologia
          fibrilacao_atrial: exam.result?.cardiology?.afNotification ?? null,
        };

        // Função auxiliar para filtrar apenas campos básicos que sempre existem
        const getBasicFields = (data: any): any => {
          const basicFields = [
            'paciente_id', 'biologix_exam_id', 'biologix_exam_key', 'tipo', 'status', 'data_exame',
            'peso_kg', 'altura_cm',
            'ido', 'ido_categoria', 'spo2_min', 'spo2_avg', 'spo2_max',
            'score_ronco'
          ];
          
          const basic: any = {};
          for (const field of basicFields) {
            if (data[field] !== undefined && data[field] !== null) {
              basic[field] = data[field];
            }
          }
          return basic;
        };

        // Upsert exam (unique by biologix_exam_id)
        const { data: existingExam } = await supabase
          .from('exames')
          .select('id')
          .eq('biologix_exam_id', exam.examId)
          .single();

        let exameId: string;
        if (existingExam) {
          // Tentar primeiro com todos os campos
          let { error: updateError } = await supabase
            .from('exames')
            .update(examData)
            .eq('id', existingExam.id);

          // Se erro for sobre campos não encontrados, tentar com campos básicos
          if (updateError && (
            updateError.message.includes('Could not find') || 
            updateError.message.includes('column') ||
            updateError.message.includes('bpm_') ||
            updateError.message.includes('hora_') ||
            updateError.message.includes('duracao_') ||
            updateError.message.includes('consumo_') ||
            updateError.message.includes('congestao_') ||
            updateError.message.includes('sedativos') ||
            updateError.message.includes('placa_') ||
            updateError.message.includes('marcapasso') ||
            updateError.message.includes('cpap') ||
            updateError.message.includes('aparelho_') ||
            updateError.message.includes('terapia_') ||
            updateError.message.includes('oxigenio') ||
            updateError.message.includes('suporte_') ||
            updateError.message.includes('tempo_') ||
            updateError.message.includes('num_') ||
            updateError.message.includes('carga_') ||
            updateError.message.includes('eficiencia_') ||
            updateError.message.includes('ronco_') ||
            updateError.message.includes('fibrilacao_')
          )) {
            console.warn(`Campos estendidos não encontrados para exame ${exam.examId}, usando apenas campos básicos`);
            
            const examDataBasic = getBasicFields(examData);
            
            const { error: retryError } = await supabase
              .from('exames')
              .update(examDataBasic)
              .eq('id', existingExam.id);
            
            if (retryError) {
              throw new Error(`Failed to update exam (even with basic fields): ${retryError.message}`);
            }
            console.log(`Exame ${exam.examId} atualizado com campos básicos. Aplique a migration 016 para campos completos.`);
            updateError = null; // Limpar erro para continuar
          }
          
          if (updateError) {
            throw new Error(`Failed to update exam: ${updateError.message}`);
          }
          
          exameId = existingExam.id;
          updated++;
        } else {
          // Tentar primeiro com todos os campos
          let { data: newExam, error: insertError } = await supabase
            .from('exames')
            .insert(examData)
            .select('id')
            .single();

          // Se erro for sobre campos não encontrados, tentar com campos básicos
          if (insertError && (
            insertError.message.includes('Could not find') || 
            insertError.message.includes('column') ||
            insertError.message.includes('bpm_') ||
            insertError.message.includes('hora_') ||
            insertError.message.includes('duracao_') ||
            insertError.message.includes('consumo_') ||
            insertError.message.includes('congestao_') ||
            insertError.message.includes('sedativos') ||
            insertError.message.includes('placa_') ||
            insertError.message.includes('marcapasso') ||
            insertError.message.includes('cpap') ||
            insertError.message.includes('aparelho_') ||
            insertError.message.includes('terapia_') ||
            insertError.message.includes('oxigenio') ||
            insertError.message.includes('suporte_') ||
            insertError.message.includes('tempo_') ||
            insertError.message.includes('num_') ||
            insertError.message.includes('carga_') ||
            insertError.message.includes('eficiencia_') ||
            insertError.message.includes('ronco_') ||
            insertError.message.includes('fibrilacao_')
          )) {
            console.warn(`Campos estendidos não encontrados para exame ${exam.examId}, usando apenas campos básicos`);
            
            const examDataBasic = getBasicFields(examData);
            
            const result = await supabase
              .from('exames')
              .insert(examDataBasic)
              .select('id')
              .single();
            
            if (result.error) {
              throw new Error(`Failed to insert exam (even with basic fields): ${result.error.message}`);
            }
            
            if (!result.data) {
              throw new Error('Failed to insert exam: no data returned');
            }
            
            exameId = result.data.id;
            console.log(`Exame ${exam.examId} inserido com campos básicos. Aplique a migration 016 para campos completos.`);
            insertError = null; // Limpar erro para continuar
          } else if (insertError) {
            throw new Error(`Failed to insert exam: ${insertError.message}`);
          } else {
            exameId = newExam!.id;
          }
          
          created++;
        }

        // ============================================
        // Verificar condições críticas e criar alertas
        // ============================================
        
        // 9.3: Verificar IDO acentuado (categoria = 3)
        if (examData.ido_categoria === 3 && examData.ido !== null) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'critico',
            pacienteId,
            exameId
          );
          
          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'critico',
              pacienteId,
              exameId,
              {
                titulo: 'IDO Acentuado Detectado',
                mensagem: `Paciente apresentou IDO acentuado (${examData.ido.toFixed(1)} eventos/hora) no exame realizado em ${examData.data_exame}. Requer atenção imediata.`,
                urgencia: 'alta',
                dados_extras: {
                  ido: examData.ido,
                  ido_categoria: examData.ido_categoria,
                  tipo_exame: exam.type === EXAM_TYPE.RONCO ? 'Ronco' : 'Sono',
                },
              }
            );
          }
        }

        // 9.4: Verificar SpO2 crítico (spo2_min < 80%)
        if (examData.spo2_min !== null && examData.spo2_min < 80) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'critico',
            pacienteId,
            exameId
          );
          
          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'critico',
              pacienteId,
              exameId,
              {
                titulo: 'SpO2 Crítico Detectado',
                mensagem: `Paciente apresentou SpO2 mínimo crítico (${examData.spo2_min.toFixed(1)}%) no exame realizado em ${examData.data_exame}. Requer atenção médica imediata.`,
                urgencia: 'alta',
                dados_extras: {
                  spo2_min: examData.spo2_min,
                  spo2_avg: examData.spo2_avg,
                  spo2_max: examData.spo2_max,
                  tipo_exame: exam.type === EXAM_TYPE.RONCO ? 'Ronco' : 'Sono',
                },
              }
            );
          }
        }

        // 9.5: Verificar Fibrilação Atrial (fibrilacao_atrial = 1)
        if (examData.fibrilacao_atrial === 1) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'critico',
            pacienteId,
            exameId
          );
          
          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'critico',
              pacienteId,
              exameId,
              {
                titulo: 'Fibrilação Atrial Detectada',
                mensagem: `Fibrilação atrial foi detectada no exame realizado em ${examData.data_exame}. Requer avaliação cardiológica imediata.`,
                urgencia: 'alta',
                dados_extras: {
                  fibrilacao_atrial: examData.fibrilacao_atrial,
                  tipo_exame: exam.type === EXAM_TYPE.RONCO ? 'Ronco' : 'Sono',
                },
              }
            );
          }
        }

        // 9.6: Verificar piora de IDO (comparar com exame anterior)
        if (examData.ido !== null && examData.ido_categoria !== null) {
          const { data: examesAnteriores } = await supabase
            .from('exames')
            .select('ido, ido_categoria, data_exame')
            .eq('paciente_id', pacienteId)
            .eq('tipo', exam.type)
            .not('ido', 'is', null)
            .not('id', 'eq', exameId)
            .order('data_exame', { ascending: false })
            .limit(1);

          if (examesAnteriores && examesAnteriores.length > 0) {
            const exameAnterior = examesAnteriores[0];
            const idoAnterior = parseFloat(exameAnterior.ido);
            const idoAtual = parseFloat(examData.ido);

            // Considerar piora se IDO aumentou significativamente (> 30% de aumento)
            // ou se categoria piorou (ex: de 1 para 2 ou 3, ou de 2 para 3)
            const aumentoPercentual = ((idoAtual - idoAnterior) / idoAnterior) * 100;
            const categoriaPiorou = 
              (exameAnterior.ido_categoria !== null && examData.ido_categoria !== null) &&
              examData.ido_categoria > exameAnterior.ido_categoria;

            if (aumentoPercentual > 30 || categoriaPiorou) {
              const jaExiste = await existeAlertaPendente(
                supabase,
                'critico',
                pacienteId,
                exameId
              );
              
              if (!jaExiste) {
                await criarAlertaCritico(
                  supabase,
                  'critico',
                  pacienteId,
                  exameId,
                  {
                    titulo: 'Piora Significativa de IDO',
                    mensagem: `IDO piorou significativamente: de ${idoAnterior.toFixed(1)} para ${idoAtual.toFixed(1)} eventos/hora (${aumentoPercentual.toFixed(1)}% de aumento). Exame anterior: ${exameAnterior.data_exame}.`,
                    urgencia: categoriaPiorou ? 'alta' : 'media',
                    dados_extras: {
                      ido_anterior: idoAnterior,
                      ido_atual: idoAtual,
                      aumento_percentual: aumentoPercentual,
                      categoria_anterior: exameAnterior.ido_categoria,
                      categoria_atual: examData.ido_categoria,
                      tipo_exame: exam.type === EXAM_TYPE.RONCO ? 'Ronco' : 'Sono',
                    },
                  }
                );
              }
            }
          }
        }

        // 9.7: Verificar piora de Score Ronco (apenas para exames de Ronco)
        if (exam.type === EXAM_TYPE.RONCO && examData.score_ronco !== null) {
          const { data: examesAnteriores } = await supabase
            .from('exames')
            .select('score_ronco, data_exame')
            .eq('paciente_id', pacienteId)
            .eq('tipo', EXAM_TYPE.RONCO)
            .not('score_ronco', 'is', null)
            .not('id', 'eq', exameId)
            .order('data_exame', { ascending: false })
            .limit(1);

          if (examesAnteriores && examesAnteriores.length > 0) {
            const exameAnterior = examesAnteriores[0];
            const scoreAnterior = parseFloat(exameAnterior.score_ronco);
            const scoreAtual = parseFloat(examData.score_ronco);

            // Considerar piora se score aumentou > 30% ou se aumentou de forma significativa (> 0.5 pontos)
            const aumentoPercentual = ((scoreAtual - scoreAnterior) / scoreAnterior) * 100;
            const aumentoAbsoluto = scoreAtual - scoreAnterior;

            if (aumentoPercentual > 30 || aumentoAbsoluto > 0.5) {
              const jaExiste = await existeAlertaPendente(
                supabase,
                'critico',
                pacienteId,
                exameId
              );
              
              if (!jaExiste) {
                await criarAlertaCritico(
                  supabase,
                  'critico',
                  pacienteId,
                  exameId,
                  {
                    titulo: 'Piora de Score de Ronco',
                    mensagem: `Score de ronco piorou: de ${scoreAnterior.toFixed(2)} para ${scoreAtual.toFixed(2)} (${aumentoPercentual.toFixed(1)}% de aumento). Exame anterior: ${exameAnterior.data_exame}.`,
                    urgencia: aumentoAbsoluto > 1.0 ? 'alta' : 'media',
                    dados_extras: {
                      score_anterior: scoreAnterior,
                      score_atual: scoreAtual,
                      aumento_percentual: aumentoPercentual,
                      aumento_absoluto: aumentoAbsoluto,
                      tipo_exame: 'Ronco',
                    },
                  }
                );
              }
            }
          }
        }

        // 9.8: Verificar eficiência do sono < 75%
        if (examData.eficiencia_sono_pct !== null && examData.eficiencia_sono_pct < 75) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'critico',
            pacienteId,
            exameId
          );
          
          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'critico',
              pacienteId,
              exameId,
              {
                titulo: 'Eficiência do Sono Baixa',
                mensagem: `Eficiência do sono está abaixo do ideal (${examData.eficiencia_sono_pct.toFixed(1)}% < 75%) no exame realizado em ${examData.data_exame}. Pode indicar problemas de qualidade do sono.`,
                urgencia: examData.eficiencia_sono_pct < 60 ? 'alta' : 'media',
                dados_extras: {
                  eficiencia_sono_pct: examData.eficiencia_sono_pct,
                  tempo_sono_seg: examData.tempo_sono_seg,
                  tipo_exame: exam.type === EXAM_TYPE.RONCO ? 'Ronco' : 'Sono',
                },
              }
            );
          }
        }

        processed++;
        
        if (processed % 10 === 0) {
          console.log(`Processed ${processed}/${exams.length} exams...`);
        }
      } catch (error) {
        errors++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        errorDetails.push(`Exam ${exam.examId}: ${errorMsg}`);
        console.error(`Error processing exam ${exam.examId}:`, errorMsg);
      }
    }

    const summary = {
      success: true,
      total: exams.length,
      processed,
      created,
      updated,
      errors,
      errorDetails: errorDetails.slice(0, 10), // Limit error details
      timestamp: new Date().toISOString(),
    };

    console.log('Sync completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Sync failed:', errorMsg);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMsg,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

