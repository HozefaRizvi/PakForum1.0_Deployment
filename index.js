const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./Routes/auth_routes");
const profileRouter = require("./Routes/profileroutes");
const postRoutes = require("./Routes/Posts_Routes");
const commentroutes = require("./Routes/Comment_routes");
const replyroutes = require("./Routes/Reply_Routes");
const app = express();
const PORT = 3001;
const otproutes = require("./Routes/Otproutes");
require("dotenv").config();
// Middleware
app.use(cors({ origin: true }));
app.use(bodyParser.json());
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
app.use("/api/auth", userRoutes);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentroutes);
app.use("/api/reply", replyroutes);
app.use("/api/otp", otproutes);
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server is running on port ", PORT);
});
