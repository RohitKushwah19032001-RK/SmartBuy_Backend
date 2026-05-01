import express from "express";

import authUser from "../middleware/authUser.js";

import {

 addToCart,
 getCart,
 removeFromCart,
 updateQty

} from "../controllers/cartController.js";

const router =
express.Router();


// ADD

router.post(
 "/add",
 authUser,
 addToCart
);


// GET

router.get(
 "/my-cart",
 authUser,
 getCart
);


// REMOVE

router.post(
 "/remove",
 authUser,
 removeFromCart
);


// UPDATE QTY

router.post(
 "/update-qty",
 authUser,
 updateQty
);


export default router;