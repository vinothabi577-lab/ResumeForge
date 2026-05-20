import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wand2, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { extractProfileWithGemini } from "../utils/gemini";
import { PersonalInfo, Experience, Education, Skill, Project, Certification } from "../../../shared/types";

interface ExtractProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (data: {
    personalInfo: Partial<PersonalInfo>;
    experiences: Partial<Experience>[];
    education: Partial<Education>[];
    skills: Partial<Skill>[];
    projects: Partial<Project>[];
    certifications: Partial<Certification>[];
  }) => void;
}

export const ExtractProfileModal: React.FC<ExtractProfileModalProps> = ({ isOpen, onClose, onExtracted }) => {
  const [inputText, setInputText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleExtract = async () => {
    if (!inputText.trim()) {
      setError("Please paste your resume details first.");
      return;
    }

    setIsExtracting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await extractProfileWithGemini(inputText);
      
      if (result) {
        const experiences = (result.experiences || []).map((exp: any) => ({
          ...exp,
          id: "exp_" + Date.now() + Math.random().toString(36).substr(2, 9),
          highlights: exp.highlights || [],
          current: exp.current || false,
        })) as Partial<Experience>[];

        const education = (result.education || []).map((edu: any) => ({
          ...edu,
          id: "edu_" + Date.now() + Math.random().toString(36).substr(2, 9),
          current: edu.current || false,
        })) as Partial<Education>[];

        const skills = (result.skills || []).map((skill: any) => ({
          ...skill,
          id: "skill_" + Date.now() + Math.random().toString(36).substr(2, 9),
        })) as Partial<Skill>[];

        const projects = (result.projects || []).map((proj: any) => ({
          ...proj,
          id: "proj_" + Date.now() + Math.random().toString(36).substr(2, 9),
          highlights: proj.highlights || [],
          technologies: proj.technologies || [],
        })) as Partial<Project>[];

        const certifications = (result.certifications || []).map((cert: any) => ({
          ...cert,
          id: "cert_" + Date.now() + Math.random().toString(36).substr(2, 9),
        })) as Partial<Certification>[];

        onExtracted({
          personalInfo: result.personalInfo || {},
          experiences,
          education,
          skills,
          projects,
          certifications,
        });

        setSuccess(true);
        setTimeout(() => {
          onClose();
          setInputText("");
          setSuccess(false);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Failed to extract profile. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClose = () => {
    if (!isExtracting) {
      onClose();
      setInputText("");
      setError(null);
      setSuccess(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-dark-border/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Wand2 size={18} className="text-primary-light" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-heading">AI Profile Extractor</h2>
                  <p className="text-[10px] text-dark-muted font-light">Paste your resume details and let AI fill everything</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isExtracting}
                className="p-2 rounded-lg hover:bg-dark-border/40 text-dark-muted hover:text-white transition-all disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div className="p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-lg flex items-start gap-3">
                <FileText size={16} className="text-accent-blue mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-accent-blue/90 font-light leading-relaxed">
                  <strong>Tip:</strong> Paste your LinkedIn profile summary, existing resume text, or any professional description. 
                  The AI will extract and organize all your information into the profile fields.
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-dark-muted">Resume / Profile Details</label>
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Paste your resume content here...\n\nExample:\nSarah Jenkins\nSenior Software Engineer at Tech Corp\nEmail: sarah@example.com\nPhone: (415) 555-1982\n\nExperience:\nTech Corp, Senior Software Engineer, 2020-Present\n- Led development of microservices architecture\n- Mentored 4 junior developers\n\nEducation:\nStanford University, B.S. Computer Science, 2016-2020\n\nSkills: JavaScript, Python, React, Node.js`}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs font-light leading-relaxed resize-none"
                  disabled={isExtracting}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-[11px] text-red-400">{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2"
                >
                  <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] text-emerald-400">Profile extracted successfully!</span>
                </motion.div>
              )}
            </div>

            <div className="p-6 pt-0 flex justify-end gap-3">
              <button
                onClick={handleClose}
                disabled={isExtracting}
                className="px-5 py-2.5 rounded-xl border border-dark-border bg-dark-bg/40 text-dark-muted text-xs font-semibold hover:text-white hover:bg-dark-card/60 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExtract}
                disabled={isExtracting || !inputText.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExtracting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Wand2 size={14} />
                    Extract Profile
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};