import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    token = token.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing in authorization header" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findById(decoded.payload); 
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user; 
    next();
  } catch (err) {
    console.error("Error during authentication:", err);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};