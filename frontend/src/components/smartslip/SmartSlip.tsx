import React, { useState } from 'react';
import { useSlip } from '../../context/SlipContext';
import { Sparkles, Trash2, X, ChevronUp, ChevronDown, Check, TrendingUp, ShieldAlert, History } from 'lucide-react';

export const SmartSlip: React.FC = () => {
  const {
    selectedPicks,
    removePick,
    clearSlip,
    isSlipOpen,
    setIsSlipOpen,
    saveCurrentSlipToPortfolio,
    savedPortfolios
  } = useSlip();

  const [activeTab, setActiveTab] = useState<'slip' | 'history'>('slip');

  // Compound probability calculation (P_joint = P1 * P2 * ... * Pn)
  const jointProbability = selectedPicks.length > 0
    ? selectedPicks.reduce((acc, p) => acc * p.probability, 1)
    : 0;

  // Average edge
  const avgEdge = selectedPicks.length > 0
    ? selectedPicks.reduce((acc, p) => acc + p.edge, 0) / selectedPicks.length
    : 0;

  return (
    <>
      {/* MOBILE FLOATING DOCKED PILL (When not full sheet) */}
      {selectedPicks.length > 0 && !isSlipOpen && (
        <div className="lg:hidden fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] inset-x-4 z-40">
          <button
            onClick={() => setIsSlipOpen(true)}
            className="w-full bg-gradient-to-r from-[#00e700] to-[#10b981] hover:brightness-105 text-black font-extrabold px-4 py-3 rounded-2xl shadow-xl shadow-[#00e700]/30 flex items-center justify-between transition transform active:scale-98 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-black flex items-center justify-center">
                {selectedPicks.length}
              </span>
              <span className="text-sm tracking-wide">Predictions in Slip</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold block opacity-80">Joint Prob</span>
                <span className="text-sm font-black">{(jointProbability * 100).toFixed(1)}%</span>
              </div>
              <ChevronUp className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* DESKTOP SIDEBAR OR MOBILE EXPANDED BOTTOM SHEET */}
      <div
        className={`
          ${isSlipOpen ? 'fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm lg:relative lg:inset-auto lg:bg-transparent lg:z-auto' : 'hidden lg:block'}
          lg:w-80 xl:w-96 shrink-0
        `}
      >
        <div
          className={`
            bg-[#131824] border-t lg:border border-[#20293d] lg:rounded-2xl flex flex-col overflow-hidden shadow-2xl
            max-h-[85vh] lg:max-h-[calc(100vh-100px)] lg:sticky lg:top-24
          `}
        >
          {/* Slip Header */}
          <div className="bg-[#10141e] p-4 border-b border-[#20293d] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#00e700]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#00e700]" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Smart Prediction Slip</h3>
                <p className="text-[10px] text-slate-400">Quantitative Model Portfolio</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedPicks.length > 0 && (
                <button
                  onClick={clearSlip}
                  className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer p-1"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsSlipOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs: Active Slip vs Tracked History */}
          <div className="grid grid-cols-2 bg-[#0c101a] border-b border-[#20293d] text-xs font-bold text-center">
            <button
              onClick={() => setActiveTab('slip')}
              className={`py-2.5 transition cursor-pointer border-b-2 ${
                activeTab === 'slip'
                  ? 'border-[#00e700] text-[#00e700] bg-[#131824]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Active Slip ({selectedPicks.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2.5 transition cursor-pointer border-b-2 ${
                activeTab === 'history'
                  ? 'border-[#00e700] text-[#00e700] bg-[#131824]'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Saved ({savedPortfolios.length})
            </button>
          </div>

          {/* Body Content */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2.5">
            {activeTab === 'slip' ? (
              selectedPicks.length === 0 ? (
                <div className="py-10 text-center text-slate-500 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Your slip is empty</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Tap any Win %, Spread, or Total prediction button on a match card to test compound probabilities.
                  </p>
                </div>
              ) : (
                selectedPicks.map((pick) => (
                  <div
                    key={pick.id}
                    className="bg-[#182030] border border-[#232f48] rounded-xl p-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <span>{pick.leagueIcon}</span>
                          <span>{pick.matchTitle}</span>
                        </div>
                        <div className="font-extrabold text-white text-sm mt-0.5">
                          {pick.selectionTitle}
                        </div>
                      </div>

                      <button
                        onClick={() => removePick(pick.id)}
                        className="text-slate-500 hover:text-red-400 transition p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#232f48] flex items-center justify-between text-xs">
                      <span className="text-slate-400">Model Win Prob:</span>
                      <span className="font-mono font-bold text-[#00e700]">
                        {(pick.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))
              )
            ) : (
              /* Saved Portfolios List */
              savedPortfolios.length === 0 ? (
                <div className="py-10 text-center text-slate-500">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-xs">No saved prediction portfolios yet.</p>
                </div>
              ) : (
                savedPortfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="bg-[#182030] border border-[#232f48] rounded-xl p-3 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-slate-400 font-mono text-[10px]">
                      <span>{portfolio.date}</span>
                      <span className="text-[#00e700] font-bold">{portfolio.jointProb}% Joint Prob</span>
                    </div>
                    <div className="space-y-1">
                      {portfolio.picks.map((p, i) => (
                        <div key={i} className="text-white font-medium flex items-center gap-1 text-[11px]">
                          <span>•</span>
                          <span>{p.selectionTitle}</span>
                          <span className="text-slate-400 ml-auto">({(p.probability * 100).toFixed(0)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Slip Summary & Action Footer (Only in active slip view) */}
          {activeTab === 'slip' && selectedPicks.length > 0 && (
            <div className="bg-[#10141e] border-t border-[#20293d] p-4 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Selected Legs:</span>
                  <span className="font-bold text-white">{selectedPicks.length}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Compound Win Probability:</span>
                  <span className="font-mono font-extrabold text-[#00e700] text-sm">
                    {(jointProbability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Average Model Edge:</span>
                  <span className="font-mono font-bold text-amber-400">
                    +{avgEdge.toFixed(1)}%
                  </span>
                </div>
              </div>

              <button
                onClick={saveCurrentSlipToPortfolio}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00e700] to-[#10b981] hover:brightness-105 text-black font-extrabold text-sm shadow-lg shadow-[#00e700]/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Track Predictions to Portfolio</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
