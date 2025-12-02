/**
 * Script para testar a conexão com a API Biologix
 * Verifica autenticação, busca de exames e estrutura dos dados
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const biologixUsername = process.env.BIOLOGIX_USERNAME!;
const biologixPassword = process.env.BIOLOGIX_PASSWORD!;
const biologixSource = parseInt(process.env.BIOLOGIX_SOURCE || '100');
const biologixPartnerId = process.env.BIOLOGIX_PARTNER_ID!;

interface SessionResponse {
  sessionId: string;
  userId: string;
  tokenStart: string;
  mfaVerified: boolean;
}

interface ExamDto {
  examId: string;
  examKey: string;
  status: number;
  type: number;
  patientUserId: string; // Este é o biologix_id do paciente!
  patient: {
    name: string;
    gender: string;
    email: string;
    phone: string;
    birthDate: string;
    age: number;
    username: string; // CPF está aqui
  };
  base?: {
    startTime: string;
    weightKg?: number;
    heightCm?: number;
  };
  result?: {
    snoring?: any;
    oximetry?: any;
  };
}

async function testBiologixConnection() {
  console.log('🔍 Testando conexão com API Biologix...\n');
  
  // Criar cliente Supabase logo no início (para uso em todo o script)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // Verificar variáveis de ambiente
  console.log('📋 Verificando variáveis de ambiente...');
  const requiredVars = {
    SUPABASE_URL: supabaseUrl,
    BIOLOGIX_USERNAME: biologixUsername,
    BIOLOGIX_PASSWORD: biologixPassword ? '***SET***' : 'NOT SET',
    BIOLOGIX_SOURCE: biologixSource,
    BIOLOGIX_PARTNER_ID: biologixPartnerId,
  };
  
  console.table(requiredVars);
  
  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value || value === 'NOT SET')
    .map(([key]) => key);
    
  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:', missing.join(', '));
    process.exit(1);
  }
  
  console.log('✅ Todas as variáveis de ambiente estão configuradas\n');
  
  // 1. Testar autenticação
  console.log('🔐 Testando autenticação...');
  try {
    const authResponse = await fetch('https://api.biologixsleep.com/v2/sessions/open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: biologixUsername,
        password: biologixPassword,
        source: biologixSource,
      }),
    });
    
    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      throw new Error(`Falha na autenticação: ${authResponse.status} ${errorText}`);
    }
    
    const sessionData: SessionResponse = await authResponse.json();
    const token = authResponse.headers.get('bx-session-token') || 
                  authResponse.headers.get('Bx-Session-Token') ||
                  authResponse.headers.get('BX-Session-Token');
    
    if (!token) {
      throw new Error('Token não encontrado nos headers da resposta');
    }
    
    console.log('✅ Autenticação bem-sucedida!');
    console.log(`   - Session ID: ${sessionData.sessionId}`);
    console.log(`   - User ID: ${sessionData.userId}`);
    console.log(`   - Token: ${token.substring(0, 20)}...`);
    console.log(`   - Token Start: ${sessionData.tokenStart}\n`);
    
    // 2. Testar busca de exames
    console.log('📊 Testando busca de exames...');
    const credentials = `${sessionData.userId}:${token}`;
    const base64Auth = Buffer.from(credentials).toString('base64');
    
    const examsResponse = await fetch(
      `https://api.biologixsleep.com/v2/partners/${biologixPartnerId}/exams?offset=0&limit=5`,
      {
        headers: {
          'Authorization': `basic ${base64Auth}`,
        },
      }
    );
    
    if (!examsResponse.ok) {
      const errorText = await examsResponse.text();
      throw new Error(`Falha ao buscar exames: ${examsResponse.status} ${errorText}`);
    }
    
    const exams: ExamDto[] = await examsResponse.json();
    const total = parseInt(examsResponse.headers.get('X-Pagination-Total') || '0');
    
    console.log('✅ Busca de exames bem-sucedida!');
    console.log(`   - Total de exames na API: ${total}`);
    console.log(`   - Exames retornados: ${exams.length}`);
    console.log(`   - Exames com status DONE (6): ${exams.filter(e => e.status === 6).length}\n`);
    
    // 3. Analisar estrutura dos exames
    console.log('🔬 Analisando estrutura dos exames...');
    if (exams.length > 0) {
      const exam = exams[0];
      console.log('📝 Estrutura do primeiro exame:');
      console.log(`   - Exam ID: ${exam.examId}`);
      console.log(`   - Exam Key: ${exam.examKey}`);
      console.log(`   - Status: ${exam.status}`);
      console.log(`   - Type: ${exam.type} (${exam.type === 0 ? 'Ronco' : 'Sono'})`);
      console.log(`   - Patient User ID: ${exam.patientUserId} ⭐ (este é o biologix_id!)`);
      console.log(`   - Patient Name: ${exam.patient.name}`);
      console.log(`   - Patient Username: ${exam.patient.username} (contém CPF)`);
      console.log(`   - Patient Email: ${exam.patient.email || 'N/A'}`);
      console.log(`   - Patient Phone: ${exam.patient.phone || 'N/A'}`);
      
      // Extrair CPF do username
      const cpfMatch = exam.patient.username.match(/\d{11}/);
      const cpf = cpfMatch ? cpfMatch[0] : exam.patient.username.replace(/\D/g, '');
      console.log(`   - CPF extraído: ${cpf.length === 11 ? cpf : 'NÃO ENCONTRADO'}\n`);
      
      // Verificar no banco se existe paciente com esse biologix_id
      console.log('🔍 Verificando no banco de dados...');
      
      // Buscar por biologix_id
      const { data: pacienteById } = await supabase
        .from('pacientes')
        .select('id, biologix_id, cpf, nome')
        .eq('biologix_id', exam.patientUserId)
        .single();
      
      if (pacienteById) {
        console.log(`✅ Paciente encontrado por biologix_id: ${pacienteById.nome}`);
        console.log(`   - ID: ${pacienteById.id}`);
        console.log(`   - Biologix ID: ${pacienteById.biologix_id}`);
        console.log(`   - CPF: ${pacienteById.cpf || 'N/A'}\n`);
      } else {
        console.log(`⚠️  Paciente NÃO encontrado por biologix_id: ${exam.patientUserId}`);
        
        // Tentar buscar por CPF
        if (cpf.length === 11) {
          const { data: pacienteByCpf } = await supabase
            .from('pacientes')
            .select('id, biologix_id, cpf, nome')
            .eq('cpf', cpf)
            .single();
          
          if (pacienteByCpf) {
            console.log(`   ⚠️  Mas encontrado por CPF: ${pacienteByCpf.nome}`);
            console.log(`   - Biologix ID atual: ${pacienteByCpf.biologix_id || 'NULL'}`);
            console.log(`   - ⚠️  PROBLEMA: Paciente tem CPF mas não tem biologix_id correto!\n`);
          } else {
            console.log(`   - Paciente também não encontrado por CPF\n`);
          }
        }
      }
      
      // Verificar se exame já existe
      const { data: exameExistente } = await supabase
        .from('exames')
        .select('id, biologix_exam_id, data_exame, paciente_id')
        .eq('biologix_exam_id', exam.examId)
        .single();
      
      if (exameExistente) {
        console.log(`✅ Exame já existe no banco: ${exameExistente.biologix_exam_id}`);
        console.log(`   - Data: ${exameExistente.data_exame}`);
        console.log(`   - Paciente ID: ${exameExistente.paciente_id}\n`);
      } else {
        console.log(`⚠️  Exame NÃO existe no banco: ${exam.examId}\n`);
      }
    }
    
    // 4. Estatísticas do banco
    console.log('📊 Estatísticas do banco de dados...');
    const { data: stats } = await supabase.rpc('get_stats').catch(() => null);
    
    const { count: totalPacientes } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true });
    
    const { count: totalExames } = await supabase
      .from('exames')
      .select('*', { count: 'exact', head: true });
    
    const { count: examesRecent } = await supabase
      .from('exames')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    console.log(`   - Total de pacientes: ${totalPacientes}`);
    console.log(`   - Total de exames: ${totalExames}`);
    console.log(`   - Exames dos últimos 7 dias: ${examesRecent}\n`);
    
    // 5. Verificar problemas conhecidos
    console.log('🔍 Verificando problemas conhecidos...');
    
    // Pacientes sem biologix_id
    const { count: pacientesSemBiologixId } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true })
      .is('biologix_id', null);
    
    if (pacientesSemBiologixId && pacientesSemBiologixId > 0) {
      console.log(`   ⚠️  ${pacientesSemBiologixId} pacientes sem biologix_id`);
    } else {
      console.log(`   ✅ Todos os pacientes têm biologix_id`);
    }
    
    // Exames sem paciente vinculado
    const { count: examesSemPaciente } = await supabase
      .from('exames')
      .select('*', { count: 'exact', head: true })
      .is('paciente_id', null);
    
    if (examesSemPaciente && examesSemPaciente > 0) {
      console.log(`   ⚠️  ${examesSemPaciente} exames sem paciente vinculado`);
    } else {
      console.log(`   ✅ Todos os exames têm paciente vinculado`);
    }
    
    console.log('\n✅ Teste completo!');
    
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error);
    if (error instanceof Error) {
      console.error('   Mensagem:', error.message);
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Executar teste
testBiologixConnection();

