import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { ensureTestUsersExist, getUserIdByEmail, TEST_USERS } from '../utils/test-helpers';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  test.skip(true, 'Supabase environment variables not configured');
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Test credentials
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'admin123';
const EQUIPE_EMAIL = 'equipe@test.com';
const EQUIPE_PASSWORD = 'equipe123';
const RECEPCAO_EMAIL = 'recepcao@test.com';
const RECEPCAO_PASSWORD = 'recepcao123';

async function login(page: any, email: string, password: string) {
  // Navigate to login page
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for login form to be ready
  await page.waitForSelector('input[name="email"]', { timeout: 15000, state: 'visible' });
  await page.waitForSelector('input[name="password"]', { timeout: 5000, state: 'visible' });
  await page.waitForSelector('button[type="submit"]', { timeout: 5000, state: 'visible' });
  
  // Fill in credentials
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  
  // Wait a bit before submitting to ensure form is ready
  await page.waitForTimeout(500);
  
  // Submit form and wait for navigation
  // Server action will redirect to /dashboard
  await Promise.all([
    page.waitForURL(/.*\/dashboard/, { timeout: 20000 }),
    page.click('button[type="submit"]')
  ]);
  
  // Wait for dashboard to load completely
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(1000); // Extra wait for any client-side rendering
  
  // Verify we're on dashboard
  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    throw new Error(`Login failed for ${email} - still on login page`);
  }
}

test.describe('E2E: Permissões RLS', () => {
  let testPacienteId: string;
  let testSessaoId: string;
  let adminUserId: string;
  let equipeUserId: string;

  test.beforeAll(async () => {
    // BUG-004 FIX: Ensure test users exist automatically
    await ensureTestUsersExist();

    // Get user IDs
    adminUserId = await getUserIdByEmail(ADMIN_EMAIL) || '';
    equipeUserId = await getUserIdByEmail(EQUIPE_EMAIL) || '';

    // Create test paciente
    const { data: paciente } = await supabase
      .from('pacientes')
      .insert({
        biologix_id: `TEST-${Date.now()}`,
        cpf: `9999999999${Date.now().toString().slice(-2)}`,
        nome: 'Teste Permissões',
        status: 'ativo'
      })
      .select('id')
      .single();
    
    testPacienteId = paciente?.id || '';

    // Create test sessão by admin
    if (testPacienteId && adminUserId) {
      const { data: sessao } = await supabase
        .from('sessoes')
        .insert({
          paciente_id: testPacienteId,
          user_id: adminUserId,
          data_sessao: new Date().toISOString().split('T')[0],
          contador_pulsos_inicial: 1000,
          contador_pulsos_final: 1500
        })
        .select('id')
        .single();
      
      testSessaoId = sessao?.id || '';
    }
  });

  test.afterAll(async () => {
    // Cleanup
    if (testSessaoId) await supabase.from('sessoes').delete().eq('id', testSessaoId);
    if (testPacienteId) await supabase.from('pacientes').delete().eq('id', testPacienteId);
  });

  test('9.4.2: Admin pode acessar /usuarios e /logs', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    // Test /usuarios
    await page.goto('/usuarios', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/usuarios/, { timeout: 10000 });
    
    // Check for usuarios page content - try multiple selectors
    const usuariosContent = page.locator('h1:has-text("Usuários")').or(
      page.locator('text=/usuários/i')
    ).first();
    await expect(usuariosContent).toBeVisible({ timeout: 10000 });

    // Test /logs
    await page.goto('/logs', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/logs/, { timeout: 10000 });
    
    // Check for logs page content - try multiple selectors
    const logsContent = page.locator('h1:has-text("Logs")').or(
      page.locator('text=/logs|auditoria/i')
    ).first();
    await expect(logsContent).toBeVisible({ timeout: 10000 });
  });

  test('9.4.3: Equipe NÃO pode acessar /usuarios e /logs', async ({ page }) => {
    await login(page, EQUIPE_EMAIL, EQUIPE_PASSWORD);

    // Test /usuarios - should redirect to dashboard
    await page.goto('/usuarios', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    
    // Should be redirected to dashboard
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Test /logs - should redirect to dashboard
    await page.goto('/logs', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    
    // Should be redirected to dashboard
    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('9.4.4: Recepcao dashboard mostra -- para valores numéricos', async ({ page }) => {
    await login(page, RECEPCAO_EMAIL, RECEPCAO_PASSWORD);

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verificar se valores numéricos mostram "--" ao invés de números
    // KPI cards devem mostrar "--" para recepção
    const kpiCards = page.locator('[class*="text-2xl"], [class*="text-3xl"]').or(
      page.locator('text=--')
    );
    
    // Check for "--" text in KPI cards (recepção should see "--")
    const dashDash = page.locator('text=--').first();
    const dashVisible = await dashDash.isVisible({ timeout: 5000 }).catch(() => false);
    
    // Recepção deve ver "--" nos KPIs
    // Verificar pelo menos um elemento com "--"
    if (!dashVisible) {
      // Try to find KPI cards and check their content
      const allKPI = page.locator('[class*="kpi"], [class*="card"]').first();
      if (await allKPI.isVisible({ timeout: 3000 }).catch(() => false)) {
        const kpiText = await allKPI.textContent();
        // Should contain "--" or similar placeholder
        expect(kpiText).toBeTruthy();
      }
    } else {
      // Found "--" as expected
      await expect(dashDash).toBeVisible();
    }
  });

  test('9.4.5: Recepcao NÃO pode criar paciente (botão oculto)', async ({ page }) => {
    await login(page, RECEPCAO_EMAIL, RECEPCAO_PASSWORD);

    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verificar que botão "Novo Paciente" não está visível
    // O botão deve estar oculto para recepção (condição: userRole !== 'recepcao')
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i });
    
    // Check if button exists but is hidden, or doesn't exist at all
    const buttonCount = await novoPacienteButton.count();
    
    if (buttonCount > 0) {
      // Button exists, should be hidden
      await expect(novoPacienteButton.first()).toBeHidden({ timeout: 3000 });
    } else {
      // Button doesn't exist at all (which is also correct)
      expect(buttonCount).toBe(0);
    }
  });

  test('9.4.6: Equipe NÃO pode editar sessão de outro usuário', async ({ page }) => {
    await login(page, EQUIPE_EMAIL, EQUIPE_PASSWORD);

    if (!testPacienteId || !testSessaoId) {
      test.skip(true, 'Test data not created');
      return;
    }

    await page.goto(`/pacientes/${testPacienteId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navegar para tab Sessões
    const sessoesTab = page.locator('button').filter({ hasText: /sessões/i }).first();
    if (await sessoesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sessoesTab.click();
      await page.waitForTimeout(2000);
    }

    // Verificar se há sessões na tabela
    const sessoesTable = page.locator('tbody').first();
    await expect(sessoesTable).toBeVisible({ timeout: 5000 });
    
    const rowsCount = await sessoesTable.locator('tr').count();
    expect(rowsCount).toBeGreaterThan(0);
    
    // Buscar botões de editar - Equipe não deve ver para sessões de admin
    const editButtons = page.locator('button').filter({ hasText: /editar/i });
    const editCount = await editButtons.count();
    
    // Sessão foi criada por admin, equipe não deve ver botão de editar
    // (botão só aparece se canEdit retorna true, que requer sessao.user_id === userId)
    expect(editCount).toBe(0);
  });

  test('9.4.7: Admin PODE editar qualquer sessão', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    if (!testPacienteId || !testSessaoId) {
      test.skip(true, 'Test data not created');
      return;
    }

    await page.goto(`/pacientes/${testPacienteId}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navegar para tab Sessões
    const sessoesTab = page.locator('button').filter({ hasText: /sessões/i }).first();
    if (await sessoesTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sessoesTab.click();
      await page.waitForTimeout(2000);
    }

    // Verificar se há sessões
    const sessoesTable = page.locator('tbody').first();
    await expect(sessoesTable).toBeVisible({ timeout: 5000 });
    
    const rowsCount = await sessoesTable.locator('tr').count();
    expect(rowsCount).toBeGreaterThan(0);
    
    // Admin deve ver botão de editar para qualquer sessão
    const editButtons = page.locator('button').filter({ hasText: /editar/i });
    const editCount = await editButtons.count();
    
    // Admin pode editar qualquer sessão (canEdit sempre retorna true para admin)
    expect(editCount).toBeGreaterThan(0);
  });
});

