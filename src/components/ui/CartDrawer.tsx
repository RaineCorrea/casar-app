import { useCart } from "../contexts/CartContext";
import { useEffect } from "react";
import {
  IconeX,
  IconeCarrinhoVazio,
  IconeLixeira,
  IconeWhatsApp,
} from "../icons";

export function CartDrawer() {
  const {
    items,
    total,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleCheckout = () => {
    const itemsList = items
      .map((item) => {
        const subtotal = item.preco * item.quantity;
        return `• ${item.descricao || "Produto"} (${
          item.quantity
        }x) - ${formatCurrency(subtotal)}`;
      })
      .join("\n");

    const text = `*Pedido da Lista de Presentes*\n\n${itemsList}\n\n*Total: ${formatCurrency(
      total,
    )}*`;

    const phoneNumber = "5522997000228";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      text,
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-cream z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-forest/20">
            <h2 className="font-display text-forest text-xl sm:text-2xl font-medium">
              Seu Carrinho
            </h2>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-forest/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar carrinho"
            >
              <IconeX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <IconeCarrinhoVazio />
                <p className="text-forest-dark/80 text-base sm:text-lg mb-4">
                  Não há produtos no carrinho
                </p>
                <button
                  onClick={closeCart}
                  className="bg-terracotta text-cream px-6 py-3 rounded-xl font-body font-semibold hover:bg-terracotta-dark transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Ver Lista de Presentes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-wheat/50 rounded-xl p-3 sm:p-4 border border-sage-light/30"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="flex justify-center sm:justify-start">
                        <img
                          src={item.image}
                          alt={item.descricao}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 flex flex-col sm:block gap-2 sm:gap-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-display text-forest-dark text-sm sm:text-base mb-1 font-medium flex-1 pr-2">
                            {item.descricao || "Produto"}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="sm:hidden text-terracotta hover:text-red-600 p-1 transition-colors cursor-pointer"
                            aria-label="Remover produto"
                          >
                            <IconeLixeira className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-terracotta font-bold text-base sm:text-lg mb-2">
                          {formatCurrency(item.preco)}
                        </p>

                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-lg bg-sage-light/30 text-forest-dark font-bold text-base hover:bg-sage-light/50 transition-colors flex items-center justify-center cursor-pointer"
                            aria-label="Diminuir quantidade"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-base text-forest-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg bg-sage-light/30 text-forest-dark font-bold text-base hover:bg-sage-light/50 transition-colors flex items-center justify-center cursor-pointer"
                            aria-label="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <div className="hidden sm:flex flex-col items-end justify-between mt-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-terracotta hover:text-red-600 hover:bg-terracotta/10 p-2 rounded-lg transition-colors cursor-pointer"
                            aria-label="Remover produto"
                          >
                            <IconeLixeira className="w-5 h-5" />
                          </button>
                          <p className="font-bold text-lg text-forest-dark">
                            {formatCurrency(item.preco * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:hidden flex justify-between items-center mt-2 pt-2 border-t border-forest/10">
                      <span className="text-forest-dark/70 text-sm">
                        Total:
                      </span>
                      <p className="font-bold text-base text-forest-dark">
                        {formatCurrency(item.preco * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-forest/20 p-4 sm:p-6 bg-wheat/30">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="font-display text-forest-dark text-lg sm:text-xl font-medium">
                  Total:
                </span>
                <span className="font-display text-terracotta text-2xl sm:text-3xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-3 px-4 sm:py-3 rounded-xl font-body font-bold text-sm sm:text-base hover:bg-green-600 transition-colors flex items-center justify-center gap-2 mb-2 cursor-pointer"
              >
                <IconeWhatsApp />
                <span className="truncate">Finalizar via WhatsApp</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full text-forest-dark/60 hover:text-terracotta py-2 text-xs sm:text-sm font-body transition-colors cursor-pointer"
              >
                Limpar Carrinho
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
