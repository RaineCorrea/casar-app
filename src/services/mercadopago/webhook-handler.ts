import { createServerFn } from "@tanstack/react-start";
import { updateOrderStatus, findOrderByPreferenceId } from "../supabase/orders";
import { createClient } from "@supabase/supabase-js";

interface PaymentInfo {
  id: string;
  status: "approved" | "rejected" | "pending" | "in_process" | "in_mediation" | "refunded";
  external_reference: string;
  preference_id: string;
  payment_method_id: string;
  payment_type_id: string;
  date_created: string;
  date_approved?: string;
  transaction_amount: number;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export const receiveWebhook = createServerFn({ method: "POST" })
  .inputValidator((data: { type?: string; data_id?: string; topic?: string }) => data)
  .handler(async ({ data }) => {
    console.log("Received Mercado Pago webhook:", data);

    const { type, data_id, topic } = data;

    if (!type || !data_id) {
      console.error("Missing webhook parameters");
      return { success: false, error: "Missing parameters" };
    }

    if (type === "payment" || topic === "payment") {
      return await processPaymentNotification(data_id);
    }

    console.log("Webhook type not implemented:", type);
    return { success: true, message: "Webhook received" };
  });

async function processPaymentNotification(paymentId: string) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN not configured");
    }

    // Buscar informações do pagamento
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch payment info:", {
        status: response.status,
        body: errorText,
      });
      return { success: false, error: "Failed to fetch payment info" };
    }

    const payment: PaymentInfo = await response.json();

    console.log("Payment info received:", {
      payment_id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
      preference_id: payment.preference_id,
    });

    // Mapear status do Mercado Pago para status interno
    const statusMap: Record<string, "approved" | "rejected" | "pending" | "refunded" | "in_process" | "in_mediation"> = {
      approved: "approved",
      rejected: "rejected",
      pending: "pending",
      in_process: "in_process",
      in_mediation: "in_mediation",
      refunded: "refunded",
    };

    const mappedStatus = statusMap[payment.status] || "pending";

    // Verificar se o pedido já existe
    const existingOrder = await findOrderByPreferenceId(payment.preference_id);

    if (existingOrder) {
      // Pedido já existe, apenas atualizar o status
      console.log("Order already exists, updating status:", existingOrder.id);
      try {
        await updateOrderStatus({
          data: {
            mpPaymentId: payment.id,
            mpPreferenceId: payment.preference_id,
            status: mappedStatus,
            mpStatus: payment.status,
          },
        });

        console.log("Order status updated successfully");

        return {
          success: true,
          paymentId: payment.id,
          status: payment.status,
          action: "updated",
          orderId: existingOrder.id,
        };
      } catch (updateError) {
        console.error("Failed to update order status:", updateError);
        return { success: false, error: "Failed to update order status" };
      }
    }

    console.log("Order not found, creating new order");

    // Pedido não existe, criar com os dados do pagamento
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        throw new Error("Supabase credentials not configured");
      }

      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // Buscar informações adicionais da preferência
      console.log("Fetching preference info:", payment.preference_id);
      const preferenceResponse = await fetch(
        `https://api.mercadopago.com/checkout/preferences/${payment.preference_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!preferenceResponse.ok) {
        const errorText = await preferenceResponse.text();
        console.error("Failed to fetch preference info:", {
          status: preferenceResponse.status,
          body: errorText,
        });
        // Continuar mesmo sem informações da preferência
      }

      const preference = preferenceResponse.ok ? await preferenceResponse.json() : { items: [] };

      console.log("Creating order with items:", preference.items);

      // Criar o pedido com as informações do pagamento
      const { data: newOrder, error: createError } = await supabase
        .from("Orders")
        .insert({
          items: preference.items || [],
          total: payment.transaction_amount,
          mp_preference_id: payment.preference_id,
          mp_payment_id: payment.id,
          status: mappedStatus,
          mp_status: payment.status,
          customer_name: payment.payer?.identification?.number || null,
          customer_email: payment.payer?.email || null,
          customer_phone: null,
        })
        .select()
        .single();

      if (createError) {
        console.error("Supabase error creating order:", createError);
        throw new Error(`Failed to create order: ${createError.message}`);
      }

      console.log("Order created successfully:", newOrder.id);

      return {
        success: true,
        paymentId: payment.id,
        status: payment.status,
        action: "created",
        orderId: newOrder.id,
      };
    } catch (createError) {
      console.error("Failed to create order:", createError);
      return { success: false, error: "Failed to create order" };
    }
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return { success: false, error: "Internal server error" };
  }
}

export const getPaymentInfo = createServerFn({ method: "GET" })
  .inputValidator((paymentId: string) => paymentId)
  .handler(async ({ data: paymentId }) => {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("MERCADO_PAGO_ACCESS_TOKEN not configured");
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch payment info:", {
        status: response.status,
        body: errorText,
      });
      throw new Error(`Failed to fetch payment info: ${response.status}`);
    }

    return await response.json();
  });
