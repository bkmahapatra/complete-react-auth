import { ApiError } from "./ApiError.js";

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // next(error);
    // res.send(error);
    console.log(error);
    res.send(new ApiError(500, "Internal server error"));
  }
};
