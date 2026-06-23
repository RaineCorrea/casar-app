import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

/**
 * Componente Skeleton para loading states
 * Melhora a percepção de performance durante carregamento
 */
export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const skeletons = Array.from({ length: count });

  const baseClasses = 'skeleton animate-pulse';

  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={cn(
            baseClasses,
            variantClasses[variant],
            className
          )}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * Skeleton específico para cards de produtos
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-wheat/50 rounded-xl p-4 border border-sage-light/30">
      {/* Imagem */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={160}
        className="mb-4"
      />

      {/* Conteúdo */}
      <Skeleton
        variant="text"
        width="80%"
        height={24}
        className="mb-2"
      />
      <Skeleton
        variant="text"
        width="60%"
        height={20}
        className="mb-4"
      />

      {/* Preço */}
      <Skeleton
        variant="text"
        width="40%"
        height={28}
      />
    </div>
  );
}

/**
 * Skeleton para lista de produtos
 */
export function ProductsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Skeleton para formulários
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={48} />
        </div>
      ))}
      <Skeleton variant="rectangular" width="100%" height={48} />
    </div>
  );
}

/**
 * Loading spinner com overlay
 */
export function LoadingSpinner({
  size = 'md',
  text = 'Carregando...',
}: {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div
        className={cn(
          'spinner',
          sizeClasses[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <p className="text-forest-dark/60 font-body text-sm">{text}</p>
      )}
    </div>
  );
}

/**
 * Inline loading spinner (para botões, etc.)
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-block spinner w-4 h-4', className)}
      aria-hidden="true"
    />
  );
}
