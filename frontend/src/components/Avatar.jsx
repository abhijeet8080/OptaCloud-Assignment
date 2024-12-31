import React from "react";

const Avatar = ({imageUrl}) => {
  return (
    <>
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img
            src={imageUrl}
            alt="profile"
          />
        </div>
      </div>
    </>
  );
};

export default Avatar;
