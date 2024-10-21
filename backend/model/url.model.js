import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortUrl: {
      type: String,
      // required: true,
      unique: true,
    },
    urlCode: {
      type: String,
      // required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
  },
  { timestamps: true }
);

urlSchema.pre("save", async function (next) {
  if (!this.isModified("originalUrl")) return next();

  // generate unique url id
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ1234567890",
    10
  );
  const uniqueUrlId = nanoid();

  this.urlCode = uniqueUrlId;
  this.shortUrl = `${process.env.BASE_URL}/${uniqueUrlId}`;

  const regex = /^https:\/\//;

  if (!regex.test(this.originalUrl)) {
    this.originalUrl = `https://${this.originalUrl}`;
  }

  next();
});

const URL = mongoose.model("ShortUrl", urlSchema);

export { URL };
