import mongoose, { Schema, Document } from "mongoose";

export interface ITemplateDocument extends Document {
  templateId: string;
  name: string;
  category: string;
  thumbnailUrl?: string;
  sectionsOrder: string[];
  styling: {
    fontFamily: string;
    fontSize: number;
    primaryColor: string;
    textColor: string;
    lineHeight: number;
    margin: number;
    sectionSpacing: number;
  };
  isAtsSafe: boolean;
}

const TemplateSchema = new Schema<ITemplateDocument>(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    sectionsOrder: {
      type: [String],
      default: ["personalInfo", "summary", "experiences", "projects", "education", "skills", "certifications", "customSections"],
    },
    styling: {
      fontFamily: { type: String, default: "Inter" },
      fontSize: { type: Number, default: 10 },
      primaryColor: { type: String, default: "#2563eb" },
      textColor: { type: String, default: "#1f2937" },
      lineHeight: { type: Number, default: 1.2 },
      margin: { type: Number, default: 36 }, // margins in pt (e.g. 0.5 in)
      sectionSpacing: { type: Number, default: 12 },
    },
    isAtsSafe: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITemplateDocument>("Template", TemplateSchema);
