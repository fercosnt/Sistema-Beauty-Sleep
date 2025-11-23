# Manual da API de exames para o centro credenciado

**Autor:** Filipe Vilela Soares  
**Data:** 19/02/2025  
**Última revisão:** 19/02/2025  

Este manual descreve as APIs REST necessárias para a consulta dos exames de um centro credenciado Biologix.

---

## Parâmetros fornecidos pela Biologix

| Parâmetro | Descrição |
|---|---|
| `{username}` | Nome de usuário |
| `{senha}` | Senha |
| `{partnerId}` | ID do centro |

---

## Abertura de sessão / renovação de token

Para abrir uma sessão (ou renovar o token) e poder utilizar a área interna da API Biologix, é necessário realizar uma requisição com os seguintes parâmetros.

### Requisição

- **Método:** `POST`  
- **URL:** `https://api.biologixsleep.com/v2/sessions/open`  
- **Corpo (JSON):**
```json
{
  "username": "{username}",
  "password": "{senha}",
  "source": 100
}
```

Os parâmetros `{username}` e `{senha}` serão fornecidos pela Biologix ao cliente.

### Resposta (sucesso)

- **Código:** `200 OK`  
- **Cabeçalhos:**
  - `Bx-Session-Token: {token}`
- **Corpo (JSON):**
```json
{
  "sessionId": "{ID sessão}",
  "userId": "{ID usuário}",
  "tokenStart": "{início do token}",
  "mfaVerified": false
}
```

É necessário armazenar `{ID usuário}` e `{token}`, pois serão usados para autenticar as próximas requisições.

---

## Requisições autenticadas

Para efetuar requisições autenticadas, deve-se utilizar **Basic Auth**:

- **username:** `{ID usuário}`
- **password:** `{token}`

### Exemplo

Supondo:

- `{ID usuário}` = `4820681ER`
- `{token}` = `3bFk3sL429dk`

1. String de autenticação:
```
4820681ER:3bFk3sL429dk
```

2. Base64:
```
NDgyMDY4MUVSOjNiRmszc0w0Mjlkaw==
```

3. Cabeçalho final:
```
Authorization: basic NDgyMDY4MUVSOjNiRmszc0w0Mjlkaw==
```

O token normalmente dura **7 dias**. Se expirar, a API retorna `401 Unauthorized`, indicando que é preciso renovar.

---

## Obter lista de exames

Lista os exames de um centro credenciado. `{partnerId}` será fornecido pela Biologix.

### Requisição

- **Método:** `GET`  
- **URL:**  
`https://api.biologixsleep.com/v2/partners/{partnerId}/exams`

- **Cabeçalhos:**
  - `Authorization: <basic auth>`

- **Query params:**

| Query param | Descrição | Padrão |
|---|---|---|
| `offset` | Quantos resultados pular a partir do primeiro | `0` |
| `limit` | Número máximo de objetos a retornar | máximo do sistema |

### Resposta

- **Cabeçalhos:**

| Cabeçalho | Descrição |
|---|---|
| `X-Pagination-Limit` | Número máximo de objetos a retornar |
| `X-Pagination-Offset` | Quantos resultados pular a partir do primeiro |
| `X-Pagination-Total` | Total de resultados (sem paginação) |

- **Corpo (JSON):** `ExamDto`

---

## Estrutura `ExamDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `base` | `ExamBaseDto` | Disponível quando `status` ≠ `ISSUED` |
| `examId` | `string` | ID do exame |
| `examKey` | `string` | Chave para obter o laudo PDF |
| `status` | `number` | Status do processamento |
| `type` | `number` | Tipo do exame |
| `patientUserId` | `string` | ID do paciente |
| `result` | `ExamResultDto` | Disponível quando `status` = `DONE` |
| `patient` | `ExamPatientDto` | Dados do paciente |

### Valores de `status`

| Código | Significado |
|---|---|
| `0` | `ISSUED` – Autorização de exame |
| `1` | `STARTED` – Exame iniciado |
| `2` | `CANCELLED` – Cancelado pelo paciente |
| `3` | `SCHEDULED` – Agendado para processamento |
| `4` | `PROCESSING` – Processando |
| `5` | `ERROR` – Erro comum |
| `6` | `DONE` – Sucesso / exame pronto |
| `7` | `PROCESS_ERROR` – Erro de processamento |

### Valores de `type`

| Código | Tipo |
|---|---|
| `0` | Teste do Ronco Biologix |
| `1` | Exame do Sono Biologix |

---

## Estrutura `ExamBaseDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `startTime` | `string` | Data/hora de início (UTC) |
| `durationSecs` | `number` | Duração do exame em segundos |
| `conditions` | `string[]` | Condições marcadas no início |
| `treatments` | `string[]` | Tratamentos marcados no início |
| `symptoms` | `string[]` | Sintomas marcados |
| `illnesses` | `string[]` | Doenças marcadas |
| `medicines` | `string[]` | Medicamentos marcados |
| `weightKg` | `number` | Peso (kg) |
| `heightCm` | `number` | Altura (cm) |

---

## Estrutura `ExamResultDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `snoring` | `ExamResultSnoringDto` | Ronco, se ativado |
| `oximetry` | `ExamResultOximetryDto` | Oximetria, se ativado |
| `cardiology` | `ExamResultCardiologyDto` | Cardiologia, se ativado |

---

## Estrutura `ExamResultSnoringDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `validDurationSecs` | `number` | Duração da gravação |
| `snoringDurationSecs` | `number` | Tempo com ronco |
| `silentDurationPercent` | `number` | % do tempo em silêncio |
| `lowDurationPercent` | `number` | % com ronco baixo |
| `mediumDurationPercent` | `number` | % com ronco médio |
| `highDurationPercent` | `number` | % com ronco alto |

---

## Estrutura `ExamResultOximetryDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `validDurationSecs` | `number` | Tempo com dados válidos |
| `nbDesaturations` | `number` | Nº de dessaturações |
| `odi` | `number` | Índice de dessaturações de oxigênio (IDO) |
| `hypoxicBurden` | `number` | Carga hipóxica |
| `odiCategory` | `number` | Categoria do IDO |
| `spO2Min` | `number` | SpO2 mínimo (%) |
| `spO2Avg` | `number` | SpO2 médio (%) |
| `spO2Max` | `number` | SpO2 máximo (%) |
| `spO2Under90Secs` | `number` | Tempo SpO2 < 90% |
| `spO2Under80Secs` | `number` | Tempo SpO2 < 80% |
| `hrMin` | `number` | FC mínima (bpm) |
| `hrAvg` | `number` | FC média (bpm) |
| `hrMax` | `number` | FC máxima (bpm) |
| `sleepLatencySecs` | `number` | Latência do sono |
| `sleepDurationSecs` | `number` | Tempo total de sono |
| `sleepEfficiencyPercent` | `number` | Eficiência do sono |
| `wakeTimeAfterSleepSecs` | `number` | WASO |
| `nbHypoxemiaEvents` | `number` | Nº eventos de hipoxemia |
| `hypoxemiaTotalDurationSecs` | `number` | Duração total de hipoxemia |

### Valores de `odiCategory`

| Código | Categoria |
|---|---|
| `0` | Normal |
| `1` | Apneia do sono leve |
| `2` | Apneia do sono moderada |
| `3` | Apneia do sono acentuada |

---

## Estrutura `ExamResultCardiologyDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `afNotification` | `number` | Detecção de fibrilação atrial |

### Valores de `afNotification`

| Código | Significado |
|---|---|
| `0` | Negativa |
| `1` | Positiva |
| `< 0` | Inconclusivo |

---

## Estrutura `ExamPatientDto`

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Nome do paciente |
| `gender` | `string` | Sexo (`f`, `m`, `o`) |
| `email` | `string` | E-mail |
| `phone` | `string` | Telefone |
| `birthDate` | `string` | Data de nascimento |
| `age` | `number` | Idade no dia do exame |

### Valores de `gender`

| Código | Significado |
|---|---|
| `f` | Feminino |
| `m` | Masculino |
| `o` | Outro |

---

## Obter laudo PDF de um exame

Quando o exame estiver pronto (`status: DONE`), o laudo PDF pode ser obtido assim:

### Requisição

- **Método:** `GET`  
- **URL:**  
`https://api.biologixsleep.com/v2/exams/{examKey}/files/report.pdf`

**Observação:** esta requisição **não requer autenticação**.
