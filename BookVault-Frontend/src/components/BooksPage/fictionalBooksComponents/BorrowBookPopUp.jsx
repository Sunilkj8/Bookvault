import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config/api";
import { BooksRenderContext } from "../../../contexts/BooksRenderContext";

const BorrowBookPopUp = ({
  setBorrowBookPopUp,
  selectedBook,
  setPopUpState,
  onSuccess,
}) => {
  const [rentalDays, setRentalDays] = useState(14);
  const [customDates, setCustomDates] = useState(false);
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(false);
  const { refreshBooks, refreshBorrowed } = useContext(BooksRenderContext);

  const dailyRate = selectedBook?.price_per_day || 1.5;
  const depositAmount = selectedBook?.deposit_amount || 15.0;
  const availableCopies = selectedBook?.available_copies ?? 5;

  // Handle preset duration select
  const handlePresetDays = (days) => {
    setRentalDays(days);
    setCustomDates(false);
    const start = new Date(issueDate);
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    setReturnDate(end.toISOString().split("T")[0]);
  };

  // Handle date changes
  const handleReturnDateChange = (newReturnDate) => {
    setReturnDate(newReturnDate);
    setCustomDates(true);
    const start = new Date(issueDate);
    const end = new Date(newReturnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      setRentalDays(diffDays);
    }
  };

  const rentalFee = Number((rentalDays * dailyRate).toFixed(2));
  const totalAmount = Number((rentalFee + depositAmount).toFixed(2));

  const userId = localStorage.getItem("user_id");

  async function handleRentBook() {
    if (!userId) {
      toast.error("Please log in to rent this book!");
      return;
    }

    if (rentalDays <= 0 || rentalDays > 90) {
      toast.warning("Rental duration must be between 1 and 90 days.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        selectedBook,
        user_id: userId,
        returnVal: returnDate,
        rentalDays,
      };

      const res = await axios.post(`${API_BASE_URL}/borrowedbooks`, payload);

      if (res.data === "The Book Is Already Borrowed") {
        toast.info("You already have an active rental for this book!");
      } else {
        toast.success(`🎉 Book rented successfully! Return by ${returnDate}.`);
        if (refreshBooks) refreshBooks();
        if (refreshBorrowed) refreshBorrowed();
        if (onSuccess) onSuccess();
        if (setBorrowBookPopUp) setBorrowBookPopUp(false);
        if (setPopUpState) setPopUpState(false);
      }
    } catch (err) {
      console.error("Rental error:", err);
      toast.error(
        err.response?.data?.error ||
          err.response?.data ||
          "Failed to complete rental"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200/90 flex flex-col gap-6 text-slate-800">
      {/* Header with Title and Availability */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div className="flex gap-4 items-center min-w-0">
          {selectedBook?.book_image && (
            <img
              src={selectedBook.book_image}
              alt={selectedBook.book_name}
              referrerPolicy="no-referrer"
              className="w-14 h-20 object-contain rounded-lg shadow-sm border border-slate-200 bg-slate-50 p-1 shrink-0"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Book Rental Checkout
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 line-clamp-2">
              {selectedBook?.book_name || "Book Title"}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              by {selectedBook?.book_author || "Author"}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Available
          </span>
          <div className="text-xs font-bold text-emerald-600">
            {availableCopies > 0
              ? `${availableCopies} in stock`
              : "Out of stock"}
          </div>
        </div>
      </div>

      {/* Rental Duration Options */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Choose Rental Period:
          </label>
          <span className="text-xs text-slate-500 font-medium">
            Daily rate:{" "}
            <strong className="text-slate-900 font-mono">
              ${dailyRate.toFixed(2)}/day
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { days: 3, label: "3 Days" },
            { days: 7, label: "7 Days" },
            { days: 14, label: "14 Days", popular: true },
            { days: 30, label: "30 Days", deal: true },
          ].map((preset) => (
            <button
              key={preset.days}
              type="button"
              onClick={() => handlePresetDays(preset.days)}
              className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all relative ${
                rentalDays === preset.days && !customDates
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {preset.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                  POPULAR
                </span>
              )}
              {preset.deal && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                  SAVER
                </span>
              )}
              <div className="font-bold text-xs">{preset.label}</div>
              <div className="text-[10px] opacity-80 font-mono">
                ${(preset.days * dailyRate).toFixed(2)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Pickers */}
      <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">
            Return Due Date
          </label>
          <input
            type="date"
            value={returnDate}
            min={issueDate}
            onChange={(e) => handleReturnDateChange(e.target.value)}
            className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Pricing Breakdown Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col gap-2.5">
        <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 pb-1.5">
          Rental Cost Breakdown
        </div>
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-slate-300">
            Rental Fee ({rentalDays} days × ${dailyRate.toFixed(2)}):
          </span>
          <span className="font-mono font-bold">${rentalFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs sm:text-sm">
          <span className="text-slate-300 flex items-center gap-1.5">
            Security Deposit:
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800 font-semibold">
              100% Refundable
            </span>
          </span>
          <span className="font-mono font-bold text-emerald-400">
            +${depositAmount.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
          <span className="font-bold text-sm">Total Payable Today:</span>
          <span className="text-2xl font-black text-amber-400 font-mono">
            ${totalAmount.toFixed(2)}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
          ✨ Deposit of ${depositAmount.toFixed(2)} is automatically refunded upon book return.
        </p>
      </div>

      {/* Login notice if guest */}
      {!userId && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl text-center font-medium">
          ⚠️ You must be logged in to confirm book rental.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            if (setBorrowBookPopUp) setBorrowBookPopUp(false);
            if (setPopUpState) setPopUpState(false);
          }}
          className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading || availableCopies <= 0}
          onClick={handleRentBook}
          className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <span>Confirm & Rent</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BorrowBookPopUp;