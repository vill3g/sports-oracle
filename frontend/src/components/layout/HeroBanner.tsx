import React from 'react';
import { Sparkles, TrendingUp, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useSlip } from '../../context/SlipContext';
import { SelectedPrediction } from '../../types/prediction';

export const HeroBanner: React.FC = () => {
  const { togglePick, isPickSelected } = useSlip();

  const featuredPick: SelectedPrediction = {
    id: 'nba_bos_den_TOTAL_OVER',
    matchId: 'nba_bos_den',
    matchTitle: 'DEN @ BOS',
    leagueId: 'nba',
    leagueIcon: '🏀',
    pickType: 'TOTAL',
    selectionTitle: 'OVER 226.5 Total Pts (BOS vs DEN)',
    probability: 0.624,
    edge: 5.0,
    confidenceRating: 'HIGH'
  };

  const isSelected = isPickSelected(featuredPick.id);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141b2b] via-[#101826] to-[#0c1322] border border-[#232e46] p-4 sm:p-5 shadow-xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#00e700]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Zap className="w-3 h-3 fill-amber-400" />
              Algorithmic Pick of the Day
            </span>
            <span className="text-xs text-slate-400 font-mono">NBA Four-Factors v3.8</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Nuggets @ Celtics: Model Projects <span className="text-[#00e700]">231.5 Total</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            Market line set at <span className="font-bold text-white">226.5</span>. Model pace simulator identifies a <span className="text-emerald-400 font-extrabold">+5.0 Point Edge</span> on the <span className="text-white font-bold">OVER</span> with 62.4% probability.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => togglePick(featuredPick)}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg ${
              isSelected
                ? 'bg-[#00e700] text-black shadow-[#00e700]/30'
                : 'bg-[#182338] hover:bg-[#202d47] border border-[#2b3b5c] text-white hover:border-[#00e700]/50'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isSelected ? 'fill-black' : 'text-[#00e700]'}`} />
            <span>{isSelected ? 'Added to Smart Slip' : 'Add Top Pick (+5.0 Edge)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
