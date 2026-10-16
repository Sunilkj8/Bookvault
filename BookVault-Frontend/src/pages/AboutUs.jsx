import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Landing page/Footer";

const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: "📖",
      title: "Democratic Access to Literature",
      desc: "Knowledge should be accessible to all. We provide flexible daily rentals so you never have to purchase expensive textbooks or reference manuals outright.",
    },
    {
      icon: "🛡️",
      title: "100% Refundable Security",
      desc: "Our deposit model protects quality hardcover volumes while ensuring every penny of your security deposit returns to your wallet the minute you check back in.",
    },
    {
      icon: "⚡",
      title: "Instant Digital Workflows",
      desc: "Zero bureaucracy. Discover books with live inventory counts, review verified borrower ratings, and manage due dates effortlessly from any device.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            Our Purpose & Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Empowering Readers, One Page at a Time
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-4 leading-relaxed">
            BookVault is an advanced book rental platform engineered to bridge passionate readers with the world's most influential books.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-xs mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Why We Built BookVault
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mt-4">
                Managing learning materials, tracking due dates, and discovering authentic top-rated works used to involve clunky catalog systems and exorbitant buying fees.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mt-3">
                BookVault reimagines the modern book rental experience: whether you are an engineer studying distributed systems, a student exploring psychology, or a fiction lover diving into modern storytelling, our rental catalog gives you instantaneous access with transparent daily pricing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg text-emerald-400">
                Our Guarantee to Readers
              </h3>
              <ul className="space-y-3 mt-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span>✓</span> High quality, verified physical and digital copies
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Transparent daily pricing starting from $1.50/day
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Automatic refund of deposit upon book return
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span> Community-powered, verified reader reviews
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {v.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Start Exploring Catalog →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
