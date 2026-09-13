import React from 'react';
import { MatchPrediction } from '../../types/prediction';
import { useSlip } from '../../context/SlipContext';
import { ChevronRight, Zap, Cloud, Shield } from 'lucide-react';
import { formatGameTime } from '../../utils/timezone';

interface SofaScoreFeedProps {
  predictions: MatchPrediction[];
}

export const SofaScoreFeed: React.FC<SofaScoreFeedProps> = ({ predictions }) => {
  const { setActiveGamePageMatch, togglePick, isPickSelected } = useSlip();

  // Group predictions by league
  const leaguesOrder = ['mlb', 'nfl', 'epl', 'laliga', 'nba', 'tennis'];
  const leagueTitles: Record<string, { country: string; name: string; icon: string }> = {
    mlb: { country: 'USA', name: 'Major League Baseball', icon: '⚾' },
    nfl: { country: 'USA', name: 'NFL', icon: '🏈' },
    epl: { country: 'England', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    laliga: { country: 'Spain', name: 'LaLiga', icon: '🇪🇸' },
    nba: { country: 'USA', name: 'NBA', icon: '🏀' },
    tennis: { country: 'ATP', name: 'ATP Masters 1000', icon: '🎾' }
  };

  const grouped = predictions.reduce((acc, match) => {
    const key = match.leagueId.toLowerCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {} as Record<string, MatchPrediction[]>);

  return (
    <div className="space-y-3.5">
      {Object.entries(grouped).map(([leagueKey, matches]) => {
        const info = leagueTitles[leagueKey] || { country: 'World', name: matches[0]?.leagueName || leagueKey.toUpperCase(), icon: '🏆' };

        return (
          <div key={leagueKey} className="bg-[#121824] rounded-2xl border border-[#1e273a] overflow-hidden shadow-lg">
            {/* SofaScore League Header Bar */}
            <div className="bg-[#161f2e] px-4 py-2.5 border-b border-[#222d42] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">{info.icon}</span>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">{info.country}</span>
                  <span className="text-slate-500">•</span>
                  <span className="font-extrabold text-white">{info.name}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-extrabold text-[#00e700] bg-[#00e700]/15 px-2 py-0.5 rounded-full border border-[#00e700]/30">
                {matches.length} Games
              </span>
            </div>

            {/* SofaScore Match Rows */}
            <div className="divide-y divide-[#1b2333]">
              {matches.map((match) => {
                const homeWinPickId = `${match.id}_ML_home`;
                const isHomeSelected = isPickSelected(homeWinPickId);

                return (
                  <div
                    key={match.id}
                    onClick={() => setActiveGamePageMatch(match)}
                    className="p-3 sm:p-4 hover:bg-[#151d2c] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                  >
                    {/* Left: Match Time / Status & Team Names */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Status / Time Column */}
                      <div className="w-16 shrink-0 text-center flex flex-col items-center justify-center">
                        {match.status === 'live' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-2 py-0.5 rounded-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {match.period || 'LIVE'}
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-300 font-mono">
                            {match.startTime.includes('Today ') ? match.startTime.replace('Today ', '') : match.startTime}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 uppercase mt-0.5">Scheduled</span>
                      </div>

                      {/* Divider */}
                      <div className="w-px h-10 bg-[#1f293d] shrink-0" />

                      {/* Two Teams Scoreboard Row */}
                      <div className="flex-1 space-y-1.5 min-w-0">
                        {/* Away Team */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-[#1d273a] text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0 border border-[#2b3952]">
                              {match.awayTeam.code.slice(0, 2)}
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-slate-200 truncate group-hover:text-white transition">
                              {match.awayTeam.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-slate-400 font-mono">
                              {(match.awayTeam.winProb * 100).toFixed(0)}%
                            </span>
                            {match.liveScore ? (
                              <span className="text-xs font-mono font-bold text-slate-200">
                                {match.liveScore.away}
                              </span>
                            ) : (
                              <span className="text-xs font-mono text-slate-500">
                                {match.awayTeam.projectedScore}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Home Team */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-md bg-[#1d273a] text-[10px] font-bold text-[#00e700] flex items-center justify-center shrink-0 border border-[#2b3952]">
                              {match.homeTeam.code.slice(0, 2)}
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {match.homeTeam.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-emerald-400 font-bold font-mono">
                              {(match.homeTeam.winProb * 100).toFixed(0)}%
                            </span>
                            {match.liveScore ? (
                              <span className="text-xs font-mono font-black text-[#00e700]">
                                {match.liveScore.home}
                              </span>
                            ) : (
                              <span className="text-xs font-mono font-bold text-slate-300">
                                {match.homeTeam.projectedScore}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: SofaScore Odds Pill & Quick Model Edge */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1a2333]">
                      {/* Edge Factors Mini Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {match.advancedMetrics?.weather && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/40 text-blue-300 border border-blue-500/20 font-medium">
                            {match.advancedMetrics.weather.isDome ? '🏟️ Dome' : `💨 ${Math.round(match.advancedMetrics.weather.temperatureF)}°F`}
                          </span>
                        )}

                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-[#00e700]/15 text-[#00e700] border border-[#00e700]/30">
                          +{match.edgeScore}% Edge
                        </span>
                      </div>

                      {/* Tap to open SofaScore Game Page button */}
                      <div className="flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition shrink-0">
                        <span className="hidden sm:inline">SofaScore Match Center</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
