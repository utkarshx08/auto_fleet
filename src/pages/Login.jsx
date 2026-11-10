import React, { useState } from 'react';
import Button from '../components/common/Button';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('jordan.davis@autrail.io');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#101116] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#17191f] border border-[#2b2e38] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-[#b49aff]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-lg bg-[#b49aff] text-[#17131f] flex items-center justify-center text-xl font-extrabold mb-3 shadow-[0_0_15px_rgba(180,154,255,0.4)]">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#f0f0f4] mb-1">
            AUTRAIL Fleet Command
          </h1>
          <p className="text-xs text-[#858894]">
            Sign in with authorized administrator credentials.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
              Operator Email
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <Mail className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@autrail.io"
                className="bg-transparent border-0 outline-none w-full text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] text-[#858894] uppercase block mb-1.5">
              Security Key / Password
            </label>
            <div className="flex items-center gap-2 bg-[#20222a] border border-[#30333d] focus-within:border-[#b49aff] rounded-[7px] px-3 py-2 text-xs text-[#eee]">
              <Lock className="w-3.5 h-3.5 text-[#858894] shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-0 outline-none w-full text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <label className="flex items-center gap-2 text-[#858894] cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[#b49aff] rounded" />
              <span>Remember workspace session</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset link dispatched to operator email.')}
              className="text-[#b49aff] hover:underline bg-transparent border-0 p-0 text-[11px] cursor-pointer"
            >
              Reset key
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-4 py-2.5 font-bold"
          >
            {loading ? 'Authenticating...' : 'Access Command Center'}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#252730] flex items-center justify-center gap-2 text-[10px] text-[#717480] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#80d9a9]" />
          <span>256-BIT ENCRYPTED TELEMETRY SESSION</span>
        </div>
      </div>
    </div>
  );
}

