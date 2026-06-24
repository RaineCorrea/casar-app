import { createFileRoute } from "@tanstack/react-router";
import { receiveWebhook } from "../services/mercadopago/webhook-handler";
import { validateWebhookSignature } from "../services/mercadopago/validate-signature";

export const Route = createFileRoute("/api/webhooks/mercadopago")({
  component: WebhookEndpoint,
});

function WebhookEndpoint() {
  // This is a server-side endpoint, not a UI component
  return null;
}

// Handle POST requests for webhooks
export async function POST({ request }: { request: Request }) {
  console.log("=== WEBHOOK RECEBIDO ===");

  try {
    const body = await request.json();

    console.log("Webhook body:", JSON.stringify(body, null, 2));

    // Validar assinatura do webhook
    const signature = request.headers.get("x-signature");
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    console.log("Signature header:", signature);
    console.log("Webhook secret configured:", !!webhookSecret);

    if (!webhookSecret) {
      console.error("MERCADO_PAGO_WEBHOOK_SECRET not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Webhook secret not configured",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validar assinatura (agora é async)
    console.log("Validando assinatura...");
    const isValid = await validateWebhookSignature({
      signature,
      body,
      webhookSecret,
    });

    console.log("Assinatura válida:", isValid);

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid signature",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Processando webhook...");
    const result = await receiveWebhook({
      data: body,
    });

    console.log("Webhook processado:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
