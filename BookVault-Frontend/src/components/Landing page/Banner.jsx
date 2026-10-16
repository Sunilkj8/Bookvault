import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Next-Gen Book Rental Vault</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Where Every Book{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                Sparks a Journey
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Access hundreds of premium programming handbooks, inspiring memoirs, bestselling fiction, and self-help classics. Rent with transparent daily rates and 100% refundable deposits.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/books")}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 flex items-center gap-2 active:scale-95"
              >
                <span>Explore Catalog</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => navigate("/borrowedbooks")}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-sm font-bold border border-slate-200 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
              >
                <span>My Active Loans</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                  Rental Portal
                </span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-10 pt-8 border-t border-slate-200/70 grid grid-cols-3 gap-6 sm:gap-10">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  500+
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Curated Volumes
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading">
                  $1.50
                  <span className="text-xs font-normal text-slate-500">/day</span>
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Starting Rent
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  100%
                </div>
                <div className="text-xs font-medium text-slate-500 mt-0.5">
                  Deposit Refund
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Stack */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Background Box */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-slate-700">
              {/* Glass accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-6 border-b border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                    📖
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Featured Today
                    </div>
                    <div className="text-sm font-bold text-white">
                      The Pragmatic Programmer
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  $1.75/day
                </span>
              </div>

              {/* Book Feature Visual */}
              <div className="my-6 flex items-center gap-5 bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1568544997i/48855.jpg"
                  alt="The Pragmatic Programmer"
                  referrerPolicy="no-referrer"
                  className="w-20 h-28 object-cover rounded-xl shadow-md border border-slate-600 bg-slate-700"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <span>★★★★★</span>
                    <span className="text-white text-xs font-bold ml-1">4.9</span>
                  </div>
                  <h3 className="font-bold text-sm text-white mt-1 leading-snug">
                    Your Journey To Mastery (20th Anniv.)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    David Thomas, Andrew Hunt
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <span>✓ In Stock (5 copies)</span>
                  </div>
                </div>
              </div>

              {/* Rental Guarantee Pill */}
              <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span>🛡️</span> Zero Late Fee Guarantee
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition"
                >
                  View Book →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
