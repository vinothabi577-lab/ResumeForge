import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Layers, 
  Terminal, 
  ArrowRight, 
  CheckCircle, 
  Zap, 
  ShieldCheck, 
  Globe, 
  FileText, 
  TrendingUp,
  HelpCircle,
  Play,
  Briefcase
} from "lucide-react";
import { useStore } from "../store/useStore";

const Landing = () => {
  const token = useStore((state) => state.token);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Resume Preview Override Simulator State
  const [previewRole, setPreviewRole] = useState<"general" | "systems" | "ai">("general");

  const mockResumeData = {
    general: {
      title: "Senior Staff Engineer",
      summary: "Broad experience in cloud architectures and product scale at Stripe. Proven history of leading engineering teams.",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "Docker"]
    },
    systems: {
      title: "Principal Infrastructure Architect",
      summary: "Specialist in high-throughput database systems and low-latency cloud design. Led Kubernetes orchestration migrations.",
      skills: ["Rust", "Go", "Kubernetes", "AWS EKS", "Terraform"]
    },
    ai: {
      title: "Lead Deep Learning Architect",
      summary: "Building generative agent systems and fine-tuning distributed language models. Published author on neural scaling.",
      skills: ["Python", "PyTorch", "Hugging Face", "CUDA", "LLMs"]
    }
  };

  const currentMock = mockResumeData[previewRole];

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text relative grid-bg overflow-x-hidden font-sans">
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 border-b border-dark-border/40 glass-panel backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-heading text-lg shadow-glow">
              RF
            </div>
            <span className="font-heading font-extrabold tracking-tight text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Resume<span className="text-primary-light">Forge</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-dark-muted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-4">
            {token ? (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-glow flex items-center gap-1.5"
              >
                Go to Console <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-medium text-dark-muted hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-dark-bg text-sm font-semibold transition-all"
                >
                  Start Building
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dark-border/80 bg-dark-card/60 text-xs text-primary-light font-medium mb-8"
        >
          <Sparkles size={12} className="animate-pulse" />
          The Living Career Asset Platform
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight leading-[1.05] max-w-4xl mx-auto mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400"
        >
          One Master Profile.<br />
          Infinite Tailored Resumes.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-dark-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Maintain one professional ledger. Instantly derive unlimited ATS-optimized, high-fidelity resume versions custom-tailored for each company, role, or application.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link 
            to="/auth" 
            className="w-full sm:w-auto px-8 py-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-base font-medium transition-all shadow-glow flex items-center justify-center gap-2 group"
          >
            Create Your Free Account 
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#preview" 
            className="w-full sm:w-auto px-8 py-4 rounded-lg border border-dark-border bg-dark-card/30 hover:bg-dark-card/80 text-dark-text text-base font-medium transition-all flex items-center justify-center gap-2"
          >
            <Play size={16} fill="white" />
            Watch Demo
          </a>
        </motion.div>
        
        {/* Floating UI Live Demo Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto glass-panel rounded-xl p-3 border border-white/5 shadow-premium overflow-hidden"
        >
          <div className="w-full h-8 bg-dark-card rounded-t-lg flex items-center px-4 border-b border-dark-border/40 gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
            <div className="h-4 px-3 bg-dark-bg/80 border border-dark-border/30 rounded text-[10px] text-dark-muted flex items-center gap-1.5 mx-auto">
              <Globe size={10} /> app.resumeforge.co/editor
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 bg-dark-bg/90 min-h-[500px]">
            {/* Control Column */}
            <div className="md:col-span-4 border-r border-dark-border/40 p-6 text-left flex flex-col gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-light uppercase tracking-wider">
                <Terminal size={14} /> Living Engine overrides
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">1. Master Ledger Context</h3>
                <p className="text-xs text-dark-muted">Your central career ledger is stored globally. Select your targeted role to see overrides merge instantly.</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs text-dark-muted font-medium">Select Target Role Override:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setPreviewRole("general")}
                    className={`py-2 px-1 text-[11px] font-semibold border rounded-md transition-all ${
                      previewRole === "general" ? "border-primary bg-primary/10 text-primary-light" : "border-dark-border bg-dark-card text-dark-muted hover:text-white"
                    }`}
                  >
                    General
                  </button>
                  <button 
                    onClick={() => setPreviewRole("systems")}
                    className={`py-2 px-1 text-[11px] font-semibold border rounded-md transition-all ${
                      previewRole === "systems" ? "border-primary bg-primary/10 text-primary-light" : "border-dark-border bg-dark-card text-dark-muted hover:text-white"
                    }`}
                  >
                    Systems
                  </button>
                  <button 
                    onClick={() => setPreviewRole("ai")}
                    className={`py-2 px-1 text-[11px] font-semibold border rounded-md transition-all ${
                      previewRole === "ai" ? "border-primary bg-primary/10 text-primary-light" : "border-dark-border bg-dark-card text-dark-muted hover:text-white"
                    }`}
                  >
                    GenAI
                  </button>
                </div>
              </div>
              
              <div className="bg-dark-card/50 p-4 border border-dark-border/40 rounded-lg flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-dark-muted">ATS Compliance</span>
                  <span className="font-semibold text-accent">98% Perfect</span>
                </div>
                <div className="w-full bg-dark-bg h-2 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[98%] rounded-full"></div>
                </div>
                <span className="text-[10px] text-dark-muted leading-relaxed">System parsed 14 relevant keywords matching target role description.</span>
              </div>
            </div>
            
            {/* Live Document Preview Panel */}
            <div className="md:col-span-8 p-8 bg-white text-slate-800 flex items-center justify-center font-sans overflow-hidden">
              <div className="w-full max-w-xl h-full border border-slate-200 shadow-md p-8 bg-white text-left text-slate-900 rounded flex flex-col gap-5 text-xs select-none">
                <div className="border-b border-slate-300 pb-4 text-center">
                  <h2 className="text-base font-extrabold tracking-tight uppercase">Sarah Jenkins</h2>
                  <div className="text-[10px] text-slate-600 flex justify-center gap-3 mt-1.5 flex-wrap">
                    <span>sarah@forge.co</span>
                    <span>•</span>
                    <span>(415) 555-1983</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                    <span>•</span>
                    <span className="underline">linkedin.com/in/sarahj</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold border-b border-slate-200 uppercase tracking-wide text-[10px] mb-2 text-slate-800">Target Role</h3>
                  <p className="text-[11px] font-bold text-primary">{currentMock.title}</p>
                </div>

                <div>
                  <h3 className="font-bold border-b border-slate-200 uppercase tracking-wide text-[10px] mb-2 text-slate-800">Professional Summary</h3>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed italic">{currentMock.summary}</p>
                </div>

                <div>
                  <h3 className="font-bold border-b border-slate-200 uppercase tracking-wide text-[10px] mb-2 text-slate-800">Skills Matrix</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentMock.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 border border-slate-300 rounded text-[10px] font-medium bg-slate-50 text-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold border-b border-slate-200 uppercase tracking-wide text-[10px] mb-2 text-slate-800">Selected Work History</h3>
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="flex justify-between font-bold text-[10.5px]">
                        <span>Stripe</span>
                        <span>2022 – Present</span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[10px] italic">
                        <span>{currentMock.title} (Tailored Segment)</span>
                        <span>San Francisco</span>
                      </div>
                      <ul className="list-disc pl-4 mt-1.5 flex flex-col gap-1 text-[10px] text-slate-600">
                        <li>Optimized financial ledgers reducing page-rendering lag by 35%.</li>
                        <li>Collaborated with product teams to build core Stripe-Checkout widgets.</li>
                        <li>Automated deep schema migrations under zero downtime.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section id="features" className="py-24 border-t border-dark-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
              Forged for Professional Careers
            </h2>
            <p className="text-dark-muted font-light leading-relaxed">
              Ditch maintaining 12 copy-pasted MS Word files. Work with an elegant, responsive system designed by engineers, for professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <Layers size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Single Master Profile</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Add education, experiences, custom certifications, and skills to one centralized core ledger. Your master ledger stays pristine and structured.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <Zap size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Real-Time Split Editor</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Hide or reveal segments, override summaries, customize bullet-points, and witness instantaneous rendering of PDF modifications as you type.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">100% Client-Side Exports</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Your credentials are not stored in memory to run heavy server PDF operations. Downloads and previews generate entirely locally, ensuring complete privacy.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Local ATS Analysis</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Built-in keyword scanning, readability scores, and bullet-metric algorithms tell you exactly how clean and parsable your resume is before submitting.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Application Kanban Board</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Link resumes to job openings. Organize applied jobs, scheduled interviews, and incoming offers inside a elegant, integrated Kanban tracker.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-dark-card/50 border border-dark-border/60 rounded-xl hover:border-primary/50 transition-all flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
                <Globe size={20} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Sharable Portfolio Pages</h3>
              <p className="text-sm text-dark-muted leading-relaxed font-light">
                Turn any tailored version into a clean, searchable web-resume portfolio. Optimizes page layout, fonts, and metadata for top rank indexability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Resume Preview Demo */}
      <section id="preview" className="py-24 bg-dark-card/25 border-t border-dark-border/40 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-left flex flex-col gap-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary-light">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight leading-tight">
              Watch Overrides Cascade programmatically.
            </h2>
            <p className="text-dark-muted leading-relaxed font-light text-base">
              The real magic lies in deep state merges. Toggle items on/off or alter bullet highlights. The underlying system automatically re-orders the document, recalculates multi-page wrap lines, and prepares high-fidelity PDFs.
            </p>
            
            <ul className="flex flex-col gap-3.5 mt-2">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary-light mt-0.5 flex-shrink-0" size={16} />
                <span className="text-sm font-light"><strong className="font-semibold text-white">ATS-Optimized Font Selection:</strong> Fully printable systems matching exact standard Times, Helvetica or Courier metrics.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary-light mt-0.5 flex-shrink-0" size={16} />
                <span className="text-sm font-light"><strong className="font-semibold text-white">Dynamic Bullet Points:</strong> Tailor your key achievements to match the exact vocabulary of a job posting.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-primary-light mt-0.5 flex-shrink-0" size={16} />
                <span className="text-sm font-light"><strong className="font-semibold text-white">Instant State Merging:</strong> Overwrite specific fields locally without corrupting your global profile ledger.</span>
              </li>
            </ul>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-white/5 relative flex items-center justify-center overflow-hidden min-h-[380px]">
            <div className="absolute top-4 left-4 flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
            </div>
            <div className="flex flex-col items-center gap-4 text-center mt-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light animate-bounce">
                <FileText size={32} />
              </div>
              <h3 className="font-heading font-bold text-lg">Downloadable PDF Engine</h3>
              <p className="text-xs text-dark-muted max-w-sm font-light leading-relaxed">
                Experience high performance. Our layout compiles locally into selectable vector lines. Complete ATS-safe formatting.
              </p>
              <Link to="/auth" className="px-6 py-2.5 rounded-lg bg-white text-dark-bg hover:bg-slate-200 font-semibold text-sm transition-all shadow-premium">
                Open App Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-t border-dark-border/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
              Loved by Top Professionals
            </h2>
            <p className="text-dark-muted font-light">
              Here is what staff engineers, product leaders, and executive architects say about using ResumeForge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-dark-card/40 border border-dark-border/50 rounded-xl flex flex-col justify-between">
              <p className="text-sm text-dark-muted font-light leading-relaxed italic">
                "I was applying to staff engineer positions at Stripe, Vercel, and Linear. ResumeForge made managing 3 tailored variations of my resume extremely easy. I had complete control over specific bullet targets."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold text-xs">
                  DK
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">David K.</h4>
                  <span className="text-[10px] text-dark-muted">Staff Systems Architect</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-dark-card/40 border border-dark-border/50 rounded-xl flex flex-col justify-between">
              <p className="text-sm text-dark-muted font-light leading-relaxed italic">
                "Pure client-side rendering was a game-changer. My data isn't scanned or parsed on random API servers. The live editor split preview loads instantly, and downloading vector PDFs takes milliseconds."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold text-xs">
                  ME
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Meredith E.</h4>
                  <span className="text-[10px] text-dark-muted">Director of Product Management</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-dark-card/40 border border-dark-border/50 rounded-xl flex flex-col justify-between">
              <p className="text-sm text-dark-muted font-light leading-relaxed italic">
                "The built-in Kanban application tracker combined with Resume overrides saved my entire job hunt. I could visually correlate which resume version led to which specific interview offer."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary-light flex items-center justify-center font-bold text-xs">
                  TR
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Tariq R.</h4>
                  <span className="text-[10px] text-dark-muted">Senior AI Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-dark-card/25 border-t border-dark-border/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
              Simple, Elegant Pricing
            </h2>
            <p className="text-dark-muted font-light">
              Start completely free. Upgrade for unlimited templates and detailed ATS score intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 bg-dark-card/65 border border-dark-border/80 rounded-2xl flex flex-col justify-between text-left">
              <div>
                <h3 className="font-heading font-bold text-xl mb-1">Standard Free</h3>
                <p className="text-xs text-dark-muted font-light mb-6">Excellent for active individual job seekers.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-heading font-black text-white">$0</span>
                  <span className="text-xs text-dark-muted">forever</span>
                </div>
                <ul className="flex flex-col gap-4 text-xs font-light text-dark-text border-t border-dark-border/30 pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> 1 Master Professional Profile Ledger
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Up to 3 Tailored Resume Versions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Classic ATS & Minimal Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Full Client-side PDF Exports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Integrated Kanban Application Board
                  </li>
                </ul>
              </div>
              <Link to="/auth" className="w-full mt-10 py-3 rounded-lg border border-dark-border hover:border-slate-400 bg-transparent text-center text-xs font-semibold text-white transition-all">
                Get Started Free
              </Link>
            </div>
            
            {/* Premium Tier */}
            <div className="p-8 bg-dark-elevated border border-primary rounded-2xl flex flex-col justify-between text-left relative shadow-glow">
              <span className="absolute top-4 right-4 bg-primary text-[10px] font-bold px-2 py-0.5 rounded text-white tracking-wide uppercase">
                Premium
              </span>
              <div>
                <h3 className="font-heading font-bold text-xl mb-1 text-primary-light">Elite Pro</h3>
                <p className="text-xs text-dark-muted font-light mb-6">Designed for ambitious professionals demanding maximum polish.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-heading font-black text-white">$12</span>
                  <span className="text-xs text-dark-muted">/ month</span>
                </div>
                <ul className="flex flex-col gap-4 text-xs font-light text-dark-text border-t border-dark-border/30 pt-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Everything in Standard Free
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Unlimited Tailored Resume Versions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Access to Executive & Creative Clean layouts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Advanced ATS Keyword Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary-light" /> Custom Domain for Sharable Portfolio links
                  </li>
                </ul>
              </div>
              <Link to="/auth" className="w-full mt-10 py-3 rounded-lg bg-primary hover:bg-primary-hover text-center text-xs font-semibold text-white transition-all shadow-glow">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-dark-border/40 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-dark-muted font-light">
              Clear answers to common structural questions.
            </p>
          </div>
          
          <div className="flex flex-col gap-4 text-left">
            {[
              {
                q: "What is a Master Profile?",
                a: "A Master Profile is your absolute career registry containing all education, certificates, skills, and projects you have ever achieved. It remains pristine. You generate individual resumes dynamically by selecting specific subsets, and writing custom overrides, while keeping the core registry unchanged."
              },
              {
                q: "Is client-side PDF rendering fully ATS safe?",
                a: "Yes. Our client-side rendering compiles documents into selectable vector text nodes rather than flat images. Every template is strictly formatted to ensure standard document structures, making them 100% readable by automated screening bots."
              },
              {
                q: "How does the deep state merge work?",
                a: "Whenever you create a tailored resume, the application references your master profile. Any local changes (like re-ordering positions or customizing text) are saved as small override instructions. If you modify your master profile, the changes immediately cascade to all resumes unless explicitly blocked by a local override."
              },
              {
                q: "Do you store secret keys or passwords in plaintext?",
                a: "No. Security is a primary architect priority. User credentials are encrypted using industry standard high-salt bcrypt hashes. All sessions use secure signature authorization JWT tokens."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="border border-dark-border/60 bg-dark-card/25 rounded-lg p-5 cursor-pointer select-none transition-all hover:bg-dark-card/50"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-semibold font-heading text-sm">
                  <span>{item.q}</span>
                  <HelpCircle size={16} className={`text-dark-muted transition-transform ${activeFaq === idx ? "rotate-180 text-primary-light" : ""}`} />
                </div>
                {activeFaq === idx && (
                  <p className="text-xs text-dark-muted mt-3 font-light leading-relaxed border-t border-dark-border/30 pt-3">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 border-t border-dark-border/40 relative bg-gradient-to-b from-dark-bg to-black/60">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-glow">
            RF
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Ready to Forge Your Next Career Asset?
          </h2>
          <p className="text-dark-muted font-light leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
            Take control of your professional representation. Build, customize, score, track, and export stunning documents starting in less than two minutes.
          </p>
          <Link 
            to="/auth" 
            className="px-8 py-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-glow flex items-center gap-2 group"
          >
            Create Your Account Today
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="text-[10px] text-dark-muted/80 mt-12 flex flex-wrap justify-center gap-8 border-t border-dark-border/20 pt-8 w-full max-w-2xl">
            <span>© {new Date().getFullYear()} ResumeForge. All rights reserved.</span>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Live Preview</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
