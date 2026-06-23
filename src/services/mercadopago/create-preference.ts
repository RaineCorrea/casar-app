import { createServerFn } from "@tanstack/react-start";

interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceData {
  items: PreferenceItem[];
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
}

export const createPreference = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePreferenceData) => data)
  .handler(async ({ data }) => {
    const { items, backUrls } = data;

    const accessToken = process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Mercado Pago credentials not configured");
    }

    const requestBody = {
      items,
      backUrls,
      payment_methods: {},
    };

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
      const error = await response.text();
      throw new Error(`Mercado Pago error: ${error}`);
    }

    const preference = await response.json();
    const initPoint = preference.init_point || preference.sandbox_init_point;

    if (!initPoint) {
      throw new Error("init_point not found in Mercado Pago response");
    }

    return {
      init_point: initPoint,
      preference_id: preference.id,
    };
  });
