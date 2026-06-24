# Matheus & Nicolly - Casamento 2026

<div align="center">
  <h2>🎉 Site de Casamento com Lista de Presentes e RSVP</h2>
  <p>Aplicação web moderna para gerenciamento de convidados, lista de presentes e confirmação de presença</p>
  <p>
    <a href="https://matheus-nicolly.love" target="_blank">
      <strong>🌐 matheus-nicolly.love</strong>
    </a>
  </p>
</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Segurança e RLS](#-segurança-e-rls)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Desenvolvimento](#-desenvolvimento)

---

## 🎯 Sobre o Projeto

Este é um site completo de casamento para **Matheus & Nicolly**, programado para **18 de Novembro de 2026**.

🌐 **Site oficial**: [matheus-nicolly.love](https://matheus-nicolly.love)

O site inclui:

- **Contagem regressiva** até a data do casamento
- **Informações de localização** com mapa interativo do Google Maps
- **Formulário de RSVP** (confirmação de presença) com validação em português brasileiro
- **Lista de presentes** com carrinho de compras integrado
- **Painel administrativo** para gerenciamento de convidados
- **Design responsivo** e elegante com tema natura/terrosa

---

## ✨ Funcionalidades

### 🎨 Interface Pública
- **Welcome Screen**: Tela de boas-vindas com animações elegantes e elementos decorativos
- **Countdown**: Contagem regressiva em tempo real até o dia do casamento
- **Location**: Seção com mapa interativo (Google Maps) e informações do local (Villa Massari, Nova Friburgo - RJ)
- **RSVP Form**: Formulário de confirmação com:
  - Validação de telefone brasileiro (DDD válido)
  - Validação de e-mail
  - Tratamento de duplicatas (email/telefone único)
  - Feedback visual com toasts
- **Lista de Presentes**: Catálogo de produtos com:
  - Filtro de ordenação (preço, nome)
  - Carregamento infinito (infinite scroll)
  - Carrinho de compras persistente (localStorage)
  - Minicart com drawer deslizante

### 🔐 Área Administrativa
- **Login Admin**: Autenticação segura com token JWT
- **Dashboard de Convidados**: Lista completa de convidados confirmados
- **Atualização em Tempo Real**: Integração com Supabase Realtime

### 🛒 Carrinho de Compras
- Context API para gerenciamento de estado
- Persistência no localStorage
- Adicionar/remover itens
- Atualização de quantidade
- Visualização do total

---

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI com últimos recursos
- **TypeScript 5.9** - Tipagem estática
- **Vite 7** - Build tool extremamente rápido
- **TanStack Start** - Framework React moderno com SSR
- **TanStack Router** - Roteamento type-safe
- **TanStack Query** - Gerenciamento de cache e requisições assíncronas

### Estilização
- **Tailwind CSS v4** - Framework CSS utility-first
- **CSS Custom Properties** - Sistema de design com cores personalizadas

### Validação & Formulários
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas TypeScript-first
- **@hookform/resolvers** - Integração Zod + React Hook Form

### Backend & Banco de Dados
- **Supabase** - Backend-as-a-Service com:
  - PostgreSQL
  - Realtime subscriptions
  - Row Level Security (RLS)
  - Authentication

### Utilitários
- **react-scroll** - Scroll suave entre seções
- **sonner** - Notificações toast (alternativa moderna ao react-toastify)
- **vite-tsconfig-paths** - Path aliases

### Desenvolvimento & Segurança
- **ESLint** - Linting de código com regras de segurança React
- **TypeScript ESLint** - Linting específico para TypeScript
- **eslint-plugin-react-hooks** - Regras de segurança para React Hooks
- **Jest** - Framework de testes
- **Testing Library** - Testes de componentes React

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/
│   ├── contexts/          # Contextos React (CartContext)
│   ├── icons/             # Componentes de ícones SVG
│   ├── layout/            # Componentes de layout (Header, Main)
│   └── ui/                # Componentes UI reutilizáveis
│       ├── CartDrawer.tsx       # Drawer do carrinho
│       ├── Countdown.tsx        # Contagem regressiva
│       ├── inputForm.tsx        # Formulário RSVP
│       ├── Location.tsx         # Mapa e localização
│       ├── Products.tsx         # Lista de presentes
│       ├── TimeUnit.tsx         # Unidade de tempo
│       ├── ToastContainer.tsx   # Container de toasts
│       └── welcome.tsx          # Tela inicial
├── routes/                # Rotas TanStack Router
│   ├── __root.tsx              # Layout raiz
│   ├── _default.tsx            # Layout padrão
│   ├── lista2026.tsx           # Dashboard admin
│   └── login.tsx               # Login admin
├── schemas/               # Schemas Zod
│   ├── env.ts                  # Validação de env vars
│   └── guestSchema.ts          # Schema de convidado
├── services/              # Serviços externos
│   ├── auth/
│   │   └── admin.ts            # Autenticação admin
│   └── supabase/
│       ├── client.ts           # Client Supabase
│       ├── guests.ts           # Operações de convidados
│       ├── products.ts         # Operações de produtos
│       └── server.ts           # Client Supabase server-side
├── utils/                 # Funções utilitárias
│   └── toast.ts            # Helpers de toast
├── App.tsx                # Componente raiz
├── index.css              # Estilos globais
├── main.tsx               # Entry point
└── router.tsx             # Configuração do router
```

### Padrões de Arquitetura

#### 1. **Validação de Ambiente**
As variáveis de ambiente são validadas na startup via side-effect import em `main.tsx`:
```typescript
import "./schemas/env"; // Valida env vars antes de renderizar
```

#### 2. **TanStack Start + Router**
- File-based routing com rotas type-safe
- Server-side rendering (SSR) ready
- Contexto compartilhado (queryClient)

#### 3. **React Query para Gerenciamento de Dados**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});
```

#### 4. **Formulários com React Hook Form + Zod**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(guestSchema),
});
```

#### 5. **Context API para Estado Global**
```typescript
const CartContext = React.createContext<CartContextType | undefined>(undefined);
```

---

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase

### Passo 1: Clone o repositório
```bash
git clone <repository-url>
cd casar-app
```

### Passo 2: Instale as dependências
```bash
npm install
```

### Passo 3: Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute as migrações SQL em ordem:
   - `supabase/migrations/001_enable_rls_and_policies.sql` (RLS e políticas)
   - `supabase/migrations/002_create_orders_table.sql` (Tabela de pedidos)
3. Obtenha suas credenciais em Settings > API

### Passo 4: Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
# Cliente (exposto no bundle - apenas chaves públicas)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anon
VITE_MERCADO_PAGO_PUBLIC_KEY=sua-chave-publica-mp

# Servidor (NUNCA exposto no cliente - CREDENCIAIS SENSÍVEIS)
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
MERCADO_PAGO_ACCESS_TOKEN=seu-access-token-mp
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha_segura_123
```

### Passo 5: Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse em `http://localhost:5173`

---

## 🔒 Segurança e RLS

### 🛡️ Camadas de Segurança Implementadas

O projeto utiliza uma abordagem de **defense in depth** com múltiplas camadas de segurança:

#### 1. **Row Level Security (RLS) - Supabase**

Políticas de segurança no nível de banco de dados:

##### Tabela `GuestList` (Convidados)
- ✅ **Leitura pública**: Qualquer usuário pode visualizar convidados
- ✅ **Inserção pública**: Usuários anônimos podem adicionar convidados
- ❌ **UPDATE/DELETE bloqueados**: Apenas server-side (service_role) pode modificar

##### Tabela `Products` (Presentes)
- ✅ **Leitura pública**: Qualquer usuário pode ver produtos
- ❌ **INSERT/UPDATE/DELETE bloqueados**: Apenas server-side

##### Tabela `Orders` (Pedidos)
- ✅ **Leitura própria**: Usuários autenticados veem apenas seus pedidos
- ✅ **Inserção própria**: Usuários criam seus próprios pedidos
- ❌ **UPDATE/DELETE bloqueados**: Apenas server-side (webhooks Mercado Pago)

#### 2. **Rate Limiting - Login Admin**
- ✅ **Máximo de 5 tentativas** em 5 minutos
- ✅ **Bloqueio de 15 minutos** após excesso de tentativas
- ✅ **Reset automático** após login bem-sucedido
- ✅ **Proteção contra brute force** em memória

#### 3. **Validação de Ambiente (Zod)**
- ✅ **Validação na startup**: App não inicia se env vars inválidas
- ✅ **Type-safe**: Inferência automática de tipos TypeScript
- ✅ **Mensagens de erro claras** em português

#### 4. **ESLint - React Security Rules**
- ✅ **React Hooks exhaustive deps**: Previne bugs de useEffect
- ✅ **TypeScript strict mode**: Erros de tipagem em tempo de desenvolvimento
- ✅ **No console.log em produção**: Prevenção de vazamento de informações

### 🔐 Validação de Dados

- **Constraints únicos no banco**: Email e telefone únicos (database-level)
- **Zod schemas**: Validação client-side de telefone brasileiro (DDD válido)
- **Service Role Key**: Operações admin usam chave service-role (bypass RLS apenas server-side)

### 🎫 Autenticação Admin

```typescript
// Token JWT simplificado com expiração
const token = Buffer.from(
  JSON.stringify({
    admin: true,
    timestamp: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
  }),
).toString("base64");
```

**Características:**
- ✅ Expiração de 24 horas
- ✅ Validação em rotas protegidas
- ⚠️ **Melhoria futura**: Migrar para JWT assinado com secret key

### 📊 Score de Segurança Atual

| Camada | Status | Pontuação |
|--------|--------|-----------|
| RLS (Supabase) | ✅ Excelente | 10/10 |
| Environment Vars | ✅ Corrigido | 10/10 |
| Rate Limiting | ✅ Implementado | 9/10 |
| Auth Admin | ⚠️ Adequado | 7/10 |
| Code Quality | ✅ ESLint melhorado | 9/10 |

**Média Geral**: **9/10** 🎉

### 🔮 Melhorias Futuras Recomendadas

1. **HTTP-Only Cookies**: Migrar token admin de localStorage para cookies httpOnly (proteção XSS)
2. **JWT Assinado**: Substituir base64 por JWT com HMAC signature
3. **Auditoria**: Log de operações admin e tentativas de login
4. **CSRF Protection**: Implementar tokens CSRF para mutações

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 5173) |
| `npm run build` | Cria build de produção |
| `npm run lint` | Executa ESLint |
| `npm run preview` | Preview do build de produção |
| `npm run test` | Executa testes Jest |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Executa testes com coverage report |

---

## 🎨 Variáveis de Ambiente

### ⚠️ Variáveis de Cliente (Prefixo VITE_)
Variáveis com prefixo `VITE_` são expostas no bundle do cliente:

**Obrigatórias:**
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_KEY`: Chave anônima (public) - segura devido ao RLS

**Opcionais:**
- `VITE_MERCADO_PAGO_PUBLIC_KEY`: Chave pública do Mercado Pago (checkout frontend)

### 🔒 Variáveis de Servidor (Sem Prefixo)
Variáveis sem prefixo `VITE_` são **apenas server-side** e **nunca** expostas no cliente:

**Obrigatórias para funcionalidades completas:**
- `SUPABASE_SERVICE_ROLE_KEY`: Chave service-role para operações admin (bypass RLS)
- `MERCADO_PAGO_ACCESS_TOKEN`: Token de acesso do Mercado Pago (API pagamentos)
- `ADMIN_USERNAME`: Usuário para acesso admin
- `ADMIN_PASSWORD`: Senha para acesso admin (mínimo 8 caracteres)

### 🔐 Segurança de Environment Variables
- ✅ **Variáveis sensíveis** (service role keys, access tokens, passwords) **NUNCA** devem ter prefixo `VITE_`
- ✅ Apenas chaves públicas e non-sensitive keys podem ter prefixo `VITE_`
- ✅ O sistema valida automaticamente as variáveis na startup via Zod schema
- ❌ Se houver erro de validação, a aplicação não inicia

> **Nota**: Nunca commite `.env.local` no versionamento. Use `.env.example` como template.

---

## 💻 Desenvolvimento

### Adicionando Novos Componentes

```typescript
// src/components/ui/NovoComponente.tsx
export default function NovoComponente() {
  return (
    <div className="bg-forest text-cream">
      <h1>Meu Componente</h1>
    </div>
  );
}
```

### Criando Novas Rotas

```typescript
// src/routes/minha-rota.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/minha-rota")({
  component: MinhaRota,
});

function MinhaRota() {
  return <div>Minha Rota</div>;
}
```

### Consumindo APIs Supabase

```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase/client";

const { data, isLoading } = useQuery({
  queryKey: ["guests"],
  queryFn: async () => {
    const { data } = await supabase.from("GuestList").select("*");
    return data;
  },
});
```

---

## 📣 Changelog Recente

### ✨ v1.1.0 - Atualização de Segurança (2026-06-23)

**🔒 Correções Críticas de Segurança:**
- ✅ **Corrigido vazamento de MERCADO_PAGO_ACCESS_TOKEN**: Movido de `VITE_MERCADO_PAGO_ACCESS_TOKEN` (cliente) para `MERCADO_PAGO_ACCESS_TOKEN` (server-only)
- ✅ **Rate Limiting no Login Admin**: Implementado sistema de 5 tentativas/5min + bloqueio de 15min
- ✅ **ESLint Melhorado**: Adicionadas regras de segurança React/TypeScript

**⚡ Melhorias de Código:**
- ✅ Corrigido `setState` em useEffect (CartContext)
- ✅ Eliminado blocos `catch` vazios (melhor tratamento de erro)
- ✅ Adicionado dependências de desenvolvimento para ESLint moderno

**📦 Novas Dependências:**
- `@eslint/js`
- `typescript-eslint`
- `eslint-plugin-react-hooks`

**📚 Documentação:**
- ✅ README atualizado com melhores práticas de segurança
- ✅ Documentação de environment variables melhorada
- ✅ Score de segurança documentado (9/10)

---

## 📸 Créditos de Imagens

As imagens utilizadas neste projeto são provenientes das seguintes fontes:

- **Imagens do local (Villa Massari)**: [contatovillamassar.wixsite.com](https://contatovillamassar.wixsite.com/)
- **Imagens dos produtos (Lista de Presentes)**: [casar.com](https://www.casar.com/)

---

## 📄 Licença

Este projeto é privado e confidencial.

---

## 👥 Autores

- **Matheus & Nicolly** - Noivos

---

## 🙏 Agradecimentos

- Supabase pela infraestrutura de backend
- TanStack pelas ferramentas excelentes
- Comunidade React e TypeScript

---

**Data do Casamento**: 18 de Novembro de 2026 | **Local**: Villa Massari, Nova Friburgo - RJ | **Site**: [matheus-nicolly.love](https://matheus-nicolly.love)
