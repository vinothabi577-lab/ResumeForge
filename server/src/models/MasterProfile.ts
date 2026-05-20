import mongoose, { Schema, Document } from "mongoose";

export interface IMasterProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    github: string;
    linkedin: string;
    summary: string;
  };
  experiences: {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    highlights: string[];
    description?: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    details?: string;
  }[];
  skills: {
    id: string;
    name: string;
    level?: string;
    category?: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    url?: string;
    github?: string;
    highlights: string[];
    technologies: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  customSections: {
    id: string;
    name: string;
    items: {
      id: string;
      title: string;
      subtitle?: string;
      date?: string;
      description?: string;
      highlights?: string[];
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PersonalInfoSchema = new Schema({
  fullName: { type: String, default: "" },
  title: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  summary: { type: String, default: "" },
}, { _id: false });

const ExperienceSchema = new Schema({
  id: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  current: { type: Boolean, default: false },
  highlights: { type: [String], default: [] },
  description: { type: String, default: "" },
}, { _id: false });

const EducationSchema = new Schema({
  id: { type: String, required: true },
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, default: "" },
  location: { type: String, default: "" },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  current: { type: Boolean, default: false },
  gpa: { type: String, default: "" },
  details: { type: String, default: "" },
}, { _id: false });

const SkillSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, default: "" },
  category: { type: String, default: "" },
}, { _id: false });

const ProjectSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, default: "" },
  github: { type: String, default: "" },
  highlights: { type: [String], default: [] },
  technologies: { type: [String], default: [] },
}, { _id: false });

const CertificationSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: "" },
  url: { type: String, default: "" },
}, { _id: false });

const CustomSectionItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  date: { type: String, default: "" },
  description: { type: String, default: "" },
  highlights: { type: [String], default: [] },
}, { _id: false });

const CustomSectionSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  items: { type: [CustomSectionItemSchema], default: [] },
}, { _id: false });

const MasterProfileSchema = new Schema<IMasterProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalInfo: {
      type: PersonalInfoSchema,
      default: () => ({}),
    },
    experiences: {
      type: [ExperienceSchema],
      default: [],
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    skills: {
      type: [SkillSchema],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    certifications: {
      type: [CertificationSchema],
      default: [],
    },
    customSections: {
      type: [CustomSectionSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMasterProfileDocument>("MasterProfile", MasterProfileSchema);
