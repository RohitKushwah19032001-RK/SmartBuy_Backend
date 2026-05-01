// middleware/uploadReel.js
import multer from "multer";

// File temporarily memory me store hogi (buffer)
const storage = multer.memoryStorage();
const uploadReel = multer({ storage });

export default uploadReel;