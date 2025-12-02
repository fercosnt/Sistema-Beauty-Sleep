/**
 * Helper functions for E2E tests
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase environment variables not configured');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface TestUser {
  email: string;
  password: string;
  nome: string;
  role: 'admin' | 'equipe' | 'recepcao';
}

export const TEST_USERS: TestUser[] = [
  { email: 'admin@test.com', password: 'admin123', nome: 'Admin Test', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', nome: 'Equipe Test', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', nome: 'Recepcao Test', role: 'recepcao' }
];

/**
 * Ensure test users exist in Auth and users table
 * Creates them if they don't exist
 */
export async function ensureTestUsersExist(): Promise<void> {
  for (const user of TEST_USERS) {
    try {
      // Check if user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!existingUser) {
        // Create user in Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        });

        if (authError && !authError.message.includes('already registered')) {
          console.warn(`Failed to create user ${user.email} in Auth:`, authError.message);
          continue;
        }

        // Create user in users table
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            email: user.email,
            nome: user.nome,
            role: user.role,
            ativo: true
          });

        if (dbError && !dbError.message.includes('duplicate')) {
          console.warn(`Failed to create user ${user.email} in users table:`, dbError.message);
        }
      } else {
        // Update existing user to ensure correct role and active status
        await supabase
          .from('users')
          .update({ role: user.role, nome: user.nome, ativo: true })
          .eq('email', user.email);
      }
    } catch (error: any) {
      console.warn(`Error ensuring test user ${user.email}:`, error.message);
    }
  }
}

/**
 * Get user ID by email
 */
export async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();
  
  return data?.id || null;
}

/**
 * Clean up test data
 */
export async function cleanupTestData(pacienteIds: string[], sessaoIds: string[]): Promise<void> {
  // Delete sessions first (foreign key constraint)
  for (const sessaoId of sessaoIds) {
    if (sessaoId) {
      await supabase.from('sessoes').delete().eq('id', sessaoId);
    }
  }

  // Delete pacientes
  for (const pacienteId of pacienteIds) {
    if (pacienteId) {
      await supabase.from('pacientes').delete().eq('id', pacienteId);
    }
  }
}

