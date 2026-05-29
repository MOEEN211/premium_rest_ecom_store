import { Truck, PoundSterling, Tag, Moon, CreditCard, RefreshCcw } from 'lucide-react';

export default function Features() {
  const cards = [
    { 
      icon: <Truck size={20} className="text-black" strokeWidth={2} />, 
      title: "Free delivery", 
      subtitle: "We deliver your bed fast and free, right to your door.",
      desc: "Enjoy hassle-free delivery straight to your home at no extra cost. No hidden fees, no minimum order — just fast, reliable shipping that gets your new bed to you when you need it."
    },
    { 
      icon: <PoundSterling size={20} className="text-black" strokeWidth={2} />, 
      title: "Best price guarantee", 
      subtitle: "We guarantee the lowest prices on every bed we sell.",
      desc: "Found a lower price somewhere else? We'll match it. Our best price guarantee ensures you always get the most competitive deal — so you can buy with confidence knowing you're getting top value."
    },
    { 
      icon: <Tag size={20} className="text-black" strokeWidth={2} />, 
      title: "Exclusive savings", 
      subtitle: "We offer deals and discounts you won't find anywhere else.",
      desc: "Take advantage of exclusive promotions, seasonal sales, and member only offers designed to save you more on every purchase. The more you shop, the more you save — it's that simple."
    },
    { 
      icon: <Moon size={20} className="text-black" strokeWidth={2} />, 
      title: "100 night comfort guarantee", 
      subtitle: "We let you try your mattress risk-free for 100 nights.",
      desc: "Sleep on it and decide. If your mattress isn't the right fit within 100 nights, we'll arrange a hassle-free return or exchange — no questions asked."
    },
    { 
      icon: <RefreshCcw size={20} className="text-black" strokeWidth={2} />, 
      title: "Easy returns", 
      subtitle: "We make returns simple if your bed isn't the right fit.",
      desc: "If your bed or mattress isn't what you expected, our straightforward return policy ensures you shop risk-free and with total peace of mind."
    },
  ];

  return (
    <div className="bg-[#f8f8f8] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-left">
          <p className="text-sm font-semibold text-gray-500 tracking-widest mb-2">Why choose PremiumRest.uk?</p>
          <h2 className="text-3xl md:text-5xl font-bold text-black tracking-tight max-w-3xl leading-tight">
            Better sleep, better value — every night guaranteed.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 flex flex-col items-start text-left shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="mb-6">{c.icon}</div>
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-black mb-3">{c.title}</h3>
              <h4 className="font-bold text-black text-[17px] leading-snug mb-4">{c.subtitle}</h4>
              <p className="text-[13px] text-gray-600 leading-relaxed font-medium">{c.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
