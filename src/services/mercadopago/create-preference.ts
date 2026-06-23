import { createServerFn } from "@tanstack/react-start";

interface PreferenceItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
}

interface CreatePreferenceData {
  accessToken: string;
  items: PreferenceItem[];
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
}

interface CreatePreferenceResponse {
  init_point: string;
  preference_id: string;
}

export const createPreference = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePreferenceData) => data)
  .handler(async ({ data }) => {
    const { accessToken, items, backUrls } = data;

    if (!accessToken) {
      console.error("Mercado Pago ACCESS_TOKEN não fornecido");
      throw new Error("Mercado Pago credentials not configured");
    }

    console.log("Criando preferência com itens:", items);

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items: items,
          back_urls: backUrls,
          auto_return: "approved",
          binary_mode: true,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Mercado Pago API error:", error);
      throw new Error(`Mercado Pago error: ${error}`);
    }

    const preference = await response.json();
    console.log("Preference criada:", preference);

    // Retornar apenas as propriedades necessárias
    const initPoint = preference.init_point || preference.sandbox_init_point;

    if (!initPoint) {
      console.error("init_point não encontrado na resposta:", preference);
      throw new Error("init_point não encontrado na resposta do Mercado Pago");
    }

    return {
      init_point: initPoint,
      preference_id: preference.id,
    };
  });
