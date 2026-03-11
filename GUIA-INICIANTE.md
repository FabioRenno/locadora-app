# Guia completo do iniciante - Sistema Locadora

> Este guia assume que você nunca programou. Cada etapa explica o **o quê**, o **por quê** e o **como**, em ordem.

---

## Índice

1. [Entendendo o cenário](#1-entendendo-o-cenário)
2. [O que vamos instalar (e por quê)](#2-o-que-vamos-instalar-e-por-quê)
3. [Passo a passo de instalação](#3-passo-a-passo-de-instalação)
4. [Conceitos básicos que vamos usar](#4-conceitos-básicos-que-vamos-usar)
5. [Ordem de estudo enquanto construímos](#5-ordem-de-estudo-enquanto-construímos)
6. [Como pedir ajuda quando travar](#6-como-pedir-ajuda-quando-travar)

---

## 1. Entendendo o cenário

### O que é um "sistema web"?

Imagine uma **loja física**:
- **Vitrine** = o que o cliente vê (frontend)
- **Caixa e estoque** = onde os dados são processados e guardados (backend)
- **Funcionários** = as regras que fazem tudo funcionar (lógica)

No nosso sistema:
- **Frontend** = páginas que o locador e o motorista veem no navegador
- **Backend** = servidor que recebe cadastros, salva no banco, envia e-mails
- **Banco de dados** = onde guardamos locadores, veículos, motoristas, interesses

### Metáfora do restaurante

| Parte do sistema | Analogia no restaurante |
|------------------|-------------------------|
| Frontend | Cardápio e mesa (o que o cliente vê) |
| Backend | Cozinha e garçom (prepara e entrega) |
| Banco de dados | Geladeira e despensa (onde fica guardado) |

---

## 2. O que vamos instalar (e por quê)

| Ferramenta | O que é | Para que serve no nosso projeto |
|------------|---------|----------------------------------|
| **Cursor / VS Code** | Editor de código | Onde escrevemos e organizamos os arquivos. Você já usa o Cursor. ✓ |
| **Node.js** | Interpretador de JavaScript no computador | Roda o backend e permite usar JavaScript fora do navegador |
| **npm** | Gerenciador de pacotes | Vem com o Node.js. Baixa bibliotecas prontas (como "pacotes" que instalamos) |
| **Git** | Controle de versão | Salva "fotos" do projeto em cada etapa. Facilita desfazer erros e compartilhar |
| **Navegador** | Chrome ou Edge | Onde veremos o sistema funcionando |

**Por que Node.js e não Python?**  
Para um iniciante em programação, JavaScript (Node.js) tem a vantagem de ser a mesma linguagem no frontend e no backend. Assim você aprende um idioma e usa em tudo. Python também é excelente; podemos ajustar se preferir.

---

## 3. Passo a passo de instalação

### 3.1 Verificar se o Node.js já está instalado

1. Abra o **PowerShell** (procure por "PowerShell" no menu Iniciar do Windows)
2. Digite:
   ```
   node --version
   ```
3. Pressione Enter.

**Se aparecer um número** (ex: `v20.10.0`) → Node.js está instalado. Pule para o [3.3](#33-instalar-o-git).

**Se aparecer erro** (ex: "comando não reconhecido") → siga o [3.2](#32-instalar-o-nodejs).

---

### 3.2 Instalar o Node.js

1. Acesse: **https://nodejs.org/**
2. Baixe a versão **LTS** (botão verde à esquerda)
3. Execute o instalador
4. Aceite as opções padrão (Next, Next)
5. **Importante:** marque a opção que instala as "ferramentas de compilação" se aparecer
6. Reinicie o computador (ou feche e abra o PowerShell)
7. Teste de novo:
   ```
   node --version
   npm --version
   ```
   Ambos devem mostrar números.

---

### 3.3 Instalar o Git

1. Acesse: **https://git-scm.com/download/win**
2. Baixe o instalador para Windows
3. Execute e aceite as opções padrão
4. Abra um **novo** PowerShell e teste:
   ```
   git --version
   ```

---

### 3.4 Configurar o Git (só uma vez)

No PowerShell, rode:

```
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

Substitua pelos seus dados. Isso identifica quem fez cada alteração no projeto.

---

### 3.5 Estrutura de pastas do projeto

1. Abra o Cursor
2. Abra a pasta do projeto: `Meu_Aprendizado_IA\locadora-app`
3. Você deve ver os arquivos `PLANEJAMENTO.md` e `GUIA-INICIANTE.md`

Se a pasta `locadora-app` não existir, crie-a dentro de `Meu_Aprendizado_IA`.

---

## 4. Conceitos básicos que vamos usar

### 4.1 Pasta e arquivos

- **Pasta** = container para organizar coisas (como uma gaveta)
- **Arquivo** = um "documento" (código, texto, etc.)

No nosso projeto teremos pastas como:
- `frontend` → HTML, CSS, JavaScript que o usuário vê
- `backend` → lógica do servidor
- `database` → scripts do banco

---

### 4.2 HTML, CSS e JavaScript

| Linguagem | Analogia | O que faz |
|-----------|----------|-----------|
| **HTML** | Estrutura da casa | Define títulos, botões, formulários, parágrafos |
| **CSS** | Decoração | Cores, fontes, tamanhos, layout |
| **JavaScript** | Interação | "Ao clicar no botão, faça X" |

---

### 4.3 Backend e API

- **Backend** = código que roda no servidor (no seu PC ou em um servidor na nuvem)
- **API** = conjunto de "pontos de entrada" que o frontend chama.  
  Exemplo: "Cadastrar motorista" → o frontend envia os dados para a rota `/api/motoristas` e o backend salva no banco.

---

### 4.4 Banco de dados

- **Banco de dados** = onde guardamos as informações de forma organizada
- **Tabela** = como uma planilha (colunas = campos, linhas = registros)
- **SQL** = linguagem para falar com o banco ("me traga todos os veículos disponíveis")

Exemplo de tabela `veiculos`:
| id | marca | modelo | ano | preco_diaria |
|----|-------|--------|-----|--------------|
| 1  | Fiat  | Argo   | 2023| 80.00        |
| 2  | VW    | Voyage | 2022| 70.00        |

---

## 5. Ordem de estudo enquanto construímos

Não é necessário dominar tudo antes de começar. Sugestão:

| Fase | O que aprender | Quando |
|------|----------------|--------|
| 1 | HTML básico (títulos, formulários, links) | Antes do primeiro formulário |
| 2 | CSS básico (cores, fontes, espaçamento) | Ao estilizar a primeira página |
| 3 | JavaScript básico (variáveis, funções, cliques) | Ao fazer o botão "Tenho interesse" funcionar |
| 4 | Node.js e Express (rotas, req, res) | Ao criar o backend |
| 5 | Banco de dados e SQL básico | Ao salvar o primeiro cadastro |

**Ideia:** aprender fazendo. Cada funcionalidade que construirmos vai exigir um conceito novo, e eu vou explicar na hora.

---

## 6. Como pedir ajuda quando travar

Ao pedir ajuda, inclua:
1. **O que você tentou fazer**
2. **O comando ou trecho de código**
3. **A mensagem de erro completa** (copie e cole)
4. **Em que passo você está** (ex: "instalei o Node e rodei npm install")

Isso acelera muito a solução.

---

## Checklist antes de começar a codar

- [x] Node.js instalado (`node --version` funciona)
- [x] npm instalado (`npm --version` funciona)
- [x] Git instalado (`git --version` funciona)
- [x] Git configurado (nome e e-mail)
- [x] Pasta `locadora-app` aberta no Cursor

Quando todos os itens estiverem marcados, avise e começamos pelo primeiro fluxo: **estrutura do projeto e página inicial**.
