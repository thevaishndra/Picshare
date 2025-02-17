import React, { useState, useEffect } from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState([]);
  const [text, setText] = useState("created"); // Handle both view and active button state

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    const fetchPins = async () => {
      const query =
        text === "created"
          ? userCreatedPinsQuery(userId)
          : userSavedPinsQuery(userId);
      const data = await client.fetch(query);
      setPins(data);
    };
    fetchPins();
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className="rounded-full w-20 h-20 mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>

            {user && user._id === userId && (
              <button
                className="absolute top-2 right-2 bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                onClick={logout}
              >
                <AiOutlineLogout color="red" fontSize={21} />
              </button>
            )}
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={() => setText("created")}
              className={`${
                text === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={() => setText("saved")}
              className={`${
                text === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
          </div>

          <div className="px-2">
            {pins?.length ? (
              <MasonryLayout pins={pins} />
            ) : (
              <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
                No pins found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
