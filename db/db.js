import mongoose from "mongoose";
import { MONGO_URI } from "../constants.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("mongoDB connected successfully");
  } catch (error) {
    console.log(error.message);
  }
};
