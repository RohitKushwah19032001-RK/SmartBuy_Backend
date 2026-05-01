import multer from "multer";

// File temporarily memory me store hogi
const storage = multer.diskStorage({});
const upload = multer({ storage });

export default upload;