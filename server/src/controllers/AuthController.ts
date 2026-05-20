import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import MasterProfile from "../models/MasterProfile";
import { AuthenticatedRequest } from "../middleware/auth";

const signToken = (id: string, email: string) => {
  const secret = process.env.JWT_SECRET || "super_secret_resumeforge_jwt_token_key_1337";
  return jwt.sign({ id, email }, secret, { expiresIn: "30d" });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    // Create User
    const user = new User({ email, password, name });
    await user.save();

    // Create associated empty MasterProfile for the user
    const profile = new MasterProfile({
      userId: user._id,
      personalInfo: {
        fullName: name || "",
        title: "",
        email: email,
        phone: "",
        location: "",
        website: "",
        github: "",
        linkedin: "",
        summary: "",
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      customSections: [],
    });
    await profile.save();

    const token = signToken(user._id.toString(), user.email);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signToken(user._id.toString(), user.email);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    });
  } catch (error) {
    next(error);
  }
};
