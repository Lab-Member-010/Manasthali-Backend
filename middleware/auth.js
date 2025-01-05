import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(
      token,
      "fdfjfjrwieroerivxcnmvnnvrweiorddfsdfdlkfjlfjljlraj" // Your secret key
    );

    // Attach the user data to the request object
    req.user = decoded; // Contains the user info (e.g., id, email, etc.)
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized access" });
  }
};