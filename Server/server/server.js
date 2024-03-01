const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bp = require("body-parser");
const { jwtDecode } = require("jwt-decode");

const authenticateToken = require("./middlewares/tokenMiddlewares");
const userSchema = require("./schema/schema");

const secret_key = "RimshaAnwar4Ever";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bp.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://fuzail:spiderman123@cluster0.1ig1y1c.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected To Database"))
  .catch((err) => console.log("Database ran into", err.message));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDb Connection Error:"));
db.once("open", () => console.log("MongoDB connected Successfully"));

const emailFind = async (email) => {
  const user = await userSchema.findOne({ email: email });
  return user;
};

app.post("/createAccount", async (req, res) => {
  console.log(req.body);
  const user = await emailFind(req.body.email);
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    const newUser = userSchema({
      email: req.body.email,
      password: pass,
      role: "User",
    });
    const savedUser = await newUser.save();
    console.log(savedUser);
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, role: savedUser.role },
      secret_key
    );

    res
      .status(200)
      .json({
        Message: "New Account Created on " + newUser.email,
        token: token,
      });
  } else {
    res.status(200).json({ Message: "Email Already in Use" });
  }
});

const passwordCheck = async (enteredPassword, savedPassword) => {
  const bool = await bcrypt.compare(enteredPassword, savedPassword);
  return bool;
};

app.post("/loginAccount", async (req, res) => {
  console.log(req.body, req.cookies);
  const foundUser = await emailFind(req.body.email);
  console.log(foundUser);
  console.log(req.body.password, foundUser.password);
  if (!foundUser) return res.status(200).json({ Message: "No Account Found" });
  else if (await passwordCheck(req.body.password, foundUser.password)) {
    console.log("Password is COrrect");
    var token = jwt.sign(
      { uid: foundUser.id, role: foundUser.role },
      secret_key,
      { expiresIn: "1h" }
    );
    res
      .status(200)
      .cookie("x-jwt-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ Message: "Logged In", role: foundUser.role });
  } else {
    console.log("Password is Incorrect")
    res.status(200).json({ Message: "Incorrect Password" });
  }
});

app.post("/addProduct", authenticateToken, async (req, res) => {
  const token = req.cookies;
  console.log("This is old TOken : ", token["x-jwt-token"]);
  if (req.newToken) {
    console.log("This is NewToken :", req.newToken);
    return res
      .cookie("x-jwt-token", req.newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json("Data Recieved and Token Renewed");
  }
  return res.json({ Message: "Data Recieved" });
});

app.get("/profile", async (req, res) => {
  console.log("Profile Route hit");
  console.log(req.cookies);
  try {
    const decoded = jwtDecode(req.cookies["x-jwt-token"]);
    console.log(decoded);
    res.json({ role: decoded.role });
  } catch (error) {
    res.json({ role: "Guest" });
  }
});

app.post("/logout", (req, res) => {
  console.log("Logout ROute hit");
  res.clearCookie("x-jwt-token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ message: "Logout successful" });
});

app.listen(3000, (err) => {
  if (err) throw err;
  else console.log("Server Running On Port 3000");
});
