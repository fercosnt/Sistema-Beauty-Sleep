# 🎮 Guia de Gamificação - Migração de Sessões

**Versão:** 1.0  
**Data:** 27 de Novembro de 2025  
**Objetivo:** Motivar a equipe durante a migração manual de sessões através de gamificação

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Leaderboard](#leaderboard)
3. [Atualizações Diárias](#atualizações-diárias)
4. [Celebração de Marcos](#celebração-de-marcos)
5. [Como Usar](#como-usar)

---

## 🎯 Visão Geral

A gamificação foi implementada para tornar a migração manual de sessões mais engajadora e motivadora. Inclui:

- ✅ **Leaderboard**: Ranking de quem registrou mais sessões hoje
- ✅ **Atualizações Diárias**: Mensagens automáticas sobre progresso
- ✅ **Celebração de Marcos**: Notificações quando atingir 25%, 50%, 75%, 90% e 100%
- ✅ **Celebração Final**: Mensagem especial quando migração completa

---

## 🏆 Leaderboard

### Funcionalidades

**Página:** `/migracao/leaderboard`

**Recursos:**
- ✅ Ranking em tempo real de usuários por sessões registradas hoje
- ✅ Top 3 destacado com ícones de medalha (🥇🥈🥉)
- ✅ Estatísticas gerais (sessões hoje, total, esperado, % completo)
- ✅ Atualização automática a cada minuto
- ✅ Mostra total de sessões de cada usuário

### Como Acessar

1. Acesse `/migracao/leaderboard` no navegador
2. O leaderboard será exibido automaticamente
3. Atualiza a cada minuto automaticamente

### Visualização

- **1º Lugar**: Fundo amarelo claro, ícone de troféu 🏆
- **2º Lugar**: Fundo cinza claro, ícone de medalha 🥈
- **3º Lugar**: Fundo laranja claro, ícone de prêmio 🥉
- **Demais**: Fundo branco, número da posição

---

## 📊 Atualizações Diárias

### Componente DailyUpdate

**Localização:** `app/migracao/components/DailyUpdate.tsx`

**Funcionalidades:**
- ✅ Exibe sessões registradas hoje
- ✅ Mostra sessões restantes
- ✅ Calcula percentual completo
- ✅ Gera mensagens motivacionais baseadas no progresso
- ✅ Atualiza automaticamente a cada minuto

### Mensagens Geradas

**Baseadas no progresso:**
- 🚀 Excelente! (20+ sessões hoje)
- 👍 Bom trabalho! (10-19 sessões hoje)
- 📊 Progresso normal (<10 sessões hoje)
- ✅ Todas as sessões registradas (100% completo)
- 📋 Nenhuma sessão hoje (incentivo para começar)

### Script de Atualização Diária

**Localização:** `scripts/send-daily-update.ts`

**Uso:**
```bash
tsx scripts/send-daily-update.ts
```

**Saída:**
```
📊 Atualização Diária - Migração de Sessões

📅 Data: 27/11/2025

📈 Progresso:
   • Sessões registradas hoje: 15 (+5 vs ontem)
   • Total registrado: 1250
   • Total esperado: 1300
   • Sessões restantes: 50
   • Percentual completo: 96.2%

🏆 Top 3 de Hoje:
   🥇 João Silva: 8 sessões
   🥈 Maria Santos: 5 sessões
   🥉 Pedro Costa: 2 sessões
```

**Integração:**
- Pode ser executado manualmente
- Pode ser configurado como cron job para enviar via email/Slack/WhatsApp
- Mensagem pode ser copiada e enviada manualmente

---

## 🎉 Celebração de Marcos

### Componente MilestoneCelebration

**Localização:** `app/migracao/components/MilestoneCelebration.tsx`

**Marcos:**
- 📈 **25%**: "25% Concluído! Continue assim!"
- 🎉 **50%**: "50% Concluído! Metade do caminho!"
- 🎉 **75%**: "75% Concluído! Excelente progresso!"
- 🎊 **90%**: "90% Concluído! Quase lá!"
- 🎉🎊🎉 **100%**: "100% CONCLUÍDO! MIGRAÇÃO COMPLETA!"

### Funcionalidades

- ✅ Modal automático quando atinge um marco
- ✅ Usa localStorage para não repetir celebração do mesmo marco
- ✅ Barra de progresso visual
- ✅ Mensagens motivacionais
- ✅ Celebração especial para 100% completo

### Comportamento

- Modal aparece automaticamente quando percentual passa de um marco
- Fecha ao clicar fora ou no botão de fechar
- Não aparece novamente para o mesmo marco (usando localStorage)

---

## 🚀 Como Usar

### Para a Equipe

1. **Acessar Leaderboard:**
   - Navegue para `/migracao/leaderboard`
   - Veja seu ranking e o dos colegas
   - Continue registrando sessões para subir no ranking!

2. **Ver Atualizações:**
   - As atualizações aparecem automaticamente no leaderboard
   - Ou execute o script manualmente para ver mensagem completa

3. **Celebrar Marcos:**
   - Os marcos são celebrados automaticamente
   - Apenas continue trabalhando e os modais aparecerão!

### Para Administradores

1. **Monitorar Progresso:**
   - Acesse `/migracao/leaderboard` regularmente
   - Verifique estatísticas gerais
   - Identifique membros da equipe que precisam de apoio

2. **Enviar Atualizações:**
   - Execute `tsx scripts/send-daily-update.ts`
   - Copie a mensagem gerada
   - Envie via Slack/WhatsApp/Email para a equipe

3. **Configurar Cron Job (Opcional):**
   ```bash
   # Executar diariamente às 18h
   0 18 * * * cd /caminho/do/projeto && tsx scripts/send-daily-update.ts
   ```

---

## 📊 Métricas e Estatísticas

### Estatísticas Exibidas

- **Sessões Hoje**: Total de sessões registradas hoje
- **Total Registrado**: Total acumulado de sessões
- **Total Esperado**: Soma de `sessoes_compradas` de pacientes ativos/finalizados
- **% Completo**: Percentual de conclusão da migração

### Cálculos

```typescript
percentualCompleto = (totalRegistrado / totalEsperado) * 100
sessoesRestantes = totalEsperado - totalRegistrado
```

---

## 🎨 Personalização

### Alterar Frequência de Atualização

**No componente DailyUpdate e Leaderboard:**
```typescript
// Alterar de 60000ms (1 minuto) para outro valor
const interval = setInterval(fetchData, 30000) // 30 segundos
```

### Adicionar Novos Marcos

**No componente MilestoneCelebration:**
```typescript
const milestones = [
  { threshold: 100, message: '100% CONCLUÍDO!', emoji: '🎉🎊🎉' },
  { threshold: 90, message: '90% Concluído!', emoji: '🎊' },
  // Adicionar novo marco aqui
  { threshold: 10, message: '10% Concluído!', emoji: '🎯' },
]
```

### Personalizar Mensagens

**No componente DailyUpdate:**
```typescript
const generateMessage = (sessoesHoje, sessoesRestantes, percentual) => {
  // Adicionar novas condições e mensagens
  if (sessoesHoje >= 30) {
    return `🔥 Incrível! ${sessoesHoje} sessões hoje!`
  }
  // ...
}
```

---

## 🔧 Troubleshooting

### Leaderboard não atualiza

**Solução:**
1. Verificar conexão com Supabase
2. Verificar se há sessões registradas hoje
3. Verificar console do navegador para erros

### Modal de celebração não aparece

**Solução:**
1. Verificar se percentual realmente passou do marco
2. Limpar localStorage: `localStorage.clear()`
3. Recarregar página

### Script de atualização diária não funciona

**Solução:**
1. Verificar variáveis de ambiente (`.env.local`)
2. Verificar conexão com Supabase
3. Verificar permissões RLS (usar SERVICE_ROLE_KEY)

---

## 📝 Exemplos de Uso

### Exemplo 1: Enviar Atualização Diária via Slack

```bash
# Executar script
tsx scripts/send-daily-update.ts > update.txt

# Enviar para Slack (usando webhook)
curl -X POST -H 'Content-type: application/json' \
  --data @update.txt \
  https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Exemplo 2: Enviar Atualização Diária via Email

```bash
# Executar script e enviar por email
tsx scripts/send-daily-update.ts | mail -s "Atualização Migração" equipe@exemplo.com
```

### Exemplo 3: Adicionar Link no Menu

Adicionar link no `Sidebar.tsx`:
```typescript
const navigation = [
  // ... outros itens
  { name: 'Leaderboard', href: '/migracao/leaderboard', icon: Trophy },
]
```

---

## ✅ Checklist de Implementação

- [x] Página de leaderboard criada
- [x] Componente de atualização diária criado
- [x] Componente de celebração de marcos criado
- [x] Script de atualização diária criado
- [x] Integração entre componentes
- [x] Atualização automática configurada
- [x] Documentação criada

---

## 🎯 Próximos Passos (Opcional)

- [ ] Adicionar link no menu principal
- [ ] Configurar envio automático de atualizações (email/Slack)
- [ ] Adicionar mais métricas (tempo médio, eficiência)
- [ ] Criar badges/achievements
- [ ] Adicionar histórico de marcos

---

**Última atualização:** 27 de Novembro de 2025  
**Versão do documento:** 1.0

