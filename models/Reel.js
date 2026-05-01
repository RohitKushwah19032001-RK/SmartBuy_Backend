import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  video: { type: String, required: true },
  
  // shop reference
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shop", 
    required: true 
  },

}, { timestamps: true });

const Reel = mongoose.model("Reel", reelSchema);
export default Reel;