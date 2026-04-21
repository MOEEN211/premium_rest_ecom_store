// EmailJS is loaded globally from CDN
const SERVICE_ID  = 'service_rg6nwuf';
const TEMPLATE_ID = 'template_qxwqa9o';
const PUBLIC_KEY  = 'HTVX1ebXlWIIqVAhw';

export const sendOrderEmail = async ({
  to_email = 'ebedsuk@gmail.com',  // Default email changed to ebedsuk@gmail.com
  orderId,
  orderDate,
  orderTime,
  customerName,
  customerEmail,
  customerPhone,
  shippingAddress,
  items,           // array of { name, image, quantity, price, total, selectedOptions }
  itemCount,
  subtotal,
  shipping,
  total,
  hasAssembly,
  assembly,
}) => {
  const timestamp = new Date().toLocaleString('en-GB');

  console.log('🔍 EmailJS Debug - Starting email send process');
  console.log('🔍 EmailJS Debug - SERVICE_ID:', SERVICE_ID);
  console.log('🔍 EmailJS Debug - TEMPLATE_ID:', TEMPLATE_ID);
  console.log('🔍 EmailJS Debug - to_email:', to_email);
  
  // Check if EmailJS is loaded
  if (!window.emailjs) {
    console.error('❌ EmailJS not loaded! Check CDN');
    throw new Error('EmailJS not loaded');
  }
  
  console.log('✅ EmailJS is loaded and available');

  // Flatten items array into plain text — EmailJS can't handle arrays
  const itemsList = items.map((item, i) => {
    const opts = item.selectedOptions 
      ? Object.entries(item.selectedOptions).map(([k, v]) => `   ${k}: ${v}`).join('\n')
      : '';
    return `${i + 1}. ${item.name}
   Qty: ${item.quantity} x £${item.price} = £${item.total}${opts ? '\n' + opts : ''}`;
  }).join('\n\n');

  // Use the exact same approach as working t.html - include multiple email field names
  const templateParams = {
    orderId: orderId,
    orderDate: orderDate,
    orderTime: orderTime,
    customerName: customerName,
    customerEmail: customerEmail,
    customerPhone: customerPhone || 'N/A',
    shippingAddress: shippingAddress || 'N/A',
    itemsList: itemsList,
    itemCount: itemCount,
    subtotal: subtotal,
    shipping: shipping,
    total: total,
    hasAssembly: hasAssembly ? 'Yes' : 'No',
    assembly: assembly,
    timestamp: timestamp,
    // Add multiple email field names like in t.html
    to_email: to_email,
    email: to_email,
    recipient_email: to_email,
    user_email: to_email
  };

  console.log('🔍 EmailJS Debug - Template params:', templateParams);
  console.log('🔍 EmailJS Debug - About to call emailjs.send()...');

  try {
    const response = await window.emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    console.log('🔍 EmailJS Debug - SDK Response:', response);
    console.log('✅ Email sent successfully via EmailJS!');
    return { success: true, response };
  } catch (error) {
    console.error('🔍 EmailJS Debug - SDK Error:', error);
    console.error('🔍 EmailJS Debug - Error details:', error.text || error.message);
    console.error('🔍 EmailJS Debug - Full error object:', error);
    throw error;
  }
};