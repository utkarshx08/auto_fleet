import React, { useState } from 'react';
import Button from '../components/common/Button';
import TrueFocus from '../components/common/TrueFocus';
import { useTheme } from '../context/ThemeContext';
import {
  Settings as SettingsIcon,
  Save,
  Bell,
  Shield,
  User,
  Globe,
  Key,
  Palette,
  CheckCircle2,
  Sliders,
  Moon,
  Sun,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Settings({ onSaveSettings }) {
  const [workspaceName, setWorkspaceName] = useState('Northstar Logistics');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [currency, setCurrency] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsCriticalAlerts, setSmsCriticalAlerts] = useState(true);
  const { theme: themePreference, setTheme: setThemePreference, themes } = useTheme();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('autrail_theme_pref', themePreference);
    setSavedSuccess(true);
    if (onSaveSettings) onSaveSettings();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      {/* Header */}
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#475569] uppercase mb-1 font-bold">
            System Preferences
          </p>
          <div className="-ml-3 py-0.5">
            <TrueFocus
              sentence="System Configuration"
              manualMode={false}
              focusStyle="brackets"
              easing="smooth"
              borderColor="#2879E8"
              glowColor="rgba(40, 121, 232, 0.35)"
              blurAmount={2}
              focusScale={1.03}
              cornerSize={14}
              borderWidth={2.5}
              frameGap={8}
              fontSize="1.6rem"
              wordClassName="text-[#0B132B] font-black tracking-tight"
            />
          </div>
          <p className="text-xs text-[#334155] mt-1 font-semibold">
            Manage organization workspace parameters, alert channels, theme aesthetics, and database telemetry.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Workspace Configuration */}
        <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#172033] border-b border-[#E2E8F0] pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center shadow-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033] m-0">Workspace Details</h2>
              <p className="text-[11px] text-[#68758A] mt-0.5">Primary logistics operational entity</p>
            </div>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 text-xs">
            <div>
              <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3.5 py-2.5 text-[#172033] outline-none font-sans text-xs transition-all font-medium"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
                Distance Unit
              </label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3.5 py-2.5 text-[#172033] outline-none font-sans text-xs transition-all font-medium"
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#F8FAFD] border border-[#D5E2F1] focus:border-[#2879E8] focus:ring-2 focus:ring-[#2879E8]/15 rounded-xl px-3.5 py-2.5 text-[#172033] outline-none font-sans text-xs transition-all font-medium"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[10px] text-[#68758A] uppercase block mb-1.5 font-semibold">
                Timezone
              </label>
              <input
                type="text"
                disabled
                value="America/New_York (EST / UTC-5)"
                className="w-full bg-[#F0F5FC] border border-[#E2E8F0] text-[#8A97AB] rounded-xl px-3.5 py-2.5 font-mono text-xs cursor-not-allowed font-medium"
              />
            </div>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#172033] border-b border-[#E2E8F0] pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF3FF] text-[#2879E8] flex items-center justify-center shadow-xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033] m-0">Theme & Glass Styling</h2>
              <p className="text-[11px] text-[#68758A] mt-0.5">Control visual surface refraction and radiance</p>
            </div>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 text-xs">
            {themes.map((t) => {
              const isSelected = themePreference === t.id;
              const IconComp = t.icon === 'Sun' ? Sun : t.icon === 'Sparkles' ? Sparkles : t.icon === 'Layers' ? Layers : Moon;
              return (
                <div
                  key={t.id}
                  onClick={() => setThemePreference(t.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EAF3FF] border-[#2879E8] shadow-sm ring-2 ring-[#2879E8]/20'
                      : 'bg-white border-[#D5E2F1] hover:border-[#2879E8]/40 hover:bg-[#F8FAFD]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#0B132B] flex items-center gap-2">
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#2879E8]' : 'text-[#68758A]'}`} />
                      {t.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isSelected
                          ? 'bg-white text-[#2879E8] border border-[#2879E8]/30 shadow-2xs'
                          : 'text-[#8A97AB] bg-[#F0F5FC] border border-[#E2E8F0]'
                      }`}
                    >
                      {isSelected ? 'ACTIVE' : t.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications & Alert Preferences */}
        <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-[#172033] border-b border-[#E2E8F0] pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033] m-0">Alert Delivery Channels</h2>
              <p className="text-[11px] text-[#68758A] mt-0.5">Automated dispatch trigger rules</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#2879E8]/30 transition-all">
              <div>
                <b className="text-xs text-[#172033] block">Critical Fuel & Maintenance Email Alerts</b>
                <span className="text-[11px] text-[#68758A]">Dispatch immediate email warnings when vehicle fuel falls below 15%.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#2879E8] rounded border-[#D5E2F1] focus:ring-[#2879E8]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-white border border-[#E2E8F0] rounded-xl cursor-pointer hover:border-[#2879E8]/30 transition-all">
              <div>
                <b className="text-xs text-[#172033] block">SMS Emergency Broadcasts</b>
                <span className="text-[11px] text-[#68758A]">Send SMS alerts for driver license expiration and immediate breakdown triage.</span>
              </div>
              <input
                type="checkbox"
                checked={smsCriticalAlerts}
                onChange={(e) => setSmsCriticalAlerts(e.target.checked)}
                className="w-4 h-4 text-[#2879E8] rounded border-[#D5E2F1] focus:ring-[#2879E8]"
              />
            </label>
          </div>
        </div>

        {/* Administrator Profile Card */}
        <div className="glass-card border border-white/95 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4 text-[#172033] border-b border-[#E2E8F0] pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A36A] flex items-center justify-center shadow-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#172033] m-0">Active Administrator Profile</h2>
              <p className="text-[11px] text-[#68758A] mt-0.5">Primary authenticated session</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF3FF] border border-[#2879E8]/30 text-[#2879E8] font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              ST
            </div>
            <div>
              <b className="text-sm text-[#172033] block font-bold">Suryansh Tyagi</b>
              <span className="text-xs text-[#68758A] font-mono">suryansh.tyagi@autrail.io · Fleet Administrator</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <div className="flex items-center gap-2 text-[#16A36A] font-mono text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Preferences saved successfully.</span>
            </div>
          )}
          <Button type="submit" variant="primary" icon={Save} className="ml-auto rounded-xl py-2.5 px-6 font-bold shadow-md shadow-[#2879E8]/25 active:scale-[0.98]">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
