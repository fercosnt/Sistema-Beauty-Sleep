# ❓ FAQ - Perguntas Frequentes

## 10.4.7 - FAQ

**Versão:** 1.0  
**Data:** 2025-12-02

---

## 🔐 Acesso e Login

### Esqueci minha senha, como recuperar?

1. Na tela de login, clique em "Esqueci minha senha"
2. Digite seu email
3. Você receberá um email com link para redefinir senha
4. Siga as instruções do email

**Problemas?** Entre em contato com um Administrador.

---

### Não consigo fazer login

**Verifique:**
- Email e senha estão corretos
- Você está usando a URL correta do sistema
- Sua conta está ativa (não foi desativada)

**Se ainda não funcionar:** Entre em contato com um Administrador.

---

### Primeiro acesso - não entendo o sistema

O sistema tem um **Tour Guiado** que aparece na primeira vez. Se você pulou:

1. Acesse **Configurações** (menu do seu perfil)
2. Clique em **"Refazer Tour Guiado"**
3. Siga as instruções passo a passo

---

## 👤 Pacientes

### Como criar um paciente?

**Para Dentistas (Equipe):**
1. Menu → Pacientes → "Novo Paciente"
2. Preencha ID do Paciente (obrigatório)
3. Preencha CPF ou Documento Estrangeiro
4. Preencha nome e outros dados
5. Salve

**Para Recepção:** Não é possível. Peça a um dentista ou admin.

---

### Qual a diferença entre "ID do Paciente" e CPF?

- **ID do Paciente (biologix_id):** Identificador único do sistema Biologix. É o principal identificador.
- **CPF:** Usado para busca e validação, mas não é único no sistema.

**Sempre use o ID do Paciente como identificador principal!**

---

### Posso criar paciente sem CPF?

Sim! Use o campo "Documento Estrangeiro" para pacientes estrangeiros (passaporte, etc).

---

### O que significa cada status?

- **Lead:** Paciente cadastrado mas ainda não começou tratamento
- **Ativo:** Paciente em tratamento (tem sessões registradas)
- **Finalizado:** Paciente completou tratamento (todas sessões utilizadas)
- **Inativo:** Paciente desativado (não está mais em tratamento)

---

### Como alterar status de um paciente?

**Para Dentistas:**
1. Acesse o perfil do paciente
2. No header, selecione o novo status no dropdown
3. Se mudar para "Inativo", será pedido motivo

**Status muda automaticamente:**
- Lead → Ativo (ao criar primeira sessão)
- Ativo → Finalizado (quando sessões acabam, cálculo automático)

---

## 📝 Sessões

### Como registrar uma sessão?

1. Acesse o perfil do paciente
2. Clique em "Nova Sessão"
3. Preencha:
   - Data da sessão
   - Contador inicial
   - Contador final
   - Protocolo (tags) - opcional
   - Observações - opcional
4. Clique em "Criar Sessão"

**Campos obrigatórios:** Data, Contador Inicial, Contador Final

---

### O que são as tags/protocolos?

Tags identificam o protocolo usado na sessão:
- **Atropina:** Protocolo com atropina
- **Vonau:** Protocolo com Vonau
- **Nasal:** Protocolo nasal
- **Palato:** Protocolo palato
- **Língua:** Protocolo língua
- **Combinado:** Múltiplos protocolos

Você pode selecionar uma ou mais tags por sessão.

---

### Posso editar uma sessão depois de criada?

**Dentistas:** Apenas sessões que você criou  
**Admin:** Qualquer sessão

1. Aba "Sessões" no perfil do paciente
2. Clique em "Editar" na sessão
3. Altere os campos necessários
4. Salve

---

### O que acontece se contador final for menor que inicial?

O sistema não permite salvar. Verifique os valores:
- Contador Final deve ser maior que Inicial
- O sistema calcula automaticamente os pulsos utilizados

---

## 📊 Dashboard e Relatórios

### Por que vejo "--" no Dashboard?

**Recepção:** Valores numéricos são ocultados para proteger dados sensíveis. Isso é normal.

**Dentistas e Admin:** Veem todos os valores. Se você vê "--" e é dentista, entre em contato com suporte.

---

### Como vejo gráficos de evolução do paciente?

1. Acesse o perfil do paciente
2. Aba "Evolução"
3. Veja gráficos de:
   - IDO ao longo do tempo
   - Score de ronco
   - SpO2 médio
   - FC média

---

### O que significa "Adesão ao Tratamento"?

Adesão = (Sessões Utilizadas / Sessões Totais) × 100%

- **> 80%:** Excelente (verde)
- **50-80%:** Boa (amarelo)
- **< 50%:** Baixa (vermelho)

---

## 🔍 Busca e Navegação

### Como buscar paciente rapidamente?

**Pressione:** `Ctrl+K` (Windows) ou `Cmd+K` (Mac)

Ou clique no campo de busca no header.

**Busque por:**
- CPF (apenas números)
- Nome (parcial ou completo)
- Telefone

---

### Não encontro um paciente

**Tente:**
- Buscar apenas pelo ID do Paciente
- Verificar se está usando CPF correto (apenas números)
- Verificar se nome está escrito corretamente
- Usar busca parcial (apenas parte do nome)

---

## 👥 Usuários e Permissões

### Qual a diferença entre Admin, Equipe e Recepção?

- **Admin:** Acesso total (usuários, logs, tudo)
- **Equipe (Dentistas):** Pode criar pacientes, registrar sessões, ver tudo exceto usuários/logs
- **Recepção:** Apenas visualização (busca, dashboard, ações pendentes)

---

### Posso acessar /usuarios e /logs?

Apenas Administradores podem acessar essas páginas. Se você não é admin, será redirecionado.

---

### Por que não vejo botão "Novo Paciente"?

Se você tem role "Recepção", esse botão é ocultado. Apenas Admin e Equipe podem criar pacientes.

---

## 🏷️ Tags

### Como adicionar tag a um paciente?

1. Acesse o perfil do paciente
2. Na seção de Tags (header)
3. Clique em "+ Adicionar Tag"
4. Selecione a tag

**Quem pode:** Admin e Dentistas (Equipe)

---

### Onde vejo todas as tags disponíveis?

Menu → Configurações → Tags

Lá você pode ver, criar, editar e excluir tags (apenas Admin pode excluir).

---

## 📱 WhatsApp e Contato

### Como abrir WhatsApp do paciente?

No perfil do paciente, clique no ícone 📱 ao lado do telefone.

Isso abrirá WhatsApp Web com o número do paciente.

---

## 🔄 Sincronização

### Quando os exames são sincronizados?

Automaticamente todos os dias às **10h BRT** via cron job.

**Você não precisa fazer nada!** O sistema sincroniza automaticamente novos exames da API Biologix.

---

### Como vejo se um novo exame foi sincronizado?

1. Acesse o perfil do paciente
2. Aba "Exames"
3. Exames novos aparecem no topo
4. Veja badge "Novo" se foi criado há menos de 7 dias

---

## ⚠️ Problemas e Erros

### Erro ao salvar paciente: "ID do Paciente já cadastrado"

Um paciente com esse ID já existe. Verifique:
- Busque pelo ID do Paciente na lista
- Verifique se é o mesmo paciente
- Use ID diferente se for paciente novo

---

### Erro ao criar sessão

**Verifique:**
- Data da sessão está preenchida
- Contador Final > Contador Inicial
- Você tem permissão (não é Recepção)

---

### Página não carrega ou dá erro

1. Recarregue a página (F5)
2. Limpe cache do navegador
3. Verifique conexão com internet
4. Se persistir, entre em contato com suporte

---

## 🆘 Contato e Suporte

### Como entrar em contato com suporte?

**Email:** [email de suporte]  
**Slack/WhatsApp:** [link ou número]  
**Horário:** [horário de atendimento]

---

### Onde reportar bugs ou problemas?

Entre em contato com suporte informando:
- O que você estava fazendo
- O que deveria acontecer
- O que aconteceu de errado
- Screenshot (se possível)

---

**Última atualização:** 2025-12-02

