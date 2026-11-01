import React, { useState } from 'react';
import Button from '../components/common/Button';
import { Settings as SettingsIcon, Save, Bell, Shield, User, Globe, Key } from 'lucide-react';

export default function Settings({ onSaveSettings }) {
  const [workspaceName, setWorkspaceName] = useState('Northstar Logistics');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [currency, setCurrency] = useState('USD');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsCriticalAlerts, setSmsCriticalAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onSaveSettings) onSaveSettings();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-end justify-between py-4 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[1.2px] text-[#858894] uppercase mb-1">
            System Preferences
          </p>
          <h1 className="text-[28px] tracking-[-1px] font-bold text-[#f0f0f4] m-0">
            Settings<span className="text-[#ad91ff]">.</span>
          </h1>
          <p className="text-[12px] text-[#898c98] mt-1">
            Manage organization workspace parameters, alert channels, and database connection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Workspace Configuration */}
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-4 text-[#f0f0f4]">
            <Globe className="w-4 h-4 text-[#b49aff]" />
            <h2 className="text-sm font-bold m-0">Workspace Details</h2>
          </div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 text-xs">
            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
                Workspace Name
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-3 py-2 text-[#eee] outline-none font-sans text-xs"
              />
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
                Distance Unit
              </label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-3 py-2 text-[#eee] outline-none font-sans text-xs"
              >
                <option value="km">Kilometers (km)</option>
                <option value="miles">Miles (mi)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#20222a] border border-[#30333d] focus:border-[#b49aff] rounded-[6px] px-3 py-2 text-[#eee] outline-none font-sans text-xs"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
                Timezone
              </label>
              <input
                type="text"
                disabled
                value="America/New_York (EST)"
                className="w-full bg-[#17191f] border border-[#2b2e38] text-[#717480] rounded-[6px] px-3 py-2 font-mono text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Alert Preferences */}
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-4 text-[#f0f0f4]">
            <Bell className="w-4 h-4 text-[#e5a46e]" />
            <h2 className="text-sm font-bold m-0">Alert Delivery Channels</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-[#121319] border border-[#252730] rounded-lg cursor-pointer">
              <div>
                <b className="text-xs text-[#e0e0e7] block">Critical Fuel & Maintenance Email Alerts</b>
                <span className="text-[10px] text-[#858894]">Dispatch immediate email warnings when vehicle fuel falls below 15%.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="accent-[#b49aff] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-[#121319] border border-[#252730] rounded-lg cursor-pointer">
              <div>
                <b className="text-xs text-[#e0e0e7] block">SMS Emergency Broadcasts</b>
                <span className="text-[10px] text-[#858894]">Send SMS alerts for driver license expiration and immediate breakdown triage.</span>
              </div>
              <input
                type="checkbox"
                checked={smsCriticalAlerts}
                onChange={(e) => setSmsCriticalAlerts(e.target.checked)}
                className="accent-[#b49aff] w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Account Profile Card */}
        <div className="bg-[#17191f] border border-[#292c35] rounded-[10px] p-5">
          <div className="flex items-center gap-2 mb-4 text-[#f0f0f4]">
            <User className="w-4 h-4 text-[#8be0b3]" />
            <h2 className="text-sm font-bold m-0">Administrator Profile</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#514365] text-[#e9dfff] font-bold text-sm flex items-center justify-center shrink-0">
              JD
            </div>
            <div>
              <b className="text-sm text-[#f0f0f4] block">Jordan Davis</b>
              <span className="text-xs text-[#858894] font-mono">jordan.davis@autrail.io · Fleet Manager (Admin)</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-[#80d9a9] font-mono text-xs">
              ✓ Preferences saved successfully.
            </span>
          )}
          <Button type="submit" variant="primary" icon={Save} className="ml-auto">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}

