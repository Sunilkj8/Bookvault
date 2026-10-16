import React, { useContext, useEffect, useState } from "react";
import BooksChart from "./Charts/BooksChart";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import axios from "axios";
import BookForm from "./BookForm";
import { API_BASE_URL } from "../../config/api";

const AdminHome = () => {
  const { inspiringBook } = useContext(BooksRenderContext);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getMetrics() {
    try {
      setLoading(true);
      const [borrowedRes, usersRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/totalborrowedbooks`),
        axios.get(`${API_BASE_URL}/getuserinfo`),
      ]);

      if (borrowedRes.status === "fulfilled" && Array.isArray(borrowedRes.value.data)) {
        setTotalBorrowedBooks(borrowedRes.value.data);
      }
      if (usersRes.status === "fulfilled" && Array.isArray(usersRes.value.data)) {
        setTotalUsers(usersRes.value.data);
      }
    } catch (e) {
      console.error("Failed to load admin metrics:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMetrics();
  }, []);

  const totalBooksCount = inspiringBook?.inspiringBooks?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-bold">
              📚
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Total Titles in Catalog
              </div>
              <div className="text-3xl font-black text-slate-900 mt-0.5 font-heading">
                {totalBooksCount}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              🔄
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Active Book Loans
              </div>
              <div className="text-3xl font-black text-emerald-600 mt-0.5 font-heading">
                {totalBorrowedBooks.length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl font-bold">
              👥
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Registered Readers
              </div>
              <div className="text-3xl font-black text-slate-900 mt-0.5 font-heading">
                {Math.max(0, totalUsers.length - 1)}
              </div>
            </div>
          </div>
        </div>

        {/* Category Analytics Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Catalog Domain Breakdown
          </h3>
          <div className="flex justify-center items-center py-4 overflow-x-auto">
            <BooksChart />
          </div>
        </div>

        {/* Add New Book Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Add New Volume to Catalog
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Enter title details, category classification, author, and inventory counts.
            </p>
          </div>
          <BookForm />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
