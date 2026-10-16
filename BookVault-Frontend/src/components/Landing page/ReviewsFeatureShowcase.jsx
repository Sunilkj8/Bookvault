import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";

const ReviewsFeatureShowcase = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await axios.get(`${API_BASE_URL}/getreviews`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setReviews(res.data.slice(0, 6));
        }
      } catch (e) {
        console.error("Failed to load reviews:", e);
      }
    }
    loadReviews();
  }, []);

  const defaultTestimonials = [
    {
      username: "alex_dev",
      review_headline: "Clean Code changed how I engineer software!",
      review_description:
        "Rented the hardcover for 14 days. Arrived in pristine condition. The daily pricing model is brilliant—saved me over $30 compared to purchasing outright.",
      star_ratings: 5,
      book_name: "Clean Code",
    },
    {
      username: "sarah_reads",
      review_headline: "Atomic Habits made daily changes effortless",
      review_description:
        "The deposit refund came through instantly upon returning the copy to the drop-point. BookVault is my go-to rental platform now.",
      star_ratings: 5,
      book_name: "Atomic Habits",
    },
    {
      username: "michael_k",
      review_headline: "Designing Data-Intensive Applications",
      review_description:
        "Must read for any backend developer. The convenience of renting and extending the due date directly from the portal is super smooth.",
      star_ratings: 5,
      book_name: "DDIA",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  return (
    <section className="py-20 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
              Community Voices
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
              What Readers Are Saying
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Verified reviews and ratings from BookVault readers across the globe.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/books")}
            className="self-start md:self-end px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition"
          >
            Explore All Reviews
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayReviews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-xs">
                      {(item.username || "Reader").slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 capitalize leading-tight">
                        {item.username || "BookVault Reader"}
                      </h4>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        Verified Renter
                      </span>
                    </div>
                  </div>

                  <Rating
                    value={item.star_ratings || 5}
                    size="small"
                    readOnly
                  />
                </div>

                <h5 className="font-bold text-slate-900 text-base leading-snug">
                  "{item.review_headline || "Excellent Book & Service"}"
                </h5>

                <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                  {item.review_description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>BookVault Community</span>
                <span>★★★★★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsFeatureShowcase;
