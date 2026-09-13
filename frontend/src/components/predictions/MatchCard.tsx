import React from 'react';
import { MatchPrediction, SelectedPrediction } from '../../types/prediction';
import { useSlip } from '../../context/SlipContext';
import { Zap, ChevronRight, Activity, Cpu } from 'lucide-react';
import { formatGameTime } from '../../utils/timezone';

interface MatchCardProps {
  match: MatchPrediction;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { togglePick, isPickSelected, setActiveInsightMatch, setActiveGamePageMatch } = useSlip();

  const homeWinPickId = `${match.id}_ML_home`;
  const awayWinPickId = `${match.id}_ML_away`;
  const spreadFavoredPickId = `${match.id}_SPREAD_${match.projectedSpread.favoredTeam}`;
  const totalPickId = `${match.id}_TOTAL_${match.projectedTotal.recommendation}`;

  const handleSelectML = (team: 'home' | 'away') => {
    const selectedTeam = team === 'home' ? match.homeTeam : match.awayTeam;
    const opponentTeam = team === 'home' ? match.awayTeam : match.homeTeam;
    const pick: SelectedPrediction = {
      id: team === 'home' ? homeWinPickId : awayWinPickId,
      matchId: match.id,
      matchTitle: `${match.awayTeam.code} @ ${match.homeTeam.code}`,
      leagueId: match.leagueId,
      leagueIcon: match.leagueId === 'nfl' ? '🏈' : match.leagueId === 'nba' ? '🏀' : match.leagueId === 'mlb' ? '⚾' : '⚽',
      pickType: 'MONEYLINE',
      selectionTitle: `${selectedTeam.name} to Win`,
      probability: selectedTeam.winProb,
      edge: match.edgeScore,
      confidenceRating: match.confidenceRating
    };
    togglePick(pick);
  };

  const handleSelectSpread = () => {
    const favored = match.projectedSpread.favoredTeam === 'home' ? match.homeTeam : match.awayTeam;
    const pick: SelectedPrediction = {
      id: spreadFavoredPickId,
      matchId: match.id,
      matchTitle: `${match.awayTeam.code} @ ${match.homeTeam.code}`,
      leagueId: match.leagueId,
      leagueIcon: match.leagueId === 'nfl' ? '🏈' : match.leagueId === 'nba' ? '🏀' : match.leagueId === 'mlb' ? '⚾' : '⚽',
      pickType: 'SPREAD',
      selectionTitle: `${favored.code} -${match.projectedSpread.marketLine} (Cover)`,
      probability: match.projectedSpread.coverProb,
      edge: Math.round(match.projectedSpread.edge * 10) / 10,
      confidenceRating: match.confidenceRating
    };
    togglePick(pick);
  };

  const handleSelectTotal = () => {
    const pick: SelectedPrediction = {
      id: totalPickId,
      matchId: match.id,
      matchTitle: `${match.awayTeam.code} @ ${match.homeTeam.code}`,
      leagueId: match.leagueId,
      leagueIcon: match.leagueId === 'nfl' ? '🏈' : match.leagueId === 'nba' ? '🏀' : match.leagueId === 'mlb' ? '⚾' : '⚽',
      pickType: 'TOTAL',
      selectionTitle: `${match.projectedTotal.recommendation} ${match.projectedTotal.marketLine} pts`,
      probability: match.projectedTotal.overProb,
      edge: match.projectedTotal.edgePoints,
      confidenceRating: match.confidenceRating
    };
    togglePick(pick);
  };

  return (
    <div className="bg-[#131824] rounded-xl border border-[#20293d] hover:border-slate-600/60 transition shadow-md overflow-hidden">
      {/* Top Card Bar: Game Status & Model Engine Tag */}
      <div className="bg-[#10141e] px-4 py-2 flex items-center justify-between border-b border-[#20293d] text-xs">
        <div className="flex items-center gap-2">
          {match.status === 'live' ? (
            <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE {match.period}
            </span>
          ) : (
            <span className="text-slate-400 font-medium">{formatGameTime(match.startTime)}</span>
          )}
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-semibold">{match.leagueName}</span>
        </div>

        <div className="flex items-center gap-2">
          {match.isTopPick && (
            <span className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
              <Zap className="w-3 h-3 fill-amber-400" />
              Top Edge +{match.edgeScore}%
            </span>
          )}
          <span className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
            <Cpu className="w-3 h-3 text-[#00e700]" />
            {match.modelVersion}
          </span>
        </div>
      </div>

      {/* Main Grid: Teams & Prediction Odds Matrix */}
      <div className="p-3 sm:p-4">
        {/* Edge Factors Quick Badge Strip */}
        {match.advancedMetrics && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {match.advancedMetrics.weather && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/30 text-[10px] font-medium text-blue-300">
                <span>{match.advancedMetrics.weather.isDome ? '🏟️' : '💨'}</span>
                <span>{match.advancedMetrics.weather.isDome ? 'Dome (Controlled)' : `${Math.round(match.advancedMetrics.weather.temperatureF)}°F • ${match.advancedMetrics.weather.windDirection}`}</span>
              </span>
            )}
            {match.advancedMetrics.sportStats && (
              <>
                {match.leagueId === 'nfl' && match.advancedMetrics.sportStats.home_trench_edge && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-[10px] font-medium text-amber-300">
                    <span>🛡️</span>
                    <span>Trench Edge: {match.advancedMetrics.sportStats.home_trench_edge}</span>
                  </span>
                )}
                {match.leagueId === 'mlb' && match.advancedMetrics.sportStats.home_pitcher_stuff_plus && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/30 text-[10px] font-medium text-purple-300">
                    <span>⚡</span>
                    <span>Starter Stuff+ {match.advancedMetrics.sportStats.home_pitcher_stuff_plus} (CSW {match.advancedMetrics.sportStats.home_pitcher_csw_pct}%)</span>
                  </span>
                )}
                {(match.leagueId === 'epl' || match.leagueId === 'laliga') && match.advancedMetrics.sportStats.home_npxg && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-medium text-emerald-300">
                    <span>🎯</span>
                    <span>npxG: {match.advancedMetrics.sportStats.home_npxg} vs {match.advancedMetrics.sportStats.away_npxg}</span>
                  </span>
                )}
                {match.leagueId === 'nba' && match.advancedMetrics.sportStats.home_starter_net_rtg && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-medium text-cyan-300">
                    <span>📈</span>
                    <span>Net Rtg: {match.advancedMetrics.sportStats.home_starter_net_rtg}</span>
                  </span>
                )}
                {match.leagueId === 'tennis' && match.advancedMetrics.sportStats.court_pace_index && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lime-950/40 border border-lime-500/30 text-[10px] font-medium text-lime-300">
                    <span>🎾</span>
                    <span>CPI {match.advancedMetrics.sportStats.court_pace_index} ({match.advancedMetrics.sportStats.court_speed_desc})</span>
                  </span>
                )}
              </>
            )}
            {match.advancedMetrics.market && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                match.advancedMetrics.market.reverseLineMovement
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                <span>📊</span>
                <span>Sharp Flow: {match.advancedMetrics.market.handlePctHome}% Handle</span>
                {match.advancedMetrics.market.reverseLineMovement && (
                  <span className="text-red-400 font-extrabold ml-0.5">RLM</span>
                )}
              </span>
            )}
          </div>
        )}

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
          <div className="col-span-5 sm:col-span-4">Matchup</div>
          <div className="col-span-2 sm:col-span-3 text-center">Win Prob %</div>
          <div className="col-span-3 sm:col-span-3 text-center">Spread Cover</div>
          <div className="col-span-2 sm:col-span-2 text-center">Projected Total</div>
        </div>

        {/* Away Team Row */}
        <div className="grid grid-cols-12 gap-2 items-center py-1.5">
          {/* Team Info */}
          <div className="col-span-5 sm:col-span-4 flex items-center justify-between pr-2">
            <div>
              <div className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>{match.awayTeam.name}</span>
                {match.liveScore && (
                  <span className="font-mono text-amber-400 font-bold ml-1">
                    {match.liveScore.away}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">{match.awayTeam.record}</div>
            </div>
          </div>

          {/* Away Win Prob Button */}
          <div className="col-span-2 sm:col-span-3">
            <button
              onClick={() => handleSelectML('away')}
              className={`w-full py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isPickSelected(awayWinPickId)
                  ? 'bg-[#00e700] text-black border-[#00e700] shadow-md shadow-[#00e700]/30 font-bold'
                  : 'bg-[#182030] hover:bg-[#1f2a3f] border-[#253047] text-white'
              }`}
            >
              <span className="font-mono font-bold text-xs sm:text-sm">
                {(match.awayTeam.winProb * 100).toFixed(1)}%
              </span>
              <span className={`text-[10px] ${isPickSelected(awayWinPickId) ? 'text-black/80 font-semibold' : 'text-slate-400'}`}>
                Score {match.awayTeam.projectedScore}
              </span>
            </button>
          </div>

          {/* Spread Button (Cover probability for Away or Home) */}
          <div className="col-span-3 sm:col-span-3">
            <button
              onClick={handleSelectSpread}
              className={`w-full py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isPickSelected(spreadFavoredPickId)
                  ? 'bg-[#00e700] text-black border-[#00e700] shadow-md shadow-[#00e700]/30 font-bold'
                  : 'bg-[#182030] hover:bg-[#1f2a3f] border-[#253047] text-white'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-xs sm:text-sm">
                  {match.projectedSpread.favoredTeam === 'away' ? '-' : '+'}
                  {match.projectedSpread.marketLine}
                </span>
                <span className={`text-[10px] font-semibold ${isPickSelected(spreadFavoredPickId) ? 'text-black' : 'text-emerald-400'}`}>
                  {(match.projectedSpread.coverProb * 100).toFixed(0)}%
                </span>
              </div>
              <span className={`text-[10px] ${isPickSelected(spreadFavoredPickId) ? 'text-black/80' : 'text-slate-400'}`}>
                Margin: {match.projectedSpread.margin}
              </span>
            </button>
          </div>

          {/* Projected Total Button */}
          <div className="col-span-2 sm:col-span-2">
            <button
              onClick={handleSelectTotal}
              className={`w-full py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isPickSelected(totalPickId)
                  ? 'bg-[#00e700] text-black border-[#00e700] shadow-md shadow-[#00e700]/30 font-bold'
                  : 'bg-[#182030] hover:bg-[#1f2a3f] border-[#253047] text-white'
              }`}
            >
              <span className="font-mono font-bold text-xs sm:text-sm">
                {match.projectedTotal.recommendation} {match.projectedTotal.marketLine}
              </span>
              <span className={`text-[10px] ${isPickSelected(totalPickId) ? 'text-black/80 font-bold' : 'text-amber-400 font-semibold'}`}>
                Proj {match.projectedTotal.projected}
              </span>
            </button>
          </div>
        </div>

        {/* Home Team Row */}
        <div className="grid grid-cols-12 gap-2 items-center py-1.5 border-t border-[#1d2436]">
          {/* Team Info */}
          <div className="col-span-5 sm:col-span-4 flex items-center justify-between pr-2">
            <div>
              <div className="font-extrabold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>{match.homeTeam.name}</span>
                {match.liveScore && (
                  <span className="font-mono text-amber-400 font-bold ml-1">
                    {match.liveScore.home}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">{match.homeTeam.record}</div>
            </div>
          </div>

          {/* Home Win Prob Button */}
          <div className="col-span-2 sm:col-span-3">
            <button
              onClick={() => handleSelectML('home')}
              className={`w-full py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center cursor-pointer ${
                isPickSelected(homeWinPickId)
                  ? 'bg-[#00e700] text-black border-[#00e700] shadow-md shadow-[#00e700]/30 font-bold'
                  : 'bg-[#182030] hover:bg-[#1f2a3f] border-[#253047] text-white'
              }`}
            >
              <span className="font-mono font-bold text-xs sm:text-sm">
                {(match.homeTeam.winProb * 100).toFixed(1)}%
              </span>
              <span className={`text-[10px] ${isPickSelected(homeWinPickId) ? 'text-black/80 font-semibold' : 'text-slate-400'}`}>
                Score {match.homeTeam.projectedScore}
              </span>
            </button>
          </div>

          {/* Spread / Margin Info Box */}
          <div className="col-span-3 sm:col-span-3">
            <div className="w-full py-2 px-1 rounded-lg bg-[#0e131d] border border-[#1b2336] text-center flex flex-col items-center justify-center">
              <span className="font-mono text-xs text-slate-300 font-semibold">
                Model: {match.projectedSpread.favoredTeam === 'home' ? match.homeTeam.code : match.awayTeam.code} by {match.projectedSpread.margin}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                Edge: +{match.projectedSpread.edge} pts
              </span>
            </div>
          </div>

          {/* Total Delta Info Box */}
          <div className="col-span-2 sm:col-span-2">
            <div className="w-full py-2 px-1 rounded-lg bg-[#0e131d] border border-[#1b2336] text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400">Total Delta</span>
              <span className="text-[11px] font-mono text-[#00e700] font-bold">
                +{match.projectedTotal.edgePoints} pts
              </span>
            </div>
          </div>
        </div>

        {/* Feature Driver Snippet & Deep Dive Link */}
        <div className="mt-3 pt-2.5 border-t border-[#1d2436] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div
            onClick={() => setActiveGamePageMatch(match)}
            className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer hover:text-white transition"
          >
            <span className="text-amber-400 font-bold">🧠 Model Driver:</span>
            <span className="truncate max-w-[280px] sm:max-w-md text-slate-300">
              {match.keyDrivers[0]}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setActiveGamePageMatch(match)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 text-xs font-bold transition cursor-pointer"
            >
              <span>📱 SofaScore Game Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveInsightMatch(match)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Quick Model Weights"
            >
              <span>Insights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
