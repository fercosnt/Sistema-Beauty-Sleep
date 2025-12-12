# Guia: Resolver Erro EBUSY com OneDrive

## Problema

Ao executar `npm run dev` em um projeto Next.js dentro de uma pasta do OneDrive, você pode encontrar erros como:

```
[Error: EBUSY: resource busy or locked, open '.next/server/middleware-react-loadable-manifest.js']
```

Isso acontece porque o OneDrive tenta sincronizar os arquivos da pasta `.next` enquanto o Next.js está escrevendo neles.

## Soluções

### Solução 1: Configurar OneDrive para Não Sincronizar `.next` (Recomendado)

1. **Criar arquivo `.onedriveignore`** (já criado na raiz do projeto)
   - Este arquivo instrui o OneDrive a ignorar certas pastas
   - A pasta `.next/` já está incluída

2. **Configurar exclusão manual no OneDrive:**
   - Abra as configurações do OneDrive
   - Vá em "Backup" → "Gerenciar backup"
   - Adicione a pasta `.next` às exclusões

### Solução 2: Mover o Projeto para Fora do OneDrive

Se possível, mova o projeto para uma pasta local que não seja sincronizada pelo OneDrive:

```powershell
# Exemplo: mover para C:\dev\ ao invés de OneDrive
```

### Solução 3: Pausar Sincronização Temporariamente

Durante o desenvolvimento, você pode pausar a sincronização do OneDrive:

1. Clique no ícone do OneDrive na bandeja do sistema
2. Clique em "Pausar sincronização" → "2 horas"

### Solução 4: Usar WSL2 (Windows Subsystem for Linux)

Se você tem WSL2 instalado, pode desenvolver dentro do WSL2 onde o OneDrive não interfere:

```bash
# No WSL2
cd /mnt/c/Users/.../projeto
npm run dev
```

## Verificação

Após aplicar a Solução 1, reinicie o servidor de desenvolvimento:

```powershell
# Parar o servidor (Ctrl+C)
# Limpar cache
Remove-Item -Recurse -Force .next
# Reiniciar
npm run dev
```

## Nota sobre Erros de Refresh Token

Os erros `[AuthApiError: Invalid Refresh Token]` são normais e não afetam o funcionamento. Eles ocorrem quando:
- A sessão expirou
- O usuário fez logout
- O token de refresh não está mais válido

Esses erros são tratados automaticamente pelo sistema de autenticação.

