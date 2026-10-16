import React, { useContext, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CurrentBooksContainer from "../components/BooksPage/CurrentBooksContainer";
import Accordion from "../components/BooksPage/Accordion";
import { BooksRenderContext } from "../contexts/BooksRenderContext";
import Footer from "../components/Landing page/Footer";
import ScrollToTop from "react-scroll-to-top";

const Books = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get("category");
  const querySearch = searchParams.get("search");

  const [activeCategory, setActiveCategory] = useState(queryCategory || "All");
  const [searchTerm, setSearchTerm] = useState(querySearch || "");
  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);

  const {
    fictionalBook,
    selfHelpBook,
    programmingBook,
    autobiographyBook,
    sportsBook,
    inspiringBook,
    currCategory,
  } = useContext(BooksRenderContext);

  const allBooks = inspiringBook?.inspiringBooks || [];

  // Sync category if query param changes
  useEffect(() => {
    if (queryCategory) {
      setActiveCategory(queryCategory);
      if (currCategory?.setCurrCategory) currCategory.setCurrCategory(queryCategory);
    }
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [queryCategory, querySearch, currCategory]);

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    if (currCategory?.setCurrCategory) currCategory.setCurrCategory(catName);
    const params = new URLSearchParams(searchParams);
    if (catName === "All") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    setSearchParams(params);
  };

  // Filter and sort books based on state
  const filteredAndSortedBooks = useMemo(() => {
    let list = [...allBooks];

    // Filter by Category
    if (activeCategory && activeCategory !== "All") {
      const targetCat = activeCategory.toLowerCase().trim();
      list = list.filter((b) => {
        const cat = (b.category || "").toLowerCase().trim();
        if (targetCat === "fictional" || targetCat === "fiction") {
          return cat === "fictional" || cat === "fiction";
        }
        if (targetCat === "self help" || targetCat === "selfhelp") {
          return cat === "selfhelp" || cat === "self help";
        }
        return cat === targetCat;
      });
    }

    // Filter by search keyword
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.book_name?.toLowerCase().includes(q) ||
          b.book_author?.toLowerCase().includes(q) ||
          b.book_description?.toLowerCase().includes(q)
      );
    }

    // Filter by stock
    if (inStockOnly) {
      list = list.filter((b) => (b.available_copies ?? 0) > 0);
    }

    // Sort
    if (sortBy === "rating") {
      list.sort((a, b) => (b.star_ratings || 0) - (a.star_ratings || 0));
    } else if (sortBy === "price-low") {
      list.sort((a, b) => (a.price_per_day || 0) - (b.price_per_day || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (b.price_per_day || 0) - (a.price_per_day || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.book_name || "").localeCompare(b.book_name || ""));
    }

    return list;
  }, [allBooks, activeCategory, searchTerm, inStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
                BookVault Catalog
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
                {activeCategory === "All" ? "Complete Rental Catalog" : `${activeCategory} Collection`}
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Showing {filteredAndSortedBooks.length} available {filteredAndSortedBooks.length === 1 ? "title" : "titles"}
              </p>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="mb-6">
          <Accordion
            activeCategory={activeCategory}
            getCurrentBooks={handleCategoryChange}
          />
        </div>

        {/* Search & Sort Filters Toolbar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title or author..."
              className="w-full bg-slate-50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
              >
                ×
              </button>
            )}
          </div>

          {/* Controls: In Stock Toggle & Sort */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>In Stock Only</span>
            </label>

            <div className="h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 text-xs font-semibold text-slate-800 rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="default">Default / Featured</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <CurrentBooksContainer currentBooks={filteredAndSortedBooks} />
      </main>

      <ScrollToTop
        smooth
        className="!fixed !bottom-6 !right-6 !w-11 !h-11 !rounded-2xl !bg-slate-900 !text-white !shadow-lg !flex !items-center !justify-center hover:!bg-emerald-600 transition-colors z-40"
      />

      <Footer />
    </div>
  );
};

export default Books;
