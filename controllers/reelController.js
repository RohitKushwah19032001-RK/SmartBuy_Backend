import Reel from "../models/Reel.js";
import cloudinary from "../config/cloudinary.js";


// Add Reel
export const addReel = async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ success: false, message: "Empty file" });

    // Cloudinary upload
    const result =await cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "reels" },
      async (error, result) => {
        if(error) return res.status(500).json({ success: false, message: "Cloudinary upload error" });

        const reel = await Reel.create({
          title: req.body.title,
          description: req.body.description,
          video: result.secure_url,
          shopId: req.shopId
        });

        res.json({ success: true, message: "Reel uploaded", reel });
      }
    );

    result.end(req.file.buffer); // multer memory buffer ko end karo
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET MY REELS
export const getMyReels = async (req, res) => {
  try {
    const reels = await Reel.find({ shopId: req.shopId });
    res.json({ success: true, reels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL REELS (for frontend to display shop name)
export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("shopId", "shopName"); // shopName populate

    res.json({ success: true, reels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET REELS BY SHOP
export const getReelsByShop = async(req,res)=>{
 try {

  const reels = await Reel.find({
   shopId: req.params.shopId
  });

  res.json({
   success:true,
   reels
  });

 } catch (error) {

  res.json({
   success:false,
   message:error.message
  });

 }
};

// delte reels
export const deleteReel = async (req, res) => {
  try {
    const reel = await Reel.findById(req.params.id);

    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    // Extract Cloudinary public_id
    const publicId = reel.video.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`reels/${publicId}`, {
      resource_type: "video",
    });

    await reel.deleteOne();

    res.json({ success: true, message: "Reel deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};