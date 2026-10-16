import React, { useContext, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { BooksRenderContext } from "../../contexts/BooksRenderContext";
import InspiringBook from "./InspiringBook";
import axios from "axios";

function Example(props) {
  const { inspiringBooks, setInspiringBooks } =
    useContext(BooksRenderContext).inspiringBook;

  const [authorInfo, setAuthorInfo] = useState();

  async function getAuthorInfo() {
    const response = await axios.get("http://localhost:3001/authorinfo");
    console.log(response.data);

    setAuthorInfo([response.data]);
  }
  console.log(authorInfo);

  useEffect(() => {
    getAuthorInfo();
  }, []);

  return (
    <div className="h-screen bg-[#FFF6F6] relative bottom-24">
      <Carousel
        className="h-full w-full border   border-none"
        fullHeightHover={false}
        animation="fade"
        duration={500}
        navButtonsAlwaysInvisible={true}
        indicators={false}
      >
        {/* {authorInfo.map((item, i) => (
          <Item key={i} item={item} />
        ))} */}
      </Carousel>
    </div>
  );
}

function Item(props) {
  return (
    <Paper
      sx={{ boxShadow: "none", backgroundColor: "#FBF9F6" }}
      className="h-screen w-full   flex-col flex justify-center px-10 "
    >
      <div className="h-[50%] w-full border-2 flex justify-center ">
        Author name{" "}
      </div>
      <div className="h-full w-full flex gap-5 justify-between">
        <img
          className="h-[80%] w-[25%] rounded-full "
        //   src={props.item[0].author_image}
          alt=""
        />
        <div className="h-[80%]   border w-[80%]">
          <div className="flex gap-10 justify-between px-24">
            {/* <img src={props.item[0].book_image} alt="" />
            <img src={props.item[1].book_image} alt="" /> */}
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default Example;
