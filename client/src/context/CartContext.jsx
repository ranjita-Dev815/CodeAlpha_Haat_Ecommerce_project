import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'cart';

const load = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  // The cart survives page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked */
    }
  }, [items]);

  const value = useMemo(() => {
    const addItem = (p, qty = 1) =>
      setItems((prev) => {
        if (p.stock < 1) return prev;
        const found = prev.find((i) => i._id === p._id);
        if (found) {
          return prev.map((i) =>
            i._id === p._id ? { ...i, stock: p.stock, qty: Math.min(i.qty + qty, p.stock) } : i
          );
        }
        return [
          ...prev,
          { _id: p._id, name: p.name, price: p.price, image: p.image, stock: p.stock, qty: Math.min(qty, p.stock) },
        ];
      });

    const setQty = (id, qty) =>
      setItems((prev) =>
        prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
      );

    const removeItem = (id) => setItems((prev) => prev.filter((i) => i._id !== id));
    const clear = () => setItems([]);

    return {
      items,
      addItem,
      setQty,
      removeItem,
      clear,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      itemsPrice: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
