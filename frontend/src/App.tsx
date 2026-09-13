import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LeagueNav } from './components/layout/LeagueNav';
import { HeroBanner } from './components/layout/HeroBanner';
import { MatchCard } from './components/predictions/MatchCard';
import { SmartSlip } from './components/smartslip/SmartSlip';
import { BottomNav } from './components/layout/BottomNav';
import { InsightModal } from './components/predictions/InsightModal';
import { AccuracyModal } from './components/accuracy/AccuracyModal';
import { SofaScoreGamePage } from './components/sofascore/SofaScoreGamePage';
import { SofaScoreFeed } from './components/sofascore/SofaScoreFeed';
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

  // Attempt to fetch from FastAPI backend, fall back to initial mock matches seamlessly
  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/predictions');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setPredictions(data);
        }
      }
    } catch {
      // Fallback to loaded mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  // Filter logic
  const filteredPredictions = predictions.filter((p) => {
    if (liveOnly && p.status !== 'live') return false;
    if (activeLeague === 'all') return true;
    if (activeLeague === 'top_picks') return p.isTopPick || p.confidenceRating === 'HIGH';
    return p.leagueId.toLowerCase() === activeLeague.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col pb-28 lg:pb-8">
      {/* Top Header */}
      <Header />

      {/* SofaScore Date Selector Ribbon */}
      <div className="bg-[#0b0f17] border-b border-[#1c2436] px-3 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {/* Date Pills */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
            {[
              { id: 'THU', label: 'Thu 11 Sep' },
              { id: 'FRI', label: 'Fri 12 Sep' },
              { id: 'TODAY', label: 'TODAY • 13 SEP', highlight: true },
              { id: 'SUN', label: 'Sun 14 Sep' },
              { id: 'MON', label: 'Mon 15 Sep' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={`px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 ${
                  selectedDate === d.id
                    ? 'bg-[#0066cc] text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-[#141b29]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher (SofaScore vs Pro Grid) */}
          <div className="flex items-center gap-1 bg-[#131926] p-1 rounded-xl border border-[#222d42] shrink-0">
            <button
              onClick={() => setViewMode('sofascore')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'sofascore'
                  ? 'bg-[#0066cc] text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Exact SofaScore Mobile Layout"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>SofaScore UI</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="DraftKings Grid Layout"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal League / Sport Selector Navigation */}
      <LeagueNav />

      {/* Main Responsive Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Feed Column */}
          <div className="flex-1 w-full space-y-4 min-w-0">
            {/* Feed Section Title & Quick Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white flex items-center gap-2">
                  <span>{viewMode === 'sofascore' ? 'SofaScore Live Matches' : 'Match Predictions'}</span>
                  <span className="text-xs font-bold text-[#00e700] bg-[#00e700]/15 px-2 py-0.5 rounded-full border border-[#00e700]/30">
                    {filteredPredictions.length} Games
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Live Filter Toggle */}
                <button
                  onClick={() => setLiveOnly(!liveOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    liveOnly
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-md shadow-red-500/10'
                      : 'bg-[#131824] text-slate-400 border-[#20293d] hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${liveOnly ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span>Live Only</span>
                </button>

                {/* Refresh */}
                <button
                  onClick={fetchPredictions}
                  className="p-1.5 rounded-lg bg-[#131824] border border-[#20293d] text-slate-400 hover:text-white transition cursor-pointer"
                  title="Refresh predictions"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00e700]' : ''}`} />
                </button>
              </div>
            </div>

            {/* List of Game Cards / SofaScore Grouped Feed */}
            {filteredPredictions.length === 0 ? (
              <div className="bg-[#131824] rounded-2xl border border-[#20293d] p-8 text-center text-slate-400">
                <p className="text-sm font-semibold">No matches match this filter.</p>
                <p className="text-xs text-slate-500 mt-1">Try selecting "All Leagues" or turning off the Live filter.</p>
              </div>
            ) : viewMode === 'sofascore' ? (
              /* SofaScore iPhone Grouped Competition List */
              <SofaScoreFeed predictions={filteredPredictions} />
            ) : (
              /* DraftKings Pro Grid List */
              <div className="space-y-3.5">
                {filteredPredictions.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Right Rail: Smart Prediction Slip */}
          <SmartSlip />
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav />

      {/* Modals & Full Screen SofaScore Game Page */}
      <InsightModal />
      <AccuracyModal />
      <SofaScoreGamePage />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
