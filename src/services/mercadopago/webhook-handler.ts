import { createServerFn } from "@tanstack/react-start";

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
  payer?: {
    email?: string;
    identification?: {
      type?: string;
      number?: string;
    };
    phone?: {
      area_code?: string;
      number?: string;
    };
    first_name?: string;
    last_name?: string;
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

    // Buscar informações do pagamento APENAS PARA LOG
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

    // Logar informações completas do pagamento
    console.log("=== PAGAMENTO RECEBIDO ===");
    console.log("Payment ID:", payment.id);
    console.log("Status:", payment.status);
    console.log("External Reference:", payment.external_reference);
    console.log("Preference ID:", payment.preference_id);
    console.log("Valor:", payment.transaction_amount);
    console.log("Método Pagamento:", payment.payment_method_id);
    console.log("Parcelas:", payment.installments);
    console.log("Data Criação:", payment.date_created);
    console.log("Data Aprovação:", payment.date_approved || "N/A");

    if (payment.payer) {
      console.log("=== DADOS DO PAGADOR ===");
      console.log("Email:", payment.payer.email);
      console.log("CPF:", payment.payer.identification?.number);
      console.log("Telefone:", payment.payer.phone?.area_code && payment.payer.phone?.number
        ? `${payment.payer.phone.area_code}${payment.payer.phone.number}`
        : "N/A");
      console.log("Nome:", [payment.payer.first_name, payment.payer.last_name].filter(Boolean).join(" ") || "N/A");
    }

    console.log("=== FIM DO LOG ===");

    return {
      success: true,
      paymentId: payment.id,
      status: payment.status,
      message: "Pagamento processado e logado",
    };
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
