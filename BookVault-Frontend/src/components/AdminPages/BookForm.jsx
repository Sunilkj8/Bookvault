import axios from "axios";
import React, { useState } from "react";

const BookForm = () => {
  const [bookData, setBookData] = useState({
    book_name: "",
    book_author: "",
    book_image: "",
    book_description: "",
    category: "",
  });

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Book Data Submitted:", bookData);
    alert("Book data submitted. Check console for submitted values");
    await axios.post("http://localhost:3001/addbooks", bookData);
  };

  return (
    <div className="flex justify-center items-center  h-screen  ">
      <form
        className="flex flex-col gap-6 p-10 bg-white shadow-lg rounded-lg w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-center">Add a New Book</h2>

        <div className="flex flex-col">
          <label htmlFor="book_name" className="font-medium">Book Name</label>
          <input
            className="border bg-white border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            id="book_name"
            name="book_name"
            value={bookData.book_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="book_author" className="font-medium">Book Author</label>
          <input
            className="border bg-white border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            id="book_author"
            name="book_author"
            value={bookData.book_author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="book_image" className="font-medium">Book Image URL</label>
          <input
            className="border bg-white border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="url"
            id="book_image"
            name="book_image"
            value={bookData.book_image}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="book_description" className="font-medium">Book Description</label>
          <textarea
            className="border bg-white border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="book_description"
            name="book_description"
            value={bookData.book_description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category" className="font-medium">Category</label>
          <select
            className="border bg-white border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            id="category"
            name="category"
            value={bookData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="fictional">Fictional</option>
            <option value="self help">Self Help</option>
            <option value="autobiography">Autobiography</option>
            <option value="programming">Programming</option>
            <option value="sports">Sports</option>

          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setBookData({
              book_name: "",
              book_author: "",
              book_image: "",
              book_description: "",
              category: "",
            })}
            className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
