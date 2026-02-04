# Configuração de Segurança e RLS - Casamento App

## 📋 Visão Geral

Este documento descreve a implementação de Row-Level Security (RLS) e autenticação admin para o aplicativo de casamento.

## 🔐 Arquitetura de Segurança

### Componentes Implementados

1. **Políticas RLS no Banco de Dados**
2. **Autenticação Admin Server-Side**
3. **Validações de Banco (Constraints Únicos)**

---

## 1️⃣ Políticas RLS (Row-Level Security)

### Tabela `GuestList` (Convidados)

| Operação | Política | Quem Pode | Descrição |
|----------|----------|-----------|-----------|
| **SELECT** | Leitura Pública | `anon`, `authenticated` | Qualquer pessoa pode ver a lista de convidados |
| **INSERT** | Inserção Pública | `anon`, `authenticated` | Qualquer pessoa pode confirmar presença (RSVP) |
| **UPDATE** | Bloqueado | Ninguém via client | Apenas admin via service role key |
| **DELETE** | Bloqueado | Ninguém via client | Apenas admin via service role key |

### Tabela `Products` (Lista de Presentes)

| Operação | Política | Quem Pode | Descrição |
|----------|----------|-----------|-----------|
| **SELECT** | Leitura Pública | `anon`, `authenticated` | Qualquer pessoa pode ver a lista de presentes |
| **INSERT** | Bloqueado | Apenas admin | Apenas server via service role key |
| **UPDATE** | Bloqueado | Apenas admin | Apenas server via service role key |
| **DELETE** | Bloqueado | Apenas admin | Apenas server via service role key |

---

## 2️⃣ Autenticação Admin

### Implementação

- **Localização**: [`src/services/auth/admin.ts`](../src/services/auth/admin.ts)
- **Estratégia**: Credenciais estáticas via environment variables
- **Token**: JWT simples em base64 (expira em 24h)

### Variáveis de Ambiente

```bash
# .env.local
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sua_senha_segura_aqui
```

### Funções Disponíveis

| Função | Tipo | Descrição |
|--------|------|-----------|
| `adminLogin` | Server Function (POST) | Autentica usuário e retorna token |
| `validateAdminToken` | Utilitário | Valida formato e expiração do token (client/server) |

### Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/login` | Pública | Página de login admin |
| `/lista2026` | 🔒 Admin | Lista de convidados (requer autenticação) |

---

## 3️⃣ Validações de Banco

### Constraints Únicos

```sql
-- Email único na tabela GuestList
ALTER TABLE "GuestList"
ADD CONSTRAINT "guestlist_email_unique" UNIQUE ("email");

-- Telefone único na tabela GuestList
ALTER TABLE "GuestList"
ADD CONSTRAINT "guestlist_telefone_unique" UNIQUE ("telefone");
```

### Índices de Performance

```sql
-- Busca por email
CREATE INDEX "idx_guestlist_email" ON "GuestList"("email")
WHERE "email" IS NOT NULL;

-- Busca por telefone
CREATE INDEX "idx_guestlist_telefone" ON "GuestList"("telefone")
WHERE "telefone" IS NOT NULL;

-- Ordenação por data
CREATE INDEX "idx_guestlist_created_at" ON "GuestList"("created_at" DESC);
```

---

## 4️⃣ Como Aplicar as Migrações

### Via SQL Editor (Supabase Dashboard)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie o conteúdo de [`supabase/migrations/001_enable_rls_and_policies.sql`](../supabase/migrations/001_enable_rls_and_policies.sql)
5. Cole e execute

### Via CLI (Recomendado)

```bash
# Se você tiver o Supabase CLI instalado
supabase db push

# Ou aplicar arquivo específico
supabase db execute -f supabase/migrations/001_enable_rls_and_policies.sql
```

---

## 5️⃣ Configuração de Ambiente

### Passo 1: Atualizar `.env.local`

```bash
# Copiar de .env.example
cp .env.example .env.local

# Editar .env.local com suas credenciais
```

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here

# Admin Credentials (use senha forte!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=sua_senha_muito_segura_aqui_min_8_caracteres
```

### Passo 2: Validar Configuração

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Se houver erro de validação de env, o app irá avisar
```

---

## 6️⃣ Fluxo de Autenticação

```
┌─────────────┐
│   Usuário   │
└─────┬───────┘
      │
      │ 1. Acessa /lista2026
      ▼
┌─────────────────┐
│  Verifica Token │
│  (localStorage) │
└─────┬───────────┘
      │
      ├─ Sem token ──► Redireciona para /login
      │
      ├─ Token inválido ──► Redireciona para /login
      │
      └─ Token válido ──► Exibe lista
                          │
                          ├─ 2. Carregar dados
                          │   (guestsQueryOptions)
                          │
                          └─ 3. Logout remove token
                              e redireciona para /login
```

---

## 7️⃣ Exemplos de Uso

### Acessar Rota Admin

```typescript
// Se não autenticado, redireciona para /login
import { createFileRoute } from "@tanstack/react-router";
import { validateAdminToken } from "../services/auth/admin";

export const Route = createFileRoute("/lista2026")({
  component: ListaAdmin,
});

function ListaAdmin() {
  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token || !validateAdminToken(token)) {
      window.location.href = "/login";
    }
  }, []);

  // ...
}
```

---

## 8️⃣ Melhores Práticas de Segurança

### ✅ Boas Práticas Implementadas

1. **RLS Ativo**: Todas as tabelas têm RLS habilitado
2. **Princípio do Mínimo Privilégio**: Políticas permissivas apenas para operações necessárias
3. **Tokens com Expiração**: Tokens admin expiram em 24h
4. **Constraints de Banco**: Validações no banco (não apenas no app)
5. **Índices Otimizados**: Performance para queries comuns

### ⚠️ Limitações da Implementação Atual

1. **Autenticação Simples**: Login estático (adequado para 1-2 admins)
2. **Sem Rate Limiting**: Vulnerável a brute force em produção
3. **Tokens em LocalStorage**: XSS pode expor tokens
4. **Sem Auditoria**: Não loga operações admin

### 🔒 Recomendações para Produção

Se o app crescer, considere:

1. **Supabase Auth com Roles**
   ```sql
   -- Tabela de perfis admin
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users PRIMARY KEY,
     is_admin BOOLEAN DEFAULT FALSE
   );
   ```

2. **Rate Limiting no Login**
   ```typescript
   // Implementar rate limiting no server
   // Usar Redis ou similar para tracking
   ```

3. **HTTP-Only Cookies**
   ```typescript
   // Armazenar token em cookie httpOnly
   // Ao invés de localStorage
   ```

4. **Auditoria de Operações**
   ```sql
   CREATE TABLE admin_audit_log (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     admin_id UUID,
     action TEXT,
     table_name TEXT,
     record_id UUID,
     timestamp TIMESTAMPTZ DEFAULT NOW()
   );
   ```

---

## 9️⃣ Verificação da Implementação

### Checklist de Segurança

- [x] RLS habilitado em `GuestList`
- [x] RLS habilitado em `Products`
- [x] Políticas SELECT públicas implementadas
- [x] Políticas INSERT/UPDATE/DELETE restritas
- [x] Constraints únicos (email, telefone)
- [x] Índices de performance criados
- [x] Admin credentials configuradas
- [x] Rota `/lista2026` protegida
- [x] Página de login funcional
- [x] Logout implementado (client-side)

### Testar Manualmente

1. **Acesso Público**
   ```bash
   # Deve funcionar
   curl https://seu-app.com/

   # Deve redirecionar para /login
   curl https://seu-app.com/lista2026
   ```

2. **Testar RLS**
   ```sql
   -- No SQL Editor do Supabase
   SET ROLE anon;

   -- Deve funcionar
   SELECT * FROM "GuestList";

   -- Deve falhar com RLS
   INSERT INTO "Products" (image, preco) VALUES ('test.jpg', 100);

   -- Deve funcionar com service role
   SET ROLE service_role;
   INSERT INTO "Products" (image, preco) VALUES ('test.jpg', 100);
   ```

---

## 🔗 Referências Úteis

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [SQL Best Practices](../supabase/migrations/001_enable_rls_and_policies.sql)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se as migrations foram aplicadas corretamente
2. Confirme que `.env.local` está configurado
3. Revise as políticas RLS no Supabase Dashboard
4. Verifique os logs do console browser/server

---

**Documento atualizado em**: 2026-02-04
**Versão**: 2.0.0
