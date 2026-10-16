import React, { useEffect, useState, useCallback, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BorrowedBooks from "./pages/BorrowedBooks";
import { IsLoginClicked } from "./contexts/LoginContext";
import { BooksRenderContext } from "./contexts/BooksRenderContext";
import axios from "axios";
import Admin from "./pages/Admin";
import AdminHome from "./components/AdminPages/AdminHome";
import BookDetails from "./components/BooksPage/BookDetails";
import Favorites from "./pages/Favorites";
import AdminBorrowedBooks from "./components/AdminPages/AdminBorrowedBooks";
import Review from "./components/BooksPage/Review";
import AboutUs from "./pages/AboutUs";
import TermsandCondition from "./pages/TermsandCondition";
import { UsersInfoContext } from "./contexts/UsersInfoContext";
import CurrentUser from "./components/AdminPages/CurrentUser";
import { API_BASE_URL } from "./config/api";

const App = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [fictionalBooks, setFictionalBooks] = useState([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState([]);
  const [autobiographyBooks, setAutoBiographyBooks] = useState([]);
  const [currentBooks, setCurrentBooks] = useState([]);
  const [inspiringBooks, setInspiringBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [programmingBooks, setProgrammingBooks] = useState([]);
  const [currCategory, setCurrCategory] = useState("All");
  const [sportsBooks, setSportsBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loginClickState, setLoginClickState] = useState(false);

  // High performance: Unified single-request catalog hydration
  const loadAllBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch entire catalog in one single roundtrip
      const res = await axios.get(`${API_BASE_URL}/api/books`);
      const allBooks = Array.isArray(res.data) ? res.data : [];

      setInspiringBooks(allBooks);
      setCurrentBooks(allBooks);

      // Distribute categories client-side in memory for 0ms filter lag
      const fictional = [];
      const selfHelp = [];
      const programming = [];
      const autobiography = [];
      const sports = [];
      const favorites = [];

      allBooks.forEach((book) => {
        const cat = (book.category || "").toLowerCase().trim();
        if (cat === "fictional") fictional.push(book);
        else if (cat === "selfhelp") selfHelp.push(book);
        else if (cat === "programming") programming.push(book);
        else if (cat === "autobiography") autobiography.push(book);
        else if (cat === "sports") sports.push(book);

        if (book.isfavourite) favorites.push(book);
      });

      setFictionalBooks(fictional);
      setSelfHelpBooks(selfHelp);
      setProgrammingBooks(programming);
      setAutoBiographyBooks(autobiography);
      setSportsBooks(sports);
      setFavoriteBooks(favorites);
    } catch (e) {
      console.error("Error loading unified catalog:", e);
      // Fallback to legacy inspiringbooks endpoint if needed
      try {
        const legacyRes = await axios.get(`${API_BASE_URL}/inspiringbooks`);
        setInspiringBooks(legacyRes.data || []);
        setCurrentBooks(legacyRes.data || []);
      } catch (err) {
        console.error("Catalog fallback failed:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch active user's borrowed books
  const getUserBorrowedBooks = useCallback(async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/getborrowedbooks`, {
        user_id: user_id,
      });
      setBorrowedBooks(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error loading borrowed books:", e);
    }
  }, []);

  useEffect(() => {
    loadAllBooks();
    if (localStorage.getItem("usertype") !== "admin") {
      getUserBorrowedBooks();
    }
  }, [loadAllBooks, getUserBorrowedBooks]);

  const router = useMemo(
    () =>
      createBrowserRouter([
        localStorage.getItem("usertype") !== "admin"
          ? {
              path: "/",
              element: <RootLayout />,
              children: [
                { index: true, element: <Home /> },
                { path: "/books", element: <Books /> },
                { path: "/books/:bookName", element: <BookDetails /> },
                { path: "/books/:bookName/write-review", element: <Review /> },
                { path: "/borrowedbooks", element: <BorrowedBooks /> },
                { path: "/favorites", element: <Favorites /> },
                { path: "/aboutus", element: <AboutUs /> },
                { path: "/termsandconditions", element: <TermsandCondition /> },
              ],
            }
          : {
              path: "/",
              element: <Admin />,
              children: [
                { index: true, element: <AdminHome /> },
                { path: "adborrowedbooks", element: <AdminBorrowedBooks /> },
                { path: "adborrowedbooks/:username", element: <CurrentUser /> },
              ],
            },
      ]),
    []
  );

  return (
    <UsersInfoContext.Provider value={{}}>
      <BooksRenderContext.Provider
        value={{
          selectedBook: { selectedBook, setSelectedBook },
          fictionalBook: { fictionalBooks, setFictionalBooks },
          selfHelpBook: { selfHelpBooks, setSelfHelpBooks },
          currentBook: { currentBooks, setCurrentBooks },
          inspiringBook: { inspiringBooks, setInspiringBooks },
          borrowedBook: { borrowedBooks, setBorrowedBooks },
          filteredBook: { filteredBooks, setFilteredBooks },
          favoriteBook: { favoriteBooks, setFavoriteBooks },
          programmingBook: { programmingBooks, setProgrammingBooks },
          currCategory: { currCategory, setCurrCategory },
          autobiographyBook: { autobiographyBooks, setAutoBiographyBooks },
          sportsBook: { sportsBooks, setSportsBooks },
          isLoading,
          refreshBooks: loadAllBooks,
          refreshBorrowed: getUserBorrowedBooks,
        }}
      >
        <IsLoginClicked.Provider
          value={{ loginClickState, setLoginClickState }}
        >
          <RouterProvider router={router} />
        </IsLoginClicked.Provider>
      </BooksRenderContext.Provider>
    </UsersInfoContext.Provider>
  );
};

export default App;
