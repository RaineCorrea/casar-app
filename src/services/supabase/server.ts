import supabase from "./client";
import { z } from "zod";

// Products
export const ProductSchema = z.object({
  id: z.number(),
  descricao: z.string(),
  preco: z.string(),
  image: z.string(),
  categoria: z.string(),
  created_at: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  page: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
  totalCount: z.number(),
});

export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;

export type ProductsSortBy =
  | "descricao_asc"
  | "descricao_desc"
  | "preco_asc"
  | "preco_desc"
  | "categoria_asc";

interface FetchProductsParams {
  page?: number;
  limit?: number;
  sortBy?: ProductsSortBy;
}

async function fetchProducts(
  params?: FetchProductsParams
): Promise<ProductsResponse> {
  const { page = 1, limit = 10, sortBy = "descricao_asc" } = params || {};

  const [column, order] = sortBy.split("_") as [string, "asc" | "desc"];

  const { data, error, count } = await supabase
    .from("Products")
    .select("*", { count: "exact" })
    .order(column, { ascending: order === "asc" })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error("Erro ao buscar produtos");
  }

  const totalCount = count || 0;
  const hasMore = page * limit < totalCount;

  return {
    products: (data || []) as Product[],
    page,
    limit,
    hasMore,
    totalCount,
  };
}

// Guests
export const GuestSchema = z.object({
  id: z.number(),
  nome: z.string(),
  email: z.string().email("Email inválido").nullable().optional(),
  telefone: z.string().nullable().optional(),
  acompanhantes: z.number().default(0),
  confirmado: z.boolean().default(false),
  mensagem: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export type Guest = z.infer<typeof GuestSchema>;

interface FetchGuestsParams {
  limit?: number;
}

interface FetchGuestsResponse {
  guests: Guest[];
  totalCount: number;
}

async function fetchGuests(
  params?: FetchGuestsParams
): Promise<FetchGuestsResponse> {
  console.log("fetchGuests called with params:", params);

  const { data, error, count } = await supabase
    .from("GuestList")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(params?.limit || 100);

  console.log("fetchGuests result:", { data, error, count });

  if (error) {
    console.error("Error fetching guests:", error);
    throw new Error("Erro ao buscar convidados");
  }

  return {
    guests: (data || []) as Guest[],
    totalCount: count || 0,
  };
}

interface AddGuestParams {
  data: Omit<Guest, "id" | "created_at">;
}

async function addGuest(params: AddGuestParams): Promise<Guest> {
  const { data, error } = await supabase
    .from("GuestList")
    .insert(params.data)
    .select()
    .single();

  if (error) {
    console.error("Error adding guest:", error);
    throw new Error("Erro ao adicionar convidado");
  }

  return data as Guest;
}

export { fetchProducts, fetchGuests, addGuest };
