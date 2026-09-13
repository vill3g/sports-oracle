import React from 'react';
import { useSlip } from '../../context/SlipContext';

interface LeagueItem {
  id: string;
  name: string;
  icon: string;
  count?: number;
  highlight?: boolean;
}

const LEAGUES: LeagueItem[] = [
  { id: 'all', name: 'All Leagues', icon: '🏆' },
  { id: 'top_picks', name: 'High Edge Picks', icon: '⚡', highlight: true },
  { id: 'epl', name: 'Premier League', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', count: 3 },
  { id: 'tennis', name: 'Tennis ATP/WTA', icon: '🎾', count: 2 },
  { id: 'mlb', name: 'MLB (ApexProps)', icon: '⚾', count: 2 },
  { id: 'nfl', name: 'NFL', icon: '🏈', count: 2 },
  { id: 'nba', name: 'NBA', icon: '🏀', count: 2 },
  { id: 'laliga', name: 'La Liga', icon: '🇪🇸', count: 1 },
];

export const LeagueNav: React.FC = () => {
  const { activeLeague, setActiveLeague } = useSlip();

  return (
    <div className="bg-[#0e121c] border-b border-[#20293d] sticky top-[61px] z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {LEAGUES.map((league) => {
            const isActive = activeLeague === league.id;
            return (
              <button
                key={league.id}
                onClick={() => setActiveLeague(league.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? league.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg shadow-amber-500/20'
                      : 'bg-[#00e700] text-black shadow-lg shadow-[#00e700]/25'
                    : league.highlight
                    ? 'bg-[#211a0c] text-amber-400 border border-amber-500/40 hover:bg-amber-950/40'
                    : 'bg-[#131824] text-slate-300 border border-[#20293d] hover:bg-[#1a2234] hover:text-white'
                }`}
              >
                <span className="text-sm leading-none">{league.icon}</span>
                <span>{league.name}</span>
                {league.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-black/20 text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {league.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};