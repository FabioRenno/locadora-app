# Planejamento - Sistema de Locação para Motoristas de App

> Documento de requisitos e estrutura do projeto.  
> Última atualização: fevereiro 2025

---

## 📍 Status do projeto — Onde você está

**O que já está pronto:**
- ✅ Landing page (botões Sou Locador, Sou Motorista, Ver Veículos + indicação de quem está logado + opção Sair)
- ✅ Servidor rodando (Node.js + Express em `http://localhost:3000`)
- ✅ Formulário de cadastro do locador (com todos os campos, responsivo, CSS centralizado)
- ✅ Backend: rota POST `/api/locadores` + banco SQLite (cadastro salvo e senha criptografada)
- ✅ Login de locador + painel restrito + logout
- ✅ Cadastro e login de motorista + painel do motorista
- ✅ CRUD de veículos (adicionar, editar, excluir)
- ✅ Listagem pública de veículos + página de detalhe
- ✅ Botão "Tenho interesse" + lista de interesses no painel do locador
- ✅ Notificação por e-mail quando há novo interesse (opcional, via .env)

**O que falta agora:**
- Nada crítico — MVP completo.

**E-mail (opcional):** quando um motorista manifesta interesse, o locador pode receber notificação por e-mail. Configure em `.env` (veja arquivo `.env.example`). Sem configuração, o sistema funciona normal; só não envia e-mail.

**Para retomar:** abra a pasta `locadora-app`, rode `npm install` (se ainda não instalou), `npm start` e acesse `http://localhost:3000`.

---

## Visão geral

Sistema que conecta **locadores** (pequenos e médios) e **motoristas de aplicativo**, permitindo:
- Locadores cadastram e publicam veículos
- Motoristas se cadastram e visualizam anúncios
- Motorista manifesta interesse → locador recebe os dados → contato externo para fechar (WhatsApp)

### Fluxo de conexão (evolução planejada)

| Fase | Modelo | Descrição |
|------|--------|-----------|
| **Atual** | Manifestação de interesse | Motorista manifesta interesse pelo sistema; locador recebe os dados e responde por fora (WhatsApp, etc.) para fechar o negócio |
| **Futura** | Fluxo completo | Reserva, agendamento e pagamento integrados ao sistema |

### Checagem criminal e Serasa/SPC

Cada **locador** é responsável por realizar suas próprias checagens. O sistema apenas **fornece os dados necessários** (CPF, RG, nome, data de nascimento etc.) para que o locador realize as consultas por seus próprios meios.

### Monetização

| Fase | Modelo |
|------|--------|
| **Inicial** | Locador só paga se quiser destaque nos anúncios (ex.: selo "Verificado") |
| **Futura** | Escalar monetização tanto para locadores quanto para motoristas |

---

# Passo 1: Lista mínima de campos por cadastro

## 1.1 Cadastro do LOCADOR

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Razão Social | texto | sim | Nome oficial da empresa |
| Nome Fantasia | texto | não | Nome comercial |
| CNPJ | texto (14 dígitos) | sim | Documento da empresa |
| Email | email | sim | Contato principal |
| Telefone | texto | sim | Para contato |
| WhatsApp | texto | sim | Canal preferencial para motoristas |
| Endereço completo | texto | sim | Rua, número, complemento |
| Cidade | texto | sim | |
| Estado | texto (UF) | sim | Ex: SP, RJ |
| CEP | texto | sim | |
| Senha | texto | sim | Para acesso ao sistema |
| Área de atuação | texto | não | Ex: "São Paulo capital e região" |
| Horário de atendimento | texto | não | Ex: "Seg-Sex 8h-18h" |

**Por que esses campos?**  
Dados cadastrais normais de um locador, suficientes para identificação e contato. Área de atuação e horário ajudam o motorista a saber se o locador atende na região dele.

---

## 1.2 Cadastro do VEÍCULO

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Marca | texto | sim | Ex: Fiat, Volkswagen |
| Modelo | texto | sim | Ex: Argo, Voyage |
| Ano | número | sim | Ex: 2023 |
| Placa | texto | sim | Ex: ABC1D23 |
| Cor | texto | sim | |
| Preço diária | decimal | não | Valor em R$ por dia (se oferecer) |
| Preço semanal | decimal | sim | Valor em R$ por semana |
| **Valor caução** | decimal | sim | Valor do depósito de segurança |
| **Responsabilidade manutenção** | texto/opção | sim | "Locador" ou "Motorista" — quem arcas com custos de manutenção |
| Local de retirada | texto/endereço | sim | Onde o motorista busca o carro |
| Fotos | arquivos | sim (mín. 1) | Imagens do veículo |
| Disponível | sim/não | sim | Se está disponível para locação |
| Observações | texto longo | não | Detalhes extras (ar condicionado, combustível etc.) |

**Por que caução e manutenção?**  
 São informações decisivas para o motorista e reduzem dúvidas e conflitos na negociação. O valor da caução impacta o custo inicial; a responsabilidade pela manutenção define quem paga por reparos durante a locação.

---

## 1.3 Cadastro do MOTORISTA

> Informações completas do motorista para que o locador possa realizar checagem criminal e consulta junto ao Serasa e SPC. **Cada locador é responsável pela sua própria checagem**; o sistema apenas armazena e fornece os dados necessários para essas consultas.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Nome completo | texto | sim | Como no RG |
| CPF | texto (11 dígitos) | sim | Necessário para Serasa/SPC |
| RG | texto | sim | Documento de identidade |
| Data de nascimento | data | sim | Para verificações |
| Email | email | sim | Contato |
| Telefone | texto | sim | |
| WhatsApp | texto | sim | Canal preferencial |
| Número da CNH | texto | sim | Carteira Nacional de Habilitação |
| Categoria CNH | texto | sim | Ex: B, AB |
| EAR (Exerce Atividade Remunerada) | opção clicável (sim/não) | sim | Indicação na CNH de que a pessoa passou no exame psicotécnico do Detran e pode exercer atividade remunerada |
| Validade CNH | data | sim | Data de validade |
| Cidade | texto | sim | |
| Estado | texto (UF) | sim | |
| Endereço | texto | não | Endereço completo |
| CEP | texto | não | |
| Apps que usa | texto | não | Ex: "99, Uber" — informação auxiliar |
| Senha | texto | sim | Para acesso ao sistema |

**Por que tantos dados pessoais?**  
O locador precisa consultar Serasa, SPC e antecedentes. CPF, RG, nome completo e data de nascimento são os principais. CNH mostra que o motorista pode dirigir. O sistema não faz a checagem; só centraliza os dados para o locador usar.

---

# Passo 2: Telas e fluxos principais

## 2.1 Mapa de telas

```
┌─────────────────────────────────────────────────────────────────┐
│                    PÁGINA INICIAL (Landing)                      │
│  - Apresentação do sistema                                       │
│  - Botões: "Sou Locador" | "Sou Motorista" | "Ver veículos"      │
└─────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  LOGIN/CADASTRO  │    │  LOGIN/CADASTRO  │    │  LISTAGEM        │
│  LOCADOR         │    │  MOTORISTA       │    │  DE VEÍCULOS     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
          │                         │                         │
          ▼                         │                         │
┌──────────────────┐                │                         │
│  PAINEL LOCADOR  │                │                         │
│  - Meus veículos │                │                         │
│  - Adicionar     │                │                         │
│  - Interesses    │                │                         │
│  (manifestações) │                │                         │
└──────────────────┘                │                         │
                                    ▼                         │
                         ┌──────────────────┐                  │
                         │  PAINEL MOTORISTA│                  │
                         │  - Veículos      │◄─────────────────┘
                         │  disponíveis     │
                         │  - Meus interesses│
                         └──────────────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │  DETALHE DO      │
                         │  VEÍCULO         │
                         │  - Infos completas│
                         │  - [Tenho interesse]│
                         └──────────────────┘
```

## 2.2 Fluxos principais

### Fluxo A: Locador publica veículo
1. Locador faz login
2. Acessa "Meus veículos" → "Adicionar veículo"
3. Preenche todos os campos obrigatórios
4. Salva → veículo aparece na listagem pública

### Fluxo B: Motorista manifesta interesse
1. Motorista navega pela listagem (pode estar logado ou não para visualizar)
2. Para manifestar interesse: precisa estar **logado**
3. Clica em "Tenho interesse" no veículo desejado
4. Sistema registra: qual motorista, qual veículo, data/hora
5. Locador recebe notificação (e-mail ou dentro do painel) com dados do motorista
6. Locador entra em contato por WhatsApp para fechar

### Fluxo C: Locador vê manifestações
1. Locador acessa "Interesses recebidos" no painel
2. Vê lista: veículo + motorista + data
3. Clica no motorista → vê todos os dados cadastrais
4. Usa esses dados para checagens e contato

## 2.3 Regras de acesso

| Tela | Locador | Motorista | Visitante (não logado) |
|------|---------|-----------|------------------------|
| Listagem de veículos | ✓ | ✓ | ✓ |
| Detalhe do veículo | ✓ | ✓ | ✓ |
| Botão "Tenho interesse" | ✗ | ✓ (logado) | ✗ |
| Painel locador | ✓ | ✗ | ✗ |
| Painel motorista | ✗ | ✓ | ✗ |

---

# Passo 3: Stack técnica e MVP

## 3.1 Stack técnica (definida)

| Camada | Tecnologia | Por quê? |
|--------|------------|----------|
| **Frontend** | HTML + CSS + JavaScript | Começar com web é mais simples; mesma linguagem (JS) no backend |
| **Backend** | Node.js (Express) | Muita documentação e comunidade; JavaScript em todo o projeto |
| **Banco de dados** | SQLite (início) → PostgreSQL (produção) | SQLite não exige instalação; PostgreSQL é robusto para crescer |
| **Autenticação** | Sessões (login simples) ou JWT | Começar com sessões é mais direto |

**Por que web primeiro?**  
Web funciona em qualquer dispositivo, não exige loja de apps e é mais barato para iterar. Um app mobile pode vir depois.

## 3.2 Escopo do MVP (Mínimo Viável)

**O que entra no MVP:**
- ✅ Formulário de cadastro do locador (frontend)
- ✅ Backend: receber e salvar cadastro do locador (banco SQLite)
- ✅ Login de locador
- ✅ Cadastro e login de motorista
- ✅ CRUD de veículos (locador adiciona, edita, remove)
- ✅ Listagem pública de veículos
- ✅ Página de detalhe do veículo
- ✅ Botão "Tenho interesse" (motorista logado)
- ✅ Lista de interesses no painel do locador (com dados do motorista)
- ✅ Notificação por e-mail quando há novo interesse (opcional)

**O que fica para depois:**
- Selo "Verificado" (monetização)
- Filtros avançados, busca por localização
- Integração de pagamento, reserva online
- App mobile

## 3.3 Estrutura de pastas (implementada)

```
locadora-app/
├── PLANEJAMENTO.md
├── GUIA-INICIANTE.md
├── CONFIG-EMAIL.md
├── package.json
├── .gitignore
├── .env.example
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── email.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── locadores.js
│   │   ├── motoristas.js
│   │   ├── veiculos.js
│   │   └── interesses.js
│   └── scripts/
│       └── reset-interesses.js
├── database/
│   └── locadora.db (criado automaticamente ao rodar o servidor)
├── frontend/
│   ├── index.html
│   ├── cadastro-locador.html
│   ├── login-locador.html
│   ├── login-motorista.html
│   ├── painel-locador.html
│   ├── painel-motorista.html
│   ├── cadastro-motorista.html
│   ├── veiculos.html
│   ├── veiculo-detalhe.html
│   ├── meus-veiculos.html
│   ├── veiculo-form.html
│   ├── interesses-locador.html
│   └── css/
│       └── style.css
```

---

## Próximo passo

1. ~~Escolher a stack (Node.js definido)~~
2. ~~Montar a estrutura inicial e landing page~~
3. ~~Formulário de cadastro do locador (frontend)~~
4. ~~Backend: criar rota `/api/locadores` + banco SQLite para salvar os cadastros~~
5. ~~Login de locador~~
6. ~~Cadastro e login de motorista~~
7. ~~CRUD de veículos + listagem pública~~
8. ~~Botão "Tenho interesse" (motorista logado) + lista de interesses~~
9. ~~Notificação por e-mail quando há novo interesse~~
10. **MVP concluído. Próximas evoluções:** selo "Verificado", filtros avançados, etc.
