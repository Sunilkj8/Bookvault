import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import AniHeart from "../HeartComponent";
import BookPopUp from "../Modals/BookPopUp";
import { Rating } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const BookDetails = () => {
  const { bookName } = useParams();
  const navigate = useNavigate();
  const { selectedBook: selectedBookCtx, inspiringBook, setSelectedBook } =
    useContext(BooksRenderContext);

  const [book, setBook] = useState(selectedBookCtx?.selectedBook || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!book);

  const decodedName = decodeURIComponent(bookName || "");

  // Resolve book by URL param if not in state or mismatched
  useEffect(() => {
    async function resolveBook() {
      // 1. Check if context already has this exact book
      if (
        selectedBookCtx?.selectedBook &&
        selectedBookCtx.selectedBook.book_name?.toLowerCase() ===
          decodedName.toLowerCase()
      ) {
        setBook(selectedBookCtx.selectedBook);
        setLoading(false);
        return;
      }

      // 2. Check if it exists in inspiringBooks memory list
      const inMemory = (inspiringBook?.inspiringBooks || []).find(
        (b) => b.book_name?.toLowerCase() === decodedName.toLowerCase()
      );
      if (inMemory) {
        setBook(inMemory);
        if (setSelectedBook) setSelectedBook(inMemory);
        setLoading(false);
        return;
      }

      // 3. Fetch from API
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/books?search=${encodeURIComponent(decodedName)}`
        );
        if (Array.isArray(res.data) && res.data.length > 0) {
          const matched =
            res.data.find(
              (b) => b.book_name?.toLowerCase() === decodedName.toLowerCase()
            ) || res.data[0];
          setBook(matched);
          if (setSelectedBook) setSelectedBook(matched);
        }
      } catch (err) {
        console.error("Failed to fetch book details:", err);
      } finally {
        setLoading(false);
      }
    }

    resolveBook();
  }, [decodedName, inspiringBook?.inspiringBooks, selectedBookCtx, setSelectedBook]);

  // Load reviews for this book
  useEffect(() => {
    async function getReviews() {
      try {
        const response = await axios.get(`${API_BASE_URL}/getreviews`);
        setReviews(Array.isArray(response.data) ? response.data : []);
      } catch (e) {
        console.error("Failed to load reviews:", e);
      }
    }
    getReviews();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium text-sm">
          Loading book details...
        </p>
      </div>
    );
  }

  if (!book || !book.book_name) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-4">
          📚
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Book Not Found</h2>
        <p className="text-slate-500 text-sm mt-1 max-w-sm">
          We couldn't locate "{decodedName}". It may have been relocated or updated.
        </p>
        <button
          onClick={() => navigate("/books")}
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const pricePerDay = book.price_per_day || 1.5;
  const deposit = book.deposit_amount || 15.0;
  const copies = book.available_copies ?? 5;
  const isAvailable = copies > 0;

  const filteredReviews = reviews.filter(
    (r) => r.book_id === book.id || r.book_id === book.book_id
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-slate-900 transition font-medium"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/books")}
            className="hover:text-slate-900 transition font-medium"
          >
            Catalog
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">
            {book.book_name}
          </span>
        </div>

        {/* Main Book Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Book Cover */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden bg-slate-50 shadow-lg border border-slate-200 p-4 flex items-center justify-center">
              <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur rounded-full p-1 shadow-sm">
                <AniHeart bookName={book.book_name} />
              </div>
              <img
                src={book.book_image}
                alt={book.book_name}
                referrerPolicy="no-referrer"
                className="h-full object-contain drop-shadow-md rounded"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600";
                }}
              />
            </div>

            {/* Availability Badge */}
            <div className="mt-4 text-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {isAvailable
                  ? `${copies} Available in Stock`
                  : "Currently Rented Out"}
              </span>
            </div>
          </div>

          {/* Right Column: Details & Rental Action */}
          <div className="md:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {book.category || "General"}
              </span>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                {book.book_name}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
                by <strong className="text-slate-900">{book.book_author}</strong>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <Rating
                  value={book.star_ratings || 4.5}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-700">
                  {(book.star_ratings || 4.5).toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-slate-400">
                  ({filteredReviews.length} verified reviews)
                </span>
              </div>

              {/* Description */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-2">
                  About this book
                </h3>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {book.book_description ||
                    "An insightful book on principles, practices, and craftsmanship."}
                </p>
              </div>
            </div>

            {/* Rental Rates Callout Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6 mt-4 border border-slate-800">
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Rental Pricing
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-amber-400 font-mono">
                    ${pricePerDay.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">/ day</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                  <span>🛡️</span>
                  <span>
                    Refundable deposit:{" "}
                    <strong className="text-emerald-400">
                      ${deposit.toFixed(2)}
                    </strong>
                  </span>
                </p>
              </div>

              <div>
                <BookPopUp selectedBook={book} />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Customer Reviews
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Feedback from readers who rented this book
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (setSelectedBook) setSelectedBook(book);
                navigate(`/books/${encodeURIComponent(book.book_name)}/write-review`);
              }}
              className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-2"
            >
              <span>✍️</span>
              <span>Write a Review</span>
            </button>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-xs sm:text-sm">
                No reviews yet for this title. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev, index) => (
                <div
                  key={rev.id || index}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs uppercase">
                          {rev.username ? rev.username.slice(0, 2) : "UR"}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {rev.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded-full">
                        Verified Renter
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      {rev.review_headline}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {rev.review_description}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-200/60 pt-2 flex justify-between">
                    <span>Verified Reader</span>
                    <span>★★★★★</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
