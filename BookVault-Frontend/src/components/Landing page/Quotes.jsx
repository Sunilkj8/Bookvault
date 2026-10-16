import React from "react";
import openBook from "../../assets/open-book.png";
import openBook1 from "../../assets/open-book (1).png";
import books from "../../assets/books.png";

const Quotes = () => {
  return (
    <div className="w-[99vw] h-[50vh]  mb-10 flex p-10 gap-24 justify-center">
      {" "}
      <div className="w-[40%] bg-[#FDDB32] shadow-2xl rounded-lg gap-2 items-center p-10  flex relative text-black  ">
        <div className="h-[80%] w-1/2 bg-[#FDDB32]  p-10    justify-center      ">
          <img src={openBook} className="h-full w-full   " alt="" />
        </div>
        <div className="h-full w-[80%] flex text-center items-center text-3xl capitalize bg-white rounded-lg shadow-xl hover:shadow-sm duration-200 ease-in-out  font-bold p-5 ">
          Books transport you to other worlds without ever leaving your seat
        </div>
      </div>
      <div className="w-[40%] bg-[white] shadow-2xl rounded-lg gap-2 items-center p-10  flex relative text-black  ">
        <div className="h-full w-[80%] flex text-center items-center text-3xl capitalize bg-black text-white rounded-lg shadow-xl hover:shadow-sm duration-200 ease-in-out  font-bold p-5 ">
          Reading is essential for those who wish to discover themselves
        </div>
        <div className="h-[80%] w-1/2   p-10    justify-center      ">
          <img src={books} className="h-full w-[80%]   " alt="" />
        </div>
      </div>
    </div>
  );
};

export default Quotes;
