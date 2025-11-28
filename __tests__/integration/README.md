# Testes de Integração com Playwright

## 📋 Configuração

### 1. Credenciais de Teste

Antes de executar os testes, você precisa configurar credenciais de teste válidas.

**📧 Email padrão:** `admin@beautysmile.com`  
**🔑 Senha padrão:** `admin123` (ou a senha que você definiu ao criar o usuário)

**⚠️ IMPORTANTE:** Se você ainda não criou o usuário, siga o guia `GUIA_CRIAR_USUARIO_TESTE.md` primeiro!

**📖 Guia Completo:** Veja `CONFIGURAR_CREDENCIAIS_TESTE.md` para instruções detalhadas de configuração.

**Opção 1: Variáveis de Ambiente (Windows PowerShell)**
```powershell
$env:TEST_USER_EMAIL="admin@beautysmile.com"
$env:TEST_USER_PASSWORD="admin123"
npx playwright test
```

**Opção 2: Variáveis de Ambiente (Windows CMD)**
```cmd
set TEST_USER_EMAIL=admin@beautysmile.com
set TEST_USER_PASSWORD=admin123
npx playwright test
```

**Opção 3: Variáveis de Ambiente (Linux/Mac)**
```bash
export TEST_USER_EMAIL=admin@beautysmile.com
export TEST_USER_PASSWORD=admin123
npx playwright test
```

**Opção 4: Arquivo .env.test.local** (recomendado - não será commitado)
```bash
# Crie o arquivo .env.test.local na raiz do projeto
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
```

### 2. Criar Usuário de Teste (se ainda não criou)

**Se você ainda não tem um usuário de teste, siga estas etapas:**

1. **Criar no Supabase Auth Dashboard:**
   - Acesse: https://supabase.com/dashboard
   - Vá em **Authentication** → **Users** → **Add User**
   - Email: `admin@beautysmile.com`
   - Password: `admin123` (ou escolha outra)
   - Marque **Auto Confirm User**

2. **Inserir na tabela `users`:**
   - No Supabase Dashboard, vá em **SQL Editor**
   - Execute:
   ```sql
   INSERT INTO users (email, nome, role, ativo) 
   VALUES ('admin@beautysmile.com', 'Administrador', 'admin', true)
   ON CONFLICT (email) DO UPDATE SET ativo = true;
   ```

**📖 Guia completo:** Veja `GUIA_CRIAR_USUARIO_TESTE.md` para instruções detalhadas.

## 🚀 Executar Testes

```bash
# Executar todos os testes
npx playwright test

# Executar testes de autenticação apenas
npx playwright test auth.test.ts

# Executar testes de pacientes apenas
npx playwright test pacientes.test.ts

# Executar em modo UI (interativo)
npx playwright test --ui

# Executar em modo headed (ver o navegador)
npx playwright test --headed
```

## 📝 Testes Implementados

### Autenticação (auth.test.ts)
- ✅ Redirecionamento para login quando não autenticado
- ✅ Login com credenciais válidas → dashboard
- ✅ Login com credenciais inválidas → mensagem de erro
- ✅ Validação de campos vazios
- ✅ Logout → redirecionamento para login
- ✅ Link "Esqueci minha senha" visível
- ✅ Navegação para reset de senha

### Pacientes (pacientes.test.ts)
- ✅ Navegação para página de pacientes
- ✅ Criar paciente: preencher formulário → submeter → verificar na lista
- ✅ Validação de CPF: CPF inválido → mensagem de erro
- ✅ CPF duplicado: criar paciente com CPF existente → erro
- ✅ Criar sessão: abrir modal → preencher → submeter → verificar contagem atualizada
- ✅ Mudança de status: Lead → Ativo (após primeira sessão)
- ✅ Busca global: buscar por CPF/nome → verificar resultados

## ⚠️ Notas Importantes

1. **Credenciais de Teste**: Os testes que requerem autenticação serão pulados automaticamente se as credenciais não estiverem configuradas.

2. **Servidor de Desenvolvimento**: O Playwright inicia automaticamente o servidor Next.js antes de executar os testes (configurado em `playwright.config.ts`).

3. **Dados de Teste**: Alguns testes criam dados de teste (pacientes, sessões). Certifique-se de limpar esses dados após os testes se necessário.

4. **Ambiente**: Os testes rodam contra o ambiente configurado em `.env.local`. Certifique-se de que está usando um ambiente de teste/staging, não produção.

## 🐛 Troubleshooting

### Erro: "Invalid login credentials"
- Verifique se as credenciais estão corretas
- Verifique se o usuário existe no Supabase Auth
- Verifique se as variáveis de ambiente estão configuradas

### Erro: "Timeout waiting for server"
- Verifique se a porta 3000 está disponível
- Verifique se não há outro servidor Next.js rodando

### Testes falhando por seletores
- Os seletores podem precisar de ajuste baseado na estrutura real da UI
- Use `npx playwright test --ui` para debugar interativamente

