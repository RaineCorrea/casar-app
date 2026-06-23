import { createServerFn } from "@tanstack/react-start";
import { env } from "@/schemas/env";

interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceData {
  items: PreferenceItem[];
  payer?: {
    name: string;
    email: string;
  };
}

interface CreatePreferenceResponse {
  init_point: string;
  preference_id: string;
}

export const createPreference = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePreferenceData) => data)
  .handler(async ({ data }) => {
    // Em server functions, usar process.env ou import.meta.env
    const accessToken = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Mercado Pago ACCESS_TOKEN não encontrado");
      throw new Error("Mercado Pago credentials not configured");
    }

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: data.items,
          back_urls: {
            success: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/checkout/success`,
            failure: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/checkout/failure`,
            pending: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'}/checkout/pending`,
          },
          auto_return: "approved",
          binary_mode: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mercado Pago error: ${error}`);
    }

    const preference = await response.json();
    return {
      init_point: preference.init_point,
      preference_id: preference.id,
    } as CreatePreferenceResponse;
  });
