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
    <div className="min-h-screen bg-[#101116] flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-md bg-[#17191f] border border-[#2b2e38] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#b49aff]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-lg bg-[#b49aff] text-[#17131f] flex items-center justify-center text-xl font-extrabold mb-3 shadow-[0_0_16px_rgba(180,154,255,0.4)]">
            A
          </div>
          <div className="py-1">
            <TrueFocus
              sentence="AUTRAIL Fleet Command"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              order="sequential"
              borderColor="#b49aff"
              glowColor="rgba(180, 154, 255, 0.45)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={12}
              borderWidth={2}
              animationDuration={0.5}
              pauseBetweenAnimations={1.5}
              fontSize="1.25rem"
              wordClassName="text-[#f0f0f4] font-bold tracking-tight"
            />
          </div>
          <p className="text-xs text-[#858894] mt-1">
            Sign in with authorized administrator or fleet operator credentials.
          </p>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg flex items-start gap-2.5 text-xs text-blue-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{infoMessage}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Operator Email Address
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] focus-within:ring-1 focus-within:ring-[#b49aff]/40 rounded-[7px] px-3 py-2.5 text-xs text-[#eee] transition-all">
              <Mail className="w-3.5 h-3.5 text-[#858894] shrink-0" />
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
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee] placeholder-[#5a5e6d]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Security Key / Password
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] focus-within:ring-1 focus-within:ring-[#b49aff]/40 rounded-[7px] px-3 py-2.5 text-xs text-[#eee] transition-all">
              <Lock className="w-3.5 h-3.5 text-[#858894] shrink-0" />
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
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee] placeholder-[#5a5e6d]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#858894] hover:text-[#b49aff] bg-transparent border-0 p-0 cursor-pointer transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-[#858894] cursor-pointer hover:text-[#d4d4dc] transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#b49aff] rounded cursor-pointer"
              />
              <span>Remember workspace session</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setResetEmail(email);
                setIsResetOpen(true);
              }}
              className="text-[#b49aff] hover:underline bg-transparent border-0 p-0 text-[11px] cursor-pointer"
            >
              Reset key?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-4 py-2.5 font-bold shadow-[0_0_15px_rgba(180,154,255,0.25)] hover:shadow-[0_0_20px_rgba(180,154,255,0.4)] transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-[#17131f] border-t-transparent rounded-full animate-spin" />
                Authenticating Session...
              </span>
            ) : (
              'Access Command Center'
            )}
          </Button>
        </form>

        {/* Demo Fast Login Switcher */}
        <div className="mt-5 pt-3.5 border-t border-[#252730]">
          <p className="text-[10px] text-[#858894] font-mono uppercase mb-2 text-center">
            Quick-access fleet credentials
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setEmail('suryansh.tyagi@autrail.io');
                setPassword('Password123!');
              }}
              className="px-2.5 py-1.5 rounded bg-[#20222a] hover:bg-[#282b35] text-[#d4d4dc] border border-[#2d303b] text-left truncate transition-colors"
            >
              <div className="font-semibold text-[#b49aff]">Suryansh Tyagi</div>
              <div className="text-[9px] text-[#787b87]">Administrator</div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('priya.patel@autrail.io');
                setPassword('Password123!');
              }}
              className="px-2.5 py-1.5 rounded bg-[#20222a] hover:bg-[#282b35] text-[#d4d4dc] border border-[#2d303b] text-left truncate transition-colors"
            >
              <div className="font-semibold text-[#8be0b3]">Priya Patel</div>
              <div className="text-[9px] text-[#787b87]">Maintenance Mgr</div>
            </button>
          </div>
        </div>

        {/* Register Navigation Link */}
        <div className="mt-5 pt-3 border-t border-[#252730] flex items-center justify-center gap-1.5 text-xs text-[#858894]">
          <span>New fleet operator?</span>
          <Link
            to="/register"
            className="text-[#b49aff] hover:underline font-semibold flex items-center gap-1 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 inline" />
            Create Operator Account
          </Link>
        </div>

        <div className="mt-5 pt-3 border-t border-[#252730] flex items-center justify-center gap-2 text-[10px] text-[#717480] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#80d9a9]" />
          <span>256-BIT ENCRYPTED TELEMETRY SESSION</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-[#17191f] border border-[#2b2e38] rounded-xl p-6 shadow-2xl relative">
            <div className="flex items-center gap-2 mb-3 text-[#f0f0f4]">
              <KeyRound className="w-5 h-5 text-[#b49aff]" />
              <h3 className="text-sm font-bold m-0">Reset Security Credentials</h3>
            </div>
            <p className="text-xs text-[#858894] mb-4">
              Enter your registered operator email. A secure password reset link will be dispatched.
            </p>

            {resetSuccess ? (
              <div className="p-3 bg-green-950/40 border border-green-800/60 rounded-lg text-xs text-green-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1">
                    Operator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="operator@autrail.io"
                    className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee] outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={() => setIsResetOpen(false)}
                    className="py-1.5 px-3 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={resetLoading}
                    className="py-1.5 px-3 text-xs font-semibold"
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
