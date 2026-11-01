import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { HelpCircle, BookOpen, Keyboard, Shield, ExternalLink, LifeBuoy } from 'lucide-react';

export default function HelpCenterModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AUTRAIL Operator Knowledge Base"
      subtitle="Help Centre & Fleet Telemetry Guide"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs font-sans text-[#d1d1da]">
        <div className="p-3 bg-[#121319] border border-[#252730] rounded-lg flex items-center gap-3">
          <LifeBuoy className="w-8 h-8 text-[#b49aff] shrink-0" />
          <div>
            <b className="text-sm text-[#f0f0f4] block">24/7 Fleet Dispatch Support</b>
            <p className="text-[10px] text-[#858894] mt-0.5 mb-0">
              Emergency support desk: <span className="font-mono text-[#b49aff]">+1 (800) 555-AUTO</span> (Toll-Free)
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[9px] uppercase text-[#858894] tracking-wider mb-2 flex items-center gap-1.5">
            <Keyboard className="w-3 h-3 text-[#b49aff]" /> Keyboard Shortcuts
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="bg-[#17191f] border border-[#262833] p-2 rounded flex items-center justify-between">
              <span>Overview Command</span>
              <kbd className="bg-[#24212f] text-[#c4b3ff] px-1.5 py-0.5 rounded border border-[#3b364d]">
                ⌘1 / Ctrl+1
              </kbd>
            </div>
            <div className="bg-[#17191f] border border-[#262833] p-2 rounded flex items-center justify-between">
              <span>Close Any Dialog</span>
              <kbd className="bg-[#24212f] text-[#c4b3ff] px-1.5 py-0.5 rounded border border-[#3b364d]">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-[9px] uppercase text-[#858894] tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-[#8be0b3]" /> Fleet Documentation Topics
          </h4>
          <div className="space-y-1.5">
            <div className="p-2.5 bg-[#17191f] border border-[#262833] rounded hover:border-[#3a3749] transition-colors cursor-pointer">
              <b className="text-[#f0f0f4] block">How vehicle utilization is computed</b>
              <span className="text-[10px] text-[#858894]">Active operation hours divided by 240 standard monthly available hours.</span>
            </div>
            <div className="p-2.5 bg-[#17191f] border border-[#262833] rounded hover:border-[#3a3749] transition-colors cursor-pointer">
              <b className="text-[#f0f0f4] block">Configuring Supabase API endpoints</b>
              <span className="text-[10px] text-[#858894]">Connect live cloud PostgreSQL credentials in Settings & Environment parameters.</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#252730] flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it, thanks
          </Button>
        </div>
      </div>
    </Modal>
  );
}

