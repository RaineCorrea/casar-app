import { useQuery } from "@tanstack/react-query";
import supabase from "./client";

interface Product {
  id: string;
  image: string;
  descricao?: string;
  preco: number;
  created_at: string;
  link?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data as Product[];
    },
  });
}
