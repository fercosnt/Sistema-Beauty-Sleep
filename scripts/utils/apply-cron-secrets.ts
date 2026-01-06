/**
 * Script para aplicar secrets do cron job usando variáveis do .env.local via MCP
 * 
 * Este script lê as variáveis de ambiente do .env.local e executa
 * os comandos SQL diretamente no Supabase usando MCP.
 * 
 * Uso:
 *   tsx scripts/apply-cron-secrets.ts
 * 
 * Requer variáveis no .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');

if (!existsSync(envPath)) {
  console.error('❌ Arquivo .env.local não encontrado!');
  console.log('\n📝 Crie o arquivo .env.local com:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui');
  process.exit(1);
}

dotenv.config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrado no .env.local');
  process.exit(1);
}

if (!anonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado no .env.local');
  process.exit(1);
}

console.log('🔐 Aplicando secrets do cron job usando variáveis do .env.local...\n');
console.log(`📝 Project URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`📝 Anon Key: ${anonKey.substring(0, 20)}...\n`);

// SQL commands with actual values from .env.local
const sqlCommands = [
  `SELECT vault.create_secret('${supabaseUrl}', 'project_url');`,
  `SELECT vault.create_secret('${anonKey}', 'anon_key');`
];

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📋 Execute os seguintes comandos SQL no Supabase Dashboard SQL Editor:\n');
console.log('   https://supabase.com/dashboard/project/[seu-project-id]/sql/new\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

sqlCommands.forEach((cmd, index) => {
  console.log(`${index + 1}. ${cmd}\n`);
});

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Os comandos acima já contêm os valores do seu .env.local\n');
console.log('   Copie e cole diretamente no SQL Editor do Supabase Dashboard\n');
console.log('📖 Para mais informações, consulte: SETUP_CRON_SECRETS.md\n');
