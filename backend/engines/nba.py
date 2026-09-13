from typing import List, Optional
from .base import BaseLeagueEngine, LeagueMeta, MatchPrediction, TeamInfo, ProjectedSpread, ProjectedTotal, FeatureImpact

class NBAEngine(BaseLeagueEngine):
    def get_meta(self) -> LeagueMeta:
        return LeagueMeta(
            id="nba",
            name="NBA",
            icon="🏀",
            sport="Basketball",
            activeGames=2,
            modelName="Four-Factors & Pace Markov Simulator",
            modelVersion="v3.8.4",
            accuracyL30D=64.1,
            roiL30D=14.8
        )

    def get_predictions(self) -> List[MatchPrediction]:
        return [
            MatchPrediction(
                id="nba_bos_den",
                leagueId="nba",
                leagueName="NBA",
                startTime="Tonight 7:30 PM",
                status="upcoming",
                homeTeam=TeamInfo(
                    name="Boston Celtics",
                    code="BOS",
                    record="45-12",
                    winProb=0.612,
                    projectedScore=118.4
                ),
                awayTeam=TeamInfo(
                    name="Denver Nuggets",
                    code="DEN",
                    record="40-19",
                    winProb=0.388,
                    projectedScore=113.1
                ),
                projectedSpread=ProjectedSpread(
                    favoredTeam="home",
                    margin=5.3,
                    marketLine=3.5,
                    edge=1.8,
                    coverProb=0.574
                ),
                projectedTotal=ProjectedTotal(
                    projected=231.5,
                    marketLine=226.5,
                    recommendation="OVER",
                    edgePoints=5.0,
                    overProb=0.624
                ),
                confidenceRating="HIGH",
                confidenceScore=0.86,
                edgeScore=9.4,
                isTopPick=True,
                modelVersion="NBA-FourFactor-3.8",
                keyDrivers=[
                    "Projected Over edge: Model estimates 231.5 total points (+5.0 edge)",
                    "Celtics 3PT volume (42 attempts/game) vs Nuggets drop coverage",
                    "Net rating at TD Garden: Celtics +11.8 points per 100 possessions"
                ],
                features=[
                    FeatureImpact(name="Effective FG% (eFG%) Margin", impact="+4.2% eFG%", description="Celtics floor spacing generates highest corner-3 shot quality in NBA", favors="home"),
                    FeatureImpact(name="Offensive Rebound Rate", impact="+5.1% ORB", description="Jokic interior presence creates 2nd-chance point advantage for Denver", favors="away"),
                    FeatureImpact(name="Pace Acceleration", impact="+3.4 Possessions", description="Projected 102.5 possessions exceeds market baseline of 98.2", favors="neutral")
                ]
            ),
            MatchPrediction(
                id="nba_lal_gsw",
                leagueId="nba",
                leagueName="NBA",
                startTime="Tonight 10:00 PM",
                status="upcoming",
                homeTeam=TeamInfo(
                    name="LA Lakers",
                    code="LAL",
                    record="34-26",
                    winProb=0.526,
                    projectedScore=116.8
                ),
                awayTeam=TeamInfo(
                    name="GS Warriors",
                    code="GSW",
                    record="33-27",
                    winProb=0.474,
                    projectedScore=115.4
                ),
                projectedSpread=ProjectedSpread(
                    favoredTeam="home",
                    margin=1.4,
                    marketLine=2.5,
                    edge=1.1,
                    coverProb=0.548
                ),
                projectedTotal=ProjectedTotal(
                    projected=232.2,
                    marketLine=235.0,
                    recommendation="UNDER",
                    edgePoints=2.8,
                    overProb=0.442
                ),
                confidenceRating="VALUE_LEAN",
                confidenceScore=0.72,
                edgeScore=6.0,
                isTopPick=False,
                modelVersion="NBA-FourFactor-3.8",
                keyDrivers=[
                    "Under Lean: Defensive rating in head-to-heads improves in 4th quarters",
                    "Free throw rate differential: Lakers draw +6.2 more FT attempts",
                    "Fatigue impact: Warriors on second night of back-to-back"
                ]
            )
        ]

    def get_match_insights(self, match_id: str) -> Optional[dict]:
        for p in self.get_predictions():
            if p.id == match_id:
                return {"match": p}
        return None
