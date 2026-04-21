import { CheckCircle, X } from 'lucide-react';

const OrderConfirmation = ({ isOpen, onClose, orderId, customerDetails, cartItems, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8 text-center border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          <h2 className="text-3xl font-serif text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-500">Your order #{orderId || 'PENDING'} has been placed successfully.</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Details</h3>
              <div className="text-slate-800 space-y-1">
                <p className="font-semibold">{customerDetails.fullName}</p>
                <p className="text-sm">{customerDetails.email}</p>
                <p className="text-sm">{customerDetails.phone}</p>
                <p className="text-sm whitespace-pre-wrap">{customerDetails.address}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-[#4a9d9c]">£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-8">
            <button
              onClick={onClose}
              className="w-full bg-[#4a9d9c] hover:bg-[#3b807f] text-white py-4 rounded-lg font-bold transition-all shadow-lg shadow-teal-100"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
