import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { useStore } from "../store/useStore";

const Auth = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.token);
  const login = useStore((state) => state.login);
  const signup = useStore((state) => state.signup);
  const authError = useStore((state) => state.authError);
  const authLoading = useStore((state) => state.authLoading);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  // Combine local state error with store auth error
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (isLogin) {
      const success = await login({ email, password });
      if (success) {
        navigate("/dashboard");
      }
    } else {
      if (!name) {
        setError("Please enter your name.");
        return;
      }
      const success = await signup({ email, password, name });
      if (success) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text relative grid-bg flex flex-col justify-center items-center p-6 font-sans">
      {/* Cinematic Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top logo */}
      <div className="absolute top-8 left-8 z-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-heading text-lg shadow-glow">
            RF
          </div>
          <span className="font-heading font-extrabold tracking-tight text-lg text-white">
            Resume<span className="text-primary-light">Forge</span>
          </span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-md glass-panel rounded-2xl border border-white/5 shadow-premium overflow-hidden z-10"
      >
        {/* Toggle Bar */}
        <div className="flex border-b border-dark-border/40 bg-dark-card/50">
          <button
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all ${
              isLogin ? "text-primary-light border-b-2 border-primary bg-dark-bg/40 font-bold" : "text-dark-muted hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all ${
              !isLogin ? "text-primary-light border-b-2 border-primary bg-dark-bg/40 font-bold" : "text-dark-muted hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 text-center">
            <h2 className="font-heading font-extrabold text-2xl tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {isLogin ? "Welcome Back" : "Start Forging"}
            </h2>
            <p className="text-xs text-dark-muted font-light leading-relaxed">
              {isLogin
                ? "Enter your credentials to access your workspaces."
                : "Register to orchestrate your singular career profile ledger."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name Input for Register */}
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-xs font-semibold text-dark-muted tracking-wide">Full Name</label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-3 rounded-lg glass-input text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-dark-muted tracking-wide">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@stripe.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg glass-input text-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-dark-muted tracking-wide">Password</label>
                {isLogin && (
                  <span className="text-[10px] text-primary-light hover:underline cursor-pointer">
                    Forgot Password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg glass-input text-sm"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg flex items-start gap-2.5 leading-relaxed font-light">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-2 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold tracking-wide transition-all shadow-glow flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Register Account"}{" "}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security badge footer */}
        <div className="px-8 py-4 bg-dark-card/30 border-t border-dark-border/40 flex items-center justify-center gap-2 text-[10px] text-dark-muted select-none">
          <ShieldCheck size={12} className="text-accent" />
          <span>Secured with high-salt 256-bit BCrypt encryption</span>
        </div>
      </motion.div>
      
      {/* Return to marketing site link */}
      <Link to="/" className="text-xs text-dark-muted hover:text-white mt-8 transition-colors">
        ← Back to marketing landing page
      </Link>
    </div>
  );
};

export default Auth;
