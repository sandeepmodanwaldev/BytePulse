import { db } from "../libs/db.js";
import { ApiError } from "./api-error.js";
import jwt from "jsonwebtoken";
export const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return new ApiError(404, "User not found while generating tokens");
    }

    console.log(user.id);

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRAT,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFESH_SECRAT,
      { expiresIn: "15d" }
    );

    console.log("accessToken :", accessToken, "refreshToken :", refreshToken);

    user.refreshToken = refreshToken;
    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Error while generating token", err.message);
  }
};
