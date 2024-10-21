import mongoose, { Schema } from "mongoose";

const clickSchema = new mongoose.Schema({
  // shortUrl: { type: Schema.Types.ObjectId, require: true }, // Foreign key to URL collection
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: "URL", require: true },
  timestamp: Date,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  location: {
    country: String,
    city: String,
  },
});

const Click = mongoose.model("clicks", clickSchema);

export { Click };
