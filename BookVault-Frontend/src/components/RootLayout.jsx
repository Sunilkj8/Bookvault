import React, { useContext } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import LoginModal from "./Modals/LoginModal";
import { IsLoginClicked } from "../contexts/LoginContext";
import { BooksRenderContext } from "../contexts/BooksRenderContext";

const RootLayout = () => {
  const { inspiringBooks, setInspiringBooks } =
    useContext(BooksRenderContext).inspiringBook;
  // const { filteredBooks, setFilteredBooks } =
  //   useContext(BooksRenderContext).filteredBook;
  const { currentBooks, setCurrentBooks } =
    useContext(BooksRenderContext).currentBook;
  const { loginClickState, setLoginClickState } = useContext(IsLoginClicked);
  return (
    <>
    
        <Navbar
          inspiringBooks={inspiringBooks}
          setInspiringBooks={setInspiringBooks}
          setCurrentBooks={setCurrentBooks}
        />

        {loginClickState && <LoginModal />}
        <Outlet />
      
    </>
  );
};

export default RootLayout;
