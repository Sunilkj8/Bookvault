import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Landing page/Footer";

const TermsandCondition = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Flexible Rental Periods & Loan Terms",
      content:
        "The standard loan period ranges from 3 to 90 calendar days depending on your selection at checkout. Borrowers are responsible for returning or renewing materials before the due date. Extensions can be requested directly via your active rentals dashboard subject to title reservation status.",
    },
    {
      title: "2. Security Deposit & 100% Refund Policy",
      content:
        "A refundable security deposit ($15.00 to $25.00 based on title edition) is held during the rental term. Upon check-in and confirmation of physical or digital return, 100% of the deposit amount is immediately credited back to your original payment method.",
    },
    {
      title: "3. Book Care & Condition Standards",
      content:
        "Borrowers agree to maintain borrowed volumes in good condition, reasonable wear and tear excepted. In the event of severe damage (water damage, torn covers, missing pages) or complete loss, the security deposit is used toward title replacement and no additional punitive penalties are levied.",
    },
    {
      title: "4. Account Security & Privacy",
      content:
        "Users are responsible for safeguarding account credentials and monitoring active loan return dates. BookVault adheres to strict privacy principles and never sells personal information or reading records to third parties.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6 flex items-center gap-1.5"
        >
          <span>←</span> Back
        </button>

        <div className="mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            Legal & Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Terms of Service & Rental Guidelines
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Last updated: October 2026 • Effective for all BookVault rentals
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs space-y-8">
          <p className="text-slate-600 text-sm leading-relaxed border-b border-slate-100 pb-6">
            Welcome to BookVault. By renting titles, creating an account, or interacting with our rental catalog, you agree to the transparent rental terms outlined below.
          </p>

          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">
                {sec.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsandCondition;
