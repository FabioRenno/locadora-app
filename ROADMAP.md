# ROADMAP.md

# Roadmap — Locadora App

Este roadmap organiza a evolução do projeto de forma prática, respeitando o estágio atual do produto: **MVP funcional em produção para testes**.

A ideia aqui não é prever tudo com rigidez, mas criar direção clara para evolução incremental.

---

## Estado atual

O Locadora App já possui:

- cadastro de locador
- cadastro de motorista
- login
- CRUD de veículos
- listagem pública
- manifestação de interesse
- painel do locador

O fluxo principal já existe e pode ser testado em ambiente real.

---

## Objetivo da fase atual

Consolidar o MVP e aprender com o uso real.

Nesta fase, a prioridade é:

- proteger o fluxo principal
- reduzir atrito
- aumentar clareza do produto
- corrigir falhas
- melhorar confiança e usabilidade básica

---

# Fase 1 — Consolidar o MVP atual

## Objetivo
Deixar o MVP mais estável, claro e confiável sem aumentar complexidade desnecessária.

## Prioridades
- revisar fluxos de cadastro e login
- revisar validações de formulário
- revisar mensagens de erro e feedback ao usuário
- revisar CRUD de veículos
- revisar fluxo de manifestação de interesse
- revisar painel do locador

## Entregas esperadas
- menos falhas no uso básico
- melhor entendimento do que está acontecendo em cada tela
- fluxo principal mais consistente

## Exemplos de melhorias
- impedir dados incompletos ou inválidos
- melhorar feedback visual em ações importantes
- garantir que apenas o locador correto veja e edite seus veículos
- garantir que interesses sejam registrados corretamente
- melhorar organização do painel

---

# Fase 2 — Melhorar a experiência de uso

## Objetivo
Tornar a navegação mais clara e tornar o produto mais útil para os dois lados.

## Prioridades
- melhorar a listagem pública de veículos
- melhorar visualização das informações principais do veículo
- criar filtros simples
- melhorar organização dos interessados no painel do locador

## Entregas esperadas
- motorista encontra veículos com mais facilidade
- locador entende melhor quem demonstrou interesse
- o produto passa sensação maior de utilidade e confiança

## Possíveis funcionalidades
- filtro por cidade
- filtro por modelo ou categoria
- filtro por faixa de valor
- status do veículo
- exibição mais clara dos dados principais do anúncio

---

# Fase 3 — Melhorar qualidade da conexão entre locador e motorista

## Objetivo
Aumentar a qualidade do match entre oferta e interesse.

## Prioridades
- estruturar melhor os dados do motorista interessado
- permitir que o locador identifique interessados mais aderentes
- reduzir interesses pouco qualificados

## Entregas esperadas
- menos ruído para o locador
- mais contexto sobre quem demonstrou interesse
- processo de triagem mais eficiente

## Possíveis evoluções
- campos adicionais de perfil do motorista
- critérios mínimos definidos pelo locador
- melhor organização dos interessados
- distinção entre interesse recebido e interesse já tratado

---

# Fase 4 — Fortalecer regras de negócio e segurança

## Objetivo
Dar mais consistência ao sistema conforme o uso real cresce.

## Prioridades
- revisar autenticação e autorização
- melhorar proteção de rotas
- fortalecer integridade dos dados
- revisar comportamento em erros e exceções
- melhorar estrutura do banco quando necessário

## Entregas esperadas
- menor risco de inconsistência
- mais segurança nas operações
- sistema mais confiável para evoluir

## Possíveis melhorias
- validações mais fortes no backend
- revisão de permissões
- revisão de sessão/autenticação
- tratamento melhor de falhas de banco ou rota
- normalização gradual de estruturas de dados

---

# Fase 5 — Preparar o produto para evolução pós-validação

## Objetivo
Organizar o sistema para crescer com mais segurança depois que o MVP estiver validado.

## Prioridades
- refatorar apenas o que já se mostrou necessário
- separar melhor responsabilidades do código
- documentar decisões importantes
- melhorar observabilidade e manutenção

## Entregas esperadas
- base mais estável para novas features
- código mais organizado sem perder clareza
- evolução mais segura

## Atenção
Esta fase só deve ganhar força depois que as fases anteriores estiverem bem consolidadas.  
Não antecipar complexidade sem evidência real de necessidade.

---

# Linha contínua de trabalho

Além das fases, existem frentes contínuas que devem acontecer ao longo do projeto.

## 1. Aprendizado do fundador
O projeto deve continuar sendo compreensível para quem está construindo.

Isso significa:
- documentação clara
- decisões explicadas
- mudanças graduais
- evitar soluções difíceis de manter

## 2. Escuta do uso real
O produto deve evoluir com base no uso real, não apenas em ideias abstratas.

Perguntas úteis:
- onde o usuário trava?
- onde o fluxo confunde?
- o locador entende o painel?
- o motorista entende como demonstrar interesse?
- o valor do produto está claro?

## 3. Disciplina de simplicidade
Sempre revisar se a solução proposta:
- resolve o problema real
- não adiciona complexidade desnecessária
- mantém o projeto fácil de evoluir

---

# Ordem prática de execução sugerida

## Agora
- consolidar fluxo principal
- corrigir bugs
- melhorar validações
- melhorar clareza de telas e mensagens
- revisar painel do locador

## Em seguida
- melhorar listagem pública
- adicionar filtros simples
- organizar melhor os interessados

## Depois
- fortalecer regras de negócio
- melhorar segurança
- refinar estrutura do sistema conforme necessidades reais aparecerem

---

# Critérios para considerar o MVP mais maduro

O MVP estará mais maduro quando:

- o fluxo principal funcionar sem fricção grave
- os usuários entenderem o que fazer em cada etapa
- os interesses chegarem corretamente ao locador
- o locador conseguir usar o painel com clareza
- houver confiança mínima para rodar testes mais sérios

---

# Regra final do roadmap

O Locadora App deve evoluir de forma **simples, funcional e orientada por realidade**.

Toda nova etapa deve reforçar três coisas:

- utilidade do produto
- clareza do sistema
- capacidade de evolução sem complicação precoce