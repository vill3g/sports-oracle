from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from abc import ABC, abstractmethod

class TeamInfo(BaseModel):
    name: str
    code: str
    record: str
    logo: Optional[str] = None
    winProb: float  # e.g. 0.684
    projectedScore: float  # e.g. 24.5 or 2.1

class ProjectedSpread(BaseModel):
    favoredTeam: Literal["home", "away"]
    margin: float       # e.g. 6.5
    marketLine: float   # e.g. 3.5
    edge: float         # e.g. +3.0
    coverProb: float    # e.g. 0.582

class ProjectedTotal(BaseModel):
    projected: float    # e.g. 48.2
    marketLine: float   # e.g. 44.5
    recommendation: Literal["OVER", "UNDER"]
    edgePoints: float   # e.g. +3.7
    overProb: float     # e.g. 0.575

class FeatureImpact(BaseModel):
    name: str
    impact: str  # e.g. "+8.4% Win Prob" or "-3.2 pts"
    description: str
    favors: Literal["home", "away", "neutral"]

class WeatherInfo(BaseModel):
    venueName: str
    isDome: bool
    temperatureF: float
    windSpeedMph: float
    windDirection: str
    condition: str
    impactDesc: str
    totalModifier: float

class MarketIntelligence(BaseModel):
    ticketPctHome: float
    handlePctHome: float
    ticketPctAway: float
    handlePctAway: float
    reverseLineMovement: bool
    rlmNote: str
    sharpSignal: str
    sharpSide: str

class AdvancedMetrics(BaseModel):
    weather: Optional[WeatherInfo] = None
    market: Optional[MarketIntelligence] = None
    sportStats: Optional[dict] = None

class MatchPrediction(BaseModel):
    id: str
    leagueId: str  # "epl", "nfl", "nba", "mlb", "laliga"
    leagueName: str
    startTime: str
    status: Literal["upcoming", "live", "finished"]
    period: Optional[str] = None  # "1st Half", "Q3 4:12", "Top 7th"
    liveScore: Optional[dict] = None # {"home": 2, "away": 1}
    homeTeam: TeamInfo
    awayTeam: TeamInfo
    drawProb: Optional[float] = None
    projectedSpread: ProjectedSpread
    projectedTotal: ProjectedTotal
    confidenceRating: Literal["HIGH", "MEDIUM", "VALUE_LEAN"]
    confidenceScore: float # 0.0 to 1.0
    edgeScore: float # e.g. +7.8% (divergence from implied market probability)
    isTopPick: bool = False
    modelVersion: str
    keyDrivers: List[str]
    features: Optional[List[FeatureImpact]] = None
    advancedMetrics: Optional[AdvancedMetrics] = None

class LeagueMeta(BaseModel):
    id: str
    name: str
    icon: str
    sport: str
    activeGames: int
    modelName: str
    modelVersion: str
    accuracyL30D: float # e.g. 67.4%
    roiL30D: float      # e.g. +14.2%

class BaseLeagueEngine(ABC):
    @abstractmethod
    def get_meta(self) -> LeagueMeta:
        pass

    @abstractmethod
    def get_predictions(self) -> List[MatchPrediction]:
        pass

    @abstractmethod
    def get_match_insights(self, match_id: str) -> Optional[dict]:
        pass
