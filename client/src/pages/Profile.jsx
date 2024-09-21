import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(user?.avatar);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      const formData = new FormData();
      formData.append("profileImage", file);

      try {
        const response = await axios.post(`http://localhost:5000/api/profile/upload/${user.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image uploaded:", response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-[80vh] bg-gray-100">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-[350px] flex flex-col items-center">
        {/* Profile Image */}
        <div className="mb-4">
          <img
            className="w-32 h-32 rounded-full border-4 border-blue-500 cursor-pointer"
            src={
              profileImage ||
              "https://www.shutterstock.com/image-vector/avatar-photo-default-user-icon-260nw-2345549599.jpg"
            }
            alt="Profile"
            onClick={() => document.getElementById("fileInput").click()} // Click to open file input
          />
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.username || "Username"}</h2>

        <p className="text-gray-600 text-lg">{user?.email || "Email Address"}</p>

        <div className="w-full border-b border-gray-200 my-4"></div>

       
      </div>
    </div>
  );
};

export default Profile;
