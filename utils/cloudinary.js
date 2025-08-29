import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from "../constants.js";
import { ApiError } from "./ApiError.js";
import fs from "fs";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, "Cloudinary upload failed"));
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};


const deleteFromCloudinary = async (pic_id) => {
  if (!pic_id) return null; // skip if no id
  try {
    const response = await cloudinary.uploader.destroy(pic_id, { resource_type: "image" });
    if (response.result !== "ok" && response.result !== "not found") {
      console.error("Cloudinary deletion issue:", response);
    }
    return response;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null; 
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
