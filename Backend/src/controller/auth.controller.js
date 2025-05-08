import { ApiError } from "../libs/api-error.js";
import { ApiResponse } from "../libs/api-response.js";
import bcrypt, { compare } from "bcryptjs";

import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import {
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
  sendMail,
} from "../libs/mail.js";
import crypto from "crypto";
import { generateAccessAndRefereshTokens } from "../libs/generate-access-and-referesh-tokens.js";

export const registration = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json(new ApiError(400, "User already exits with this email"));
    }
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailTokenExpiry = new Date(Date.now() + 1000 * 60 * 120);

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashPassword,
        emailVerificationToken,
        emailTokenExpiry,
      },
    });

    if (!newUser) {
      res
        .status(400)
        .json(new ApiResponse(400, null, " User Registration Error"));
    }
    const emailUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${emailVerificationToken}`;
    const mailGenContent = emailVerificationMailGenContent(username, emailUrl);
    await sendMail({ email, subject: "Verify your email", mailGenContent });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newUser,
          " User Registration Success Please verify your email"
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiError(
          error.status || 400,
          "User Registration Error",
          error.message
        )
      );
  }
};
export const verifyEmail = async (req, res) => {
  const { emailVerificationToken } = req.params;
  try {
    const user = await db.user.findFirst({
      where: {
        emailVerificationToken,
        emailTokenExpiry: {
          gt: new Date(), // token expiry must be in the future
        },
      },
    });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerificationToken: null,
        emailTokenExpiry: null,
        isEmailVerification: true,
      },
    });
    if (!updatedUser) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Email not verified successfully Please try again")
        );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Email verified successfully"));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiError(error.status || 400, "verifyEmail Error", error.message)
      );
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalide Email or Password "));
    }

    if (!user.isEmailVerification) {
      return res
        .status(403)
        .json(new ApiError(403, "Verify your email first "));
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalide Email or Password"));
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRAT,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_REFESH_SECRAT,
      {
        expiresIn: "15d",
      }
    );

    const updateduser = await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    const cookieOptins = {
      httpOnly: true,
      // secure: true,
      sameSite: "Strict",
    };
    res.cookie("accessToken", accessToken, cookieOptins);
    res.cookie("refreshToken", refreshToken, cookieOptins);

    res.status(200).json(new ApiResponse(200, updateduser, "Login successful"));
  } catch (error) {
    res.status(500).json(new ApiError(500, "login error", error.message));
  }
};

export const profile = async (req, res) => {
  try {
    console.log(req.user.id);

    const user = await db.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isEmailVerification: true,
        avatar: true,
      },
    });
    if (!user) {
      return res.status(400).json(new ApiError(400, "user not found "));
    }
    res.status(200).json(new ApiResponse(200, user));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "fetch profile error ", error.message));
  }
};

export const logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      // secure: true,
      sameSite: "Strict",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error logging out user", error.message));
  }
};

export const forgotPassword = async (req, res) => {
  //   User submits email.
  //  System sends a reset token/link to that email.
  //  User clicks link, goes to frontend reset form.
  // User enters new password, system verifies token and resets the password.

  const { email } = req.body;
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found "));
    }
    const forgotToken = crypto.randomBytes(32).toString("hex");
    const forgotExpiry = new Date(Date.now() + 1000 * 60 * 60);

    await db.user.update({
      where: { email },
      data: {
        forgotPasswordToken: forgotToken,
        forgotPasswordExpiry: forgotExpiry,
      },
    });

    const forgotPasswordUrl = `${process.env.BASE_URL}/api/v1/auth/forgot-password/${forgotToken}`;
    console.log(forgotPasswordUrl);

    const mailGenContent = forgotPasswordMailGenContent(
      user.username,
      forgotPasswordUrl
    );
    await sendMail({
      email,
      subject: "Forgot your password ",
      mailGenContent,
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "Reset link sent to email"));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(500, "Error sending forgot password emial", error.message)
      );
  }
};

export const resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  console.log(token);

  try {
    const user = await db.user.findFirst({
      where: {
        forgotPasswordToken: token,
        forgotPasswordExpiry: {
          gt: new Date(),
        },
      },
    });

    // console.log("email is ", user.email);

    if (!user) {
      return res.status(400).json(new ApiError(400, "Link invalid"));
    }
    const newHashPassword = await bcrypt.hash(newPassword, 15);

    const updateuser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newHashPassword,
        forgotPasswordToken: null,
        forgotPasswordExpiry: null,
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, updateuser, "Password reset successful"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error resetting password", error.message));
  }
};

export const refeshToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json(new ApiError(401, "unauthorized request"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFESH_SECRAT
    );

    const user = await db.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalide refresh token "));
    }

    // console.log("User Refresh Token", user.refreshToken);
    // console.log("Refesh Token", incomingRefreshToken);

    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json(new ApiError(401, "Refresh token is expire or user"));
    }

    const cookieOptins = {
      httpOnly: true,
      // secure: true,
      sameSite: "Strict",
    };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user.id
    );

    res.cookie("accessToken", accessToken, cookieOptins);
    res.cookie("refreshToken", refreshToken, cookieOptins);

    res.status(200).json(new ApiResponse(200, null, "Access token Refresh"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Error Access token Refresh ", error.message));
  }
};
