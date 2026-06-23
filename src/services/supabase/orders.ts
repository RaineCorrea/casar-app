import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

// =====================================================
// TIPOS
// =====================================================

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  total: number;
  mp_preference_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total: number;
  status: "pending" | "approved" | "rejected" | "refunded" | "in_process" | "in_mediation";
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  mp_status: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
}

// =====================================================
// SERVER FUNCTIONS - OPERAÇÕES ADMIN
// =====================================================

/**
 * Criar um novo pedido
 * Usa service_role_key para bypass de RLS e permitir inserção com user_id null
 */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: CreateOrderData) => data)
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error } = await supabase
      .from("Orders")
      .insert({
        items: data.items,
        total: data.total,
        mp_preference_id: data.mp_preference_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar pedido:", error);
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return order;
  });

/**
 * Atualizar status do pedido (usado pelo webhook do Mercado Pago)
 * Usa service_role_key para bypass de RLS
 */
export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      orderId?: string;
      mpPreferenceId?: string;
      mpPaymentId?: string;
      status: Order["status"];
      mpStatus?: string;
    }) => data
  )
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Buscar pedido por preference_id se não tiver order_id
    let query = supabase.from("Orders").select();

    if (data.orderId) {
      query = query.eq("id", data.orderId);
    } else if (data.mpPreferenceId) {
      query = query.eq("mp_preference_id", data.mpPreferenceId);
    } else if (data.mpPaymentId) {
      query = query.eq("mp_payment_id", data.mpPaymentId);
    } else {
      throw new Error(
        "Must provide either orderId, mpPreferenceId, or mpPaymentId"
      );
    }

    const { data: order, error: fetchError } = await query.single();

    if (fetchError || !order) {
      console.error("Erro ao buscar pedido:", fetchError);
      throw new Error(`Order not found: ${fetchError?.message}`);
    }

    // Atualizar pedido
    const updateData: Partial<Order> = {
      status: data.status,
      mp_status: data.mpStatus,
    };

    if (data.mpPaymentId && !order.mp_payment_id) {
      updateData.mp_payment_id = data.mpPaymentId;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("Orders")
      .update(updateData)
      .eq("id", order.id)
      .select()
      .single();

    if (updateError) {
      console.error("Erro ao atualizar pedido:", updateError);
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    return updatedOrder;
  });

/**
 * Buscar pedido por ID
 * Pode ser chamado por usuário autenticado (verifica se é o dono)
 * ou por admin (service_role)
 */
export const getOrderById = createServerFn({ method: "GET" })
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order, error } = await supabase
      .from("Orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) {
      console.error("Erro ao buscar pedido:", error);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return order;
  });

/**
 * Buscar pedido por preference_id do Mercado Pago
 */
export const getOrderByPreferenceId = createServerFn({ method: "GET" })
  .inputValidator((preferenceId: string) => preferenceId)
  .handler(async ({ data: preferenceId }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: order, error } = await supabase
      .from("Orders")
      .select("*")
      .eq("mp_preference_id", preferenceId)
      .single();

    if (error) {
      console.error("Erro ao buscar pedido:", error);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return order;
  });

/**
 * Listar todos os pedidos (admin only)
 * Usa service_role_key para bypass de RLS
 */
export const listAllOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: orders, error } = await supabase
      .from("Orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar pedidos:", error);
      throw new Error(`Failed to list orders: ${error.message}`);
    }

    return orders;
  });

// =====================================================
// CLIENT FUNCTIONS - OPERAÇÕES DO USUÁRIO
// =====================================================

/**
 * Hook para criar pedido a partir do carrinho
 * Deve ser chamado após redirecionamento do Mercado Pago
 */
export interface CreateOrderFromCartParams {
  items: OrderItem[];
  total: number;
  mpPreferenceId: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

/**
 * Salvar pedido após checkout Mercado Pago
 * Esta função deve ser chamada nas páginas de retorno (success/failure/pending)
 */
export const saveOrderAfterCheckout = async (
  params: CreateOrderFromCartParams
): Promise<Order> => {
  try {
    const order = await createOrder({
      items: params.items,
      total: params.total,
      mp_preference_id: params.mpPreferenceId,
      customer_name: params.customerInfo?.name,
      customer_email: params.customerInfo?.email,
      customer_phone: params.customerInfo?.phone,
    });

    return order;
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    throw error;
  }
};

/**
 * Buscar status do pedido pelo preference_id
 */
export const checkOrderStatus = async (
  preferenceId: string
): Promise<Order | null> => {
  try {
    const order = await getOrderByPreferenceId(preferenceId);
    return order;
  } catch (error) {
    console.error("Erro ao buscar status do pedido:", error);
    return null;
  }
};
