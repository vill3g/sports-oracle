import React from 'react';
import { Sparkles, ShieldCheck, BarChart3 } from 'lucide-react';
import { useSlip } from '../../context/SlipContext';

export const Header: React.FC = () => {
  const { setShowAccuracyModal, selectedPicks, setIsSlipOpen } = useSlip();

  return (
    <header className="sticky top-[48px] z-40 bg-[#0a0d14]/95 backdrop-blur-md border-b border-[#20293d]/80 px-4 pt-1.5 pb-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Clean Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00e700] to-[#10b981] flex items-center justify-center shadow-md shadow-[#00e700]/20">
            <span className="text-black font-black text-lg leading-none">⚡</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black tracking-wider text-white text-base">ORACLE</span>
            <span className="font-extrabold text-[#00e700] text-sm tracking-widest uppercase">SPORTS</span>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">ET</span>
          </div>
        </div>

        {/* Center: Sleek Live Accuracy Pill */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setShowAccuracyModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131824] hover:bg-[#182030] border border-[#20293d] hover:border-[#2e3b56] transition cursor-pointer group"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e700] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium text-slate-300">Model Accuracy:</span>
            <span className="text-xs font-extrabold text-[#00e700]">66.8% Win</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
              +16.4% ROI
            </span>
          </button>
        </div>

        {/* Right Actions: Clean Mobile Slip & Accuracy */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccuracyModal(true)}
            className="flex items-center gap-1.5 sm:hidden px-2.5 py-1.5 rounded-lg bg-[#131824] border border-[#20293d] text-slate-300 hover:text-white transition"
            title="View Accuracy & Audit"
          >
            <BarChart3 className="w-4 h-4 text-[#00e700]" />
            <span className="text-xs font-bold font-mono text-[#00e700]">66.8%</span>
          </button>

          {/* Quick Slip Trigger Button for Mobile */}
          <button
            onClick={() => setIsSlipOpen(true)}
            className="lg:hidden relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00e700] hover:bg-[#00c700] text-black font-bold text-xs shadow-md shadow-[#00e700]/25 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Smart Slip</span>
            {selectedPicks.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-black text-[#00e700] text-[10px] font-black flex items-center justify-center">
                {selectedPicks.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};