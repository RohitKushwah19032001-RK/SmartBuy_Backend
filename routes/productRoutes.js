import express from "express";

import authShop from "../middleware/auth.js";
import upload from "../middleware/upload.js";

import {

 addProduct,
 getMyProducts,
 updateProduct,
 deleteProduct,
 getAllProducts,
 getSingleProduct,
 getProductsByShop,
 comparePrice,
 compareAmazon

} from "../controllers/productController.js";

const router = express.Router();

router.post(
 "/add",
 authShop,
 upload.single("image"),
 addProduct
);

router.get(
 "/my-products",
 authShop,
 getMyProducts
);

router.put(
 "/update/:id",
 authShop,
 updateProduct
);

router.delete(
 "/delete/:id",
 authShop,
 deleteProduct
);

router.get(
 "/all",
 getAllProducts
);

router.get(
 "/compare/:id",
 comparePrice
);

router.get(
 "/:id",
 getSingleProduct
);

router.get(
 "/shop/:shopId",
 getProductsByShop
);

router.get(
 "/compare-amazon/:id",
 compareAmazon
);

export default router;