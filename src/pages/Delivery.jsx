export default function Delivery() {
  return (
    <div className="bg-white py-16 min-h-[60vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-slate-900 mb-8">Delivery Information</h1>
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>At Elitebed.uk, we pride ourselves on a swift and secure delivery service. We offer Free Next-Day Delivery on all orders placed before 2 PM GMT.</p>
          <h2 className="text-2xl font-serif text-slate-900 mt-8 mb-4">How It Works</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Once your order is complete, you will receive an email confirmation.</li>
            <li>On the morning of the delivery, our courier will text you a 2-hour delivery window.</li>
            <li>Our two-person team will carefully carry your new bed or mattress to your room of choice.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
