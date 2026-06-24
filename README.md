# Matheus & Nicolly - Casamento 2026

<div align="center">
  <h2>🎉 Site de Casamento com Lista de Presentes e RSVP</h2>
  <p>Aplicação web moderna para gerenciamento de convidados, lista de presentes e confirmação de presença com integração com Mercado Pago</p>
  <p>
    <a href="https://matheus-nicolly.love" target="_blank">
      <strong>🌐 matheus-nicolly.love</strong>
    </a>
  </p>
</div>

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Configuração Rápida](#configuração-rápida)
- [Configuração do Supabase](#configuração-do-supabase)
- [Configuração do Mercado Pago](#configuração-do-mercado-pago)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Segurança](#segurança)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este é um site completo de casamento para **Matheus & Nicolly**, programado para **18 de Novembro de 2026**.

### O que você pode fazer com este projeto:

- ✅ Convidados podem confirmar presença (RSVP) através de formulário validado
- ✅ Visualizar contagem regressiva até o casamento
- ✅ Ver informações do local com mapa interativo
- ✅ Navegar pela lista de presentes e adicionar ao carrinho
- ✅ Finalizar compra com pagamento via Mercado Pago
- ✅ Administradores podem gerenciar convidados confirmados

**Stack moderno**: React 19 + TypeScript + TanStack Start + Supabase + Mercado Pago

---

## ✨ Funcionalidades

### 🎨 Para Convidados

- **RSVP (Confirmação de Presença)**
  - Formulário com validação de telefone brasileiro (DDD válido)
  - Validação de e-mail único
  - Feedback visual com toasts animados

- **Contagem Regressiva**
  - Timer em tempo real até 18/11/2026
  - Exibição elegante de dias, horas, minutos e segundos

- **Localização**
  - Mapa interativo do Google Maps
  - Informações do local (Villa Massari, Nova Friburgo - RJ)

- **Lista de Presentes**
  - Catálogo de produtos com imagens e preços
  - Filtro de ordenação (preço, nome)
  - Carrinho de compras persistente (localStorage)
  - Minicart com drawer deslizante
  - **Checkout integrado com Mercado Pago**
    - Pix (pagamento instantâneo)
    - Cartão de crédito
    - Boleto

### 🔐 Para Administradores

- **Painel Admin** (`/admin`)
  - Login seguro com rate limiting (5 tentativas/5min)
  - Dashboard com lista de convidados confirmados
  - Visualização em tempo real (Supabase Realtime)
  - Estatísticas de confirmações

### 💳 Pagamentos (Mercado Pago)

- **Webhook de Notificações** (`/api/webhooks/mercadopago`)
  - Recebe atualizações de pagamento em tempo real
  - Atualiza status do pedido automaticamente
  - Suporte a múltiplos status (approved, rejected, pending, refunded)

---

## 🚀 Tecnologias

### Frontend Core

- **React 19** - Última versão com novos recursos
- **TypeScript 5.9** - Type safety em todo o código
- **Vite 7** - Build tool extremamente rápido
- **TanStack Start** - Framework React com SSR
- **TanStack Router** - Roteamento type-safe file-based
- **TanStack Query** - Cache e requisições assíncronas

### Estilização

- **Tailwind CSS v4** - Framework utility-first
- **Sistema de design customizado** - Cores natura/terrosa
- **CSS Custom Properties** - Temas configuráveis

### Validação & Formulários

- **React Hook Form** - Gerenciamento performático
- **Zod** - Schemas TypeScript-first
- **@hookform/resolvers** - Integração Zod + RHF

### Backend & Banco de Dados

- **Supabase** - Backend-as-a-Service
  - PostgreSQL com RLS (Row Level Security)
  - Realtime subscriptions
  - Authentication
  - Storage

### Pagamentos

- **Mercado Pago API** - Processamento de pagamentos
  - Checkout Pro
  - Webhooks para notificações
  - Suporte a Pix, cartão e boleto

### Utilitários

- **react-scroll** - Scroll suave entre seções
- **sonner** - Toast notifications (top-center)
- **lucide-react** - Ícones modernos
- **Base UI** - Componentes acessíveis

---

## ⚡ Configuração Rápida

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta [Supabase](https://supabase.com) (grátis)
- Conta [Mercado Pago](https://mercadopago.com.br) (para pagamentos)

### Instalação

```bash
# 1. Clone o repositório
git clone <repository-url>
cd casar-app

# 2. Instale as dependências
npm install

# 3. Configure o ambiente (veja abaixo)
cp .env.example .env

# 4. Configure Supabase e Mercado Pago (veja abaixo)

# 5. Inicie o desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🔧 Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Anote a **URL** e **anon key** em Settings > API

### 2. Criar Tabelas

No Supabase SQL Editor, execute as migrações em ordem:

```sql
-- Migração 1: RLS e Políticas de Segurança
-- Execute: supabase/migrations/001_enable_rls_and_policies.sql

-- Migração 2: Tabela de Pedidos
-- Execute: supabase/migrations/002_create_orders_table.sql
```

### 3. Criar Tabelas Básicas

Se ainda não existirem, crie:

```sql
-- Tabela de Convidados
CREATE TABLE IF NOT EXISTS "GuestList" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "nome" TEXT NOT NULL,
  "email" TEXT UNIQUE,
  "telefone" TEXT UNIQUE,
  "acompanhantes" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos (Lista de Presentes)
CREATE TABLE IF NOT EXISTS "Products" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "nome" TEXT NOT NULL,
  "descricao" TEXT,
  "preco" NUMERIC(10, 2) NOT NULL,
  "imagem" TEXT,
  "url" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Service Role Key

Ainda em Settings > API, copie a **service_role key** (NUNCA use no frontend).

---

## 💳 Configuração do Mercado Pago

### 1. Criar Aplicação

1. Acesse [mercadopago.com.br/developers](https://mercadopago.com.br/developers)
2. Crie uma nova aplicação
3. Configure as credenciais

### 2. Obter Credenciais

```bash
# No painel do Mercado Pago, copie:
# - Access Token (para backend)
# - Public Key (para frontend)
```

### 3. Configurar Webhook

**Importante**: Para receber notificações de pagamento, configure o webhook:

1. No painel do Mercado Pago, vá em **Integrações > Webhooks**
2. Adicione URL: `https://seu-dominio.com/api/webhooks/mercadopago`
3. Configure eventos: `payment` (todos os tipos)
4. Para desenvolvimento, use ngrok ou similar:
   ```bash
   ngrok http 5173
   ```
   Use a URL gerada no webhook do Mercado Pago

### 4. Testar Webhook Localmente

```bash
# Instale ngrok
npm install -g ngrok

# Inicie o dev server
npm run dev

# Em outro terminal, exponha a porta
ngrok http 5173

# Use a URL HTTPS do ngrok no webhook do Mercado Pago
```

---

## 📁 Estrutura do Projeto

```
casar-app/
├── src/
│   ├── components/
│   │   ├── contexts/          # Contexts (CartContext, etc)
│   │   ├── layout/            # Header, Main, Footer
│   │   └── ui/                # Componentes reutilizáveis
│   │       ├── sonner.tsx         # Toast notifications
│   │       ├── CartDrawer.tsx     # Carrinho drawer
│   │       ├── Countdown.tsx      # Contagem regressiva
│   │       ├── inputForm.tsx      # Formulário RSVP
│   │       ├── Location.tsx       # Mapa/localização
│   │       ├── Products.tsx       # Lista de presentes
│   │       └── welcome.tsx        # Tela inicial
│   ├── routes/                # Rotas TanStack Router
│   │   ├── __root.tsx             # Layout raiz
│   │   ├── _default.tsx           # Layout padrão
│   │   ├── index.tsx              # Home (/)
│   │   ├── lista2026.tsx           # Lista de presentes
│   │   ├── admin.tsx              # Painel admin
│   │   ├── login.tsx              # Login admin
│   │   └── api.webhooks.mercadopago.tsx  # Webhook endpoint
│   ├── schemas/               # Zod schemas
│   │   ├── env.ts                  # Validação de env vars
│   │   └── guestSchema.ts          # Schema de convidado
│   ├── services/              # Serviços externos
│   │   ├── auth/
│   │   │   └── admin.ts            # Autenticação admin
│   │   ├── supabase/
│   │   │   ├── client.ts           # Client Supabase
│   │   │   ├── guests.ts           # Operações convidados
│   │   │   ├── orders.ts           # Operações pedidos
│   │   │   └── products.ts         # Operações produtos
│   │   └── mercadopago/
│   │       ├── webhook-handler.ts  # Handler webhook
│   │       └── create-preference.ts # Cria checkout
│   ├── utils/                 # Utilitários
│   ├── App.tsx                # Componente raiz
│   ├── main.tsx               # Entry point
│   └── router.tsx             # Configuração router
├── supabase/
│   └── migrations/            # Migrações SQL
│       ├── 001_enable_rls_and_policies.sql
│       └── 002_create_orders_table.sql
├── public/                    # Arquivos estáticos
├── .env.example               # Template env vars
├── .env                       # Variáveis de ambiente (não commitar)
└── package.json
```

---

## 🔐 Variáveis de Ambiente

### Cliente (Prefixo `VITE_*`)

**Obrigatórias:**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABAKE_KEY=sua-chave-anon
```

**Opcionais (para pagamentos):**

```env
VITE_MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-mp
```

### Servidor (Sem prefixo - NUNCA expostas no cliente)

```env
# Supabase Service Role (para operações admin)
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Mercado Pago Access Token (para backend/webhooks)
MERCADO_PAGO_ACCESS_TOKEN=seu-access-token

# Credenciais Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha_segura_123
```

### ⚠️ Importante

- ✅ Variáveis com `VITE_` são expostas no bundle cliente (use apenas para chaves públicas)
- ✅ Variáveis sem `VITE_` são server-only (segredos)
- ✅ O sistema valida automaticamente na startup via Zod
- ❌ Nunca commitar `.env` - use `.env.example` como template

---

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 5173)
npm run build        # Build de produção
npm run lint         # Executa ESLint
npm run preview      # Preview do build de produção
npm run test         # Executa testes Jest
npm run test:watch   # Testes em modo watch
npm run test:coverage # Testes com coverage
```

---

## 🛡️ Segurança

### Camadas Implementadas

1. **Row Level Security (RLS) - Supabase**
   - ✅ Leitura pública para convidados e produtos
   - ✅ Inserção pública para convidados
   - ❌ UPDATE/DELETE bloqueados no client
   - ✅ Usuários veem apenas seus próprios pedidos

2. **Rate Limiting - Login Admin**
   - ✅ Máximo 5 tentativas em 5 minutos
   - ✅ Bloqueio de 15 minutos após excesso
   - ✅ Proteção contra brute force

3. **Validação de Ambiente**
   - ✅ Validação na startup via Zod
   - ✅ Mensagens de erro claras em português
   - ✅ App não inicia se env vars inválidas

4. **Mercado Pago Webhooks**
   - ✅ Webhook recebe notificações via POST
   - ✅ Validação de dados antes de processar
   - ✅ Logs de todos os eventos
   - ✅ CORS configurado

## 🔧 Troubleshooting

### Problema: "VITE_SUPABASE_URL is not defined"

**Solução:**

```bash
# Verifique se o arquivo .env existe
ls -la .env

# Se não existir, crie a partir do example
cp .env.example .env

# Edite o .env com suas credenciais reais
```

### Problema: "Credenciais do Mercado Pago não configuradas" (Produção)

**Solução:**

No **TanStack Start + Netlify**, variáveis server-side usam `process.env` e precisam ser configuradas no painel Netlify:

1. **Acesse o painel Netlify**
   - Vá em: Site settings > Environment variables

2. **Configure as variáveis server-side:**
   ```
   MERCADO_PAGO_ACCESS_TOKEN=APP_USR-7301047654796642-062309-...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=senha_segura_123
   ```

3. **Configure as variáveis client-side (se não estiver no .env):**
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_KEY=sua-chave-anon
   VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-aedced26-256c-48bb-9a66-...
   ```

4. **Rebuild automático**
   - O Netlify fará rebuild automático após salvar
   - Aguarde o deploy completar

**Nota**: Variáveis com `VITE_` são expostas no cliente. Sem `VITE_` são server-only.

### Problema: "RLS policy failed"

**Solução:**

```sql
-- No Supabase SQL Editor, verifique as políticas
SELECT * FROM pg_policies WHERE tablename IN ('GuestList', 'Products', 'Orders');

-- Execute as migrações novamente se necessário
```

### Problema: "Webhook não está recebendo notificações"

**Solução:**

1. Verifique se a URL está correta no painel Mercado Pago
2. Para desenvolvimento, use ngrok:
   ```bash
   ngrok http 5173
   ```
3. Configure a URL HTTPS do ngrok no webhook
4. Verifique os logs do console: `console.log("Received Mercado Pago webhook:")`

### Problema: "Pagamento não está atualizando o pedido"

**Solução:**

```bash
# 1. Verifique se MERCADO_PAGO_ACCESS_TOKEN está configurado no Netlify
# Site settings > Environment variables

# 2. No painel Mercado Pago, verifique o webhook status
# Acesse: Integrações > Webhooks > Logs

# 3. Teste o webhook manualmente
curl -X POST https://seu-dominio.com/api/webhooks/mercadopago \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data_id":"123"}'
```

### Problema: "Build falha com erro de tipos"

**Solução:**

```bash
# Limpe o cache e reinstale
rm -rf node_modules
rm package-lock.json
npm install

# Verifique a versão do TypeScript
npm run build --debug
```

---

## 📄 Licença

Este projeto é privado e confidencial.

---

## 👥 Autores

- **Matheus & Nicolly** - Noivos

---

## 🙏 Créditos

- **Supabase** - Infraestrutura de backend
- **TanStack** - Ferramentas excelentes (Router, Query, Start)
- **Mercado Pago** - Processamento de pagamentos
- **Vercel** - Inspiration do design system
- Comunidade React e TypeScript

---

## 📸 Imagens

- **Villa Massari (local)**: [contatovillamassar.wixsite.com](https://contatovillamassar.wixsite.com/)
- **Lista de presentes**: [casar.com](https://www.casar.com/)

---

**📅 Data do Casamento**: 18 de Novembro de 2026
**📍 Local**: Villa Massari, Nova Friburgo - RJ
**🌐 Site**: [matheus-nicolly.love](https://matheus-nicolly.love)

---

## 🎉 Próximos Passos

Depois de configurar o projeto:

1. ✅ Adicione produtos na tabela `Products`
2. ✅ Teste o formulário de RSVP
3. ✅ Configure o webhook do Mercado Pago
4. ✅ Teste o fluxo completo de compra
5. ✅ Acesse `/admin` para ver os convidados

**Dica**: Use as credenciais admin configuradas no `.env` para acessar o painel.

---

**🚀 Divirta-se e parabéns aos noivos!**
