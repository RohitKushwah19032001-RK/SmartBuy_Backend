// utils/uploadToCloudinary.js
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath, folder = "shop_images") => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
  });

  return result.secure_url;
};