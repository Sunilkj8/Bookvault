import React, { useContext } from "react";
import { BooksRenderContext } from "../contexts/BooksRenderContext";
import { useNavigate } from "react-router-dom";
import AniHeart from "../components/HeartComponent";
import MiniBookPopUp from "../components/Modals/MiniBookPopUp";
import Rating from "@mui/material/Rating";
import Footer from "../components/Landing page/Footer";
import ScrollToTop from "react-scroll-to-top";

const Favorites = () => {
  const navigate = useNavigate();
  const { favoriteBook, setSelectedBook } = useContext(BooksRenderContext);
  const favoriteBooks = favoriteBook?.favoriteBooks || [];

  const handleCardClick = (book) => {
    if (setSelectedBook) setSelectedBook(book);
    navigate(`/books/${encodeURIComponent(book.book_name)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200/60">
            Reading Wishlist
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight flex items-center gap-3">
            <span>My Favorite Reads</span>
            <span className="text-rose-500">❤️</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {favoriteBooks.length} {favoriteBooks.length === 1 ? "book" : "books"} saved for later reading and rentals.
          </p>
        </div>

        {favoriteBooks.length === 0 ? (
          <div className="max-w-md mx-auto my-16 bg-white border border-slate-200/90 rounded-3xl p-10 text-center flex flex-col items-center gap-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-3xl">
              🤍
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No Favorites Saved Yet
            </h3>
            <p className="text-slate-500 text-sm">
              Click the heart icon on any book card across our catalog to bookmark it to your personal wishlist.
            </p>
            <button
              onClick={() => navigate("/books")}
              className="mt-2 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition shadow-xs"
            >
              Browse Book Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteBooks.map((elem, idx) => {
              const pricePerDay = elem.price_per_day || 1.5;
              const copies = elem.available_copies ?? 5;
              const isAvailable = copies > 0;

              return (
                <div
                  key={elem.id || idx}
                  onClick={() => handleCardClick(elem)}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-rose-300 p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
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

                  {/* Book Cover */}
                  <div className="h-52 w-full flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 relative group-hover:scale-[1.02] transition-transform">
                    <img
                      src={elem.book_image}
                      alt={elem.book_name}
                      referrerPolicy="no-referrer"
                      className="h-full max-h-48 object-contain drop-shadow-md rounded"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                  </div>

                  {/* Book Info */}
                  <div className="mt-4 flex flex-col gap-1 flex-1">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-rose-600 transition">
                      {elem.book_name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      by {elem.book_author}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <Rating
                        size="small"
                        value={elem.star_ratings || 4.5}
                        precision={0.5}
                        readOnly
                      />
                      <span className="text-[11px] text-slate-500 font-bold">
                        {(elem.star_ratings || 4.5).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        Rental Rate
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        ${pricePerDay.toFixed(2)}
                        <span className="text-xs font-normal text-slate-500">
                          /day
                        </span>
                      </div>
                    </div>

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
        )}
      </main>

      <ScrollToTop
        smooth
        className="!fixed !bottom-6 !right-6 !w-11 !h-11 !rounded-2xl !bg-slate-900 !text-white !shadow-lg !flex !items-center !justify-center hover:!bg-emerald-600 transition-colors z-40"
      />

      <Footer />
    </div>
  );
};

export default Favorites;
