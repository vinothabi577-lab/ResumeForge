import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import router from "./routes/api";
import { errorHandler } from "./middleware/error";
import Template from "./models/Template";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow flexible connection during development
      }
    },
    credentials: true,
  })
);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate Limiting (prevent brute-force and spamming)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Health Check API
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// API Routes
app.use("/api", router);

// Global Error Handler
app.use(errorHandler as any);

// Auto-seed templates on boot
const autoSeedTemplates = async () => {
  try {
    const count = await Template.countDocuments();
    if (count === 0) {
      console.log("No templates found in database. Auto-seeding templates...");
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
      await Template.insertMany(defaultTemplates);
      console.log("Seeding templates completed successfully.");
    }
  } catch (error) {
    console.error("Failed to auto-seed default templates:", error);
  }
};

// Start Server
const startServer = async () => {
  await connectDB();
  await autoSeedTemplates();
  app.listen(PORT, () => {
    console.log(`[Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
};

startServer();
