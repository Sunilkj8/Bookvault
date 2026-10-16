import React, { useContext } from "react";
import { BooksRenderContext } from "../../../contexts/BooksRenderContext";
import { useNavigate } from "react-router-dom";
import AniHeart from "../../HeartComponent";
import MiniBookPopUp from "../../Modals/MiniBookPopUp";
import Rating from "@mui/material/Rating";

const HorizontalScroll = () => {
  const navigate = useNavigate();
  const { inspiringBook, setSelectedBook } = useContext(BooksRenderContext);
  const books = inspiringBook?.inspiringBooks || [];

  // Picks for the spotlight
  const spotlightBooks = books.slice(0, 6);

  const handleBookClick = (book) => {
    if (setSelectedBook) setSelectedBook(book);
    navigate(`/books/${encodeURIComponent(book.book_name)}`);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
              Curator's Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              Essential Reads You Can't Miss
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Transformative titles selected by our master curators for high impact and insight.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="self-start md:self-end px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition"
          >
            Explore Rental Catalog →
          </button>
        </div>

        {/* Horizontal Scrollable Carousel Container */}
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory">
          {spotlightBooks.map((elem, idx) => (
            <div
              key={elem.id || idx}
              onClick={() => handleBookClick(elem)}
              className="snap-start shrink-0 w-72 sm:w-80 bg-slate-50/70 hover:bg-white rounded-3xl p-5 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {elem.category || "Featured"}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    ${(elem.price_per_day || 1.5).toFixed(2)}/day
                  </span>
                </div>

                <div className="h-44 w-full flex items-center justify-center bg-white rounded-2xl p-3 shadow-inner group-hover:scale-[1.02] transition-transform">
                  <img
                    src={elem.book_image}
                    alt={elem.book_name}
                    referrerPolicy="no-referrer"
                    className="h-full object-contain drop-shadow"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-4 line-clamp-2 group-hover:text-emerald-700 transition">
                  {elem.book_name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  by {elem.book_author}
                </p>

                <div className="flex items-center gap-1.5 mt-2">
                  <Rating
                    value={elem.star_ratings || 4.5}
                    size="small"
                    readOnly
                    precision={0.5}
                  />
                  <span className="text-xs font-bold text-slate-600">
                    {(elem.star_ratings || 4.5).toFixed(1)}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <AniHeart bookName={elem.book_name} />
                <MiniBookPopUp selectedBook={elem} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScroll;
