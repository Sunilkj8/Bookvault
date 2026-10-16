import React from "react";
import manReading from "../../assets/manReading.avif";
import { motion } from "framer-motion";
import { fadeIn } from "../../helperFunctions/variants";
const AttractingQuote = () => {
  return (
    <>
      <div className="open-sans-font    mt-24    font-bold    h-[80vh] w-full flex justify-center  ">
        <div className="blockElem     max-w-[87vw]  px-5 flex justify-between items-center w-full">
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="     w-[60%]    flex justify-center items-center flex-col  font-semibold gap-5"
          >
            <div className="  text-5xl  ">What Goes Into the Mind,</div>
            <div className="text-5xl">comes out in life</div>
            <div className=" text-center cursor-pointer shadow-lg rounded-lg p-3   text-2xl bg-white">Explore Books</div>
          </motion.div>
          <motion.div>
            <motion.img
              // variants={fadeIn("left", 0.1)}
              // initial="hidden"
              // whileInView={"show"}
              // viewport={{ once: false, amount: 0.2 }}
              src={manReading}
              className="  bg-red-200   w-[100%]"
              alt=""
            />
          </motion.div>{" "}
        </div>
      </div>
    </>
  );
};

export default AttractingQuote;
