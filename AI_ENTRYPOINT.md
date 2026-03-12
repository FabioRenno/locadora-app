# AI Entrypoint --- Locadora App

Este arquivo serve como ponto de entrada para qualquer IA que esteja
trabalhando neste repositório.

------------------------------------------------------------------------

# Como iniciar uma sessão de IA

Se você é uma IA analisando este repositório:

1.  Leia este arquivo inteiro.
2.  Em seguida leia os arquivos na seguinte ordem:

-   PROJECT_CONTEXT.md
-   ROADMAP.md
-   .cursor/context.md
-   .cursor/rules.md
-   README.md

3.  Após entender o contexto completo do projeto, só então sugira
    mudanças.
4.  Sempre preserve o fluxo principal do sistema.
5.  Priorize simplicidade e estabilidade do MVP.

------------------------------------------------------------------------

# Sobre o projeto

O Locadora App é um marketplace que conecta:

-   locadores de veículos
-   motoristas de aplicativo

O produto está em **fase de MVP funcional em produção para testes**.

O foco atual é:

-   consolidar o fluxo principal
-   reduzir bugs
-   melhorar clareza
-   evoluir o produto gradualmente

Evitar mudanças que aumentem complexidade desnecessária.

------------------------------------------------------------------------

# Stack atual

Backend:\
Node.js\
Express

Banco:\
PostgreSQL (Neon)

Deploy:\
Render

Repositório:\
GitHub

------------------------------------------------------------------------

# Estrutura principal do projeto

/backend\
/frontend\
/database

Arquivos importantes:

AI_ENTRYPOINT.md\
PROJECT_CONTEXT.md\
ROADMAP.md\
PLANEJAMENTO.md

------------------------------------------------------------------------

# Fluxo principal do sistema

1.  locador cria conta\
2.  locador publica veículo\
3.  motorista cria conta\
4.  motorista vê veículos\
5.  motorista manifesta interesse\
6.  locador vê o interessado no painel

Esse fluxo é o núcleo do produto.

Qualquer mudança deve preservar esse comportamento.

------------------------------------------------------------------------

# Prioridades atuais

1.  estabilidade\
2.  simplicidade\
3.  clareza de código\
4.  melhorias incrementais\
5.  evolução segura do MVP

------------------------------------------------------------------------

# Instrução para IA

Antes de modificar qualquer código:

1.  entender o fluxo principal\
2.  verificar se a mudança ajuda o MVP\
3.  evitar refatorações amplas\
4.  preferir melhorias pequenas\
5.  explicar claramente o impacto das alterações

------------------------------------------------------------------------

# O que evitar

Evite:

-   refatorações grandes sem necessidade
-   mudanças que quebrem o fluxo principal
-   introduzir novas dependências sem justificativa
-   adicionar complexidade desnecessária
-   alterar regras do projeto sem explicar o motivo

------------------------------------------------------------------------

# Regra final

Este projeto está sendo desenvolvido por um fundador aprendendo
programação enquanto constrói o produto.

Portanto:

-   priorize clareza
-   evite complexidade desnecessária
-   explique decisões de forma simples
