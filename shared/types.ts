export interface User {
  _id?: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string; // "Present" or date
  current: boolean;
  highlights: string[]; // Bullets
  description?: string;
}

export interface Education {
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
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  github?: string;
  highlights: string[];
  technologies: string[];
}

export interface Skill {
  id: string;
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category?: string; // e.g. "Languages", "Frontend", "Backend"
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
  highlights?: string[];
}

export interface CustomSection {
  id: string;
  name: string;
  items: CustomSectionItem[];
}

export interface MasterProfile {
  _id?: string;
  userId: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeOverrides {
  personalInfo?: Partial<PersonalInfo>;
  experiences?: {
    [id: string]: {
      hidden?: boolean;
      position?: string;
      highlights?: string[];
      customOrder?: number;
    };
  };
  education?: {
    [id: string]: {
      hidden?: boolean;
      details?: string;
      customOrder?: number;
    };
  };
  projects?: {
    [id: string]: {
      hidden?: boolean;
      description?: string;
      highlights?: string[];
      customOrder?: number;
    };
  };
  skills?: {
    [id: string]: {
      hidden?: boolean;
      customOrder?: number;
    };
  };
  certifications?: {
    [id: string]: {
      hidden?: boolean;
      customOrder?: number;
    };
  };
  customSections?: {
    [id: string]: {
      hidden?: boolean;
      name?: string;
      items?: {
        [itemId: string]: {
          hidden?: boolean;
          highlights?: string[];
        };
      };
      customOrder?: number;
    };
  };
}

export interface TemplateStyling {
  fontFamily: string;
  fontSize: number; // e.g. 10, 11, 12
  primaryColor: string; // hex
  textColor: string; // hex
  lineHeight: number;
  margin: number; // in pt or px
  sectionSpacing: number;
}

export interface Template {
  _id?: string;
  templateId: string; // e.g. "classic-ats", "minimal-modern", etc.
  name: string;
  category: string;
  thumbnailUrl?: string;
  sectionsOrder: string[]; // ["personalInfo", "experience", "education", ...]
  styling: TemplateStyling;
  isAtsSafe: boolean;
}

export interface ResumeVersion {
  _id?: string;
  userId: string;
  masterProfileId: string;
  templateId: string; // "classic-ats", "minimal-modern", etc.
  title: string;
  jobDescription?: string;
  overrides: ResumeOverrides;
  atsScore?: number;
  applicationStatus?: "Wishlist" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  lastExportedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobApplication {
  _id?: string;
  userId: string;
  resumeVersionId?: string; // Reference to specific resume version
  company: string;
  position: string;
  status: "Wishlist" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  salary?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
  appliedDate?: string;
  interviews?: {
    stage: string;
    date: string;
    notes?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AtsResult {
  score: number;
  readability: string;
  sectionsCompleteness: {
    personalInfo: boolean;
    experience: boolean;
    education: boolean;
    skills: boolean;
  };
  missingKeywords: string[];
  foundKeywords: string[];
  metricsCheck: {
    passed: boolean;
    count: number;
    message: string;
  };
  actionVerbsCheck: {
    passed: boolean;
    count: number;
    message: string;
  };
}
