# CASAR-APP

Site de casamento com RSVP, lista de presentes e checkout Mercado Pago.

**Live:** [matheus-nicolly.love](https://matheus-nicolly.love)
**Data:** 18/11/2026

## Stack

- React 19 + TypeScript + Vite 7
- TanStack Router/Start (SSR)
- Tailwind CSS v4
- Supabase (PostgreSQL + RLS)
- Mercado Pago Checkout Pro
- React Hook Form + Zod

## Estrutura

```
src/
├── components/     # React components
│   ├── contexts/   # CartContext
│   ├── layout/     # Header, Main
│   └── ui/         # 18 componentes reutilizáveis
├── routes/         # TanStack Router (8 rotas)
├── schemas/        # Zod schemas (env, guest)
├── services/       # Supabase, MP, Auth
└── utils/          # formatCurrency, toast
```

## Setup

```bash
npm install
cp .env.example .env  # configure suas credenciais
npm run dev            # http://localhost:5173
```

## Variáveis de Ambiente

```env
# Cliente (VITE_*)
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
VITE_MERCADO_PAGO_PUBLIC_KEY=...

# Servidor (sem prefixo)
MERCADO_PAGO_ACCESS_TOKEN=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

> **Atenção:** Variáveis `VITE_*` são expostas no bundle. Use apenas para chaves públicas.

## Scripts

| Comando         | Descrição                   |
| --------------- | --------------------------- |
| `npm run dev`   | Servidor de desenvolvimento |
| `npm run build` | Build de produção           |
| `npm run lint`  | Executa ESLint              |
| `npm test`      | Executa testes (39 passing) |

## Supabase

Execute as migrações em ordem no SQL Editor:

1. `supabase/migrations/001_enable_rls_and_policies.sql`

**Tabelas:** `GuestList`, `Products`

## Mercado Pago

**Webhook:** `/api/webhooks/mercadopago`
**Validação:** HMAC-SHA256 ativo
**Status:** Apenas log (não salva pedidos)

Para testar webhook localmente:

```bash
ngrok http 5173
# Use a URL HTTPS no painel MP
```

## Funcionalidades

- ✅ RSVP com validação Zod (telefone BR, email único)
- ✅ Lista de presentes com carrinho localStorage
- ✅ Checkout Mercado Pago (Pix, cartão, boleto)
- ✅ Painel admin `/login` (rate limiting: 5 tentativas/5min)
- ✅ Realtime guests via Supabase

## Padrões

- **Tipagem:** 0 `any` - TypeScript strict
- **Formulários:** React Hook Form + Zod
- **Toast:** `sonner` (top-center)
- **Paginação:** Infinite scroll (10 itens)
- **SEO:** Meta tags + JSON-LD + sitemap

## Observações

- **Hydration Mismatch:** Badge do carrinho usa `mounted` state (trade-off necessário)
- **Webhook:** Apenas loga pagamentos, não persiste no banco (por design)
- **Sitemap:** Configurado com domínio real (matheus-nicolly.love)
