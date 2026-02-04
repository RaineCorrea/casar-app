import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchProducts, type Product } from "./server";

export type { Product };

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => fetchProducts(),
});

export function useProducts() {
  return useQuery(productsQueryOptions);
}
