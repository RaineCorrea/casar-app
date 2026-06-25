import { memo } from 'react';
import { Card } from './card';
import { Button } from './button';
import { useScrollAnimation } from '../../hooks/useOnScreen';

interface ProductCardProps {
  id: string;
  image: string;
  descricao?: string;
  preco: number;
  link?: string;
  index: number;
  onAddToCart: (product: {
    id: string;
    image: string;
    descricao: string;
    preco: number;
    link?: string;
  }) => void;
}

function ProductCardComponent({
  id,
  image,
  descricao,
  preco,
  link,
  index,
  onAddToCart,
}: ProductCardProps) {
  const [ref, isVisible] = useScrollAnimation(0.1, '0px');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id,
      image,
      descricao: descricao || 'Produto',
      preco,
      link,
    });
  };

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? 'is-visible' : ''}`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <Card
        className="bg-cream/95 backdrop-blur-sm rounded-3xl shadow-soft overflow-hidden hover:shadow-lifted transition-all duration-300 group hover-lift"
        aria-labelledby={`product-${id}-name`}
      >
        <div className="aspect-square overflow-hidden bg-wheat/50">
          <img
            src={image}
            alt={descricao}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        <div className="p-4">
          <h3
            id={`product-${id}-name`}
            className="font-display text-forest-dark text-lg mb-2 font-medium min-h-12 line-clamp-2"
          >
            {descricao}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <p className="font-body text-terracotta text-xl font-semibold">
              {formatPrice(preco)}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            className="group/add w-full py-2 px-3 font-body text-center rounded-xl transition-all duration-300 bg-forest text-cream hover:bg-forest-dark hover:shadow-soft text-sm"
            aria-label={`Adicionar ${descricao} ao carrinho`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span className="truncate">
                Adicionar ao Carrinho
              </span>
              <svg
                className="w-4 h-4 shrink-0 group-hover/add:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
