import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use(cors(
//     {
//         origin: "http://localhost:3000",
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"]
//     }
// ));
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

// import routes

import helthCheckRoute from "./routes/helthCheck.route.js";
import userRegistrationRoute from "./routes/auth.route.js";
import problemRoute from "./routes/problem.route.js";
import executeCodeRoute from "./routes/executeCode.route.js";

app.use("/api/v1/execute-code", executeCodeRoute);
app.use("/api/v1/helthcheck", helthCheckRoute);
app.use("/api/v1/auth", userRegistrationRoute);
app.use("/api/v1/problems", problemRoute);

app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

export default app;
