-- =====================================================
-- MIGRAÇÃO 002: Criar Tabela de Pedidos (Orders)
-- =====================================================

-- =====================================================
-- 1. CRIAR TABELA Orders
-- =====================================================

-- Habilitar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  "customer_name" TEXT,
  "customer_email" TEXT,
  "customer_phone" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CRIAR ÍNDICES
-- =====================================================

-- Índice para busca por usuário
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "Orders"("user_id");

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS "idx_orders_status" ON "Orders"("status");

-- Índice para ordenação por data de criação
CREATE INDEX IF NOT EXISTS "idx_orders_created_at" ON "Orders"("created_at" DESC);

-- Índice para Mercado Pago preference_id (buscas rápidas)
CREATE INDEX IF NOT EXISTS "idx_orders_mp_preference_id" ON "Orders"("mp_preference_id") WHERE "mp_preference_id" IS NOT NULL;

-- Índice para Mercado Pago payment_id
CREATE INDEX IF NOT EXISTS "idx_orders_mp_payment_id" ON "Orders"("mp_payment_id") WHERE "mp_payment_id" IS NOT NULL;

-- =====================================================
-- 3. ATIVAR RLS
-- =====================================================

ALTER TABLE "Orders" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. POLÍTICAS DE SEGURANÇA
-- =====================================================

-- POLÍTICA: Leitura Própria (SELECT)
-- Usuários autenticados podem ver apenas seus próprios pedidos
CREATE POLICY "Permitir leitura própria de pedidos"
ON "Orders" FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- POLÍTICA: Inserção Própria (INSERT)
-- Usuários autenticados podem criar pedidos para si mesmos
CREATE POLICY "Permitir inserção própria de pedidos"
ON "Orders" FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- POLÍTICA: Bloquear UPDATE via client
-- Apenas server (service_role) pode atualizar pedidos
CREATE POLICY "Bloquear atualização de pedidos via client"
ON "Orders" FOR UPDATE
TO authenticated
USING (false);

-- POLÍTICA: Bloquear DELETE via client
-- Apenas server (service_role) pode deletar pedidos
CREATE POLICY "Bloquear deleção de pedidos via client"
ON "Orders" FOR DELETE
TO authenticated
USING (false);

-- =====================================================
-- 5. HABILITAR REALTIME
-- =====================================================

-- Publicar alterações da tabela Orders via Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = 'Orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "Orders";
  END IF;
END $$;

-- =====================================================
-- 6. CRIAR TRIGGER PARA updated_at
-- =====================================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at antes de cada UPDATE
DROP TRIGGER IF EXISTS update_orders_updated_at ON "Orders";
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON "Orders"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. ADICIONAR CHECK CONSTRAINT PARA STATUS
-- =====================================================

-- Garantir que o status seja um valor válido
ALTER TABLE "Orders"
ADD CONSTRAINT "check_status_valid"
CHECK ("status" IN ('pending', 'approved', 'rejected', 'refunded', 'in_process', 'in_mediation'));

-- =====================================================
-- EXEMPLO DE CÓDIGO SERVER-SIDE PARA OPERAÇÕES ADMIN
-- =====================================================
/*
// Para fazer UPDATE/DELETE em Orders via server:

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ← Use service role key
)

// Exemplo: Atualizar status do pedido após webhook Mercado Pago
await supabaseAdmin
  .from('Orders')
  .update({
    status: 'approved',
    mp_status: 'approved',
    mp_payment_id: paymentId
  })
  .eq('mp_preference_id', preferenceId)

// Exemplo: Buscar pedidos de um usuário
const { data: orders } = await supabaseAdmin
  .from('Orders')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
*/

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar estrutura da tabela
\d+ "Orders";

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
WHERE tablename = 'Orders'
ORDER BY policyname;

-- Verificar índices criados
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'Orders'
ORDER BY indexname;
