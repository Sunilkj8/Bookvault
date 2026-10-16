import { Carousel, IconButton } from "@material-tailwind/react";
import { useContext, useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
export function CarouselCustomArrows() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const navigate = useNavigate();
  const { currentBooks, setCurrentBooks } =
    useContext(BooksRenderContext).currentBook;
  const getFeaturedBooks = async () => {
    const res = await axios.get("http://localhost:3001/featuredbooks");
    // console.log(res.data);
    setFeaturedBooks(res.data);
  };

  useEffect(() => {
    getFeaturedBooks();
  }, []);
  return (
    <div className="w-full h-full flex justify-center">
    <Carousel
      loop="true"
      autoplay="true"
      autoplayDelay={"5000"}
      className="  blockElem mt-[10vh] shadow-2xl rounded-2xl bg-[#eaeef44a]  flex max-w-[87vw]   h-screen w-[99vw]"
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="gray"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="square"
              strokeLinejoin="square"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg> */}
          <div className="text-4xl   hover:border-none hover:bg-black duration-150 p-2 ">
            {" "}
            {/* {<BiChevronLeft color="gray" />}{" "} */}
          </div>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          // onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg> */}
          <div className="text-4xl hover:border-none hover:bg-black duration-150 p-2 ">
            {" "}
            {/* {<BiChevronRight color="gray" />}{" "} */}
          </div>
        </IconButton>
      )}
    >
      {featuredBooks.map((elem) => {
        return (
          <div className="flex justify-center items-center h-full w-full ">
            <img
              onClick={() => {
                setCurrentBooks(featuredBooks);
                navigate("/books");
              }}
              src={elem.book_image}
              alt=""
              className=" cursor-pointer shadow-xl h-[80%] rounded-sm"
            />
          </div>
        );
      })}
    </Carousel>
    </div>
  );
}
