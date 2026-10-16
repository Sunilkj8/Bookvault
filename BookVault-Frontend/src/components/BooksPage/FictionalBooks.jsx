import React, { useEffect, useState } from "react";
import classes from "./fictionalBooks.module.css";
import FictionalAccordion from "./fictionalBooksComponents/FictionalAccordion";
import FictionalHeading from "./fictionalBooksComponents/FictionalHeading";
import FictionalBooksRender from "./fictionalBooksComponents/FictionalBooksRender";
import FictionalBooksPopUpDivContainer from "./fictionalBooksComponents/FictionalBooksPopUpDivContainer";
import BorrowBookPopUp from "./fictionalBooksComponents/BorrowBookPopUp";
const FictionalBooks = ({ fictionalBooks }) => {
  const [show, setShow] = useState(false);
  const [popUpDiv, setPopUpDiv] = useState(false);
  const [selectedBook, setSelectedBook] = useState();
  const [borrowBookPopUp, setBorrowBookPopUp] = useState(false);
  // console.log(selectedBook);

  // useEffect(() => {
  //   document.body.style.overflowY = "hidden";
  //   return () => {
  //     document.body.style.overflowY = "scroll";
  //   };
  // }, []);
  return (
    <>
      {/* <FictionalAccordion show={show} setShow={setShow} /> */}
      
        <div className={`h-auto flex items-center justify-center relative   left-[25vw] w-[74%]  `}>
          <div className="h-full w-[95vw] bg-[] text-black rounded-xl flex justify center items-center flex-col py-10 ">
            {/* <FictionalHeading /> */}

            <FictionalBooksRender
              fictionalBooks={fictionalBooks}
              setSelectedBook={setSelectedBook}
              setPopUpDiv={setPopUpDiv}
            />
          </div>
          {/* <div
            className={`${
              popUpDiv ? "blurBG" : "hidden"
            }  h-full w-full  fixed top-0`}
          ></div> */}

          <FictionalBooksPopUpDivContainer
            setPopUpDiv={setPopUpDiv}
            setBorrowBookPopUp={setBorrowBookPopUp}
            selectedBook={selectedBook}
            popUpDiv={popUpDiv}
          />
          {borrowBookPopUp ? (
            <BorrowBookPopUp
              setBorrowBookPopUp={setBorrowBookPopUp}
              selectedBook={selectedBook}
            />
          ) : (
            ""
          )}
        </div>
      
      {/* fictional container */}
    </>
  );
};

export default FictionalBooks;
