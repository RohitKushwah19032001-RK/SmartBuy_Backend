import express from "express";
import {
  getAllShops,
  registerShop,
  loginShop,
  getShopProfile,
  logout,
  getShopById,
  updateShopImage
} from "../controllers/shopController.js";

import authShop from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ REGISTER + LOGIN
router.post("/register", upload.single("image"), registerShop);
router.post("/login", loginShop);

// ❌ REMOVE THIS (Stripe hata diya)
// router.post("/complete-register", completeVendorRegistration);

router.post("/logout", logout);
router.get("/all", getAllShops);
router.get("/profile", authShop, getShopProfile);
router.get("/:id", getShopById);
router.put("/update-image", authShop, upload.single("image"), updateShopImage);

export default router;