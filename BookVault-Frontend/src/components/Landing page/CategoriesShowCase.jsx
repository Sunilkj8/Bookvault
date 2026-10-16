import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";

const CategoriesShowCase = () => {
  const navigate = useNavigate();
  const {
    currCategory,
    programmingBook,
    selfHelpBook,
    fictionalBook,
    currentBook,
    autobiographyBook,
    sportsBook,
    inspiringBook,
  } = useContext(BooksRenderContext);

  const categories = [
    {
      id: "Programming",
      title: "Programming & Tech",
      count: programmingBook?.programmingBooks?.length || 0,
      description: "Clean code, distributed systems, algorithms & system architecture.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
      bgGlow: "group-hover:border-indigo-300",
      accent: "bg-indigo-50 text-indigo-700",
      targetBooks: programmingBook?.programmingBooks,
    },
    {
      id: "Self Help",
      title: "Self Help & Growth",
      count: selfHelpBook?.selfHelpBooks?.length || 0,
      description: "Habit formation, deep focus, mindset shifts & productivity mastery.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      bgGlow: "group-hover:border-amber-300",
      accent: "bg-amber-50 text-amber-700",
      targetBooks: selfHelpBook?.selfHelpBooks,
    },
    {
      id: "Fictional",
      title: "Fiction & Novels",
      count: fictionalBook?.fictionalBooks?.length || 0,
      description: "Engaging mysteries, parallel universes, and contemporary tales.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-rose-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      bgGlow: "group-hover:border-rose-300",
      accent: "bg-rose-50 text-rose-700",
      targetBooks: fictionalBook?.fictionalBooks,
    },
    {
      id: "Autobiography",
      title: "Biographies & Memoirs",
      count: autobiographyBook?.autobiographyBooks?.length || 0,
      description: "First-hand accounts from iconic entrepreneurs, athletes & innovators.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-emerald-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      bgGlow: "group-hover:border-emerald-300",
      accent: "bg-emerald-50 text-emerald-700",
      targetBooks: autobiographyBook?.autobiographyBooks,
    },
    {
      id: "Sports",
      title: "Sports & Athletics",
      count: sportsBook?.sportsBooks?.length || 0,
      description: "Championship psychology, training regimens & athletic greatness.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-teal-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
          />
        </svg>
      ),
      bgGlow: "group-hover:border-teal-300",
      accent: "bg-teal-50 text-teal-700",
      targetBooks: sportsBook?.sportsBooks,
    },
  ];

  const handleCategoryClick = (cat) => {
    if (currCategory?.setCurrCategory) {
      currCategory.setCurrCategory(cat.id);
    }
    if (currentBook?.setCurrentBooks && cat.targetBooks) {
      currentBook.setCurrentBooks(cat.targetBooks);
    }
    navigate(`/books?category=${encodeURIComponent(cat.id)}`);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
            Browse by Domain
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
            Curated Genres & Collections
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Select a category to immediately explore targeted recommendations and available copies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`group bg-slate-50/70 hover:bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 ${cat.bgGlow} shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-white shadow-xs border border-slate-100 flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${cat.accent}`}
                  >
                    {cat.count} Books
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
                <span>Explore Books</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}

          {/* Quick All Books Tile */}
          <div
            onClick={() => {
              if (currCategory?.setCurrCategory) currCategory.setCurrCategory("All");
              if (currentBook?.setCurrentBooks && inspiringBook?.inspiringBooks) {
                currentBook.setCurrentBooks(inspiringBook.inspiringBooks);
              }
              navigate("/books");
            }}
            className="group bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between border border-slate-700"
          >
            <div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center p-3 mb-5 group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>

              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                Complete Archive
              </span>

              <h3 className="text-lg font-bold text-white mt-3">
                All Collections
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Browse our entire unified catalog of programming, literature, and self-mastery.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>View All Catalog</span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesShowCase;
