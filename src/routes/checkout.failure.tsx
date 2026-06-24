import { createFileRoute } from "@tanstack/react-router";
import { IconeErro } from "../components/icons";

export const Route = createFileRoute("/checkout/failure")({
  component: CheckoutFailure,
});

function CheckoutFailure() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 text-red-500">
            <IconeErro />
          </div>
        </div>

        <h1 className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium">
          Pagamento não realizado
        </h1>

        <p className="font-body text-forest-dark text-lg mb-8 leading-relaxed">
          Houve um problema com o pagamento. Por favor, tente novamente ou entre
          em contato conosco.
        </p>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-forest text-cream font-display text-lg rounded-xl hover:bg-forest-dark transition-colors"
          >
            Voltar à Lista de Presentes
          </a>

          <a
            href="https://wa.me/5522997000228"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-terracotta text-cream font-display text-lg rounded-xl hover:bg-terracotta-dark transition-colors"
          >
            Falar Conosco
          </a>
        </div>

        <p className="mt-12 font-accent text-forest text-2xl">
          Matheus & Nicolly
        </p>
      </div>
    </div>
  );
}
