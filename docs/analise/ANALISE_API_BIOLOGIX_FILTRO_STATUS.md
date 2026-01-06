# 🔍 Análise: Filtro de Status na API Biologix

## 📋 Resumo

Após análise da documentação oficial da API Biologix e do código atual, **a API não suporta filtro por status nos query params**. A única forma de obter apenas exames concluídos (DONE) é filtrar no lado do cliente após buscar todos os exames.

## 📚 Documentação da API

### Endpoint: GET `/v2/partners/{partnerId}/exams`

**Query params suportados:**
- `offset` - Quantos resultados pular a partir do primeiro (padrão: 0)
- `limit` - Número máximo de objetos a retornar (padrão: máximo do sistema)

**❌ NÃO há parâmetro para filtrar por status**

### Status disponíveis na API

| Código | Significado | Descrição |
|--------|-------------|-----------|
| `0` | `ISSUED` | Autorização de exame |
| `1` | `STARTED` | Exame iniciado |
| `2` | `CANCELLED` | Cancelado pelo paciente |
| `3` | `SCHEDULED` | Agendado para processamento |
| `4` | `PROCESSING` | Processando |
| `5` | `ERROR` | Erro comum |
| `6` | `DONE` | ✅ **Sucesso / exame pronto** |
| `7` | `PROCESS_ERROR` | Erro de processamento |

## 🔍 Implementação Atual

### Código atual (`biologix-client.ts`)

```typescript
/**
 * Fetches all exams with status = DONE, handling pagination automatically
 */
async getAllDoneExams(): Promise<ExamDto[]> {
  const allExams: ExamDto[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await this.getExams(offset, limit);
    
    // Filter only DONE exams (status = 6)
    const doneExams = response.exams.filter(exam => exam.status === EXAM_STATUS.DONE);
    allExams.push(...doneExams);

    // Check if there are more pages
    if (offset + limit >= response.pagination.total) {
      hasMore = false;
    } else {
      offset += limit;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    }
  }

  return allExams;
}
```

### ✅ Vantagens da abordagem atual

1. **Funciona corretamente**: Filtra apenas exames DONE (status = 6)
2. **Paginação completa**: Busca todos os exames, não apenas os primeiros 100
3. **Rate limiting**: Aguarda 1 segundo entre páginas para evitar rate limiting
4. **Robustez**: Lida com erros e renova tokens automaticamente

### ⚠️ Desvantagens

1. **Ineficiência**: Busca TODOS os exames (incluindo ISSUED, STARTED, PROCESSING, etc.) e filtra no cliente
2. **Mais requisições**: Se houver muitos exames não-DONE, faz mais requisições do que necessário
3. **Mais dados transferidos**: Transfere dados de exames que não serão usados

## 💡 Possíveis Otimizações

### Opção 1: Manter como está (Recomendado)

**Vantagens:**
- ✅ Funciona perfeitamente
- ✅ Código simples e manutenível
- ✅ Não depende de features não documentadas da API

**Desvantagens:**
- ⚠️ Pode ser ineficiente se houver muitos exames não-DONE

**Quando usar:** Quando a maioria dos exames já está DONE ou quando o volume total não é muito grande.

### Opção 2: Buscar apenas últimas páginas primeiro

**Estratégia:**
- Assumir que exames mais recentes têm maior probabilidade de estar DONE
- Buscar de trás para frente (últimas páginas primeiro)
- Parar quando encontrar uma página sem exames DONE

**Vantagens:**
- ✅ Pode reduzir número de requisições se exames antigos estão em outros status
- ✅ Mais eficiente para exames recentes

**Desvantagens:**
- ⚠️ Código mais complexo
- ⚠️ Ainda precisa buscar todas as páginas para garantir completude

### Opção 3: Cache de exames já processados

**Estratégia:**
- Manter registro dos últimos `biologix_exam_id` processados
- Buscar apenas exames novos ou atualizados desde última sincronização
- Usar `offset=0` e processar apenas primeiras páginas

**Vantagens:**
- ✅ Muito mais eficiente para sincronizações incrementais
- ✅ Reduz drasticamente número de requisições

**Desvantagens:**
- ⚠️ Requer lógica adicional de cache
- ⚠️ Pode perder exames se houver problemas no cache

## 🎯 Recomendação

### Para sincronização diária (cron job)

**Manter implementação atual** porque:
1. Garante que todos os exames DONE são sincronizados
2. Código é simples e confiável
3. Rate limiting já está implementado
4. Volume de dados não justifica complexidade adicional

### Para sincronização incremental (futuro)

**Implementar Opção 3 (cache)** quando:
- Volume de exames crescer significativamente
- Sincronização diária ficar muito lenta
- Houver necessidade de sincronização em tempo real

## 📊 Estatísticas Atuais

- **Total de exames na API**: ~65 exames DONE (última sincronização)
- **Tempo de sincronização**: ~10-15 segundos
- **Requisições necessárias**: 1-2 requisições (com limit=100)

**Conclusão:** A implementação atual é adequada para o volume atual. Não há necessidade de otimização imediata.

## 🔄 Outros Status que Podem Ser Úteis

### Status que podem ser úteis no futuro:

1. **PROCESSING (4)**: 
   - Poderia ser usado para mostrar "exame em processamento" na UI
   - Atualmente não é sincronizado

2. **ERROR (5) e PROCESS_ERROR (7)**:
   - Poderia ser usado para alertas de exames com erro
   - Atualmente não é sincronizado

3. **CANCELLED (2)**:
   - Poderia ser usado para marcar exames cancelados
   - Atualmente não é sincronizado

### Recomendação para outros status:

**Não sincronizar outros status por enquanto** porque:
- ✅ Foco atual é em exames concluídos (DONE)
- ✅ Outros status não têm dados completos (`result` só existe quando DONE)
- ✅ Adiciona complexidade sem benefício imediato

**Se necessário no futuro:**
- Criar método `getAllExamsByStatus(status: number)` similar ao `getAllDoneExams()`
- Adicionar lógica para tratar cada status adequadamente

## 📝 Conclusão

1. ✅ **API não suporta filtro por status** - confirmado na documentação
2. ✅ **Implementação atual está correta** - filtra DONE no cliente
3. ✅ **Não há necessidade de mudança imediata** - funciona bem para o volume atual
4. ⚠️ **Otimizações futuras possíveis** - mas não urgentes

## 🔗 Referências

- Documentação oficial: `docs origem/Manual_API_Biologix_exames.md`
- Código atual: `supabase/functions/sync-biologix/biologix-client.ts`
- Tipos: `supabase/functions/sync-biologix/types.ts`

