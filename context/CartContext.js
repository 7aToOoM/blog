import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'ADD': {
      const existing = state.find(
        (i) => i.id === action.item.id && i.type === action.item.type
      );
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id && i.type === action.item.type
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(
        (i) => !(i.id === action.id && i.type === action.itemType)
      );
    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return state.filter(
          (i) => !(i.id === action.id && i.type === action.itemType)
        );
      }
      return state.map((i) =>
        i.id === action.id && i.type === action.itemType
          ? { ...i, qty: action.qty }
          : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('furniture_cart');
      if (saved) dispatch({ type: 'LOAD', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('furniture_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => dispatch({ type: 'ADD', item });
  const removeItem = (id, itemType) => dispatch({ type: 'REMOVE', id, itemType });
  const updateQty = (id, itemType, qty) => dispatch({ type: 'UPDATE_QTY', id, itemType, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
