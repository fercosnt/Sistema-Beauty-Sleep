/**
 * Script para gerar comandos SQL para configurar secrets do cron job
 * 
 * Este script lê as variáveis de ambiente do .env.local e gera
 * os comandos SQL que você precisa executar no SQL Editor do Supabase.
 * 
 * Uso:
 *   tsx scripts/setup-cron-secrets.ts
 * 
 * Requer variáveis no .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 
 * IMPORTANTE: Este script apenas gera os comandos SQL.
 * Você precisa executá-los manualmente no SQL Editor do Supabase Dashboard.
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';

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

console.log('🔐 Comandos SQL para configurar secrets do cron job\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📋 Execute os seguintes comandos no SQL Editor do Supabase Dashboard:\n');
console.log('   https://supabase.com/dashboard/project/[seu-project-id]/sql/new\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('-- Configurar project_url');
console.log(`SELECT vault.create_secret('${supabaseUrl}', 'project_url');\n`);

console.log('-- Configurar anon_key');
console.log(`SELECT vault.create_secret('${anonKey}', 'anon_key');\n`);

// Generate SQL file with actual values for easy copy-paste
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('💡 Dica: Os comandos acima já contêm os valores do seu .env.local\n');
console.log('   Copie e cole diretamente no SQL Editor do Supabase Dashboard\n');

console.log('-- Verificar se os secrets foram criados');
console.log(`SELECT name FROM vault.decrypted_secrets WHERE name IN ('project_url', 'anon_key');\n`);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Após executar os comandos acima, o cron job estará configurado!\n');
console.log('📖 Para mais informações, consulte: SETUP_CRON_SECRETS.md\n');

