import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';

import { Sidebar, UserProfile } from '../components';
import { userQuery } from '../utils/data';
import { client } from '../client';
import Pins from './Pins';
import logo from '../assets/logo.png';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState();
  const scrollRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const userInfo =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  useEffect(() => {
    // Get user data from local storage
    const storedUser = localStorage.getItem("user");
    const userInfo =
      storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

    // Check if user info exists
    if (!userInfo) {
      console.warn("No user info found in localStorage");
      return;
    }

    // Extract userId from info
    const userId = userInfo?.sub;
    if (!userId) {
      console.error("User ID (sub) is missing in userInfo");
      return;
    }

    // Database fetching
    const query = userQuery(userId);

    client
      .fetch(query)
      .then((data) => {
        if (data.length > 0) {
          setUser(data[0]);
        } else {
          console.warn("No user found in database");
        }
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);


  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  });

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="user-pic"
              className="w-9 h-9 rounded-full "
            />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar closeToggle={setToggleSidebar} user={user && user} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />} />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;