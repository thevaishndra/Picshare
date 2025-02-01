import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { client, urlfor } from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId))?.length;
  //!! -> returns the value in boolean
  //1, [2, 3, 1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  //4, [2, 3, 1] -> [].length -> 0 -> !0 -> true -> !true -> false

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden
        transition-all duration ease-in-out"
      >
        <img
          className="rounded-lg w-64 h-64 object-cover"
          alt="user-post"
          src={urlfor(image).width(250).height(250).url()}
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex item-center justify">
              <div classname="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`} //dl triggers download
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full
                 flex items-center justify-center text-dark text-xl
                 opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button type="button" className="bg-red-500">
                  Saved
                </button>
              ) : (
                <button type="button" className="bg-red-500 opaccity-70 hover: opacity-100 text-white font-bold 
                px-5 py-1 text-base rounded-3xl hover-shadow-md outlined-none">
                  Save
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin