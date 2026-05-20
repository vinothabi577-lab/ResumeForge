import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { 
  ArrowLeft, 
  Sparkles, 
  Eye, 
  Download, 
  Check, 
  Sliders, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code, 
  Award,
  EyeOff
} from "lucide-react";
import { useStore } from "../store/useStore";
import { mergeProfileWithOverrides } from "../utils/merge";
import { PdfDocument } from "../components/PdfDocument";
import { ResumeOverrides } from "../../../shared/types";

// Standard English stop words to filter out when parsing Job Descriptions for ATS keywords
const STOP_WORDS = new Set([
  "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", 
  "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", 
  "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", 
  "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", 
  "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", 
  "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", 
  "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", 
  "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", 
  "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", 
  "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", 
  "will", "just", "don", "should", "now", "using", "with", "experience", "role", "work", "job", 
  "team", "skills", "ability", "years"
]);

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  // Stores
  const profile = useStore((state) => state.profile);
  const fetchResumeById = useStore((state) => state.fetchResumeById);
  const updateResume = useStore((state) => state.updateResume);

  // Editor states
  const [editorSubTab, setEditorSubTab] = useState<"general" | "experience" | "projects" | "education" | "skills" | "certifications">("general");
  const [localOverrides, setLocalOverrides] = useState<ResumeOverrides>({});
  const [localTitle, setLocalTitle] = useState("");
  const [localTemplate, setLocalTemplate] = useState("classic-ats");
  const [localJobDesc, setLocalJobDesc] = useState("");
  
  // Autosave status indicator
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showAtsDrawer, setShowAtsDrawer] = useState(false);

  // Load active copy data
  useEffect(() => {
    if (id) {
      fetchResumeById(id).then((resume) => {
        if (resume) {
          setLocalOverrides(resume.overrides || {});
          setLocalTitle(resume.title || "");
          setLocalTemplate(resume.templateId || "classic-ats");
          setLocalJobDesc(resume.jobDescription || "");
        }
      });
    }
  }, [id, fetchResumeById]);

  // Unified dynamic deep merged profile data
  const mergedProfile = useMemo(() => {
    return mergeProfileWithOverrides(profile, localOverrides);
  }, [profile, localOverrides]);

  // Dynamic lightweight local ATS Analysis Engine
  const atsResult = useMemo(() => {
    const textToScan = [
      mergedProfile.personalInfo?.fullName,
      mergedProfile.personalInfo?.title,
      mergedProfile.personalInfo?.summary,
      ...mergedProfile.experiences.map(e => `${e.company} ${e.position} ${e.highlights.join(" ")}`),
      ...mergedProfile.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(" ")}`),
      ...mergedProfile.education.map(e => `${e.institution} ${e.degree} ${e.fieldOfStudy}`),
      ...mergedProfile.skills.map(s => s.name),
      ...mergedProfile.certifications.map(c => c.name),
    ].join(" ").toLowerCase();

    // Parse job description keywords
    const descWords = localJobDesc
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w));

    // Get unique top keywords from JD
    const keywordFreq: Record<string, number> = {};
    descWords.forEach(w => {
      keywordFreq[w] = (keywordFreq[w] || 0) + 1;
    });

    const sortedKeywords = Object.entries(keywordFreq)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 15); // get top 15 matching terms

    if (sortedKeywords.length === 0) {
      return {
        score: 60, // base score for completing basic profile segments
        foundKeywords: [],
        missingKeywords: [],
        metricsCheck: true,
        actionVerbsCheck: true
      };
    }

    const foundKeywords = sortedKeywords.filter(kw => textToScan.includes(kw));
    const missingKeywords = sortedKeywords.filter(kw => !textToScan.includes(kw));

    // Numeric metrics usage check (e.g. 20%, $50K, 15x)
    const hasMetrics = /\d+%|\d+\s?%|\d+\s?x|\$\d+|\d+\s?m|\d+\s?k/i.test(textToScan);
    
    // Action verbs check
    const actionVerbs = ["optimized", "delivered", "led", "mentored", "orchestrated", "automated", "designed", "architected", "migrated", "built"];
    const foundVerbs = actionVerbs.filter(v => textToScan.includes(v));

    const keywordPercentage = (foundKeywords.length / sortedKeywords.length) * 100;
    let score = Math.round(keywordPercentage * 0.6 + (hasMetrics ? 20 : 0) + (foundVerbs.length >= 3 ? 20 : foundVerbs.length * 6));
    score = Math.max(10, Math.min(100, score));

    return {
      score,
      foundKeywords,
      missingKeywords,
      metricsCheck: hasMetrics,
      actionVerbsCheck: foundVerbs.length >= 3
    };
  }, [mergedProfile, localJobDesc]);

  // Debounced auto-save handler to commit changes to the backend
  useEffect(() => {
    if (!id || !localTitle) return;
    
    setSaveStatus("saving");
    const delayDebounce = setTimeout(async () => {
      await updateResume(id, {
        title: localTitle,
        templateId: localTemplate,
        jobDescription: localJobDesc,
        overrides: localOverrides,
        atsScore: atsResult.score,
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    }, 1000); // 1-second debounce

    return () => clearTimeout(delayDebounce);
  }, [localTitle, localTemplate, localJobDesc, localOverrides, atsResult.score, id, updateResume]);

  // --- Handlers for Overrides ---
  const handleToggleHide = (section: keyof ResumeOverrides, itemId: string) => {
    const sectionOverrides = { ...(localOverrides[section] || {}) } as any;
    sectionOverrides[itemId] = {
      ...(sectionOverrides[itemId] || {}),
      hidden: !sectionOverrides[itemId]?.hidden,
    };
    
    setLocalOverrides({
      ...localOverrides,
      [section]: sectionOverrides,
    });
  };

  const handleUpdatePersonalInfoOverride = (field: string, val: string) => {
    const personalInfo = { ...(localOverrides.personalInfo || {}), [field]: val };
    setLocalOverrides({
      ...localOverrides,
      personalInfo,
    });
  };

  const handleUpdateExpOverride = (expId: string, field: string, val: any) => {
    const experiences = { ...(localOverrides.experiences || {}) } as any;
    experiences[expId] = {
      ...(experiences[expId] || {}),
      [field]: val,
    };
    setLocalOverrides({
      ...localOverrides,
      experiences,
    });
  };

  const PDFDownloadLinkAny = PDFDownloadLink as any;

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text flex flex-col font-sans overflow-hidden">
      
      {/* Editor Header Navigation bar */}
      <header className="h-16 border-b border-dark-border/40 bg-dark-bg/85 flex items-center justify-between px-6 z-40 select-none">
        <div className="flex items-center gap-4">
          <Link 
            to="/dashboard" 
            className="p-2 rounded-lg border border-dark-border bg-dark-card hover:bg-dark-card/80 text-dark-muted hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
          </Link>
          <div className="flex flex-col text-left">
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-white focus:outline-none focus:ring-0 p-0 max-w-[200px]"
            />
            <span className="text-[10px] text-dark-muted">Living Workspace Editor</span>
          </div>
        </div>

        {/* Templates Quick Selector */}
        <div className="hidden md:flex items-center gap-2 bg-dark-card/60 p-1 border border-dark-border rounded-lg">
          {["classic-ats", "minimal-modern", "executive", "creative-clean"].map((tempId) => (
            <button
              key={tempId}
              onClick={() => setLocalTemplate(tempId)}
              className={`px-3 py-1 rounded text-[10px] font-semibold capitalize transition-all ${
                localTemplate === tempId ? "bg-primary text-white" : "text-dark-muted hover:text-white"
              }`}
            >
              {tempId.replace("-", " ")}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status Notification */}
          <div className="text-[11px] font-medium text-dark-muted">
            {saveStatus === "saving" && <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div> Syncing...</span>}
            {saveStatus === "saved" && <span className="flex items-center gap-1 text-accent"><Check size={12} /> Autosaved</span>}
            {saveStatus === "idle" && <span className="text-dark-muted/40">Synced</span>}
          </div>

          {/* ATS Ring Button */}
          <button
            onClick={() => setShowAtsDrawer(true)}
            className="px-3 py-1.5 rounded-lg border border-dark-border hover:border-accent bg-dark-card flex items-center gap-2 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-bold text-dark-muted">ATS Compliance</span>
            <div className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
              atsResult.score >= 80 ? "bg-accent/10 text-accent border border-accent/20" : "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20"
            }`}>
              {atsResult.score}%
            </div>
          </button>

          {/* Client-Side React-PDF Downloader Button */}
          <PDFDownloadLinkAny
            document={<PdfDocument mergedData={mergedProfile} templateId={localTemplate} />}
            fileName={`${localTitle.replace(/\s+/g, "_")}_resume.pdf`}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-glow flex items-center gap-1.5"
          >
            {({ loading }: any) => (
              <>
                <Download size={14} />
                {loading ? "Compiling..." : "Export PDF"}
              </>
            )}
          </PDFDownloadLinkAny>
        </div>
      </header>

      {/* Editor Content Area (Split Screen) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT PANEL: Override Editors */}
        <div className="lg:col-span-5 border-r border-dark-border/40 bg-dark-card/15 flex flex-col overflow-hidden">
          
          {/* Sub navigation of items */}
          <div className="flex border-b border-dark-border/40 bg-dark-card/50 overflow-x-auto select-none">
            {[
              { id: "general", label: "General", icon: Sliders },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "projects", label: "Projects", icon: FolderGit2 },
              { id: "education", label: "Education", icon: GraduationCap },
              { id: "skills", label: "Skills", icon: Code },
              { id: "certifications", label: "Awards", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setEditorSubTab(tab.id as any)}
                  className={`py-3.5 px-4 text-xs font-semibold flex-shrink-0 transition-all flex items-center gap-1.5 ${
                    editorSubTab === tab.id ? "text-primary-light border-b-2 border-primary bg-dark-bg/40 font-bold" : "text-dark-muted hover:text-white"
                  }`}
                >
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Overrides Input Workspace */}
          <div className="flex-1 overflow-y-auto p-6 text-left flex flex-col gap-6">
            
            {/* Editor Sub-Tab: General (Title, JD & Personal overrides) */}
            {editorSubTab === "general" && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Local Job Targeting</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Paste the targeted job opening text here. The system parses keywords in real time, giving instant ATS scoring checks.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Job Description Specification</label>
                  <textarea
                    value={localJobDesc}
                    onChange={(e) => setLocalJobDesc(e.target.value)}
                    placeholder="Paste full job description text here..."
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs font-light leading-relaxed"
                  />
                </div>

                <div className="border-t border-dark-border/40 pt-6">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Personal Info Overrides</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-dark-muted">Override Name</label>
                      <input
                        type="text"
                        placeholder="Sarah Jenkins"
                        value={localOverrides.personalInfo?.fullName || ""}
                        onChange={(e) => handleUpdatePersonalInfoOverride("fullName", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-dark-muted">Override Title</label>
                      <input
                        type="text"
                        placeholder="Lead Engineer (Systems)"
                        value={localOverrides.personalInfo?.title || ""}
                        onChange={(e) => handleUpdatePersonalInfoOverride("title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Sub-Tab: Experiences overrides (hide/show + modify role + edit bullets) */}
            {editorSubTab === "experience" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Experiences Overrides</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Toggle hidden checkboxes to omit jobs, or modify bullets and job roles to custom match the target description.</p>
                </div>

                {profile?.experiences.map((exp) => {
                  const ov = localOverrides.experiences?.[exp.id] || {};
                  const isHidden = ov.hidden === true;
                  
                  return (
                    <div 
                      key={exp.id} 
                      className={`p-4 border rounded-xl flex flex-col gap-3.5 transition-all ${
                        isHidden ? "border-dark-border bg-dark-card/10 opacity-55" : "border-dark-border/80 bg-dark-card/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{exp.company}</h4>
                          <span className="text-[9px] text-dark-muted font-light">{exp.startDate} – {exp.endDate}</span>
                        </div>
                        <button
                          onClick={() => handleToggleHide("experiences", exp.id)}
                          className="px-2.5 py-1 rounded bg-dark-card border border-dark-border text-[9px] font-bold text-dark-muted hover:text-white flex items-center gap-1"
                        >
                          {isHidden ? <Eye size={10} /> : <EyeOff size={10} />}
                          {isHidden ? "Show" : "Hide Position"}
                        </button>
                      </div>

                      {!isHidden && (
                        <div className="flex flex-col gap-3 border-t border-dark-border/30 pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold text-dark-muted">Role Title Override (Local)</label>
                            <input
                              type="text"
                              value={ov.position || ""}
                              onChange={(e) => handleUpdateExpOverride(exp.id, "position", e.target.value)}
                              placeholder={exp.position}
                              className="px-3 py-2 rounded-lg glass-input text-xs font-medium"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-semibold text-dark-muted">Bullet Highlights Overrides (Local)</label>
                            <textarea
                              value={(ov.highlights || exp.highlights).join("\n")}
                              onChange={(e) => handleUpdateExpOverride(exp.id, "highlights", e.target.value.split("\n"))}
                              rows={4}
                              className="px-3 py-2 rounded-lg glass-input text-xs font-light leading-relaxed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Editor Sub-Tab: Projects overrides */}
            {editorSubTab === "projects" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Projects Overrides</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Toggle hidden checkboxes to only keep highly relevant products/projects matching this target role copy.</p>
                </div>

                {profile?.projects.map((proj) => {
                  const ov = localOverrides.projects?.[proj.id] || {};
                  const isHidden = ov.hidden === true;

                  return (
                    <div 
                      key={proj.id} 
                      className={`p-4 border rounded-xl flex justify-between items-center transition-all ${
                        isHidden ? "border-dark-border bg-dark-card/10 opacity-55" : "border-dark-border/80 bg-dark-card/30"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                        <span className="text-[9px] text-dark-muted mt-1 block truncate max-w-[200px]">{proj.description}</span>
                      </div>
                      <button
                        onClick={() => handleToggleHide("projects", proj.id)}
                        className="px-2.5 py-1 rounded bg-dark-card border border-dark-border text-[9px] font-bold text-dark-muted hover:text-white flex items-center gap-1"
                      >
                        {isHidden ? <Eye size={10} /> : <EyeOff size={10} />}
                        {isHidden ? "Show" : "Hide"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Editor Sub-Tab: Education overrides */}
            {editorSubTab === "education" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Education Overrides</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Toggle hidden academic segments.</p>
                </div>

                {profile?.education.map((edu) => {
                  const ov = localOverrides.education?.[edu.id] || {};
                  const isHidden = ov.hidden === true;

                  return (
                    <div 
                      key={edu.id} 
                      className={`p-4 border rounded-xl flex justify-between items-center transition-all ${
                        isHidden ? "border-dark-border bg-dark-card/10 opacity-55" : "border-dark-border/80 bg-dark-card/30"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{edu.institution}</h4>
                        <span className="text-[9px] text-dark-muted mt-1 block">{edu.degree} in {edu.fieldOfStudy}</span>
                      </div>
                      <button
                        onClick={() => handleToggleHide("education", edu.id)}
                        className="px-2.5 py-1 rounded bg-dark-card border border-dark-border text-[9px] font-bold text-dark-muted hover:text-white flex items-center gap-1"
                      >
                        {isHidden ? <Eye size={10} /> : <EyeOff size={10} />}
                        {isHidden ? "Show" : "Hide"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Editor Sub-Tab: Skills overrides */}
            {editorSubTab === "skills" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Skills Overrides</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Hide specific technologies or skills that are irrelevant to this specific tailored version copy.</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {profile?.skills.map((skill) => {
                    const ov = localOverrides.skills?.[skill.id] || {};
                    const isHidden = ov.hidden === true;

                    return (
                      <button
                        key={skill.id}
                        onClick={() => handleToggleHide("skills", skill.id)}
                        className={`py-2 px-3 border rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isHidden 
                            ? "border-dark-border bg-dark-card/10 text-dark-muted/50 line-through" 
                            : "border-primary/20 bg-primary/5 text-primary-light hover:border-primary/50"
                        }`}
                      >
                        {skill.name}
                        {isHidden ? <Eye size={10} /> : <EyeOff size={10} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Editor Sub-Tab: Certifications overrides */}
            {editorSubTab === "certifications" && (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Certifications Overrides</h3>
                  <p className="text-[10px] text-dark-muted leading-relaxed">Omit unnecessary certifications.</p>
                </div>

                {profile?.certifications.map((cert) => {
                  const ov = localOverrides.certifications?.[cert.id] || {};
                  const isHidden = ov.hidden === true;

                  return (
                    <div 
                      key={cert.id} 
                      className={`p-4 border rounded-xl flex justify-between items-center transition-all ${
                        isHidden ? "border-dark-border bg-dark-card/10 opacity-55" : "border-dark-border/80 bg-dark-card/30"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white">{cert.name}</h4>
                        <span className="text-[9px] text-dark-muted mt-1 block">{cert.issuer} ({cert.date})</span>
                      </div>
                      <button
                        onClick={() => handleToggleHide("certifications", cert.id)}
                        className="px-2.5 py-1 rounded bg-dark-card border border-dark-border text-[9px] font-bold text-dark-muted hover:text-white flex items-center gap-1"
                      >
                        {isHidden ? <Eye size={10} /> : <EyeOff size={10} />}
                        {isHidden ? "Show" : "Hide"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live sub-millisecond HTML/CSS Preview Canvas */}
        <div className="lg:col-span-7 bg-[#1e2028] p-8 flex items-start justify-center overflow-y-auto z-10">
          
          <div 
            className={`w-full max-w-2xl bg-white border border-slate-200 shadow-premium p-10 rounded text-left text-slate-800 flex flex-col gap-5 select-text min-h-[842px]`}
            style={{
              fontFamily: localTemplate === "classic-ats" || localTemplate === "executive" ? "Times New Roman, Georgia, serif" : "Inter, Arial, sans-serif"
            }}
          >
            {/* Header segment */}
            <div className={`text-center pb-4 ${
              localTemplate === "executive" ? "border-b-2 border-slate-900" : "border-b border-slate-300"
            }`}>
              <h2 
                className="text-xl font-bold tracking-tight text-slate-900 uppercase"
                style={{
                  color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#0f172a"
                }}
              >
                {mergedProfile.personalInfo?.fullName || "Your Full Name"}
              </h2>
              {mergedProfile.personalInfo?.title && (
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{mergedProfile.personalInfo.title}</p>
              )}

              <div className="text-[10px] text-slate-500 flex justify-center gap-3 mt-2 flex-wrap font-medium">
                {mergedProfile.personalInfo?.email && <span>{mergedProfile.personalInfo.email}</span>}
                {mergedProfile.personalInfo?.phone && (
                  <>
                    <span>•</span>
                    <span>{mergedProfile.personalInfo.phone}</span>
                  </>
                )}
                {mergedProfile.personalInfo?.location && (
                  <>
                    <span>•</span>
                    <span>{mergedProfile.personalInfo.location}</span>
                  </>
                )}
                {mergedProfile.personalInfo?.website && (
                  <>
                    <span>•</span>
                    <span className="underline">{mergedProfile.personalInfo.website}</span>
                  </>
                )}
              </div>
            </div>

            {/* Summary segment */}
            {mergedProfile.personalInfo?.summary && (
              <div className="flex flex-col gap-1 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Summary
                </h3>
                <p className="text-[10.5px] leading-relaxed text-slate-600 font-light text-justify mt-1">
                  {mergedProfile.personalInfo.summary}
                </p>
              </div>
            )}

            {/* Experience segment */}
            {mergedProfile.experiences.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Professional Experience
                </h3>
                
                <div className="flex flex-col gap-4">
                  {mergedProfile.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between font-bold text-[10.5px] text-slate-900">
                        <span>{exp.company}</span>
                        <span>{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px] italic">
                        <span>{exp.position}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>

                      {exp.highlights.length > 0 && (
                        <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1.5 text-[10px] text-slate-600 font-light">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-justify">{h}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects segment */}
            {mergedProfile.projects.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Key Projects
                </h3>
                
                <div className="flex flex-col gap-3">
                  {mergedProfile.projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between font-bold text-[10.5px] text-slate-900">
                        <span>{proj.name}</span>
                        {proj.github && <span className="text-[9.5px] text-slate-400 font-normal underline">{proj.github}</span>}
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1 font-light leading-relaxed">{proj.description}</p>
                      {proj.technologies.length > 0 && (
                        <span className="text-[9px] text-slate-400 font-semibold block mt-1">
                          Technologies: {proj.technologies.join(", ")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education segment */}
            {mergedProfile.education.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Education
                </h3>
                
                <div className="flex flex-col gap-3">
                  {mergedProfile.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between font-bold text-[10.5px] text-slate-900">
                        <span>{edu.institution}</span>
                        <span>{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[10px] italic">
                        <span>{edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `(GPA: ${edu.gpa})` : ""}</span>
                        {edu.location && <span>{edu.location}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills segment */}
            {mergedProfile.skills.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mergedProfile.skills.map((skill) => (
                    <span 
                      key={skill.id} 
                      className="px-2 py-0.5 border border-slate-300 rounded text-[9.5px] font-medium bg-slate-50 text-slate-700"
                    >
                      {skill.name} {skill.level ? `(${skill.level})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications segment */}
            {mergedProfile.certifications.length > 0 && (
              <div className="flex flex-col gap-2.5 text-xs">
                <h3 
                  className="font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] pb-0.5 text-slate-800"
                  style={{
                    color: localTemplate === "creative-clean" ? "#7c3aed" : localTemplate === "executive" ? "#1e3a8a" : "#1f2937"
                  }}
                >
                  Certifications & Awards
                </h3>
                <div className="flex flex-col gap-1.5">
                  {mergedProfile.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between text-[10px] text-slate-700">
                      <span className="font-bold text-slate-900">{cert.name}</span>
                      <span>{cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATS COMPLIANCE DRAWER (MODAL) */}
      <AnimatePresence>
        {showAtsDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-dark-card border-l border-dark-border text-left flex flex-col justify-between shadow-premium z-50"
            >
              <div className="p-6 border-b border-dark-border/40 bg-dark-card/50 flex justify-between items-center">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-light animate-pulse" /> ATS Analytics Intelligence
                </h3>
                <button 
                  onClick={() => setShowAtsDrawer(false)}
                  className="text-xs text-dark-muted hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                
                {/* Circular Gauge Banner */}
                <div className="p-6 bg-dark-bg/60 border border-dark-border rounded-xl flex items-center gap-5">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#202430" strokeWidth="4" fill="transparent" />
                      <circle cx="32" cy="32" r="26" 
                        stroke={atsResult.score >= 80 ? "#10b981" : "#f59e0b"} 
                        strokeWidth="4" fill="transparent" 
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - atsResult.score / 100)}
                      />
                    </svg>
                    <span className="absolute text-sm font-black text-white">{atsResult.score}%</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white mb-1">Local Keyword Score</h4>
                    <p className="text-[10px] text-dark-muted font-light leading-relaxed">
                      {atsResult.score >= 80 
                        ? "Excellent job targeting. The resume has dense key integrations matching description keywords." 
                        : "Low matching density. Paste the target description under the General tab and integrate suggested terms."}
                    </p>
                  </div>
                </div>

                {/* JD Keyword density checks */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Target Keywords Matrix</h4>
                  
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-dark-muted font-semibold">Matched Keywords ({atsResult.foundKeywords.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.foundKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[9px] text-accent font-semibold capitalize">
                          {kw}
                        </span>
                      ))}
                      {atsResult.foundKeywords.length === 0 && <span className="text-[10px] text-dark-muted italic">None yet.</span>}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-dark-muted font-semibold">Missing target keywords ({atsResult.missingKeywords.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {atsResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 font-semibold capitalize">
                          {kw}
                        </span>
                      ))}
                      {atsResult.missingKeywords.length === 0 && <span className="text-[10px] text-dark-muted italic">No missing target keywords. Outstanding!</span>}
                    </div>
                  </div>
                </div>

                {/* Standard checks */}
                <div className="flex flex-col gap-3 border-t border-dark-border/40 pt-5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Core Formatting Checkers</h4>
                  
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-muted">1. Quantitative Metrics Usage</span>
                      <span className={`font-semibold ${atsResult.metricsCheck ? "text-accent" : "text-accent-yellow"}`}>
                        {atsResult.metricsCheck ? "Passed" : "Warning"}
                      </span>
                    </div>
                    <p className="text-[10px] text-dark-muted leading-relaxed font-light">
                      Resumes with numerical proof (e.g. "improved conversions by 15%") rate 40% higher. Ensure bullet points highlight statistics.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-dark-muted">2. Action Verbs Density</span>
                      <span className={`font-semibold ${atsResult.actionVerbsCheck ? "text-accent" : "text-accent-yellow"}`}>
                        {atsResult.actionVerbsCheck ? "Passed" : "Needs work"}
                      </span>
                    </div>
                    <p className="text-[10px] text-dark-muted leading-relaxed font-light">
                      Use strong descriptive verbs (Optimized, Designed, Orchestrated, Built) to define achievements rather than passive statements.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-dark-card/30 border-t border-dark-border/40 text-[10px] text-dark-muted leading-relaxed text-center font-light select-none">
                All parsed heuristics are calculated locally in your browser. Complete document security maintained.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Editor;
