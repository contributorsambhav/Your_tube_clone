import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import videoroutes from "./Routes/video.js";
import userroutes from "./Routes/User.js";
import path from "path";
import commentroutes from "./Routes/comment.js";
import translateroutes from "./Routes/translate.js";
dotenv.config();
const app = express();

app.use(
  cors({
    // origin: "https://nullclassfirstproject.netlify.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static(path.join("uploads")));

app.get("/", (req, res) => {
  res.send("Your tube is working");
});

app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/comment", commentroutes);
app.use("/translate", translateroutes);

const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DB_URL;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Mongodb Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on Port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
