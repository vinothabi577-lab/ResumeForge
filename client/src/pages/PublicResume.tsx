import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, User, ArrowLeft } from "lucide-react";
import axios from "axios";
import { mergeProfileWithOverrides } from "../utils/merge";
import { PdfDocument } from "../components/PdfDocument";
import { ResumeVersion, MasterProfile } from "../../../shared/types";

const PublicResume = () => {
  const { id } = useParams<{ id: string }>();
  const [resumeData, setResumeData] = useState<ResumeVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load public copy data
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/resumes/public/${id}`)
        .then((res) => {
          setResumeData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to locate public resume record. It might have been deleted or set to private.");
          setLoading(false);
        });
    }
  }, [id]);

  // Unified dynamic deep merged profile data
  const mergedProfile = useMemo(() => {
    if (!resumeData) return null;
    return mergeProfileWithOverrides(resumeData.masterProfileId as unknown as MasterProfile, resumeData.overrides);
  }, [resumeData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center font-heading">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-dark-muted text-sm font-medium tracking-wide">Retrieving Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !resumeData || !mergedProfile) {
    return (
      <div className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center font-sans p-6">
        <div className="w-full max-w-md glass-panel p-8 border border-red-500/25 bg-red-500/5 rounded-2xl flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <User size={24} />
          </div>
          <h2 className="font-heading font-extrabold text-lg text-white">Profile Unavailable</h2>
          <p className="text-xs text-dark-muted leading-relaxed font-light">{error || "Could not retrieve document."}</p>
          <Link to="/" className="mt-2 text-xs text-primary-light hover:underline flex items-center gap-1.5">
            <ArrowLeft size={12} /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const PDFDownloadLinkAny = PDFDownloadLink as any;

  return (
    <div className="min-h-screen bg-[#111317] text-slate-800 flex flex-col font-sans">
      
      {/* Top Banner for Public view */}
      <div className="bg-dark-card/95 border-b border-dark-border/40 py-3.5 px-6 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white font-bold text-sm shadow-glow">
            RF
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Public Portfolio Ledger: <strong className="text-primary-light">{mergedProfile.personalInfo.fullName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Client-Side React-PDF Downloader Button */}
          <PDFDownloadLinkAny
            document={<PdfDocument mergedData={mergedProfile} templateId={resumeData.templateId} />}
            fileName={`${mergedProfile.personalInfo.fullName.replace(/\s+/g, "_")}_resume.pdf`}
            className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-glow flex items-center gap-1.5"
          >
            {({ loading }: any) => (
              <>
                <Download size={14} />
                {loading ? "Compiling..." : "Download Official PDF"}
              </>
            )}
          </PDFDownloadLinkAny>
        </div>
      </div>

      {/* Sheet Frame Container */}
      <div className="flex-1 py-12 px-6 flex justify-center bg-[#181a20]">
        
        <div 
          className="w-full max-w-2xl bg-white border border-slate-200 shadow-premium p-12 rounded text-left flex flex-col gap-6"
          style={{
            fontFamily: resumeData.templateId === "classic-ats" || resumeData.templateId === "executive" ? "Times New Roman, Georgia, serif" : "Inter, Arial, sans-serif"
          }}
        >
          {/* Header segment */}
          <div className={`text-center pb-4 ${
            resumeData.templateId === "executive" ? "border-b-2 border-slate-900" : "border-b border-slate-300"
          }`}>
            <h2 
              className="text-xl font-bold tracking-tight text-slate-900 uppercase"
              style={{
                color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#0f172a"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
                  color: resumeData.templateId === "creative-clean" ? "#7c3aed" : resumeData.templateId === "executive" ? "#1e3a8a" : "#1f2937"
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
  );
};

export default PublicResume;
