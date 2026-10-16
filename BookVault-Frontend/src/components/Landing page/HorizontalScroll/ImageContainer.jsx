import React from "react";

const ImageContainer = ({ imageSource, description }) => {
  return (
    <div className="h-[50vh] p-14 border-2  flex flex-col gap-3   items-center justify-center bg-[black]  w-[20vw]">
      <img src={imageSource} className="w-full rounded-md h-full border-2" alt="" />
      <p className="font-semibold text-center text-base text-white">{description}</p>
    </div>
  );
};

export default ImageContainer;
