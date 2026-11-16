import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, UserPlus, KeyRound } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('suryansh.tyagi@autrail.io');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Password reset modal state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  // Destination after login
  const from = location.state?.from?.pathname || '/overview';

  // If already authenticated and not loading, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!email.trim()) {
      setErrorMessage('Operator email address is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Security key / password is required.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password, rememberMe);
      if (onLoginSuccess) onLoginSuccess();
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    try {
      setResetLoading(true);
      const res = await resetPassword(resetEmail);
      setResetSuccess(res.message || 'Password reset dispatch sent.');
      setTimeout(() => {
        setIsResetOpen(false);
        setResetSuccess('');
      }, 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch reset link.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#2879E8]/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-[#16A36A]/5 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md glass-card border border-white/95 rounded-3xl p-8 shadow-2xl relative overflow-hidden z-10 text-[#172033]">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#2879E8]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2879E8] text-white flex items-center justify-center text-xl font-black mb-3 shadow-md shadow-[#2879E8]/30">
            A
          </div>
          <div className="py-1">
            <TrueFocus
              sentence="AUTRAIL Fleet Command"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              order="sequential"
              borderColor="#2879E8"
              glowColor="rgba(40, 121, 232, 0.35)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={12}
              borderWidth={2}
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
              fontSize="1.25rem"
              wordClassName="text-[#172033] font-bold tracking-tight"
            />
          </div>
          <p className="text-xs text-[#68758A] mt-1 font-sans">
            Sign in with authorized administrator or fleet operator credentials.
          </p>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5 text-xs text-[#B91C1C] animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-[#E05252] shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-[#EAF3FF] border border-[#BFDBFE] rounded-xl flex items-start gap-2.5 text-xs text-[#1D4ED8] animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#2879E8] shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{infoMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Operator Email Address
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#172033] transition-all">
              <Mail className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="operator@autrail.io"
                className="bg-transparent border-0 outline-none w-full text-xs text-[#172033] placeholder-[#94A3B8] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Security Key / Password
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#172033] transition-all">
              <Lock className="w-4 h-4 text-[#8A97AB] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="bg-transparent border-0 outline-none w-full text-xs text-[#172033] placeholder-[#94A3B8] font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8A97AB] hover:text-[#2879E8] bg-transparent border-0 p-0 cursor-pointer transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-[#68758A] cursor-pointer hover:text-[#172033] transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#2879E8] rounded border-[#D5E2F1] focus:ring-[#2879E8]"
              />
              <span className="font-medium">Remember workspace session</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setIsResetOpen(true);
              }}
              className="text-[#2879E8] hover:underline bg-transparent border-0 p-0 text-[11px] font-semibold cursor-pointer"
            >
              Reset key?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-4 py-3 font-bold rounded-xl shadow-md shadow-[#2879E8]/25 hover:shadow-lg hover:shadow-[#2879E8]/35 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Authenticating Session...
              </span>
            ) : (
              'Access Command Center'
            )}
          </Button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="mt-5 pt-3.5 border-t border-[#E2E8F0]">
          <p className="text-[10px] text-[#8A97AB] font-mono uppercase mb-2 text-center font-semibold">
            Quick-access fleet credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setEmail('suryansh.tyagi@autrail.io');
                setPassword('Password123!');
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#172033] border border-[#D5E2F1] text-left truncate transition-colors shadow-2xs"
            >
              <div className="font-bold text-[#2879E8]">Suryansh Tyagi</div>
              <div className="text-[10px] text-[#68758A]">Administrator</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('priya.patel@autrail.io');
                setPassword('Password123!');
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-[#F8FAFD] text-[#172033] border border-[#D5E2F1] text-left truncate transition-colors shadow-2xs"
            >
              <div className="font-bold text-[#16A36A]">Priya Patel</div>
              <div className="text-[10px] text-[#68758A]">Maintenance Mgr</div>
            </button>
          </div>
        </div>

        {/* Register Navigation Link */}
        <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-center gap-1.5 text-xs text-[#68758A]">
          <span>New fleet operator?</span>
          <Link
            to="/register"
            className="text-[#2879E8] hover:underline font-semibold flex items-center gap-1 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 inline" />
            Create Operator Account
          </Link>
        </div>

        <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-[10px] text-[#8A97AB] font-mono font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
          <span>256-BIT ENCRYPTED TELEMETRY SESSION</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm glass-card border border-white/95 rounded-2xl p-6 shadow-2xl relative text-[#172033]">
            <div className="flex items-center gap-2 mb-3 text-[#172033]">
              <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center shadow-xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold m-0">Reset Security Credentials</h3>
            </div>
            <p className="text-xs text-[#68758A] mb-4">
              Enter your registered operator email. A secure password reset link will be dispatched.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-[#DCFCE7] border border-[#BBF7D0] rounded-xl text-xs text-[#15803D] mb-4 flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1 font-semibold">
                    Operator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="operator@autrail.io"
                    className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] outline-none font-medium"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={() => setIsResetOpen(false)}
                    className="py-1.5 px-3 text-xs rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={resetLoading}
                    className="py-1.5 px-4 text-xs font-semibold rounded-xl"
                  >
                    {resetLoading ? 'Dispatching...' : 'Dispatch Reset Key'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
