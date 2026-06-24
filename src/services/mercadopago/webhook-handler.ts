import { createServerFn } from "@tanstack/react-start";
import { updateOrderStatus } from "../supabase/orders";

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

    // Atualizar status do pedido
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
      };
    } catch (updateError) {
      console.error("Failed to update order status:", updateError);
      return { success: false, error: "Failed to update order status" };
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
