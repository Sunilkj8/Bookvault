import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import AniHeart from "../HeartComponent";
import MiniBookPopUp from "../Modals/MiniBookPopUp";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const InspiringBook = () => {
  const navigate = useNavigate();
  const { inspiringBook, setSelectedBook } = useContext(BooksRenderContext);
  const books = inspiringBook?.inspiringBooks || [];

  // Take top 8 featured / high rated books
  const featuredBooks = books.slice(0, 8);

  const handleCardClick = (elem) => {
    if (setSelectedBook) setSelectedBook(elem);
    navigate(`/books/${encodeURIComponent(elem.book_name)}`);
  };

  return (
    <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
              Handpicked Reads
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Featured Books & Community Favorites
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              The highest rated volumes currently checked out and loved by BookVault members.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="self-start md:self-end px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs sm:text-sm font-bold border border-slate-200 shadow-xs hover:shadow transition flex items-center gap-1.5"
          >
            <span>View Full Catalog</span>
            <span>→</span>
          </button>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((elem, idx) => {
            const pricePerDay = elem.price_per_day || 1.5;
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

                  {/* Wishlist & Rent Button */}
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

        {/* Rate & Review Banner Callout */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
              Community Reviews
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
              Share Your Thoughts & Rate Books
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Every review helps fellow readers find their next favourite title. Write ratings, share chapter highlights, and save your must-read wishlist.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/books")}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              Browse & Review
            </button>
            <button
              type="button"
              onClick={() => navigate("/favorites")}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition"
            >
              View My Wishlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspiringBook;
