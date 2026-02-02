import { useEffect, useState } from "react"
import supabase from "../../services/supabase/client"

interface Product {
  id: string
  image: string
  descricao?: string
  preco: number
  created_at: string
  link?: string
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from("Products").select("*")
    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <section aria-labelledby="products-heading" className="py-16 px-6 bg-wheat/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 id="products-heading" className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium">
            Lista de Presentes
          </h2>
          <p className="font-body text-forest-dark/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Selecionamos com carinho alguns itens especiais. Sintam-se à vontade para escolher o que
            desejarem ou até mesmo pensar em algo diferente. Para nós, o que mais importa é o
            carinho de cada um!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-sage-light border-t-forest" aria-hidden="true"></div>
            <p className="mt-6 text-forest-dark font-body text-lg">Carregando presentes...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-cream/80 rounded-3xl">
            <p className="text-forest-dark font-body text-lg">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
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
                  <h3 id={`product-${product.id}-name`} className="font-display text-forest-dark text-xl mb-3 font-medium min-h-15">
                    {product.descricao}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-terracotta text-2xl font-semibold">
                      {formatPrice(product.preco)}
                    </p>
                  </div>

                  {product.link ? (
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver produto ${product.descricao} (abre em nova aba)`}
                      className="group/link block w-full py-3 px-6 bg-forest text-cream font-body text-center rounded-xl overflow-hidden transition-all duration-300 hover:bg-forest-dark hover:shadow-soft"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Ver Produto
                        <svg
                          className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </a>
                  ) : (
                    <div className="w-full py-3 px-6 bg-sage/20 text-forest-dark/60 font-body text-center rounded-xl">
                      Consulte disponibilidade
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-forest/20 text-center">
          <p className="text-forest/70 font-body text-sm mb-2">
            Sua presença é o maior presente que poderíamos receber
          </p>
          <p className="font-accent text-forest text-3xl">Matheus & Nicolly</p>
        </div>
      </div>
    </section>
  )
}