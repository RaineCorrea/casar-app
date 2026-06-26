import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { z } from 'zod';

type WebhookBody = {
  type?: string;
  data_id?: string;
  topic?: string;
  data?: {
    id?: string;
  };
};

const PaymentInfoSchema = z.object({
  id: z.string(),
  status: z.string(),
  external_reference: z.string().optional(),
  preference_id: z.string().optional(),
  payment_method_id: z.string(),
  payment_type_id: z.string(),
  date_created: z.string(),
  date_approved: z.string().optional(),
  transaction_amount: z.number(),
  installments: z.number(),
  payer: z.object({
    email: z.string().optional(),
    identification: z.object({
      type: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    phone: z.object({
      area_code: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }).optional(),
});

type PaymentInfo = z.infer<typeof PaymentInfoSchema>;

interface ProcessPaymentResult {
  success: boolean;
  paymentId?: string;
  status?: string;
  message?: string;
  error?: string;
}

// Validar assinatura do webhook
function validateWebhookSignature(
  signature: string | undefined,
  body: WebhookBody,
  webhookSecret: string
): boolean {
  if (!signature) {
    console.error('Missing x-signature header');
    return false;
  }

  try {
    // Parse the signature header
    const signatureParts = signature.split(',');
    const tsPart = signatureParts.find((part) => part.startsWith('ts='));
    const v1Part = signatureParts.find((part) => part.startsWith('v1='));

    if (!tsPart || !v1Part) {
      console.error('Invalid signature format');
      return false;
    }

    const timestamp = tsPart.replace('ts=', '');
    const receivedHash = v1Part.replace('v1=', '');

    // Create the manifest string: id=data.id;ts=timestamp;
    const manifest = `id=${body.data?.id || ''};ts=${timestamp};`;

    // Calculate HMAC SHA256
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(manifest);
    const calculatedHash = hmac.digest('hex');

    // Compare hashes
    const isValid = calculatedHash === receivedHash;

    if (!isValid) {
      console.error('Signature validation failed', {
        calculated: calculatedHash,
        received: receivedHash,
        manifest,
      });
    }

    return isValid;
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

// Processar e logar informações do pagamento
async function processPaymentNotification(
  paymentId: string
): Promise<ProcessPaymentResult> {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured');
    }

    // Buscar informações do pagamento APENAS PARA LOG
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch payment info:', {
        status: response.status,
        body: errorText,
      });
      return { success: false, error: 'Failed to fetch payment info' };
    }

    const payment: PaymentInfo = PaymentInfoSchema.parse(await response.json());

    // Logar informações completas do pagamento
    console.log('=== PAGAMENTO RECEBIDO (NÃO SALVO NO BANCO DE DADOS) ===');
    console.log('Payment ID:', payment.id);
    console.log('Status:', payment.status);
    console.log('External Reference:', payment.external_reference);
    console.log('Preference ID:', payment.preference_id);
    console.log('Valor:', payment.transaction_amount);
    console.log('Método Pagamento:', payment.payment_method_id);
    console.log('Parcelas:', payment.installments);
    console.log('Data Criação:', payment.date_created);
    console.log('Data Aprovação:', payment.date_approved || 'N/A');

    if (payment.payer) {
      console.log('=== DADOS DO PAGADOR ===');
      console.log('Email:', payment.payer.email);
      console.log('CPF:', payment.payer.identification?.number);
      console.log(
        'Telefone:',
        payment.payer.phone?.area_code && payment.payer.phone?.number
          ? `${payment.payer.phone.area_code}${payment.payer.phone.number}`
          : 'N/A'
      );
      console.log(
        'Nome:',
        [payment.payer.first_name, payment.payer.last_name]
          .filter(Boolean)
          .join(' ') || 'N/A'
      );
    }

    console.log('=== FIM DO LOG ===');

    return {
      success: true,
      paymentId: payment.id,
      status: payment.status,
      message: 'Pagamento processado (não salvo no banco de dados)',
    };
  } catch (error) {
    console.error('Error processing payment notification:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('=== WEBHOOK RECEBIDO ===');

  // Apenas responder a POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const body = req.body as WebhookBody;
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    // Validar assinatura do webhook
    const signature = req.headers['x-signature'] as string | string[] | undefined ||
                      req.headers['X-Signature'] as string | string[] | undefined;
    const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

    const signatureStr = Array.isArray(signature) ? signature[0] : signature;

    console.log('Signature header:', signatureStr);
    console.log('Webhook secret configured:', !!webhookSecret);

    if (!webhookSecret) {
      console.error('MERCADO_PAGO_WEBHOOK_SECRET not configured');
      return res.status(500).json({
        success: false,
        error: 'Webhook secret not configured',
      });
    }

    // Validar assinatura do webhook
    console.log('Validando assinatura...');
    const isValid = validateWebhookSignature(signatureStr, body, webhookSecret);

    console.log('Assinatura válida:', isValid);

    if (!isValid) {
      console.warn('Assinatura inválida - rejeitando webhook');
      return res.status(401).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    // Processar webhook
    const { type, data_id, topic, data } = body;

    // O Mercado Pago envia o ID em data.id, não em data_id diretamente
    const paymentId = data_id || data?.id;

    console.log('Webhook parameters:', { type, topic, data_id, paymentId });

    if (!type || !paymentId) {
      console.error('Missing webhook parameters');
      return res.status(400).json({
        success: false,
        error: 'Missing parameters',
      });
    }

    if (type === 'payment' || topic === 'payment') {
      console.log('Processando notificação de pagamento:', paymentId);
      const result = await processPaymentNotification(paymentId);
      console.log('Resultado:', result);

      return res.status(200).json(result);
    }

    console.log('Webhook type not implemented:', type);
    return res.status(200).json({
      success: true,
      message: 'Webhook received',
    });
  } catch (error) {
    console.error('Webhook error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
