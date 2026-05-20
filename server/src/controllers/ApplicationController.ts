import { Response, NextFunction } from "express";
import JobApplication from "../models/JobApplication";
import { AuthenticatedRequest } from "../middleware/auth";

export const getApplications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const applications = await JobApplication.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { company, position, status, salary, location, jobUrl, notes, resumeVersionId } = req.body;

    if (!company || !position) {
      return res.status(400).json({ error: "Company and position are required fields." });
    }

    const application = new JobApplication({
      userId: req.user.id,
      resumeVersionId: resumeVersionId || undefined,
      company,
      position,
      status: status || "Wishlist",
      salary: salary || "",
      location: location || "",
      jobUrl: jobUrl || "",
      notes: notes || "",
      interviews: [],
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { company, position, status, salary, location, jobUrl, notes, interviews, resumeVersionId } = req.body;

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        $set: {
          company,
          position,
          status,
          salary,
          location,
          jobUrl,
          notes,
          interviews,
          resumeVersionId: resumeVersionId || undefined,
        },
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: "Job application not found." });
    }

    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const application = await JobApplication.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!application) {
      return res.status(404).json({ error: "Job application not found." });
    }

    res.status(200).json({ message: "Job application deleted successfully." });
  } catch (error) {
    next(error);
  }
};
