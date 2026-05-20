import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers.cookie) {
      // Fallback to cookie check if authorization header is not provided
      const cookies = req.headers.cookie.split(";").reduce((acc: any, cookie: string) => {
        const [key, val] = cookie.trim().split("=");
        acc[key] = val;
        return acc;
      }, {});
      token = cookies.token || "";
    }

    if (!token) {
      return res.status(401).json({ error: "Access Denied. No token provided." });
    }

    const secret = process.env.JWT_SECRET || "super_secret_resumeforge_jwt_token_key_1337";
    const decoded = jwt.verify(token, secret) as { id: string; email: string };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};
