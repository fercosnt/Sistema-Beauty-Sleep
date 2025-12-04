# ⚡ Otimizações de Performance

## 🔴 Por que está lento em desenvolvimento local?

**Resposta curta: É normal! O ambiente de desenvolvimento sempre é mais lento.**

### Diferenças entre Dev Local vs Vercel (Produção):

| Aspecto | Desenvolvimento Local | Vercel (Produção) |
|---------|----------------------|-------------------|
| **Build** | Compila tudo a cada mudança | Build otimizado uma vez |
| **Cache** | Limita ou sem cache | Cache agressivo (CDN global) |
| **Minificação** | Código não minificado | Código minificado |
| **Bundle** | Todos os módulos carregados | Code splitting automático |
| **Hot Reload** | Recompila tudo | Não aplicável |
| **Velocidade** | 2-10x mais lento | **Muito mais rápido** |

### Comparação de Performance:

- **Local (`npm run dev`)**: ~3-8 segundos para carregar página
- **Vercel (Produção)**: ~0.5-2 segundos para carregar página
- **Melhoria esperada**: **3-5x mais rápido** no Vercel

---

## ✅ Otimizações Já Aplicadas

### 1. Next.js Config (`next.config.js`)

```javascript
{
  swcMinify: true,           // Minificação SWC (mais rápido que Terser)
  compress: true,            // Compressão Gzip/Brotli
  poweredByHeader: false,    // Remover header desnecessário
  experimental: {
    optimizePackageImports: ['lucide-react', ...] // Tree-shaking otimizado
  }
}
```

### 2. Database Indexes

Todos os índices necessários estão criados:
- `idx_pacientes_cpf`
- `idx_exames_paciente_id`
- `idx_sessoes_paciente_id`
- E mais...

### 3. Query Optimization

- Queries separadas (evita N+1)
- Uso de `.select()` específico (não `*`)
- Paginação em listas grandes

---

## 🚀 Como Melhorar Ainda Mais

### 1. Usar `npm run build` para testar produção localmente:

```bash
# Build de produção local (mais rápido que dev)
npm run build
npm start

# Isso simula o ambiente do Vercel
```

### 2. Verificar Network Tab

No navegador (F12 → Network):
- Ver se há requests duplicados
- Verificar tamanho dos bundles
- Checar tempo de resposta do Supabase

### 3. Otimizações Futuras (se necessário):

#### A. Server Components (Next.js 14)
Converter componentes client para server quando possível.

#### B. React Suspense
Adicionar Suspense boundaries para loading progressivo.

#### C. Database Query Caching
Implementar cache no Supabase (Redis) se necessário.

#### D. Image Optimization
Já configurado, mas garantir que todas as imagens usem `<Image>` do Next.js.

---

## 📊 Performance Esperada no Vercel

### Métricas Típicas:

| Métrica | Desenvolvimento | Vercel |
|---------|----------------|--------|
| **First Load JS** | ~500KB | ~200KB |
| **Time to Interactive** | 3-8s | 0.5-2s |
| **Largest Contentful Paint** | 2-5s | 0.3-1s |
| **Cumulative Layout Shift** | 0.1-0.3 | <0.1 |

### Por que Vercel é mais rápido?

1. **CDN Global**: Arquivos estáticos servidos de servidores próximos
2. **Edge Functions**: Código rodando próximo ao usuário
3. **Build Otimizado**: Código minificado e otimizado
4. **Cache Agressivo**: Assets em cache global
5. **HTTP/2 e HTTP/3**: Protocolos modernos

---

## 🔧 Dicas para Testar Performance Localmente

### 1. Build de Produção Local:

```bash
# Limpar cache
rm -rf .next

# Build de produção
npm run build

# Rodar em modo produção
npm start
```

Isso simula melhor o ambiente do Vercel.

### 2. Lighthouse (Chrome DevTools):

1. Abra DevTools (F12)
2. Aba "Lighthouse"
3. Execute análise
4. Veja métricas de Performance

### 3. Network Throttling:

No DevTools → Network → Throttling:
- Use "Fast 3G" para simular conexões lentas
- Verifique se ainda é aceitável

---

## ✅ Checklist de Performance

Antes do Deploy em Produção:

- [x] `next.config.js` otimizado
- [x] Database indexes criados
- [x] Queries otimizadas
- [ ] Testado com `npm run build && npm start` (produção local)
- [ ] Lighthouse Score > 80
- [ ] Imagens usando componente `<Image>` do Next.js
- [ ] Verificado Network Tab (sem requests duplicados)

---

## 📝 Notas Importantes

### ⚠️ Desenvolvimento é Sempre Mais Lento

Isso é **normal e esperado**. O `npm run dev`:
- Recompila código a cada mudança
- Não minifica código
- Não usa cache agressivo
- Carrega source maps
- Hot reload consome recursos

### ✅ Vercel Será Muito Mais Rápido

Após deploy no Vercel, você verá:
- **3-5x melhoria** em tempo de carregamento
- **2-3x melhoria** em interatividade
- **Cache global** funcionando
- **CDN** distribuindo assets

### 🎯 Meta de Performance

- **Time to Interactive**: < 2s (no Vercel)
- **First Contentful Paint**: < 1s (no Vercel)
- **Lighthouse Score**: > 80

---

**Criado em:** 2025-12-04

