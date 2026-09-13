import React from 'react';
import { useSlip } from '../../context/SlipContext';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Cpu } from 'lucide-react';

export const InsightModal: React.FC = () => {
  const { activeInsightMatch, setActiveInsightMatch } = useSlip();

  if (!activeInsightMatch) return null;

  const match = activeInsightMatch;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131824] border border-[#20293d] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#20293d] flex items-center justify-between sticky top-0 bg-[#131824]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00e700]/15 border border-[#00e700]/30 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#00e700]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Machine Learning Insights</h3>
              <p className="text-xs text-slate-400">{match.leagueName} • Engine: {match.modelVersion}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveInsightMatch(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Match Score Prediction Header Banner */}
          <div className="bg-[#0c101a] border border-[#1e273b] rounded-xl p-4">
            <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Model Simulated Outcome
            </div>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-sm font-bold text-slate-300">{match.awayTeam.name}</div>
                <div className="text-3xl font-black text-white mt-1">{match.awayTeam.projectedScore}</div>
                <div className="text-xs text-slate-400 mt-0.5">Win: {(match.awayTeam.winProb * 100).toFixed(1)}%</div>
              </div>

              <div className="text-slate-600 font-black text-xl">VS</div>

              <div className="text-center">
                <div className="text-sm font-bold text-slate-300">{match.homeTeam.name}</div>
                <div className="text-3xl font-black text-[#00e700] mt-1">{match.homeTeam.projectedScore}</div>
                <div className="text-xs text-emerald-400 font-bold mt-0.5">Win: {(match.homeTeam.winProb * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Model Confidence Meter */}
            <div className="mt-4 pt-3 border-t border-[#182030] flex items-center justify-between text-xs">
              <span className="text-slate-400">Model Confidence Rating:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[11px] ${
                match.confidenceRating === 'HIGH'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                {match.confidenceRating} ({Math.round(match.confidenceScore * 100)}% Confidence)
              </span>
            </div>
          </div>

          {/* Key Drivers List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00e700]" />
              Primary Statistical Drivers
            </h4>
            <div className="space-y-2">
              {match.keyDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="bg-[#182030] border border-[#232f48] rounded-lg p-3 text-xs flex items-start gap-2.5 text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#00e700] shrink-0 mt-0.5" />
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Impacts (if available) */}
          {match.features && match.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Algorithmic Feature Weights
              </h4>
              <div className="space-y-2.5">
                {match.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#0e131d] border border-[#1b2336] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{feat.name}</span>
                      <span className="font-mono text-xs font-extrabold text-[#00e700]">
                        {feat.impact}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer / Model Note */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-[11px] text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              Simulated using 10,000 Monte Carlo iterations incorporating rolling team ratings, player injury states, possession metrics, and rest disparities.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#20293d] bg-[#10141e] flex justify-end">
          <button
            onClick={() => setActiveInsightMatch(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
