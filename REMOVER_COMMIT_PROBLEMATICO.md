# 🔒 Guia: Remover Commit com Credenciais Expostas do GitHub

## ⚠️ ATENÇÃO CRÍTICA

Este processo reescreve o histórico do Git e pode afetar outros colaboradores.
Certifique-se de:
- ✅ **Rotacionar todas as credenciais expostas** (se eram reais)
- ✅ **Avisar todos os colaboradores** sobre a mudança
- ✅ **Ter backup do repositório** antes de começar

---

## 📋 Opção 1: Remover Arquivos Específicos do Histórico (Recomendado)

### Passo 1: Instalar git-filter-repo (se necessário)

```bash
# Windows (com pip)
pip install git-filter-repo

# Ou baixar de: https://github.com/newren/git-filter-repo/releases
```

### Passo 2: Fazer backup do repositório

```bash
# Criar backup completo
git clone --mirror https://github.com/fercosnt/Sistema-Beauty-Sleep.git backup-repo.git
```

### Passo 3: Remover os arquivos problemáticos do histórico

```bash
# Remover os arquivos de documentação que continham exemplos de credenciais
git filter-repo --path docs/guias/CONFIGURAR_SMTP_SUPABASE.md --invert-paths
git filter-repo --path docs/guias/TROUBLESHOOTING_ERRO_SMTP_UPSTREAM.md --invert-paths

# OU: Remover conteúdo específico mantendo os arquivos
git filter-repo --replace-text <(echo "SG\\.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==>[SUA_API_KEY_SENDGRID_COMPLETA]")
git filter-repo --replace-text <(echo "AKIAIOSFODNN7EXAMPLE==>[SEU_USERNAME_SMTP_AWS]")
git filter-repo --replace-text <(echo "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY==>[SUA_SENHA_SMTP_AWS]")
```

### Passo 4: Verificar as mudanças

```bash
# Ver o histórico atualizado
git log --oneline -10

# Verificar se os arquivos problemáticos foram removidos
git log --all --full-history -- docs/guias/CONFIGURAR_SMTP_SUPABASE.md
```

### Passo 5: Forçar push para o GitHub

```bash
# ⚠️ ATENÇÃO: Isso sobrescreve o histórico no GitHub
git push origin --force --all
git push origin --force --tags
```

---

## 📋 Opção 2: Remover o Commit Específico (Mais Simples)

### Passo 1: Identificar o commit

```bash
git log --oneline
# Encontre: 7c11115 feat: melhorias no modal de novo paciente...
```

### Passo 2: Reverter o commit

```bash
# Reverter o commit (cria um novo commit que desfaz as mudanças)
git revert 7c11115
```

### Passo 3: Push normal

```bash
git push origin main
```

**Limitação:** Esta opção não remove o commit do histórico, apenas cria um novo commit que desfaz as mudanças. O commit problemático ainda estará visível.

---

## 📋 Opção 3: Rebase Interativo (Remover commit do histórico)

### Passo 1: Fazer backup

```bash
git branch backup-before-rebase
```

### Passo 2: Rebase interativo

```bash
# Rebase dos últimos 10 commits (ou o número necessário)
git rebase -i HEAD~10
```

No editor que abrir:
- Encontre a linha do commit `7c11115`
- Mude `pick` para `drop` ou simplesmente delete a linha
- Salve e feche

### Passo 3: Force push

```bash
git push origin --force main
```

---

## 🔐 Passo CRÍTICO: Rotacionar Credenciais

**MESMO APÓS REMOVER DO GIT, AS CREDENCIAIS PODEM TER SIDO COMPROMETIDAS!**

1. **SendGrid:**
   - Acesse: https://app.sendgrid.com/settings/api_keys
   - Delete a API Key exposta
   - Crie uma nova API Key
   - Atualize no Supabase Dashboard

2. **AWS SES:**
   - Acesse: AWS Console → IAM → Users
   - Delete ou rotacione as credenciais SMTP expostas
   - Crie novas credenciais SMTP
   - Atualize no Supabase Dashboard

3. **Outros provedores SMTP:**
   - Revogue todas as credenciais expostas
   - Crie novas credenciais
   - Atualize no Supabase Dashboard

---

## 📢 Avisar Colaboradores

Se outros desenvolvedores trabalham no projeto:

```bash
# Enviar aviso aos colaboradores
# (Crie uma issue ou envie email explicando)
```

**Mensagem sugerida:**
```
ATENÇÃO: O histórico do Git foi reescrito para remover credenciais expostas.

Se você tem uma cópia local do repositório, execute:

git fetch origin
git reset --hard origin/main

Isso sincronizará seu repositório local com o histórico atualizado.
```

---

## ✅ Verificação Final

Após o processo:

1. ✅ Verifique no GitHub que o commit não aparece mais
2. ✅ Verifique que os arquivos corrigidos estão presentes
3. ✅ Teste que o repositório ainda funciona corretamente
4. ✅ Confirme que as novas credenciais estão configuradas no Supabase

---

## 🆘 Se algo der errado

Se o processo falhar, você pode restaurar do backup:

```bash
git clone backup-repo.git
cd backup-repo.git
# Analise o que deu errado e tente novamente
```

---

**Última atualização:** 2025-01-XX

