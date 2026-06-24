import {
  queryOptions,
  useQuery,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { fetchProducts, type Product, type ProductsSortBy } from "./server";

export type { Product, ProductsSortBy };

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: () => fetchProducts(),
});

export function useProducts() {
  return useQuery(productsQueryOptions);
}

export function useProductsInfinite(sortBy: ProductsSortBy = "descricao_asc") {
  return useInfiniteQuery({
    queryKey: ["products", "infinite", sortBy],
    queryFn: ({ pageParam }: { pageParam?: number }) => {
      const params = {
        page: pageParam || 1,
        limit: 10,
        sortBy,
      };
      return fetchProducts({ data: params });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
