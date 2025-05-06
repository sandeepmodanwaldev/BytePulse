import { ApiError } from "../libs/api-error.js";
import { validationResult } from "express-validator";

export const validator = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    return next();
  }

  const extractedError = [];
  error.array().map((err) => extractedError.push({ [err.path]: err.msg }));

  // throw new ApiError(422, "Recivited data is not valid", extractedError);
  res
    .status(422)
    .json(new ApiError(422, "Recivited data is not valid", extractedError));
};
