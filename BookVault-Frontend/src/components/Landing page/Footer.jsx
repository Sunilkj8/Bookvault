import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import { toast } from "react-toastify";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const { currCategory, currentBook, inspiringBook, fictionalBook, selfHelpBook, programmingBook, autobiographyBook, sportsBook } =
    useContext(BooksRenderContext);

  const handleCategoryNav = (catName, targetBooks) => {
    if (currCategory?.setCurrCategory) currCategory.setCurrCategory(catName);
    if (currentBook?.setCurrentBooks && targetBooks) {
      currentBook.setCurrentBooks(targetBooks);
    }
    navigate(`/books?category=${encodeURIComponent(catName)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to BookVault newsletter!");
    setEmail("");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md font-bold text-lg">
                📚
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Book<span className="text-emerald-400">Vault</span>
              </span>
            </div>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              BookVault is a next-generation book rental platform providing transparent daily rates, refundable security deposits, and a passionate reading community.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Catalog hydrated with 500+ curated titles</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/books");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  All Books
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/borrowedbooks");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  My Rentals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/favorites");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/aboutus");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/termsandconditions");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-emerald-400 transition"
                >
                  Rental Policy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav("Programming", programmingBook?.programmingBooks)}
                  className="hover:text-emerald-400 transition"
                >
                  Programming & Architecture
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav("Self Help", selfHelpBook?.selfHelpBooks)}
                  className="hover:text-emerald-400 transition"
                >
                  Self Help & Productivity
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav("Fictional", fictionalBook?.fictionalBooks)}
                  className="hover:text-emerald-400 transition"
                >
                  Fiction & Contemporary
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav("Autobiography", autobiographyBook?.autobiographyBooks)}
                  className="hover:text-emerald-400 transition"
                >
                  Biographies & Memoirs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryNav("Sports", sportsBook?.sportsBooks)}
                  className="hover:text-emerald-400 transition"
                >
                  Sports & Peak Performance
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Newsletter & Alerts
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              Subscribe to get notified when coveted programming titles or fiction bestsellers are restocked.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow transition active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} BookVault. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span>🛡️</span> 100% Refundable Deposit Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <span>⚡</span> Fast Checkouts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
