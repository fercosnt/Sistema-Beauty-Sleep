#!/bin/bash
# Script de Teste da API Biologix
# Execute: bash scripts/test-biologix-api.sh
# 
# ⚠️ IMPORTANTE: Configure as variáveis no arquivo .env.local na raiz do projeto

# Função para carregar variáveis do .env.local
load_env_file() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local env_path="$script_dir/../.env.local"
    
    if [ ! -f "$env_path" ]; then
        echo "❌ Erro: Arquivo .env.local não encontrado!" >&2
        echo "   Crie o arquivo .env.local na raiz do projeto com as seguintes variáveis:" >&2
        echo "   BIOLOGIX_USERNAME=seu_username" >&2
        echo "   BIOLOGIX_PASSWORD=sua_senha" >&2
        echo "   BIOLOGIX_SOURCE=100" >&2
        echo "   BIOLOGIX_PARTNER_ID=seu_partner_id" >&2
        exit 1
    fi
    
    # Carregar variáveis do arquivo .env.local
    while IFS= read -r line || [ -n "$line" ]; do
        # Ignorar linhas vazias e comentários
        if [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]; then
            continue
        fi
        
        # Remover espaços em branco
        line=$(echo "$line" | xargs)
        
        # Extrair chave e valor (lidar com espaços ao redor do =)
        if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
            key=$(echo "${BASH_REMATCH[1]}" | xargs)
            value=$(echo "${BASH_REMATCH[2]}" | xargs)
            # Remover aspas se existirem
            value="${value#\"}"
            value="${value%\"}"
            value="${value#\'}"
            value="${value%\'}"
            export "$key=$value"
        fi
    done < "$env_path"
}

# Carregar variáveis de ambiente
load_env_file

# Configuracao - Valores do .env.local
BIOLOGIX_USERNAME="${BIOLOGIX_USERNAME}"
BIOLOGIX_PASSWORD="${BIOLOGIX_PASSWORD}"
BIOLOGIX_SOURCE="${BIOLOGIX_SOURCE:-100}"
BIOLOGIX_PARTNER_ID="${BIOLOGIX_PARTNER_ID}"
BIOLOGIX_BASE_URL="https://api.biologixsleep.com"

# Validar variáveis obrigatórias
if [ -z "$BIOLOGIX_USERNAME" ] || [ -z "$BIOLOGIX_PASSWORD" ] || [ -z "$BIOLOGIX_PARTNER_ID" ]; then
    echo "❌ Erro: Variáveis obrigatórias não encontradas no .env.local!" >&2
    echo "   Verifique se as seguintes variáveis estão configuradas:" >&2
    echo "   - BIOLOGIX_USERNAME" >&2
    echo "   - BIOLOGIX_PASSWORD" >&2
    echo "   - BIOLOGIX_PARTNER_ID" >&2
    exit 1
fi

echo "=== Teste da API Biologix ==="
echo ""

# 1. Abrir Sessao
echo "[1] Abrindo sessao..."

AUTH_STRING="${BIOLOGIX_USERNAME}:${BIOLOGIX_PASSWORD}"
AUTH_BASE64=$(echo -n "$AUTH_STRING" | base64)

SESSION_BODY=$(cat <<EOF
{
  "username": "$BIOLOGIX_USERNAME",
  "password": "$BIOLOGIX_PASSWORD",
  "source": $BIOLOGIX_SOURCE
}
EOF
)

SESSION_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BIOLOGIX_BASE_URL/v2/sessions" \
  -H "Content-Type: application/json" \
  -H "Authorization: basic $AUTH_BASE64" \
  -d "$SESSION_BODY")

HTTP_CODE=$(echo "$SESSION_RESPONSE" | tail -n1)
SESSION_BODY=$(echo "$SESSION_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "[OK] Sessao aberta com sucesso!"
  USER_ID=$(echo "$SESSION_BODY" | jq -r '.userId')
  TOKEN=$(echo "$SESSION_BODY" | jq -r '.sessionId')
  CENTER_ID=$(echo "$SESSION_BODY" | jq -r '.centerId')
  echo "  UserId: $USER_ID"
  echo "  SessionId: $TOKEN"
  echo "  CenterId: $CENTER_ID"
else
  echo "[ERRO] Falha ao abrir sessao (HTTP $HTTP_CODE)"
  echo "Resposta: $SESSION_BODY"
  exit 1
fi

echo ""

# 2. Buscar Exames
echo "[2] Buscando exames..."

OFFSET=0
LIMIT=10  # Limite para teste

EXAMS_URL="$BIOLOGIX_BASE_URL/v2/partners/$BIOLOGIX_PARTNER_ID/exams?offset=$OFFSET&limit=$LIMIT"

EXAMS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$EXAMS_URL" \
  -H "Authorization: basic $AUTH_BASE64")

HTTP_CODE=$(echo "$EXAMS_RESPONSE" | tail -n1)
EXAMS_BODY=$(echo "$EXAMS_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "[OK] Exames recuperados com sucesso!"
  TOTAL=$(echo "$EXAMS_BODY" | jq -r '.total')
  COUNT=$(echo "$EXAMS_BODY" | jq -r '.items | length')
  echo "  Total de exames: $TOTAL"
  echo "  Exames retornados: $COUNT"
  
  if [ "$COUNT" -gt 0 ]; then
    echo ""
    echo "Primeiros exames:"
    echo "$EXAMS_BODY" | jq -r '.items[0:3][] | "  - ID: \(.id) | Tipo: \(.type) | Status: \(.status) | Data: \(.examDate)"'
  fi
else
  echo "[ERRO] Falha ao buscar exames (HTTP $HTTP_CODE)"
  echo "Resposta: $EXAMS_BODY"
  exit 1
fi

echo ""
echo "=== Teste Concluido ==="

