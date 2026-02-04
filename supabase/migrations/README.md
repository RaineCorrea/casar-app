# Supabase Migrations

Este diretório contém as migrações SQL para configurar o banco de dados do projeto.

## 📁 Estrutura

```
migrations/
├── 001_enable_rls_and_policies.sql    # Ativa RLS e cria políticas de segurança
└── README.md                           # Este arquivo
```

## 🚀 Como Aplicar as Migrações

### Opção 1: Via Supabase Dashboard (Mais Simples)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. No menu lateral, clique em **SQL Editor**
4. Clique em **New Query**
5. Copie o conteúdo do arquivo de migração desejado
6. Cole no editor
7. Clique em **Run** (ou pressione `Ctrl+Enter`)
8. Verifique se não há erros no output

### Opção 2: Via Supabase CLI (Recomendado para Dev)

```bash
# Se você tiver o Supabase CLI instalado
supabase db push

# Ou aplicar arquivo específico
supabase db execute -f supabase/migrations/001_enable_rls_and_policies.sql

# Ou iniciar localmente
supabase start
supabase db reset
```

### Opção 3: Via psql (Linha de Comando)

```bash
# Obter connection string no Supabase Dashboard
# Settings > Database > Connection string > URI

psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f supabase/migrations/001_enable_rls_and_policies.sql
```

## ✅ Verificação

Após aplicar a migração, você pode verificar com:

```sql
-- Verificar políticas RLS
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('GuestList', 'Products')
ORDER BY tablename, policyname;

-- Verificar constraints
SELECT
  conname,
  contype,
  pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid::regclass::text IN ('"GuestList"', '"Products"');

-- Verificar índices
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename IN ('GuestList', 'Products');
```

## 🔄 Rollback

Se precisar reverter as mudanças:

```sql
-- Remover índices
DROP INDEX IF EXISTS idx_guestlist_email;
DROP INDEX IF EXISTS idx_guestlist_telefone;
DROP INDEX IF EXISTS idx_guestlist_created_at;
DROP INDEX IF EXISTS idx_products_created_at;

-- Remover políticas
DROP POLICY IF EXISTS "Permitir leitura pública da lista de convidados" ON "GuestList";
DROP POLICY IF EXISTS "Permitir inserção pública de convidados" ON "GuestList";
DROP POLICY IF EXISTS "Bloquear atualização de convidados via client" ON "GuestList";
DROP POLICY IF EXISTS "Bloquear deleção de convidados via client" ON "GuestList";

DROP POLICY IF EXISTS "Permitir leitura pública dos produtos" ON "Products";
DROP POLICY IF EXISTS "Bloquear inserção de produtos via client" ON "Products";
DROP POLICY IF EXISTS "Bloquear atualização de produtos via client" ON "Products";
DROP POLICY IF EXISTS "Bloquear deleção de produtos via client" ON "Products";

-- Remover constraints
ALTER TABLE "GuestList" DROP CONSTRAINT IF EXISTS guestlist_email_unique;
ALTER TABLE "GuestList" DROP CONSTRAINT IF EXISTS guestlist_telefone_unique;

-- Desativar RLS
ALTER TABLE "GuestList" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Products" DISABLE ROW LEVEL SECURITY;
```

## 📋 Ordens de Execução

As migrações devem ser aplicadas em ordem numérica:

1. **001_enable_rls_and_policies.sql** - Configuração base de segurança

## ⚠️ Importante

- **Sempre faça backup** antes de aplicar migrações em produção
- **Teste em ambiente de dev** primeiro
- **Revise o SQL** antes de executar para entender as mudanças

## 🔗 Documentação

Para mais detalhes sobre a implementação, consulte:
- [Documentação de Segurança](../../docs/SEGURANCA_RLS.md)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
