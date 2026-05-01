import Shop from "../models/Shop.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";


// -------------------- REGISTER SHOP --------------------
export const registerShop = async (req, res) => {
  try {
    const {
      shopName,
      email,
      password,
      ownerName,
      phone,
      address,
      city,
      state,
      pincode,
      category,
      description,
    } = req.body;

    const existingShop = await Shop.findOne({ email });

    if (existingShop) {
      return res.json({
        success: false,
        message: "Shop already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const shop = await Shop.create({
      shopName,
      email,
      password: hashedPassword,
      ownerName,
      phone,
      address,
      city,
      state,
      pincode,
      category,
      description,
      image: "https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/2e2732da-378f-4c8e-8fdc-fcb84f7e6ff6.jpg", // default image
    });

    res.json({
      success: true,
      message: "Shop Registered Successfully",
      shopId: shop._id,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// -------------------- LOGIN SHOP --------------------
export const loginShop = async (req, res) => {
  try {
    const { email, password } = req.body;

    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, shop.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      { id: shop._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login Success",
      token, // 🔥 IMPORTANT
      shop: {
        id: shop._id,
        shopName: shop.shopName,
        email: shop.email,
      }
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// -------------------- GET SHOP PROFILE --------------------
export const getShopProfile = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shopId);
    res.json({ success: true, shop });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// -------------------- LOGOUT SHOP --------------------
export const logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// -------------------- GET ALL SHOPS --------------------
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find().select("shopName image category");
    res.json({ success: true, shops });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// -------------------- GET SHOP BY ID --------------------
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    res.json({ success: true, shop });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// -------------------- UPDATE SHOP IMAGE --------------------
export const updateShopImage = async (req, res) => {
  try {
    const shopId = req.shopId;

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.json({ success: false, message: "Shop not found" });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    const newImageUrl = await uploadToCloudinary(req.file.path);

    // delete old image
    if (shop.image && shop.image.includes("cloudinary")) {
      const publicId = shop.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`shop_images/${publicId}`);
    }

    shop.image = newImageUrl;
    await shop.save();

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      message: "Shop image updated successfully",
      image: newImageUrl,
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};