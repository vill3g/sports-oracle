import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { LeagueNav } from './components/layout/LeagueNav';
import { HeroBanner } from './components/layout/HeroBanner';
import { MatchCard } from './components/predictions/MatchCard';
import { SmartSlip } from './components/smartslip/SmartSlip';
import { BottomNav } from './components/layout/BottomNav';
import { InsightModal } from './components/predictions/InsightModal';
import { AccuracyModal } from './components/accuracy/AccuracyModal';
import { useSlip } from './context/SlipContext';
import { INITIAL_PREDICTIONS } from './data/mockMatches';
import { MatchPrediction } from './types/prediction';
import { Filter, Sparkles, RefreshCw } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { activeLeague } = useSlip();
  const [predictions, setPredictions] = useState<MatchPrediction[]>(INITIAL_PREDICTIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [liveOnly, setLiveOnly] = useState<boolean>(false);

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
      // Backend not running yet or offline; fallback to loaded mock data
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

      {/* Horizontal League Pills Navigation */}
      <LeagueNav />

      {/* Main Responsive Grid Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Feed Column (Cards & Matches) */}
          <div className="flex-1 w-full space-y-4 sm:space-y-6 min-w-0">
            {/* Promo / Top Pick Hero Banner */}
            <HeroBanner />

            {/* Feed Section Title & Quick Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Match Predictions</span>
                  <span className="text-xs font-bold text-[#00e700] bg-[#00e700]/15 px-2 py-0.5 rounded-full border border-[#00e700]/30">
                    {filteredPredictions.length} Games
                  </span>
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {/* Live Toggle */}
                <button
                  onClick={() => setLiveOnly(!liveOnly)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    liveOnly
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-md shadow-red-500/10'
                      : 'bg-[#131824] text-slate-400 border-[#20293d] hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${liveOnly ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span>Live Games</span>
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

            {/* List of Game Cards */}
            {filteredPredictions.length === 0 ? (
              <div className="bg-[#131824] rounded-2xl border border-[#20293d] p-8 text-center text-slate-400">
                <p className="text-sm font-semibold">No matches match this filter.</p>
                <p className="text-xs text-slate-500 mt-1">Try selecting "All Leagues" or turning off the Live filter.</p>
              </div>
            ) : (
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

      {/* Modals */}
      <InsightModal />
      <AccuracyModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
