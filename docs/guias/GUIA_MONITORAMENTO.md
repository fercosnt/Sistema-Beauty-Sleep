# 📊 Guia: Monitoramento da Sincronização Biologix

## 🚀 Como Usar

### Opção 1: Script NPM (Recomendado)

```powershell
npm run monitor
```

ou

```powershell
npm run monitor:sync
```

### Opção 2: Execução Direta

```powershell
npx tsx scripts/monitor-sync-logs.ts
```

---

## 📋 O que o Script Mostra

### 1. Última Execução da Edge Function
- Data/hora da última execução
- Status (200 = sucesso)
- Total de exames encontrados
- Exames processados
- Exames criados/atualizados
- Erros (se houver)

### 2. Últimas 5 Execuções
- Histórico recente das sincronizações
- Status de cada execução
- Quantidade de exames processados

### 3. Estatísticas de Exames
- Total de exames sincronizados
- Exames dos últimos 7 dias
- Exames das últimas 24 horas
- Data/hora do último exame sincronizado

### 4. Status dos Pacientes
- Total de pacientes
- Quantos têm biologix_id
- Quantos estão sem biologix_id

### 5. Próxima Execução Automática
- Quando será a próxima execução do cron
- Quanto tempo falta

### 6. Links Úteis
- Link para o Dashboard do Supabase
- Link direto para os logs

---

## 📊 Exemplo de Saída

```
🔍 Monitorando Logs da Sincronização Biologix

============================================================

📡 1. Última Execução da Edge Function...
   📅 Data/Hora: 02/12/2025, 10:00:05
   ⏰ 2 horas atrás
   📊 Status: 200 ✅
   ✅ Sucesso: SIM
   📋 Total encontrado: 65 exames
   🔄 Processados: 54 exames
   ➕ Criados: 3 exames novos
   🔄 Atualizados: 51 exames existentes

📊 2. Últimas 5 Execuções...
   Encontradas 5 execuções recentes:

   1. 02/12/2025, 10:00:05
      Status: 200 ✅
      Processados: 54/65

   ...

📈 3. Estatísticas de Exames Sincronizados...
   📊 Total de exames: 2.547
   📅 Últimos 7 dias: 2.547
   🕐 Últimas 24h: 3
   ⏰ Último exame sincronizado: 02/12/2025, 10:00:05
      (2 horas atrás)

👥 4. Status dos Pacientes...
   📊 Total: 269
   ✅ Com biologix_id: 268 (99.6%)
   ⚠️  Sem biologix_id: 1

⏰ 5. Próxima Execução Automática...
   📅 Próxima execução: 03/12/2025, 10:00 (10h BRT)
   ⏳ Falta: 22h 30min

🔗 6. Links Úteis...
   📊 Dashboard: https://supabase.com/dashboard/...
   📋 Logs: https://supabase.com/dashboard/...

============================================================
✅ Monitoramento completo!
```

---

## ⏰ Quando Usar

### Uso Regular
- **Após cada execução automática** (10h BRT diariamente)
- Verificar se tudo está funcionando corretamente

### Uso de Diagnóstico
- Quando suspeitar de problemas na sincronização
- Antes de fazer alterações no sistema
- Para verificar se há erros recorrentes

### Uso de Monitoramento
- Executar periodicamente para acompanhar o progresso
- Verificar se novos exames estão sendo sincronizados
- Monitorar a taxa de sucesso

---

## 🔍 Interpretando os Resultados

### ✅ Tudo OK
- Status 200 nas execuções
- Exames sendo criados/atualizados
- Poucos ou nenhum erro
- Última execução recente (< 24h)

### ⚠️ Atenção
- Erros na última execução
- Muitos exames sem processar
- Última execução antiga (> 24h)
- Muitos pacientes sem biologix_id

### ❌ Problema
- Status diferente de 200
- Nenhuma execução recente
- Erros recorrentes
- Nenhum exame sendo sincronizado

---

## 💡 Dicas

1. **Execute regularmente** após as 10h BRT para verificar a execução diária
2. **Compare resultados** entre execuções para identificar padrões
3. **Verifique erros** se houver muitos exames com erro
4. **Monitore pacientes** para garantir que biologix_id está sendo preenchido

---

## 🔗 Links Relacionados

- **Script de verificação completa:** `npx tsx scripts/test-biologix-sync-complete.ts`
- **Teste de conexão:** `npx tsx scripts/test-biologix-connection.ts`
- **Verificação do sistema:** `npx tsx scripts/verify-system.ts`

---

**Comando rápido:** `npm run monitor` 🚀

