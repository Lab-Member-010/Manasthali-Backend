import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const auth = async (req, res, next) => {
  try {
    // Check if the authorization header is present
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Split the bearer token and get the token part
    token = token.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing in authorization header" });
    }

    // Verify the token
    const decoded = jwt.verify(token, "thirdpartyproject"); // Use the same secret key
    console.log(decoded); // Log decoded token for debugging

    const user = await User.findById(decoded.payload); // Assuming payload contains the user ID
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    // Attach the user data to the request object
    req.user = user; // Access the userId directly
    next();
  } catch (err) {
    console.error("Error during authentication:", err);
    return res.status(401).json({ error: "Unauthorized access" });
  }
};
