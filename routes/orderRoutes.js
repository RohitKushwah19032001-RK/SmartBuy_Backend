import express from "express";

import authUser from "../middleware/authUser.js";
import authShop from "../middleware/auth.js";

import {
  placeOrder,
  cancelOrder,
  userOrders,
  shopOrders,
  acceptReject,
  updateStatus,
  verifyPayment,
} from "../controllers/orderController.js";

const router = express.Router();


// ================= CUSTOMER ROUTES =================

// place order
router.post("/place", authUser, placeOrder);

// cancel order
router.post("/cancel", authUser, cancelOrder);

// get user orders
router.get("/my-orders", authUser, userOrders);

// 🔥 FIXED: payment verification
router.post("/verify-payment", authUser, verifyPayment);



// ================= SHOP / VENDOR ROUTES =================

// shop orders
router.get("/shop-orders", authShop, shopOrders);

// accept / reject
router.post("/accept-reject", authShop, acceptReject);

// update order status
router.post("/update-status", authShop, updateStatus);


export default router;