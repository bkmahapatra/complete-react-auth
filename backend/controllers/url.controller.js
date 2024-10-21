import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { URL } from "../model/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { customAlphabet } from "nanoid";
import { ApiResponse } from "../utils/ApiResponse.js";

const shortenSchema = z.object({
  url: z.string(),
  customAlias: z.string().optional(),
});

const shortenUrl = asyncHandler(async (req, res) => {
  const reqUser = req.user;
  const reqBody = req.body;

  const { url, customAlias } = shortenSchema.parse(reqBody);

  const isUrlExist = await URL.findOne({
    originalUrl: url,
    owner: reqUser._id,
  });

  if (isUrlExist) {
    throw new ApiError(404, "Url already exists");
  }

  //   const nanoid = customAlphabet(
  //     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ1234567890",
  //     10
  //   );
  //   const uniqueUrlId = nanoid();

  //   const shortUrl = `${process.env.BASE_URL}/${uniqueUrlId}`;

  //   const shortUrlRes = await URL.create({
  //     originalUrl: url,
  //     shortUrl: shortUrl,
  //     urlCode: uniqueUrlId,
  //     customAlias: customAlias || "",
  //     owner: reqUser._id,
  //   });

  const urlRes = new URL({
    originalUrl: url,
    customAlias: customAlias || "",
    owner: reqUser._id,
  });

  const shortUrlRes = await urlRes.save();

  console.log({ shortUrlRes });

  if (!shortUrlRes) {
    throw new ApiError(500, "Something went wrong while shortening url");
  }

  return res.status(200).json(new ApiResponse(200, shortUrlRes, "Url created"));
});

const deleteSchema = z.object({
  urlId: z.string(),
});
const deleteUrl = asyncHandler(async (req, res) => {
  const reqUser = req.user;
  const reqBody = req.body;

  const { urlId } = deleteSchema.parse(reqBody);

  const isUrlExist = await URL.findOne({ urlCode: urlId, owner: reqUser._id });

  if (!isUrlExist) {
    throw new ApiError(404, "Url not found");
  }

  const deleteUrl = await URL.findOneAndDelete({
    urlCode: urlId,
    owner: reqUser._id,
  });

  if (!deleteUrl) {
    throw new ApiError(500, "Something went wrong while deleting url");
  }

  return res.status(200).json(new ApiResponse(200, deleteUrl, "Url deleted"));
});

export { shortenUrl, deleteUrl };
