import React from 'react';
import { Sparkles, ShieldCheck, BarChart3, Search, Bell } from 'lucide-react';
import { useSlip } from '../../context/SlipContext';

export const Header: React.FC = () => {
  const { setShowAccuracyModal, selectedPicks, setIsSlipOpen } = useSlip();

  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/95 backdrop-blur-md border-b border-[#20293d] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00e700] to-[#10b981] flex items-center justify-center shadow-lg shadow-[#00e700]/20">
            <span className="text-black font-black text-xl leading-none">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-wider text-white text-base">ORACLE</span>
              <span className="font-bold text-[#00e700] text-sm tracking-widest uppercase">SPORTS</span>
              <span className="text-[10px] bg-[#00e700]/20 text-[#00e700] border border-[#00e700]/40 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                AI v4.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Machine Learning Sports Edge</p>
          </div>
        </div>

        {/* Center: Live Model Accuracy Stat Pill */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setShowAccuracyModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131824] hover:bg-[#1a2234] border border-[#20293d] transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#00e700]" />
            <span className="text-xs font-semibold text-slate-300">Model Accuracy (30d):</span>
            <span className="text-xs font-extrabold text-[#00e700]">66.4% Win</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-md font-mono font-bold">
              +15.8% ROI
            </span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAccuracyModal(true)}
            className="flex items-center gap-1 sm:hidden p-2 rounded-lg bg-[#131824] border border-[#20293d] text-[#00e700]"
            title="View Accuracy"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          {/* Quick Slip Trigger Button for Mobile */}
          <button
            onClick={() => setIsSlipOpen(true)}
            className="lg:hidden relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00e700] text-black font-bold text-xs shadow-md shadow-[#00e700]/30 hover:bg-[#00c700] transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span>Smart Slip</span>
            {selectedPicks.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center">
                {selectedPicks.length}
              </span>
            )}
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/40 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
