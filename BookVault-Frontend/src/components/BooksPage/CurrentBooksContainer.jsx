import React, { useContext } from "react";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import AniHeart from "../HeartComponent";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MiniBookPopUp from "../Modals/MiniBookPopUp";
import { API_BASE_URL } from "../../config/api";

const CurrentBooksContainer = ({
  booksToRender,
  currentBooks = [],
  border,
  setPopUpState,
}) => {
  const { setSelectedBook } = useContext(BooksRenderContext);
  const navigate = useNavigate();

  const handleCardClick = (elem) => {
    if (setSelectedBook) setSelectedBook(elem);
    navigate(`/books/${encodeURIComponent(elem.book_name)}`);
  };

  const displayedBooks = booksToRender
    ? currentBooks.slice(0, booksToRender)
    : currentBooks;

  if (displayedBooks.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto my-16 bg-white border border-slate-200/80 rounded-3xl p-10 text-center flex flex-col items-center gap-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
          🔍
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          No books found
        </h3>
        <p className="text-slate-500 text-sm max-w-sm">
          We couldn't find any titles matching your selected category or search filters.
        </p>
        <button
          type="button"
          onClick={() => navigate("/books")}
          className="mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Reset Filter to All
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {displayedBooks.map((elem, idx) => {
        const pricePerDay = elem.price_per_day || 1.5;
        const deposit = elem.deposit_amount || 15.0;
        const copies = elem.available_copies ?? 5;
        const isAvailable = copies > 0;

        return (
          <div
            key={elem.id || idx}
            onClick={() => handleCardClick(elem)}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
          >
            {/* Top Badges */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 tracking-wider">
                {elem.category || "General"}
              </span>

              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-600 border border-rose-200"
                }`}
              >
                {isAvailable ? `${copies} in stock` : "Rented Out"}
              </span>
            </div>

            {/* Book Cover Image */}
            <div className="h-52 w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 relative group-hover:scale-[1.02] transition-transform duration-300">
              <img
                src={elem.book_image}
                alt={elem.book_name}
                referrerPolicy="no-referrer"
                className="h-full max-h-48 object-contain drop-shadow-md rounded"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                }}
              />
            </div>

            {/* Book Info */}
            <div className="mt-4 flex flex-col gap-1 flex-1">
              <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition">
                {elem.book_name}
              </h3>
              <p className="text-xs text-slate-500 font-medium truncate">
                by {elem.book_author}
              </p>

              {/* Rating */}
              <div
                className="flex items-center gap-1.5 mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Rating
                  size="small"
                  value={elem.star_ratings || 4.5}
                  precision={0.5}
                  onChange={async (e, newValue) => {
                    if (newValue) {
                      try {
                        await axios.post(`${API_BASE_URL}/ratinginfo`, {
                          rating: newValue,
                          book_name: elem.book_name,
                        });
                      } catch (err) {
                        console.error(err);
                      }
                    }
                  }}
                />
                <span className="text-[11px] text-slate-500 font-bold">
                  {(elem.star_ratings || 4.5).toFixed(1)}
                </span>
              </div>
            </div>

            {/* Rental Pricing Card */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Rental Rate
                </div>
                <div className="text-base font-black text-slate-900 font-mono">
                  ${pricePerDay.toFixed(2)}
                  <span className="text-xs font-normal text-slate-500">/day</span>
                </div>
              </div>

              {/* Heart Wishlist & Rent Button */}
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <AniHeart bookName={elem.book_name} />
                <MiniBookPopUp selectedBook={elem} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrentBooksContainer;
