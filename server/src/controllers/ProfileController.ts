import { Response, NextFunction } from "express";
import MasterProfile from "../models/MasterProfile";
import { AuthenticatedRequest } from "../middleware/auth";

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let profile = await MasterProfile.findOne({ userId: req.user.id });

    if (!profile) {
      // Create profile dynamically if missing
      profile = new MasterProfile({
        userId: req.user.id,
        personalInfo: {
          fullName: "",
          title: "",
          email: req.user.email,
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
    }

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { personalInfo, experiences, education, skills, projects, certifications, customSections } = req.body;

    const profile = await MasterProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          personalInfo,
          experiences,
          education,
          skills,
          projects,
          certifications,
          customSections,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};
