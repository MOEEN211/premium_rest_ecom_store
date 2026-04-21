import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('elitebed_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('elitebed_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const pId = product.cartId || product.id;
      const existing = prevItems.find(item => (item.cartId || item.id) === pId);
      const qtyToAdd = product.quantity || 1;
      if (existing) {
        return prevItems.map(item => 
          (item.cartId || item.id) === pId ? { ...item, quantity: item.quantity + qtyToAdd } : item
        );
      }
      return [...prevItems, { ...product, quantity: qtyToAdd }];
    });
    setIsCartOpen(true); // Open sidebar on add
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => (item.cartId || item.id) !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => (item.cartId || item.id) === id ? { ...item, quantity: newQuantity } : item)
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
      isCartOpen, toggleCart, closeCart, cartTotal, cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}
