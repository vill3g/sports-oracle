import React, { useState } from 'react';
import { useSlip } from '../../context/SlipContext';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Cpu, Cloud, BarChart2, Shield, Activity } from 'lucide-react';

type TabType = 'overview' | 'advanced' | 'weather' | 'market';

export const InsightModal: React.FC = () => {
  const { activeInsightMatch, setActiveInsightMatch } = useSlip();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!activeInsightMatch) return null;

  const match = activeInsightMatch;
  const adv = match.advancedMetrics;
  const weather = adv?.weather;
  const market = adv?.market;
  const stats = adv?.sportStats;

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

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#20293d] px-4 bg-[#10141f] text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#00e700] text-[#00e700]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview & Drivers</span>
          </button>

          <button
            onClick={() => setActiveTab('advanced')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'advanced'
                ? 'border-[#00e700] text-[#00e700]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Deep Quantitative</span>
          </button>

          {weather && (
            <button
              onClick={() => setActiveTab('weather')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'weather'
                  ? 'border-[#00e700] text-[#00e700]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Weather & Venue</span>
            </button>
          )}

          {market && (
            <button
              onClick={() => setActiveTab('market')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'market'
                  ? 'border-[#00e700] text-[#00e700]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Sharp Money Flow</span>
            </button>
          )}
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

          {/* TAB 1: Overview & Drivers */}
          {activeTab === 'overview' && (
            <>
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
            </>
          )}

          {/* TAB 2: Deep Quantitative Stats */}
          {activeTab === 'advanced' && stats && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#00e700]" />
                Sport-Specific Quantitative Metrics
              </h4>

              {/* MLB Metrics */}
              {match.leagueId === 'mlb' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Starting Pitcher Arsenal</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.homeTeam.code} Starter Stuff+:</span>
                        <span className="font-mono font-bold text-emerald-400">{stats.home_pitcher_stuff_plus} (CSW {stats.home_pitcher_csw_pct}%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.awayTeam.code} Starter Stuff+:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.away_pitcher_stuff_plus} (CSW {stats.away_pitcher_csw_pct}%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Bullpen 3-Day Load (L3D)</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.homeTeam.code} Pen:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.home_bullpen_l3d_pitches} pitches ({stats.home_bullpen_status})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.awayTeam.code} Pen:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.away_bullpen_l3d_pitches} pitches ({stats.away_bullpen_status})</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2 bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-medium">Home Plate Umpire Zone Tendency:</span>
                      <span className="font-mono font-bold text-amber-400">{stats.umpire_impact}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NFL Metrics */}
              {match.leagueId === 'nfl' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Trench Battle (PBWR vs PRWR)</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.homeTeam.code} Pass Block / Rush:</span>
                        <span className="font-mono font-bold text-emerald-400">{stats.home_pbwr}% / {stats.home_prwr}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.awayTeam.code} Pass Block / Rush:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.away_pbwr}% / {stats.away_prwr}%</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Net Trench Edge:</span>
                        <span className="font-mono font-bold text-[#00e700]">{stats.home_trench_edge}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Situational & Pace Metrics</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Red Zone TD %:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.home_rz_td_pct} vs {stats.away_rz_td_pct}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Neutral Game Pace:</span>
                        <span className="font-mono font-bold text-amber-400">{stats.neutral_pace_sec}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 italic mt-1">{stats.pace_verdict}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Soccer Metrics */}
              {(match.leagueId === 'epl' || match.leagueId === 'laliga') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Non-Penalty Expected Goals (npxG)</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.homeTeam.code} npxG / npxGA:</span>
                        <span className="font-mono font-bold text-emerald-400">{stats.home_npxg} / {stats.home_npxga}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.awayTeam.code} npxG / npxGA:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.away_npxg} / {stats.away_npxga}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Pressing & Tactical Control</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">PPDA (Pressing Intensity):</span>
                        <span className="font-mono font-bold text-cyan-400">{stats.home_ppda} vs {stats.away_ppda}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Set-Piece Danger:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.set_piece_danger}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NBA Metrics */}
              {match.leagueId === 'nba' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">5-Man Starting Lineup Net Rating</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.homeTeam.code} Starters:</span>
                        <span className="font-mono font-bold text-emerald-400">{stats.home_starter_net_rtg} per 100 poss</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">{match.awayTeam.code} Starters:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.away_starter_net_rtg} per 100 poss</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Schedule Fatigue & Pace</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Travel Strain:</span>
                        <span className="font-mono font-bold text-amber-400">{stats.schedule_strain}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Projected Possessions:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.projected_pace}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tennis Metrics */}
              {match.leagueId === 'tennis' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Surface Court Pace Index (CPI)</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">CPI Rating:</span>
                        <span className="font-mono font-bold text-lime-400">CPI {stats.court_pace_index} ({stats.court_speed_desc})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{stats.surface_relevance}</div>
                    </div>
                  </div>

                  <div className="bg-[#0e131d] border border-[#1b2336] p-3 rounded-xl">
                    <div className="text-slate-400 font-medium">Stamina & Conversion Index</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Court Time L3D:</span>
                        <span className="font-mono font-bold text-slate-200">{stats.court_time_l3d}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Break Point Conversion:</span>
                        <span className="font-mono font-bold text-emerald-400">{stats.bp_conversion_rate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Weather & Stadium */}
          {activeTab === 'weather' && weather && (
            <div className="space-y-4 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                Live Atmospheric Conditions (Open-Meteo Integration)
              </h4>

              <div className="bg-[#0e131d] border border-[#1b2336] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-[#1b2336] pb-2">
                  <span className="font-bold text-sm text-white">{weather.venueName}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    weather.isDome ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {weather.isDome ? 'Controlled Dome' : 'Outdoor Stadium'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                  <div className="bg-[#141b2a] p-2.5 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Temperature</div>
                    <div className="text-base font-extrabold text-white mt-0.5">{Math.round(weather.temperatureF)}°F</div>
                  </div>
                  <div className="bg-[#141b2a] p-2.5 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Wind Velocity</div>
                    <div className="text-base font-extrabold text-white mt-0.5">{Math.round(weather.windSpeedMph)} mph</div>
                  </div>
                  <div className="bg-[#141b2a] p-2.5 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Wind Vector</div>
                    <div className="text-xs font-bold text-cyan-400 mt-1">{weather.windDirection}</div>
                  </div>
                  <div className="bg-[#141b2a] p-2.5 rounded-lg">
                    <div className="text-[10px] text-slate-400 uppercase">Air Density Impact</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1">{weather.impactDesc}</div>
                  </div>
                </div>

                <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-lg text-slate-300 text-[11px]">
                  <strong>Scoring Model Impact:</strong> Atmospheric density and wind velocity apply a <strong>{weather.totalModifier >= 0 ? `+${weather.totalModifier}` : weather.totalModifier}</strong> expected total modifier to this game.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Market Microstructure */}
          {activeTab === 'market' && market && (
            <div className="space-y-4 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5 text-[#00e700]" />
                Closing Line Value & Sharp Money Microstructure
              </h4>

              <div className="bg-[#0e131d] border border-[#1b2336] p-4 rounded-xl space-y-4">
                {/* Tickets vs Handle Distribution Bar */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="text-slate-400">Public Ticket Volume (Bets):</span>
                    <span className="font-mono text-slate-200">{match.homeTeam.code} {market.ticketPctHome}% • {match.awayTeam.code} {market.ticketPctAway}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${market.ticketPctHome}%` }} className="bg-slate-500 h-full" />
                    <div style={{ width: `${market.ticketPctAway}%` }} className="bg-slate-700 h-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-[11px]">
                    <span className="text-slate-400">Total Money Handle (Volume $):</span>
                    <span className="font-mono text-[#00e700] font-bold">{match.homeTeam.code} {market.handlePctHome}% • {match.awayTeam.code} {market.handlePctAway}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${market.handlePctHome}%` }} className="bg-[#00e700] h-full" />
                    <div style={{ width: `${market.handlePctAway}%` }} className="bg-emerald-800 h-full" />
                  </div>
                </div>

                {/* Reverse Line Movement Alert */}
                <div className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                  market.reverseLineMovement
                    ? 'bg-rose-950/25 border-rose-500/40 text-rose-200'
                    : 'bg-[#141b2a] border-[#1f293d] text-slate-300'
                }`}>
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${market.reverseLineMovement ? 'text-rose-400' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-xs">{market.sharpSignal} ({market.sharpSide} Side)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{market.rlmNote}</div>
                  </div>
                </div>
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
