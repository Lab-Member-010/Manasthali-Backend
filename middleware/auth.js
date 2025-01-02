import jwt from "jsonwebtoken";
export const auth = async (request, response, next) => {
    try {
        let token = request.headers.authorization;
        token = token.split(" ")[1];
        jwt.verify(token, "fdfjfjrwieroerivxcnmvnnvrweiorddfsdfdlkfjlfjljlraj");
        next();
    }
    catch (err) {
        return response.status(401).json({ error: "Unauthorized access" });
    }
}


// import jwt from "jsonwebtoken";

// export const auth = async (req, res, next) => {
//     try {
//         // Check if the authorization header is present
//         const bearerToken = req.headers.authorization;
//         if (!bearerToken) {
//             return res.status(401).json({ error: "Authorization header missing" });
//         }

//         // Split the bearer token and get the token part
//         const token = bearerToken.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ error: "Token missing in authorization header" });
//         }

//         // Verify the token
//         jwt.verify(token, "youwillhavefun", (err, decoded) => {
//             if (err) {
//                 return res.status(401).json({ error: "Invalid or expired token" });
//             }
//             // Token is valid, store decoded user info (optional)
//             req.user = decoded; // You can attach user data to the request
//             next();
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(401).json({ error: "Unauthorized user" });
//     }
// };
