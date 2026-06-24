import { createFileRoute } from "@tanstack/react-router";
import { receiveWebhook } from "../services/mercadopago/webhook-handler";

export const Route = createFileRoute("/api/webhooks/mercadopago")({
  component: WebhookEndpoint,
});

function WebhookEndpoint() {
  // This is a server-side endpoint, not a UI component
  return null;
}

// Handle POST requests for webhooks
export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();

    const result = await receiveWebhook({
      data: body,
    });

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
