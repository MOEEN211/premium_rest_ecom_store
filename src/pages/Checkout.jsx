import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';
import OrderConfirmation from '../components/OrderConfirmation';
import { sendOrderEmail } from '../utils/sendOrderEmail';


export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // New modal state
  const [currentOrderId, setCurrentOrderId] = useState(''); // Store ID for modal
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [errorText, setErrorText] = useState('');
   const [confirmedItems, setConfirmedItems] = useState([]);
   const [confirmedTotal, setConfirmedTotal] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '', // Added email field
    phone: '',
    additionalPhone: '',
    deliveryDate: '',
    address: '',
    city: '',
    postCode: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorText('');

    try {
      const { data, error } = await supabase.from('orders').insert([{
        customer_name: formData.fullName,
        customer_email: formData.email, // Added email to database
        phone: formData.phone,
        additional_phone: formData.additionalPhone || null,
        delivery_date: formData.deliveryDate || null,
        address: formData.address,
        city: formData.city || null,
        postcode: formData.postCode || null,
        cart_items: cartItems,
        total_price: cartTotal
      }]).select();

      if (error) throw error;

      const orderUid = data?.[0]?.id || 'N/A';
      setCurrentOrderId(orderUid);

      // Prepare order data for EmailJS
      const orderData = {
        orderId: orderUid,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: `${formData.address}${formData.city ? ', ' + formData.city : ''}${formData.postCode ? ' ' + formData.postCode : ''}`.trim(),
        items: cartItems,
        subtotal: cartTotal,
        shipping: 0, // Free shipping
        assembly: cartItems.reduce((sum, item) => {
          const hasAssembly = item.selectedOptions?.Assembly === 'Bed Assembling';
          return sum + (hasAssembly ? 50 : 0);
        }, 0),
        total: cartTotal,
        hasAssembly: cartItems.some(item => item.selectedOptions?.Assembly === 'Bed Assembling')
      };

      // Send admin notification email
      try {
        console.log('📧 About to send admin email with orderData:', orderData);
        
        // Get current date and time
        const now = new Date();
        const orderDate = now.toLocaleDateString('en-GB');
        const orderTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        
        // Calculate item count and prepare items with totals
        const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const processedItems = cartItems.map(item => ({
          name: item.name,
          image: item.img || item.image,
          quantity: item.quantity,
          price: item.price,
          total: (item.price * item.quantity).toFixed(2),
          selectedOptions: item.selectedOptions || {}
        }));
        
        console.log('📧 Checkout Debug - Processed items:', processedItems);
        console.log('📧 Checkout Debug - Order date/time:', orderDate, orderTime);
        console.log('📧 Checkout Debug - Form data:', formData);
        
        // Prepare email parameters
        const emailParams = {
          to_email: 'sales@premiumrestfurniture.co.uk',  
          orderId: orderData.orderId,
          orderDate,
          orderTime,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          items: processedItems,
          itemCount,
          subtotal: orderData.subtotal.toFixed(2),
          shipping: orderData.shipping.toFixed(2),
          total: orderData.total.toFixed(2),
          hasAssembly: orderData.hasAssembly,
          assembly: orderData.assembly.toFixed(2)
        };
        
        console.log('📧 Checkout Debug - Email params:', emailParams);
        console.log('📧 Checkout Debug - About to call sendOrderEmail...');
        
        // Send email using EmailJS
        const emailResult = await sendOrderEmail(emailParams);
        
        console.log('✅ Admin notification sent successfully:', emailResult);
      } catch (emailError) {
        console.error('❌ Failed to send admin notification:', emailError);
        console.error('❌ Email error details:', emailError.message);
        console.error('❌ Full email error:', emailError);
        // Don't fail the order if email fails, just log it
      }

      setConfirmedItems([...cartItems]);
      setConfirmedTotal(cartTotal);
      
      clearCart();
      setShowConfirmation(true); // Open the new confirmation modal
      window.scrollTo(0, 0);
    } catch (err) {
      setErrorText(`Failed to place order: ${err.message}. Please try WhatsApp as an alternative.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.postCode || !formData.deliveryDate) {
      alert('Please fill in your Name, Phone, Delivery Date, Address, and Post Code before sending via WhatsApp!');
      return;
    }

    let message = `*New Order Request - PremiumRest*\n\n*Customer Details:*\nName: ${formData.fullName}\nPhone: ${formData.phone}`;
    if (formData.additionalPhone) message += `\nAlt Phone: ${formData.additionalPhone}`;
    message += `\nAddress: ${formData.address}`;
    if (formData.city) message += `, ${formData.city}`;
    if (formData.postCode) message += ` ${formData.postCode}`;
    message += `\nDelivery: ${formData.deliveryDate || 'ASAP'}\n\n*Order Items:*\n`;

    cartItems.forEach(item => {
      message += `- ${item.quantity}x ${item.name} — £${(item.price * item.quantity).toFixed(2)}`;
      if (item.selectedOptions) {
        Object.entries(item.selectedOptions).forEach(([k, v]) => { message += `\n  ${k}: ${v}`; });
      }
      message += '\n';
    });
    message += `\n*Total: £${cartTotal.toFixed(2)}*`;

    const encodedStr = encodeURIComponent(message);
    // WhatsApp business number
    window.open(`https://wa.me/447783699250?text=${encodedStr}`, '_blank');
  };

  if (isSuccess) {
    return (
      <div className="bg-[#f8f8f8] py-32 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle size={64} className="text-[#1a193f] mb-6" />
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Order Confirmed!</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
          Thank you for choosing Cash on Delivery. We've received your order and will be in touch shortly to confirm delivery!
        </p>
        <Link to="/" className="bg-[#1a193f] text-white px-8 py-4 font-semibold hover:bg-black rounded-xl transition shadow-sm">
          Return to Home
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0 && !showConfirmation) {
    return (
      <div className="bg-[#f8f8f8] py-32 text-center min-h-[60vh]">
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Your Cart is Empty</h2>
        <Link to="/shop" className="text-[#1a193f] hover:underline font-bold">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] py-12 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left: Form ── */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
            <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tighter">Checkout - Cash on Delivery</h1>
            <p className="text-xs text-rose-600 mb-8 italic font-medium">* Note: We only offer cash on delivery as the payment option.</p>

            {errorText && (
              <div className="bg-red-50 text-red-600 p-4 rounded-sm text-sm mb-6 border border-red-100">
                {errorText}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>
              <div>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>
              <div>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="additionalPhone"
                  value={formData.additionalPhone}
                  onChange={handleChange}
                  placeholder="Additional Phone Number (Optional)"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>

              {/* Date input — label displayed above to avoid placeholder overlap */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Get it tomorrow or pick your delivery day
                </label>
                <input
                  required
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f] bg-white"
                />
              </div>

              <h3 className="text-lg font-bold text-slate-900 pt-4">Shipping Address</h3>

              <div>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City (Optional)"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  name="postCode"
                  value={formData.postCode}
                  onChange={handleChange}
                  placeholder="Post Code"
                  className="w-full text-sm border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#1a193f] focus:ring-1 focus:ring-[#1a193f]"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#1a193f] hover:bg-black text-white py-3.5 px-4 rounded-xl font-bold text-[15px] transition shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="flex-1 bg-gray-100 text-[#1a193f] hover:bg-gray-200 py-3.5 px-4 rounded-xl font-bold text-[15px] transition"
                >
                  Order via WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: Order Overview ── */}
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 h-max">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">Order Overview</h2>

            <div className="space-y-10">
              {cartItems.map(item => (
                <div key={item.cartId || item.id}>
                  {/* Product image */}
                  <div className="w-full max-w-xs h-44 mb-4">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-sm border border-gray-100 shadow-sm"
                    />
                  </div>

                  <h4 className="text-sm font-semibold text-slate-800 mb-3">{item.name}</h4>

                  <div className="text-xs text-slate-600 border-t border-gray-100">
                    {/* Base price row */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-slate-700">Base Price</span>
                      <span className="text-slate-900 font-semibold">{item.price}£</span>
                    </div>

                    {/* Dynamic options rows */}
                    {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="capitalize text-slate-700">{key}</span>
                        <span className="text-[#1a193f] font-bold">{val}</span>
                      </div>
                    ))}

                    {/* Quantity */}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-slate-700">Quantity</span>
                      <span className="text-slate-900">{item.quantity}</span>
                    </div>

                    {/* Item total */}
                    <div className="flex justify-between py-2">
                      <span className="font-bold text-slate-900 text-sm">Total</span>
                      <span className="font-bold text-slate-900 text-sm">{(item.price * item.quantity).toFixed(2)}£</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        <OrderConfirmation 
          isOpen={showConfirmation} 
          onClose={() => {
            setShowConfirmation(false);
            window.location.href = '/'; // Redirect to home on close
          }}
          orderId={currentOrderId}
          customerDetails={{
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}${formData.city ? ', ' + formData.city : ''}${formData.postCode ? ' ' + formData.postCode : ''}`.trim()
          }}
          cartItems={confirmedItems}
          total={confirmedTotal}
        />
      </div>
    </div>
  );
}
