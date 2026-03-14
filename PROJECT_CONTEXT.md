# PROJECT_CONTEXT.md

## Nome do projeto

**Locadora App**

------------------------------------------------------------------------

## Resumo em uma frase

Marketplace para conectar **locadores de veículos** com **motoristas de
aplicativo**.

------------------------------------------------------------------------

## Problema que o projeto busca resolver

Pequenos locadores muitas vezes têm dificuldade para encontrar
motoristas adequados com constância, enquanto motoristas de aplicativo
nem sempre encontram veículos disponíveis de forma organizada, visível e
prática.

O Locadora App surge para reduzir esse atrito, criando um ponto de
encontro mais claro entre oferta e interesse.

------------------------------------------------------------------------

## Objetivo do produto

Permitir que locadores publiquem veículos e que motoristas encontrem
essas oportunidades e manifestem interesse de forma simples.

O foco do MVP é validar se esse fluxo gera valor real para os dois
lados.

------------------------------------------------------------------------

## Objetivo do MVP

Validar um fluxo básico, funcional e real:

-   locador cria conta
-   locador publica veículo
-   motorista cria conta
-   motorista vê veículos disponíveis
-   motorista manifesta interesse
-   locador acompanha os interessados no painel

Se esse fluxo funcionar bem, o produto pode evoluir com mais confiança.

------------------------------------------------------------------------

## Público principal

### Locadores

Pessoas ou pequenos operadores que possuem veículos e desejam alugá-los
para motoristas de aplicativo.

### Motoristas

Pessoas que precisam de um veículo para trabalhar com aplicativos de
mobilidade.

------------------------------------------------------------------------

## Stack atual

-   **Backend**: Node.js
-   **Framework**: Express
-   **Banco de dados**: PostgreSQL (Neon)
-   **Deploy**: Render (app) + Neon (banco)
-   **Repositório**: GitHub

------------------------------------------------------------------------

## Estrutura atual do backend

O backend é uma **API Node.js utilizando Express**.

Responsabilidades principais:

-   autenticação de usuários (locador e motorista)
-   gestão de veículos (CRUD)
-   registro de interesse de motoristas nos veículos
-   painel do locador para visualizar interessados

A estrutura atual foi mantida **simples e direta**, adequada para o
estágio de MVP.

A prioridade não é arquitetura complexa, mas sim:

-   clareza de código
-   facilidade de manutenção
-   evolução incremental do sistema

------------------------------------------------------------------------

## Status atual

-   MVP funcional e consolidado (com validações robustas em front e backend)
-   Em produção para testes
-   Fluxo principal implementado
-   Projeto em fase de validação prática

------------------------------------------------------------------------

## Funcionalidades atuais

### Contas e autenticação

-   cadastro de locador
-   cadastro de motorista
-   login

### Veículos

-   criação de veículo
-   edição de veículo
-   remoção de veículo
-   listagem pública de veículos

### Interesse

-   motorista pode clicar em **"Tenho interesse"**
-   o interesse fica associado ao veículo e ao motorista

### Painel do locador

-   visualização dos veículos cadastrados
-   visualização dos interessados

------------------------------------------------------------------------

## Fluxo de negócio principal

### Fluxo resumido

1.  locador entra na plataforma
2.  locador publica veículo
3.  motorista acessa a plataforma
4.  motorista encontra o veículo
5.  motorista manifesta interesse
6.  locador visualiza o interesse e segue com o processo

### Valor gerado

-   locador ganha visibilidade para o veículo
-   motorista encontra oportunidade de trabalho
-   o contato inicial fica mais organizado

------------------------------------------------------------------------

## Contexto de construção

Este projeto está sendo desenvolvido por um fundador que está:

-   construindo o produto
-   aprendendo programação ao mesmo tempo
-   usando IA como apoio de desenvolvimento e raciocínio

Isso influencia diretamente a forma ideal de evoluir o sistema.

A melhor abordagem aqui não é buscar a arquitetura mais sofisticada, e
sim:

-   manter clareza
-   preservar simplicidade
-   permitir evolução incremental
-   facilitar entendimento do código
-   apoiar o avanço real do produto

------------------------------------------------------------------------

## Filosofia de desenvolvimento

### Princípios

-   simplicidade antes de complexidade
-   clareza antes de abstração
-   evolução gradual antes de reescrita
-   produto real antes de teoria excessiva
-   documentação útil antes de documentação decorativa

### Consequências práticas

-   evitar overengineering
-   evitar refatorações amplas sem ganho concreto
-   preferir mudanças pequenas e seguras
-   explicar as decisões com objetividade
-   sempre considerar o impacto no negócio

------------------------------------------------------------------------

## O que é importante proteger

As partes mais sensíveis do sistema hoje são:

-   cadastro
-   login
-   CRUD de veículos
-   listagem pública
-   manifestação de interesse
-   painel do locador

Esses pontos representam o núcleo do MVP.

------------------------------------------------------------------------

## O que é prioridade neste estágio

### Alta prioridade

-   estabilidade do fluxo principal
-   correção de bugs
-   clareza de código
-   validação de dados
-   experiência básica do usuário
-   confiança mínima entre as partes

### Média prioridade

-   melhorias de interface
-   filtros
-   organização do painel
-   melhorias de comunicação entre as partes
-   estruturação mais sólida de regras de negócio

### Baixa prioridade por enquanto

-   arquitetura avançada
-   otimizações prematuras
-   abstrações sofisticadas
-   escalabilidade pensada cedo demais

------------------------------------------------------------------------

## Como uma IA deve interpretar este repositório

A IA deve entender que este projeto é:

-   um produto real
-   um MVP em validação
-   um sistema que precisa continuar simples
-   um ambiente de aprendizado prático
-   um projeto onde contexto de negócio importa muito

Portanto, a IA deve agir como um apoio técnico pragmático.

### A IA deve:

-   sugerir melhorias incrementais
-   explicar mudanças de forma simples
-   respeitar a estrutura atual quando possível
-   evitar mudanças grandes sem necessidade
-   ajudar o fundador a entender o sistema

### A IA não deve:

-   presumir escala que ainda não existe
-   impor arquitetura complexa cedo demais
-   reescrever sem motivo forte
-   responder de forma genérica e distante da realidade do projeto

------------------------------------------------------------------------

## Possíveis evoluções futuras

Algumas linhas prováveis de evolução:

-   filtros de busca para veículos
-   melhoria do painel do locador
-   critérios mínimos para qualificação de motoristas
-   mais dados relevantes sobre veículos
-   melhorias na gestão de interesses
-   melhorias de segurança e autorização
-   refinamento do processo de conexão entre as partes

------------------------------------------------------------------------

## Regra central do projeto

Toda mudança deve responder bem a esta pergunta:

**Isso ajuda o Locadora App a ficar mais útil, mais claro e mais fácil
de evoluir sem complicar o MVP?**

Se não ajudar claramente, provavelmente não é a mudança certa agora.
