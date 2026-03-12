# Locadora App

Marketplace para conectar **locadores de veículos** com **motoristas de aplicativo**.

O projeto nasceu para resolver um problema simples e real: ajudar pequenos locadores a encontrarem motoristas com mais agilidade, e ajudar motoristas a encontrarem veículos disponíveis para locação de forma mais clara e organizada.

Hoje o **Locadora App** já possui um **MVP funcional em produção para testes**, validando o fluxo principal do produto.

---

## Visão do produto

O Locadora App atua como uma ponte entre dois lados:

- **Locador**: cria conta, cadastra veículos e acompanha interessados
- **Motorista**: cria conta, visualiza veículos disponíveis e manifesta interesse

### Fluxo principal

1. O locador cria uma conta
2. O locador cadastra e publica um veículo
3. O motorista cria uma conta
4. O motorista acessa a listagem pública de veículos
5. O motorista clica em **"Tenho interesse"**
6. O locador visualiza esse interesse em seu painel

---

## Objetivo

Construir um marketplace simples, funcional e evolutivo para facilitar a conexão entre:

- pequenos locadores de veículos
- motoristas de aplicativo em busca de carro para trabalhar

O foco do produto é **reduzir atrito**, **organizar o processo inicial de contato** e **dar mais visibilidade aos veículos disponíveis**.

---

## Status do projeto

- **Status atual**: MVP funcional em produção para testes
- **Fase**: validação prática do fluxo principal
- **Deploy**: Render (app) + Neon (PostgreSQL)
- **Repositório**: GitHub

---

## Stack utilizada

- **Node.js**
- **Express**
- **PostgreSQL** (Neon)

---

## Funcionalidades atuais

### Autenticação e contas
- Cadastro de locador
- Cadastro de motorista
- Login

### Gestão de veículos
- CRUD de veículos
- Publicação de veículos pelo locador
- Listagem pública de veículos

### Interesse do motorista
- Manifestação de interesse no veículo
- Registro do interesse para o locador visualizar depois

### Painel do locador
- Visualização dos veículos cadastrados
- Visualização dos interessados

---

## Público-alvo inicial

### Locadores
Pequenos locadores que possuem veículos e buscam motoristas para locação.

### Motoristas
Motoristas de aplicativo que procuram um veículo disponível para trabalhar.

---

## Filosofia do projeto

Este projeto está sendo construído com uma combinação de:

- **visão de negócio real**
- **aprendizado prático de programação**
- **uso de IA como apoio de desenvolvimento**

O objetivo não é criar um código “bonito apenas para desenvolvedor experiente”, mas um sistema que seja:

- fácil de evoluir
- fácil de entender
- funcional no mundo real
- sustentável para um fundador em aprendizado

---

## Princípios de desenvolvimento

1. **Clareza acima de sofisticação desnecessária**
2. **Simplicidade antes de complexidade**
3. **Código legível antes de abstrações prematuras**
4. **Entrega prática antes de perfeccionismo**
5. **Documentação útil para humanos e IA**

---

## Estrutura mental do projeto

Ao trabalhar neste repositório, pense no produto nestas camadas:

### 1. Negócio
Conectar locadores e motoristas com o menor atrito possível.

### 2. Produto
Garantir que o fluxo principal funcione de ponta a ponta.

### 3. Sistema
Manter rotas, views, banco e autenticação simples, previsíveis e fáceis de manter.

### 4. Evolução
Melhorar o produto sem quebrar o que já está funcionando.

---

## Como uma IA deve ajudar neste projeto

Se uma IA estiver auxiliando no desenvolvimento deste repositório, ela deve priorizar:

- clareza
- mudanças pequenas e seguras
- respeito ao estágio atual do MVP
- explicações objetivas
- evitar refatorações grandes sem necessidade
- preservar funcionamento existente

### Regras práticas para IA
- Antes de sugerir arquitetura complexa, validar se isso é realmente necessário para o MVP
- Preferir mudanças incrementais
- Explicar o motivo de cada alteração
- Evitar “reinventar” partes que já funcionam
- Considerar sempre o contexto de produto, não apenas o código

---

## Próximos passos prováveis

Alguns próximos passos naturais para o projeto:

- melhorar UX das listagens
- melhorar painel do locador
- criar filtros de busca
- melhorar critérios de qualificação dos interessados
- fortalecer segurança e validação
- evoluir estrutura de banco de dados
- preparar o produto para crescimento pós-MVP

---

## Para quem for contribuir

Ao contribuir com este projeto:

- preserve a simplicidade
- escreva código fácil de entender
- documente decisões importantes
- não assuma contexto oculto
- proponha mudanças alinhadas ao estágio do produto

---

## Resumo

O **Locadora App** é um marketplace em fase de MVP que conecta:

- **locadores de veículos**
- **motoristas de aplicativo**

com foco em um fluxo simples:

- publicar veículo
- visualizar listagem
- manifestar interesse
- acompanhar interessados

É um projeto orientado por realidade de negócio, com desenvolvimento incremental e documentação pensada para apoiar tanto humanos quanto IA.