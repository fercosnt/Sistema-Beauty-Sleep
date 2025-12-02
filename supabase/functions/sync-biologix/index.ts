import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { BiologixClient } from './biologix-client.ts';
import { ExamDto, EXAM_TYPE, EXAM_STATUS, IDO_CATEGORY } from './types.ts';

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
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
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
          .select('id, biologix_id, cpf')
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
            .select('id, biologix_id, cpf')
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

        // 3. Create new paciente if not found
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

        // Prepare exam data
        const examData: any = {
          paciente_id: pacienteId,
          biologix_exam_id: exam.examId,
          biologix_exam_key: exam.examKey,
          tipo: exam.type,
          status: exam.status,
          data_exame: exam.base?.startTime ? exam.base.startTime.split('T')[0] : new Date().toISOString().split('T')[0],
          peso_kg: exam.base?.weightKg || null,
          altura_cm: exam.base?.heightCm || null,
          // IMC will be calculated by trigger
          score_ronco: scoreRonco,
          ido: exam.result?.oximetry?.odi || null,
          ido_categoria: exam.result?.oximetry?.odiCategory ?? null,
          spo2_min: exam.result?.oximetry?.spO2Min || null,
          spo2_avg: exam.result?.oximetry?.spO2Avg || null,
          spo2_max: exam.result?.oximetry?.spO2Max || null,
        };

        // Upsert exam (unique by biologix_exam_id)
        const { data: existingExam } = await supabase
          .from('exames')
          .select('id')
          .eq('biologix_exam_id', exam.examId)
          .single();

        if (existingExam) {
          const { error: updateError } = await supabase
            .from('exames')
            .update(examData)
            .eq('id', existingExam.id);

          if (updateError) {
            throw new Error(`Failed to update exam: ${updateError.message}`);
          }
          updated++;
        } else {
          const { error: insertError } = await supabase
            .from('exames')
            .insert(examData);

          if (insertError) {
            throw new Error(`Failed to insert exam: ${insertError.message}`);
          }
          created++;
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

