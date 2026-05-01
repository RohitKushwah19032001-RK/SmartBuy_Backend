import Product from "../models/Product.js";
import Shop from "../models/Shop.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { getAmazonProduct } from "../utils/amazonService.js";


// ADD PRODUCT
export const addProduct = async (req, res) => {
 try {

  // Shop info fetch
  const shop = await Shop.findById(req.shopId);

  const {
   productName,
   price,
   description,
   category,
   amazonLink,
   flipkartLink
  } = req.body;

  let imageUrl = "https://via.placeholder.com/150";

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "shop_images",
    });

    imageUrl = result.secure_url;
    fs.unlinkSync(req.file.path);
  }

  // CREATE PRODUCT (shopName + shopId)
  const product = await Product.create({
    productName,
    price,
    description,
    category,
    amazonLink,
    flipkartLink,
    image: imageUrl,

    shopId: req.shopId,
    shopName: shop.shopName, // ⭐ ADD SHOP NAME
  });

  res.json({
    success: true,
    product,
  });

 } catch (error) {
  res.json({
    success: false,
    message: error.message,
  });
 }
};



// GET MY PRODUCTS
export const getMyProducts = async (req, res) => {
 try {

  const products = await Product.find({
   shopId: req.shopId
  });

  res.json({
   success: true,
   products
  });

 } catch (error) {
  res.json({
   success: false,
   message: error.message
  });
 }
};



// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
 try {

  const product = await Product.findOneAndUpdate(
   {
    _id: req.params.id,
    shopId: req.shopId
   },
   req.body,
   { new: true }
  );

  res.json({
   success: true,
   product
  });

 } catch (error) {
  res.json({
   success: false,
   message: error.message
  });
 }
};



// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
 try {

  await Product.findOneAndDelete({
   _id: req.params.id,
   shopId: req.shopId
  });

  res.json({ success: true });

 } catch (error) {
  res.json({
   success: false,
   message: error.message
  });
 }
};



// GET ALL PRODUCTS (⭐ SHOP NAME POPULATE)
export const getAllProducts = async (req, res) => {
 try {

  const products = await Product.find()
   .populate("shopId", "shopName"); // ⭐ ONLY SHOP NAME

  res.json({
   success: true,
   products
  });

 } catch (error) {
  res.json({
   success: false,
   message: error.message
  });
 }
};



// GET SINGLE PRODUCT (⭐ CATEGORY + SHOP NAME)
export const getSingleProduct = async (req, res) => {
 try {

  const product = await Product.findById(req.params.id)
   .populate("shopId", "shopName"); // ⭐ ONLY SHOP NAME

  res.json({
   success: true,
   product
  });

 } catch (error) {
  res.json({
   success: false
  });
 }
};



// GOOGLE PRICE COMPARISON
export const comparePrice = async (req, res) => {
 try {

  const product = await Product.findById(req.params.id);

  if (!product) {
   return res.json({
    success: false,
    message: "Product not found"
   });
  }

  const googleCompareLink =
   `https://www.google.com/search?tbm=shop&q=${
    encodeURIComponent(product.productName + " price india")
   }`;

  res.json({
   success: true,
   googleCompareLink
  });

 } catch (error) {
  res.json({
   success: false,
   message: error.message
  });
 }
};



// PRODUCTS BY SHOP
export const getProductsByShop = async (req, res) => {
 try {

  const products = await Product.find({
   shopId: req.params.shopId
  });

  res.json({
   success: true,
   products
  });

 } catch (error) {
  res.json({
   success: false
  });
 }
};

// amazon se compare 
export const compareAmazon = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔥 Better search query (important)
    const searchQuery = `${product.productName} India`;

    const amazon = await getAmazonProduct(searchQuery);

    //  agar API se data nahi mila
    if (!amazon || !amazon.price) {
      return res.json({
        success: true,
        localPrice: product.price,
        amazonPrice: null,
        amazonLink: null,
        message: "Amazon product not found"
      });
    }

    // 🔥 FINAL RESPONSE
    res.json({
      success: true,
      productName: product.productName,
      localPrice: product.price,

      amazonTitle: amazon.title,
      amazonPrice: amazon.price,
      amazonLink: amazon.link,
      amazonImage: amazon.image
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};