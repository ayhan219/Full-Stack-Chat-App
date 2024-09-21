import React, { useContext, useEffect, useState, useRef } from "react";
import User from "../components/User";
import { io } from "socket.io-client";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:8900");

const Chat = () => {
  const [chatUser, setChatUser] = useState([]);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [holdReceiverId, setHoldReceiverId] = useState(null);
  const { user, allUser, setAllUser } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState([]);
  const navigate = useNavigate();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    
    if (user) {
      socket.emit("addUser", user.id);

      socket.on("getUsers", (users) => {
        setChatUser(users);
      });

      socket.on("getMessage", (data) => {
        setMessageList((list) => [...list, data]);
      });
    }
    
  }, [user]);

  useEffect(() => {
    // Mesaj listesi güncellendiğinde en sona kaydır
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (message !== "" && holdReceiverId) {
      const messageData = {
        senderId: user?.id,
        receiverId: holdReceiverId,
        message,
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/message",
          messageData
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      socket.emit("sendMessage", messageData);

      // Mesajı kendi listeme ekle (gönderdiğim mesaj)
      setMessageList((list) => [...list, messageData]);
      setMessage("");
    }
  };

  const getMessages = async () => {
    
    try {
      const response = await axios.get(
        `http://localhost:5000/api/message/${user.id}/${holdReceiverId}`
      );
      setMessageList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (holdReceiverId) {
      getMessages();
    }
  }, [holdReceiverId]);

  const findId = (id) => {
    setHoldReceiverId(id);

    const findUser = allUser.filter((user) => user._id === id);

    setUserProfile(findUser);
  };

  return (
    <div className="w-full h-[92vh] bg-gray-100 flex">
      {/* Sidebar for user list */}
      <div className="w-[25%] h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="text-center py-6 border-b border-gray-700">
          <h2 className="text-sm sm:text-2xl font-bold tracking-wide">Active Users</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-80px)]  md:px-4 py-2 space-y-4 z-0">
          {allUser.map((item, index) => (
            <div
              key={index}
              onClick={() => findId(item._id)}
              className="flex items-center p-3 space-x-3 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition transform hover:scale-[1.02] hover:shadow-lg z-0"
            >
              <img
                src={item.profileImage !==null ? `http://localhost:5000${item.profileImage}` : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EADAQAQACAQIFAgQGAQUAAAAAAAABAgMEEQUSITFRQWETImJxIzJCUoGx8DM0csHR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwD6YA0yAAAAAAAADNYm08tazafEJGPQ6i/6eWPqkEYT44Zk9clY/gtwzJEfLkrM+NgQBvlxXw25clZifdoAAAAAAAAAAAAAAAAAAAnaTQWy/Pl6U9K+s/8AjHDtN8W/xLx8lZ7eZXCarniw48UbY6xDoCKAA46rDXPimltvafEqXJp8tJnmx328xV6AXUeaFvrdFGSvPijbJHp5VHb02WAAIAAAAAAAAAAAAMxEzO0d57MO2jpz6rHHpv1BdafFGLDSkekdfd1BloAAAAAAUvEsXwtRzVj5bxv/ACulbxmPw8dvfZYlVgywqAAAAAAAAAAAACXwyN9VHtEoiXwv/dx9pFXQDKgAAAAACv4v/o0/5LBX8Yn8KkfUsSqthlhUAAAAAAAAAAAAEjh+8aukxEzHaenZHW/CqxGmmY7zadyrE4BlQAAAAABW8Y3mMcbTt3mduyya3rFq2raN4mOpB51gGmQAAAAAAAAAAABbcItvhvXxbdUpXD88Yc+1p2paNp+5Vi7COwyoAAAAAA0zW5Md7eKy3QOJ54rinFH5rdJ+xBUgNMgAAAAAAAAAAAACi24TfmwWp+2f7T1NwvLFNRyz0i8bfzC5ZrQAgAAAA0y3+Hjtef0xMvPd1vxTJyaeaRPW/T+FQ1ErAAgAAAAAAAAAAAAADMTtMTE9Y6rnRauM9IrafxI7x5UqXwyN9XHTtWUqxdAIoAA1yXrjrNrTtENkbiMb6PJt7f2Cp1OedRlm8/ljpWPZyY9xpAAQAAAAAAAAAAAAAATuERvqL2+j/tB8+y14TimuKck/r7fYqxPZBlQAGJctXHNpssfRLsxaN4mJ7A82N8uO2LJalu9WjTIAAAAAAAAAAAAB/myqEbzO0dZ8Jen0OXLtNo5K+/dZ6fSYcERy13t+6e6WmK/SaC+SYtm3rWOsRPeVtWIrWIiNohkZUAAAAABF1mkrqNpjpeO0qjLhyYbbZKzHjw9C1vSt68t6xaPEro84LPU8OiZ5sE7fTb1V+XFfFPLkrNZ91TGgCgAiAAAADLfDiyZ7cuKN/MrTTaDHi2tf57+fSCqgafRZc/Xbkp5lZ6fR4sPaOa37p7pImqAIAAAAAAAAAADW9KXrtesWj3bAKzUcN72wW2+mVfelsduXJWYn3ejcsuGmau2SsSuo8+Jmq0F8W9sfz09d+8IceVQAAddNgtnyfDr09Zt7OS54ZhjHp4tP5r9d/b0KsSMGGmGkVxxtH9ugMqAAAAAAAAAAAAAAAAAAKziGjiItmxR72qs2LRvG09gecYdtXi+BqbU9O8fZyaR//9k="}
                alt="User Avatar"
                className="w-6 h-6 md:w-12 md:h-12 rounded-full border-2 border-gray-600"
              />
              <div className="flex flex-col">
                <h3 className="text-sm md:text-lg font-semibold">{item.username}</h3>
                <p className="text-gray-400 text-sm">
                  {item.status || "Online"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-[75%] h-full flex flex-col">
        {/* Chat header with user info */}
        {
          userProfile.length <= 0 ? <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center p-10 bg-gray-900 bg-opacity-70 rounded-lg shadow-lg">
            <h1 className="font-bold text-4xl mb-4">Select User for Chat</h1>
            <p className="text-lg font-medium text-gray-300">Choose a user from the list to start a conversation</p>
            <div className="w-16 h-1 bg-blue-500 rounded-full mt-4"></div>
          </div>
        </div>
         : <>
          <div className="w-full h-28 bg-gray-800 flex items-center px-5 gap-4 shadow-lg">
          <img
            className="w-16 h-16 rounded-full border-2 border-gray-700"
            src={userProfile[0]?.profileImage !==null ? `http://localhost:5000${userProfile[0]?.profileImage}` : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAgMGB//EADAQAQACAQIFAgQGAQUAAAAAAAABAgMEEQUSITFRQWETImJxIzJCUoGx8DM0csHR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwD6YA0yAAAAAAAADNYm08tazafEJGPQ6i/6eWPqkEYT44Zk9clY/gtwzJEfLkrM+NgQBvlxXw25clZifdoAAAAAAAAAAAAAAAAAAAnaTQWy/Pl6U9K+s/8AjHDtN8W/xLx8lZ7eZXCarniw48UbY6xDoCKAA46rDXPimltvafEqXJp8tJnmx328xV6AXUeaFvrdFGSvPijbJHp5VHb02WAAIAAAAAAAAAAAAMxEzO0d57MO2jpz6rHHpv1BdafFGLDSkekdfd1BloAAAAAAUvEsXwtRzVj5bxv/ACulbxmPw8dvfZYlVgywqAAAAAAAAAAAACXwyN9VHtEoiXwv/dx9pFXQDKgAAAAACv4v/o0/5LBX8Yn8KkfUsSqthlhUAAAAAAAAAAAAEjh+8aukxEzHaenZHW/CqxGmmY7zadyrE4BlQAAAAABW8Y3mMcbTt3mduyya3rFq2raN4mOpB51gGmQAAAAAAAAAAABbcItvhvXxbdUpXD88Yc+1p2paNp+5Vi7COwyoAAAAAA0zW5Md7eKy3QOJ54rinFH5rdJ+xBUgNMgAAAAAAAAAAAACi24TfmwWp+2f7T1NwvLFNRyz0i8bfzC5ZrQAgAAAA0y3+Hjtef0xMvPd1vxTJyaeaRPW/T+FQ1ErAAgAAAAAAAAAAAAADMTtMTE9Y6rnRauM9IrafxI7x5UqXwyN9XHTtWUqxdAIoAA1yXrjrNrTtENkbiMb6PJt7f2Cp1OedRlm8/ljpWPZyY9xpAAQAAAAAAAAAAAAAATuERvqL2+j/tB8+y14TimuKck/r7fYqxPZBlQAGJctXHNpssfRLsxaN4mJ7A82N8uO2LJalu9WjTIAAAAAAAAAAAAB/myqEbzO0dZ8Jen0OXLtNo5K+/dZ6fSYcERy13t+6e6WmK/SaC+SYtm3rWOsRPeVtWIrWIiNohkZUAAAAABF1mkrqNpjpeO0qjLhyYbbZKzHjw9C1vSt68t6xaPEro84LPU8OiZ5sE7fTb1V+XFfFPLkrNZ91TGgCgAiAAAADLfDiyZ7cuKN/MrTTaDHi2tf57+fSCqgafRZc/Xbkp5lZ6fR4sPaOa37p7pImqAIAAAAAAAAAADW9KXrtesWj3bAKzUcN72wW2+mVfelsduXJWYn3ejcsuGmau2SsSuo8+Jmq0F8W9sfz09d+8IceVQAAddNgtnyfDr09Zt7OS54ZhjHp4tP5r9d/b0KsSMGGmGkVxxtH9ugMqAAAAAAAAAAAAAAAAAAKziGjiItmxR72qs2LRvG09gecYdtXi+BqbU9O8fZyaR//9k="}
            alt="User Avatar"
          />
          <h4 className="text-white text-3xl font-semibold">
            {userProfile[0]?.username}
          </h4>
        </div>

        {/* Chat messages section */}
        <div className="flex-1 bg-gray-300 p-6 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.senderId === user?.id
                    ? "self-end bg-blue-600 text-white p-4 rounded-lg shadow-md max-w-xs"
                    : "self-start bg-white text-gray-800 p-4 rounded-lg shadow-md max-w-xs"
                }
              >
                {msg.message}
              </div>
            ))}
            {/* Scroll hedefi */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input field for messages */}
        <div className="bg-gray-300 p-4 shadow-lg flex items-center gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
          </>
        }
      </div>
    </div>
  );
};

export default Chat;
