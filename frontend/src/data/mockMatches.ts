import { MatchPrediction } from '../types/prediction';

export const INITIAL_PREDICTIONS: MatchPrediction[] = [
  // TENNIS (ATP Masters)
  {
    id: 'tennis_alc_sin',
    leagueId: 'tennis',
    leagueName: 'Tennis (ATP Masters 1000)',
    startTime: 'Today 4:00 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Carlos Alcaraz',
      code: 'ALC',
      record: 'Rank #2 • Hard Court',
      winProb: 0.535,
      projectedScore: 12.8
    },
    awayTeam: {
      name: 'Jannik Sinner',
      code: 'SIN',
      record: 'Rank #1 • Hard Court',
      winProb: 0.465,
      projectedScore: 12.2
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 0.6,
      marketLine: 1.5,
      edge: 0.9,
      coverProb: 0.56
    },
    projectedTotal: {
      projected: 25.0,
      marketLine: 22.5,
      recommendation: 'OVER',
      edgePoints: 2.5,
      overProb: 0.624
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.88,
    edgeScore: 7.8,
    isTopPick: true,
    modelVersion: 'Tennis-Markov-2.4',
    keyDrivers: [
      'Alcaraz 69.2% service hold prob on fast hard court',
      'Sinner 71.8% hold expectation: High probability of 3 full sets or tiebreak',
      'Projected total games: 25.0 (Model heavy lean OVER 22.5 games)'
    ],
    features: [
      { name: 'Hard Court Elo Rating', impact: '+18 Elo Points ALC', description: 'Head-to-head match form on hard courts tracks higher return win %', favors: 'home' },
      { name: 'Service Game Hold Expectation', impact: '69% vs 72%', description: 'Derived from 1st serve in% and unreturned serve rate', favors: 'away' },
      { name: 'Tiebreak Volatility', impact: '38% Set 1 TB', description: 'Fast surface dampens break opportunities', favors: 'neutral' }
    ]
  },
  {
    id: 'tennis_djo_zve',
    leagueId: 'tennis',
    leagueName: 'Tennis (ATP Masters 1000)',
    startTime: 'Tonight 8:30 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Novak Djokovic',
      code: 'DJO',
      record: 'Rank #3 • Hard Court',
      winProb: 0.628,
      projectedScore: 13.2
    },
    awayTeam: {
      name: 'Alexander Zverev',
      code: 'ZVE',
      record: 'Rank #4 • Hard Court',
      winProb: 0.372,
      projectedScore: 11.8
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.4,
      marketLine: 2.5,
      edge: 1.1,
      coverProb: 0.58
    },
    projectedTotal: {
      projected: 25.0,
      marketLine: 23.5,
      recommendation: 'OVER',
      edgePoints: 1.5,
      overProb: 0.585
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.84,
    edgeScore: 6.8,
    isTopPick: false,
    modelVersion: 'Tennis-Markov-2.4',
    keyDrivers: [
      'Djokovic second-serve return win rate (54.8%) neutralizes Zverev baseline attack',
      'Djokovic hold expectation: 82% on outdoor hard courts',
      'Historical head-to-head record favors Djokovic (8-4)'
    ]
  },

  // MLB (ApexProps Statcast)
  {
    id: 'mlb_nyy_bos',
    leagueId: 'mlb',
    leagueName: 'MLB',
    startTime: 'Today 7:05 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'NY Yankees',
      code: 'NYY',
      record: '24-14 • Cole (2.94 xFIP)',
      winProb: 0.648,
      projectedScore: 5.6
    },
    awayTeam: {
      name: 'Boston Red Sox',
      code: 'BOS',
      record: '19-19 • Houck (3.86 xFIP)',
      winProb: 0.352,
      projectedScore: 3.7
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.9,
      marketLine: 1.5,
      edge: 0.4,
      coverProb: 0.584
    },
    projectedTotal: {
      projected: 9.3,
      marketLine: 8.5,
      recommendation: 'OVER',
      edgePoints: 0.8,
      overProb: 0.612
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.86,
    edgeScore: 8.5,
    isTopPick: true,
    modelVersion: 'ApexProps-Statcast-1.1',
    keyDrivers: [
      'Judge: 64% Prob Over 1.5 HRR (ApexProps Statcast ML)',
      'Cole xFIP (2.94) vs Red Sox lineup wOBA (.298 against right-hand fastballs)',
      'Short porch park factor: Yankee Stadium 1.09 multiplier on right field fly balls'
    ],
    features: [
      { name: 'ApexProps Statcast Matchup', impact: '+16.4% Edge', description: 'Aaron Judge 64% Prob Over 1.5 Hits+Runs+RBIs (Statcast ML Model)', favors: 'home' },
      { name: 'Pitcher xFIP Disparity', impact: '-1.42 Runs Allowed', description: 'Gerrit Cole (2.94 xFIP) vs Tanner Houck (3.86 xFIP)', favors: 'home' },
      { name: 'Bullpen CSW Rating', impact: 'NYY 32.1% vs BOS 27.8%', description: 'Called strikes + whiffs in late innings favor Yankees', favors: 'home' }
    ]
  },
  {
    id: 'mlb_lad_sd',
    leagueId: 'mlb',
    leagueName: 'MLB',
    startTime: 'Tonight 9:40 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'LA Dodgers',
      code: 'LAD',
      record: '27-13 • Yamamoto (2.85 ERA)',
      winProb: 0.622,
      projectedScore: 5.2
    },
    awayTeam: {
      name: 'SD Padres',
      code: 'SD',
      record: '22-18 • Cease (3.42 ERA)',
      winProb: 0.378,
      projectedScore: 3.9
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.3,
      marketLine: 1.5,
      edge: 0.2,
      coverProb: 0.548
    },
    projectedTotal: {
      projected: 9.1,
      marketLine: 8.0,
      recommendation: 'OVER',
      edgePoints: 1.1,
      overProb: 0.628
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.84,
    edgeScore: 7.9,
    isTopPick: false,
    modelVersion: 'ApexProps-Statcast-1.1',
    keyDrivers: [
      'Ohtani + Betts top-of-order combined Statcast wOBA: .418',
      'Over 8.0 value: Both starting pitchers surrender 1.2+ HR per 9 innings',
      'Dodger Stadium warm weather trajectory elevates ball carry'
    ]
  },

  // EPL (Trained XGBoost)
  {
    id: 'epl_ars_che',
    leagueId: 'epl',
    leagueName: 'Premier League',
    startTime: 'Today 3:00 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Arsenal',
      code: 'ARS',
      record: '18-5-3',
      winProb: 0.642,
      projectedScore: 2.3
    },
    awayTeam: {
      name: 'Chelsea',
      code: 'CHE',
      record: '12-7-7',
      winProb: 0.186,
      projectedScore: 0.9
    },
    drawProb: 0.172,
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.4,
      marketLine: 0.75,
      edge: 0.65,
      coverProb: 0.612
    },
    projectedTotal: {
      projected: 3.2,
      marketLine: 2.5,
      recommendation: 'OVER',
      edgePoints: 0.7,
      overProb: 0.598
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.84,
    edgeScore: 8.4,
    isTopPick: true,
    modelVersion: 'Soccer-XGB-3.2',
    keyDrivers: [
      'Trained XGBoost model: Arsenal generates +0.94 xG differential per 90',
      'Chelsea conceding 1.62 expected goals on road fixtures',
      'Rest differential: Arsenal +4 days rest advantage'
    ],
    features: [
      { name: 'XGBoost Rolling Stats (soccer_ml)', impact: '+14.2% Win', description: 'Arsenal ranks #1 in Premier League over last 6 matches in non-penalty xG', favors: 'home' },
      { name: 'Rest Disparity', impact: '+5.1% Win', description: 'Chelsea played midweek cup fixture; squad fatigue index high', favors: 'home' }
    ]
  },
  {
    id: 'epl_tot_mun',
    leagueId: 'epl',
    leagueName: 'Premier League',
    startTime: "LIVE 62'",
    status: 'live',
    period: "2nd Half 62'",
    liveScore: { home: 2, away: 1 },
    homeTeam: {
      name: 'Tottenham',
      code: 'TOT',
      record: '14-4-9',
      winProb: 0.724,
      projectedScore: 2.8
    },
    awayTeam: {
      name: 'Man United',
      code: 'MUN',
      record: '13-3-11',
      winProb: 0.128,
      projectedScore: 1.4
    },
    drawProb: 0.148,
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.4,
      marketLine: 0.5,
      edge: 0.9,
      coverProb: 0.690
    },
    projectedTotal: {
      projected: 4.2,
      marketLine: 3.5,
      recommendation: 'OVER',
      edgePoints: 0.7,
      overProb: 0.665
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.86,
    edgeScore: 9.1,
    isTopPick: false,
    modelVersion: 'Soccer-XGB-3.2',
    keyDrivers: [
      'In-game momentum model shows Tottenham +1.42 xG since minute 45',
      'Man United 4 yellow cards accumulated; defensive retreat style'
    ]
  },
  {
    id: 'epl_liv_mci',
    leagueId: 'epl',
    leagueName: 'Premier League',
    startTime: 'Tomorrow 11:30 AM',
    status: 'upcoming',
    homeTeam: {
      name: 'Liverpool',
      code: 'LIV',
      record: '19-6-2',
      winProb: 0.468,
      projectedScore: 1.9
    },
    awayTeam: {
      name: 'Man City',
      code: 'MCI',
      record: '18-6-3',
      winProb: 0.334,
      projectedScore: 1.6
    },
    drawProb: 0.198,
    projectedSpread: {
      favoredTeam: 'home',
      margin: 0.3,
      marketLine: 0.0,
      edge: 0.3,
      coverProb: 0.545
    },
    projectedTotal: {
      projected: 3.5,
      marketLine: 3.0,
      recommendation: 'OVER',
      edgePoints: 0.5,
      overProb: 0.572
    },
    confidenceRating: 'MEDIUM',
    confidenceScore: 0.71,
    edgeScore: 5.6,
    isTopPick: false,
    modelVersion: 'Soccer-XGB-3.2',
    keyDrivers: [
      'Anfield home effect swings win probability by +8.2%',
      'Combined attacking output projects 3.5 expected goals'
    ]
  },

  // NFL (EPA Ensemble)
  {
    id: 'nfl_kc_bal',
    leagueId: 'nfl',
    leagueName: 'NFL',
    startTime: 'Sunday 4:25 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Kansas City Chiefs',
      code: 'KC',
      record: '13-3',
      winProb: 0.628,
      projectedScore: 26.8
    },
    awayTeam: {
      name: 'Baltimore Ravens',
      code: 'BAL',
      record: '12-4',
      winProb: 0.372,
      projectedScore: 22.4
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 4.4,
      marketLine: 2.5,
      edge: 1.9,
      coverProb: 0.592
    },
    projectedTotal: {
      projected: 49.2,
      marketLine: 46.5,
      recommendation: 'OVER',
      edgePoints: 2.7,
      overProb: 0.584
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.88,
    edgeScore: 8.9,
    isTopPick: true,
    modelVersion: 'NFL-Ensemble-4.2',
    keyDrivers: [
      'Dropback EPA differential: KC +0.22 vs BAL +0.14',
      'Chiefs defensive EPA vs designed QB runs ranks #1 in NFL',
      'Red zone TD efficiency: KC converts 68% vs BAL road defense 52%'
    ],
    features: [
      { name: 'Dropback EPA Differential', impact: '+0.18 EPA', description: 'Mahomes against Cover-3 / Cover-4 schemes ranks in 98th percentile', favors: 'home' },
      { name: 'Rushing Success Rate', impact: '+8.6% Rush EPA', description: 'Lamar Jackson designed zone read creates explosive run upside', favors: 'away' }
    ]
  },
  {
    id: 'nfl_sf_det',
    leagueId: 'nfl',
    leagueName: 'NFL',
    startTime: 'Sunday 8:20 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'San Francisco 49ers',
      code: 'SF',
      record: '12-5',
      winProb: 0.548,
      projectedScore: 27.1
    },
    awayTeam: {
      name: 'Detroit Lions',
      code: 'DET',
      record: '13-4',
      winProb: 0.452,
      projectedScore: 25.6
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 1.5,
      marketLine: 3.5,
      edge: 2.0,
      coverProb: 0.581
    },
    projectedTotal: {
      projected: 52.7,
      marketLine: 51.0,
      recommendation: 'OVER',
      edgePoints: 1.7,
      overProb: 0.562
    },
    confidenceRating: 'VALUE_LEAN',
    confidenceScore: 0.74,
    edgeScore: 7.1,
    isTopPick: false,
    modelVersion: 'NFL-Ensemble-4.2',
    keyDrivers: [
      'Market overvaluing 49ers spread line by 2.0 full points',
      'Lions offensive line win rate 74% provides Goff clean pocket protection'
    ]
  },

  // NBA (Four Factors)
  {
    id: 'nba_bos_den',
    leagueId: 'nba',
    leagueName: 'NBA',
    startTime: 'Tonight 7:30 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Boston Celtics',
      code: 'BOS',
      record: '45-12',
      winProb: 0.612,
      projectedScore: 118.4
    },
    awayTeam: {
      name: 'Denver Nuggets',
      code: 'DEN',
      record: '40-19',
      winProb: 0.388,
      projectedScore: 113.1
    },
    projectedSpread: {
      favoredTeam: 'home',
      margin: 5.3,
      marketLine: 3.5,
      edge: 1.8,
      coverProb: 0.574
    },
    projectedTotal: {
      projected: 231.5,
      marketLine: 226.5,
      recommendation: 'OVER',
      edgePoints: 5.0,
      overProb: 0.624
    },
    confidenceRating: 'HIGH',
    confidenceScore: 0.86,
    edgeScore: 9.4,
    isTopPick: true,
    modelVersion: 'NBA-FourFactor-3.8',
    keyDrivers: [
      'Projected Over edge: Model estimates 231.5 total points (+5.0 edge)',
      'Celtics 3PT volume (42 attempts/game) vs Nuggets drop coverage'
    ]
  },

  // La Liga
  {
    id: 'laliga_rm_bar',
    leagueId: 'laliga',
    leagueName: 'La Liga',
    startTime: 'Sunday 3:00 PM',
    status: 'upcoming',
    homeTeam: {
      name: 'Real Madrid',
      code: 'RMA',
      record: '20-5-2',
      winProb: 0.552,
      projectedScore: 2.1
    },
    awayTeam: {
      name: 'Barcelona',
      code: 'BAR',
      record: '19-4-4',
      winProb: 0.264,
      projectedScore: 1.3
    },
    drawProb: 0.184,
    projectedSpread: {
      favoredTeam: 'home',
      margin: 0.8,
      marketLine: 0.5,
      edge: 0.3,
      coverProb: 0.558
    },
    projectedTotal: {
      projected: 3.4,
      marketLine: 2.75,
      recommendation: 'OVER',
      edgePoints: 0.65,
      overProb: 0.584
    },
    confidenceRating: 'MEDIUM',
    confidenceScore: 0.75,
    edgeScore: 6.2,
    isTopPick: true,
    modelVersion: 'Soccer-XGB-3.2',
    keyDrivers: [
      'Real Madrid counter-press efficiency +11% at Santiago Bernabéu',
      'Barcelona high-defensive line vulnerable to Vinicius speed indices'
    ]
  }
];