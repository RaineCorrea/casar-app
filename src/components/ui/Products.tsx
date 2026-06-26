import { useState } from "react";
import {
  useProductsInfinite,
  type ProductsSortBy,
} from "../../services/supabase/products";
import { useCart } from "../contexts/CartContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { ProductsListSkeleton } from "./Skeleton";
import { ProductCard } from "./ProductCard";

type SortOption = {
  value: ProductsSortBy;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "preco_desc", label: "Maior Preço" },
  { value: "preco_asc", label: "Menor Preço" },
  { value: "descricao_asc", label: "A-Z" },
];

export default function Products() {
  const [sortBy, setSortBy] = useState<ProductsSortBy>("preco_desc");
  const { addItem } = useCart();

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProductsInfinite(sortBy);

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // Deduplicar produtos por ID para evitar erros de chaves duplicadas
  const uniqueProducts = Array.from(
    new Map(allProducts.map((p) => [p.id, p])).values()
  );

  const handleAddToCart = (product: {
    id: string;
    image: string;
    descricao: string;
    preco: number;
    link?: string;
  }) => {
    addItem(product);
  };

  function handleLoadMore() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      className="py-16 px-6 bg-wheat/30"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="products-heading"
            className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium"
          >
            Lista de Presentes
          </h2>
          <p className="font-body text-forest-dark/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Selecionamos com carinho alguns itens especiais. Sintam-se à vontade
            para escolher o que desejarem ou até mesmo pensar em algo diferente.
            Para nós, o que mais importa é o carinho de cada um!
          </p>
        </div>

        <div className="mb-8 flex justify-end">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as ProductsSortBy)}
            aria-label="Ordenar produtos"
          >
            <SelectTrigger
              className="px-4 py-2 rounded-xl border-2 border-forest/20 bg-cream text-forest font-body focus:outline-none focus:ring-2 focus:ring-forest/50 w-fit cursor-pointer"
            >
              <SelectValue placeholder="Ordenar por">
                {sortOptions.find((option) => option.value === sortBy)?.label || "Ordenar por"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <ProductsListSkeleton count={6} />
        ) : error ? (
          <div className="text-center py-20 bg-terracotta/10 border-2 border-terracotta rounded-3xl">
            <p className="text-terracotta-dark font-body text-lg">
              {error.message}
            </p>
          </div>
        ) : uniqueProducts.length === 0 ? (
          <div className="text-center py-20 bg-cream/80 rounded-3xl">
            <p className="text-forest-dark font-body text-lg">
              Nenhum produto disponível no momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  descricao={product.descricao}
                  preco={product.preco}
                  link={product.link}
                  index={index}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-forest text-cream font-body text-lg rounded-xl hover:bg-forest-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-soft"
                >
                  {isFetchingNextPage ? (
                    <>
                      <div
                        className="animate-spin rounded-full h-5 w-5 border-2 border-cream border-t-transparent"
                        aria-hidden="true"
                      ></div>
                      Carregando...
                    </>
                  ) : (
                    <>
                      Carregar Mais Produtos
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </Button>

                <p className="mt-4 text-forest/70 font-body text-sm">
                  Mostrando {uniqueProducts.length} de {totalCount} produtos
                </p>
              </div>
            )}
          </>
        )}

        <div className="mt-16 pt-8 border-t border-forest/20 text-center">
          <p className="text-forest/70 font-body text-sm mb-2">
            Sua presença é o maior presente que poderíamos receber
          </p>
          <p className="font-accent text-forest text-3xl">Matheus & Nicolly</p>
        </div>
      </div>
    </section>
  );
}
