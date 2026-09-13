from typing import List, Optional
from .base import (
    BaseLeagueEngine, LeagueMeta, MatchPrediction, TeamInfo, ProjectedSpread,
    ProjectedTotal, FeatureImpact, AdvancedMetrics, MarketIntelligence
)
from data.advanced_metrics_provider import metrics_provider

class NBAEngine(BaseLeagueEngine):
    def get_meta(self) -> LeagueMeta:
        return LeagueMeta(
            id="nba",
            name="NBA",
            icon="🏀",
            sport="Basketball",
            activeGames=1,
            modelName="Four-Factors & Pace Markov Simulator",
            modelVersion="NBA-FourFactor-3.8",
            accuracyL30D=64.1,
            roiL30D=14.8
        )

    def get_predictions(self) -> List[MatchPrediction]:
        adv_stats = metrics_provider.get_nba_advanced("BOS", "DEN")
        market_intel = metrics_provider.get_market_intelligence("nba_bos_den", "home")

        adv_obj = AdvancedMetrics(
            market=MarketIntelligence(
                ticketPctHome=market_intel["ticket_pct_home"],
                handlePctHome=market_intel["handle_pct_home"],
                ticketPctAway=market_intel["ticket_pct_away"],
                handlePctAway=market_intel["handle_pct_away"],
                reverseLineMovement=market_intel["reverse_line_movement"],
                rlmNote=market_intel["rlm_note"],
                sharpSignal=market_intel["sharp_signal"],
                sharpSide=market_intel["sharp_side"]
            ),
            sportStats=adv_stats
        )

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
                    f"Lineup Net Rating: BOS {adv_stats['home_starter_net_rtg']} vs DEN {adv_stats['away_starter_net_rtg']} per 100 poss",
                    f"Schedule Strain: DEN {adv_stats['schedule_strain']}",
                    f"Pace & Over Edge: Model projects {adv_stats['projected_pace']} (231.5 total points vs 226.5 line)",
                    f"Sharp Money Flow: {market_intel['sharp_signal']} ({market_intel['handle_pct_home']}% handle on Celtics)"
                ],
                features=[
                    FeatureImpact(name="5-Man Starter Net Rating", impact=f"{adv_stats['home_starter_net_rtg']} vs {adv_stats['away_starter_net_rtg']}", description="Differential net points scored per 100 possessions", favors="home"),
                    FeatureImpact(name="Schedule Fatigue Factor", impact=adv_stats["schedule_strain"], description="Rest advantage and travel distance load on road squad", favors="home"),
                    FeatureImpact(name="Shot Diet Efficiency", impact=adv_stats["shot_diet_edge"], description="Celtics floor spacing generates highest corner-3 shot quality in NBA", favors="home")
                ],
                advancedMetrics=adv_obj
            )
        ]

    def get_match_insights(self, match_id: str) -> Optional[dict]:
        for p in self.get_predictions():
            if p.id == match_id:
                return {"match": p}
        return None
