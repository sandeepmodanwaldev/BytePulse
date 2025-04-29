import { ApiResponse } from "../libs/api-response";

const helthCheck = (req, res) => {
  res.status(200).json(new ApiResponse(200, "server is running"));
};

export { helthCheck };
