import mongoose, { Schema, Document } from "mongoose";

export interface IResumeVersionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  masterProfileId: mongoose.Types.ObjectId;
  templateId: string;
  title: string;
  jobDescription?: string;
  overrides: any; // Flexible JSON structure representing overrides
  atsScore?: number;
  applicationStatus?: string;
  lastExportedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeVersionSchema = new Schema<IResumeVersionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    masterProfileId: {
      type: Schema.Types.ObjectId,
      ref: "MasterProfile",
      required: true,
    },
    templateId: {
      type: String,
      required: true,
      default: "classic-ats",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      default: "",
    },
    overrides: {
      type: Schema.Types.Mixed,
      default: {},
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    applicationStatus: {
      type: String,
      enum: ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected", ""],
      default: "",
    },
    lastExportedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IResumeVersionDocument>("ResumeVersion", ResumeVersionSchema);
