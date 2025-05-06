import { db } from "../libs/db.js";
export const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    const accessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRAT,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_REFESH_SECRAT,
      { expiresIn: "15d" }
    );

    user.refreshToken = refreshToken;
    await db.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Token generate karte waqt error aayi");
  }
};
