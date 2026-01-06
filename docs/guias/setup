# Como Configurar Credenciais para Testes do Playwright

## 🚀 Método 1: Arquivo .env.test.local (Recomendado)

1. **Crie o arquivo `.env.test.local` na raiz do projeto:**

```bash
# Windows PowerShell
@"
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=sua_senha_aqui
"@ | Out-File -FilePath .env.test.local -Encoding utf8
```

Ou crie manualmente:
- Crie um arquivo chamado `.env.test.local` na raiz do projeto
- Adicione estas linhas:
```
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=sua_senha_aqui
```

2. **Execute os testes:**
```bash
npx playwright test
```

O Playwright carregará automaticamente as variáveis deste arquivo.

## 🚀 Método 2: Variáveis de Ambiente no PowerShell (Temporário)

**Para a sessão atual do PowerShell:**

```powershell
$env:TEST_USER_EMAIL="admin@beautysmile.com"
$env:TEST_USER_PASSWORD="sua_senha_aqui"
npx playwright test
```

**⚠️ Nota:** Estas variáveis só funcionam na sessão atual. Se fechar o PowerShell, precisará definir novamente.

## 🚀 Método 3: Variáveis de Ambiente Permanentes (Windows)

**Para definir permanentemente no Windows:**

1. Pressione `Win + R`
2. Digite: `sysdm.cpl` e pressione Enter
3. Vá na aba **Avançado**
4. Clique em **Variáveis de Ambiente**
5. Em **Variáveis do usuário**, clique em **Novo**
6. Nome: `TEST_USER_EMAIL`, Valor: `admin@beautysmile.com`
7. Clique em **Novo** novamente
8. Nome: `TEST_USER_PASSWORD`, Valor: `sua_senha_aqui`
9. Clique em **OK** em todas as janelas
10. **Reinicie o terminal/PowerShell** para as variáveis serem carregadas

## ✅ Verificar se Está Funcionando

Execute este comando para verificar:

```powershell
# Verificar variáveis
if ($env:TEST_USER_EMAIL) { 
    Write-Host "✅ TEST_USER_EMAIL: $env:TEST_USER_EMAIL" 
} else { 
    Write-Host "❌ TEST_USER_EMAIL não está definido" 
}

if ($env:TEST_USER_PASSWORD) { 
    Write-Host "✅ TEST_USER_PASSWORD: [DEFINIDO]" 
} else { 
    Write-Host "❌ TEST_USER_PASSWORD não está definido" 
}
```

## 🧪 Executar Testes

Depois de configurar as credenciais:

```bash
# Executar todos os testes
npx playwright test

# Executar apenas testes de autenticação
npx playwright test auth.test.ts

# Executar apenas testes de pacientes
npx playwright test pacientes.test.ts

# Executar em modo UI (interativo)
npx playwright test --ui

# Executar com navegador visível
npx playwright test --headed
```

## 📝 Notas Importantes

- O arquivo `.env.test.local` está no `.gitignore` e **não será commitado**
- Use credenciais de **teste/staging**, nunca de produção
- Se os testes ainda estiverem sendo pulados, verifique se o arquivo `.env.test.local` está na **raiz do projeto** (mesmo nível do `package.json`)

