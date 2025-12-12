# 🚨 AÇÃO IMEDIATA NECESSÁRIA - Segurança

## ⚠️ PROBLEMA CRÍTICO ENCONTRADO

Uma senha da API Biologix foi encontrada em múltiplos arquivos do repositório:
- **Senha exposta:** `oA6fGc5qaNw4Dhre`
- **Arquivos afetados:** 5 arquivos (já corrigidos)

## ✅ CORREÇÕES APLICADAS

Todos os arquivos foram corrigidos e a senha foi removida. **PORÉM**, a senha ainda pode estar no histórico do Git.

## 🔴 AÇÕES URGENTES NECESSÁRIAS

### 1. **ROTACIONAR A SENHA IMEDIATAMENTE** ⚠️ CRÍTICO
   - Acesse o painel da API Biologix
   - Altere a senha `oA6fGc5qaNw4Dhre` para uma nova senha
   - Atualize os secrets no Supabase com a nova senha:
     ```bash
     npx supabase secrets set BIOLOGIX_PASSWORD=nova_senha_aqui
     ```

### 2. **LIMPAR HISTÓRICO DO GIT** ⚠️ IMPORTANTE
   A senha pode estar em commits antigos. Opções:

   **Opção A - Usar git-filter-repo (Recomendado):**
   ```bash
   # Instalar git-filter-repo
   pip install git-filter-repo
   
   # Remover senha do histórico
   git filter-repo --invert-paths --path-glob '*.json' --path-glob '*.md' \
     --replace-text <(echo 'oA6fGc5qaNw4Dhre==>[SENHA_REMOVIDA]')
   ```

   **Opção B - Usar BFG Repo-Cleaner:**
   ```bash
   # Baixar BFG: https://rtyley.github.io/bfg-repo-cleaner/
   java -jar bfg.jar --replace-text passwords.txt
   ```

   **Opção C - Revisar commits manualmente:**
   ```bash
   # Ver commits que contêm a senha
   git log -S "oA6fGc5qaNw4Dhre" --all --source --all
   ```

### 3. **VERIFICAR LOGS DE ACESSO** 📊
   - Revise logs de acesso da API Biologix
   - Procure por atividades suspeitas
   - Monitore acessos não autorizados

### 4. **ATUALIZAR SECRETS NO SUPABASE** 🔐
   Após rotacionar a senha, atualize:
   ```bash
   npx supabase secrets set BIOLOGIX_PASSWORD=nova_senha_segura
   ```

## 📋 CHECKLIST DE SEGURANÇA

- [ ] Senha rotacionada na API Biologix
- [ ] Secrets atualizados no Supabase
- [ ] Histórico do Git limpo (se aplicável)
- [ ] Logs de acesso revisados
- [ ] Monitoramento ativo configurado
- [ ] Equipe notificada sobre a mudança

## 🔍 ARQUIVOS CORRIGIDOS

1. ✅ `docs origem/Exame Ronco.json`
2. ✅ `docs/guias/DEPLOY_EDGE_FUNCTION.md`
3. ✅ `PRD/prd-beauty-sleep-sistema-base.md`
4. ✅ `docs/guias/TROUBLESHOOTING_EDGE_FUNCTION.md`
5. ✅ `env.local.example`

## 📞 SUPORTE

Se precisar de ajuda para limpar o histórico do Git ou rotacionar credenciais, consulte:
- [GitHub Docs - Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Supabase Secrets Documentation](https://supabase.com/docs/guides/functions/secrets)

---

**⚠️ IMPORTANTE:** Não commite este arquivo com a senha antiga. A senha já foi removida de todos os arquivos ativos.

