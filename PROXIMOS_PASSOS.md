# Próximos Passos: Melhorias Técnicas Urgentes

Com base na análise do repositório, do atual estágio do produto (MVP funcional em produção para testes) e das prioridades definidas no `ROADMAP.md` ("Fase 1 - Consolidar o MVP atual"), identifiquei os 3 pontos com maior impacto de estabilidade e experiência do usuário no momento.

Seguindo a filosofia do projeto de **evitar complexidade desnecessária** e **focar no produto real**, as melhorias abaixo resolvem falhas estruturais básicas sem exigir refatorações amplas ou novas ferramentas pesadas.

---

## 1. Validações Fortes no Backend (Impedir Dados Inválidos) ✅ (CONCLUÍDO)

**O Problema Atual:**
Nas rotas atuais (`/api/veiculos`, `/api/locadores`, etc.), a verificação de dados se limita a checar a presença dos campos (ex: `if (!marca || !modelo)`). Isso permite que os usuários enviem dados mal formatados, incompletos (como uma placa com 3 caracteres) ou injetem conteúdo inesperado no banco de dados, podendo quebrar o fluxo de exibição e gerar inconsistências na comunicação entre as partes.

**Como Implementar:**
1. Criar um utilitário centralizado em `backend/utils/validacoes.js` ou instalar uma biblioteca leve (como `zod` ou `joi`, ou apenas funções Regex próprias) para validar formatos específicos.
2. Nas rotas de `POST` e `PUT` (veículos, locadores, motoristas), validar:
   - Formato de e-mail e força mínima de senha.
   - Formato de CPF, CNPJ, RG, CNH e Placa de veículo (Padrão Mercosul e Antiga).
   - Se números como `ano` e `preco_semanal` são razoáveis (ex: ano > 1990 <= ano atual + 1, preco >= 0).
3. Retornar um HTTP 400 com uma mensagem de erro clara indicando exatamente *qual* campo falhou.

---

## 2. Padronização de Retorno e Tratamento de Erros API ✅ (CONCLUÍDO)

**O Problema Atual:**
O backend responde aos erros de maneira inconsistente. Algumas rotas retornam JSON (ex: `res.status(400).json({ erro: '...' })`), outras retornam texto plano (ex: `res.status(400).send('Preencha todos os campos')`), e outras usam redirecionamento com Query Params (ex: `res.redirect('/login-locador?erro=credenciais')`). Isso torna o tratamento de erros do lado do frontend (cliente) engessado, difícil de ler e pouco amigável para chamadas assíncronas (fetch/AJAX).

**Como Implementar:**
1. Criar um padrão de resposta JSON para **toda** a API, por exemplo:
   - Sucesso: `{ "sucesso": true, "dados": {...}, "mensagem": "..." }`
   - Erro: `{ "sucesso": false, "erro": "Mensagem descritiva" }`
2. Refatorar os blocos `catch (err)` de todas as rotas para retornar falhas utilizando este padrão em vez de `res.send()`.
3. No caso de formulários, migrar gradualmente as submissões nativas em HTML (`<form method="POST">`) para chamadas em JavaScript `fetch()`, permitindo tratar as falhas sem recarregar e quebrar o contexto da tela do usuário.

---

## 3. Feedback Visual e Validação Client-Side (Frontend) ✅ (CONCLUÍDO)

**O Problema Atual:**
Conforme descrito no `ROADMAP.md` (Melhorar feedback visual em ações importantes), quando ocorre um erro de cadastro ou operação, a recarga da tela muitas vezes frustra o usuário e pode fazê-lo perder o progresso de edição. Além disso, enviar os dados ao servidor para descobrir que uma senha estava curta ou a placa inválida gera atrito no uso.

**Como Implementar:**
1. No Frontend (em cada arquivo HTML ou através de um script compartilhado `frontend/js/main.js`), implementar a manipulação de formulários (eventos `onsubmit`).
2. Adicionar validação preventiva antes do envio (tamanho da senha, campos obrigatórios preenchidos, placa coerente).
3. Criar uma função para exibir um alerta visual dinâmico (sistema simples de "Toast/Notificação" no CSS atual ou através de modais leves) substituindo o uso de mensagens de erro que aparecem perdidas na tela ou redirecionamentos de página, melhorando a percepção de qualidade do sistema.
