import React, { useContext } from "react";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";

const Accordion = ({ getCurrentBooks, activeCategory = "All" }) => {
  const {
    currCategory,
    setCurrCategory,
    fictionalBook,
    selfHelpBook,
    programmingBook,
    autobiographyBook,
    sportsBook,
    inspiringBook,
  } = useContext(BooksRenderContext);

  const categories = [
    { label: "All Titles", id: "All", count: inspiringBook?.inspiringBooks?.length || 0 },
    { label: "Programming", id: "Programming", count: programmingBook?.programmingBooks?.length || 0 },
    { label: "Self Help", id: "Self Help", count: selfHelpBook?.selfHelpBooks?.length || 0 },
    { label: "Fiction", id: "Fictional", count: fictionalBook?.fictionalBooks?.length || 0 },
    { label: "Biographies", id: "Autobiography", count: autobiographyBook?.autobiographyBooks?.length || 0 },
    { label: "Sports", id: "Sports", count: sportsBook?.sportsBooks?.length || 0 },
  ];

  const currentActive = currCategory?.currCategory || activeCategory || "All";

  const handleSelect = (catId) => {
    if (currCategory?.setCurrCategory) {
      currCategory.setCurrCategory(catId);
    }
    if (getCurrentBooks) {
      getCurrentBooks(catId);
    }
  };

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive =
          currentActive.toLowerCase() === cat.id.toLowerCase() ||
          (cat.id === "Fictional" && currentActive.toLowerCase() === "fiction");

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleSelect(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              isActive
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-100"
                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Accordion;
