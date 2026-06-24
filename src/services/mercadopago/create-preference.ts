import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PreferenceItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  description: z.string().optional(),
  picture_url: z.string().optional(),
  category_id: z.string().optional(),
});

const CreatePreferenceSchema = z.object({
  items: z.array(PreferenceItemSchema),
  backUrls: z.object({
    success: z.string(),
    failure: z.string(),
    pending: z.string(),
  }),
  payer: z.object({
    name: z.string().optional(),
    surname: z.string().optional(),
    email: z.string().optional(),
    phone: z.object({
      area_code: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    identification: z.object({
      type: z.string().optional(),
      number: z.string().optional(),
    }).optional(),
    address: z.object({
      street_name: z.string().optional(),
      street_number: z.number().optional(),
      zip_code: z.string().optional(),
    }).optional(),
  }).optional(),
  externalReference: z.string().optional(),
});

export const createPreference = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    // Validar dados com Zod
    const validatedData = CreatePreferenceSchema.parse(data);
    const { items, backUrls, payer, externalReference } = validatedData;

    const accessToken = import.meta.env.MERCADO_PAGO_ACCESS_TOKEN || import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("MERCADO_PAGO_ACCESS_TOKEN not configured");
      throw new Error("Credenciais do Mercado Pago não configuradas");
    }

    // Gerar external_reference se não fornecido
    const reference = externalReference || `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Obter origin para URLs
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

    // Converter ids para string para compatibilidade com Mercado Pago
    const normalizedItems = items.map(item => ({
      ...item,
      id: String(item.id),
    }));

    const requestBody = {
      items: normalizedItems,
      back_urls: backUrls,
      external_reference: reference,
      notification_url: `${origin}/api/webhooks/mercadopago`,
      // auto_return removido temporariamente - Mercado Pago não aceita localhost em back_urls
      // auto_return: "approved",
      binary_mode: true,
      statement_descriptor: "MATHEUSNICOLLY",
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      ...(payer && { payer }),
    };

    console.log("Creating Mercado Pago preference:", {
      itemsCount: normalizedItems.length,
      total: normalizedItems.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0),
      external_reference: reference,
      items: normalizedItems.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      has_payer: !!payer,
    });

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mercado Pago API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Erro ao criar preferência: ${response.status} - ${errorText}`);
    }

    const preference = await response.json();
    const initPoint = preference.init_point || preference.sandbox_init_point;

    if (!initPoint) {
      console.error("Mercado Pago response missing init_point:", preference);
      throw new Error("URL de pagamento não encontrada na resposta");
    }

    console.log("Mercado Pago preference created:", {
      preference_id: preference.id,
      init_point: initPoint,
      external_reference: preference.external_reference,
    });

    return {
      initPoint,
      preferenceId: preference.id,
      externalReference: preference.external_reference,
    };
  });
