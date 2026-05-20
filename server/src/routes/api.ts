import { Router } from "express";
import * as authController from "../controllers/AuthController";
import * as profileController from "../controllers/ProfileController";
import * as resumeController from "../controllers/ResumeController";
import * as applicationController from "../controllers/ApplicationController";
import { authenticate } from "../middleware/auth";
import Template from "../models/Template";

const router = Router();

// --- Auth Routes ---
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authenticate as any, authController.getMe as any);

// --- Profile Routes ---
router.get("/profile", authenticate as any, profileController.getProfile as any);
router.put("/profile", authenticate as any, profileController.updateProfile as any);

// --- Resume Routes ---
router.get("/resumes", authenticate as any, resumeController.getResumes as any);
router.post("/resumes", authenticate as any, resumeController.createResume as any);
router.get("/resumes/:id", authenticate as any, resumeController.getResumeById as any);
router.put("/resumes/:id", authenticate as any, resumeController.updateResume as any);
router.delete("/resumes/:id", authenticate as any, resumeController.deleteResume as any);

// --- Application Routes ---
router.get("/applications", authenticate as any, applicationController.getApplications as any);
router.post("/applications", authenticate as any, applicationController.createApplication as any);
router.put("/applications/:id", authenticate as any, applicationController.updateApplication as any);
router.delete("/applications/:id", authenticate as any, applicationController.deleteApplication as any);

// --- Templates Routes ---
router.get("/templates", async (req, res, next) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
});

// Seed route to quickly populate templates in DB if empty
router.post("/templates/seed", async (req, res, next) => {
  try {
    const defaultTemplates = [
      {
        templateId: "classic-ats",
        name: "Classic ATS",
        category: "ATS Safe",
        isAtsSafe: true,
        sectionsOrder: ["personalInfo", "experiences", "education", "projects", "skills", "certifications", "customSections"],
        styling: {
          fontFamily: "Times-Roman",
          fontSize: 10,
          primaryColor: "#111827",
          textColor: "#1f2937",
          lineHeight: 1.15,
          margin: 36,
          sectionSpacing: 10,
        },
      },
      {
        templateId: "minimal-modern",
        name: "Minimal Modern",
        category: "Modern",
        isAtsSafe: true,
        sectionsOrder: ["personalInfo", "experiences", "projects", "education", "skills", "certifications", "customSections"],
        styling: {
          fontFamily: "Helvetica",
          fontSize: 9.5,
          primaryColor: "#0f172a",
          textColor: "#334155",
          lineHeight: 1.25,
          margin: 40,
          sectionSpacing: 14,
        },
      },
      {
        templateId: "executive",
        name: "Executive",
        category: "Professional",
        isAtsSafe: true,
        sectionsOrder: ["personalInfo", "experiences", "education", "skills", "certifications", "projects", "customSections"],
        styling: {
          fontFamily: "Times-Roman",
          fontSize: 10.5,
          primaryColor: "#1e3a8a",
          textColor: "#0f172a",
          lineHeight: 1.2,
          margin: 45,
          sectionSpacing: 12,
        },
      },
      {
        templateId: "creative-clean",
        name: "Creative Clean",
        category: "Creative",
        isAtsSafe: true,
        sectionsOrder: ["personalInfo", "experiences", "projects", "skills", "education", "certifications", "customSections"],
        styling: {
          fontFamily: "Helvetica",
          fontSize: 10,
          primaryColor: "#7c3aed",
          textColor: "#1f2937",
          lineHeight: 1.3,
          margin: 36,
          sectionSpacing: 16,
        },
      },
    ];

    for (const temp of defaultTemplates) {
      await Template.findOneAndUpdate(
        { templateId: temp.templateId },
        temp,
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: "Default templates seeded successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
