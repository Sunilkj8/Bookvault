import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SingleCategory = ({ image, title }) => {
  const [reveal, setReveal] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      onClick={() => {
        navigate("/books");
        setTimeout(() => {
          window.scroll(0, 0);
        }, 500);
      }}
      className="relative h-[55vh] cursor-pointer flex justify-center  rounded-3xl shadow-inner    bg-[#000000d0]   items-center   "
    >
      <motion.div
        animate={{ opacity: reveal ? 0.3 : 0.7 }}
        className="absolute w-full flex justify-center items-center h-full opacity-55  rounded-3xl "
      >
        <img src={image} className="  rounded-3xl  w-[100%] h-[100%]" alt="" />
      </motion.div>{" "}
      <motion.div
        onMouseOver={() => {
          setReveal(true);
        }}
        onMouseOut={() => {
          setReveal(false);
        }}
        animate={{ opacity: reveal ? 1 : 0.5 }}
        className="absolute text-white text-center items-center justify-center flex h-full w-full  text-2xl font-semibold tracking-wide rounded-3xl capitalize"
      >
        {title}
      </motion.div>
    </motion.div>
  );
};

export default SingleCategory;
