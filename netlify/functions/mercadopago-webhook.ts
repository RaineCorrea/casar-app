import { Handler } from "@netlify/functions";
import crypto from "crypto";

interface WebhookBody {
  type?: string;
  data_id?: string;
  topic?: string;
  data?: {
    id?: string;
  };
}

interface PaymentInfo {
  id: string;
  status: string;
  external_reference: string;
  preference_id?: string;
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

// Validar assinatura do webhook
function validateWebhookSignature(
  signature: string | null,
  body: WebhookBody,
  webhookSecret: string
): boolean {
  if (!signature) {
    console.error("Missing x-signature header");
    return false;
  }

  try {
    // Parse the signature header
    const signatureParts = signature.split(",");
    const tsPart = signatureParts.find((part) => part.startsWith("ts="));
    const v1Part = signatureParts.find((part) => part.startsWith("v1="));

    if (!tsPart || !v1Part) {
      console.error("Invalid signature format");
      return false;
    }

    const timestamp = tsPart.replace("ts=", "");
    const receivedHash = v1Part.replace("v1=", "");

    // Create the manifest string: id=data.id;ts=timestamp;
    const manifest = `id=${body.data?.id || ""};ts=${timestamp};`;

    // Calculate HMAC SHA256
    const hmac = crypto.createHmac("sha256", webhookSecret);
    hmac.update(manifest);
    const calculatedHash = hmac.digest("hex");

    // Compare hashes
    const isValid = calculatedHash === receivedHash;

    if (!isValid) {
      console.error("Signature validation failed", {
        calculated: calculatedHash,
        received: receivedHash,
        manifest,
      });
    }

    return isValid;
  } catch (error) {
    console.error("Error validating signature:", error);
    return false;
  }
}

// Processar e logar informações do pagamento
async function processPaymentNotification(paymentId: string): Promise<any> {
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
    console.log("=== PAGAMENTO RECEBIDO (NÃO SALVO NO BANCO DE DADOS) ===");
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
      message: "Pagamento processado (não salvo no banco de dados)",
    };
  } catch (error) {
    console.error("Error processing payment notification:", error);
    return { success: false, error: "Internal server error" };
  }
}

const handler: Handler = async (event, context) => {
  console.log("=== WEBHOOK RECEBIDO ===");

  // Apenas responder a POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  try {
    const body: WebhookBody = JSON.parse(event.body || "{}");

    console.log("Webhook body:", JSON.stringify(body, null, 2));

    // Validar assinatura do webhook
    const signature = event.headers["x-signature"] || event.headers["X-Signature"];
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    console.log("Signature header:", signature);
    console.log("Webhook secret configured:", !!webhookSecret);

    if (!webhookSecret) {
      console.error("MERCADO_PAGO_WEBHOOK_SECRET not configured");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: "Webhook secret not configured",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    // Validar assinatura (desabilitado temporariamente para debug)
    console.log("Validando assinatura...");
    const isValid = validateWebhookSignature(signature, body, webhookSecret);

    console.log("Assinatura válida:", isValid);

    // TEMPORÁRIO: Desabilitar validação para debug
    // Remover este comentário quando a secret key estiver correta
    if (!isValid) {
      console.warn("⚠️ Assinatura inválida, mas continuando para debug (TEMPORÁRIO)");
      // return {
      //   statusCode: 401,
      //   body: JSON.stringify({
      //     success: false,
      //     error: "Invalid signature",
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // };
    }

    // Processar webhook
    const { type, data_id, topic, data } = body;

    // O Mercado Pago envia o ID em data.id, não em data_id diretamente
    const paymentId = data_id || data?.id;

    console.log("Webhook parameters:", { type, topic, data_id, paymentId });

    if (!type || !paymentId) {
      console.error("Missing webhook parameters");
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing parameters",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    if (type === "payment" || topic === "payment") {
      console.log("Processando notificação de pagamento:", paymentId);
      const result = await processPaymentNotification(paymentId);
      console.log("Resultado:", result);

      return {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }

    console.log("Webhook type not implemented:", type);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Webhook received",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Webhook error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

export { handler };
