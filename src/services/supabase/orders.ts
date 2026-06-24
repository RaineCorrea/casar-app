import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

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

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: CreateOrderData) => data)
  .handler(async ({ data }) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
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
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return order;
  });

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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let query = supabase.from("Orders").select("*");

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
      throw new Error(`Order not found: ${fetchError?.message}`);
    }

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
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    return updatedOrder;
  });

export const getOrderById = createServerFn({ method: "GET" })
  .inputValidator((orderId: string) => orderId)
  .handler(async ({ data: orderId }) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

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
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return order;
  });

export const getOrderByPreferenceId = createServerFn({ method: "GET" })
  .inputValidator((preferenceId: string) => preferenceId)
  .handler(async ({ data: preferenceId }) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

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
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return order;
  });

export const listAllOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
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
      throw new Error(`Failed to list orders: ${error.message}`);
    }

    return orders;
  });

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

export const saveOrderAfterCheckout = async (
  params: CreateOrderFromCartParams
): Promise<Order> => {
  const order = await createOrder({
    data: {
      items: params.items,
      total: params.total,
      mp_preference_id: params.mpPreferenceId,
      customer_name: params.customerInfo?.name,
      customer_email: params.customerInfo?.email,
      customer_phone: params.customerInfo?.phone,
    },
  });

  return order;
};

export const checkOrderStatus = async (
  preferenceId: string
): Promise<Order | null> => {
  try {
    const order = await getOrderByPreferenceId({ data: preferenceId });
    return order;
  } catch {
    return null;
  }
};

/**
 * Função auxiliar para buscar pedido por preference_id sem usar createServerFn
 * Usado internamente por outros serviços (como webhook-handler)
 */
export async function findOrderByPreferenceId(preferenceId: string): Promise<Order | null> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase credentials not configured for findOrderByPreferenceId");
      return null;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: order, error } = await supabase
      .from("Orders")
      .select("*")
      .eq("mp_preference_id", preferenceId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching order by preference_id:", error);
      return null;
    }

    return order;
  } catch (error) {
    console.error("Exception in findOrderByPreferenceId:", error);
    return null;
  }
}
