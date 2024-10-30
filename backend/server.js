import express from "express";
import userRoutes from "./routes/user.routes.js";
import urlRoutes from "./routes/url.routes.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { URL } from "./model/url.model.js";
import { User } from "./model/user.model.js";
import { ApiError } from "./utils/ApiError.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import { Click } from "./model/click.model.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

const app = express();

dotenv.config({
  path: "./.env",
});

connectDB();

app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000,
//   max: 60,
// });
// app.use(limiter);

app.use("/api/user", userRoutes);
app.use("/api/url", urlRoutes);

app.get(
  "/user/:userName",
  asyncHandler(async (req, res) => {
    const { userName } = req.params;
    console.log({ userName });

    const user = await User.findOne({ username: userName }).select("username");

    const urls = await URL.find({ owner: user._id }).select(
      "shortUrl customAlias"
    );

    return res.json(new ApiResponse(200, { user, urls }));
  })
);
app.get(
  "/:shortId",
  asyncHandler(async (req, res) => {
    const { ip } = req;
    console.log({ ip });
    const reqUrlCode = req.params.shortId;

    const url = await URL.findOne({ urlCode: reqUrlCode });

    if (!url) {
      throw new ApiError(404, "Url not found");
    }

    // url.clickCount++;
    // const rr = await Click.create({});
    // await url.save();

    return res.redirect(`https://${url.originalUrl}`);
  })
);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json({
        status: "error",
        code: err.statusCode,
        message: err.message,
        errors: err.errors,
      });
  }

  res
    .status(500)
    .json({ status: "error", code: 500, message: "Internal Server Error" });
});

app.listen(process.env.PORT || 5000);
