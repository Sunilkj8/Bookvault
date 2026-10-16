import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeSlider = () => {
  const highlights = [
    { icon: "✨", text: "Instant Online Checkouts" },
    { icon: "🛡️", text: "100% Refundable Security Deposits" },
    { icon: "📚", text: "500+ Curated Hardcovers & Paperbacks" },
    { icon: "⚡", text: "Transparent Daily Rates from $1.50/day" },
    { icon: "⭐", text: "Verified Community Reviews & Ratings" },
    { icon: "🔄", text: "Flexible Rental Extensions & Early Returns" },
    { icon: "🎯", text: "Software Engineering, Fiction, Self-Help & Memoirs" },
  ];

  return (
    <div className="py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border-y border-slate-800 shadow-inner overflow-hidden">
      <Marquee speed={45} pauseOnHover gradient={false}>
        <div className="flex items-center gap-10">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 px-4 text-xs sm:text-sm font-semibold tracking-wide text-slate-300"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.text}</span>
              <span className="ml-8 text-emerald-500/60 font-bold">•</span>
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueeSlider;
