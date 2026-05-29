import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TrustSections() {
  const stats = [
    { title: "Selection", stat: "25+ bed styles.", desc: "Choose from top brands and trusted alternatives — all delivered free to your door." },
    { title: "Comfort", stat: "90 night sleep trial.", desc: "Try your mattress risk-free for 90 nights. Not the right fit? We'll arrange a hassle-free return." },
    { title: "Trust", stat: "5000+ happy sleepers.", desc: "Since launching, customers have relied on us for quality beds, transparent pricing, and exceptional service." },
    { title: "Rating", stat: "Top-rated on Trustpilot", desc: "Rated 4.8★ by thousands of verified customers who trust our quality, comfort, and next-day delivery." }
  ];

  const allReviews = [
    { name: "Oliver J.", text: "The bed and mattress ( memory foam spring mattress) quality is great, the customer service was great from the start .." },
    { name: "Sophie M.", text: "Nice quality with fastest delivery, delivery driver was polite and helpful, definitely recommend premiumrest furniture" },
    { name: "Muhammad T.", text: "The Divan bed with mattress I ordered is even better than I expected. The mattress feels as comfortable as a luxury hotel bed" },
    { name: "Chloe B.", text: "I really like the modern headboard design." },
    { name: "Liam K.", text: "The bed looks great in my room and feels very sturdy. I’m really happy with how it turned out." },
    { name: "Amelia R.", text: "Unbeatable value for the premium quality. Will definitely be a returning customer." },
    { name: "Noah S.", text: "I’ll be recommending it to my friends and family too." }
  ];

  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % allReviews.length);
    }, 4500); // Changes text every 4.5 seconds

    return () => clearInterval(interval);
  }, [allReviews.length]);

  return (
    <>
      {/* Dark Stats Block */}
      <section className="bg-[#f8f8f8] py-8 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-[#1b193f] rounded-2xl p-10 md:p-14 text-white shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {stats.map((s, i) => (
                 <div key={i} className="flex flex-col">
                   <span className="text-[11px] uppercase tracking-widest text-[#a8a8b8] mb-2 font-bold">{s.title}</span>
                   <span className="text-2xl font-bold text-white mb-6 tracking-tight">{s.stat}</span>
                   <div className="w-full h-px bg-[#3b3a74] mb-6"></div>
                   <p className="text-[13px] text-[#cfcfd8] font-medium leading-relaxed pr-4">{s.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Reviews Block */}
      <section className="bg-[#f8f8f8] py-16 w-full overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-left">
              <p className="text-sm font-semibold text-gray-500 tracking-widest mb-2">Our Customer reviews</p>
              <h2 className="text-3xl md:text-[42px] font-bold text-black tracking-tight max-w-3xl leading-tight">
                Real stories from sleepers who trust us
              </h2>
            </div>
            
            {/* 
              Render exactly 4 boxes on Desktop, 2 on Tablet, 1 on Mobile. 
              The content cycles through `allReviews` dynamically. 
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-8">
               {[0, 1, 2, 3].map(offset => {
                 const r = allReviews[(startIndex + offset) % allReviews.length];
                 return (
                   <div key={offset} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex justify-center mb-1">
                          {/* Keyting ensures react rerenders the animation if added */}
                          <span key={r.name} className="text-[15px] font-bold text-black animate-fade-in">{r.name}</span>
                        </div>
                        <div className="flex justify-center mb-6">
                          <div className="flex gap-0.5 animate-fade-in">
                             {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="#eab308" color="#eab308" />)}
                          </div>
                        </div>
                        <p key={r.text} className="text-[13px] text-gray-600 leading-relaxed font-medium text-center animate-fade-in">
                          "{r.text}"
                        </p>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>
    </>
  );
}
