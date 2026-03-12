# Contexto do Projeto — Locadora App

## O que é este projeto

O **Locadora App** é um marketplace que conecta **locadores de veículos** com **motoristas de aplicativo**.

A proposta central do produto é simples:

- o locador publica veículos disponíveis
- o motorista encontra veículos e manifesta interesse
- o locador visualiza esses interessados e segue a negociação fora ou dentro do processo definido futuramente

---

## Estágio atual

O projeto está em **MVP funcional em produção para testes**.

Isso significa que:

- o produto já roda em ambiente real
- já existe fluxo principal implementado
- a prioridade não é “sofisticação técnica”, mas sim **estabilidade, clareza e evolução incremental**
- mudanças devem respeitar o que já está funcionando

---

## Stack

- **Node.js**
- **Express**
- **PostgreSQL** (Neon)
- **Deploy**: Render (app) + Neon (banco)
- **Versionamento**: GitHub

---

## Fluxo principal do produto

### Lado do locador
1. cria conta
2. faz login
3. cadastra veículo
4. publica veículo
5. acompanha interessados no painel

### Lado do motorista
1. cria conta
2. faz login
3. visualiza veículos disponíveis
4. clica em **"Tenho interesse"**

### Resultado
- o interesse fica registrado
- o locador visualiza o interessado no painel

---

## Funcionalidades já existentes

- cadastro de locador
- cadastro de motorista
- login
- CRUD de veículos
- listagem pública de veículos
- manifestação de interesse
- painel do locador

---

## Perfil do fundador

O projeto está sendo construído por um **fundador que está aprendendo programação enquanto desenvolve o produto**.

Esse contexto é essencial.

Portanto, qualquer sugestão, refatoração, documentação ou alteração deve seguir estes princípios:

- ser clara
- ser objetiva
- evitar complexidade desnecessária
- ajudar no aprendizado
- manter o sistema compreensível
- preservar velocidade de evolução

---

## Como agir ao modificar este projeto

Ao trabalhar neste repositório, considerar sempre:

### 1. O projeto ainda é um MVP
Evitar:
- overengineering
- abstrações prematuras
- reestruturações grandes sem necessidade
- dependências desnecessárias

Preferir:
- soluções simples
- mudanças pequenas
- código explícito
- melhorias fáceis de validar

### 2. O fluxo principal é prioridade
Toda alteração deve proteger ou melhorar o fluxo principal:

- locador publica veículo
- motorista encontra veículo
- motorista manifesta interesse
- locador visualiza interesse

### 3. Clareza é mais importante que “código avançado”
O código deve ser:
- fácil de ler
- fácil de alterar
- fácil de depurar
- fácil de explicar

### 4. O negócio importa tanto quanto o código
Este projeto não é apenas um sistema web.  
Ele é uma tentativa real de validar um marketplace.

Por isso, toda sugestão deve considerar:
- impacto no usuário
- simplicidade operacional
- valor para locadores
- valor para motoristas
- viabilidade prática

---

## O que uma IA deve priorizar

Se estiver ajudando neste projeto, a IA deve:

- entender primeiro o objetivo de negócio
- respeitar a fase atual do produto
- sugerir melhorias pequenas e úteis
- explicar decisões com linguagem simples
- evitar mudanças grandes sem justificativa forte
- sempre deixar claro:
  - o que foi alterado
  - por que foi alterado
  - qual impacto esperado

---

## Estilo de resposta ideal para IA

Ao responder sobre este projeto, preferir:

- linguagem simples
- passo a passo quando necessário
- sugestões práticas
- foco em execução real
- explicações sem jargão excessivo

Evitar:
- respostas genéricas
- arquitetura “de livro” sem necessidade
- refatorações totais
- excesso de teoria sem aplicação no projeto

---

## Direção de produto

O produto tende a evoluir em torno de temas como:

- melhorar a conexão entre locador e motorista
- aumentar confiança entre as partes
- melhorar visibilidade dos veículos
- organizar melhor os interessados
- reduzir atrito na negociação inicial
- estruturar melhor critérios e filtros

---

## Regra de ouro

Antes de implementar qualquer mudança, perguntar mentalmente:

**Isso deixa o Locadora App mais útil, mais claro e mais fácil de evoluir sem complicar o MVP?**

Se a resposta não for claramente “sim”, a mudança deve ser repensada.