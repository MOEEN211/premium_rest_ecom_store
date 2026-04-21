import React from 'react';

export default function AnnouncementBar() {
  const message = "🚚 Dream Deals – Get 50% Off on All Beds 🚚";
  // Repeat the message to ensure it fills the screen and scrolls smoothly
  const repeatedMessage = new Array(10).fill(message).join(" \u00A0\u00A0\u00A0\u00A0\u00A0 ");

  return (
    <div className="bg-[#4a9d9c] text-white py-2 overflow-hidden relative z-40 border-b border-[#3b807f]/30">
      <div className="flex whitespace-nowrap pause-marquee">
        <div className="animate-marquee inline-block">
          <span className="text-sm font-bold uppercase tracking-widest px-4">
            {repeatedMessage}
          </span>
          <span className="text-sm font-bold uppercase tracking-widest px-4">
            {repeatedMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
