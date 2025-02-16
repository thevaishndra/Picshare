import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  // Fetch Pin Details Function
  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  // Add Comment Function
  const addComment = () => {
    if (!comment) return;
    setAddingComment(true);
    const newKey = uuidv4();
    const tempComment = { comment, _key: newKey, postedBy: user };
    setPinDetail((prev) => ({
      ...prev,
      comments: [...(prev?.comments || []), tempComment],
    }));

    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          comment,
          _key: newKey,
          postedBy: { _type: "postedBy", _ref: user._id },
        },
      ])
      .commit()
      .then(() => setComment(""))
      .catch((err) => {
        console.error("Error adding comment:", err);
        setPinDetail((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c._key !== newKey),
        }));
      })
      .finally(() => setAddingComment(false));
  };

  // Delete Comment Function
  const deleteComment = (pinId, commentId) => {
    if (!commentId) return;
    client
      .patch(pinId)
      .unset([`comments[_key=="${commentId}"]`])
      .commit()
      .then(() => {
        setPinDetail((prevPinDetail) => ({
          ...prevPinDetail,
          comments: prevPinDetail.comments.filter(
            (comment) => comment._key !== commentId
          ),
        }));
      })
      .catch((err) => console.error("Error deleting comment:", err));
  };

  if (!pinDetail) return <Spinner message="Loading pin.." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        {/* Image Section */}
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="max-w-full md:max-w-[500px] max-h-[500px] object-contain rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>

        {/* Content Section */}
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <h1 className="text-4xl font-bold break-words mt-3">
            {pinDetail.title}
          </h1>
          <p className="mt-3">{pinDetail.about}</p>

          {/* User Profile Link */}
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={pinDetail.postedBy?.image}
              alt="user-profile"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>

          {/* Comments Section */}
          {pinDetail?.comments?.map((comment, i) => (
            <div
              key={i}
              className="flex justify-between items-center gap-2 mt-5 bg-white rounded-lg p-2"
            >
              <div className="flex gap-2 items-center">
                <img
                  src={comment?.postedBy?.image || "/default-profile.png"}
                  alt="user-profile"
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">
                    {comment?.postedBy?.userName || "Unknown User"}
                  </p>
                  <p>{comment?.comment || "No comment text"}</p>
                </div>
              </div>

              {/* Delete Comment Button */}
              {comment.postedBy?._id === user?._id && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComment(pinId, comment._key);
                  }}
                >
                  <MdDelete />
                </button>
              )}
            </div>
          ))}

          {/* Add Comment Section */}
          <div className="flex flex-wrap mt-6 gap-3">
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Posting the comment..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
};

export default PinDetail;
