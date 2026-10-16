import React from "react";
import BorrowedBooksContainer from "../components/BorrowedBooksPage/BorrowedBooksContainer";
import Footer from "../components/Landing page/Footer";
import ScrollToTop from "react-scroll-to-top";

const BorrowedBooks = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1">
        <BorrowedBooksContainer />
      </main>

      <ScrollToTop
        smooth
        className="!fixed !bottom-6 !right-6 !w-11 !h-11 !rounded-2xl !bg-slate-900 !text-white !shadow-lg !flex !items-center !justify-center hover:!bg-emerald-600 transition-colors z-40"
      />

      <Footer />
    </div>
  );
};

export default BorrowedBooks;
