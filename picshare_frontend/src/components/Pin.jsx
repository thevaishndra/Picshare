import React from 'react'
import { urlfor } from '../client'

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination } = pin;
  const imageUrl = image?.asset?.url || "https://via.placeholder.com/250";
  return (
    <div>
      {imageUrl ? (
        <img
          className="rounded-lg w-64 h-64 object-cover"
          alt="user-post"
          src={urlfor(image).width(250).height(250).url()}
        />
      ) : (
        <p>No image found </p>
      )}
    </div>
  );
}

export default Pin