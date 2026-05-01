import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    next();

  } catch (error) {
    console.log("Auth Error:", error.message);

    res.status(401).json({
      success: false,
      message: "Invalid Token"
    });
  }
};

export default authUser;