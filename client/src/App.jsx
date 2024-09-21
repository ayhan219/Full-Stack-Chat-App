import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { UserProvider } from "../Context/UserContext";
import Chat from "./pages/Chat";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Router>
        <UserProvider>
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </UserProvider>
      </Router>
    </>
  );
}

export default App;
