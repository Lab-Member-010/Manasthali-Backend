// import express from "express";
// import passport from "../middleware/google.auth.js"; // Path to your googleAuth.js file

// const router = express.Router();

// // Route to initiate Google OAuth
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback route
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   (req, res) => {
//     // Successful authentication, return the token and user details
//     const { token, user } = req.user;
//     res.json({ token, user });
//   }
// );

// export default router;
import express from "express";
import passport from "../middleware/google.auth.js";
import { User } from "../model/user.model.js";

const router = express.Router();

// Initiate Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const { token, user } = req.user;

    // Inform the client that OTP has been sent
    res.json({ message: "OTP sent to your email. Please verify.", token, user: { id: user._id, email: user.email } });
  }
);

// OTP Verification Endpoint
router.post("/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp || new Date() > new Date(user.otpExpiresAt)) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP." });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "An error occurred during OTP verification."});
  }
});

export default router;
