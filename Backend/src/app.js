import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// import routes

import helthCheckRoute from "./routes/helthCheck.route.js";
import userRegistrationRoute from "./routes/auth.route.js";
import problemRoute from "./routes/problem.route.js";
import executeCodeRoute from "./routes/executeCode.route.js";
import submissionRoute from "./routes/submission.route.js";
import playlistRoute from "./routes/playlist.route.js";
import discussionRoute from "./routes/discussion.routes.js";
import commentRoute from "./routes/comment.routes.js";

app.use("/api/v1/helthcheck", helthCheckRoute);
app.use("/api/v1/auth", userRegistrationRoute);
app.use("/api/v1/problems", problemRoute);
app.use("/api/v1/execute-code", executeCodeRoute);
app.use("/api/v1/submission", submissionRoute);
app.use("/api/v1/playlist", playlistRoute);
app.use("/api/v1/discussion", discussionRoute);
app.use("/api/v1/comment", commentRoute);

app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

export default app;
