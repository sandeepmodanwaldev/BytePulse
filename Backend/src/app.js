import express, { urlencoded } from "express";
import cors from "cors";

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

// import routes

import helthCheckRoute from "./routes/helthCheck.route";

app.get("api/v1/helthcheck", helthCheckRoute);

app.get("/", (req, res) => {
  res.send("Hello from the backend");
});

export default app;
