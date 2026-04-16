# BRANDING_CARVEX.md

## 1. Identidade da Marca

**Nome:** Carvex

**Descrição:**
Marketplace que conecta locadores de veículos com motoristas de aplicativo, reduzindo atrito e organizando o contato inicial.

**Fluxo principal do produto:**

* locador publica veículo
* motorista visualiza
* motorista manifesta interesse
* locador acompanha interessados

**Objetivo da marca:**
Transmitir confiança, clareza, simplicidade e organização.

---

## 2. Posicionamento

**Posicionamento:**
A Carvex facilita a conexão entre locadores e motoristas, organizando o processo de locação com clareza e confiança.

**Proposta de valor:**
Menos atrito, mais organização e contato mais confiável.

**Promessa:**
Menos contato desorganizado. Mais clareza entre as partes.

---

## 3. Conceito Visual

**Conceito:**
“C estruturado com ponto de conexão”

**Significado:**

* “C” = Carvex
* Estrutura = organização e confiança
* Ponto ciano = conexão entre as partes

---

## 4. Paleta de Cores

**Principais:**

* Marinho: #0b3b5a
* Ciano: #00a3b7
* Cinza escuro: #2c3e50
* Fundo claro: #f4f6f8

**Auxiliares:**

* Texto principal: #1f2937
* Texto secundário: #6b7280
* Sucesso: #198754
* Erro: #dc3545

**Regras:**

* Marinho → estrutura e botões principais
* Ciano → destaque e ações
* Fundo claro → base do sistema

---

## 5. Tipografia

**Fonte:**

* Segoe UI
* Arial (fallback)
* sans-serif

**Pesos:**

* Títulos: 700
* Subtítulos: 600
* Texto: 400–500

**Regra:**
Manter legibilidade e simplicidade.

---

## 6. Logo

**Estrutura:**

* Símbolo à esquerda
* Nome “Carvex” à direita
* Símbolo = “C” geométrico + ponto de conexão

**Arquivos obrigatórios:**

* logo-carvex.svg
* logo-carvex-compact.svg
* logo-carvex-icon.svg
* logo-carvex-dark.svg
* favicon.svg

**Onde ficam no repositório (MVP atual):**

* Pasta: `frontend/assets/branding/`
* Referência nas páginas HTML: `/assets/branding/nome-do-arquivo.svg` (ex.: `/assets/branding/logo-carvex.svg`, `/assets/branding/favicon.svg`)

---

## 7. Regras de Uso da Logo

**Fazer:**

* usar SVG sempre que possível
* manter proporção original
* manter cores oficiais
* garantir bom contraste

**Não fazer:**

* alterar cores
* distorcer a logo
* aplicar efeitos (sombra, gradiente)
* usar fundo poluído

---

## 8. Interface (UI)

### Header

* fundo claro
* logo no topo do cabeçalho (centralizada no MVP atual), com destaque visual
* título da página logo abaixo, em hierarquia menor que a marca
* layout limpo (sem botão “Sair” no topo nas telas de painel)

### Botões

* primário: marinho
* destaque: ciano

### Cards

* fundo branco
* borda leve
* sombra discreta

### Formulários

* simples
* foco em ciano
* feedback claro

### Rodapé de ação (telas logadas de painel)

* botão **Sair** discreto no rodapé da página (classe `rodape-acao` / `botao-sair-rodape`), para não competir com logo e título

---

## 9. Tom de Comunicação

**Características:**

* simples
* direto
* confiável
* humano

**Exemplo:**
Evitar:

> “Operação concluída com êxito”

Usar:

> “Cadastro realizado com sucesso”

Melhor:

> “Cadastro realizado com sucesso. Agora você já pode anunciar seu veículo.”

---

## 10. Diretrizes para Implementação

Aplicar no sistema:

* variáveis globais de cor (`frontend/css/style.css`, bloco `:root`)
* inserir logo e favicon nas páginas HTML (`/assets/branding/...`)
* padronizar botões
* padronizar cards
* padronizar formulários
* revisar contraste e legibilidade

**Estado atual no código (resumo):**

* Estilos globais e da marca: `frontend/css/style.css`
* Página inicial (`frontend/index.html`): logo + subtítulo; sem título `<h1>` duplicando o nome “Carvex” (o nome já aparece na logo SVG)
* Páginas com `cabecalho-painel`: logo + título da tela; **Sair** no rodapé

---

## 11. Princípios de Uso

* manter simplicidade
* evitar complexidade desnecessária
* priorizar clareza
* respeitar o estágio do produto (MVP evoluindo)

---

## 12. Regra Final

Toda decisão visual deve responder:

“Isso deixa o sistema mais claro, confiável e fácil de usar?”

Se não, não deve ser implementado.
