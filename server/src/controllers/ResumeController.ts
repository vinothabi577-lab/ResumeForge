import { Response, NextFunction } from "express";
import ResumeVersion from "../models/ResumeVersion";
import MasterProfile from "../models/MasterProfile";
import { AuthenticatedRequest } from "../middleware/auth";

export const getResumes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resumes = await ResumeVersion.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resume = await ResumeVersion.findOne({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ error: "Resume version not found." });
    }

    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, templateId, jobDescription } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Resume title is required." });
    }

    const profile = await MasterProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ error: "Please create a Master Profile first." });
    }

    const resume = new ResumeVersion({
      userId: req.user.id,
      masterProfileId: profile._id,
      title,
      templateId: templateId || "classic-ats",
      jobDescription: jobDescription || "",
      overrides: {
        personalInfo: {},
        experiences: {},
        education: {},
        projects: {},
        skills: {},
        certifications: {},
        customSections: {},
      },
      atsScore: 0,
      applicationStatus: "Wishlist",
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, templateId, jobDescription, overrides, atsScore, applicationStatus, lastExportedAt } = req.body;

    const resume = await ResumeVersion.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: {
          title,
          templateId,
          jobDescription,
          overrides,
          atsScore,
          applicationStatus,
          lastExportedAt,
        },
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({ error: "Resume version not found." });
    }

    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resume = await ResumeVersion.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!resume) {
      return res.status(404).json({ error: "Resume version not found." });
    }

    res.status(200).json({ message: "Resume version deleted successfully." });
  } catch (error) {
    next(error);
  }
};
