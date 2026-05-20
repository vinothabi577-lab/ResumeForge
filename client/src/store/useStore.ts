import { create } from "zustand";
import axios from "axios";
import {
  User,
  MasterProfile,
  ResumeVersion,
  JobApplication,
  Template
} from "../../../shared/types";

// Base API Configuration
const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Automatically inject JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AppState {
  // Authentication State
  user: User | null;
  token: string | null;
  authLoading: boolean;
  authError: string | null;
  login: (credentials: any) => Promise<boolean>;
  signup: (credentials: any) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Master Profile State
  profile: MasterProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<MasterProfile>) => Promise<void>;

  // Resume State
  resumes: ResumeVersion[];
  activeResume: ResumeVersion | null;
  resumesLoading: boolean;
  templates: Template[];
  fetchResumes: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  fetchResumeById: (id: string) => Promise<ResumeVersion | null>;
  createResume: (title: string, templateId?: string, jobDescription?: string) => Promise<ResumeVersion | null>;
  updateResume: (id: string, resumeData: Partial<ResumeVersion>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  setActiveResume: (resume: ResumeVersion | null) => void;

  // Job Tracker State
  applications: JobApplication[];
  trackerLoading: boolean;
  fetchApplications: () => Promise<void>;
  createApplication: (appData: Partial<JobApplication>) => Promise<void>;
  updateApplication: (id: string, appData: Partial<JobApplication>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Authentication Initial State
  user: null,
  token: localStorage.getItem("token"),
  authLoading: false,
  authError: null,

  login: async (credentials) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ token, user, authLoading: false });
      
      // Auto-fetch subsequent state
      get().fetchProfile();
      get().fetchResumes();
      get().fetchApplications();
      
      return true;
    } catch (error: any) {
      set({ authError: error.response?.data?.error || "Login failed.", authLoading: false });
      return false;
    }
  },

  signup: async (credentials) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await api.post("/auth/register", credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      set({ token, user, authLoading: false });
      
      // Fetch initial empty profile
      get().fetchProfile();
      return true;
    } catch (error: any) {
      set({ authError: error.response?.data?.error || "Registration failed.", authLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, profile: null, resumes: [], activeResume: null, applications: [] });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    set({ authLoading: true });
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data, authLoading: false });
      
      // Load user profile & documents
      get().fetchProfile();
      get().fetchResumes();
      get().fetchApplications();
      get().fetchTemplates();
    } catch (error) {
      localStorage.removeItem("token");
      set({ token: null, user: null, authLoading: false });
    }
  },

  // Master Profile Actions
  profile: null,
  profileLoading: false,
  profileError: null,

  fetchProfile: async () => {
    if (!get().token) return;
    set({ profileLoading: true });
    try {
      const response = await api.get("/profile");
      set({ profile: response.data, profileLoading: false });
    } catch (error: any) {
      set({ profileError: error.response?.data?.error || "Failed to load profile.", profileLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    if (!get().token || !get().profile) return;
    const updatedProfile = { ...get().profile, ...profileData } as MasterProfile;
    
    // Optimistic UI updates
    set({ profile: updatedProfile });
    
    try {
      const response = await api.put("/profile", updatedProfile);
      set({ profile: response.data });
    } catch (error: any) {
      console.error("Failed to sync profile with server:", error);
      // Re-fetch to keep correct state if api failed
      get().fetchProfile();
    }
  },

  // Tailored Resume Version Actions
  resumes: [],
  activeResume: null,
  resumesLoading: false,
  templates: [],

  fetchResumes: async () => {
    if (!get().token) return;
    set({ resumesLoading: true });
    try {
      const response = await api.get("/resumes");
      set({ resumes: response.data, resumesLoading: false });
    } catch (error) {
      set({ resumesLoading: false });
    }
  },

  fetchTemplates: async () => {
    try {
      const response = await api.get("/templates");
      set({ templates: response.data });
    } catch (error) {
      console.error("Failed to load templates.");
    }
  },

  fetchResumeById: async (id) => {
    if (!get().token) return null;
    try {
      const response = await api.get(`/resumes/${id}`);
      set({ activeResume: response.data });
      return response.data;
    } catch (error) {
      return null;
    }
  },

  createResume: async (title, templateId, jobDescription) => {
    if (!get().token) return null;
    try {
      const response = await api.post("/resumes", { title, templateId, jobDescription });
      const newResume = response.data;
      set({ resumes: [newResume, ...get().resumes], activeResume: newResume });
      return newResume;
    } catch (error) {
      return null;
    }
  },

  updateResume: async (id, resumeData) => {
    if (!get().token) return;
    
    // Optimistic update of local states
    const updatedResumes = get().resumes.map(r => r._id === id ? { ...r, ...resumeData } as ResumeVersion : r);
    set({ resumes: updatedResumes });
    if (get().activeResume?._id === id) {
      set({ activeResume: { ...get().activeResume, ...resumeData } as ResumeVersion });
    }

    try {
      const response = await api.put(`/resumes/${id}`, resumeData);
      // Sync with final server output
      const syncedResumes = get().resumes.map(r => r._id === id ? response.data : r);
      set({ resumes: syncedResumes });
      if (get().activeResume?._id === id) {
        set({ activeResume: response.data });
      }
    } catch (error) {
      console.error("Failed to sync resume updates.");
    }
  },

  deleteResume: async (id) => {
    if (!get().token) return;
    set({ resumes: get().resumes.filter(r => r._id !== id) });
    if (get().activeResume?._id === id) {
      set({ activeResume: null });
    }
    try {
      await api.delete(`/resumes/${id}`);
    } catch (error) {
      console.error("Failed to delete resume on server.");
      get().fetchResumes();
    }
  },

  setActiveResume: (resume) => {
    set({ activeResume: resume });
  },

  // Job Tracker Kanban Board Actions
  applications: [],
  trackerLoading: false,

  fetchApplications: async () => {
    if (!get().token) return;
    set({ trackerLoading: true });
    try {
      const response = await api.get("/applications");
      set({ applications: response.data, trackerLoading: false });
    } catch (error) {
      set({ trackerLoading: false });
    }
  },

  createApplication: async (appData) => {
    if (!get().token) return;
    try {
      const response = await api.post("/applications", appData);
      set({ applications: [response.data, ...get().applications] });
    } catch (error) {
      console.error("Failed to create application.");
    }
  },

  updateApplication: async (id, appData) => {
    if (!get().token) return;
    // Optimistic UI updates
    const updatedApps = get().applications.map(a => a._id === id ? { ...a, ...appData } as JobApplication : a);
    set({ applications: updatedApps });
    try {
      const response = await api.put(`/applications/${id}`, appData);
      const syncedApps = get().applications.map(a => a._id === id ? response.data : a);
      set({ applications: syncedApps });
    } catch (error) {
      console.error("Failed to update application on server.");
      get().fetchApplications();
    }
  },

  deleteApplication: async (id) => {
    if (!get().token) return;
    set({ applications: get().applications.filter(a => a._id !== id) });
    try {
      await api.delete(`/applications/${id}`);
    } catch (error) {
      console.error("Failed to delete application on server.");
      get().fetchApplications();
    }
  },
}));
