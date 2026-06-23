import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function getServerSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables not configured");
  }

  return createClient(url, key);
}

export interface Product {
  id: string;
  image: string;
  descricao?: string;
  preco: number;
  created_at: string;
  link?: string;
}

export interface Guest {
  id: string;
  name: string;
  email?: string;
  telefone?: string;
  created_at: string;
}

export type ProductsSortBy = "preco_asc" | "preco_desc" | "descricao_asc";

export interface ProductsParams {
  page?: number;
  limit?: number;
  sortBy?: ProductsSortBy;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
}

export const fetchProducts = createServerFn({ method: "GET" })
  .inputValidator((params: ProductsParams = {}) => params)
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const page = data?.page ?? 1;
    const limit = data?.limit ?? 10;
    const sortBy = data?.sortBy ?? "descricao_asc";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const [column, order] = sortBy.split("_");
    const orderValue = order === "asc";

    const query = supabase
      .from("Products")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(column, { ascending: orderValue });

    const { data: products, error, count } = await query;

    if (error) {
      console.error("[fetchProducts] error:", error);
      throw new Error(error.message);
    }

    return {
      products: (products || []) as Product[],
      page,
      limit,
      totalCount: count || 0,
      hasMore: (count || 0) > to + 1,
    } as ProductsResponse;
  });

export const fetchGuests = createServerFn({ method: "GET" }).handler(
  async () => {
    const supabase = getServerSupabase();
    const { data, error } = await supabase.from("GuestList").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data as Guest[];
  },
);

type NewGuest = { name: string; email?: string; telefone?: string };

export const addGuest = createServerFn({ method: "POST" })
  .inputValidator((data: NewGuest) => data)
  .handler(async ({ data }) => {
    const supabase = getServerSupabase();
    const { data: result, error } = await supabase
      .from("GuestList")
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result as Guest;
  });
