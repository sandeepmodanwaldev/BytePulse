import jwt from "jsonwebtoken";
import { ApiResponse } from "../libs/api-response.js";
import { ApiError } from "../libs/api-error.js";

export const isLoggedIn = (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json(new ApiError(401, "Token not found"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRAT);

    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", error.message));
  }
};
