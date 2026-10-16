import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { IsLoginClicked } from "../contexts/LoginContext";
import { BooksRenderContext } from "../contexts/BooksRenderContext";
import { getLocalUsername } from "../helperFunctions/localstorage";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sticky, setSticky] = useState(false);
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const username = getLocalUsername();
  const userType = localStorage.getItem("usertype");
  const { setLoginClickState } = useContext(IsLoginClicked);
  const { inspiringBook, borrowedBook, favoriteBook, currentBook, setSelectedBook } =
    useContext(BooksRenderContext);

  const allBooks = inspiringBook?.inspiringBooks || [];
  const borrowedCount = borrowedBook?.borrowedBooks?.length || 0;
  const favoriteCount = favoriteBook?.favoriteBooks?.length || 0;

  // Filter search results in real-time
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return allBooks
      .filter(
        (b) =>
          b.book_name?.toLowerCase().includes(q) ||
          b.book_author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchTerm, allBooks]);

  // Scroll detection for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropDown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowSearchResults(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (currentBook?.setCurrentBooks) {
        const filtered = allBooks.filter((b) =>
          b.book_name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        currentBook.setCurrentBooks(filtered);
      }
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchResults(false);
    }
  };

  const handleSelectBook = (book) => {
    if (setSelectedBook) setSelectedBook(book);
    setShowSearchResults(false);
    setSearchTerm("");
    navigate(`/books/${encodeURIComponent(book.book_name)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("usertype");
    localStorage.removeItem("token");
    setProfileDropDown(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        sticky
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white/70 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10" />
                  <path d="M6 10h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Book<span className="text-emerald-600">Vault</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 -mt-1">
                  Book Rentals
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`
                }
              >
                Catalog
              </NavLink>
              <NavLink
                to="/borrowedbooks"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`
                }
              >
                <span>My Rentals</span>
                {borrowedCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {borrowedCount}
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`
                }
              >
                <span>Favorites</span>
                {favoriteCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </NavLink>
            </nav>
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Search */}
            <div ref={searchRef} className="relative hidden sm:block w-48 md:w-64 lg:w-72">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  placeholder="Search titles, authors..."
                  className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
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
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </form>

              {/* Instant Search Results Dropdown */}
              {showSearchResults && searchTerm.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  {searchResults.length > 0 ? (
                    <>
                      {searchResults.map((book) => (
                        <div
                          key={book.id || book.book_name}
                          onClick={() => handleSelectBook(book)}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img
                            src={book.book_image}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-9 h-12 object-cover rounded-md shadow-sm border border-slate-100 shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {book.book_name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">
                              by {book.book_author}
                            </p>
                            <span className="text-[10px] text-emerald-600 font-semibold uppercase">
                              ${(book.price_per_day || 1.5).toFixed(2)}/day
                            </span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-2.5 text-center text-xs font-bold text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                      >
                        View all results for "{searchTerm}" →
                      </button>
                    </>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching books found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile or Login Button */}
            {username ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropDown(!profileDropDown)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
                  aria-expanded={profileDropDown}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold text-sm flex items-center justify-center shadow-sm uppercase">
                    {username.charAt(0)}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-slate-800 capitalize max-w-[100px] truncate">
                    {username}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      profileDropDown ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropDown && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 capitalize truncate">
                        {username}
                      </p>
                      {userType === "admin" && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropDown(false);
                          navigate("/borrowedbooks");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span>📚</span> My Rentals
                        </span>
                        {borrowedCount > 0 && (
                          <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {borrowedCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropDown(false);
                          navigate("/favorites");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span>❤️</span> Saved Favorites
                        </span>
                        {favoriteCount > 0 && (
                          <span className="bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                            {favoriteCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setProfileDropDown(false);
                          navigate("/books");
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <span>📖</span> Browse All Books
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginClickState(true)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1.5 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search books, authors..."
              className="w-full bg-slate-100 text-sm text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none"
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
          </form>

          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/borrowedbooks"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            <span>My Rentals</span>
            {borrowedCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                {borrowedCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            <span>Favorites</span>
            {favoriteCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                {favoriteCount}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/aboutus"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block px-3 py-2.5 rounded-xl text-sm font-bold ${
                isActive ? "bg-emerald-50 text-emerald-600" : "text-slate-700 hover:bg-slate-50"
              }`
            }
          >
            About Us
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
