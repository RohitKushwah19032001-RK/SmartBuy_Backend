import express from "express";
import uploadReel from "../middleware/uploadReel.js";
import {
  addReel,
  getMyReels,
  getAllReels,
  getReelsByShop,
  deleteReel
} from "../controllers/reelController.js";
import authShop from "../middleware/auth.js";

const router = express.Router();

router.post("/add",authShop, uploadReel.single("video"), addReel);
router.get("/my-reels",authShop,getMyReels);
router.get("/all", getAllReels);
router.get("/shop/:shopId", getReelsByShop);
router.delete("/delete/:id",authShop, deleteReel);  
export default router;