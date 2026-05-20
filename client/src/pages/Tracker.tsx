import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign, 
  FileText, 
  ChevronRight, 
  Briefcase,
  Sparkles
} from "lucide-react";
import { useStore } from "../store/useStore";
import { JobApplication } from "../../../shared/types";

const TRACKER_COLUMNS: { id: JobApplication["status"]; label: string; color: string }[] = [
  { id: "Wishlist", label: "Wishlist", color: "border-slate-500/20 bg-slate-500/5 text-slate-400" },
  { id: "Applied", label: "Applied", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
  { id: "Interviewing", label: "Interviewing", color: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400" },
  { id: "Offer", label: "Offer", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
  { id: "Rejected", label: "Rejected", color: "border-red-500/20 bg-red-500/5 text-red-400" },
];

const Tracker = () => {
  const applications = useStore((state) => state.applications);
  const resumes = useStore((state) => state.resumes);
  const createApplication = useStore((state) => state.createApplication);
  const updateApplication = useStore((state) => state.updateApplication);
  const deleteApplication = useStore((state) => state.deleteApplication);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<JobApplication["status"]>("Wishlist");

  // New Application inputs
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [linkedResumeId, setLinkedResumeId] = useState("");

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !position) return;

    await createApplication({
      company,
      position,
      status: selectedColumn,
      salary,
      location,
      jobUrl,
      notes,
      resumeVersionId: linkedResumeId || undefined,
    });

    // Reset inputs
    setCompany("");
    setPosition("");
    setSalary("");
    setLocation("");
    setJobUrl("");
    setNotes("");
    setLinkedResumeId("");
    setShowAddModal(false);
  };

  const handleStatusChange = async (appId: string, newStatus: JobApplication["status"]) => {
    await updateApplication(appId, { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text relative grid-bg flex flex-col font-sans">
      
      {/* Header */}
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
            <Link to="/dashboard" className="text-dark-muted hover:text-white transition-colors">
              Workspace
            </Link>
            <Link to="/tracker" className="text-primary-light hover:text-white transition-colors flex items-center gap-1.5">
              <Plus size={14} /> Job Tracker
            </Link>
          </nav>

          <div className="w-2" />
        </div>
      </header>

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col gap-8 z-10">
        
        {/* Title bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dark-border/40 pb-6">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-white mb-1.5 flex items-center gap-2.5">
              <Briefcase className="text-primary-light" /> Job Application Kanban
            </h1>
            <p className="text-xs text-dark-muted font-light leading-relaxed">
              Track active corporate pursuits, organize interviews, and tie linked tailored resume versions to see which copy earns responses.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedColumn("Wishlist");
              setShowAddModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wider transition-all shadow-glow flex items-center gap-1.5"
          >
            <Plus size={14} /> Track New Opening
          </button>
        </div>

        {/* Kanban Board Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-5 items-start overflow-x-auto min-h-[500px]">
          {TRACKER_COLUMNS.map((col) => {
            const colApps = applications.filter((app) => app.status === col.id);

            return (
              <div 
                key={col.id} 
                className="flex flex-col gap-4 bg-dark-card/20 border border-dark-border/60 rounded-xl p-4 min-w-[220px]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-lg border text-xs font-bold flex justify-between items-center ${col.color} select-none`}>
                  <span>{col.label}</span>
                  <span className="bg-dark-card/80 px-2 py-0.5 rounded text-[10px] font-black">{colApps.length}</span>
                </div>

                {/* Cards List */}
                <div className="flex flex-col gap-3 min-h-[400px]">
                  {colApps.map((app) => {
                    const linkedResume = resumes.find(r => r._id === app.resumeVersionId);
                    
                    return (
                      <div 
                        key={app._id} 
                        className="p-4 bg-dark-card/45 border border-dark-border/60 rounded-lg hover:border-dark-borderLight transition-all flex flex-col gap-3 text-left group relative"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white tracking-wide truncate">{app.company}</h4>
                          <span className="text-[10px] text-dark-muted block mt-0.5 truncate">{app.position}</span>
                        </div>

                        {/* Badges metadata info */}
                        <div className="flex flex-col gap-1.5 text-[9px] text-dark-muted font-light">
                          {app.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={10} /> {app.location}
                            </span>
                          )}
                          {app.salary && (
                            <span className="flex items-center gap-1">
                              <DollarSign size={10} /> {app.salary}
                            </span>
                          )}
                          {linkedResume && (
                            <span className="flex items-center gap-1 text-primary-light">
                              <FileText size={10} /> {linkedResume.title}
                            </span>
                          )}
                        </div>

                        {/* Kanban Action Buttons */}
                        <div className="flex justify-between items-center border-t border-dark-border/30 pt-3 mt-1.5">
                          {/* Column Mover Selector */}
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id!, e.target.value as any)}
                            className="bg-dark-card border border-dark-border rounded text-[9px] font-semibold text-dark-muted hover:text-white focus:outline-none p-1"
                          >
                            <option value="Wishlist">Wishlist</option>
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => deleteApplication(app._id!)}
                            className="p-1 rounded hover:bg-red-500/10 text-dark-muted hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                            title="Delete tracker card"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {colApps.length === 0 && (
                    <div className="flex-1 border border-dashed border-dark-border/40 rounded-lg flex items-center justify-center p-6 text-[10px] text-dark-muted/65 italic">
                      Empty column.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* TRACK OPENING ADD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-panel rounded-xl border border-white/5 shadow-premium overflow-hidden text-left"
            >
              <div className="p-6 border-b border-dark-border/40 bg-dark-card/50 flex justify-between items-center">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-primary-light animate-pulse" /> Track Corporate Pursuit
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-xs text-dark-muted hover:text-white"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleAddApplication} className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dark-muted">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Stripe"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dark-muted">Target Role Position</label>
                    <input
                      type="text"
                      required
                      placeholder="Senior Staff Architect"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dark-muted">Salary (optional)</label>
                    <input
                      type="text"
                      placeholder="$220k - $260k"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-dark-muted">Location (optional)</label>
                    <input
                      type="text"
                      placeholder="Remote / SF"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Job Posting URL (optional)</label>
                  <input
                    type="url"
                    placeholder="https://stripe.com/jobs/..."
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Linked Tailored Resume Copy</label>
                  <select
                    value={linkedResumeId}
                    onChange={(e) => setLinkedResumeId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg glass-input text-xs"
                  >
                    <option value="">No linked copy (General profile)</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>{r.title} ({r.templateId})</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-dark-muted">Custom Notes</label>
                  <textarea
                    placeholder="Add recruiter contact, referral status, or preparation notes here..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass-input text-xs font-light leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold tracking-wide transition-all shadow-glow flex items-center justify-center gap-1.5"
                >
                  Track Opening <ChevronRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tracker;
