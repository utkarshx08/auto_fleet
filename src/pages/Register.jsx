import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Building,
  Briefcase,
  Image,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Fleet Operator');
  const [companyName, setCompanyName] = useState('Northstar Logistics');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Operator email is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Phone number is required for dispatch communication.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your confirmation.');
      return;
    }

    try {
      setLoading(true);
      await register({
        fullName,
        email,
        phone,
        password,
        confirmPassword,
        role,
        companyName,
        avatarUrl
      });

      setSuccessMessage('Account registered successfully! Redirecting to command center...');
      setTimeout(() => {
        navigate('/overview', { replace: true });
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check form inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101116] flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-lg bg-[#17191f] border border-[#2b2e38] rounded-xl p-8 shadow-2xl relative overflow-hidden my-8">
        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#b49aff]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-lg bg-[#b49aff] text-[#17131f] flex items-center justify-center text-xl font-extrabold mb-3 shadow-[0_0_16px_rgba(180,154,255,0.4)]">
            A
          </div>
          <div className="py-1">
            <TrueFocus
              sentence="New Fleet Operator Profile"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              borderColor="#b49aff"
              glowColor="rgba(180, 154, 255, 0.45)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={12}
              borderWidth={2}
              fontSize="1.25rem"
              wordClassName="text-[#f0f0f4] font-bold tracking-tight"
            />
          </div>
          <p className="text-xs text-[#858894] mt-1">
            Create an independent operator profile with role-based dispatch privileges.
          </p>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-start gap-2.5 text-xs text-red-200 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-950/40 border border-green-800/60 rounded-lg flex items-start gap-2.5 text-xs text-green-200 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMessage}</div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Avatar Selector */}
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Select Operator Avatar
            </label>
            <div className="flex items-center gap-3 bg-[#20222a] border border-[#30333d] rounded-[7px] p-2.5">
              <img
                src={avatarUrl}
                alt="Selected avatar"
                className="w-10 h-10 rounded-full border-2 border-[#b49aff] object-cover shrink-0"
              />
              <div className="flex-1 flex items-center gap-2 overflow-x-auto py-0.5">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer overflow-hidden shrink-0 ${
                      avatarUrl === preset ? 'border-[#b49aff] scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Full Name *
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
                <User className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Suryansh Tyagi"
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Phone Number *
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
                <Phone className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
              Email Address *
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <Mail className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator.name@autrail.io"
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
              />
            </div>
          </div>

          {/* Job Role & Company Name */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Job Role *
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-2.5 py-2 text-xs text-[#eee]">
                <Briefcase className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee] cursor-pointer"
                >
                  <option value="Fleet Operator" className="bg-[#17191f]">Fleet Operator</option>
                  <option value="Fleet Manager" className="bg-[#17191f]">Fleet Manager</option>
                  <option value="Driver" className="bg-[#17191f]">Driver</option>
                  <option value="Maintenance Manager" className="bg-[#17191f]">Maintenance Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Company Name (Optional)
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
                <Building className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Northstar Logistics"
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Password * (min 8 chars)
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
                <Lock className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#858894] hover:text-[#b49aff] bg-transparent border-0 p-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1 font-semibold">
                Confirm Password *
              </label>
              <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
                <Lock className="w-3.5 h-3.5 text-[#858894] shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#858894] hover:text-[#b49aff] bg-transparent border-0 p-0 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-[#787b87] bg-[#1d1f27] p-2.5 rounded-lg border border-[#2b2e38] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#b49aff] shrink-0" />
            <span>
              Administrator access is restricted and provisioned by IT Security. Registered accounts receive default operator authorization.
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2 py-2.5 font-bold shadow-[0_0_15px_rgba(180,154,255,0.25)] hover:shadow-[0_0_20px_rgba(180,154,255,0.4)] transition-all"
          >
            {loading ? 'Creating Profile...' : 'Create Operator Account'}
          </Button>
        </form>

        {/* Existing account link */}
        <div className="mt-5 pt-3 border-t border-[#252730] flex items-center justify-center gap-1.5 text-xs text-[#858894]">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="text-[#b49aff] hover:underline font-semibold transition-colors"
          >
            Sign in to Command Center
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-[#252730] flex items-center justify-center gap-2 text-[10px] text-[#717480] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#80d9a9]" />
          <span>ENTERPRISE FLEET ACCESS POLICY ENFORCED</span>
        </div>
      </div>
    </div>
  );
}

