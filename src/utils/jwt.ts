import jwt from "jsonwebtoken";
import pkg from "jsonwebtoken";
import { NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

const { verify } = pkg;

// export const authenticateToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers?.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ message: "Authorization token missing or invalid" });
//   }

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = decoded; // Adjuntar el usuario al request
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

export const generateJWT = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });
};
