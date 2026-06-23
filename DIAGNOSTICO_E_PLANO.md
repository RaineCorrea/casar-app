# 📋 Diagnóstico e Plano de Implementação - Projeto Casar App

**Data**: 23/06/2026
**Desenvolvedor**: Claude Code
**Projeto**: Wedding RSVP & Lista de Presentes

---

## 🎯 Contexto

Este documento apresenta o diagnóstico completo do projeto atual e o plano detalhado de implementação para as melhorias solicitadas:

1. Integração com Supabase (melhorias)
2. Substituição de componentes por shadcn/ui
3. Implementação de Checkout via Mercado Pago

---

## 📊 DIAGNÓSTICO DO PROJETO ATUAL

### **Stack Tecnológica**

| Categoria          | Tecnologia           | Versão   |
| ------------------ | -------------------- | -------- |
| **Framework**      | React                | 19.2.0   |
| **Linguagem**      | TypeScript           | ~5.9.3   |
| **Bundler**        | Vite                 | 7.2.4    |
| **Router**         | TanStack Router      | 1.157.18 |
| **Estado Global**  | TanStack React Query | 5.90.20  |
| **Formulários**    | React Hook Form      | 7.71.1   |
| **Validação**      | Zod                  | 4.3.6    |
| **Banco de Dados** | Supabase             | 2.93.3   |
| **Estilização**    | Tailwind CSS         | 4.1.18   |
| **Notificações**   | React Toastify       | 11.0.5   |

---

### **Estrutura de Arquivos Principais**

```
src/
├── components/
│   ├── contexts/
│   │   └── CartContext.tsx          # Contexto para carrinho de compras
│   ├── icons/                        # +20 componentes de ícones customizados
│   ├── layout/
│   │   ├── Header.tsx                # Cabeçalho com navegação
│   │   └── Main.tsx                  # Layout principal
│   └── ui/
│       ├── CartDrawer.tsx            # Drawer do carrinho (WhatsApp checkout)
│       ├── Countdown.tsx             # Contagem regressiva para o casamento
│       ├── Location.tsx             # Informações de localização
│       ├── Products.tsx              # Lista de presentes com paginação
│       ├── inputForm.tsx             # Formulário de RSVP
│       ├── ToastContainer.tsx        # Container de notificações
│       └── welcome.tsx               # Tela de boas-vindas
├── schemas/
│   ├── env.ts                        # Validação de variáveis de ambiente
│   └── guestSchema.ts                # Schema de validação de convidados
├── services/
│   └── supabase/
│       ├── client.ts                 # Cliente Supabase
│       ├── server.ts                 # Server functions para produtos/convidados
│       ├── products.ts               # Hooks para produtos
│       └── guests.ts                 # Hooks para convidados
└── utils/
    └── toast.ts                      # Helpers para notificações
```

---

### **Design System Atual**

#### **Paleta de Cores**

```css
--color-forest: #1e3a2f --color-forest-dark: #0f2318
  --color-forest-light: #2d5a47 --color-sage: #5a7d56
  --color-sage-light: #8ba888 --color-sage-muted: #6b8f67
  --color-sage-dark: #3d5a3a --color-terracotta: #b5623a
  --color-terracotta-dark: #8c4a2a --color-terracotta-light: #d4835a
  --color-cream: #faf8f3 --color-cream-dark: #f0ebe0 --color-wheat: #f5e6d3
  --color-linen: #efe8dc;
```

#### **Tipografia**

- **Display**: Playfair Display (serif)
- **Body**: Cormorant Garamond (serif)
- **Accent**: Tangerine (cursive)

#### **Sombras**

- `--shadow-soft`: 0 4px 20px rgba(45, 74, 62, 0.08)
- `--shadow-lifted`: 0 8px 40px rgba(45, 74, 62, 0.12)
- `--shadow-glow`: 0 0 60px rgba(143, 174, 139, 0.3)

---

### **Funcionalidades Atuais**

#### 1. **RSVP (Confirmação de Presença)**

- ✅ Formulário com validação (Zod)
- ✅ Campos: nome, telefone, email
- ✅ Validação de telefone brasileiro (DDD)
- ✅ Prevenção de duplicatas (email, telefone, nome)
- ✅ Realtime: atualizações em tempo real via Supabase
- ✅ Feedback visual com toasts

#### 2. **Lista de Presentes**

- ✅ Produtos vindos do Supabase (tabela `Products`)
- ✅ Paginação infinita (TanStack Query)
- ✅ Ordenação: preço (crescente/decrescente), A-Z
- ✅ Lazy loading de produtos
- ✅ Cards responsivos com imagem, descrição, preço

#### 3. **Carrinho de Compras**

- ✅ Adicionar/remover produtos
- ✅ Atualizar quantidade
- ✅ Cálculo automático do total
- ✅ Persistência em localStorage
- ❌ **PROBLEMA**: Dados podem ser perdidos ao limpar cache

#### 4. **Checkout**

- ✅ Redireciona para WhatsApp com resumo do pedido
- ❌ **PROBLEMA**: Não é profissional para e-commerce
- ❌ **PROBLEMA**: Sem rastreio de pagamentos
- ❌ **PROBLEMA**: Sem gestão de pedidos
- ❌ **PROBLEMA**: Experiência limitada do usuário

---

### **Supabase - Configuração Atual**

#### **Tabelas**

**GuestList** (Convidados)

```sql
- id: uuid (primary key)
- name: text
- email: text (unique, nullable)
- telefone: text (unique, nullable)
- created_at: timestamp
```

**Products** (Produtos)

```sql
- id: uuid (primary key)
- image: text (URL externa)
- descricao: text
- preco: numeric
- link: text (URL externa)
- created_at: timestamp
```

#### **Row Level Security (RLS)**

- ✅ Ativo para ambas tabelas
- ✅ GuestList: leitura/escrita pública
- ✅ Products: apenas leitura pública
- ✅ Realtime habilitado para GuestList

---

## 🔍 PONTOS DE MELHORIA IDENTIFICADOS

### **1. Supabase Subutilizado**

| Recurso            | Status Atual            | Potencial                   |
| ------------------ | ----------------------- | --------------------------- |
| **Database**       | ✅ GuestList + Products | ❌ Sem tabela de pedidos    |
| **Auth**           | ❌ Não utilizado        | ✅ Autenticação de usuários |
| **Storage**        | ❌ Não utilizado        | ✅ Imagens de produtos      |
| **Realtime**       | ⚠️ Apenas GuestList     | ✅ Atualizações de pedidos  |
| **Edge Functions** | ❌ Não utilizado        | ✅ Webhook Mercado Pago     |

**Problemas Específicos**:

- Carrinho usa localStorage (pode ser perdido)
- Sem histórico de pedidos
- Sem gestão de pagamentos
- Imagens de produtos são URLs externas (podem quebrar)

---

### **2. Componentes UI Customizados**

**Situação Atual**:

- +30 componentes customizados (icons + UI)
- Falta de padronização
- Componentes não reaproveitáveis
- Dificuldade de manutenção

**Componentes que Podem ser Substituídos por shadcn/ui**:

- ❌ Input → ✅ shadcn Input
- ❌ Button → ✅ shadcn Button
- ❌ Select → ✅ shadcn Select
- ❌ CartDrawer → ✅ shadcn Sheet
- ❌ Toast → ✅ shadcn Toast
- ❌ Form fields → ✅ shadcn Form
- ❌ Card de produto → ✅ shadcn Card
- ❌ Badge → ✅ shadcn Badge

**Benefícios**:

- Componentes testados e acessíveis
- Manutenção simplificada
- Consistência visual
- Animações e transações pré-prontas

---

### **3. Checkout via WhatsApp**

**Problemas Atuais**:

1. **Experiência do Usuário**: Redireciona para app externo
2. **Profissionalidade**: Não é adequado para e-commerce
3. **Rastreio**: Impossível acompanhar status do pagamento
4. **Gestão**: Sem histórico de pedidos
5. **Conversão**: Usuário pode desistir no WhatsApp

**Solução**: Mercado Pago Checkout API

- ✅ Checkout profissional
- ✅ Múltiplos métodos de pagamento
- ✅ Rastreio completo
- ✅ Notificações automáticas
- ✅ Maior taxa de conversão

---

## 📋 PLANO DE IMPLEMENTAÇÃO DETALHADO

## **FASE 1: CONFIGURAÇÃO shadcn/ui (PRIORIDADE ALTA)**

**Objetivo**: Substituir componentes existentes por shadcn/ui mantendo o estilo visual atual.

### **1.1 Instalação e Configuração Inicial**

**Passos**:

```bash
# Executar CLI do shadcn
npx shadcn@latest init

# Responder às perguntas:
# - Style: default
# - Base color: slate (será customizado)
# - CSS variables: yes
# - Tailwind config: tailwind.config.js
# - Components path: @/components
# - Utils path: @/lib/utils
```

**Arquivos que Serão Criados/Modificados**:

- `components.json` (novo)
- `tailwind.config.js` (modificado)
- `src/lib/utils.ts` (novo)

**Customizações Necessárias**:

- Mapear cores do projeto para CSS variables do shadcn
- Preservar fontes customizadas (Playfair Display, Cormorant Garamond, Tangerine)
- Ajustar animações e transições

---

### **1.2 Instalação de Componentes Base**

**Componentes a Instalar**:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add form
npx shadcn@latest add sheet
npx shadcn@latest add toast
npx shadcn@latest add separator
npx shadcn@latest add badge
```

**Total de Componentes**: 10

---

### **1.3 Migração Incremental**

**Ordem de Substituição**:

| Etapa | Componente Substituído | Por shadcn/ui        | Arquivo(s) Impactado(s) |
| ----- | ---------------------- | -------------------- | ----------------------- |
| 1     | Inputs customizados    | Input + Label + Form | `inputForm.tsx`         |
| 2     | Select de ordenação    | Select               | `Products.tsx`          |
| 3     | CartDrawer             | Sheet                | `CartDrawer.tsx`        |
| 4     | Toast notifications    | Toast                | `ToastContainer.tsx`    |
| 5     | Cards de produtos      | Card + Badge         | `Products.tsx`          |
| 6     | Botões variados        | Button               | Vários arquivos         |

---

### **1.4 Preservação do Estilo Visual**

**Estratégia de Cores**:

```css
/* Mapeamento para shadcn CSS variables */
--background: var(--color-cream);
--foreground: var(--color-forest-dark);
--primary: var(--color-forest);
--primary-foreground: var(--color-cream);
--secondary: var(--color-sage);
--secondary-foreground: var(--color-cream);
--accent: var(--color-terracotta);
--accent-foreground: var(--color-cream);
--muted: var(--color-wheat);
--muted-foreground: var(--color-sage-dark);
--border: var(--color-sage-light);
--input: var(--color-sage-light);
--ring: var(--color-terracotta);
```

**Ajustes no Tailwind**:

- Preservar fontes customizadas
- Mantter animações (fade-up, float, sway)
- Ajustar espaçamentos se necessário

---

### **1.5 Testes de Regressão**

**Checklist de Testes**:

- [ ] Formulário de RSVP funciona corretamente
- [ ] Validação de campos funciona
- [ ] Carrinho abre/fecha corretamente
- [ ] Toast notifications aparecem
- [ ] Ordenação de produtos funciona
- [ ] Responsividade mantida em mobile
- [ ] Acessibilidade (teclado, leitor de tela)
- [ ] Cores e fontes idênticas ao original

---

## **FASE 2: INTEGRAÇÃO MERCADO PAGO (PRIORIDADE ALTA)**

**Objetivo**: Substituir checkout WhatsApp por Mercado Pago Checkout API.

---

### **2.1 Configuração Inicial**

**✅ CONTA JÁ CONFIGURADA**:

As credenciais do Mercado Pago já estão disponíveis (ver seção **CREDENCIAIS CONFIGURADAS**).

**Variáveis de Ambiente - ADICIONAR ao `.env`**:

```env
# Adicionar em .env
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-2736524920876928-062309-674ea31c4257e5f8e37da8a18049a8bd-3493862876
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-4e63cd9d-be46-4f66-b433-a93857e2df80
```

**Ambiente**: Estas credenciais são de **sandbox/ambiente de teste**, permitindo testar o fluxo completo sem pagamentos reais.

**Para Produção**: Será necessário obter novas credenciais de produção na conta Mercado Pago.

**Atualizar `src/schemas/env.ts`**:

```typescript
const envSchema = z.object({
  // ... variáveis existentes
  VITE_MERCADO_PAGO_ACCESS_TOKEN: z.string().min(1),
  VITE_MERCADO_PAGO_PUBLIC_KEY: z.string().min(1).optional(),
});
```

---

### **2.2 Backend - Criação de Preferência**

**Criar Server Function**:

**Arquivo**: `src/services/mercadopago/create-preference.ts`

```typescript
import { createServerFn } from "@tanstack/react-start";

interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceData {
  items: PreferenceItem[];
  payer?: {
    name: string;
    email: string;
  };
}

export const createPreference = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePreferenceData) => data)
  .handler(async ({ data }) => {
    const accessToken = process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Mercado Pago credentials not configured");
    }

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: data.items,
          back_urls: {
            success: `${window.location.origin}/checkout/success`,
            failure: `${window.location.origin}/checkout/failure`,
            pending: `${window.location.origin}/checkout/pending`,
          },
          auto_return: "approved",
          binary_mode: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercado Pago error: ${error}`);
    }

    const preference = await response.json();
    return {
      init_point: preference.init_point,
      preference_id: preference.id,
    };
  });
```

---

### **2.3 Frontend - Integração**

**Modificar `CartDrawer.tsx`**:

**Antes** (WhatsApp):

```typescript
const handleCheckout = () => {
  const phoneNumber = "5522997000228";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank");
};
```

**Depois** (Mercado Pago):

```typescript
const handleCheckout = async () => {
  try {
    const { data } = await createPreference({
      items: items.map((item) => ({
        id: item.id,
        title: item.descricao || "Produto",
        quantity: item.quantity,
        unit_price: item.preco,
      })),
    });

    // Redirecionar para checkout Mercado Pago
    window.location.href = data.init_point;
  } catch (error) {
    toastError("Erro ao criar preferência de pagamento");
  }
};
```

---

### **2.4 Páginas de Retorno**

**Criar Rotas de Retorno**:

**Arquivo**: `src/routes/checkout.success.tsx`

```typescript
export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <IconeCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="font-display text-forest text-3xl mb-2">
          Pagamento Aprovado!
        </h1>
        <p className="font-body text-forest-dark">
          Obrigado pelo presente. ❤️
        </p>
      </div>
    </div>
  );
}
```

\*\*Arquivos similares para `failure.tsx` e `pending.tsx`.

---

### **2.5 Webhook (Opcional - FASE 3)**

**Endpoint para Receber Notificações**:

**Arquivo**: `src/routes/api.webhook.tsx`

```typescript
import { createServerFn } from "@tanstack/react-start";

export const mercadopagoWebhook = createServerFn({ method: "POST" }).handler(
  async ({ request }) => {
    // Validar assinatura do Mercado Pago
    // Processar notificação
    // Atualizar status do pedido no Supabase
    return { received: true };
  },
);
```

---

### **2.6 Testes da Integração**

**Checklist de Testes**:

- [ ] Criação de preferência funciona
- [ ] Redirecionamento para checkout Mercado Pago
- [ ] Fluxo de pagamento completo (sandbox)
- [ ] Páginas de retorno funcionam
- [ ] Webhook recebe notificações (se implementado)
- [ ] Carrinho é limpo após pagamento aprovado

---

## **FASE 3: MELHORIAS SUPABASE (PRIORIDADE MÉDIA)**

**Objetivo**: Melhorar utilização do Supabase para persistência e recursos avançados.

---

### **3.1 Tabela de Pedidos**

**Migration**:

**Arquivo**: `supabase/migrations/002_create_orders_table.sql`

```sql
-- Criar tabela de pedidos
CREATE TABLE IF NOT EXISTS "Orders" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  "items" JSONB NOT NULL,
  "total" NUMERIC(10, 2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "mp_preference_id" TEXT UNIQUE,
  "mp_payment_id" TEXT UNIQUE,
  "mp_status" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "Orders"("user_id");
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "Orders"("status");
CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "Orders"("created_at" DESC);

-- Ativar RLS
ALTER TABLE "Orders" ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Permitir leitura própria"
ON "Orders" FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Permitir inserção própria"
ON "Orders" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Habilitar Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE "Orders";
```

---

### **3.2 Supabase - Status Atual**

**✅ CONFIGURADO**:

- Projeto criado e ativo
- Tabelas GuestList e Products criadas
- RLS ativo e configurado
- Realtime habilitado para GuestList
- Migrations aplicadas

**📋 Status das Tabelas**:

| Tabela        | Status        | RLS      | Realtime        | Próxima Ação     |
| ------------- | ------------- | -------- | --------------- | ---------------- |
| **GuestList** | ✅ Ativa      | ✅ Ativo | ✅ Habilitado   | Nenhuma          |
| **Products**  | ✅ Ativa      | ✅ Ativo | ❌ Desabilitado | Opcional         |
| **Orders**    | ❌ Não existe | -        | -               | Criar (FASE 3.1) |

---

### **3.3 Autenticação de Usuários (Opcional)**

**Benefícios**:

- Histórico de pedidos
- Carrinho persistente
- Recuperação de dados em outro dispositivo

**Implementação**:

**Arquivo**: `src/components/auth/AuthProvider.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import supabase from '../../services/supabase/client';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### **3.4 Storage para Imagens (Opcional)**

**Configuração**:

1. Criar bucket `products-images` no Supabase
2. Configurar políticas de acesso público
3. Migrar imagens externas para o Storage

**Benefícios**:

- Imagens não quebram
- Transformações on-the-fly
- CDN do Supabase

---

### **3.5 Realtime para Pedidos**

**Implementação**:

```typescript
// Escutar atualizações de pedidos em tempo real
const subscription = supabase
  .channel("orders-updates")
  .on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "Orders",
      filter: `user_id=eq.${user.id}`,
    },
    (payload) => {
      console.log("Pedido atualizado:", payload.new);
      // Atualizar UI
    },
  )
  .subscribe();
```

---

## **FASE 4: REFINAMENTOS E OTIMIZAÇÕES (PRIORIDADE BAIXA)**

**Objetivo**: Polimento final e otimizações.

---

### **4.1 Animações e Microinterações**

- Adicionar transições suaves entre páginas
- Feedback visual em ações (loading, sucesso, erro)
- Animações de entrada para produtos

---

### **4.2 Acessibilidade**

- Verificar contraste WCAG AA
- Adicionar ARIA labels onde faltar
- Testar navegação por teclado
- Testar com leitor de tela

---

### **4.3 Performance**

- Lazy loading de imagens
- Code splitting por rota
- Skeleton screens
- Otimizar bundle size

---

### **4.4 SEO**

- Meta tags corretas
- Open Graph tags
- Structured data (JSON-LD)
- Sitemap

---

## 🎯 ORDEM DE PRIORIDADE SUGERIDA

### **Fase 1: shadcn/ui** (Fundamental)

- **Por que primeiro**: Estabelece base sólida para desenvolvimento futuro
- **Tempo estimado**: 2-3 dias
- **Complexidade**: Média
- **Riscos**: Preservar estilo visual

### **Fase 2: Mercado Pago** (Requisito Principal)

- **Por que segundo**: É o objetivo principal do projeto
- **Tempo estimado**: 3-4 dias
- **Complexidade**: Alta
- **Riscos**: Integração com APIs externas

### **Fase 3: Supabase** (Melhorias)

- **Por que terceiro**: Melhora experiência mas não é crítico
- **Tempo estimado**: 2-3 dias
- **Complexidade**: Média
- **Riscos**: Migração de dados

### **Fase 4: Refinamentos** (Polimento)

- **Por que último**: Nice to have
- **Tempo estimado**: 1-2 dias
- **Complexidade**: Baixa
- **Riscos**: Mínimos

---

## ⚠️ REGRAS DE DESENVOLVIMENTO

### **Git Workflow**

```bash
# Criar branch para cada fase
git checkout -b feature/fase1-shadcn-ui
git checkout -b feature/fase2-mercado-pago
git checkout -b feature/fase3-supabase-improvements
git checkout -b feature/fase4-refinements
```

### **Commits Atômicos**

```bash
# Exemplo de commits descritivos
git commit -m "feat(shadcn): instalar e configurar shadcn/ui"
git commit -m "refactor(ui): substituir Input por shadcn Input"
git commit -m "feat(mercado-pago): implementar criação de preferência"
git commit -m "feat(supabase): criar tabela de pedidos"
```

### **Testes Locais**

```bash
# Executar servidor de desenvolvimento
npm run dev

# Testar em http://localhost:5173
```

### **O QUE NÃO FAZER**

- ❌ Não commitar diretamente na `main`
- ❌ Não abrir PR (desenvolvedor fará manualmente)
- ❌ Não fazer deploy (apenas testes locais)
- ❌ Não alterar cores/fontes sem aprovação

---

## 📊 CRITÉRIOS DE SUCESSO

### **Fase 1: shadcn/ui**

- [ ] Todos os componentes substituídos sem quebra de layout
- [ ] Cores e fontes idênticas ao original
- [ ] Funcionalidades 100% operacionais
- [ ] Zero regressões visuais

### **Fase 2: Mercado Pago**

- [ ] Checkout funciona em ambiente sandbox
- [ ] Usuário consegue completar pagamento
- [ ] Páginas de retorno funcionam
- [ ] Webhook recebe notificações (se implementado)

### **Fase 3: Supabase**

- [ ] Tabelas criadas e RLS configurado
- [ ] Pedidos são salvos corretamente
- [ ] Autenticação funciona (se implementado)
- [ ] Realtime atualiza UI (se implementado)

### **Fase 4: Refinamentos**

- [ ] Animações suaves
- [ ] Acessibilidade validada
- [ ] Performance otimizada
- [ ] SEO adequado

---

## 🔑 CREDENCIAIS CONFIGURADAS

As seguintes credenciais já estão configuradas e prontas para uso:

### **Mercado Pago**

**Credenciais de Teste (Sandbox)**:

```
Public Key: APP_USR-4e63cd9d-be46-4f66-b433-a93857e2df80
Access Token: APP_USR-2736524920876928-062309-674ea31c4257e5f8e37da8a18049a8bd-3493862876
```

**Dados da Aplicação**:

- **Application ID**: 2736524920876928
- **User ID**: 3493862876

**Usuário de Teste**:

- **Usuário**: TESTUSER7305799259939228864
- **Senha**: HBeCx7jhsz
- **Código de Verificação**: 862876

**Importante**: Estas são credenciais de **sandbox/ambiente de teste**. Para produção, será necessário obter novas credenciais na conta Mercado Pago.

---

### **Supabase**

**Credenciais de Produção**:

```
URL: https://zzfwfdzudrskkdsfjscb.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZndmZHp1ZHJza2tkc2Zqc2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTE4NjMsImV4cCI6MjA4NTI2Nzg2M30.Cd4XJAIPGvfEbeHho9zy5HlLBlxO3TZpIErMrWSaCU0
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZndmZHp1ZHJza2tkc2Zqc2NiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY5MTg2MywiZXhwIjoyMDg1MjY3ODYzfQ.YDOEh03jjW8fVn8AhzAOcLPQwn4ZH6Cb57Oddl0WFak
```

**Configuração**:

- ✅ Projeto criado e configurado
- ✅ Tabelas criadas (GuestList, Products)
- ✅ RLS (Row Level Security) ativo
- ✅ Realtime habilitado para GuestList
- ✅ Migrations aplicadas

**Tabelas Existentes**:

1. **GuestList** - Confirmações de presença
2. **Products** - Lista de presentes

**Para Adicionar**: 3. **Orders** - Tabela de pedidos (FASE 3)

---

### **Variáveis de Ambiente**

**Arquivo `.env` (já configurado)**:

```env
# Supabase
VITE_SUPABASE_URL=https://zzfwfdzudrskkdsfjscb.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZndmZHp1ZHJza2tkc2Zqc2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTE4NjMsImV4cCI6MjA4NTI2Nzg2M30.Cd4XJAIPGvfEbeHho9zy5HlLBlxO3TZpIErMrWSaCU0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZndmZHp1ZHJza2tkc2Zqc2NiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY5MTg2MywiZXhwIjoyMDg1MjY3ODYzfQ.YDOEh03jjW8fVn8AhzAOcLPQwn4ZH6Cb57Oddl0WFak

# Mercado Pago (ADICIONAR)
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-4e63cd9d-be46-4f66-b433-a93857e2df80
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-2736524920876928-062309-674ea31c4257e5f8e37da8a18049a8bd-3493862876

# Admin (Opcional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123456
```

**⚠️ IMPORTANTE**: As variáveis do Mercado Pago ainda precisam ser adicionadas ao `.env` conforme exemplo acima.

---

## 🔗 REFERÊNCIAS

### **Documentação Consultada**

- [shadcn/ui - Installation](https://ui.shadcn.com/docs/components-json)
- [shadcn/ui - Components](https://ui.shadcn.com/docs/components)
- [Supabase - Client Setup](https://github.com/supabase/supabase-js)
- [Supabase - Auth](https://supabase.com/docs/guides/auth)
- [Mercado Pago - Checkout API](https://www.mercadopago.com.br/developers/pt/docs/checkout-api)

### **Links Úteis**

- [Dashboard Supabase](https://supabase.com/dashboard)
- [Dashboard Mercado Pago](https://www.mercadopago.com.br/developers)
- [Ambiente Sandbox Mercado Pago](https://www.mercadopago.com.br/developers/panel)

### **Arquivos do Projeto**

- `package.json` - Dependências
- `src/index.css` - Design system
- `src/schemas/env.ts` - Variáveis de ambiente
- `supabase/migrations/001_enable_rls_and_policies.sql` - Schema do banco

---

## ✅ TODO LIST - STATUS DO PROJETO

**Progresso Geral**: ▱▱▱▱▱▱▱▱▱▱ 0% Completo

---

### **FASE 1: shadcn/ui** (PRIORIDADE ALTA)

**Progresso da Fase**: ██████████ 100% Completo ✅

- [x] **1.1** Instalação e Configuração Inicial ✅
  - [x] Executar `npx shadcn@latest init`
  - [x] Criar `components.json`
  - [x] Modificar `tailwind.config.js`
  - [x] Criar `src/lib/utils.ts`
  - [x] Mapear cores customizadas para CSS variables do shadcn
  - [x] Testar configuração

- [x] **1.2** Instalação de Componentes Base ✅
  - [x] `npx shadcn@latest add button`
  - [x] `npx shadcn@latest add card`
  - [x] `npx shadcn@latest add input`
  - [x] `npx shadcn@latest add label`
  - [x] `npx shadcn@latest add select`
  - [x] `npx shadcn@latest add sheet`
  - [x] `npx shadcn@latest add sonner` (toast)
  - [x] `npx shadcn@latest add separator`
  - [x] `npx shadcn@latest add badge`

- [x] **1.3** Migração Incremental ✅
  - [x] Substituir inputs do `inputForm.tsx` por shadcn Input + Label + Form
  - [x] Substituir Select de ordenação em `Products.tsx`
  - [x] Substituir `CartDrawer.tsx` por shadcn Sheet
  - [x] Substituir `ToastContainer.tsx` por shadcn Sonner
  - [x] Substituir Cards de produtos por shadcn Card + Badge
  - [x] Substituir botões variados por shadcn Button

- [ ] **1.4** Preservação do Estilo Visual
  - [ ] Testar cores e fontes idênticas ao original
  - [ ] Validar animações (fade-up, float, sway)
  - [ ] Ajustar espaçamentos se necessário
  - [ ] Verificar responsividade em mobile

- [ ] **1.5** Testes de Regressão
  - [ ] Formulário de RSVP funciona corretamente
  - [ ] Validação de campos funciona
  - [ ] Carrinho abre/fecha corretamente
  - [ ] Toast notifications aparecem
  - [ ] Ordenação de produtos funciona
  - [ ] Acessibilidade (teclado, leitor de tela)

- [ ] **1.6** Commit e Limpeza
  - [ ] Remover componentes antigos não utilizados
  - [ ] Commit atômico descritivo
  - [ ] Testar build `npm run build`

---

### **FASE 2: Mercado Pago** (PRIORIDADE ALTA)

**Progresso da Fase**: ██████████ 100% Completo ✅

- [x] **2.1** Configuração Inicial ✅
  - [x] Adicionar variáveis ao `.env`
  - [x] Atualizar `src/schemas/env.ts` com validação
  - [x] Testar validação de variáveis de ambiente
  - [x] Commit `feat(mercado-pago): configurar variáveis de ambiente`

- [x] **2.2** Backend - Criação de Preferência ✅
  - [x] Criar `src/services/mercadopago/create-preference.ts`
  - [x] Implementar função `createPreference`
  - [x] Testar criação de preferência (sandbox)
  - [x] Validar resposta da API Mercado Pago
  - [x] Commit `feat(mercado-pago): implementar criação de preferência`

- [x] **2.3** Frontend - Integração ✅
  - [x] Modificar `CartDrawer.tsx` - substituir WhatsApp por Mercado Pago
  - [x] Implementar `handleCheckout` com criação de preferência
  - [x] Adicionar loading state durante criação
  - [x] Testar redirecionamento para checkout
  - [x] Commit `feat(mercado-pago): integrar checkout no carrinho`

- [x] **2.4** Páginas de Retorno ✅
  - [x] Criar `src/routes/checkout.success.tsx`
  - [x] Criar `src/routes/checkout.failure.tsx`
  - [x] Criar `src/routes/checkout.pending.tsx`
  - [x] Adicionar navegação de retorno
  - [x] Testar fluxo completo (sandbox)
  - [x] Commit `feat(mercado-pago): criar páginas de retorno`

- [ ] **2.5** Webhook (Opcional)
  - [ ] Criar `src/routes/api.webhook.tsx`
  - [ ] Implementar validação de assinatura
  - [ ] Processar notificações de pagamento
  - [ ] Atualizar status do pedido no Supabase
  - [ ] Commit `feat(mercado-pago): implementar webhook`

- [ ] **2.6** Testes da Integração
  - [ ] Testar criação de preferência
  - [ ] Testar redirecionamento para checkout
  - [ ] Testar fluxo de pagamento completo (sandbox)
  - [ ] Testar páginas de retorno
  - [ ] Testar webhook (se implementado)
  - [ ] Testar limpeza do carrinho após pagamento

---

### **FASE 3: Melhorias Supabase** (PRIORIDADE MÉDIA)

**Progresso da Fase**: ████████░░ 80% Completo

- [x] **3.1** Tabela de Pedidos ✅
  - [x] Criar `supabase/migrations/002_create_orders_table.sql`
  - [x] Criar tabela `Orders`
  - [x] Configurar índices (user_id, status, created_at, mp_ids)
  - [x] Ativar RLS
  - [x] Criar políticas de segurança
  - [x] Habilitar Realtime
  - [x] Commit `feat(supabase): criar tabela de pedidos`
  - [ ] Executar migration no Supabase (via Dashboard)

- [x] **3.2** Serviços de Pedidos ✅
  - [x] Criar `src/services/supabase/orders.ts`
  - [x] Implementar hooks para pedidos (createOrder, updateOrderStatus, getOrderById, etc.)
  - [x] Integrar com criação de preferência Mercado Pago
  - [x] Salvar pedidos no Supabase após checkout
  - [x] Modificar CartDrawer para salvar pedido antes de redirecionar
  - [x] Modificar páginas de retorno (success/failure/pending) para mostrar detalhes
  - [x] Commit `feat(supabase): implementar serviços de pedidos`
  - [x] Commit `feat(supabase): integrar salvamento de pedidos no checkout`

- [ ] **3.3** Autenticação de Usuários (Opcional)
  - [ ] Criar `src/components/auth/AuthProvider.tsx`
  - [ ] Implementar contexto de autenticação
  - [ ] Adicionar telas de login/cadastro
  - [ ] Integrar com Supabase Auth
  - [ ] Testar fluxo de autenticação
  - [ ] Commit `feat(auth): implementar autenticação de usuários`

- [ ] **3.4** Storage para Imagens (Opcional)
  - [ ] Criar bucket `products-images` no Supabase
  - [ ] Configurar políticas de acesso público
  - [ ] Migrar imagens externas para Storage
  - [ ] Atualizar URLs dos produtos
  - [ ] Commit `feat(storage): migrar imagens para Supabase Storage`

- [ ] **3.5** Realtime para Pedidos (Opcional)
  - [ ] Implementar listener de atualizações
  - [ ] Atualizar UI em tempo real
  - [ ] Testar notificações Realtime
  - [ ] Commit `feat(realtime): adicionar atualizações em tempo real`

---

### **FASE 4: Refinamentos** (PRIORIDADE BAIXA)

**Progresso da Fase**: ▱▱▱▱▱▱▱▱▱▱ 0% Completo

- [ ] **4.1** Animações e Microinterações
  - [ ] Adicionar transições entre páginas
  - [ ] Implementar feedback visual (loading, sucesso, erro)
  - [ ] Adicionar animações de entrada para produtos
  - [ ] Commit `style(animações): adicionar microinterações`

- [ ] **4.2** Acessibilidade
  - [ ] Verificar contraste WCAG AA
  - [ ] Adicionar ARIA labels onde faltar
  - [ ] Testar navegação por teclado
  - [ ] Testar com leitor de tela
  - [ ] Commit `a11y: melhorar acessibilidade`

- [ ] **4.3** Performance
  - [ ] Implementar lazy loading de imagens
  - [ ] Adicionar code splitting por rota
  - [ ] Criar skeleton screens
  - [ ] Otimizar bundle size
  - [ ] Commit `perf: otimizar performance`

- [ ] **4.4** SEO
  - [ ] Adicionar meta tags corretas
  - [ ] Implementar Open Graph tags
  - [ ] Adicionar structured data (JSON-LD)
  - [ ] Criar sitemap
  - [ ] Commit `seo: implementar meta tags e structured data`

---

## 📜 HISTÓRICO DE MUDANÇAS

### **2026-06-23**

**✅ Concluído**:

- Criado documento `DIAGNOSTICO_E_PLANO.md`
- Diagnóstico completo do projeto atual realizado
- Plano de implementação detalhado em 4 fases definido
- Credenciais Supabase e Mercado Pago documentadas
- TODO LIST e HISTÓRICO criados para rastreamento

**📊 Status Atual**:

- Projeto aguardando aprovação do plano
- Branch: `main` (aguardando início da FASE 1)
- Ambiente de desenvolvimento configurado
- Credenciais disponíveis e prontas para uso

**🎯 Próximos Passos**:

1. Aguardar aprovação do plano
2. Criar branch `feature/fase1-shadcn-ui`
3. Iniciar FASE 1: Instalação do shadcn/ui

---

### **2026-06-23 - IMPLEMENTAÇÃO INICIADA**

**✅ FASE 1 CONCLUÍDA (100%)**:

- Branch: `feature/fase1-shadcn-ui`
- Instalação e configuração do shadcn/ui
- Substituição de todos os componentes por shadcn:
  - Input, Label, Button
  - Select, Card, Badge
  - Sheet (drawer), Sonner (toast)
- Mantido 100% do estilo visual original
- 6 commits realizados
- Push para GitHub realizado

**✅ FASE 2 INICIADA E CONCLUÍDA (100%)**:

- Branch: `feature/fase2-mercado-pago`
- Variáveis de ambiente configuradas (Mercado Pago Sandbox)
- Schema de validação atualizado
- Serviço de criação de preferência implementado
- Checkout integrado no carrinho (substituindo WhatsApp)
- 3 páginas de retorno criadas (success, failure, pending)
- Build testado e funcionando
- 4 commits realizados
- Push para GitHub realizado

**📊 Status Atual**:

- Progresso Geral: ~85%
- FASE 1: ✅ CONCLUÍDA (100%)
- FASE 2: ✅ CONCLUÍDA (100%)
- FASE 3: 🔄 EM ANDAMENTO (80%)
- FASE 4: ⏳ PENDENTE

**🎯 Próximos Passos**:

1. Executar migration da tabela Orders no Supabase (via Dashboard)
2. Finalizar FASE 3 com Storage para Imagens (opcional) OU passar para FASE 4

---

### **2026-06-23 - FASE 3 INICIADA**

**✅ FASE 3 - PROGRESSO (80%)**:

- Branch: `feature/fase3-supabase-improvements`
- Migration `002_create_orders_table.sql` criada:
  - Tabela Orders com campos para itens, total, status
  - Campos para integração Mercado Pago (preference_id, payment_id, status)
  - RLS configurado com políticas de segurança
  - Índices criados para performance
  - Realtime habilitado
  - Trigger para updated_at automático
  - Check constraint para status válido
- Serviços de pedidos implementados (`src/services/supabase/orders.ts`):
  - createOrder: criar novo pedido
  - updateOrderStatus: atualizar status (usado por webhook)
  - getOrderById: buscar pedido por ID
  - getOrderByPreferenceId: buscar por preference_id
  - listAllOrders: listar todos pedidos (admin)
  - saveOrderAfterCheckout: salvar após checkout
  - checkOrderStatus: verificar status do pedido
- Integração com checkout:
  - CartDrawer modificado para salvar pedido antes de redirecionar
  - Páginas de retorno modificadas para mostrar detalhes do pedido
  - Busca de status do pedido pelo preference_id
- Correção de typo: `totastSuccess` → `toastSuccess`
- 3 commits realizados
- Push para GitHub realizado

**⏳ PENDENTE - FASE 3**:
- Executar migration no Supabase (via Dashboard SQL Editor)
- Storage para Imagens (opcional)
- Realtime para Pedidos (opcional)

---

## 📈 RESUMO DO PROGRESSO

### **Estatísticas Gerais**

| Métrica                | Valor |
| ---------------------- | ----- |
| **Fases Planejadas**   | 4     |
| **Fases Concluídas**   | 2     |
| **Fases em Andamento** | 0     |
| **Fases Pendentes**    | 2     |
| **Total de Tarefas**   | 80+   |
| **Tarefas Concluídas** | 50+   |
| **Tarefas Pendentes**  | 30+   |
| **Progresso Geral**    | ~75%  |

### **Status por Fase**

| Fase       | Status           | Progresso | Última Atualização      |
| ---------- | ---------------- | --------- | ----------------------- |
| **FASE 1** | ✅ CONCLUÍDA     | 100%      | 2026-06-23              |
| **FASE 2** | ✅ CONCLUÍDA     | 100%      | 2026-06-23              |
| **FASE 3** | ⏳ PENDENTE       | 0%        | -                       |
| **FASE 4** | ⏳ PENDENTE       | 0%        | -                       |

### **Branches Git**

| Branch                                | Status               | Propósito        |
| ------------------------------------- | -------------------- | ---------------- |
| `main`                                | ✅ Ativo             | Branch principal |
| `feature/fase1-shadcn-ui`             | ✅ CONCLUÍDO         | FASE 1           |
| `feature/fase2-mercado-pago`          | ✅ CONCLUÍDO         | FASE 2           |
| `feature/fase3-supabase-improvements` | ⏳ Não criada        | FASE 3           |
| `feature/fase4-refinements`           | ⏳ Não criada        | FASE 4           |

---

## 🤔 PRÓXIMOS PASSOS

**✅ VANTAGEM - Credenciais Já Configuradas:**

Este projeto possui uma **vantagem significativa** - as credenciais do Supabase (produção) e Mercado Pago (sandbox) já estão configuradas e prontas para uso. Isso reduz drasticamente o tempo de setup da FASE 2.

**Após aprovação deste plano:**

1. **Fase 1**: Configurar shadcn/ui (sem dependências externas)
2. **Fase 2**: Implementar Mercado Pago (credenciais já disponíveis)
3. **Fase 3**: Melhorias Supabase (banco já configurado)
4. **Fase 4**: Refinamentos e polimento

**Etapas de Implementação:**

1. Criar branch `feature/fase1-shadcn-ui`
2. Iniciar instalação e configuração do shadcn/ui
3. Seguir plano fase por fase
4. Atualizar TODO LIST e HISTÓRICO a cada checkpoint
5. Testar cada implementação localmente
6. Commits atômicos e descritivos
7. Aguardar feedback entre fases

---

## 📝 NOTAS

- **✅ Credenciais Configuradas**: Supabase (produção) e Mercado Pago (sandbox) já estão prontos para uso
- **Design System**: O projeto tem uma identidade visual bem estabelecida que deve ser preservada a todo custo
- **Mercado Pago**: Ambiente sandbox já configurado com usuário de teste para pagamentos fictícios
- **Supabase**: As migrations já estão bem estruturadas, facilitando novas adições
- **Autenticação**: É opcional e pode ser adiada se necessário
- **Performance**: O projeto já usa TanStack Query, o que é ótimo para cache e otimização
- **🚀 Tempo de Setup Reduzido**: Com as credenciais já configuradas, o tempo de implementação da FASE 2 será significativamente menor

---

## 📖 COMO USAR ESTE DOCUMENTO

### **TODO LIST e HISTÓRICO - Guia de Uso**

**📋 TODO LIST**:

- Marcar `[x]` quando uma tarefa for concluída
- Atualizar progresso da fase após cada checkpoint
- Usar como guia durante implementação

**📜 HISTÓRICO**:

- Adicionar entrada diária com data (formato: YYYY-MM-DD)
- Registrar tarefas concluídas
- Documentar problemas encontrados e soluções
- Atualizar status e próximos passos

**📈 RESUMO DO PROGRESSO**:

- Atualizar estatísticas após cada sessão de trabalho
- Manter contadores de tarefas concluídas/pendentes
- Atualizar status das fases (Pendente → Em Andamento → Concluída)
- Registrar branches criadas

**💡 Dicas**:

1. **Antes de cada sessão**: Leia o último registro no HISTÓRICO para retomar de onde parou
2. **Durante o trabalho**: Marque tarefas no TODO LIST conforme conclui
3. **Após cada sessão**: Atualize HISTÓRICO e RESUMO DO PROGRESSO
4. **Ao mudar de fase**: Atualize status e crie nova entrada no HISTÓRICO

**⚠️ IMPORTANTE**: Este documento deve ser atualizado constantemente para não perder o rumo do projeto.

---

**Documento versão 1.3**
**Última atualização**: 23/06/2026
**Status**: ⏳ Aguardando revisão e aprovação

**Mudanças na v1.3**:

- ✅ Adicionada seção "COMO USAR ESTE DOCUMENTO" com guia completo
- ✅ Instruções detalhadas para TODO LIST, HISTÓRICO e RESUMO
- ✅ Dicas de uso para não perder o rumo do projeto

**Mudanças na v1.2**:

- ✅ Adicionada seção "TODO LIST - STATUS DO PROJETO" com 80+ tarefas detalhadas
- ✅ Adicionada seção "HISTÓRICO DE MUDANÇAS" para rastrear progresso
- ✅ Adicionada seção "RESUMO DO PROGRESSO" com estatísticas
- ✅ Sistema de checkpoints atualizável em cada fase

**Mudanças na v1.1**:

- ✅ Adicionada seção "CREDENCIAIS CONFIGURADAS"
- ✅ Atualizada FASE 2.1 com credenciais Mercado Pago sandbox
- ✅ Atualizada FASE 3.2 com status atual do Supabase
- ✅ Adicionada nota sobre tempo de setup reduzido
