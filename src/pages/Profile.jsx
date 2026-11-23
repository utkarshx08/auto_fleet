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
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
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
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'November 2026';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'bg-[#EAF3FF] text-[#2879E8] border-[#2879E8]/30';
      case 'Fleet Manager':
        return 'bg-blue-50 text-[#1765CC] border-blue-200';
      case 'Maintenance Manager':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'Driver':
        return 'bg-[#DCFCE7] text-[#16A36A] border-[#BBF7D0]';
      default:
        return 'bg-[#EAF3FF] text-[#2879E8] border-[#2879E8]/20';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Page Heading */}
      <div className="flex items-end justify-between py-2 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-slate-200/90 pb-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
            Operator Profile & Identity
          </span>
          <div className="py-0.5">
            <TrueFocus sentence="Operator Profile" />
          </div>
          <p className="text-xs text-slate-500 mt-1 mb-0">
            Manage your personal fleet profile, operational contact details, and security credentials.
          </p>
        </div>

        <Button
          variant="quiet"
          onClick={handleLogout}
          icon={LogOut}
          className="text-[#E05252] hover:text-[#B91C1C] hover:bg-[#FEF2F2] border border-[#FECACA] text-xs py-2 px-4 rounded-xl shadow-xs"
        >
          Sign Out of Cockpit
        </Button>
      </div>

      {/* Main Profile Summary Card */}
      <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-5 max-md:flex-col max-md:items-start">
          {/* Avatar with preset picker */}
          <div className="relative group shrink-0">
            <img
              src={avatarUrl || AVATAR_OPTIONS[0]}
              alt={profile?.fullName || 'Operator'}
              className="w-20 h-20 rounded-full border-2 border-[#2879E8] object-cover shadow-md shadow-[#2879E8]/20"
            />
            <div className="absolute inset-0 bg-[#172033]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-black text-[#0B132B] truncate m-0">
                {profile?.fullName || 'Suryansh Tyagi'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${getRoleBadgeColor(profile?.role)}`}>
                {profile?.role || 'Administrator'}
              </span>
            </div>

            <p className="text-xs text-[#68758A] flex items-center gap-1.5 mt-1.5 mb-2 truncate">
              <Mail className="w-3.5 h-3.5 text-[#2879E8]" />
              <span>{profile?.email || 'suryansh.tyagi@autrail.io'}</span>
              <span className="text-[#16A36A] font-mono text-[10px] bg-[#DCFCE7] px-1.5 py-0.2 rounded border border-[#BBF7D0] font-semibold">
                VERIFIED
              </span>
            </p>

            <div className="flex items-center gap-4 text-[11px] text-[#68758A] flex-wrap">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#8A97AB]" />
                {profile?.companyName || 'Northstar Logistics'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#8A97AB]" />
                Enrolled: {formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Preset Strip */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <span className="font-mono text-[10px] text-[#68758A] uppercase font-semibold shrink-0">
            Change Photo:
          </span>
          <div className="flex items-center gap-2">
            {AVATAR_OPTIONS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAvatarUrl(preset)}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer overflow-hidden ${
                  avatarUrl === preset
                    ? 'border-[#2879E8] scale-110 shadow-sm shadow-[#2879E8]/40'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#172033]">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold m-0">Edit Contact & Workspace Details</h3>
          </div>
          <span className="text-[10px] text-[#8A97AB] font-mono font-semibold">ALL FIELDS PERSISTED TO DATABASE</span>
        </div>

        {statusMsg.text && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs animate-in fade-in duration-200 ${
              statusMsg.type === 'error'
                ? 'bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]'
                : statusMsg.type === 'info'
                ? 'bg-[#EAF3FF] border border-[#BFDBFE] text-[#1D4ED8]'
                : 'bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D]'
            }`}
          >
            {statusMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#E05252] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
            )}
            <span className="font-medium">{statusMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 text-xs">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Full Name *
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] transition-all">
              <User className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#172033] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Phone Number
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] transition-all">
              <Phone className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#172033] font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Email Address (Authentication Key)
            </label>
            <div className="flex items-center gap-2 bg-[#F0F5FC] border border-[#E2E8F0] text-[#8A97AB] rounded-xl px-3 py-2 text-xs cursor-not-allowed">
              <Mail className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
              <input
                type="email"
                disabled
                value={profile?.email || 'suryansh.tyagi@autrail.io'}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#8A97AB] cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Organization / Company
            </label>
            <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#D5E2F1] focus-within:border-[#2879E8] focus-within:ring-2 focus-within:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] transition-all">
              <Building className="w-3.5 h-3.5 text-[#8A97AB] shrink-0" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-transparent border-0 outline-none w-full text-xs text-[#172033] font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="quiet"
            onClick={handleResetForm}
            icon={RotateCcw}
            className="text-xs py-2 px-4 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            icon={Save}
            className="text-xs py-2 px-5 font-bold rounded-xl active:scale-[0.98]"
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>

      {/* Security & Password Modification Card */}
      <form onSubmit={handleChangePassword} className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <div className="flex items-center gap-2 text-[#172033]">
            <div className="w-7 h-7 rounded-lg bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold m-0">Change Security Password</h3>
          </div>
          <span className="text-[10px] text-[#8A97AB] font-mono font-semibold">ENCRYPTED AT REST</span>
        </div>

        {pwMsg.text && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2.5 text-xs animate-in fade-in duration-200 ${
              pwMsg.type === 'error'
                ? 'bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]'
                : 'bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D]'
            }`}
          >
            {pwMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#E05252] shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
            )}
            <span className="font-medium">{pwMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 text-xs">
          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              New Password (min 8 chars)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] outline-none transition-all font-medium"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3 py-2 text-xs text-[#172033] outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#E2E8F0]">
          <Button
            type="submit"
            variant="primary"
            disabled={pwLoading}
            className="text-xs py-2 px-5 font-bold rounded-xl active:scale-[0.98]"
          >
            {pwLoading ? 'Securing Password...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
}
