export interface TeamInfo {
  name: string;
  code: string;
  record: string;
  logo?: string;
  winProb: number;
  projectedScore: number;
}

export interface ProjectedSpread {
  favoredTeam: 'home' | 'away';
  margin: number;
  marketLine: number;
  edge: number;
  coverProb: number;
}

export interface ProjectedTotal {
  projected: number;
  marketLine: number;
  recommendation: 'OVER' | 'UNDER';
  edgePoints: number;
  overProb: number;
}

export interface FeatureImpact {
  name: string;
  impact: string;
  description: string;
  favors: 'home' | 'away' | 'neutral';
}

export interface MatchPrediction {
  id: string;
  leagueId: string;
  leagueName: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'finished';
  period?: string;
  liveScore?: { home: number; away: number };
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  drawProb?: number;
  projectedSpread: ProjectedSpread;
  projectedTotal: ProjectedTotal;
  confidenceRating: 'HIGH' | 'MEDIUM' | 'VALUE_LEAN';
  confidenceScore: number;
  edgeScore: number;
  isTopPick?: boolean;
  modelVersion: string;
  keyDrivers: string[];
  features?: FeatureImpact[];
}

export interface LeagueMeta {
  id: string;
  name: string;
  icon: string;
  sport: string;
  activeGames: number;
  modelName: string;
  modelVersion: string;
  accuracyL30D: number;
  roiL30D: number;
}

export type PickType = 'MONEYLINE' | 'SPREAD' | 'TOTAL';

export interface SelectedPrediction {
  id: string; // unique slip item id (matchId + type + selection)
  matchId: string;
  matchTitle: string;
  leagueId: string;
  leagueIcon: string;
  pickType: PickType;
  selectionTitle: string; // e.g. "Arsenal Win" or "Over 2.5 Goals"
  probability: number;    // e.g. 0.642
  edge: number;           // e.g. 8.4
  confidenceRating: 'HIGH' | 'MEDIUM' | 'VALUE_LEAN';
}
