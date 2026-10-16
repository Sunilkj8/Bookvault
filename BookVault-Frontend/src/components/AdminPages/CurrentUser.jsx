import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const CurrentUser = () => {
  const [currUserData, setCurrUserData] = useState([]);
  const location = useLocation();
  //   console.log(location.state);
  const user_id = location.state.toString();

  //   console.log(user_id);

  const getUserBorrowedBooks = async () => {
    const response = await axios.post(
      "http://localhost:3001/getborrowedbooks",
      {
        user_id: user_id,
      }
    );
    setCurrUserData(response.data);
  };

  useEffect(() => {
    getUserBorrowedBooks();
  }, []);
  return (
    <div className="flex gap-10 flex-wrap justify-center p-10">
      {currUserData.map((elem) => {
        return (
          <div className="card bg-base-100 w-[28vw] h-[65vh] shadow-xl">
            <figure className="">
              <img src={elem.book_image} alt="Shoes" className="h-[80%]" />
            </figure>
            <div className="card-body bg-white">
              <h2 className="card-title">{elem.book_name}</h2>
              <p className="text-gray-500">{elem.book_author}</p>
              <div className="card-actions justify-between">
                <div
                  onClick={async () => {
                    const res = await axios.post(
                      "http://localhost:3001/removefromborrowedbooks",
                      { book_id: elem.book_id, user_id: elem.user_id }
                    );
                    toast.success(res.data);
                  }}
                  className="bg-black text-white p-2 rounded-md hover:text-neutral-300 duration-150 cursor-pointer"
                >
                  ✔ Mark as Returned
                </div>
                <div className="badge badge-outline">
                  <span> {elem.returnon ? elem.returnon : "no-date"}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CurrentUser;
