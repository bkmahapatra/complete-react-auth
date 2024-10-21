import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const dbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${dbInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed!", error);
    process.exit(1);
  }
}
