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
- **react-toastify** - Notificações toast
- **vite-tsconfig-paths** - Path aliases

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
2. Execute a migração SQL em `supabase/migrations/001_enable_rls_and_policies.sql`
3. Obtenha suas credenciais em Settings > API

### Passo 4: Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=sua-chave-anon

SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
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

### Row Level Security (RLS)

O projeto implementa políticas de segurança robustas via Supabase RLS:

#### Tabela `GuestList` (Convidados)
- ✅ **Leitura pública**: Qualquer usuário pode visualizar convidados
- ✅ **Inserção pública**: Usuários anônimos podem adicionar convidados
- ❌ **UPDATE/DELETE bloqueados**: Apenas server-side (service_role) pode modificar

#### Tabela `Products` (Presentes)
- ✅ **Leitura pública**: Qualquer usuário pode ver produtos
- ❌ **INSERT/UPDATE/DELETE bloqueados**: Apenas server-side

### Validação de Dados

- **Constraints únicos**: Email e telefone são únicos na tabela
- **Zod schemas**: Validação client-side de telefone brasileiro (DDD)
- **Service Role Key**: Operações admin usam chave service_role

### Autenticação Admin

```typescript
// JWT token para autenticação admin
const token = jwt.sign(
  { username, role: "admin" },
  SECRET_KEY,
  { expiresIn: "24h" }
);
```

---

## 📦 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento (porta 5173) |
| `npm run build` | Cria build de produção |
| `npm run lint` | Executa ESLint |
| `npm run preview` | Preview do build de produção |

---

## 🎨 Variáveis de Ambiente

### Obrigatórias (Cliente)
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_KEY`: Chave anônima (public)

### Opcionais (Servidor)
- `SUPABASE_SERVICE_ROLE_KEY`: Chave service-role para operações admin
- `ADMIN_USERNAME`: Usuário para acesso admin
- `ADMIN_PASSWORD`: Senha para acesso admin (mínimo 8 caracteres)

> **Nota**: O sistema valida automaticamente as variáveis na startup. Se houver erro, a aplicação não inicia.

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
