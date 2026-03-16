# INÍCIO PARA IA

Se você é uma IA trabalhando neste repositório, siga os passos abaixo antes de sugerir qualquer mudança no projeto.

## Ordem de leitura obrigatória

1. Leia primeiro **AI_ENTRYPOINT.md**
2. Em seguida leia **PROJECT_CONTEXT.md**
3. Depois leia **ROADMAP.md**
4. Por fim leia **.cursor/rules.md**

Somente depois de entender o contexto completo do projeto sugira mudanças ou melhorias.

---

# AI Guide — Locadora App

## Sobre o projeto

O **Locadora App** é um marketplace que conecta:

- locadores de veículos
- motoristas de aplicativo

O sistema está atualmente em **fase de MVP funcional em produção para testes**.

O objetivo do produto é **facilitar a conexão inicial entre quem possui veículos disponíveis e quem precisa de um carro para trabalhar com aplicativos de mobilidade**.

---

## Fluxo principal do produto

O fluxo principal do sistema é:

1. locador cria conta  
2. locador publica veículo  
3. motorista cria conta  
4. motorista visualiza veículos disponíveis  
5. motorista manifesta interesse  
6. locador visualiza interessados no painel  

Este fluxo é o **núcleo do produto** e deve ser preservado.

Qualquer mudança no sistema deve respeitar esse comportamento.

---

## Regras principais para IA

Priorizar sempre:

- simplicidade
- clareza de código
- mudanças pequenas e seguras
- respeito ao estágio atual do MVP
- preservação do que já funciona

Evitar:

- refatorações amplas sem necessidade
- introdução de arquitetura complexa prematura
- alterações que quebrem o fluxo principal
- mudanças grandes sem explicar impacto
- adicionar dependências sem justificativa

---

## Filosofia de evolução

O Locadora App está sendo construído com foco em:

- validação real de produto
- evolução incremental
- código fácil de entender
- decisões orientadas pelo uso real

A IA deve agir como um **apoio técnico pragmático**, ajudando a melhorar o sistema sem adicionar complexidade desnecessária.