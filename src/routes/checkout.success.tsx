import { createFileRoute } from "@tanstack/react-router";
import { IconeCheck, IconeEstrela } from "../components/icons";
import { useSearch } from "@tanstack/react-router";
import { checkOrderStatus } from "../services/supabase/orders";
import { useState, useEffect } from "react";

interface SearchParams {
  preference_id?: string;
  payment_id?: string;
}

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccess,
});

function CheckoutSuccess() {
  const search = useSearch({ from: "/checkout/success" }) as SearchParams;
  const preferenceId = search.preference_id;
  const paymentId = search.payment_id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (preferenceId) {
        try {
          const orderData = await checkOrderStatus(preferenceId);
          setOrder(orderData);
        } catch (error) {
          console.error("Erro ao buscar status do pedido:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [preferenceId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <div className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 text-green-500">
            <IconeCheck />
          </div>
        </div>

        <h1 className="font-display text-forest text-4xl md:text-5xl mb-4 font-medium">
          Pagamento Aprovado!
        </h1>

        <p className="font-body text-forest-dark text-lg mb-8 leading-relaxed">
          Obrigado pelo presente. Sua generosidade significa muito para nós. ❤️
        </p>

        {!loading && order && (
          <div className="bg-wheat/50 rounded-xl p-6 mb-8 border border-sage-light/30">
            <h2 className="font-display text-forest text-xl mb-4 font-medium">
              Detalhes do Pedido
            </h2>
            <div className="space-y-2 text-left">
              <p className="text-forest-dark">
                <span className="font-semibold">Pedido ID:</span> {order.id.slice(0, 8)}...
              </p>
              <p className="text-forest-dark">
                <span className="font-semibold">Total:</span>{" "}
                {formatCurrency(order.total)}
              </p>
              <p className="text-forest-dark">
                <span className="font-semibold">Status:</span>{" "}
                <span className="text-green-600 font-semibold">
                  {order.status === "approved" ? "Aprovado" : "Pendente"}
                </span>
              </p>
              {paymentId && (
                <p className="text-forest-dark">
                  <span className="font-semibold">Pagamento ID:</span> {paymentId}
                </p>
              )}
            </div>
          </div>
        )}

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
