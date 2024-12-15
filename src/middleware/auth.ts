import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User from "../model/User";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Unauthorized: Token missing or invalid format" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token is required" });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_TOKEN);
    if (typeof result === "object" && result._id) {
      const user = await User.findById(result._id).select("-password");
      if (!user) {
        res.status(404).json({ error: "User doesn't exist" });
        return;
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ error: "Invalid token: Missing user ID" });
      return;
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(500).json({ error: "Invalid token or verification failed" });
  }
}
