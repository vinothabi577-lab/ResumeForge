import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  FileText, 
  LogOut, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Award, 
  FolderGit2, 
  Columns, 
  Trash2, 
  ChevronRight,
  TrendingUp,
  User as UserIcon,
  Layers,
  FileSpreadsheet,
  Wand2
} from "lucide-react";
import { useStore } from "../store/useStore";
import { 
  Experience, 
  Education, 
  Project, 
  Skill, 
  Certification,
  PersonalInfo
} from "../../../shared/types";
import { ExtractProfileModal } from "../components/ExtractProfileModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const logout = useStore((state) => state.logout);
  const user = useStore((state) => state.user);
  
  // Master Profile state
  const profile = useStore((state) => state.profile);
  const updateProfile = useStore((state) => state.updateProfile);
  const profileLoading = useStore((state) => state.profileLoading);

  // Resumes state
  const resumes = useStore((state) => state.resumes);
  const createResume = useStore((state) => state.createResume);
  const deleteResume = useStore((state) => state.deleteResume);

  // Tabs: "resumes" or "profile"
  const [activeTab, setActiveTab] = useState<"resumes" | "profile">("resumes");
  
  // Master profile sub-tab: "personal" | "experience" | "education" | "skills" | "projects" | "certifications"
  const [profileSubTab, setProfileSubTab] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "certifications">("personal");

  // Create Resume Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [newResumeTemplate, setNewResumeTemplate] = useState("classic-ats");
  const [newResumeJobDesc, setNewResumeJobDesc] = useState("");

  // Master profile item editor states (to add/edit items easily)
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<Project> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);

  // AI Extract Modal state
  const [showExtractModal, setShowExtractModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // --- Handler for AI Profile Extraction ---
  const handleExtractedProfile = (data: {
    personalInfo: Partial<PersonalInfo>;
    experiences: Partial<Experience>[];
    education: Partial<Education>[];
    skills: Partial<Skill>[];
    projects: Partial<Project>[];
    certifications: Partial<Certification>[];
  }) => {
    if (!profile) return;

    const updatedProfile: any = { ...profile };

    // Update personal info (merge with existing)
    if (data.personalInfo) {
      updatedProfile.personalInfo = {
        ...updatedProfile.personalInfo,
        ...data.personalInfo,
      };
    }

    // Add new experiences (avoiding duplicates by company+position)
    if (data.experiences && data.experiences.length > 0) {
      const existingExp = updatedProfile.experiences || [];
      const newExperiences = data.experiences.filter(
        (exp) => !existingExp.some(
          (e: Experience) => e.company === exp.company && e.position === exp.position
        )
      );
      updatedProfile.experiences = [...existingExp, ...newExperiences];
    }

    // Add new education (avoiding duplicates)
    if (data.education && data.education.length > 0) {
      const existingEdu = updatedProfile.education || [];
      const newEducation = data.education.filter(
        (edu) => !existingEdu.some(
          (e: Education) => e.institution === edu.institution && e.degree === edu.degree
        )
      );
      updatedProfile.education = [...existingEdu, ...newEducation];
    }

    // Add new skills (avoiding duplicates by name)
    if (data.skills && data.skills.length > 0) {
      const existingSkills = updatedProfile.skills || [];
      const newSkills = data.skills.filter(
        (skill) => !existingSkills.some(
          (s: Skill) => s.name?.toLowerCase() === skill.name?.toLowerCase()
        )
      );
      updatedProfile.skills = [...existingSkills, ...newSkills];
    }

    // Add new projects (avoiding duplicates by name)
    if (data.projects && data.projects.length > 0) {
      const existingProjects = updatedProfile.projects || [];
      const newProjects = data.projects.filter(
        (proj) => !existingProjects.some(
          (p: Project) => p.name === proj.name
        )
      );
      updatedProfile.projects = [...existingProjects, ...newProjects];
    }

    // Add new certifications (avoiding duplicates by name)
    if (data.certifications && data.certifications.length > 0) {
      const existingCerts = updatedProfile.certifications || [];
      const newCerts = data.certifications.filter(
        (cert) => !existingCerts.some(
          (c: Certification) => c.name === cert.name
        )
      );
      updatedProfile.certifications = [...existingCerts, ...newCerts];
    }

    updateProfile(updatedProfile);
  };

  // --- Handlers for Create Resume ---
  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeTitle) return;

    const newResume = await createResume(newResumeTitle, newResumeTemplate, newResumeJobDesc);
    if (newResume) {
      setShowCreateModal(false);
      setNewResumeTitle("");
      setNewResumeJobDesc("");
      navigate(`/editor/${newResume._id}`);
    }
  };

  // --- Handlers for Profile Changes ---
  const handleUpdatePersonalInfo = (field: string, value: string) => {
    if (!profile) return;
    const personalInfo = { ...profile.personalInfo, [field]: value };
    updateProfile({ personalInfo });
  };

  // Experiences CRUD
  const saveExperience = () => {
    if (!profile || !editingExp) return;
    let experiences = [...(profile.experiences || [])];
    
    if (editingExp.id) {
      // Edit
      experiences = experiences.map((exp) => exp.id === editingExp.id ? editingExp as Experience : exp);
    } else {
      // Add
      const newExp = {
        ...editingExp,
        id: "exp_" + Date.now(),
        highlights: editingExp.highlights || []
      } as Experience;
      experiences.push(newExp);
    }

    updateProfile({ experiences });
    setEditingExp(null);
  };

  const removeExperience = (id: string) => {
    if (!profile) return;
    const experiences = profile.experiences.filter((exp) => exp.id !== id);
    updateProfile({ experiences });
  };

  // Education CRUD
  const saveEducation = () => {
    if (!profile || !editingEdu) return;
    let education = [...(profile.education || [])];
    
    if (editingEdu.id) {
      education = education.map((edu) => edu.id === editingEdu.id ? editingEdu as Education : edu);
    } else {
      const newEdu = {
        ...editingEdu,
        id: "edu_" + Date.now()
      } as Education;
      education.push(newEdu);
    }

    updateProfile({ education });
    setEditingEdu(null);
  };

  const removeEducation = (id: string) => {
    if (!profile) return;
    const education = profile.education.filter((edu) => edu.id !== id);
    updateProfile({ education });
  };

  // Projects CRUD
  const saveProject = () => {
    if (!profile || !editingProj) return;
    let projects = [...(profile.projects || [])];
    
    if (editingProj.id) {
      projects = projects.map((p) => p.id === editingProj.id ? editingProj as Project : p);
    } else {
      const newProj = {
        ...editingProj,
        id: "proj_" + Date.now(),
        highlights: editingProj.highlights || [],
        technologies: editingProj.technologies || []
      } as Project;
      projects.push(newProj);
    }

    updateProfile({ projects });
    setEditingProj(null);
  };

  const removeProject = (id: string) => {
    if (!profile) return;
    const projects = profile.projects.filter((p) => p.id !== id);
    updateProfile({ projects });
  };

  // Skills CRUD
  const saveSkill = () => {
    if (!profile || !editingSkill) return;
    let skills = [...(profile.skills || [])];
    
    if (editingSkill.id) {
      skills = skills.map((s) => s.id === editingSkill.id ? editingSkill as Skill : s);
    } else {
      const newSkill = {
        ...editingSkill,
        id: "skill_" + Date.now()
      } as Skill;
      skills.push(newSkill);
    }

    updateProfile({ skills });
    setEditingSkill(null);
  };

  const removeSkill = (id: string) => {
    if (!profile) return;
    const skills = profile.skills.filter((s) => s.id !== id);
    updateProfile({ skills });
  };

  // Certifications CRUD
  const saveCertification = () => {
    if (!profile || !editingCert) return;
    let certifications = [...(profile.certifications || [])];
    
    if (editingCert.id) {
      certifications = certifications.map((c) => c.id === editingCert.id ? editingCert as Certification : c);
    } else {
      const newCert = {
        ...editingCert,
        id: "cert_" + Date.now()
      } as Certification;
      certifications.push(newCert);
    }

    updateProfile({ certifications });
    setEditingCert(null);
  };

  const removeCertification = (id: string) => {
    if (!profile) return;
    const certifications = profile.certifications.filter((c) => c.id !== id);
    updateProfile({ certifications });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text relative grid-bg flex flex-col font-sans">
      
      {/* Dashboard Top Header */}
      <header className="sticky top-0 z-40 border-b border-dark-border/40 bg-dark-bg/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-heading text-base shadow-glow">
              RF
            </div>
            <span className="font-heading font-extrabold tracking-tight text-base text-white">
              Resume<span className="text-primary-light">Forge</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/dashboard" className="text-primary-light hover:text-white transition-colors">
              Workspace
            </Link>
            <Link to="/tracker" className="text-dark-muted hover:text-white transition-colors flex items-center gap-1.5">
              <FileSpreadsheet size={14} /> Job Tracker
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-white">{user?.name || "Jane Doe"}</span>
              <span className="text-[10px] text-dark-muted">{user?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg border border-dark-border bg-dark-card hover:bg-red-500/10 hover:border-red-500/30 text-dark-muted hover:text-red-400 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8 z-10">
        
        {/* Workspace Title bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-border/40 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white mb-1.5">
              Workspace Console
            </h1>
            <p className="text-xs text-dark-muted font-light leading-relaxed">
              Maintain your career profile ledger on the right tab, and mint customized variations on the left tab.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-dark-card/60 p-1 border border-dark-border rounded-lg">
            <button
              onClick={() => setActiveTab("resumes")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === "resumes" ? "bg-primary text-white" : "text-dark-muted hover:text-white"
              }`}
            >
              <Layers size={12} /> Tailored Resumes
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === "profile" ? "bg-primary text-white" : "text-dark-muted hover:text-white"
              }`}
            >
              <Sparkles size={12} /> Master Profile Ledger
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1">
          {activeTab === "resumes" ? (
            /* RESUMES TAB */
            <div className="flex flex-col gap-6">
              
              {/* Stats overview banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-dark-card/40 border border-dark-border/40 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Active Copies</span>
                    <span className="text-base font-extrabold text-white">{resumes.length} versions</span>
                  </div>
                </div>

                <div className="p-4 bg-dark-card/40 border border-dark-border/40 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Avg ATS Score</span>
                    <span className="text-base font-extrabold text-white">
                      {resumes.length > 0 
                        ? `${Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / resumes.length)}%` 
                        : "0%"}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-dark-card/40 border border-dark-border/40 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-blue/10 border border-accent-blue/25 flex items-center justify-center text-accent-blue">
                    <Columns size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-dark-muted block uppercase font-bold tracking-wider">Linked Applications</span>
                    <span className="text-base font-extrabold text-white">Kanban Sync Active</span>
                  </div>
                </div>
              </div>

              {/* Grid of copies */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Create Card Button */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-8 border-2 border-dashed border-dark-border hover:border-primary/50 bg-dark-card/10 hover:bg-dark-card/30 rounded-xl transition-all group flex flex-col items-center justify-center gap-3 text-center min-h-[180px]"
                >
                  <div className="w-10 h-10 rounded-full border border-dark-border group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center text-dark-muted group-hover:text-primary-light transition-all">
                    <Plus size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary-light transition-colors">Mint Tailored Resume</h3>
                    <p className="text-[10px] text-dark-muted font-light mt-1">Derive a new targeted resume version from your Master Profile.</p>
                  </div>
                </button>

                {/* Resume copies list */}
                {resumes.map((resume) => (
                  <div 
                    key={resume._id} 
                    className="p-6 bg-dark-card/40 border border-dark-border/60 rounded-xl hover:border-dark-borderLight transition-all flex flex-col justify-between gap-5 relative group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light">
                          <FileText size={18} />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-[160px]" title={resume.title}>
                            {resume.title}
                          </h3>
                          <span className="text-[10px] text-dark-muted capitalize font-light block">
                            Template: {resume.templateId.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                      
                      {/* Round ATS Score Ring */}
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="20" cy="20" r="16" stroke="#202430" strokeWidth="2.5" fill="transparent" />
                          <circle cx="20" cy="20" r="16" stroke="#10b981" strokeWidth="2.5" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 16}
                            strokeDashoffset={2 * Math.PI * 16 * (1 - (resume.atsScore || 0) / 100)}
                          />
                        </svg>
                        <span className="absolute text-[9px] font-extrabold text-accent">{resume.atsScore || 0}%</span>
                      </div>
                    </div>

                    <div className="text-left bg-dark-bg/40 p-3 rounded-lg border border-dark-border/40 text-[10px] text-dark-muted font-light leading-relaxed truncate">
                      {resume.jobDescription ? `Target: ${resume.jobDescription}` : "No specific target description provided."}
                    </div>

                    <div className="flex justify-between items-center border-t border-dark-border/40 pt-4 mt-1">
                      <span className="text-[9px] text-dark-muted">
                        Updated {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : "recently"}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteResume(resume._id!)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 transition-all"
                          title="Delete copy"
                        >
                          <Trash2 size={12} />
                        </button>
                        <button
                          onClick={() => navigate(`/editor/${resume._id}`)}
                          className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-[10px] font-semibold tracking-wider transition-all flex items-center gap-1"
                        >
                          Open Workspace <ChevronRight size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* MASTER PROFILE LEDGER TAB */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left sidebar nav for sub-tabs */}
              <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 border border-dark-border/60 bg-dark-card/25 p-2 rounded-xl overflow-x-auto">
                {[
                  { id: "personal", label: "Personal Information", icon: UserIcon },
                  { id: "experience", label: "Professional Experience", icon: Briefcase },
                  { id: "projects", label: "Product & Projects", icon: FolderGit2 },
                  { id: "education", label: "Education & Academy", icon: GraduationCap },
                  { id: "skills", label: "Skills Matrix", icon: Code },
                  { id: "certifications", label: "Certificates & Awards", icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setProfileSubTab(tab.id as any)}
                      className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold text-left transition-all flex items-center gap-2.5 flex-shrink-0 ${
                        profileSubTab === tab.id 
                          ? "bg-primary/10 text-primary-light border-l-2 border-primary" 
                          : "text-dark-muted hover:bg-dark-card/65 hover:text-white"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Central edit pane */}
              <div className="lg:col-span-9 glass-panel rounded-xl p-8 border border-white/5 text-left flex flex-col gap-6 min-h-[500px]">
                
                {/* Loader state */}
                {profileLoading && (
                  <div className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm z-30 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Sub Tab: Personal Info */}
                {profileSubTab === "personal" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Personal Registry</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Configure your main professional headers. These parameters will act as your standard document headers.</p>
                      </div>
                      <button
                        onClick={() => setShowExtractModal(true)}
                        className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary-light text-[10px] font-bold tracking-wider transition-all hover:bg-primary/20 flex items-center gap-2 flex-shrink-0"
                      >
                        <Wand2 size={12} />
                        AI Auto-Fill
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Full Name</label>
                        <input
                          type="text"
                          value={profile.personalInfo?.fullName || ""}
                          onChange={(e) => handleUpdatePersonalInfo("fullName", e.target.value)}
                          placeholder="Sarah Jenkins"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Professional Title</label>
                        <input
                          type="text"
                          value={profile.personalInfo?.title || ""}
                          onChange={(e) => handleUpdatePersonalInfo("title", e.target.value)}
                          placeholder="Senior Staff Software Engineer"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Contact Email</label>
                        <input
                          type="email"
                          value={profile.personalInfo?.email || ""}
                          onChange={(e) => handleUpdatePersonalInfo("email", e.target.value)}
                          placeholder="sarah.j@gmail.com"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.personalInfo?.phone || ""}
                          onChange={(e) => handleUpdatePersonalInfo("phone", e.target.value)}
                          placeholder="(415) 555-1982"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Location</label>
                        <input
                          type="text"
                          value={profile.personalInfo?.location || ""}
                          onChange={(e) => handleUpdatePersonalInfo("location", e.target.value)}
                          placeholder="San Francisco, CA"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">Website</label>
                        <input
                          type="url"
                          value={profile.personalInfo?.website || ""}
                          onChange={(e) => handleUpdatePersonalInfo("website", e.target.value)}
                          placeholder="https://sarahj.co"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">GitHub URL</label>
                        <input
                          type="url"
                          value={profile.personalInfo?.github || ""}
                          onChange={(e) => handleUpdatePersonalInfo("github", e.target.value)}
                          placeholder="https://github.com/sarahj"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-dark-muted">LinkedIn URL</label>
                        <input
                          type="url"
                          value={profile.personalInfo?.linkedin || ""}
                          onChange={(e) => handleUpdatePersonalInfo("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/sarahj"
                          className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-dark-muted">Professional Abstract Summary</label>
                      <textarea
                        value={profile.personalInfo?.summary || ""}
                        onChange={(e) => handleUpdatePersonalInfo("summary", e.target.value)}
                        placeholder="Detail your professional highlights, competencies and engineering targets in 2-3 clean sentences..."
                        rows={4}
                        className="w-full px-3 py-2.5 rounded-lg glass-input text-xs leading-relaxed font-light"
                      />
                    </div>
                  </div>
                )}

                {/* Sub Tab: Experience */}
                {profileSubTab === "experience" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Work History Ledger</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Add details for every position you've ever held. You will select subsets when tailoring resumes.</p>
                      </div>
                      <button
                        onClick={() => setEditingExp({
                          company: "",
                          position: "",
                          location: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          highlights: [],
                          description: ""
                        })}
                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Plus size={12} /> Add Experience
                      </button>
                    </div>

                    {/* EXP EDITOR MODAL CARD */}
                    {editingExp && (
                      <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          {editingExp.id ? "Edit Position details" : "Register New Position"}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Company Name"
                            value={editingExp.company}
                            onChange={(e) => setEditingExp({...editingExp, company: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title"
                            value={editingExp.position}
                            onChange={(e) => setEditingExp({...editingExp, position: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Start Date (e.g. Jan 2022)"
                            value={editingExp.startDate}
                            onChange={(e) => setEditingExp({...editingExp, startDate: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="End Date (or 'Present')"
                            value={editingExp.endDate}
                            onChange={(e) => setEditingExp({...editingExp, endDate: e.target.value})}
                            disabled={editingExp.current}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Location"
                            value={editingExp.location}
                            onChange={(e) => setEditingExp({...editingExp, location: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                            <input
                              type="checkbox"
                              checked={editingExp.current}
                              onChange={(e) => setEditingExp({...editingExp, current: e.target.checked, endDate: e.target.checked ? "Present" : ""})}
                              className="accent-primary"
                            />
                            <span>Currently work here</span>
                          </label>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-dark-muted">Bullet Highlights (one per line)</label>
                          <textarea
                            placeholder="Mentored 4 junior developers and optimized dashboard loading.\nRedesigned microservices reducing latency metrics by 22%."
                            value={editingExp.highlights?.join("\n")}
                            onChange={(e) => setEditingExp({...editingExp, highlights: e.target.value.split("\n")})}
                            rows={4}
                            className="px-3 py-2 rounded-lg glass-input text-xs font-light leading-relaxed"
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingExp(null)} className="px-3 py-1.5 text-xs text-dark-muted hover:text-white font-medium">Cancel</button>
                          <button onClick={saveExperience} className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold">Save Position</button>
                        </div>
                      </div>
                    )}

                    {/* LIST OF EXPERIENCES */}
                    <div className="flex flex-col gap-4">
                      {profile.experiences.map((exp) => (
                        <div key={exp.id} className="p-4 border border-dark-border/60 bg-dark-card/20 rounded-xl flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{exp.company}</h4>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-dark-card text-dark-muted border border-dark-border">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-[10px] text-primary-light font-semibold mt-1">{exp.position}</p>
                            <ul className="list-disc pl-4 mt-2 flex flex-col gap-1 text-[10px] text-dark-muted leading-relaxed font-light">
                              {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditingExp(exp)} className="p-1 rounded hover:bg-dark-card text-dark-muted hover:text-white text-xs">Edit</button>
                            <button onClick={() => removeExperience(exp.id)} className="p-1 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 text-xs"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: Projects */}
                {profileSubTab === "projects" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Product & Projects Registry</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Keep track of items you built, repositories managed, or tools created. Highlight technologies used.</p>
                      </div>
                      <button
                        onClick={() => setEditingProj({
                          name: "",
                          description: "",
                          url: "",
                          github: "",
                          highlights: [],
                          technologies: []
                        })}
                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Plus size={12} /> Add Project
                      </button>
                    </div>

                    {/* PROJ EDITOR */}
                    {editingProj && (
                      <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          {editingProj.id ? "Edit Project Details" : "Register New Project"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Project Name"
                            value={editingProj.name}
                            onChange={(e) => setEditingProj({...editingProj, name: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Technologies (comma separated)"
                            value={editingProj.technologies?.join(", ")}
                            onChange={(e) => setEditingProj({...editingProj, technologies: e.target.value.split(",").map(t => t.trim())})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="url"
                            placeholder="Live URL"
                            value={editingProj.url}
                            onChange={(e) => setEditingProj({...editingProj, url: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="url"
                            placeholder="GitHub Repository URL"
                            value={editingProj.github}
                            onChange={(e) => setEditingProj({...editingProj, github: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-dark-muted">Summary Description</label>
                          <textarea
                            placeholder="Detail what makes this product amazing, user metrics, and scaling methodologies..."
                            value={editingProj.description}
                            onChange={(e) => setEditingProj({...editingProj, description: e.target.value})}
                            className="px-3 py-2 rounded-lg glass-input text-xs font-light"
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingProj(null)} className="px-3 py-1.5 text-xs text-dark-muted hover:text-white font-medium">Cancel</button>
                          <button onClick={saveProject} className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold">Save Project</button>
                        </div>
                      </div>
                    )}

                    {/* PROJECTS LIST */}
                    <div className="flex flex-col gap-4">
                      {profile.projects.map((proj) => (
                        <div key={proj.id} className="p-4 border border-dark-border/60 bg-dark-card/20 rounded-xl flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                            <p className="text-[10px] text-dark-muted mt-1 leading-relaxed font-light">{proj.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {proj.technologies.map((t, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-dark-card text-[9px] text-dark-muted border border-dark-border">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditingProj(proj)} className="p-1 rounded hover:bg-dark-card text-dark-muted hover:text-white text-xs">Edit</button>
                            <button onClick={() => removeProject(proj.id)} className="p-1 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 text-xs"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: Education */}
                {profileSubTab === "education" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Education Registry</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Manage your academic achievements, degrees, research details, and GPAs.</p>
                      </div>
                      <button
                        onClick={() => setEditingEdu({
                          institution: "",
                          degree: "",
                          fieldOfStudy: "",
                          startDate: "",
                          endDate: "",
                          current: false,
                          gpa: "",
                          details: ""
                        })}
                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Plus size={12} /> Add Academy
                      </button>
                    </div>

                    {/* EDU EDITOR */}
                    {editingEdu && (
                      <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          {editingEdu.id ? "Edit Academy Details" : "Register Academy Details"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Institution / School"
                            value={editingEdu.institution}
                            onChange={(e) => setEditingEdu({...editingEdu, institution: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Degree (e.g. B.S.)"
                            value={editingEdu.degree}
                            onChange={(e) => setEditingEdu({...editingEdu, degree: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Field of Study"
                            value={editingEdu.fieldOfStudy}
                            onChange={(e) => setEditingEdu({...editingEdu, fieldOfStudy: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="GPA (optional)"
                            value={editingEdu.gpa}
                            onChange={(e) => setEditingEdu({...editingEdu, gpa: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={editingEdu.startDate}
                            onChange={(e) => setEditingEdu({...editingEdu, startDate: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={editingEdu.endDate}
                            onChange={(e) => setEditingEdu({...editingEdu, endDate: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold text-dark-muted">Details & Research Notes</label>
                          <textarea
                            placeholder="Honors, Thesis publications, relevant coursework..."
                            value={editingEdu.details}
                            onChange={(e) => setEditingEdu({...editingEdu, details: e.target.value})}
                            className="px-3 py-2 rounded-lg glass-input text-xs font-light"
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingEdu(null)} className="px-3 py-1.5 text-xs text-dark-muted hover:text-white font-medium">Cancel</button>
                          <button onClick={saveEducation} className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold">Save Education</button>
                        </div>
                      </div>
                    )}

                    {/* EDU LIST */}
                    <div className="flex flex-col gap-4">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="p-4 border border-dark-border/60 bg-dark-card/20 rounded-xl flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{edu.institution}</h4>
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-dark-card text-dark-muted border border-dark-border">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <p className="text-[10px] text-primary-light font-semibold mt-1">{edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}</p>
                            {edu.details && <p className="text-[10px] text-dark-muted mt-2 font-light leading-relaxed">{edu.details}</p>}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditingEdu(edu)} className="p-1 rounded hover:bg-dark-card text-dark-muted hover:text-white text-xs">Edit</button>
                            <button onClick={() => removeEducation(edu.id)} className="p-1 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 text-xs"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: Skills */}
                {profileSubTab === "skills" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Skills Ledger</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Map languages, technologies, databases, frameworks and libraries.</p>
                      </div>
                      <button
                        onClick={() => setEditingSkill({
                          name: "",
                          level: "Advanced",
                          category: "Core Technologies"
                        })}
                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Plus size={12} /> Add Skill
                      </button>
                    </div>

                    {/* SKILL EDITOR */}
                    {editingSkill && (
                      <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          {editingSkill.id ? "Edit Skill" : "Add Skill"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="Skill Name (e.g. Rust)"
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <select
                            value={editingSkill.level}
                            onChange={(e) => setEditingSkill({...editingSkill, level: e.target.value as any})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Category (e.g. Languages)"
                            value={editingSkill.category}
                            onChange={(e) => setEditingSkill({...editingSkill, category: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingSkill(null)} className="px-3 py-1.5 text-xs text-dark-muted hover:text-white font-medium">Cancel</button>
                          <button onClick={saveSkill} className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold">Save Skill</button>
                        </div>
                      </div>
                    )}

                    {/* SKILLS LIST */}
                    <div className="flex flex-wrap gap-2.5">
                      {profile.skills.map((skill) => (
                        <div key={skill.id} className="py-2 px-3 border border-dark-border/60 bg-dark-card/25 rounded-lg flex items-center gap-2 text-xs">
                          <div>
                            <span className="font-bold text-white mr-1.5">{skill.name}</span>
                            <span className="text-[9px] text-primary-light bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">{skill.level}</span>
                          </div>
                          <button onClick={() => removeSkill(skill.id)} className="text-dark-muted hover:text-red-400 transition-all font-bold ml-1 text-[10px]">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Tab: Certifications */}
                {profileSubTab === "certifications" && profile && (
                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white font-heading tracking-wide mb-1">Certificates Ledger</h3>
                        <p className="text-[10px] text-dark-muted font-light leading-relaxed">Keep track of corporate or academic awards, certifications, or licenses.</p>
                      </div>
                      <button
                        onClick={() => setEditingCert({
                          name: "",
                          issuer: "",
                          date: "",
                          url: ""
                        })}
                        className="px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5"
                      >
                        <Plus size={12} /> Add Certificate
                      </button>
                    </div>

                    {/* CERT EDITOR */}
                    {editingCert && (
                      <div className="p-5 border border-primary/30 bg-primary/5 rounded-xl flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-primary-light uppercase tracking-wider">
                          {editingCert.id ? "Edit Certificate" : "Register Certificate"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Certificate Name"
                            value={editingCert.name}
                            onChange={(e) => setEditingCert({...editingCert, name: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Issuer"
                            value={editingCert.issuer}
                            onChange={(e) => setEditingCert({...editingCert, issuer: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Award Date"
                            value={editingCert.date}
                            onChange={(e) => setEditingCert({...editingCert, date: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                          <input
                            type="url"
                            placeholder="Verification Link (optional)"
                            value={editingCert.url}
                            onChange={(e) => setEditingCert({...editingCert, url: e.target.value})}
                            className="px-3 py-2.5 rounded-lg glass-input text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setEditingCert(null)} className="px-3 py-1.5 text-xs text-dark-muted hover:text-white font-medium">Cancel</button>
                          <button onClick={saveCertification} className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-bold">Save Certification</button>
                        </div>
                      </div>
                    )}

                    {/* CERT LIST */}
                    <div className="flex flex-col gap-4">
                      {profile.certifications.map((cert) => (
                        <div key={cert.id} className="p-4 border border-dark-border/60 bg-dark-card/20 rounded-xl flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                            <p className="text-[10px] text-primary-light font-semibold mt-1">Issued by: {cert.issuer} ({cert.date})</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setEditingCert(cert)} className="p-1 rounded hover:bg-dark-card text-dark-muted hover:text-white text-xs">Edit</button>
                            <button onClick={() => removeCertification(cert.id)} className="p-1 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 text-xs"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CREATE RESUME VERSION MODAL DIALOG */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel rounded-xl border border-white/5 shadow-premium overflow-hidden text-left"
            >
              <div className="p-6 border-b border-dark-border/40 bg-dark-card/50 flex justify-between items-center">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-light animate-pulse" /> Create Tailored Resume Copy
                </h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs text-dark-muted hover:text-white"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateResume} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Resume Version Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Stripe Senior Staff Backend Copy"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Select Theme Template</label>
                  <select
                    value={newResumeTemplate}
                    onChange={(e) => setNewResumeTemplate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                  >
                    <option value="classic-ats">Classic ATS (Traditional Serifs, High bots readability)</option>
                    <option value="minimal-modern">Minimal Modern (Clean Helvetica, balanced gaps)</option>
                    <option value="executive">Executive (Elite double lines, heavy text flow)</option>
                    <option value="creative-clean">Creative Clean (Elegant violet titles, dual columns)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Target Job Description (Optional keywords parsing)</label>
                  <textarea
                    placeholder="Paste the target job opening description here to run local keyword density checks and calculate matching percentages..."
                    rows={4}
                    value={newResumeJobDesc}
                    onChange={(e) => setNewResumeJobDesc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-xs font-light leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold tracking-wide transition-all shadow-glow flex items-center justify-center gap-1.5"
                >
                  Derive and Launch Editor <ChevronRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ExtractProfileModal
        isOpen={showExtractModal}
        onClose={() => setShowExtractModal(false)}
        onExtracted={handleExtractedProfile}
      />
    </div>
  );
};

export default Dashboard;
