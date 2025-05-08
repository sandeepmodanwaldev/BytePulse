import jwt from "jsonwebtoken";
import { ApiResponse } from "../libs/api-response.js";
import { ApiError } from "../libs/api-error.js";
import { db } from "../libs/db.js";

export const isLoggedIn = (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json(new ApiError(401, "Token not found"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRAT);

    req.user = decodedToken;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error", error.message));
  }
};

export const ckeckAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res
        .status(403)
        .json(new ApiError(403, "Access denied _ Admin Only"));
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error checking adimn role", error.message));
  }
};
