import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminBorrowedBooks = () => {
  const [usersData, setUsersData] = useState([]);
  const getUsers = async () => {
    const response = await axios.get("http://localhost:3001/getuserinfo");
    // console.log(response.data);
    setUsersData(response.data);
  };
  useEffect(() => {
    getUsers();
  }, []);

  const navigate = useNavigate();
  return (
    <div className=" p-10 bg-white h-auto w-[99vw]  ">
      <div className="text-center text-6xl font-extrabold">Users</div>
      <div className="flex  flex-wrap justify-center items-center gap-10  p-10">
        {usersData.map((elem, idx) => {
          if (elem.id != 10)
            return (
              <div className="border h-auto w-[30vw] flex bg-black text-white rounded-lg   gap-10 items-center justify-between    p-10">
                <div className="flex gap-3 items-center  ">
                  <span className="bg-black rounded-full   text-white p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </span>
                  <span className="text-2xl font-extralight">
                    {elem.username}
                  </span>
                </div>
                <div>
                  <div
                    onClick={() => {
                      navigate(`/adborrowedbooks/${elem.username}`, {
                        state: elem.id,
                      });
                    }}
                    className="p-3 bg-white cursor-pointer rounded-md text-black"
                  >
                    Manage user
                  </div>
                </div>
              </div>
            );
        })}{" "}
      </div>
    </div>
  );
};

export default AdminBorrowedBooks;
