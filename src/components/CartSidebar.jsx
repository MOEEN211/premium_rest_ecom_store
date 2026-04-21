import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-slate-900" />
            <h2 className="text-xl font-serif text-slate-900">Your Cart</h2>
          </div>
          <button 
            onClick={closeCart}
            className="text-gray-400 hover:text-slate-900 transition p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart size={48} className="mb-4 opacity-50" />
              <p>Your cart is currently empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                // Use cartId if available (configured products), fall back to id
                const itemKey = item.cartId || item.id;
                return (
                  <div key={itemKey} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-sm font-medium text-slate-900 pr-2">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(itemKey)}
                          className="text-gray-400 hover:text-rose-600 transition flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 capitalize mb-2">{item.category || 'Bed'}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button 
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-4 py-1 text-sm font-medium border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-50 transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-medium text-slate-900">
                          £{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-serif text-slate-900">£{cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-center">Taxes and shipping calculated at checkout</p>
            <Link 
              to="/checkout" 
              onClick={closeCart}
              className="w-full bg-[#4a9d9c] hover:bg-[#3b807f] text-white py-4 font-semibold transition flex items-center justify-center gap-2 rounded-sm"
            >
              Buy Now
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
