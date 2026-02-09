import { useState } from "react";
import {
  useProductsInfinite,
  type ProductsSortBy,
} from "../../services/supabase/products";
import { useCart } from "../contexts/CartContext";
import { IconeCarrinho } from "../icons";

type SortOption = {
  value: ProductsSortBy;
  label: string;
};

const sortOptions: SortOption[] = [
  { value: "preco_desc", label: "Maior Preço" },
  { value: "preco_asc", label: "Menor Preço" },
  { value: "descricao_asc", label: "A-Z" },
];

function AddToCartButton({
  productId,
  image,
  descricao,
  preco,
  link,
}: {
  productId: string;
  image: string;
  descricao?: string;
  preco: number;
  link?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: productId,
      image,
      descricao: descricao || "Produto",
      preco,
      link,
    });
    setAdded(true);

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`group/add w-full py-2.5 sm:py-3 px-3 sm:px-6 font-body text-center rounded-xl transition-all duration-300 cursor-pointer ${
        added
          ? "bg-green-500 text-white"
          : "bg-forest text-cream hover:bg-forest-dark hover:shadow-soft"
      }`}
      aria-label={`Adicionar ${descricao} ao carrinho`}
    >
      {added ? (
        <span className="flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="hidden sm:inline">✓</span>
          <span className="text-sm sm:text-base">Adicionado!</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-sm sm:text-base truncate">
            Adicionar ao Carrinho
          </span>
          <IconeCarrinho className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        </span>
      )}
    </button>
  );
}

export default function Products() {
  const [sortBy, setSortBy] = useState<ProductsSortBy>("descricao_asc");

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

  function handleLoadMore() {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
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
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ProductsSortBy)}
            className="px-4 py-2 rounded-xl border-2 border-forest/20 bg-cream text-forest font-body focus:outline-none focus:ring-2 focus:ring-forest/50"
            aria-label="Ordenar produtos"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div
              className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-sage-light border-t-forest"
              aria-hidden="true"
            ></div>
            <p className="mt-6 text-forest-dark font-body text-lg">
              Carregando presentes...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-terracotta/10 border-2 border-terracotta rounded-3xl">
            <p className="text-terracotta-dark font-body text-lg">
              {error.message}
            </p>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20 bg-cream/80 rounded-3xl">
            <p className="text-forest-dark font-body text-lg">
              Nenhum produto disponível no momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProducts.map((product) => (
                <article
                  key={product.id}
                  className="bg-cream/95 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden hover:shadow-lifted transition-all duration-300 group"
                  aria-labelledby={`product-${product.id}-name`}
                >
                  <div className="aspect-square overflow-hidden bg-wheat/50">
                    <img
                      src={product.image}
                      alt={product.descricao}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3
                      id={`product-${product.id}-name`}
                      className="font-display text-forest-dark text-xl mb-3 font-medium min-h-15"
                    >
                      {product.descricao}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <p className="font-body text-terracotta text-2xl font-semibold">
                        {formatPrice(product.preco)}
                      </p>
                    </div>

                    <AddToCartButton
                      productId={product.id}
                      image={product.image}
                      descricao={product.descricao}
                      preco={product.preco}
                      link={product.link}
                    />
                  </div>
                </article>
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-12 text-center">
                <button
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
                </button>

                <p className="mt-4 text-forest/70 font-body text-sm">
                  Mostrando {allProducts.length} de {totalCount} produtos
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
