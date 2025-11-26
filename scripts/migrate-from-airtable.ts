#!/usr/bin/env tsx
/**
 * Migration Script: Airtable → Supabase
 * 
 * This script migrates data from Airtable CSV exports to Supabase.
 * 
 * Usage:
 *   tsx scripts/migrate-from-airtable.ts --env=staging
 *   tsx scripts/migrate-from-airtable.ts --env=production
 * 
 * Prerequisites:
 *   1. Export Airtable data to CSV files:
 *      - pacientes.csv (in scripts/data/airtable/)
 *        - Must have "username" column with CPF embedded (11 digits)
 *        - CPF is extracted using REGEX_REPLACE({username}, "[^0-9]", "")
 *      - exames.csv (in scripts/data/airtable/)
 *        - Must have "Biologix Exam ID" or "ID Exames" column
 *        - Exames are linked to pacientes by exam ID (not CPF)
 *      - tags.csv (in scripts/data/airtable/) - OPTIONAL
 *   2. Configure .env.local with SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.warn('⚠️  Arquivo .env.local não encontrado. Usando variáveis de ambiente do sistema.');
  dotenv.config(); // Try to load from system environment
}

// Types
interface AirtablePaciente {
  username?: string; // CPF is embedded in username, extract using REGEX_REPLACE({username}, "[^0-9]", "")
  CPF?: string; // Direct CPF column (preferred if available)
  Nome: string;
  Email?: string;
  Telefone?: string;
  'Data Nascimento'?: string;
  Genero?: string;
  Sexo?: string; // Alternative field name
  Status?: string;
  'Sessões Compradas'?: string;
  'Biologix ID'?: string;
  'ID do Paciente'?: string; // Alternative field name for Biologix ID
  'Observações Gerais'?: string;
  Tags?: string; // Comma-separated tag names
  'Data Cadastro'?: string;
}

interface AirtableExame {
  'Biologix Exam ID'?: string; // Used to link exam to paciente
  'Biologix Exam Key'?: string;
  'ID Exames'?: string; // Alternative field name for exam ID
  'ID Exame'?: string; // Alternative field name for exam ID (without 's')
  'Chave Exame'?: string; // Alternative field name for exam key
  'ID Pacientes LINK'?: string; // Link to paciente ID
  'Telefone Paciente'?: string; // Used as fallback to find paciente
  'Email Paciente'?: string; // Used as fallback to find paciente
  'Nome Paciente'?: string; // Used as fallback to find paciente
  Tipo?: string; // "Ronco" or "Sono"
  'Tipo Exame'?: string; // Alternative field name
  Status?: string;
  'Data Exame'?: string;
  'Data do Processamento'?: string; // Alternative field name
  Peso?: string; // Alternative field name (without unit)
  'Peso (kg)'?: string;
  Altura?: string; // Alternative field name (without unit)
  'Altura (cm)'?: string;
  'Score Ronco'?: string;
  'Score de Impacto do Ronco'?: string; // Alternative field name
  IDO?: string;
  'IDO Categoria'?: string; // "Normal", "Leve", "Moderado", "Acentuado"
  'IDO Cat'?: string; // Alternative field name
  'SpO2 Min'?: string;
  'spO2 Min'?: string; // Alternative field name (lowercase)
  'SpO2 Avg'?: string;
  'spO2 Médio'?: string; // Alternative field name
  'SpO2 Max'?: string;
  'spO2 Max'?: string; // Alternative field name (lowercase)
}

interface AirtableTag {
  Nome: string;
  Cor?: string; // Hex color code
  Tipo?: string;
}

// Configuration
const ENV = process.argv.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'staging';
const DATA_DIR = path.join(process.cwd(), 'scripts', 'data', 'airtable');
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'data', 'invalid');

// Supabase client (using SERVICE_ROLE_KEY to bypass RLS during migration)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('');
  console.error('Required environment variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('📝 Para resolver:');
  console.error('  1. Crie um arquivo .env.local na raiz do projeto');
  console.error('  2. Adicione as seguintes variáveis:');
  console.error('');
  console.error('     NEXT_PUBLIC_SUPABASE_URL=https://qigbblypwkgflwnrrhzg.supabase.co');
  console.error('     SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui');
  console.error('');
  console.error('  Você pode encontrar essas credenciais em:');
  console.error('  https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/settings/api');
  console.error('');
  console.error('  Consulte CONFIGURAR_ENV_LOCAL.md para instruções detalhadas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper functions
function readCSV<T>(filename: string, required: boolean = true): T[] {
  const filePath = path.join(DATA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    if (required) {
      console.error(`❌ Error: File not found: ${filePath}`);
      console.error(`Please export ${filename} from Airtable and place it in scripts/data/airtable/`);
      process.exit(1);
    } else {
      return [];
    }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true, // Handle BOM (Byte Order Mark) if present
    relax_quotes: true, // Allow quotes to appear in unquoted fields
    relax_column_count: true // Allow inconsistent column count
  });

  return records as T[];
}

function formatCPF(cpf: string | undefined | null): string {
  // Handle null/undefined/empty
  if (!cpf || typeof cpf !== 'string') {
    return '';
  }
  // Remove all non-numeric characters (REGEX_REPLACE equivalent: [^0-9])
  return cpf.replace(/[^0-9]/g, '');
}

/**
 * Extract CPF from username (same logic as Edge Function)
 * Username format may contain CPF embedded, we extract only numbers
 */
function extractCPFFromUsername(username: string | undefined | null): string | null {
  if (!username || typeof username !== 'string') {
    return null;
  }
  
  // Extract all numbers from username (REGEX_REPLACE({username}, "[^0-9]", ""))
  const numbers = username.replace(/[^0-9]/g, '');
  
  // Check if we have exactly 11 digits (CPF format)
  if (numbers.length === 11) {
    return numbers;
  }
  
  // Try to find 11 consecutive digits
  const cpfMatch = username.match(/\d{11}/);
  if (cpfMatch) {
    return cpfMatch[0];
  }
  
  return null;
}

function parseDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  
  // Try different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
  ];

  // If already in YYYY-MM-DD format, return as is
  if (formats[0].test(dateStr)) {
    return dateStr;
  }

  // Try to parse DD/MM/YYYY or DD-MM-YYYY
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }

  return null;
}

function mapStatus(status: string | undefined): string {
  if (!status) return 'lead';
  
  const statusMap: Record<string, string> = {
    'Lead': 'lead',
    'Ativo': 'ativo',
    'Finalizado': 'finalizado',
    'Inativo': 'inativo',
    'lead': 'lead',
    'ativo': 'ativo',
    'finalizado': 'finalizado',
    'inativo': 'inativo',
  };

  return statusMap[status] || 'lead';
}

function mapTipoExame(tipo: string | undefined): number {
  if (!tipo) return 0;
  
  const tipoMap: Record<string, number> = {
    'Ronco': 0,
    'Sono': 1,
    'ronco': 0,
    'sono': 1,
    '0': 0,
    '1': 1,
  };

  return tipoMap[tipo] || 0;
}

function mapIDOCategoria(categoria: string | undefined): number | null {
  if (!categoria) return null;
  
  const categoriaMap: Record<string, number> = {
    'Normal': 0,
    'Leve': 1,
    'Moderado': 2,
    'Acentuado': 3,
    'normal': 0,
    'leve': 1,
    'moderado': 2,
    'acentuado': 3,
  };

  return categoriaMap[categoria] ?? null;
}

function parseNumeric(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = parseFloat(value.replace(',', '.'));
  return isNaN(parsed) ? null : parsed;
}

function parseInteger(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Airtable → Supabase Migration');
  console.log(`📦 Environment: ${ENV}`);
  console.log('');

  // Step 1: Read CSV files
  console.log('📖 Step 1: Reading CSV files...');
  const pacientesData = readCSV<AirtablePaciente>('pacientes.csv');
  const examesData = readCSV<AirtableExame>('exames.csv');
  
  // Tags CSV is optional (pre-defined tags already exist in database via migration 005)
  const tagsData = readCSV<AirtableTag>('tags.csv', false); // false = not required
  if (tagsData.length > 0) {
    console.log(`   ✅ Read ${tagsData.length} tags from CSV`);
  } else {
    console.log(`   ℹ️  tags.csv not found (optional - using pre-defined tags from migration 005)`);
  }
  
  console.log(`   ✅ Read ${pacientesData.length} pacientes`);
  console.log(`   ✅ Read ${examesData.length} exames`);
  
  // Debug: Verificar primeira linha de pacientes
  if (pacientesData.length > 0) {
    const firstRecord = pacientesData[0];
    console.log(`   🔍 Debug - Colunas disponíveis:`, Object.keys(firstRecord).slice(0, 5).join(', '), '...');
    console.log(`   🔍 Debug - ID do Paciente (primeira linha):`, firstRecord['ID do Paciente']);
    console.log(`   🔍 Debug - Nome (primeira linha):`, firstRecord['Nome']);
    // Tentar acessar diretamente pelo índice também
    const recordKeys = Object.keys(firstRecord);
    const idIndex = recordKeys.indexOf('ID do Paciente');
    if (idIndex >= 0) {
      const recordValues = Object.values(firstRecord);
      console.log(`   🔍 Debug - Valor no índice ${idIndex}:`, recordValues[idIndex]);
    }
  }
  
  // Debug: Verificar primeira linha de exames
  if (examesData.length > 0) {
    console.log(`   🔍 Debug - Primeira linha exames:`, Object.keys(examesData[0]));
    console.log(`   🔍 Debug - ID Exame (primeira linha):`, examesData[0]['ID Exame'] || examesData[0]['ID Exames'] || examesData[0]['Biologix Exam ID']);
    console.log(`   🔍 Debug - ID Pacientes LINK (primeira linha):`, examesData[0]['ID Pacientes LINK']);
  }
  
  console.log('');

  // Step 2: Preparar pacientes (sem filtrar - todos serão inseridos)
  console.log('🔍 Step 2: Preparando pacientes...');
  console.log(`   ℹ️  Processando todos os ${pacientesData.length} pacientes (sem remover nenhum)`);
  
  // Extrair CPF para validação opcional (mas não filtrar)
  for (const paciente of pacientesData) {
    // Try to get CPF directly from CPF column first, otherwise extract from username
    let cpf: string | null = null;
    
    if (paciente.CPF) {
      // Use CPF column directly (already cleaned)
      const cpfClean = formatCPF(paciente.CPF);
      if (cpfClean.length === 11) {
        cpf = cpfClean;
      }
    }
    
    // If CPF column not available or invalid, try to extract from username
    if (!cpf && paciente.username) {
      const username = paciente.username || '';
      cpf = extractCPFFromUsername(username);
    }
    
    // CPF é opcional - não vamos filtrar pacientes sem CPF válido
    // Apenas logar avisos se necessário
    if (!cpf || cpf.length !== 11) {
      console.warn(`   ⚠️  Paciente ${paciente.Nome || '(sem nome)'} (ID: ${paciente['ID do Paciente'] || 'N/A'}) - CPF não encontrado ou inválido, mas será inserido mesmo assim`);
    }
  }
  
  console.log(`   ✅ Todos os ${pacientesData.length} pacientes serão processados`);
  console.log('');

  // Step 3: Insert Tags (if CSV provided)
  console.log('🏷️  Step 3: Inserting tags...');
  const tagMap = new Map<string, string>(); // tag name -> tag UUID
  
  // First, load existing tags from database
  const { data: existingTags } = await supabase
    .from('tags')
    .select('id, nome');
  
  if (existingTags) {
    for (const tag of existingTags) {
      tagMap.set(tag.nome, tag.id);
    }
    console.log(`   ✅ Loaded ${existingTags.length} existing tags from database`);
  }
  
  // Then, insert/update tags from CSV (if provided)
  if (tagsData.length > 0) {
    for (const tag of tagsData) {
    const { data, error } = await supabase
      .from('tags')
      .upsert({
        nome: tag.Nome,
        cor: tag.Cor || '#3B82F6',
        tipo: tag.Tipo || null,
      }, {
        onConflict: 'nome',
        ignoreDuplicates: false
      })
      .select('id, nome')
      .single();

    if (error) {
      console.error(`   ❌ Error inserting tag ${tag.Nome}:`, error.message);
      continue;
    }

      tagMap.set(tag.Nome, data.id);
      console.log(`   ✅ Tag: ${tag.Nome}`);
    }
    console.log(`   ✅ Inserted/updated ${tagsData.length} tags from CSV`);
  } else {
    console.log(`   ℹ️  No tags CSV provided, using existing tags from database`);
  }
  
  console.log(`   ✅ Total tags available: ${tagMap.size}`);
  console.log('');

  // Step 4: Insert Pacientes (usando ID do Paciente como chave única)
  console.log('👥 Step 4: Inserting pacientes...');
  // Map para ligação principal: ID do Paciente (biologix_id) → UUID do paciente
  const pacienteIdMap = new Map<string, string>(); // biologix_paciente_id (ID do Paciente) -> paciente UUID
  let pacientesInserted = 0;
  let pacientesUpdated = 0;
  
  // Helper function to normalize phone numbers (remove spaces, dashes, parentheses)
  function normalizePhone(phone: string | undefined | null): string | null {
    if (!phone) return null;
    return phone.replace(/[\s\-\(\)]/g, '').replace(/^\+55/, '').replace(/^0/, '');
  }

  for (const paciente of pacientesData) {
    // ID do Paciente é obrigatório (chave única)
    // O csv-parse pode ter problemas com nomes de colunas com espaços, então vamos tentar diferentes formas
    let biologixPacienteId: string | undefined = undefined;
    
    // Tentar acessar diretamente
    biologixPacienteId = paciente['ID do Paciente'];
    
    // Se não funcionar, tentar pegar o primeiro valor (ID do Paciente é sempre a primeira coluna)
    if (!biologixPacienteId) {
      const firstKey = Object.keys(paciente)[0];
      biologixPacienteId = paciente[firstKey as keyof typeof paciente] as string;
    }
    
    // Se ainda não funcionar, usar Object.values
    if (!biologixPacienteId) {
      const values = Object.values(paciente);
      biologixPacienteId = values[0] as string;
    }
    
    if (!biologixPacienteId || typeof biologixPacienteId !== 'string' || biologixPacienteId.trim() === '') {
      console.warn(`   ⚠️  Skipping paciente ${paciente.Nome || '(sem nome)'}: ID do Paciente não encontrado`);
      if (pacientesData.indexOf(paciente) === 0) {
        console.warn(`   🔍 Debug - Primeiras 3 chaves:`, Object.keys(paciente).slice(0, 3));
        console.warn(`   🔍 Debug - Primeiros 3 valores:`, Object.values(paciente).slice(0, 3));
      }
      continue;
    }
    
    // Limpar espaços em branco
    biologixPacienteId = biologixPacienteId.trim();
    
    // Extract CPF (opcional, mas tentar obter)
    let cpf: string | null = null;
    if (paciente.CPF) {
      const cpfClean = formatCPF(paciente.CPF);
      if (cpfClean.length === 11) {
        cpf = cpfClean;
      }
    }
    if (!cpf && paciente.username) {
      cpf = extractCPFFromUsername(paciente.username);
    }
    
    const status = mapStatus(paciente.Status);
    
    const pacienteData: any = {
      biologix_id: biologixPacienteId, // ID do Paciente como chave única
      nome: paciente.Nome,
      email: paciente.Email || null,
      telefone: paciente.Telefone || null,
      data_nascimento: parseDate(paciente['Data Nascimento']) || null,
      genero: (paciente.Genero || paciente.Sexo)?.toUpperCase() === 'M' ? 'M' : 
              (paciente.Genero || paciente.Sexo)?.toUpperCase() === 'F' ? 'F' : null,
      status,
      sessoes_compradas: parseInteger(paciente['Sessões Compradas']) || 0,
      sessoes_adicionadas: 0,
      sessoes_utilizadas: 0,
      observacoes_gerais: paciente['Observações Gerais'] || null,
      created_at: parseDate(paciente['Data Cadastro']) || new Date().toISOString(),
    };
    
    // CPF é opcional - só adicionar se válido
    if (cpf && cpf.length === 11) {
      pacienteData.cpf = cpf;
    }

    // Upsert usando biologix_id como chave única
    const { data, error } = await supabase
      .from('pacientes')
      .upsert(pacienteData, {
        onConflict: 'biologix_id',
        ignoreDuplicates: false
      })
      .select('id, biologix_id, nome')
      .single();

    if (error) {
      console.error(`   ❌ Error inserting paciente ${paciente.Nome} (ID: ${biologixPacienteId}):`, error.message);
      continue;
    }

    // Armazenar ligação principal: ID do Paciente → UUID
    pacienteIdMap.set(biologixPacienteId, data.id);
    
    // Check if it was insert or update
    const { data: existing } = await supabase
      .from('pacientes')
      .select('created_at')
      .eq('biologix_id', biologixPacienteId)
      .single();
    
    if (existing && new Date(existing.created_at).getTime() < new Date(pacienteData.created_at).getTime() - 1000) {
      pacientesUpdated++;
    } else {
      pacientesInserted++;
    }

    // Insert tag associations
    if (paciente.Tags) {
      const tagNames = paciente.Tags.split(',').map(t => t.trim());
      for (const tagName of tagNames) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await supabase
            .from('paciente_tags')
            .upsert({
              paciente_id: data.id,
              tag_id: tagId,
            }, {
              onConflict: 'paciente_id,tag_id',
              ignoreDuplicates: true
            });
        }
      }
    }
  }

  console.log(`   ✅ Inserted ${pacientesInserted} pacientes`);
  console.log(`   ✅ Updated ${pacientesUpdated} pacientes`);
  console.log(`   ✅ Total: ${pacienteIdMap.size} pacientes processed`);
  console.log('');

  // Step 5: Insert Exames (usando ID Exame como chave única e ID Pacientes LINK para vincular)
  console.log('🔬 Step 5: Inserting exames...');
  let examesInserted = 0;
  let examesUpdated = 0;
  let examesSkipped = 0;
  const invalidExames: Array<{ exame: AirtableExame; motivo: string }> = [];

  for (const exame of examesData) {
    // ID Exame é obrigatório (chave única)
    // Tentar diferentes formas de acessar
    let examId: string | undefined = undefined;
    examId = exame['Biologix Exam ID'] || exame['ID Exames'] || exame['ID Exame'];
    
    // Se não funcionar, pegar o primeiro valor (ID Exame é sempre a primeira coluna)
    if (!examId) {
      const firstKey = Object.keys(exame)[0];
      examId = exame[firstKey as keyof typeof exame] as string;
    }
    
    if (!examId || typeof examId !== 'string' || examId.trim() === '') {
      examesSkipped++;
      invalidExames.push({
        exame,
        motivo: 'ID do Exame não encontrado'
      });
      if (examesSkipped <= 5) {
        console.warn(`   ⚠️  Skipping exame: ID não encontrado`);
      }
      continue;
    }
    
    examId = examId.trim();
    
    // ID Pacientes LINK é obrigatório para vincular ao paciente
    let biologixPacienteId: string | undefined = undefined;
    biologixPacienteId = exame['ID Pacientes LINK'];
    
    // Se não funcionar, pegar o segundo valor (ID Pacientes LINK é sempre a segunda coluna)
    if (!biologixPacienteId) {
      const keys = Object.keys(exame);
      if (keys.length > 1) {
        const secondKey = keys[1];
        biologixPacienteId = exame[secondKey as keyof typeof exame] as string;
      }
    }
    
    if (!biologixPacienteId || typeof biologixPacienteId !== 'string' || biologixPacienteId.trim() === '') {
      examesSkipped++;
      invalidExames.push({
        exame,
        motivo: 'ID Pacientes LINK não encontrado'
      });
      if (examesSkipped <= 5) {
        console.warn(`   ⚠️  Skipping exame ${examId}: ID Pacientes LINK não encontrado`);
      }
      continue;
    }
    
    biologixPacienteId = biologixPacienteId.trim();
    
    // ============================================
    // LIGAÇÃO PRINCIPAL: ID Pacientes LINK → biologix_id do Paciente
    // ============================================
    // O exame tem "ID Pacientes LINK" que corresponde ao "ID do Paciente" (biologix_id) do paciente
    // Buscamos o paciente pelo biologix_id e obtemos seu UUID para a foreign key
    const pacienteUuid = pacienteIdMap.get(biologixPacienteId);
    if (!pacienteUuid) {
      examesSkipped++;
      invalidExames.push({
        exame,
        motivo: `Paciente com ID ${biologixPacienteId} não encontrado na base de dados (verificar se o paciente foi inserido primeiro)`
      });
      if (examesSkipped <= 5) {
        console.warn(`   ⚠️  Skipping exame ${examId}: Paciente ${biologixPacienteId} não encontrado`);
      }
      continue;
    }
    
    // Log de progresso a cada 100 exames
    if ((examesInserted + examesUpdated + examesSkipped) % 100 === 0) {
      console.log(`   📊 Processados ${examesInserted + examesUpdated + examesSkipped}/${examesData.length} exames...`);
    }

    const exameData = {
      paciente_id: pacienteUuid, // UUID do paciente (foreign key para pacientes.id)
      biologix_exam_id: examId, // ID Exame como chave única
      biologix_paciente_id: biologixPacienteId, // ID do Paciente (ligação principal - mesmo valor que pacientes.biologix_id)
      biologix_exam_key: exame['Biologix Exam Key'] || exame['Chave Exame'] || null,
      tipo: mapTipoExame(exame.Tipo || exame['Tipo Exame']),
      status: parseInteger(exame.Status) || 6,
      data_exame: parseDate(exame['Data Exame'] || exame['Data do Processamento']) || new Date().toISOString().split('T')[0],
      peso_kg: parseNumeric(exame['Peso (kg)'] || exame.Peso),
      altura_cm: parseNumeric(exame['Altura (cm)'] || exame.Altura),
      score_ronco: parseNumeric(exame['Score Ronco'] || exame['Score de Impacto do Ronco']),
      ido: parseNumeric(exame.IDO),
      ido_categoria: mapIDOCategoria(exame['IDO Categoria'] || exame['IDO Cat']),
      spo2_min: parseNumeric(exame['SpO2 Min'] || exame['spO2 Min']),
      spo2_avg: parseNumeric(exame['SpO2 Avg'] || exame['spO2 Médio']),
      spo2_max: parseNumeric(exame['SpO2 Max'] || exame['spO2 Max']),
    };

    // Verificar se é insert ou update
    const { data: existing } = await supabase
      .from('exames')
      .select('id')
      .eq('biologix_exam_id', examId)
      .single();

    const { error } = await supabase
      .from('exames')
      .upsert(exameData, {
        onConflict: 'biologix_exam_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error(`   ❌ Error inserting exame ${examId}:`, error.message);
      continue;
    }

    if (existing) {
      examesUpdated++;
    } else {
      examesInserted++;
    }
  }

  console.log(`   ✅ Inserted ${examesInserted} exames`);
  console.log(`   ✅ Updated ${examesUpdated} exames`);
  if (examesSkipped > 0) {
    console.log(`   ⚠️  Skipped ${examesSkipped} exames (ID não encontrado ou paciente não encontrado)`);
  }
  
  // Save invalid exames to CSV (apenas para referência, não bloqueia migração)
  if (invalidExames.length > 0) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const invalidExamesCSV = stringify(
      invalidExames.map(item => ({
        'ID Exame': item.exame['Biologix Exam ID'] || item.exame['ID Exames'] || item.exame['ID Exame'] || '',
        'ID Pacientes LINK': item.exame['ID Pacientes LINK'] || '',
        'Chave Exame': item.exame['Chave Exame'] || '',
        'Tipo Exame': item.exame['Tipo Exame'] || '',
        'Data do Processamento': item.exame['Data do Processamento'] || '',
        'Motivo': item.motivo
      })),
      { header: true }
    );
    
    const invalidExamesPath = path.join(OUTPUT_DIR, 'exames_invalidos.csv');
    fs.writeFileSync(invalidExamesPath, invalidExamesCSV);
    console.log(`   📄 Invalid exames saved to: ${invalidExamesPath}`);
  }
  
  console.log('');

  // Summary
  console.log('📊 Migration Summary:');
  console.log(`   ✅ Pacientes: ${pacientesInserted + pacientesUpdated} processed (${pacientesInserted} inserted, ${pacientesUpdated} updated)`);
  console.log(`   ✅ Exames: ${examesInserted + examesUpdated} processed (${examesInserted} inserted, ${examesUpdated} updated)`);
  if (examesSkipped > 0) {
    console.log(`   ⚠️  Exames skipped: ${examesSkipped} (verificar exames_invalidos.csv)`);
  }
  console.log(`   ✅ Tags: ${tagMap.size} available`);
  console.log('');
  console.log('🎉 Migration completed successfully!');
}

// Run migration
migrate().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});

