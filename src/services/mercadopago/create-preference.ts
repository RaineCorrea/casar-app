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

interface CreatePreferenceResponse {
  init_point: string;
  preference_id: string;
}

export const createPreference = createServerFn({ method: "POST" })
  .inputValidator((data: CreatePreferenceData) => data)
  .handler(async ({ data }) => {
    console.log("DEBUG - Dados recebidos (raw):", JSON.stringify(data, null, 2));

    // O TanStack Start pode embrulhar os dados em um objeto adicional
    const inputData = data.data || data;
    console.log("DEBUG - Dados após desembrulhar:", JSON.stringify(inputData, null, 2));

    const { items, backUrls } = inputData;

    // Acessar variável de ambiente no servidor
    const accessToken = process.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("Mercado Pago ACCESS_TOKEN não configurado nas variáveis de ambiente");
      throw new Error("Mercado Pago credentials not configured");
    }

    console.log("Criando preferência com itens:", items);
    console.log("Back URLs:", backUrls);

    const requestBody = {
      items: items,
      back_urls: backUrls,
      // Opcional: Configurar métodos de pagamento
      // PIX já vem habilitado por padrão no Checkout Pro!
      payment_methods: {
        // Exemplo: Excluir apenas boleto (mantém PIX e cartões)
        // excluded_payment_types: [
        //   { id: "ticket" }  // ticket = boleto
        // ],

        // Exemplo: Excluir cartão específico
        // excluded_payment_methods: [
        //   { id: "master" },  // Mastercard
        //   { id: "visa" }    // Visa
        // ],

        // Exemplo: Limitar parcelamento
        // installments: 12  // Máximo de 12x
      },
    };

    console.log("RequestBody completo:", JSON.stringify(requestBody, null, 2));

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
