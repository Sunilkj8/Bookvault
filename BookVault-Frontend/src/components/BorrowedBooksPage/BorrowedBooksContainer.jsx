import React, { useContext, useState } from "react";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import { IsLoginClicked } from "../../contexts/LoginContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const BorrowedBooksContainer = () => {
  const { borrowedBook, setSelectedBook, refreshBooks } =
    useContext(BooksRenderContext);
  const { setLoginClickState } = useContext(IsLoginClicked);
  const [returningId, setReturningId] = useState(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("user_id");
  const borrowedList = borrowedBook?.borrowedBooks || [];

  const handleReturnBook = async (book) => {
    setReturningId(book.book_id || book.id);
    try {
      const res = await axios.post(`${API_BASE_URL}/removefromborrowedbooks`, {
        book_id: book.book_id || book.id,
        user_id: userId,
        rental_id: book.id,
      });

      toast.success(
        res.data || "Book returned successfully! Deposit refunded."
      );

      // Refresh list
      const updatedRes = await axios.post(`${API_BASE_URL}/getborrowedbooks`, {
        user_id: userId,
      });
      if (borrowedBook?.setBorrowedBooks) {
        borrowedBook.setBorrowedBooks(
          Array.isArray(updatedRes.data) ? updatedRes.data : []
        );
      }

      // Refresh catalog stock
      if (refreshBooks) {
        refreshBooks();
      }
    } catch (err) {
      console.error("Return error:", err);
      toast.error(err.response?.data || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  // Compute metrics
  const totalDepositHeld = borrowedList.reduce(
    (acc, b) => acc + (b.deposit_amount || 15),
    0
  );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200/80 pb-8">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            Rental Management
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            My Active Book Loans
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your borrowed reading copies, upcoming return dates, and refundable deposits.
          </p>
        </div>

        {username && (
          <div className="flex items-center gap-6 bg-white border border-slate-200/90 px-6 py-4 rounded-2xl shadow-xs">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                Active Loans
              </div>
              <div className="text-2xl font-black text-slate-900 font-heading">
                {borrowedList.length}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">
                Total Deposits on Hold
              </div>
              <div className="text-2xl font-black text-emerald-600 font-heading font-mono">
                ${totalDepositHeld.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!username ? (
        <div className="max-w-md mx-auto my-16 bg-white border border-slate-200/90 p-8 rounded-3xl shadow-sm text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
            📖
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Sign In to View Your Rentals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Log in to your BookVault account to monitor rental return dates and request return deposit refunds.
          </p>
          <button
            onClick={() => setLoginClickState(true)}
            className="mt-2 w-full py-3 px-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-xs text-xs sm:text-sm"
          >
            Sign In to BookVault
          </button>
        </div>
      ) : borrowedList.length === 0 ? (
        <div className="max-w-lg mx-auto my-16 bg-white border border-slate-200/90 p-10 rounded-3xl shadow-xs text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl mb-2">
            📚
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            No Active Book Rentals
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
            You don't currently have any books checked out. Explore our collection of programming, fiction, and self-help titles.
          </p>
          <button
            onClick={() => navigate("/books")}
            className="mt-2 py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            Browse Rental Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {borrowedList.map((elem, idx) => {
            const now = new Date();
            const due = elem.due_date
              ? new Date(elem.due_date)
              : elem.returnon
              ? new Date(elem.returnon)
              : null;
            const daysLeft = due
              ? Math.ceil((due - now) / (1000 * 60 * 60 * 24))
              : null;

            const isOverdue = daysLeft !== null && daysLeft < 0;
            const isUrgent =
              daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

            return (
              <div
                key={elem.id || idx}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Book Header Card */}
                <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex items-center gap-4">
                  <img
                    src={elem.book_image}
                    alt={elem.book_name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-28 object-contain rounded-xl shadow-xs border border-white bg-white p-1 shrink-0"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isOverdue ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                          Overdue
                        </span>
                      ) : isUrgent ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Due Soon
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active Loan
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                      {elem.book_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      by {elem.book_author}
                    </p>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="p-6 flex flex-col gap-4 bg-white flex-1 justify-between">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium text-[11px]">
                        Return Due Date
                      </span>
                      <span className="text-slate-900 font-bold text-xs block mt-0.5">
                        {elem.returnon || "N/A"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium text-[11px]">
                        Remaining Time
                      </span>
                      <span
                        className={`font-black text-xs block mt-0.5 ${
                          isOverdue
                            ? "text-rose-600"
                            : isUrgent
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {daysLeft !== null
                          ? isOverdue
                            ? `${Math.abs(daysLeft)}d overdue`
                            : `${daysLeft} days left`
                          : "Active"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium text-[11px]">
                        Daily Rate
                      </span>
                      <span className="text-slate-900 font-bold block mt-0.5 font-mono">
                        ${(elem.daily_rate || 1.5).toFixed(2)}/day
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block font-medium text-[11px]">
                        Security Deposit
                      </span>
                      <span className="text-emerald-700 font-bold block mt-0.5 font-mono">
                        ${(elem.deposit_amount || 15).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span>🛡️</span>
                    <span>
                      Deposit of{" "}
                      <strong>
                        ${(elem.deposit_amount || 15).toFixed(2)}
                      </strong>{" "}
                      will be immediately credited upon return.
                    </span>
                  </div>

                  {/* Return Action */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (setSelectedBook) setSelectedBook(elem);
                        navigate(`/books/${encodeURIComponent(elem.book_name)}`);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-900 font-bold transition"
                    >
                      Book Details →
                    </button>

                    <button
                      type="button"
                      disabled={returningId === (elem.book_id || elem.id)}
                      onClick={() => handleReturnBook(elem)}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50"
                    >
                      {returningId === (elem.book_id || elem.id) ? (
                        "Processing..."
                      ) : (
                        <>
                          <span>✓ Return Book</span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            (+${(elem.deposit_amount || 15).toFixed(2)})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksContainer;
