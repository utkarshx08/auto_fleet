import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { HelpCircle, BookOpen, Keyboard, Shield, ExternalLink, LifeBuoy } from 'lucide-react';

export default function HelpCenterModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AUTRAIL Knowledge & Dispatch Guide"
      subtitle="Operator Support & System Documentation"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs font-sans text-[#172033]">
        {/* Support Banner */}
        <div className="p-4 bg-[#EAF3FF] border border-[#2879E8]/20 rounded-2xl flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#2879E8]/30 flex items-center justify-center text-[#2879E8] shadow-xs shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <b className="text-sm text-[#172033] block font-bold">24/7 Operations Command Desk</b>
            <p className="text-[11px] text-[#68758A] mt-0.5 mb-0">
              Emergency dispatch hotline: <span className="font-mono text-[#2879E8] font-bold">+1 (800) 555-AUTO</span> (Toll-Free)
            </p>
          </div>
        </div>

        {/* Shortcuts */}
        <div>
          <h4 className="font-mono text-[10px] uppercase text-[#68758A] tracking-wider mb-2 flex items-center gap-1.5 font-bold">
            <Keyboard className="w-3.5 h-3.5 text-[#2879E8]" /> Keyboard Shortcuts
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-[#68758A]">Command Palette</span>
              <kbd className="bg-white text-[#2879E8] px-2 py-0.5 rounded-md border border-[#D5E2F1] font-bold shadow-2xs">
                ⌘K / Ctrl+K
              </kbd>
            </div>
            <div className="bg-[#F8FAFD] border border-[#E2E8F0] p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-[#68758A]">Close Any Modal</span>
              <kbd className="bg-white text-[#68758A] px-2 py-0.5 rounded-md border border-[#D5E2F1] font-bold shadow-2xs">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        {/* Documentation Topics */}
        <div>
          <h4 className="font-mono text-[10px] uppercase text-[#68758A] tracking-wider mb-2 flex items-center gap-1.5 font-bold">
            <BookOpen className="w-3.5 h-3.5 text-[#16A36A]" /> Operator Quick Topics
          </h4>
          <div className="space-y-2">
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2879E8]/40 hover:shadow-sm transition-all cursor-pointer">
              <b className="text-xs text-[#172033] block font-semibold">How Fleet Utilization is Computed</b>
              <span className="text-[11px] text-[#68758A] mt-0.5 block">Active vehicle operation hours divided by 240 standard monthly fleet operating capacity.</span>
            </div>
            <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#2879E8]/40 hover:shadow-sm transition-all cursor-pointer">
              <b className="text-xs text-[#172033] block font-semibold">Configuring Supabase Telemetry Pipelines</b>
              <span className="text-[11px] text-[#68758A] mt-0.5 block">Connect your cloud PostgreSQL project URL and anonymous API keys under System Settings.</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E2E8F0] flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it, thanks
          </Button>
        </div>
      </div>
    </Modal>
  );
}
