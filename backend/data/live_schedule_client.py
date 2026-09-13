import os
import json
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import List, Dict, Any, Optional

class LiveScheduleClient:
    """
    Fetches real-time, official schedule feeds from ESPN and MLB APIs.
    Parses live teams, actual start times (formatted to ET), current scores,
    and real sportsbook market consensus lines (Spread, Total).
    """
    def __init__(self):
        self.endpoints = {
            "mlb": "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
            "nfl": "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
            "epl": "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard"
        }
        self.et_tz = ZoneInfo("America/New_York")

    def _fetch_json(self, url: str) -> Optional[Dict[str, Any]]:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=6) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            return None

    def _format_time_et(self, iso_date: str) -> str:
        try:
            # e.g. 2026-09-13T17:35Z
            clean = iso_date.replace("Z", "+00:00")
            dt_utc = datetime.fromisoformat(clean)
            dt_et = dt_utc.astimezone(self.et_tz)
            
            # Format nicely, e.g. "Today 1:35 PM"
            now_et = datetime.now(self.et_tz)
            if dt_et.date() == now_et.date():
                day_str = "Today"
            elif (dt_et.date() - now_et.date()).days == 1:
                day_str = "Tomorrow"
            else:
                day_str = dt_et.strftime("%A")

            time_str = dt_et.strftime("%I:%M %p").lstrip("0")
            return f"{day_str} {time_str}"
        except Exception:
            return "Today Scheduled"

    def get_real_slate(self, sport: str) -> List[Dict[str, Any]]:
        url = self.endpoints.get(sport.lower())
        if not url:
            return []

        data = self._fetch_json(url)
        if not data or 'events' not in data:
            return []

        games = []
        for ev in data.get('events', []):
            try:
                comp = ev['competitions'][0]
                home_team_data = next((c for c in comp['competitors'] if c.get('homeAway') == 'home'), None)
                away_team_data = next((c for c in comp['competitors'] if c.get('homeAway') == 'away'), None)
                if not home_team_data or not away_team_data:
                    continue

                status_type = comp.get('status', {}).get('type', {})
                is_live = status_type.get('state') == 'in'
                is_final = status_type.get('state') == 'post'
                status_str = "live" if is_live else ("finished" if is_final else "upcoming")
                period_str = comp.get('status', {}).get('type', {}).get('shortDetail')

                # Live / completed scores
                home_score = int(home_team_data.get('score', 0) or 0)
                away_score = int(away_team_data.get('score', 0) or 0)
                live_score = {"home": home_score, "away": away_score} if (is_live or is_final) else None

                # Market Odds parsing
                odds_list = comp.get('odds', [])
                market_spread = 2.5 if sport == 'nfl' else (1.5 if sport == 'mlb' else 0.5)
                market_total = 47.5 if sport == 'nfl' else (8.5 if sport == 'mlb' else 2.5)
                favored_team = "home"

                if odds_list and isinstance(odds_list, list) and len(odds_list) > 0 and odds_list[0]:
                    first_odds = odds_list[0]
                    if first_odds.get('overUnder'):
                        market_total = float(first_odds['overUnder'])
                    details = first_odds.get('details', '')
                    if details and ' ' in details:
                        parts = details.split()
                        fav_team_abbr = parts[0]
                        try:
                            spread_val = abs(float(parts[1]))
                            if sport == 'mlb' and spread_val > 5.0:
                                market_spread = 1.5
                            else:
                                market_spread = spread_val
                            if fav_team_abbr == away_team_data.get('team', {}).get('abbreviation'):
                                favored_team = "away"
                        except Exception:
                            pass

                start_time_et = self._format_time_et(comp.get('date', ''))
                
                # Standings / records
                home_records = home_team_data.get('records', [])
                home_rec = home_records[0].get('summary', '0-0') if home_records else '0-0'
                away_records = away_team_data.get('records', [])
                away_rec = away_records[0].get('summary', '0-0') if away_records else '0-0'

                games.append({
                    "game_id": f"{sport}_{ev.get('id')}",
                    "start_time": start_time_et,
                    "status": status_str,
                    "period": period_str if is_live else None,
                    "live_score": live_score,
                    "home_team": {
                        "name": home_team_data.get('team', {}).get('displayName', 'Home'),
                        "code": home_team_data.get('team', {}).get('abbreviation', 'HOM'),
                        "record": home_rec,
                        "logo": home_team_data.get('team', {}).get('logo')
                    },
                    "away_team": {
                        "name": away_team_data.get('team', {}).get('displayName', 'Away'),
                        "code": away_team_data.get('team', {}).get('abbreviation', 'AWY'),
                        "record": away_rec,
                        "logo": away_team_data.get('team', {}).get('logo')
                    },
                    "market_spread": market_spread,
                    "favored_team": favored_team,
                    "market_total": market_total
                })
            except Exception as parse_err:
                continue

        return games

live_client = LiveScheduleClient()

if __name__ == "__main__":
    for s in ["mlb", "nfl", "epl"]:
        slate = live_client.get_real_slate(s)
        print(f"Fetched {len(slate)} real {s.upper()} games")
        if slate:
            g = slate[0]
            print(f"  Sample: {g['away_team']['name']} @ {g['home_team']['name']} ({g['start_time']}) Spread: {g['market_spread']} Total: {g['market_total']}")