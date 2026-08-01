import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Wrench, 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { loginWithCredentials, loginError, setLoginError } = useAuth();

  const [email, setEmail] = useState('admin@college.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    await loginWithCredentials(email, password);
    setIsLoading(false);
  };

  const autofillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoginError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl space-y-8 z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 text-white shadow-xl shadow-indigo-600/30">
            <Building2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-wide">
            Campus Equipment Maintenance Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Secure Role-Based Portal with Express REST API & JWT Authentication
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Login Form (Requires Email & Password Check) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Account Sign In
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Enter your campus credentials to authenticate against the REST API server:
              </p>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@college.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      Verify & Log In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-4 border-t border-slate-800/60 mt-6">
              Backend REST Endpoint: <code className="text-indigo-400 font-mono">POST /api/auth/login</code> (Bcrypt + JWT)
            </div>
          </div>

          {/* Right Column: Authorized Demo Credentials Reference */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  Registered Role Credentials
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Click any credential card to populate fields for authentication check:
              </p>

              <div className="space-y-3">
                {/* Admin Card */}
                <div 
                  onClick={() => autofillCredentials('admin@college.edu', 'admin123')}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 cursor-pointer glass-panel-hover transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-100">Admin / Manager</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                      ROLE: ADMIN
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Email: admin@college.edu</div>
                  <div className="text-[11px] text-slate-400 font-mono">Password: admin123</div>
                </div>

                {/* Staff Card */}
                <div 
                  onClick={() => autofillCredentials('staff@college.edu', 'staff123')}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 cursor-pointer glass-panel-hover transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-slate-100">Maintenance Staff</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                      ROLE: STAFF
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Email: staff@college.edu</div>
                  <div className="text-[11px] text-slate-400 font-mono">Password: staff123</div>
                </div>

                {/* Faculty Card */}
                <div 
                  onClick={() => autofillCredentials('faculty@college.edu', 'faculty123')}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 cursor-pointer glass-panel-hover transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-100">Faculty / Department</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                      ROLE: FACULTY
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">Email: faculty@college.edu</div>
                  <div className="text-[11px] text-slate-400 font-mono">Password: faculty123</div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-4 border-t border-slate-800/60 mt-4">
              Full Stack Express.js + Node.js + JWT Authentication Backend
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
