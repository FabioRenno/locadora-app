# Regras de Trabalho para IA — Locadora App

Estas regras orientam qualquer IA trabalhando neste repositório.

O objetivo é garantir que as sugestões, alterações e implementações respeitem o estágio do projeto, o contexto do fundador e a simplicidade necessária para um MVP em produção.

---

## 1. Regra principal

Sempre priorizar:

- simplicidade
- clareza
- segurança de mudança
- manutenção fácil
- respeito ao fluxo principal do produto

---

## 2. Antes de mudar qualquer coisa

A IA deve primeiro entender:

- qual problema está tentando resolver
- se a mudança é realmente necessária agora
- se isso ajuda o MVP
- se isso preserva o que já funciona

Nunca assumir que “mais arquitetura” é automaticamente melhor.

---

## 3. Não complicar o projeto sem motivo forte

Evitar introduzir sem necessidade:

- padrões complexos
- abstrações prematuras
- múltiplas camadas artificiais
- bibliotecas desnecessárias
- refatorações amplas só por estética
- reorganizações grandes de pasta sem ganho claro

Se algo já funciona e está claro, a tendência deve ser **preservar e melhorar aos poucos**.

---

## 4. Fazer mudanças pequenas e incrementais

Preferir:

- alterações localizadas
- commits fáceis de entender
- refatorações pequenas
- melhorias fáceis de testar
- evolução gradual

Evitar:
- mudar muitos arquivos sem necessidade
- misturar correção, refatoração e nova feature no mesmo passo
- reescrever módulos inteiros sem motivo claro

---

## 5. Preservar o fluxo principal do produto

Toda decisão deve proteger o fluxo principal:

1. locador cria conta
2. locador publica veículo
3. motorista cria conta
4. motorista visualiza veículos
5. motorista manifesta interesse
6. locador visualiza o interesse no painel

Se qualquer alteração ameaçar esse fluxo, parar e revisar.

---

## 6. Código deve ser fácil de entender

Ao escrever código, preferir:

- nomes claros
- funções com responsabilidade compreensível
- lógica explícita
- comentários apenas quando agregarem clareza
- validações objetivas
- tratamento simples de erros

Evitar:
- nomes genéricos demais
- lógica “esperta” difícil de ler
- abstrações que escondem o comportamento
- encadeamentos desnecessariamente complexos

---

## 7. Explicar como um parceiro técnico, não como professor rebuscado

Ao responder, a IA deve:

- dizer o que vai fazer
- explicar por que isso ajuda
- mostrar o impacto da mudança
- usar linguagem simples
- evitar jargão em excesso

Formato ideal:
- problema
- causa
- solução proposta
- trecho alterado
- impacto esperado

---

## 8. Prioridade atual do projeto

A prioridade do Locadora App neste estágio é:

- consolidar o MVP
- reduzir bugs
- melhorar clareza do sistema
- facilitar manutenção
- apoiar o aprendizado do fundador
- preparar evolução sem destruir simplicidade

A IA não deve tratar este projeto como se já fosse uma plataforma madura de larga escala.

---

## 9. Ao sugerir melhorias

Sempre classificar mentalmente a melhoria em uma destas categorias:

### A. Essencial agora
- bug
- segurança
- quebra de fluxo principal
- erro de dados
- falha de autenticação
- problema de produção

### B. Importante em breve
- melhoria de UX
- organização de código
- validação adicional
- qualidade de dados
- melhoria de painel ou listagem

### C. Pode esperar
- arquitetura avançada
- micro-otimizações
- abstrações futuras
- reestruturações extensas

Priorizar A, depois B. Evitar puxar C para o presente sem motivo real.

---

## 10. Ao escrever ou revisar documentação

A documentação deve ser:

- curta quando possível
- clara sempre
- útil para humanos e IA
- orientada ao contexto real do projeto
- atualizada com base no estado real do sistema

Evitar documentação vaga, genérica ou “bonita porém inútil”.

---

## 11. Ao mexer em banco de dados

Como o projeto usa PostgreSQL (Neon), qualquer alteração de estrutura deve ser feita com cautela.

A IA deve:
- explicar o impacto da mudança
- evitar alterações destrutivas sem necessidade
- considerar compatibilidade com dados existentes
- preferir mudanças simples e seguras

---

## 12. Ao mexer em rotas, autenticação e permissões

Ter atenção extra com:

- login
- cadastro
- sessão/autenticação
- acesso ao painel do locador
- integridade da manifestação de interesse
- proteção de operações de CRUD

Essas áreas afetam diretamente a confiança mínima do MVP.

---

## 13. Ao propor novas features

Antes de propor uma feature, verificar se ela:

- melhora a conexão entre locador e motorista
- reduz atrito no processo
- aumenta clareza ou confiança
- ajuda na validação do produto
- é viável no estágio atual

Se não atender a isso, provavelmente não é prioridade.

---

## 14. Regra de estilo para respostas e implementações

Sempre preferir:

- direto ao ponto
- organizado
- útil
- aplicável no projeto real

Nunca responder apenas com teoria quando a situação pede ação prática.

---

## 15. Em caso de dúvida

Em vez de inventar complexidade, a IA deve seguir a opção mais segura entre estas:

1. manter simples
2. preservar o que funciona
3. melhorar só o necessário
4. explicar claramente o próximo passo

---

## 16. Regra final

Este projeto deve continuar sendo compreensível para o fundador.

Se uma solução parecer tecnicamente elegante, mas dificultar entendimento, manutenção ou evolução prática, ela não é a melhor solução para este repositório.