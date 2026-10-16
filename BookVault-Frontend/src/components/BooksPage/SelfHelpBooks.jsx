import React, { useState } from "react";

const SelfHelpBooks = ({ selfHelpBooks }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {/* // accordion */}{" "}
      <div
        onClick={() => {
          setShow(!show);
        }}
        className="h-[20vh] cursor-pointer accordion-transition  text-6xl font-extrabold tracking-wider text-[#0E345A]   flex   justify-between px-[50px] uppercase rounded-3xl bg-gray-200 items-center text-center w-[95vw] m-auto unselectable "
      >
        Self Help
        <span className="cursor-pointer text-[#F7B324] accordion-transition ">
          {show == true ? "-" : "+"}
        </span>{" "}
      </div>
      {show && (
        <div className="h-auto    flex items-center justify-center ">
          <div className="h-full w-[95vw] bg-[#0E345A] rounded-xl flex justify center items-center flex-col py-10 ">
            <div className="w-1/2   h-auto  flex  flex-col items-center">
              <div className="border-[0.5px] w-[8%] h-0 mt-5 border-[#7C94AD]"></div>
              <div className="text-center mt-5 wixui_rich_text">
                {/* <div className="text-white text-2xl font-medium">
                  This Month's
                </div> */}
                <div className="text-white text-4xl   font-bold uppercase ">
                  {" "}
                  Rise Above Your Challenges{" "}
                </div>
              </div>
              <div className="border-[0.5px] w-[8%] h-0 mt-5 border-[#7C94AD]"></div>{" "}
            </div>

            <div className="  w-auto h-auto mt-7 flex justify-center flex-wrap gap-[40px] px-[20vw] ">
              {selfHelpBooks.map((elem, id) => {
                return (
                  <>
                    <div className=" w-[189px] h-[32vh] relative  border-2 flex items-center justify-center bg-[#F2F2F2]">
                      <img src={elem.book_image} className="h-[80%]" alt="" />
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* fictional container */}
    </>
  );
};

export default SelfHelpBooks;
