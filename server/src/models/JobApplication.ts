import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplicationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  resumeVersionId?: mongoose.Types.ObjectId;
  company: string;
  position: string;
  status: "Wishlist" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  salary?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  appliedDate?: Date;
  interviews: {
    stage: string;
    date: Date;
    notes?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplicationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeVersionId: {
      type: Schema.Types.ObjectId,
      ref: "ResumeVersion",
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"],
      required: true,
      default: "Wishlist",
    },
    salary: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    jobUrl: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    interviews: [
      {
        stage: { type: String, required: true },
        date: { type: Date, required: true },
        notes: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IJobApplicationDocument>("JobApplication", JobApplicationSchema);
