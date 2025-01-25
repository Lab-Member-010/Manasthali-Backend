// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { User } from "../model/user.model.js"; 

// dotenv.config();


// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3001/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           user = await User.create({
//             googleId: profile.id,
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             avatar: profile.photos[0].value,
         
//             username: `user_${profile.id}`,
//             password: "OAuthUser",   
//           });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//         done(null, { user, token });
//       } catch (err) {
//         done(err, null);
//       }
//     }
//   )
// );

// export default passport;
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/user.model.js";
import { myOPT } from "../mailer/mymail.js"; // Your existing OTP function

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user if not found
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            username: `user_${profile.id}`,
            password: "OAuthUser",
          });
        }

        // Generate OTP and send it to the user's email
        const otp = myOPT(user.email);

        // Temporarily store the OTP in the user record (or a separate collection)
        user.otp = otp; // Store as plaintext for testing, hash in production
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        await user.save();

        // Generate a JWT for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        done(null, { user, token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
