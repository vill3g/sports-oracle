import React from 'react';
import { Home, Zap, Sparkles, BarChart2 } from 'lucide-react';
import { useSlip } from '../../context/SlipContext';

export const BottomNav: React.FC = () => {
  const {
    activeLeague,
    setActiveLeague,
    selectedPicks,
    setIsSlipOpen,
    setShowAccuracyModal
  } = useSlip();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0d14]/95 backdrop-blur-lg border-t border-[#20293d] px-3 py-2 flex items-center justify-around">
      {/* Home */}
      <button
        onClick={() => setActiveLeague('all')}
        className={`flex flex-col items-center gap-1 transition ${
          activeLeague === 'all' ? 'text-[#00e700]' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>

      {/* Top Edges */}
      <button
        onClick={() => setActiveLeague('top_picks')}
        className={`flex flex-col items-center gap-1 transition ${
          activeLeague === 'top_picks' ? 'text-amber-400' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Zap className="w-5 h-5" />
        <span className="text-[10px] font-bold">Top Edges</span>
      </button>

      {/* Smart Slip Button */}
      <button
        onClick={() => setIsSlipOpen(true)}
        className="flex flex-col items-center gap-1 relative text-slate-400 hover:text-white transition"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-[#00e700]" />
          {selectedPicks.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#00e700] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {selectedPicks.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-[#00e700]">Smart Slip</span>
      </button>

      {/* Accuracy Performance */}
      <button
        onClick={() => setShowAccuracyModal(true)}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
      >
        <BarChart2 className="w-5 h-5" />
        <span className="text-[10px] font-bold">Accuracy</span>
      </button>
    </nav>
  );
};
