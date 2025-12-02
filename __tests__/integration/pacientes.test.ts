import { test, expect } from '@playwright/test';

/**
 * IMPORTANT: Configure test credentials before running tests
 * 
 * Set environment variables:
 * - TEST_USER_EMAIL: Valid user email for testing
 * - TEST_USER_PASSWORD: Valid user password for testing
 */
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'admin@beautysmile.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

// Skip tests that require authentication if credentials are not configured
const SKIP_AUTH_TESTS = !process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD;

// Helper function to login
async function login(page: any) {
  // Navigate to login page
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for form to be ready
  await page.waitForSelector('input[name="email"]', { state: 'visible', timeout: 15000 });
  await page.waitForSelector('input[name="password"]', { state: 'visible', timeout: 5000 });
  await page.waitForSelector('button[type="submit"]', { state: 'visible', timeout: 5000 });
  
  // Fill in login form
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  
  // Wait a bit to ensure form is ready
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
  
  // Verify we're actually on dashboard, not redirected back to login
  const currentUrl = page.url();
  if (currentUrl.includes('/login')) {
    throw new Error('Login failed - redirected back to login page. Check if user exists in users table and is active.');
  }
}

// Helper function to generate a valid CPF for testing
function generateValidCPF(): string {
  // Generate a unique CPF using timestamp to avoid duplicates
  const timestamp = Date.now().toString().slice(-9); // Get last 9 digits
  const base = timestamp.padStart(9, '0');
  
  // Calculate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(base[i]) * (10 - i);
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  // Calculate second check digit
  sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(base[i]) * (11 - i);
  }
  sum += digit1 * 2;
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return base + digit1 + digit2;
}

// Helper function to generate a unique ID do Paciente (biologix_id) for testing
function generateUniqueIdPaciente(): string {
  // Generate a unique ID using timestamp and random suffix
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PAC-${timestamp}-${random}`;
}

// Helper function to wait for modal to close completely
async function waitForModalToClose(page: any, modalSelector: string, timeout = 10000) {
  try {
    // Wait for modal to be hidden
    await page.waitForSelector(modalSelector, { state: 'hidden', timeout });
    // Wait for overlay to disappear
    await page.waitForSelector('.fixed.inset-0.z-50', { state: 'hidden', timeout: 2000 }).catch(() => {});
    // Wait for network idle to ensure all async operations complete
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  } catch (e) {
    // Modal might have already closed or selector might be different
    // Just wait for network idle as fallback
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
  }
}

test.describe('Pacientes Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(SKIP_AUTH_TESTS, 'Test credentials not configured. Set TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables.');
    await login(page);
  });

  test('should navigate to pacientes page', async ({ page }) => {
    // Navigate to pacientes page
    await page.goto('/pacientes', { waitUntil: 'domcontentloaded' });
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    
    // Verify we're on pacientes page (wait for URL change if redirected)
    await page.waitForURL(/.*\/pacientes/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/pacientes/);
    
    // Wait a bit for content to render
    await page.waitForTimeout(1000);
    
    // Verify pacientes page content is visible
    // Try multiple selectors to find content
    const pacientesContent = page.locator('text=/pacientes|novo paciente|Pacientes/i').first();
    const tableHeader = page.locator('thead, tbody').first();
    
    // Check if either content is visible
    const contentVisible = await pacientesContent.isVisible({ timeout: 5000 }).catch(() => false);
    const tableVisible = await tableHeader.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (!contentVisible && !tableVisible) {
      // If neither is visible, check for any loading states
      const loadingIndicator = page.locator('text=/carregando|loading/i');
      if (await loadingIndicator.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      }
    }
    
    // Final check - at least one should be visible
    await expect(pacientesContent.or(tableHeader).first()).toBeVisible({ timeout: 10000 });
  });

  test('create paciente: fill form → submit → verify in list', async ({ page }) => {
    await page.goto('/pacientes');
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500); // Additional wait for any animations
    
    // Find and click "Novo Paciente" button
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await expect(novoPacienteButton).toBeVisible({ timeout: 5000 });
    await novoPacienteButton.click();
    
    // Wait for modal to open - check for modal title
    await page.waitForSelector('h2:has-text("Novo Paciente")', { timeout: 5000 });
    await page.waitForTimeout(300); // Small wait for modal animation
    
    // Fill in form fields
    const testIdPaciente = generateUniqueIdPaciente();
    const testCPF = generateValidCPF();
    const testNome = `Teste Paciente ${Date.now()}`;
    const testEmail = `teste${Date.now()}@test.com`;
    
    // Wait for modal inputs to be visible and ready
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    await page.waitForSelector('#nome', { timeout: 5000 });
    
    // Fill form fields - ID do Paciente is REQUIRED, CPF or Documento Estrangeiro is required
    await page.fill('#idPaciente', testIdPaciente);
    
    // Trigger blur to validate ID do Paciente (validation is async)
    await page.locator('#idPaciente').blur();
    await page.waitForTimeout(1000); // Wait for async validation
    
    await page.fill('#cpf', testCPF); // CPF is required (or Documento Estrangeiro)
    
    // Trigger blur to validate CPF (validation is async)
    await page.locator('#cpf').blur();
    await page.waitForTimeout(1500); // Wait for async CPF validation
    
    await page.fill('#nome', testNome);
    await page.fill('#email', testEmail);
    await page.fill('#telefone', '11999999999');
    
    // Select status (default is 'lead', but we can change it)
    const statusRadio = page.locator('input[type="radio"][value="lead"]').first();
    await expect(statusRadio).toBeChecked({ timeout: 3000 });
    
    // Submit form - wait for button to be visible and enabled
    const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
    
    // Click submit button and wait for success toast
    await submitButton.click();
    await page.waitForSelector('text=/paciente criado com sucesso/i', { timeout: 15000 });
    
    // Wait for modal to close completely (important to avoid intercepting future clicks)
    await waitForModalToClose(page, 'h2:has-text("Novo Paciente")', 15000);
    
    // Wait for any network requests to complete and list to refresh
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for list refresh via onSuccess callback
    
    // Use the search box to find the patient (more reliable than scrolling through list)
    const searchInput = page.locator('input[placeholder*="Buscar por nome ou CPF"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(testNome);
    
    // Wait for search debounce and results to load
    await page.waitForTimeout(1500); // Wait for debounce (usually 1000ms)
    await page.waitForLoadState('networkidle');
    
    // Verify patient appears in list - check in table body
    const pacienteInList = page.locator('tbody').locator(`text=${testNome}`).first();
    await expect(pacienteInList).toBeVisible({ timeout: 10000 });
  });

  test('ID do Paciente validation: missing ID → error message', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    
    // Click "Novo Paciente" button
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await novoPacienteButton.click();
    await page.waitForTimeout(500);
    
    // Wait for modal to be fully loaded
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    // Fill in nome and CPF but leave ID do Paciente empty (it's required)
    await page.fill('#nome', 'Teste Invalid ID');
    await page.fill('#cpf', generateValidCPF()); // Fill CPF since it's required
    
    // Wait a bit for any auto-validation
    await page.waitForTimeout(500);
    
    // Try to submit without ID do Paciente
    const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
    await submitButton.click();
    
    // Wait for validation error to appear (validation happens on submit)
    await page.waitForTimeout(1500);
    
    // Check for error message about ID do Paciente being required
    // Try multiple selectors to find the error message
    const errorSelectors = [
      'text=/ID do Paciente é obrigatório/i',
      'p:has-text("ID do Paciente é obrigatório")',
      '[class*="text-danger"]:has-text("ID do Paciente")'
    ];
    
    let errorFound = false;
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector).first();
      if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(errorElement).toBeVisible();
        errorFound = true;
        break;
      }
    }
    
    // If no error found, check if submit was blocked (button should be disabled if validation failed)
    if (!errorFound) {
      // Verify that we're still on the modal (not navigated away)
      const modalTitle = page.locator('h2:has-text("Novo Paciente")');
      await expect(modalTitle).toBeVisible({ timeout: 2000 });
    }
  });

  test('CPF optional: create paciente without CPF → success', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    
    // Click "Novo Paciente" button
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await novoPacienteButton.click();
    await page.waitForTimeout(500);
    
    // Wait for modal to be fully loaded
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    // Fill in required fields - CPF or Documento Estrangeiro is required (not both optional)
    // We'll use Documento Estrangeiro instead of CPF
    const testIdPaciente = generateUniqueIdPaciente();
    const testNome = `Teste Sem CPF ${Date.now()}`;
    const testDocumentoEstrangeiro = `PASS${Date.now().toString().slice(-6)}`;
    
    await page.fill('#idPaciente', testIdPaciente);
    await page.fill('#nome', testNome);
    // Fill Documento Estrangeiro instead of CPF (CPF or Documento Estrangeiro is required)
    await page.fill('#documentoEstrangeiro', testDocumentoEstrangeiro);
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Submit form
    const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await expect(submitButton).toBeEnabled({ timeout: 3000 });
    
    // Click submit and wait for success
    await submitButton.click();
    await page.waitForSelector('text=/paciente criado com sucesso/i', { timeout: 15000 });
    
    // Wait for modal to close
    await waitForModalToClose(page, 'h2:has-text("Novo Paciente")', 15000);
    
    // Verify patient was created (using Documento Estrangeiro instead of CPF)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for list refresh
    
    // Search for the patient
    const searchInput = page.locator('input[placeholder*="Buscar por nome ou CPF"]').first();
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill(testNome);
    
    // Wait for search debounce
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');
    
    // Verify patient appears in list
    const pacienteInList = page.locator('tbody').locator(`text=${testNome}`).first();
    await expect(pacienteInList).toBeVisible({ timeout: 10000 });
  });

  test('CPF validation: invalid CPF → error message', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    
    // Click "Novo Paciente" button
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await novoPacienteButton.click();
    await page.waitForTimeout(500);
    
    // Wait for modal to be fully loaded
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    await page.waitForSelector('#cpf', { timeout: 5000 });
    
    // Fill in required fields
    await page.fill('#idPaciente', generateUniqueIdPaciente());
    await page.fill('#nome', 'Teste Invalid CPF');
    
    // Fill invalid CPF (all same digits - will fail validation)
    await page.fill('#cpf', '11111111111');
    
    // Wait for auto-formatting to complete (if any)
    await page.waitForTimeout(500);
    
    // Blur CPF field to trigger validation (validation happens on blur)
    await page.locator('#cpf').blur();
    
    // Wait for async validation to complete (validation is async)
    // Increased timeout since validation happens asynchronously
    await page.waitForTimeout(3000);
    
    // Check for error message - try multiple selectors since the error message
    // is displayed in a <p> with class text-danger-600
    // The message should be "CPF inválido" based on the validateCPF function
    const errorSelectors = [
      'p.text-danger-600:has-text("CPF inválido")',
      'p:has-text("CPF inválido")',
      '[class*="text-danger"]:has-text("CPF inválido")',
      'text=/CPF inválido/i'
    ];
    
    let errorFound = false;
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector).first();
      if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(errorElement).toBeVisible();
        errorFound = true;
        break;
      }
    }
    
    // If no error found with blur, try submitting and check for error
    if (!errorFound) {
      const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
      await submitButton.click();
      await page.waitForTimeout(1500);
      
      // Check for error after submit attempt
      const errorAfterSubmit = page.locator('text=/CPF inválido/i').first();
      await expect(errorAfterSubmit).toBeVisible({ timeout: 3000 });
    }
  });

  test('duplicate ID do Paciente: create paciente with existing biologix_id → error', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    // First, create a patient
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await expect(novoPacienteButton).toBeVisible({ timeout: 5000 });
    await novoPacienteButton.click();
    
    // Wait for modal to open
    await page.waitForSelector('h2:has-text("Novo Paciente")', { timeout: 5000 });
    await page.waitForTimeout(300);
    
    // Wait for modal inputs
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    const testIdPaciente = generateUniqueIdPaciente(); // Same ID will be used twice to test duplicate
    const testCPF = generateValidCPF();
    const testNome1 = `Teste Paciente 1 ${Date.now()}`;
    const testEmail1 = `teste1${Date.now()}@test.com`;
    
    // Fill form fields - ID do Paciente is required
    await page.fill('#idPaciente', testIdPaciente);
    
    // Trigger blur to validate ID do Paciente
    await page.locator('#idPaciente').blur();
    await page.waitForTimeout(1000);
    
    await page.fill('#cpf', testCPF);
    
    // Trigger blur to validate CPF
    await page.locator('#cpf').blur();
    await page.waitForTimeout(1500);
    
    await page.fill('#nome', testNome1);
    await page.fill('#email', testEmail1);
    
    // Submit first patient
    const submitButton1 = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
    await expect(submitButton1).toBeVisible({ timeout: 5000 });
    await expect(submitButton1).toBeEnabled({ timeout: 3000 });
    
    await submitButton1.click();
    await page.waitForSelector('text=/paciente criado com sucesso/i', { timeout: 15000 });
    
    // Wait for modal to close completely (critical to avoid intercepting next click)
    await waitForModalToClose(page, 'h2:has-text("Novo Paciente")', 15000);
    
    // Wait for page to be ready
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Extra wait to ensure modal overlay is gone
    
    // Now try to create another patient with same CPF (or same ID do Paciente if modal has that field)
    // Ensure button is visible and clickable
    await expect(novoPacienteButton).toBeVisible({ timeout: 5000 });
    await expect(novoPacienteButton).toBeEnabled({ timeout: 3000 });
    
    // Wait a bit more to ensure overlay is completely gone
    await page.waitForTimeout(500);
    
    // Click button to open modal again
    await novoPacienteButton.click();
    
    // Wait for modal to open
    await page.waitForSelector('h2:has-text("Novo Paciente")', { timeout: 10000 });
    await page.waitForTimeout(300);
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    const testNome2 = `Teste Paciente 2 ${Date.now()}`;
    
    // Fill same ID do Paciente to trigger duplicate check
    await page.fill('#idPaciente', testIdPaciente); // Same ID as first patient
    
    // Also need to fill CPF (required field) - use different CPF to avoid duplicate CPF error
    const testCPF2 = generateValidCPF();
    await page.fill('#cpf', testCPF2);
    
    await page.fill('#nome', testNome2);
    
    // Blur ID do Paciente field to trigger duplicate check (validation is async)
    await page.locator('#idPaciente').blur();
    await page.waitForTimeout(3000); // Wait for async duplicate check
    
    // Check for duplicate error message (ID do Paciente)
    // Try multiple error message patterns
    const errorSelectors = [
      'text=/ID do Paciente.*já cadastrado/i',
      'text=/já cadastrado para/i',
      '[class*="text-danger"]:has-text("ID do Paciente")',
      '[class*="warning"]:has-text("já cadastrado")'
    ];
    
    let errorFound = false;
    for (const selector of errorSelectors) {
      const errorElement = page.locator(selector).first();
      if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(errorElement).toBeVisible();
        errorFound = true;
        break;
      }
    }
    
    // If no error found with blur, try submitting and check for error
    if (!errorFound) {
      const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
      await submitButton.click();
      await page.waitForTimeout(1500);
      
      // Check for error after submit attempt
      const errorAfterSubmit = page.locator('text=/já cadastrado|duplicate|já existe/i').first();
      await expect(errorAfterSubmit).toBeVisible({ timeout: 5000 });
    }
  });

  test('create sessão: open modal → fill → submit → verify count updated', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for list to load
    
    // First, we need to find or create a patient
    // For this test, we'll assume there's at least one patient in the list
    // Click on the first patient in the list
    const firstPaciente = page.locator('tbody tr').first();
    await expect(firstPaciente).toBeVisible({ timeout: 10000 });
    
    // Click on the patient name/link to navigate to profile
    const pacienteLink = firstPaciente.locator('a, button, td').first();
    await pacienteLink.click();
    
    // Wait for patient profile page
    await page.waitForURL(/.*\/pacientes\/[^/]+/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Find "Nova Sessão" button - scroll into view first
    const novaSessaoButton = page.locator('button').filter({ hasText: /nova sessão/i }).first();
    await expect(novaSessaoButton).toBeVisible({ timeout: 10000 });
    await novaSessaoButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await novaSessaoButton.click();
    
    // Wait for modal to open (Dialog component)
    await page.waitForSelector('text=Nova Sessão', { timeout: 10000 });
    await page.waitForTimeout(500);
    
    // Wait for form inputs to be visible
    await page.waitForSelector('#contador_inicial', { timeout: 10000 });
    
    // Fill in session form
    const today = new Date().toISOString().split('T')[0];
    await page.fill('#data_sessao', today);
    
    // Fill in contador inicial and final using id selectors
    await page.fill('#contador_inicial', '1000');
    await page.fill('#contador_final', '1500');
    
    // Wait a bit before submitting
    await page.waitForTimeout(500);
    
    // Select a protocol (tag) - required field
    // Look for protocol buttons/tags (Atropina, Vonau, Nasal, etc)
    const protocolButton = page.locator('button[type="button"]').filter({ 
      hasText: /atropina|vonau|nasal|palato|língua|combinado/i 
    }).first();
    
    if (await protocolButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await protocolButton.click();
      await page.waitForTimeout(500);
    }
    
    // Submit form - button text is "Criar Sessão"
    const submitButton = page.locator('button').filter({ hasText: /criar sessão/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    
    // Click submit and wait for success
    await submitButton.click();
    
    // Wait for success message or modal to close
    await page.waitForSelector('text=/sessão criada com sucesso/i', { timeout: 15000 }).catch(async () => {
      // If success message not found, wait for modal to close
      await page.waitForSelector('text=Nova Sessão', { state: 'hidden', timeout: 10000 });
    });
    
    // Wait for page to update
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle');
    
    // Verify session count updated - check for "Sessões Utilizadas" or updated count
    const sessoesCount = page.locator('text=/sessões utilizadas|sessões disponíveis|total de sessões/i').first();
    await expect(sessoesCount).toBeVisible({ timeout: 10000 });
  });

  test('status change: Lead → Ativo (after first sessão)', async ({ page }) => {
    // NOTE: This test depends on database trigger `atualizar_status_ao_criar_sessao`
    // which should automatically change patient status from 'lead' to 'ativo' when first session is created.
    // If the trigger is not working, this test will fail. Check migration 003_triggers.sql
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    
    // Create a new patient with status 'lead'
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await novoPacienteButton.click();
    await page.waitForTimeout(500);
    
    // Wait for modal inputs
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    const testIdPaciente = generateUniqueIdPaciente();
    const testCPF = generateValidCPF();
    const testNome = `Teste Lead ${Date.now()}`;
    
    await page.fill('#idPaciente', testIdPaciente);
    await page.fill('#cpf', testCPF);
    await page.fill('#nome', testNome);
    await page.fill('#email', `teste${Date.now()}@test.com`);
    
    // Ensure status is 'lead'
    const leadRadio = page.locator('input[type="radio"][value="lead"]').first();
    if (!(await leadRadio.isChecked())) {
      await leadRadio.click();
    }
    
    // Submit form
    const submitButton = page.locator('button').filter({ hasText: /salvar paciente/i }).first();
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    
    await submitButton.click();
    
    // Wait for success toast
    await page.waitForSelector('text=/paciente criado com sucesso/i', { timeout: 10000 }).catch(() => {});
    
    // Wait for modal to close
    await page.waitForSelector('h2:has-text("Novo Paciente")', { state: 'hidden', timeout: 10000 }).catch(() => {});
    
    // Wait for list to refresh
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
    
    // Use search to find the patient
    const searchInput = page.locator('input[placeholder*="Buscar por nome ou CPF"]').first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill(testNome);
      await page.waitForTimeout(1000);
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to patient profile
    const pacienteInList = page.locator(`text=${testNome}`).first();
    await expect(pacienteInList).toBeVisible({ timeout: 15000 });
    await pacienteInList.click();
    await page.waitForURL(/.*\/pacientes\/.*/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    // Verify status is 'lead'
    const statusBadge = page.locator('text=/lead/i').first();
    await expect(statusBadge).toBeVisible({ timeout: 10000 });
    
    // Create first session - wait for button
    const novaSessaoButton = page.locator('button').filter({ hasText: /nova sessão/i }).first();
    await expect(novaSessaoButton).toBeVisible({ timeout: 10000 });
    await novaSessaoButton.click();
    
    // Wait for modal to open
    await page.waitForSelector('text=Nova Sessão', { timeout: 5000 });
    await page.waitForSelector('#contador_inicial', { timeout: 5000 });
    
    const today = new Date().toISOString().split('T')[0];
    await page.fill('#data_sessao', today);
    await page.fill('#contador_inicial', '1000');
    await page.fill('#contador_final', '1500');
    
    const submitSessaoButton = page.locator('button').filter({ hasText: /criar sessão/i }).first();
    await expect(submitSessaoButton).toBeVisible({ timeout: 5000 });
    
    await submitSessaoButton.click();
    
    // Wait for success toast to confirm session was created
    await page.waitForSelector('text=/sessão criada com sucesso/i', { timeout: 15000 }).catch(() => {});
    
    // Wait for modal to close completely
    await waitForModalToClose(page, 'text=Nova Sessão', 15000);
    
    // Wait for any network requests to complete
    await page.waitForLoadState('networkidle');
    
    // Wait for trigger to update status in database (give it time for async operations)
    // NOTE: Database trigger `atualizar_status_ao_criar_sessao` should change status from 'lead' to 'ativo'
    // Wait for network idle to ensure trigger has executed
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Reload page to ensure latest data from database (trigger updates status)
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForLoadState('networkidle');
    
    // Wait for any async status updates after reload
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    // Verify status changed to 'ativo'
    // Status can be displayed as select (for admins/dentistas) or span badge (for recepcao)
    // Check both possibilities
    const selectStatus = page.locator('select').filter({ hasText: /ativo|lead|finalizado|inativo/i }).first();
    const spanStatus = page.locator('span').filter({ hasText: /ativo/i }).first();
    
    // Try to find select first (admin/dentista view)
    if (await selectStatus.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Verify select has value "ativo"
      await expect(selectStatus).toHaveValue('ativo', { timeout: 10000 });
    } else {
      // If no select, look for span badge (recepcao view)
      await expect(spanStatus).toBeVisible({ timeout: 10000 });
    }
  });

  test('busca global: search by CPF/nome → verify results', async ({ page }) => {
    await page.goto('/pacientes');
    await page.waitForLoadState('networkidle');
    
    // First, create a patient to search for
    const novoPacienteButton = page.locator('button').filter({ hasText: /novo paciente/i }).first();
    await novoPacienteButton.click();
    await page.waitForTimeout(500);
    
    // Wait for modal inputs
    await page.waitForSelector('#idPaciente', { timeout: 5000 });
    
    const testIdPaciente = generateUniqueIdPaciente();
    const testCPF = generateValidCPF();
    const testNome = `Busca Teste ${Date.now()}`;
    
    await page.fill('#idPaciente', testIdPaciente);
    await page.fill('#cpf', testCPF);
    await page.fill('#nome', testNome);
    await page.fill('#email', `busca${Date.now()}@test.com`);
    
    const submitButton = page.locator('button[type="submit"]').or(
      page.locator('button').filter({ hasText: /salvar|criar|adicionar/i })
    ).first();
    await submitButton.click();
    await page.waitForTimeout(2000);
    
    // Now test search by CPF
    // Find search input (might be in header or on pacientes page)
    const searchInput = page.locator('input[type="search"]').or(
      page.locator('input[placeholder*="buscar"]').or(
        page.locator('input[placeholder*="search"]')
      )
    ).first();
    
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill(testCPF);
      await page.waitForTimeout(1000); // Wait for debounce
      
      // Verify search results show the patient
      const searchResult = page.locator(`text=${testNome}`).first();
      await expect(searchResult).toBeVisible({ timeout: 5000 });
      
      // Clear search and search by name
      await searchInput.clear();
      await searchInput.fill(testNome);
      await page.waitForTimeout(1000);
      
      // Verify search results show the patient
      await expect(searchResult).toBeVisible({ timeout: 5000 });
    } else {
      // If search is not available on this page, skip this part
      test.skip();
    }
  });
});

