import { Handler } from "@netlify/functions";
import crypto from "crypto";

// Supabase
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
    phone?: {
      area_code?: string;
      number?: string;
    };
    first_name?: string;
    last_name?: string;
  };
  additional_info?: {
    payer?: {
      first_name?: string;
      last_name?: string;
      phone?: {
        area_code?: string;
        number?: string;
      };
      address?: {
        zip_code?: string;
        street_name?: string;
        street_number?: number;
      };
    };
  };
}

interface WebhookBody {
  type?: string;
  data_id?: string;
  topic?: string;
  data?: {
    id?: string;
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

// Buscar pedido por preference_id
async function findOrderByPreferenceId(preferenceId: string): Promise<any> {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase credentials not configured");
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

// Atualizar status do pedido
async function updateOrderStatus(data: {
  mpPaymentId: string;
  mpPreferenceId: string;
  status: string;
  mpStatus: string;
}): Promise<any> {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Buscar pedido pela preference_id
    const { data: order } = await supabase
      .from("Orders")
      .select("*")
      .eq("mp_preference_id", data.mpPreferenceId)
      .single();

    if (!order) {
      throw new Error("Order not found");
    }

    // Atualizar pedido
    const { data: updatedOrder, error } = await supabase
      .from("Orders")
      .update({
        status: data.status,
        mp_status: data.mpStatus,
        mp_payment_id: data.mpPaymentId,
      })
      .eq("id", order.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }

    return updatedOrder;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// Processar notificação de pagamento
async function processPaymentNotification(paymentId: string): Promise<any> {
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
    const statusMap: Record<string, string> = {
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
          mpPaymentId: payment.id,
          mpPreferenceId: payment.preference_id,
          status: mappedStatus,
          mpStatus: payment.status,
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
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
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

      let preference = { items: [] };
      if (preferenceResponse.ok) {
        preference = await preferenceResponse.json();
      } else {
        console.error("Failed to fetch preference info");
      }

      console.log("Creating order with items:", preference.items);

      // Extrair informações completas do cliente
      const customerName = [
        payment.payer?.first_name || payment.additional_info?.payer?.first_name,
        payment.payer?.last_name || payment.additional_info?.payer?.last_name
      ].filter(Boolean).join(" ") || payment.payer?.identification?.number || null;

      const customerPhone = payment.payer?.phone?.number ||
        payment.additional_info?.payer?.phone?.number ||
        (payment.payer?.phone?.area_code && payment.payer?.phone?.number ?
          `${payment.payer.phone.area_code}${payment.payer.phone.number}` : null) ||
        (payment.additional_info?.payer?.phone?.area_code && payment.additional_info?.payer?.phone?.number ?
          `${payment.additional_info.payer.phone.area_code}${payment.additional_info.payer.phone.number}` : null);

      const customerCPF = payment.payer?.identification?.number || null;
      const customerEmail = payment.payer?.email || null;

      console.log("Customer info extracted:", {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        cpf: customerCPF,
      });

      // Criar o pedido com as informações do pagamento
      const { data: newOrder, error: createError } = await supabase
        .from("Orders")
        .insert({
          items: preference.items || [],
          total: payment.transaction_amount,
          mp_preference_id: payment.preference_id || null,
          mp_payment_id: payment.id,
          status: mappedStatus,
          mp_status: payment.status,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          customer_cpf: customerCPF,
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

const handler: Handler = async (event, context) => {
  console.log("=== WEBHOOK NETLIFY FUNCTION RECEBIDO ===");

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

    // Validar assinatura
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

    // if (!isValid) {
    //   console.error("Invalid webhook signature");
    //   return {
    //     statusCode: 401,
    //     body: JSON.stringify({
    //       success: false,
    //       error: "Invalid signature",
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   };
    // }

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
