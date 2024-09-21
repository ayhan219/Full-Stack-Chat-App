const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "provide all information" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPw,
    });

    await newUser.save();

    return res
      .status(200)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "provide all information" });
    }
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: findUser._id,
        username: findUser.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: true, // Geliştirme sırasında false
        maxAge: 60 * 60 * 1000, // 1 saat
      });
      
    return res
      .status(200)
      .json({ message: "Login successful", user: findUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
router.get("/verify", authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

router.get("/getusers",async(req,res)=>{

  const {userId} = req.query
  
  try {
    const allUser = await User.find({});

    const newAllUser = allUser.filter((user)=>user._id.toString()!==userId)

    return res.status(200).json(newAllUser)
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


module.exports = router;
