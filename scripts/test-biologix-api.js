// Script de Teste da API Biologix (Node.js)
// Execute: node scripts/test-biologix-api.js
// 
// ⚠️ IMPORTANTE: Configure as variáveis no arquivo .env.local na raiz do projeto

const https = require('https');
const fs = require('fs');
const path = require('path');

// Função para carregar variáveis do .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Erro: Arquivo .env.local não encontrado!');
    console.error('   Crie o arquivo .env.local na raiz do projeto com as seguintes variáveis:');
    console.error('   BIOLOGIX_USERNAME=seu_username');
    console.error('   BIOLOGIX_PASSWORD=sua_senha');
    console.error('   BIOLOGIX_SOURCE=100');
    console.error('   BIOLOGIX_PARTNER_ID=seu_partner_id');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const equalIndex = line.indexOf('=');
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim();
        const value = line.substring(equalIndex + 1).trim();
        // Remover aspas se existirem
        env[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  });
  
  return env;
}

// Carregar variáveis de ambiente
const env = loadEnvFile();

// Configuracao - Valores do .env.local
const BIOLOGIX_USERNAME = env.BIOLOGIX_USERNAME;
const BIOLOGIX_PASSWORD = env.BIOLOGIX_PASSWORD;
const BIOLOGIX_SOURCE = parseInt(env.BIOLOGIX_SOURCE || '100');
const BIOLOGIX_PARTNER_ID = env.BIOLOGIX_PARTNER_ID;
const BIOLOGIX_BASE_URL = 'api.biologixsleep.com';

// Validar variáveis obrigatórias
if (!BIOLOGIX_USERNAME || !BIOLOGIX_PASSWORD || !BIOLOGIX_PARTNER_ID) {
  console.error('❌ Erro: Variáveis obrigatórias não encontradas no .env.local!');
  console.error('   Verifique se as seguintes variáveis estão configuradas:');
  console.error('   - BIOLOGIX_USERNAME');
  console.error('   - BIOLOGIX_PASSWORD');
  console.error('   - BIOLOGIX_PARTNER_ID');
  process.exit(1);
}

console.log('=== Teste da API Biologix ===\n');

// Funcao auxiliar para fazer requisições HTTPS
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testBiologixAPI() {
  try {
    // 1. Abrir Sessao
    console.log('[1] Abrindo sessao...');
    
    const authString = `${BIOLOGIX_USERNAME}:${BIOLOGIX_PASSWORD}`;
    const authBase64 = Buffer.from(authString).toString('base64');
    
    const sessionData = {
      username: BIOLOGIX_USERNAME,
      password: BIOLOGIX_PASSWORD,
      source: BIOLOGIX_SOURCE
    };
    
    const sessionResponse = await makeRequest({
      hostname: BIOLOGIX_BASE_URL,
      path: '/v2/sessions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `basic ${authBase64}`
      }
    }, sessionData);
    
    if (sessionResponse.statusCode === 200) {
      console.log('[OK] Sessao aberta com sucesso!');
      console.log(`  UserId: ${sessionResponse.data.userId}`);
      console.log(`  SessionId: ${sessionResponse.data.sessionId}`);
      console.log(`  CenterId: ${sessionResponse.data.centerId}`);
    } else {
      console.error(`[ERRO] Falha ao abrir sessao (HTTP ${sessionResponse.statusCode})`);
      console.error('Resposta:', sessionResponse.data);
      process.exit(1);
    }
    
    console.log('');
    
    // 2. Buscar Exames
    console.log('[2] Buscando exames...');
    
    const offset = 0;
    const limit = 10;  // Limite para teste
    
    const examsResponse = await makeRequest({
      hostname: BIOLOGIX_BASE_URL,
      path: `/v2/partners/${BIOLOGIX_PARTNER_ID}/exams?offset=${offset}&limit=${limit}`,
      method: 'GET',
      headers: {
        'Authorization': `basic ${authBase64}`
      }
    });
    
    if (examsResponse.statusCode === 200) {
      console.log('[OK] Exames recuperados com sucesso!');
      console.log(`  Total de exames: ${examsResponse.data.total}`);
      console.log(`  Exames retornados: ${examsResponse.data.items.length}`);
      
      if (examsResponse.data.items.length > 0) {
        console.log('');
        console.log('Primeiros exames:');
        examsResponse.data.items.slice(0, 3).forEach(exam => {
          console.log(`  - ID: ${exam.id} | Tipo: ${exam.type} | Status: ${exam.status} | Data: ${exam.examDate}`);
        });
      }
    } else {
      console.error(`[ERRO] Falha ao buscar exames (HTTP ${examsResponse.statusCode})`);
      console.error('Resposta:', examsResponse.data);
      process.exit(1);
    }
    
    console.log('');
    console.log('=== Teste Concluido ===');
    
  } catch (error) {
    console.error('[ERRO] Erro durante o teste:', error.message);
    process.exit(1);
  }
}

testBiologixAPI();

