import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// PROFILE
router.get("/profile", authUser, async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("-password");

    res.json({
      success: true,
      user
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

// LOGOUT (FRONTEND HANDLE KAREGA)
router.get("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logout success"
  });
});

export default router;