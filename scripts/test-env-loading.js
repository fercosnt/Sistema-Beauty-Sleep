// Script de Validação - Verifica se as variáveis estão sendo carregadas do .env.local
// Execute: node scripts/test-env-loading.js

const fs = require('fs');
const path = require('path');

// Função para carregar variáveis do .env.local (mesma lógica dos scripts de teste)
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ Erro: Arquivo .env.local não encontrado!');
    return null;
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

console.log('🔍 Testando carregamento de variáveis do .env.local...\n');

const env = loadEnvFile();

if (!env) {
  process.exit(1);
}

console.log('📋 Variáveis encontradas:\n');

const requiredVars = [
  'BIOLOGIX_USERNAME',
  'BIOLOGIX_PASSWORD',
  'BIOLOGIX_SOURCE',
  'BIOLOGIX_PARTNER_ID'
];

let allOk = true;

requiredVars.forEach(varName => {
  const value = env[varName];
  const status = value ? '✅' : '❌';
  const displayValue = value ? 
    (varName === 'BIOLOGIX_PASSWORD' ? '***' + value.substring(value.length - 3) : value) : 
    'NÃO ENCONTRADO';
  
  console.log(`  ${status} ${varName}: ${displayValue}`);
  
  if (!value && varName !== 'BIOLOGIX_SOURCE') {
    allOk = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allOk) {
  console.log('✅ Todas as variáveis obrigatórias foram carregadas com sucesso!');
  console.log('✅ Os scripts estão prontos para uso.');
} else {
  console.log('❌ Algumas variáveis obrigatórias estão faltando.');
  console.log('   Configure-as no arquivo .env.local');
}

console.log('='.repeat(50) + '\n');

