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

export interface CreatePreferenceResponse {
  initPoint: string;
  preferenceId: string;
  externalReference: string;
}

export async function createPreference(data: z.infer<typeof CreatePreferenceSchema>): Promise<CreatePreferenceResponse> {
  // Validar dados com Zod
  const validatedData = CreatePreferenceSchema.parse(data);

  const response = await fetch("/api/create-preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao criar preferência");
  }

  return response.json();
}
