import express from "express";
import { customerStripePayment} from "../controllers/paymentController.js";
import  authUser  from "../middleware/authUser.js";       // Customer JWT (if required)


const router = express.Router();

// Customer payment (optional auth)
router.post("/stripe/customer", authUser,customerStripePayment);



export default router;