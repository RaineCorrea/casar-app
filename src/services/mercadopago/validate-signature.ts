export interface WebhookBody {
  type?: string;
  data_id?: string;
  topic?: string;
  data?: {
    id?: string;
  };
}

export interface ValidateSignatureParams {
  signature: string | null;
  body: WebhookBody;
  webhookSecret: string;
}

/**
 * Valida a assinatura do webhook do Mercado Pago
 * O Mercado Pago envia a assinatura no header x-signature no formato: ts=timestamp,v1=hash
 *
 * @docs https://www.mercadopago.com.br/developers/pt/webhooks#signature
 */
export async function validateWebhookSignature({
  signature,
  body,
  webhookSecret,
}: ValidateSignatureParams): Promise<boolean> {
  if (!signature) {
    console.error("Missing x-signature header");
    return false;
  }

  try {
    // Dynamic import do crypto (Node.js only)
    const { createHmac } = await import("crypto");

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
    const hmac = createHmac("sha256", webhookSecret);
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
