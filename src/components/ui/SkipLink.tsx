/**
 * SkipLink Component
 * Permite que usuários de leitor de tela pultem navegação repetitiva
 * Melhora acessibilidade WCAG 2.1
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-forest focus:text-cream focus:rounded-lg focus:font-body focus:text-base focus:font-medium focus:shadow-lifted"
    >
      Pular para o conteúdo principal
    </a>
  );
}
