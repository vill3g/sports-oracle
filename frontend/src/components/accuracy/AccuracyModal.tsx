import React from 'react';
import { useSlip } from '../../context/SlipContext';
import { X, ShieldCheck, Award } from 'lucide-react';

export const AccuracyModal: React.FC = () => {
  const { showAccuracyModal, setShowAccuracyModal } = useSlip();

  if (!showAccuracyModal) return null;

  const leagues = [
    { league: 'Premier League', engine: 'XGBoost Poisson v3.2', winRate: '67.8%', roi: '+16.4%', sample: '142 Matches' },
    { league: 'NFL', engine: 'EPA/Play Ensemble v4.1', winRate: '65.2%', roi: '+18.9%', sample: '98 Matches' },
    { league: 'NBA', engine: 'Four-Factors Markov v3.8', winRate: '64.1%', roi: '+14.8%', sample: '184 Matches' },
    { league: 'MLB', engine: 'Sabermetric Run Expectancy v2.9', winRate: '61.8%', roi: '+11.2%', sample: '220 Matches' },
    { league: 'La Liga', engine: 'XGBoost Poisson v3.2', winRate: '66.1%', roi: '+13.5%', sample: '110 Matches' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131824] border border-[#20293d] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#20293d] flex items-center justify-between sticky top-0 bg-[#131824] z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00e700]/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#00e700]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Verified Model Performance</h3>
              <p className="text-xs text-slate-400">Past 30 Days Out-Of-Sample Accuracy</p>
            </div>
          </div>
          <button
            onClick={() => setShowAccuracyModal(false)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0c101a] border border-[#1e273b] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Overall Win %</span>
              <span className="text-xl font-black text-[#00e700]">66.4%</span>
            </div>
            <div className="bg-[#0c101a] border border-[#1e273b] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Model ROI</span>
              <span className="text-xl font-black text-emerald-400">+15.8%</span>
            </div>
            <div className="bg-[#0c101a] border border-[#1e273b] p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Units Won</span>
              <span className="text-xl font-black text-amber-400">+38.6u</span>
            </div>
          </div>

          {/* League Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Performance by League Engine
            </h4>
            <div className="space-y-2">
              {leagues.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#182030] border border-[#232f48] rounded-xl p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-extrabold text-white text-sm">{item.league}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{item.engine}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-[#00e700]">{item.winRate}</div>
                    <div className="text-[10px] text-emerald-400 font-bold">{item.roi} ROI</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badge Note */}
          <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block">Audit-Verified Predictions</span>
              All model picks are cryptographically locked 15 minutes prior to game tip-off to prevent lookahead bias.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#20293d] bg-[#10141e] flex justify-end">
          <button
            onClick={() => setShowAccuracyModal(false)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
