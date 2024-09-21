import React, { useEffect, useState } from "react";

const User = ({findId,item,index}) => {
  return (
    <div key={index} onClick={()=>findId(item._id)}  className="p-5 w-full h-auto text-white flex items-center text-xl font-bold cursor-pointer hover:bg-gray-600 ease-in-out duration-100  ">
      <div className="w-[30%]">
        <img
          className="w-16 h-16 rounded-full"
          src="https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-260nw-2345549599.jpg"
          alt=""
        />
      </div>
      <div>
        <h3>{item.username}</h3>
      </div>
    </div>
  );
};

export default User;
