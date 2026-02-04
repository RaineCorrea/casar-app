-- =====================================================
-- MIGRAÇÃO 001: Ativar RLS e Configurar Políticas de Segurança
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CONSTRAINTS ÚNICOS À TABELA GuestList
-- =====================================================

-- Garantir que emails sejam únicos (nulls permitidos para convidados sem email)
ALTER TABLE "GuestList"
ADD CONSTRAINT "guestlist_email_unique" UNIQUE ("email");

-- Garantir que telefones sejam únicos (nulls permitidos para convidados sem telefone)
ALTER TABLE "GuestList"
ADD CONSTRAINT "guestlist_telefone_unique" UNIQUE ("telefone");

-- =====================================================
-- 2. ATIVAR RLS NAS TABELAS
-- =====================================================

-- Ativar RLS na tabela de convidados
ALTER TABLE "GuestList" ENABLE ROW LEVEL SECURITY;

-- Ativar RLS na tabela de produtos
ALTER TABLE "Products" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. POLÍTICAS PARA GuestList (Convidados)
-- =====================================================

-- POLÍTICA: Leitura Pública (SELECT)
-- Qualquer usuário autenticado ou anônimo pode ver a lista de convidados
CREATE POLICY "Permitir leitura pública da lista de convidados"
ON "GuestList" FOR SELECT
TO anon, authenticated
USING (true);

-- POLÍTICA: Inserção Pública (INSERT)
-- Qualquer usuário autenticado ou anônimo pode adicionar convidados
-- O banco validará email único e telefone único via constraints
CREATE POLICY "Permitir inserção pública de convidados"
ON "GuestList" FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- POLÍTICA: Bloquear UPDATE/DELETE via client
-- Usuários anônimos não podem atualizar ou deletar
CREATE POLICY "Bloquear atualização de convidados via client"
ON "GuestList" FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Bloquear deleção de convidados via client"
ON "GuestList" FOR DELETE
TO anon
USING (false);

-- NOTA: Operações de UPDATE/DELETE devem ser feitas via server usando service_role key

-- =====================================================
-- 4. POLÍTICAS PARA Products (Lista de Presentes)
-- =====================================================

-- POLÍTICA: Leitura Pública (SELECT)
-- Qualquer usuário pode ver a lista de presentes
CREATE POLICY "Permitir leitura pública dos produtos"
ON "Products" FOR SELECT
TO anon, authenticated
USING (true);

-- POLÍTICA: Bloquear INSERT via client
-- Apenas server (service_role) pode inserir produtos
CREATE POLICY "Bloquear inserção de produtos via client"
ON "Products" FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- POLÍTICA: Bloquear UPDATE via client
-- Apenas server (service_role) pode atualizar produtos
CREATE POLICY "Bloquear atualização de produtos via client"
ON "Products" FOR UPDATE
TO anon, authenticated
USING (false);

-- POLÍTICA: Bloquear DELETE via client
-- Apenas server (service_role) pode deletar produtos
CREATE POLICY "Bloquear deleção de produtos via client"
ON "Products" FOR DELETE
TO anon, authenticated
USING (false);

-- =====================================================
-- 5. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índice para busca por email (validações)
CREATE INDEX IF NOT EXISTS "idx_guestlist_email" ON "GuestList"("email")
WHERE "email" IS NOT NULL;

-- Índice para busca por telefone (validações)
CREATE INDEX IF NOT EXISTS "idx_guestlist_telefone" ON "GuestList"("telefone")
WHERE "telefone" IS NOT NULL;

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS "idx_guestlist_created_at" ON "GuestList"("created_at" DESC);

-- Índices para Products
CREATE INDEX IF NOT EXISTS "idx_products_created_at" ON "Products"("created_at" DESC);

-- =====================================================
-- 6. HABILITAR REALTIME PARA GuestList
-- =====================================================

-- Publicar alterações da tabela GuestList via Realtime
-- Verifica se a tabela já está na publicação antes de adicionar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'GuestList'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "GuestList";
  END IF;
END $$;

-- =====================================================
-- EXEMPLO DE CÓDIGO SERVER-SIDE PARA OPERAÇÕES ADMIN
-- =====================================================
/*
// Para fazer UPDATE/DELETE em GuestList via server:

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Use service role key
)

// Exemplo: Deletar um convidado
await supabaseAdmin
  .from('GuestList')
  .delete()
  .eq('id', guestId)

// Exemplo: Atualizar um produto
await supabaseAdmin
  .from('Products')
  .update({ preco: 100 })
  .eq('id', productId)
*/

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar políticas criadas
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('GuestList', 'Products')
ORDER BY tablename, policyname;
