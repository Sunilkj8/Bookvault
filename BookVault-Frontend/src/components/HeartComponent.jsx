import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { BooksRenderContext } from "../contexts/BooksRenderContext";

export default function AniHeart({ bookName, className = "" }) {
  const [isFav, setIsFav] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { inspiringBook, favoriteBook } = useContext(BooksRenderContext);
  const inspiringBooks = inspiringBook?.inspiringBooks || [];

  useEffect(() => {
    if (!bookName) return;
    const match = inspiringBooks.find((b) => b.book_name === bookName);
    if (match && match.isfavourite) {
      setIsFav(true);
    }
  }, [bookName, inspiringBooks]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const nextState = !isFav;
    setIsFav(nextState);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    try {
      await axios.post(`${API_BASE_URL}/favoriteinfo`, {
        bookName,
        isFavorite: nextState,
      });

      // Update in inspiringBooks state
      if (inspiringBook?.setInspiringBooks) {
        inspiringBook.setInspiringBooks((prev) =>
          prev.map((b) =>
            b.book_name === bookName ? { ...b, isfavourite: nextState } : b
          )
        );
      }

      // Refresh favoriteBooks list
      if (favoriteBook?.setFavoriteBooks) {
        const favRes = await axios.get(`${API_BASE_URL}/getfavoritebooks`);
        favoriteBook.setFavoriteBooks(favRes.data);
      }
    } catch (err) {
      console.error("Failed to update favorite:", err);
      // Revert on failure
      setIsFav(!nextState);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      title={isFav ? "Remove from favorites" : "Add to favorites"}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
      className={`p-2 rounded-full transition-all duration-200 hover:bg-rose-50 flex items-center justify-center ${
        animating ? "scale-125" : "scale-100 hover:scale-110"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFav ? "#F43F5E" : "none"}
        stroke={isFav ? "#F43F5E" : "#94A3B8"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 transition-colors duration-200"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
