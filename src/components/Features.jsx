import { Truck, Clock, ShieldCheck, Tag } from 'lucide-react';

const featuresList = [
  { 
    icon: <div className="bg-[#eff4fc] text-[#4285f4] p-[18px] rounded-full mb-4"><Tag strokeWidth={1.5} size={28} /></div>, 
    title: 'Lowest Prices', 
    desc: 'Enjoy the best deals on high-quality beds,\nwith prices that can’t be beaten.' 
  },
  { 
    icon: <div className="bg-[#fff0e5] text-[#fa7b1b] p-[18px] rounded-full mb-4"><Truck strokeWidth={1.5} size={28} /></div>, 
    title: 'Free Delivery', 
    desc: 'Get your bed delivered at no extra cost,\nright to your doorstep.' 
  },
  { 
    icon: <div className="bg-[#e4faed] text-[#34d399] p-[18px] rounded-full mb-4"><Clock strokeWidth={1.5} size={28} /></div>, 
    title: 'Next-Day Delivery', 
    desc: 'Order today and have your bed delivered\nby tomorrow, hassle-free.' 
  },
  { 
    icon: <div className="bg-[#feecec] text-[#f43f5e] p-[18px] rounded-full mb-4"><ShieldCheck strokeWidth={1.5} size={28} /></div>, 
    title: '100% Refund', 
    desc: 'If you’re not satisfied, return your bed\nwithin 30 days for a full refund.' 
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {featuresList.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              {item.icon}
              <h3 className="text-[16px] font-semibold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed max-w-[220px] whitespace-pre-line">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
