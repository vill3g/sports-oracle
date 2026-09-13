import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LeagueNav } from './components/layout/LeagueNav';
import { MatchCard } from './components/predictions/MatchCard';
import { SmartSlip } from './components/smartslip/SmartSlip';
import { BottomNav } from './components/layout/BottomNav';
import { InsightModal } from './components/predictions/InsightModal';
import { AccuracyModal } from './components/accuracy/AccuracyModal';
import { SofaScoreGamePage } from './components/sofascore/SofaScoreGamePage';
import { SofaScoreFeed } from './components/sofascore/SofaScoreFeed';
import { IPhone17ProMaxContainer } from './components/sofascore/IPhone17ProMaxContainer';
import { useSlip } from './context/SlipContext';
import { INITIAL_PREDICTIONS } from './data/mockMatches';
import { MatchPrediction } from './types/prediction';
import { Filter, Sparkles, RefreshCw, Smartphone, LayoutGrid, Calendar, Flame } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeLeague, setActiveLeague } = useSlip();
  const [predictions, setPredictions] = useState<MatchPrediction[]>(INITIAL_PREDICTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveOnly, setLiveOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'sofascore' | 'grid'>('sofascore');
  const [selectedDate, setSelectedDate] = useState<string>('TODAY');

  const dateMap: Record<string, string> = {
    THU: '20260911',
    FRI: '20260912',
    TODAY: '20260913',
    SUN: '20260914',
    MON: '20260915'
  };

  const fetchPredictions = async (dateKey: string = selectedDate) => {
    setIsLoading(true);
    try {
      const dateParam = dateMap[dateKey] || '20260913';
      const response = await fetch(`http://127.0.0.1:8000/api/predictions?date=${dateParam}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPredictions(data);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(selectedDate);
  }, [selectedDate]);

  const filteredPredictions = predictions.filter((p) => {
    if (liveOnly && p.status !== 'live') return false;
    if (activeLeague === 'all') return true;
    if (activeLeague === 'top_picks') return p.isTopPick || p.confidenceRating === 'HIGH';
    return p.leagueId.toLowerCase() === activeLeague.toLowerCase();
  });

  return (
    <div className="w-full flex-1 flex flex-col bg-[#0c1017]">
      {/* Top Header */}
      <Header />

      {/* SofaScore Date Ribbon */}
      <div className="bg-[#0b0f17] border-b border-[#1c2436] px-3 py-2 shrink-0">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 shrink-0 text-xs font-bold">
            {[
              { id: 'THU', label: 'Thu 11' },
              { id: 'FRI', label: 'Fri 12' },
              { id: 'TODAY', label: 'TODAY • 13 SEP', highlight: true },
              { id: 'SUN', label: 'Sun 14' },
              { id: 'MON', label: 'Mon 15' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={`px-2.5 py-1 rounded-full transition cursor-pointer text-[11px] shrink-0 font-bold ${
                  selectedDate === d.id
                    ? 'bg-[#0066cc] text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#141b29]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'sofascore' ? 'grid' : 'sofascore')}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#141c2c] border border-[#222f46] text-[11px] font-bold text-slate-300 hover:text-white transition cursor-pointer"
              title="Toggle Layout"
            >
              {viewMode === 'sofascore' ? <Smartphone className="w-3 h-3 text-[#00e700]" /> : <LayoutGrid className="w-3 h-3 text-cyan-400" />}
              <span>{viewMode === 'sofascore' ? 'SofaScore' : 'Grid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sport Selector Bar */}
      <LeagueNav />

      {/* Main Content Area */}
      <main className="flex-1 px-3 py-3 overflow-y-auto pb-24">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white uppercase tracking-wider">
              {viewMode === 'sofascore' ? 'SofaScore Matches' : 'Oracle Predictions'}
            </span>
            <span className="text-[10px] font-mono font-bold text-[#00e700] bg-[#00e700]/15 px-1.5 py-0.5 rounded-full border border-[#00e700]/30">
              {filteredPredictions.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLiveOnly(!liveOnly)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition flex items-center gap-1 cursor-pointer border ${
                liveOnly
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-md shadow-red-500/10'
                  : 'bg-[#131824] text-slate-400 border-[#20293d] hover:text-white'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${liveOnly ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
              <span>Live</span>
            </button>

            <button
              onClick={() => fetchPredictions(selectedDate)}
              className="p-1 rounded-lg bg-[#131824] border border-[#20293d] text-slate-400 hover:text-white transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00e700]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Matches Feed */}
        {filteredPredictions.length === 0 ? (
          <div className="bg-[#131824] rounded-2xl border border-[#20293d] p-8 text-center text-slate-400">
            <p className="text-xs font-semibold">No matches match this filter.</p>
          </div>
        ) : viewMode === 'sofascore' ? (
          <SofaScoreFeed predictions={filteredPredictions} />
        ) : (
          <div className="space-y-3">
            {filteredPredictions.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Modals & Full Screen SofaScore Game Page */}
      <InsightModal />
      <AccuracyModal />
      <SofaScoreGamePage />
      <SmartSlip />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IPhone17ProMaxContainer>
      <AppContent />
    </IPhone17ProMaxContainer>
  );
};

export default App;
