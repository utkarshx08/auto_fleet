import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Shield,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
];

export default function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, changePassword, logout } = useAuth();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  // Sync profile details when loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.companyName || 'Northstar Logistics');
      setAvatarUrl(profile.avatarUrl || AVATAR_OPTIONS[0]);
    }
  }, [profile]);

  const handleResetForm = () => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setCompanyName(profile.companyName || 'Northstar Logistics');
      setAvatarUrl(profile.avatarUrl || AVATAR_OPTIONS[0]);
    }
    setStatusMsg({ type: 'info', text: 'Changes discarded.' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 2500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!fullName.trim()) {
      setStatusMsg({ type: 'error', text: 'Full Name cannot be empty.' });
      return;
    }

    try {
      setLoading(true);
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        avatarUrl
      });
      setStatusMsg({ type: 'success', text: 'Profile information updated successfully.' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });

    if (newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setPwLoading(true);
      await changePassword(currentPassword, newPassword);
      setPwMsg({ type: 'success', text: 'Password successfully changed and secured.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPwMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPwLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Active Member';
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Active Member';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'bg-[#b49aff]/20 text-[#b49aff] border-[#b49aff]/40';
      case 'Fleet Manager':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'Maintenance Manager':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Driver':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-[#8be0b3]/20 text-[#8be0b3] border-[#8be0b3]/40';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Page Heading */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-[#252730] pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            Operator Profile & Identity
          </p>
          <div className="-ml-3 py-0.5">
            <TrueFocus
              sentence="Operator Profile Management"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              borderColor="#b49aff"
              glowColor="rgba(180, 154, 255, 0.45)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={14}
              borderWidth={2.5}
              frameGap={8}
              fontSize="1.6rem"
              wordClassName="text-[#f0f0f4] font-bold tracking-tight"
            />
          </div>
          <p className="text-xs text-[#898c98] mt-1">
            Manage your personal fleet profile, operational contact details, and security credentials.
          </p>
        </div>

        <Button
          variant="quiet"
          onClick={handleLogout}
          icon={LogOut}
          className="text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-red-900/40 text-xs py-2"
        >
          Sign Out of Cockpit
        </Button>
      </div>

      {/* Main Profile Summary Card */}
      <div className="bg-[#17191f] border border-[#292c35] rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-5 max-md:flex-col max-md:items-start">
          {/* Avatar with preset picker */}
          <div className="relative group shrink-0">
            <img
              src={avatarUrl || AVATAR_OPTIONS[0]}
              alt={profile?.fullName || 'Operator'}
              className="w-20 h-20 rounded-full border-2 border-[#b49aff] object-cover shadow-[0_0_15px_rgba(180,154,255,0.3)]"
            />
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Camera className="w-5 h-5 text-[#f0f0f4]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-[#f0f0f4] truncate m-0">
                {profile?.fullName || 'Suryansh Tyagi'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${getRoleBadgeColor(profile?.role)}`}>
                {profile?.role || 'Fleet Operator'}
              </span>
            </div>

            <p className="text-xs text-[#898c98] flex items-center gap-1.5 mt-1.5 mb-2 truncate">
              <Mail className="w-3.5 h-3.5 text-[#b49aff]" />
              <span>{profile?.email || 'operator@autrail.io'}</span>
              <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                VERIFIED
              </span>
            </p>

            <div className="flex items-center gap-4 text-[11px] text-[#717480] flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#858894]" />
                {profile?.companyName || 'Northstar Logistics'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#858894]" />
                Enrolled: {formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Preset Strip */}
        <div className="mt-4 pt-4 border-t border-[#252730] flex items-center gap-3">
          <span className="font-mono text-[9px] text-[#858894] uppercase shrink-0">
            Change Photo:
          </span>
          <div className="flex items-center gap-2">
            {AVATAR_OPTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatarUrl(preset)}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer overflow-hidden ${
                  avatarUrl === preset ? 'border-[#b49aff] scale-110 shadow-[0_0_8px_#b49aff]' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#17191f] border border-[#292c35] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#252730] pb-3">
          <div className="flex items-center gap-2 text-[#f0f0f4]">
            <User className="w-4 h-4 text-[#b49aff]" />
            <h3 className="text-sm font-bold m-0">Edit Contact & Workspace Details</h3>
          </div>
          <span className="text-[10px] text-[#858894] font-mono">ALL FIELDS PERSISTED TO DATABASE</span>
        </div>

        {statusMsg.text && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 text-xs animate-fadeIn ${
              statusMsg.type === 'error'
                ? 'bg-red-950/40 border border-red-800/60 text-red-200'
                : statusMsg.type === 'info'
                ? 'bg-blue-950/40 border border-blue-800/60 text-blue-200'
                : 'bg-green-950/40 border border-green-800/60 text-green-200'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 text-xs">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Full Name *
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <User className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Phone Number
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <Phone className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Email Address (Authentication Key)
            </label>
            <div className="flex items-center gap-2 bg-[#17191f] border border-[#282a33] text-[#717480] rounded-[7px] px-3 py-2 text-xs cursor-not-allowed">
              <Mail className="w-3.5 h-3.5 text-[#555] shrink-0" />
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#717480] cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Organization / Company
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <Building className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#eee]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252730]">
          <Button
            type="button"
            variant="quiet"
            onClick={handleResetForm}
            icon={RotateCcw}
            className="text-xs py-2 px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            icon={Save}
            className="text-xs py-2 px-5 font-bold"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* Security & Password Modification Card */}
      <form onSubmit={handleChangePassword} className="bg-[#17191f] border border-[#292c35] rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#252730] pb-3">
          <div className="flex items-center gap-2 text-[#f0f0f4]">
            <Lock className="w-4 h-4 text-[#b49aff]" />
            <h3 className="text-sm font-bold m-0">Change Security Password</h3>
          </div>
          <span className="text-[10px] text-[#858894] font-mono">ENCRYPTED AT REST</span>
        </div>

        {pwMsg.text && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2.5 text-xs animate-fadeIn ${
              pwMsg.type === 'error'
                ? 'bg-red-950/40 border border-red-800/60 text-red-200'
                : 'bg-green-950/40 border border-green-800/60 text-green-200'
            }`}
          >
            {pwMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            )}
            <span>{pwMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 text-xs">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee] outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee] outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5 font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#252730]">
          <Button
            type="submit"
            variant="primary"
            disabled={pwLoading}
            className="text-xs py-2 px-5 font-bold"
          >
            {pwLoading ? 'Securing Password...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
}

