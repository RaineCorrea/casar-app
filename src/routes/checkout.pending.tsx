import { createFileRoute } from "@tanstack/react-router";
import { IconeCarregando } from "../components/icons";

export const Route = createFileRoute("/checkout/pending")({
  component: CheckoutPending,
});

function CheckoutPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <IconeCarregando className="w-20 h-20 text-terracotta" />
        </div>

        <h1 className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium">
          Pagamento em Processamento
        </h1>

        <p className="font-body text-forest-dark text-lg mb-8 leading-relaxed">
          Seu pagamento está sendo processado. Você receberá uma confirmação por e-mail em breve.
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-forest text-cream font-display text-lg rounded-xl hover:bg-forest-dark transition-colors"
          >
            Voltar ao Início
          </a>
        </div>

        <p className="mt-12 font-accent text-forest text-2xl">
          Matheus & Nicolly
        </p>
      </div>
    </div>
  );
}
