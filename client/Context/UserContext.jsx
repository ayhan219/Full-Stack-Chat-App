import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Context oluştur
export const UserContext = createContext();

// Provider bileşenini oluştur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUser, setAllUser] = useState([]);

  const verifyUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/verify", {
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        setUser(response.data.user);
        console.log("User verified:", response.data.user);
        
      } else {
        console.log("No user found in response.");
        setUser(null); // Kullanıcı yoksa state'i null yap
      }
    } catch (error) {
      console.error("Verification error:", error.response ? error.response.data : error.message);
      setUser(null); // Hata durumunda kullanıcıyı çıkart
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getusers",
        { params: { userId: user?.id } }
      );
      console.log(response.data);
      
      
      setAllUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    verifyUser();

  }, []);
  useEffect(() => {
    getUser(); // user state'i değiştiğinde getUser fonksiyonunu çağır
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, allUser, setAllUser }}>
      {children}
    </UserContext.Provider>
  );
};
