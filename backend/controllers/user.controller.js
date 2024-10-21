import { ACCESS_TOKEN, REFRESH_TOKEN, options } from "../constant/api.js";
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { z } from "zod";

async function generateTokens(userId) {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    console.log({ accessToken, refreshToken });
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log({ error });
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
}

const reqSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = reqSchema.parse(req.body);

  const isUserExist = await User.findOne({ $or: [{ username, email }] });

  if (isUserExist) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({ username, email, password });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created"));
});

const loginReqschema = z
  .object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6),
  })
  .refine((data) => !!data.username || !!data.email, {
    message: "Either username or email is required",
  });

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = loginReqschema.parse(req.body);
  // console.log({ username, email, password });

  // step1: check if user exists
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  // step8: if user does not exist else throw error
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // step3: compare password
  const isPasswordValid = await user.matchPassword(password);

  // step7: if password does not match else throw error
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // step5: generate token
  const { accessToken, refreshToken } = await generateTokens(user._id);

  // if user exists
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // step6: send response
  return res
    .status(200)
    .cookie(REFRESH_TOKEN, refreshToken, options)
    .cookie(ACCESS_TOKEN, accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User loggedin successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const reqUser = req.user;

  await User.findByIdAndUpdate(
    reqUser._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie(ACCESS_TOKEN, options)
    .clearCookie(REFRESH_TOKEN, options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // step1: get refresh token
  // step2: verify refresh token
  // step3: get user
  // step4: validate refresh token in db
  // step5: generate new access token
  // step6: send response

  const reqRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!reqRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  try {
    const decodedToken = jwt.verify(
      reqRefreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    if (user.refreshToken !== reqRefreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
      user._id
    );

    return res
      .status(200)
      .cookie(REFRESH_TOKEN, newRefreshToken, options)
      .cookie(ACCESS_TOKEN, accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token.");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findOne({ username: userName }).select(
  //   "-refreshToken"
  // );

  const urls = await URL.find({ owner: req.user._id });

  // if (!user) {
  //   throw new ApiError(400, "User data not found");
  // }
  const dd = { ...reqUser, url: "demo" };

  console.log({ dd });

  return res.status(200).json(new ApiResponse(200, reqUser));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
};
