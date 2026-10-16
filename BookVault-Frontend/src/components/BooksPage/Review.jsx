import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api";
import Rating from "@mui/material/Rating";

const Review = () => {
  const { bookName } = useParams();
  const navigate = useNavigate();
  const { selectedBook: selectedBookCtx, inspiringBook } =
    useContext(BooksRenderContext);

  const decodedName = decodeURIComponent(bookName || "");
  const [book, setBook] = useState(selectedBookCtx?.selectedBook || null);
  const [starRating, setStarRating] = useState(5);
  const [review, setReview] = useState({
    review_headline: "",
    review_description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!book) {
      const match = (inspiringBook?.inspiringBooks || []).find(
        (b) => b.book_name?.toLowerCase() === decodedName.toLowerCase()
      );
      if (match) setBook(match);
    }
  }, [book, decodedName, inspiringBook?.inspiringBooks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    if (!username) {
      toast.warning("Please sign in to post a review!");
      return;
    }

    if (!review.review_headline.trim() || !review.review_description.trim()) {
      toast.error("Please provide both a headline and a description");
      return;
    }

    setLoading(true);
    try {
      const bookId = book?.id || book?.book_id || 1;
      const res = await axios.post(`${API_BASE_URL}/reviews`, {
        book_id: bookId,
        review_headline: review.review_headline,
        review_description: review.review_description,
        username,
      });

      if (res.data === "User can only write one book review for a particular book") {
        toast.info(res.data);
      } else {
        toast.success("Review published successfully!");
      }

      // Also update rating
      if (book?.book_name) {
        await axios.post(`${API_BASE_URL}/ratinginfo`, {
          rating: starRating,
          book_name: book.book_name,
        });
      }

      navigate(-1);
    } catch (err) {
      console.error("Review submission error:", err);
      toast.error(err.response?.data || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-6 flex items-center gap-1.5"
        >
          <span>←</span> Back to book details
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Write a Verified Review
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Share your reading experience with fellow BookVault members.
        </p>

        {/* Selected Book Banner */}
        {book && (
          <div className="my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-4">
            <img
              src={book.book_image}
              alt=""
              referrerPolicy="no-referrer"
              className="w-14 h-20 object-contain rounded-md shadow-xs bg-white p-1"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {book.category || "Book"}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">
                {book.book_name}
              </h3>
              <p className="text-xs text-slate-500">by {book.book_author}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* Rating */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Overall Rating
            </label>
            <Rating
              value={starRating}
              precision={1}
              size="large"
              onChange={(e, val) => setStarRating(val || 5)}
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Review Headline
            </label>
            <input
              type="text"
              value={review.review_headline}
              onChange={(e) =>
                setReview({ ...review, review_headline: e.target.value })
              }
              placeholder="e.g. Masterclass in software design principles!"
              className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Written Review
            </label>
            <textarea
              rows={5}
              value={review.review_description}
              onChange={(e) =>
                setReview({ ...review, review_description: e.target.value })
              }
              placeholder="What did you think of the concepts, writing style, and readability? Would you recommend it?"
              className="w-full bg-slate-50 text-slate-900 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Publish Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
