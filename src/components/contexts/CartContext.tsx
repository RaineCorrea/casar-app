import React, { useCallback, useContext, useEffect } from "react";

interface CartItem {
  id: string;
  image: string;
  descricao: string;
  preco: number;
  quantity: number;
  link?: string;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isloading, setIsLoading] = React.useState<boolean>(true);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("casar-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isloading) {
      localStorage.setItem("casar-cart", JSON.stringify(items));
    }
  }, [items, isloading]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (prev.length === 0) {
        setIsOpen(true);
      }

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.preco * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
