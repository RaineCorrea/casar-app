import { createFileRoute } from "@tanstack/react-router";
import { IconeCheck, IconeEstrela } from "../components/icons";

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <IconeCheck className="w-20 h-20 text-green-500" />
        </div>

        <h1 className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium">
          Pagamento Aprovado!
        </h1>

        <p className="font-body text-forest-dark text-lg mb-8 leading-relaxed">
          Obrigado pelo presente. Sua generosidade significa muito para nós. ❤️
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-forest text-cream font-display text-lg rounded-xl hover:bg-forest-dark transition-colors"
          >
            Voltar ao Início
          </a>
        </div>

        <div className="mt-12">
          <IconeEstrela />
          <p className="font-accent text-forest text-2xl mt-2">
            Matheus & Nicolly
          </p>
        </div>
      </div>
    </div>
  );
}
