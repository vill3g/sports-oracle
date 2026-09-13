import React, { useState } from 'react';
import { useSlip } from '../../context/SlipContext';
import { SelectedPrediction, PickType } from '../../types/prediction';
import {
  ChevronLeft,
  Star,
  Bell,
  Share2,
  Smartphone,
  Maximize2,
  Cloud,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  Zap,
  Activity,
  BarChart2,
  Users,
  Compass,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatGameTime } from '../../utils/timezone';

type SofaTab = 'details' | 'ml_model' | 'stats' | 'lineups' | 'h2h' | 'odds';

export const SofaScoreGamePage: React.FC = () => {
  const { activeGamePageMatch, setActiveGamePageMatch, togglePick, isPickSelected } = useSlip();
  const [activeTab, setActiveTab] = useState<SofaTab>('ml_model');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [userVoted, setUserVoted] = useState<'home' | 'draw' | 'away' | null>(null);

  if (!activeGamePageMatch) return null;

  const match = activeGamePageMatch;
  const adv = match.advancedMetrics;
  const weather = adv?.weather;
  const market = adv?.market;
  const stats = adv?.sportStats;

  // Slip pick IDs
  const homeWinPickId = `${match.id}_ML_home`;
  const awayWinPickId = `${match.id}_ML_away`;
  const spreadFavoredPickId = `${match.id}_SPREAD_${match.projectedSpread.favoredTeam}`;
  const totalPickId = `${match.id}_TOTAL_${match.projectedTotal.recommendation}`;

  const handleSelectPick = (type: PickType, team: 'home' | 'away') => {
    const selectedTeam = team === 'home' ? match.homeTeam : match.awayTeam;
    const opponentTeam = team === 'home' ? match.awayTeam : match.homeTeam;
    let pick: SelectedPrediction;

    if (type === 'MONEYLINE') {
      pick = {
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
    } else if (type === 'SPREAD') {
      const favored = match.projectedSpread.favoredTeam === 'home' ? match.homeTeam : match.awayTeam;
      pick = {
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
    } else {
      pick = {
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
    }
    togglePick(pick);
  };

  // SofaScore dual comparison bar component
  const SofaScoreBar: React.FC<{ label: string; homeVal: number | string; awayVal: number | string; homeNum?: number; awayNum?: number; higherIsBetter?: boolean }> = ({
    label,
    homeVal,
    awayVal,
    homeNum,
    awayNum,
    higherIsBetter = true
  }) => {
    const h = homeNum ?? (typeof homeVal === 'number' ? homeVal : parseFloat(String(homeVal).replace(/[^0-9.-]/g, '')) || 50);
    const a = awayNum ?? (typeof awayVal === 'number' ? awayVal : parseFloat(String(awayVal).replace(/[^0-9.-]/g, '')) || 50);
    const total = (h + a) || 1;
    const hPct = Math.min(85, Math.max(15, (h / total) * 100));
    const aPct = 100 - hPct;

    const homeWins = higherIsBetter ? h > a : h < a;
    const awayWins = higherIsBetter ? a > h : a < h;

    return (
      <div className="py-2.5 border-b border-[#1b2333]">
        <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
          <span className={`font-mono ${homeWins ? 'text-[#00e700] font-black' : 'text-slate-300'}`}>
            {homeVal}
          </span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
            {label}
          </span>
          <span className={`font-mono ${awayWins ? 'text-[#00e700] font-black' : 'text-slate-300'}`}>
            {awayVal}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#101520] rounded-full overflow-hidden flex gap-1">
          <div
            style={{ width: `${hPct}%` }}
            className={`h-full rounded-full transition-all ${homeWins ? 'bg-[#00e700]' : 'bg-slate-600'}`}
          />
          <div
            style={{ width: `${aPct}%` }}
            className={`h-full rounded-full transition-all ${awayWins ? 'bg-[#00e700]' : 'bg-slate-600'}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Outer Shell: Exact iPhone 17 Pro Max Chassis */}
      <div
        className={`w-full bg-[#0d121c] text-white flex flex-col transition-all duration-300 shadow-2xl relative ${
          isPhoneFrame
            ? 'max-w-[440px] h-[100vh] sm:h-[92vh] sm:rounded-[56px] border-0 sm:border-[5px] border-[#363d4f] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden sm:ring-1 sm:ring-white/10'
            : 'max-w-4xl h-[95vh] rounded-2xl border border-[#222d42] overflow-hidden'
        }`}
      >
        {/* iPhone 17 Pro Max Dynamic Island & iOS Status Bar */}
        {isPhoneFrame && (
          <div className="w-full bg-[#0b0f17] pt-2.5 pb-1 px-7 flex items-center justify-between text-[11px] text-slate-200 select-none shrink-0 z-20 border-b border-[#182030]">
            <span className="font-extrabold tracking-tight">9:41</span>

            {/* Dynamic Island with Live Activity */}
            <div className="w-32 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md border border-white/5">
              <span className="text-[9px] text-[#00e700] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e700] animate-pulse" />
                <span>{match.status === 'live' ? match.period || 'LIVE' : 'SOFASCORE'}</span>
              </span>
              <span className="text-[9px] text-slate-200 font-mono font-black">
                {match.homeTeam.code} {match.liveScore ? `${match.liveScore.home}-${match.liveScore.away}` : 'v'} {match.awayTeam.code}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-6 h-3 border border-slate-300 rounded-sm p-0.5 flex items-center relative">
                <div className="w-full h-full bg-[#00e700] rounded-2xs flex items-center justify-center">
                  <span className="text-[7px] text-black font-black leading-none">100</span>
                </div>
                <div className="w-0.5 h-1.5 bg-slate-300 rounded-r-2xs absolute -right-1" />
              </div>
            </div>
          </div>
        )}

        {/* SofaScore Native Top Bar */}
        <div className="bg-[#111724] px-3 sm:px-4 py-2.5 border-b border-[#1d2638] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveGamePageMatch(null)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-base">
                {match.leagueId === 'nfl' ? '🏈' : match.leagueId === 'nba' ? '🏀' : match.leagueId === 'mlb' ? '⚾' : match.leagueId === 'tennis' ? '🎾' : '⚽'}
              </span>
              <div>
                <div className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                  <span>{match.leagueName}</span>
                </div>
                <div className="text-[10px] text-slate-400">Regular Season • SofaScore Match Center</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStarred(!isStarred)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${isStarred ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
              title="Favorite"
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="hidden sm:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isPhoneFrame ? 'Expand Full Screen' : 'iPhone Mockup View'}
            >
              {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveGamePageMatch(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Game Page Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* SofaScore Match Hero Scoreboard Banner */}
          <div className="bg-gradient-to-b from-[#131b2b] via-[#0e1422] to-[#0a0e17] px-4 py-5 border-b border-[#1b2336] relative overflow-hidden">
            {/* Background subtle radial glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00e700]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Game Status Pill */}
            <div className="flex justify-center mb-4">
              {match.status === 'live' ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/40 px-3 py-0.5 rounded-full shadow-lg shadow-red-900/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE {match.period}
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400 bg-[#151c2c] border border-[#222d42] px-3 py-0.5 rounded-full">
                  {formatGameTime(match.startTime)}
                </span>
              )}
            </div>

            {/* Team Crests & Score Row */}
            <div className="grid grid-cols-12 items-center gap-2">
              {/* Home Team */}
              <div className="col-span-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#172133] border border-[#263550] flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-xl shadow-black/40">
                  {match.homeTeam.code}
                </div>
                <div className="mt-2 font-black text-sm sm:text-base text-white leading-tight">
                  {match.homeTeam.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{match.homeTeam.record}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  Win {(match.homeTeam.winProb * 100).toFixed(1)}%
                </div>
              </div>

              {/* Central Score / VS Block */}
              <div className="col-span-2 flex flex-col items-center text-center">
                {match.liveScore ? (
                  <div className="flex items-center gap-1.5 font-black text-2xl sm:text-3xl text-white font-mono">
                    <span className="text-[#00e700]">{match.liveScore.home}</span>
                    <span className="text-slate-600">-</span>
                    <span>{match.liveScore.away}</span>
                  </div>
                ) : (
                  <div className="text-slate-600 font-black text-lg sm:text-xl">VS</div>
                )}
                <div className="text-[10px] font-mono text-amber-400 font-bold mt-1 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                  Proj: {match.homeTeam.projectedScore} - {match.awayTeam.projectedScore}
                </div>
              </div>

              {/* Away Team */}
              <div className="col-span-5 flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#172133] border border-[#263550] flex items-center justify-center text-xl sm:text-2xl font-black text-white shadow-xl shadow-black/40">
                  {match.awayTeam.code}
                </div>
                <div className="mt-2 font-black text-sm sm:text-base text-white leading-tight">
                  {match.awayTeam.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{match.awayTeam.record}</div>
                <div className="text-[11px] text-slate-400 font-bold mt-1">
                  Win {(match.awayTeam.winProb * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* SofaScore "Who Will Win?" / Model Probability Gauge */}
            <div className="mt-5 bg-[#0a0e16]/80 border border-[#1d273a] rounded-xl p-3">
              <div className="flex items-center justify-between text-[11px] mb-2 font-bold text-slate-300">
                <span className="flex items-center gap-1 text-[#00e700]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Model Win Probability Gauge</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#00e700]/15 text-[#00e700] border border-[#00e700]/30 font-extrabold">
                  {match.confidenceRating} ({Math.round(match.confidenceScore * 100)}%)
                </span>
              </div>

              {/* Multi-segment Probability Gauge Bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                <div
                  style={{ width: `${match.homeTeam.winProb * 100}%` }}
                  className="bg-[#00e700] h-full transition-all"
                  title={`${match.homeTeam.name}: ${(match.homeTeam.winProb * 100).toFixed(1)}%`}
                />
                {match.drawProb && (
                  <div
                    style={{ width: `${match.drawProb * 100}%` }}
                    className="bg-amber-400 h-full transition-all"
                    title={`Draw: ${(match.drawProb * 100).toFixed(1)}%`}
                  />
                )}
                <div
                  style={{ width: `${match.awayTeam.winProb * 100}%` }}
                  className="bg-blue-500 h-full transition-all"
                  title={`${match.awayTeam.name}: ${(match.awayTeam.winProb * 100).toFixed(1)}%`}
                />
              </div>

              {/* Gauge Legend */}
              <div className="flex justify-between items-center text-[10px] font-mono mt-1.5 text-slate-400">
                <span className="text-[#00e700] font-bold">{match.homeTeam.code} {(match.homeTeam.winProb * 100).toFixed(1)}%</span>
                {match.drawProb && <span className="text-amber-400 font-bold">Draw {(match.drawProb * 100).toFixed(1)}%</span>}
                <span className="text-blue-400 font-bold">{match.awayTeam.code} {(match.awayTeam.winProb * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* SofaScore Signature Horizontal Segmented Tabs */}
          <div className="bg-[#0e1420] border-b border-[#1b2333] sticky top-0 z-10 flex overflow-x-auto no-scrollbar text-xs font-bold px-2">
            {[
              { id: 'ml_model', label: 'ML MODEL', icon: Sparkles },
              { id: 'stats', label: 'STATS', icon: Activity },
              { id: 'details', label: 'DETAILS', icon: Compass },
              { id: 'lineups', label: 'LINEUPS', icon: Users },
              { id: 'h2h', label: 'H2H & FORM', icon: Calendar },
              { id: 'odds', label: 'SHARP MARKET', icon: BarChart2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SofaTab)}
                  className={`py-3 px-3.5 whitespace-nowrap transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'border-[#00e700] text-[#00e700]'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREAS */}
          <div className="p-3 sm:p-4 space-y-4">
            {/* 1. TAB: ML MODEL */}
            {activeTab === 'ml_model' && (
              <div className="space-y-4">
                {/* Vegas Spread vs Model Cover Card */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                    <span className="uppercase">Projected Spread & Cover</span>
                    <span className="text-[#00e700] font-mono">Edge +{match.projectedSpread.edge} pts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#0c101a] p-2.5 rounded-lg border border-[#192236]">
                      <div className="text-[10px] text-slate-400 uppercase">Sportsbook Line</div>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {match.homeTeam.code} -{match.projectedSpread.marketLine}
                      </div>
                    </div>
                    <div className="bg-[#0c101a] p-2.5 rounded-lg border border-[#192236]">
                      <div className="text-[10px] text-slate-400 uppercase">Model Margin</div>
                      <div className="text-sm font-extrabold text-[#00e700] mt-0.5">
                        {match.projectedSpread.favoredTeam === 'home' ? match.homeTeam.code : match.awayTeam.code} by {match.projectedSpread.margin} ({Math.round(match.projectedSpread.coverProb * 100)}%)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Over/Under Total Points Card */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                    <span className="uppercase">Projected Game Total</span>
                    <span className="text-amber-400 font-mono">Edge +{match.projectedTotal.edgePoints} pts</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-[#0c101a] p-2.5 rounded-lg border border-[#192236]">
                      <div className="text-[10px] text-slate-400 uppercase">Sportsbook Total</div>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {match.projectedTotal.marketLine} pts
                      </div>
                    </div>
                    <div className="bg-[#0c101a] p-2.5 rounded-lg border border-[#192236]">
                      <div className="text-[10px] text-slate-400 uppercase">Model Total</div>
                      <div className="text-sm font-extrabold text-amber-400 mt-0.5">
                        {match.projectedTotal.projected} pts ({match.projectedTotal.recommendation})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Drivers */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2.5 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#00e700]" />
                    <span>Primary Algorithmic Drivers</span>
                  </div>
                  <div className="space-y-2">
                    {match.keyDrivers.map((driver, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0b1018] border border-[#1a2336] p-2.5 rounded-lg text-xs flex items-start gap-2 text-slate-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00e700] shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Weights */}
                {match.features && match.features.length > 0 && (
                  <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2.5">
                      Model Feature Weights
                    </div>
                    <div className="space-y-2">
                      {match.features.map((feat, idx) => (
                        <div key={idx} className="bg-[#0c101a] p-2.5 rounded-lg border border-[#1a2336]">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-white">{feat.name}</span>
                            <span className="font-mono text-[#00e700] font-extrabold">{feat.impact}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{feat.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. TAB: STATS (SofaScore Comparison Bars) */}
            {activeTab === 'stats' && (
              <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-1">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider pb-2 border-b border-[#1f2a3f] text-slate-400">
                  <span className="text-[#00e700]">{match.homeTeam.code}</span>
                  <span>Match Statistical Comparison</span>
                  <span className="text-slate-300">{match.awayTeam.code}</span>
                </div>

                {/* Soccer Stats */}
                {(match.leagueId === 'epl' || match.leagueId === 'laliga') && stats && (
                  <>
                    <SofaScoreBar label="Non-Penalty xG (npxG)" homeVal={stats.home_npxg} awayVal={stats.away_npxg} />
                    <SofaScoreBar label="Non-Penalty xGA" homeVal={stats.home_npxga} awayVal={stats.away_npxga} higherIsBetter={false} />
                    <SofaScoreBar label="PPDA (Pressing Intensity)" homeVal={stats.home_ppda} awayVal={stats.away_ppda} higherIsBetter={false} />
                    <SofaScoreBar label="Projected Goals" homeVal={match.homeTeam.projectedScore} awayVal={match.awayTeam.projectedScore} />
                    <SofaScoreBar label="Win Probability %" homeVal={`${Math.round(match.homeTeam.winProb * 100)}%`} awayVal={`${Math.round(match.awayTeam.winProb * 100)}%`} />
                  </>
                )}

                {/* NFL Stats */}
                {match.leagueId === 'nfl' && stats && (
                  <>
                    <SofaScoreBar label="Pass Block Win Rate (PBWR)" homeVal={`${stats.home_pbwr}%`} awayVal={`${stats.away_pbwr}%`} />
                    <SofaScoreBar label="Pass Rush Win Rate (PRWR)" homeVal={`${stats.home_prwr}%`} awayVal={`${stats.away_prwr}%`} />
                    <SofaScoreBar label="Red Zone TD %" homeVal={stats.home_rz_td_pct} awayVal={stats.away_rz_td_pct} />
                    <SofaScoreBar label="Projected Points" homeVal={match.homeTeam.projectedScore} awayVal={match.awayTeam.projectedScore} />
                    <SofaScoreBar label="Net Trench Margin" homeVal={stats.home_trench_edge} awayVal={stats.away_trench_edge} />
                  </>
                )}

                {/* MLB Stats */}
                {match.leagueId === 'mlb' && stats && (
                  <>
                    <SofaScoreBar label="Starting Pitcher Stuff+" homeVal={stats.home_pitcher_stuff_plus} awayVal={stats.away_pitcher_stuff_plus} />
                    <SofaScoreBar label="Pitcher CSW %" homeVal={`${stats.home_pitcher_csw_pct}%`} awayVal={`${stats.away_pitcher_csw_pct}%`} />
                    <SofaScoreBar label="Bullpen Pitches (L3D)" homeVal={stats.home_bullpen_l3d_pitches} awayVal={stats.away_bullpen_l3d_pitches} higherIsBetter={false} />
                    <SofaScoreBar label="Projected Runs" homeVal={match.homeTeam.projectedScore} awayVal={match.awayTeam.projectedScore} />
                    <SofaScoreBar label="Win Expectancy" homeVal={`${Math.round(match.homeTeam.winProb * 100)}%`} awayVal={`${Math.round(match.awayTeam.winProb * 100)}%`} />
                  </>
                )}

                {/* NBA Stats */}
                {match.leagueId === 'nba' && stats && (
                  <>
                    <SofaScoreBar label="Starter Net Rating" homeVal={stats.home_starter_net_rtg} awayVal={stats.away_starter_net_rtg} />
                    <SofaScoreBar label="Projected Points" homeVal={match.homeTeam.projectedScore} awayVal={match.awayTeam.projectedScore} />
                    <SofaScoreBar label="Win Probability" homeVal={`${Math.round(match.homeTeam.winProb * 100)}%`} awayVal={`${Math.round(match.awayTeam.winProb * 100)}%`} />
                  </>
                )}

                {/* Tennis Stats */}
                {match.leagueId === 'tennis' && stats && (
                  <>
                    <SofaScoreBar label="Court Pace Index (CPI)" homeVal={stats.court_pace_index} awayVal={stats.court_pace_index} />
                    <SofaScoreBar label="Projected Games" homeVal={match.homeTeam.projectedScore} awayVal={match.awayTeam.projectedScore} />
                    <SofaScoreBar label="Win Probability" homeVal={`${Math.round(match.homeTeam.winProb * 100)}%`} awayVal={`${Math.round(match.awayTeam.winProb * 100)}%`} />
                  </>
                )}
              </div>
            )}

            {/* 3. TAB: DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Stadium & Weather Card */}
                {weather ? (
                  <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-400">Match Venue</div>
                        <div className="font-extrabold text-sm text-white">{weather.venueName}</div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        weather.isDome ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {weather.isDome ? 'Controlled Dome' : 'Outdoor Stadium'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#1a2336]">
                      <div className="bg-[#0b1018] p-2 rounded-lg">
                        <div className="text-[10px] text-slate-400">Temperature</div>
                        <div className="font-extrabold text-sm text-white mt-0.5">{Math.round(weather.temperatureF)}°F</div>
                      </div>
                      <div className="bg-[#0b1018] p-2 rounded-lg">
                        <div className="text-[10px] text-slate-400">Wind</div>
                        <div className="font-extrabold text-xs text-cyan-400 mt-1">{Math.round(weather.windSpeedMph)} mph {weather.windDirection}</div>
                      </div>
                      <div className="bg-[#0b1018] p-2 rounded-lg">
                        <div className="text-[10px] text-slate-400">Air Density Impact</div>
                        <div className="font-extrabold text-xs text-emerald-400 mt-1">{weather.impactDesc}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5">
                    <div className="text-xs text-slate-400">Standard Venue</div>
                    <div className="font-bold text-sm text-white mt-0.5">Metropolitan Arena / Stadium</div>
                  </div>
                )}

                {/* Match Officials / Umpire */}
                {stats?.umpire_impact && (
                  <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-slate-400">Home Plate Umpire Tendency</div>
                      <div className="text-sm font-bold text-white mt-0.5">{stats.umpire_impact}</div>
                    </div>
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                )}
              </div>
            )}

            {/* 4. TAB: LINEUPS */}
            {activeTab === 'lineups' && (
              <div className="space-y-4">
                {/* Visual Field / Court Diagram */}
                <div className="bg-gradient-to-b from-emerald-950/40 via-[#0d1624] to-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 relative overflow-hidden text-center">
                  <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest mb-3">
                    Tactical Formation & Player Ratings
                  </div>

                  <div className="relative py-6 border border-emerald-500/20 rounded-xl bg-emerald-900/10">
                    {/* Halfway line */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-emerald-500/30" />

                    {/* Top Team Players (Away) */}
                    <div className="flex justify-around mb-8">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow">
                          {match.awayTeam.code.slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-slate-300 font-bold mt-1">Attacker</span>
                        <span className="text-[9px] font-extrabold px-1 rounded bg-emerald-500 text-black">7.8</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow">
                          {match.awayTeam.code.slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-slate-300 font-bold mt-1">Playmaker</span>
                        <span className="text-[9px] font-extrabold px-1 rounded bg-emerald-500 text-black">8.1</span>
                      </div>
                    </div>

                    {/* Bottom Team Players (Home) */}
                    <div className="flex justify-around mt-8">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#00e700] text-black font-black text-xs flex items-center justify-center shadow">
                          {match.homeTeam.code.slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-slate-300 font-bold mt-1">Striker / QB</span>
                        <span className="text-[9px] font-extrabold px-1 rounded bg-emerald-400 text-black">8.4</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#00e700] text-black font-black text-xs flex items-center justify-center shadow">
                          {match.homeTeam.code.slice(0, 2)}
                        </div>
                        <span className="text-[9px] text-slate-300 font-bold mt-1">Anchor</span>
                        <span className="text-[9px] font-extrabold px-1 rounded bg-emerald-400 text-black">7.6</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. TAB: H2H & FORM */}
            {activeTab === 'h2h' && (
              <div className="space-y-4">
                {/* Form Guide */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase">Recent Match Form</div>

                  {/* Home Team Form */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{match.homeTeam.name}</span>
                    <div className="flex gap-1">
                      {['W', 'W', 'D', 'W', 'L'].map((f, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            f === 'W' ? 'bg-emerald-500 text-black' : f === 'D' ? 'bg-slate-600 text-white' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Away Team Form */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1a2336]">
                    <span className="font-bold text-white">{match.awayTeam.name}</span>
                    <div className="flex gap-1">
                      {['W', 'L', 'W', 'D', 'W'].map((f, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            f === 'W' ? 'bg-emerald-500 text-black' : f === 'D' ? 'bg-slate-600 text-white' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* H2H Meetings */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">Head-to-Head History</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="bg-[#0b1018] p-2 rounded-lg flex justify-between items-center text-slate-300">
                      <span>Last Meeting</span>
                      <span className="font-mono font-bold text-white">{match.homeTeam.code} 3 - 1 {match.awayTeam.code}</span>
                    </div>
                    <div className="bg-[#0b1018] p-2 rounded-lg flex justify-between items-center text-slate-300">
                      <span>Previous Season</span>
                      <span className="font-mono font-bold text-white">{match.awayTeam.code} 2 - 2 {match.homeTeam.code}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TAB: ODDS & SHARP */}
            {activeTab === 'odds' && (
              <div className="space-y-4">
                {/* Sharp Money Flow */}
                {market && (
                  <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase">Public Bets vs Sharp Handle</div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Public Ticket Volume (Bets)</span>
                        <span className="font-mono">{match.homeTeam.code} {market.ticketPctHome}% • {match.awayTeam.code} {market.ticketPctAway}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${market.ticketPctHome}%` }} className="bg-slate-500 h-full" />
                        <div style={{ width: `${market.ticketPctAway}%` }} className="bg-slate-700 h-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Total Money Handle ($)</span>
                        <span className="font-mono text-[#00e700] font-bold">{match.homeTeam.code} {market.handlePctHome}% • {match.awayTeam.code} {market.handlePctAway}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div style={{ width: `${market.handlePctHome}%` }} className="bg-[#00e700] h-full" />
                        <div style={{ width: `${market.handlePctAway}%` }} className="bg-emerald-800 h-full" />
                      </div>
                    </div>

                    <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                      market.reverseLineMovement ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' : 'bg-[#0c101a] border-[#1d273a] text-slate-300'
                    }`}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{market.sharpSignal}: {market.rlmNote}</span>
                    </div>
                  </div>
                )}

                {/* Consensus Odds Grid */}
                <div className="bg-[#111726] border border-[#1d273a] rounded-xl p-3.5 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase">Sportsbook Consensus Odds</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-[#0b1018] p-2 rounded-lg border border-[#1d273a]">
                      <div className="text-[10px] text-slate-400">{match.homeTeam.code} ML</div>
                      <div className="font-mono font-bold text-[#00e700] mt-0.5">{(match.homeTeam.winProb * 100).toFixed(0)}% Prob</div>
                    </div>
                    <div className="bg-[#0b1018] p-2 rounded-lg border border-[#1d273a]">
                      <div className="text-[10px] text-slate-400">Spread {match.projectedSpread.marketLine}</div>
                      <div className="font-mono font-bold text-white mt-0.5">Cover {Math.round(match.projectedSpread.coverProb * 100)}%</div>
                    </div>
                    <div className="bg-[#0b1018] p-2 rounded-lg border border-[#1d273a]">
                      <div className="text-[10px] text-slate-400">O/U {match.projectedTotal.marketLine}</div>
                      <div className="font-mono font-bold text-amber-400 mt-0.5">{match.projectedTotal.recommendation} {Math.round(match.projectedTotal.overProb * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SofaScore Bottom Sticky Action Bar (Quick Bet / Add to Slip) */}
        <div className="bg-[#0e1422] px-3 py-3 border-t border-[#1d2638] flex items-center justify-between gap-2 shrink-0 z-10 shadow-2xl">
          <button
            onClick={() => handleSelectPick('MONEYLINE', 'home')}
            className={`flex-1 py-2 px-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center cursor-pointer ${
              isPickSelected(homeWinPickId)
                ? 'bg-[#00e700] text-black shadow-lg shadow-[#00e700]/30'
                : 'bg-[#182133] hover:bg-[#202c44] text-white border border-[#25324c]'
            }`}
          >
            <span>{match.homeTeam.code} Win</span>
            <span className="text-[10px] font-mono opacity-80">{(match.homeTeam.winProb * 100).toFixed(0)}%</span>
          </button>

          <button
            onClick={() => handleSelectPick('SPREAD', 'home')}
            className={`flex-1 py-2 px-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center cursor-pointer ${
              isPickSelected(spreadFavoredPickId)
                ? 'bg-[#00e700] text-black shadow-lg shadow-[#00e700]/30'
                : 'bg-[#182133] hover:bg-[#202c44] text-white border border-[#25324c]'
            }`}
          >
            <span>Cover -{match.projectedSpread.marketLine}</span>
            <span className="text-[10px] font-mono opacity-80">+{match.projectedSpread.edge} edge</span>
          </button>

          <button
            onClick={() => handleSelectPick('TOTAL', 'home')}
            className={`flex-1 py-2 px-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center cursor-pointer ${
              isPickSelected(totalPickId)
                ? 'bg-[#00e700] text-black shadow-lg shadow-[#00e700]/30'
                : 'bg-[#182133] hover:bg-[#202c44] text-white border border-[#25324c]'
            }`}
          >
            <span>{match.projectedTotal.recommendation} {match.projectedTotal.marketLine}</span>
            <span className="text-[10px] font-mono opacity-80">+{match.projectedTotal.edgePoints} pts</span>
          </button>
        </div>

        {/* iPhone Home Indicator Bar */}
        {isPhoneFrame && (
          <div className="w-full bg-[#0e1422] pb-2 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-500/60 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
