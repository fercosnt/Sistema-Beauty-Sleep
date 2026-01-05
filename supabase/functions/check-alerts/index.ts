import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { criarAlertaCritico, existeAlertaPendente } from '../sync-biologix/alertas.ts';

/**
 * Edge Function para verificar e criar alertas de manutenção e follow-up
 * Executa verificações periódicas e cria alertas quando necessário
 */
Deno.serve(async (req: Request) => {
  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0]; // YYYY-MM-DD
    const hojeMenos7 = new Date(hoje);
    hojeMenos7.setDate(hoje.getDate() - 7);
    const hojeMenos7Str = hojeMenos7.toISOString().split('T')[0];
    const hojeMenos30 = new Date(hoje);
    hojeMenos30.setDate(hoje.getDate() - 30);
    const hojeMenos30Str = hojeMenos30.toISOString().split('T')[0];
    const hojeMenos3 = new Date(hoje);
    hojeMenos3.setDate(hoje.getDate() - 3);
    const hojeMenos3Str = hojeMenos3.toISOString().split('T')[0];
    const hojeMais7 = new Date(hoje);
    hojeMais7.setDate(hoje.getDate() + 7);
    const hojeMais7Str = hojeMais7.toISOString().split('T')[0];
    const seisMesesAtras = new Date(hoje);
    seisMesesAtras.setMonth(hoje.getMonth() - 6);
    const seisMesesAtrasStr = seisMesesAtras.toISOString().split('T')[0];

    let alertasCriados = 0;
    const erros: string[] = [];

    console.log('🔍 Iniciando verificação de alertas de manutenção e follow-up...');

    // ============================================
    // 10.3: Manutenção em 7 dias
    // ============================================
    try {
      const { data: manutencoes7dias, error } = await supabase
        .from('pacientes')
        .select('id, nome, proxima_manutencao')
        .eq('status', 'ativo')
        .not('proxima_manutencao', 'is', null)
        .gte('proxima_manutencao', hojeStr)
        .lte('proxima_manutencao', hojeMais7Str);

      if (error) {
        throw error;
      }

      if (manutencoes7dias && manutencoes7dias.length > 0) {
        for (const paciente of manutencoes7dias) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'manutencao',
            paciente.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'manutencao',
              paciente.id,
              undefined,
              {
                titulo: 'Manutenção Prevista em 7 Dias',
                mensagem: `Paciente ${paciente.nome} tem manutenção prevista para ${paciente.proxima_manutencao}. Preparar agendamento.`,
                urgencia: 'media',
                dados_extras: {
                  tipo_verificacao: 'manutencao_7_dias',
                  proxima_manutencao: paciente.proxima_manutencao,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação 7 dias: ${manutencoes7dias.length} pacientes encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de manutenção em 7 dias: ${errorMsg}`);
      console.error('❌ Erro na verificação de manutenção em 7 dias:', errorMsg);
    }

    // ============================================
    // 10.4: Manutenção atrasada
    // ============================================
    try {
      const { data: manutencoesAtrasadas, error } = await supabase
        .from('pacientes')
        .select('id, nome, proxima_manutencao')
        .eq('status', 'ativo')
        .not('proxima_manutencao', 'is', null)
        .lt('proxima_manutencao', hojeStr)
        .gte('proxima_manutencao', hojeMenos30Str);

      if (error) {
        throw error;
      }

      if (manutencoesAtrasadas && manutencoesAtrasadas.length > 0) {
        for (const paciente of manutencoesAtrasadas) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'manutencao',
            paciente.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'manutencao',
              paciente.id,
              undefined,
              {
                titulo: 'Manutenção Atrasada',
                mensagem: `Paciente ${paciente.nome} tem manutenção atrasada desde ${paciente.proxima_manutencao}. Contatar urgentemente.`,
                urgencia: 'alta',
                dados_extras: {
                  tipo_verificacao: 'manutencao_atrasada',
                  proxima_manutencao: paciente.proxima_manutencao,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação atrasada: ${manutencoesAtrasadas.length} pacientes encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de manutenção atrasada: ${errorMsg}`);
      console.error('❌ Erro na verificação de manutenção atrasada:', errorMsg);
    }

    // ============================================
    // 10.5: Manutenção muito atrasada (> 30 dias)
    // ============================================
    try {
      const { data: manutencoesMuitoAtrasadas, error } = await supabase
        .from('pacientes')
        .select('id, nome, proxima_manutencao')
        .eq('status', 'ativo')
        .not('proxima_manutencao', 'is', null)
        .lt('proxima_manutencao', hojeMenos30Str);

      if (error) {
        throw error;
      }

      if (manutencoesMuitoAtrasadas && manutencoesMuitoAtrasadas.length > 0) {
        for (const paciente of manutencoesMuitoAtrasadas) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'manutencao',
            paciente.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'manutencao',
              paciente.id,
              undefined,
              {
                titulo: 'Manutenção Muito Atrasada',
                mensagem: `Paciente ${paciente.nome} tem manutenção muito atrasada (desde ${paciente.proxima_manutencao}, mais de 30 dias). Ação imediata necessária.`,
                urgencia: 'alta',
                dados_extras: {
                  tipo_verificacao: 'manutencao_muito_atrasada',
                  proxima_manutencao: paciente.proxima_manutencao,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação muito atrasada: ${manutencoesMuitoAtrasadas.length} pacientes encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de manutenção muito atrasada: ${errorMsg}`);
      console.error('❌ Erro na verificação de manutenção muito atrasada:', errorMsg);
    }

    // ============================================
    // 10.6: Manutenção 6 meses após finalizado
    // ============================================
    try {
      const { data: pacientesFinalizados, error } = await supabase
        .from('pacientes')
        .select('id, nome, updated_at')
        .eq('status', 'finalizado')
        .lte('updated_at', seisMesesAtrasStr);

      if (error) {
        throw error;
      }

      if (pacientesFinalizados && pacientesFinalizados.length > 0) {
        for (const paciente of pacientesFinalizados) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'followup',
            paciente.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'followup',
              paciente.id,
              undefined,
              {
                titulo: 'Follow-up Após 6 Meses',
                mensagem: `Paciente ${paciente.nome} finalizou tratamento há mais de 6 meses. Considerar contato para follow-up.`,
                urgencia: 'baixa',
                dados_extras: {
                  tipo_verificacao: 'followup_6_meses',
                  data_finalizado: paciente.updated_at,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação 6 meses: ${pacientesFinalizados.length} pacientes encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de follow-up 6 meses: ${errorMsg}`);
      console.error('❌ Erro na verificação de follow-up 6 meses:', errorMsg);
    }

    // ============================================
    // 10.7: Lead sem contato (> 3 dias)
    // ============================================
    try {
      const { data: leadsSemContato, error } = await supabase
        .from('pacientes')
        .select('id, nome, created_at')
        .eq('status', 'lead')
        .lte('created_at', hojeMenos3Str);

      if (error) {
        throw error;
      }

      if (leadsSemContato && leadsSemContato.length > 0) {
        for (const lead of leadsSemContato) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'followup',
            lead.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'followup',
              lead.id,
              undefined,
              {
                titulo: 'Lead Sem Contato',
                mensagem: `Lead ${lead.nome} foi criado há mais de 3 dias sem contato. Realizar follow-up para conversão.`,
                urgencia: 'media',
                dados_extras: {
                  tipo_verificacao: 'lead_sem_contato',
                  data_criacao: lead.created_at,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação leads: ${leadsSemContato.length} leads encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de leads sem contato: ${errorMsg}`);
      console.error('❌ Erro na verificação de leads sem contato:', errorMsg);
    }

    // ============================================
    // 10.8: Paciente sem sessão (ativo, 0 sessões, > 7 dias)
    // ============================================
    try {
      const { data: pacientesSemSessao, error } = await supabase
        .from('pacientes')
        .select('id, nome, created_at, sessoes_utilizadas')
        .eq('status', 'ativo')
        .eq('sessoes_utilizadas', 0)
        .lte('created_at', hojeMenos7Str);

      if (error) {
        throw error;
      }

      if (pacientesSemSessao && pacientesSemSessao.length > 0) {
        for (const paciente of pacientesSemSessao) {
          const jaExiste = await existeAlertaPendente(
            supabase,
            'followup',
            paciente.id,
            undefined
          );

          if (!jaExiste) {
            await criarAlertaCritico(
              supabase,
              'followup',
              paciente.id,
              undefined,
              {
                titulo: 'Paciente Sem Sessão',
                mensagem: `Paciente ${paciente.nome} está ativo há mais de 7 dias mas ainda não realizou nenhuma sessão. Verificar situação.`,
                urgencia: 'media',
                dados_extras: {
                  tipo_verificacao: 'paciente_sem_sessao',
                  data_criacao: paciente.created_at,
                  sessoes_utilizadas: paciente.sessoes_utilizadas,
                },
              }
            );
            alertasCriados++;
          }
        }
        console.log(`✅ Verificação sem sessão: ${pacientesSemSessao.length} pacientes encontrados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de pacientes sem sessão: ${errorMsg}`);
      console.error('❌ Erro na verificação de pacientes sem sessão:', errorMsg);
    }

    // ============================================
    // 10.9: Não resposta ao tratamento (5+ sessões, <20% melhora)
    // ============================================
    try {
      // Buscar pacientes ativos com 5+ sessões
      const { data: pacientesComSessoes, error: errorPacientes } = await supabase
        .from('pacientes')
        .select('id, nome, sessoes_utilizadas')
        .eq('status', 'ativo')
        .gte('sessoes_utilizadas', 5);

      if (errorPacientes) {
        throw errorPacientes;
      }

      if (pacientesComSessoes && pacientesComSessoes.length > 0) {
        for (const paciente of pacientesComSessoes) {
          // Buscar primeiro e último exame do paciente
          const { data: exames, error: errorExames } = await supabase
            .from('exames')
            .select('ido, score_ronco, data_exame')
            .eq('paciente_id', paciente.id)
            .not('ido', 'is', null)
            .order('data_exame', { ascending: true });

          if (errorExames) {
            continue; // Pular se houver erro
          }

          if (exames && exames.length >= 2) {
            const primeiroExame = exames[0];
            const ultimoExame = exames[exames.length - 1];

            // Calcular melhora de IDO (menor é melhor)
            if (primeiroExame.ido && ultimoExame.ido) {
              const idoInicial = parseFloat(primeiroExame.ido);
              const idoFinal = parseFloat(ultimoExame.ido);
              const melhoraPercentual = ((idoInicial - idoFinal) / idoInicial) * 100;

              // Se melhora < 20%, criar alerta
              if (melhoraPercentual < 20) {
                const jaExiste = await existeAlertaPendente(
                  supabase,
                  'followup',
                  paciente.id,
                  undefined
                );

                if (!jaExiste) {
                  await criarAlertaCritico(
                    supabase,
                    'followup',
                    paciente.id,
                    undefined,
                    {
                      titulo: 'Baixa Resposta ao Tratamento',
                      mensagem: `Paciente ${paciente.nome} realizou ${paciente.sessoes_utilizadas} sessões mas apresentou apenas ${melhoraPercentual.toFixed(1)}% de melhora no IDO (de ${idoInicial.toFixed(1)} para ${idoFinal.toFixed(1)}). Avaliar necessidade de ajuste no tratamento.`,
                      urgencia: 'media',
                      dados_extras: {
                        tipo_verificacao: 'nao_resposta_tratamento',
                        sessoes_utilizadas: paciente.sessoes_utilizadas,
                        ido_inicial: idoInicial,
                        ido_final: idoFinal,
                        melhora_percentual: melhoraPercentual,
                      },
                    }
                  );
                  alertasCriados++;
                }
              }
            }
          }
        }
        console.log(`✅ Verificação não resposta: ${pacientesComSessoes.length} pacientes verificados`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      erros.push(`Erro na verificação de não resposta ao tratamento: ${errorMsg}`);
      console.error('❌ Erro na verificação de não resposta ao tratamento:', errorMsg);
    }

    const summary = {
      success: true,
      alertasCriados,
      erros: erros.length > 0 ? erros : undefined,
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Verificação concluída:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('❌ Verificação falhou:', errorMsg);

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

