#!/bin/bash
# Script para preparar deploy em produção
# Verifica pré-requisitos e prepara o ambiente

set -e

echo "🚀 Preparando deploy em produção..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se está na branch main
echo "1. Verificando branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Você está na branch: $CURRENT_BRANCH${NC}"
    echo -e "${YELLOW}   Recomendado: fazer merge para main antes de deploy${NC}"
else
    echo -e "${GREEN}✅ Branch: $CURRENT_BRANCH${NC}"
fi

# 2. Verificar se há mudanças não commitadas
echo ""
echo "2. Verificando mudanças não commitadas..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Há mudanças não commitadas${NC}"
    echo "   Faça commit ou stash antes de continuar"
    exit 1
else
    echo -e "${GREEN}✅ Nenhuma mudança pendente${NC}"
fi

# 3. Executar testes
echo ""
echo "3. Executando testes..."
npm test || {
    echo -e "${RED}❌ Testes falharam${NC}"
    echo "   Corrija os testes antes de fazer deploy"
    exit 1
}
echo -e "${GREEN}✅ Todos os testes passaram${NC}"

# 4. Executar build
echo ""
echo "4. Executando build..."
npm run build || {
    echo -e "${RED}❌ Build falhou${NC}"
    echo "   Corrija os erros de build antes de continuar"
    exit 1
}
echo -e "${GREEN}✅ Build executado com sucesso${NC}"

# 5. Verificar variáveis de ambiente
echo ""
echo "5. Verificando variáveis de ambiente..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local não encontrado${NC}"
    echo "   Certifique-se de configurar as variáveis no Vercel Dashboard"
else
    echo -e "${GREEN}✅ .env.local encontrado${NC}"
fi

# 6. Verificar vercel.json
echo ""
echo "6. Verificando configuração do Vercel..."
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  vercel.json não encontrado${NC}"
    echo "   Vercel usará configuração padrão"
else
    echo -e "${GREEN}✅ vercel.json encontrado${NC}"
fi

# Resumo
echo ""
echo "=========================================="
echo -e "${GREEN}✅ Preparação concluída!${NC}"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo "1. Verificar variáveis de ambiente no Vercel Dashboard"
echo "2. Configurar Supabase Auth URLs"
echo "3. Fazer deploy: vercel --prod"
echo ""
echo "Guia completo: docs/deploy/GUIA_DEPLOY_PRODUCAO.md"


