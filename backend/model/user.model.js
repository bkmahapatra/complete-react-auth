import mongoose, { model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    refreshToken: {
      type: String,
      // required: true,
    },
    // url: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     rel: "URL",
    //   },
    // ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // const salt = new bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const User = new model("User", userSchema);

export { User };
