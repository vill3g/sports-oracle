import json
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import List, Dict, Any, Optional

class ESPNClient:
    """
    Official ESPN Sports Data Client.
    Fetches real-time game schedules, box score player statistics,
    team game logs (last 5 games), head-to-head series, and game leaders
    exclusively from ESPN's public endpoints.
    """
    def __init__(self):
        self.leagues_map = {
            "mlb": ("baseball", "mlb"),
            "nfl": ("football", "nfl"),
            "epl": ("soccer", "eng.1"),
            "laliga": ("soccer", "esp.1"),
            "nba": ("basketball", "nba"),
            "tennis": ("tennis", "atp")
        }
        self.et_tz = ZoneInfo("America/New_York")
        self._cache = {}
        self._cache_timeout = 60 # 60 seconds TTL

    def _fetch_json(self, url: str) -> Optional[Dict[str, Any]]:
        now = datetime.now().timestamp()
        if url in self._cache:
            data, cached_at = self._cache[url]
            if now - cached_at < self._cache_timeout:
                return data

        try:
            req = urllib.request.Request(
                url,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                self._cache[url] = (data, now)
                return data
        except Exception as e:
            if url in self._cache:
                return self._cache[url][0]
            return None

    def _format_time_et(self, iso_date: str) -> str:
        try:
            clean = iso_date.replace("Z", "+00:00")
            dt_utc = datetime.fromisoformat(clean)
            dt_et = dt_utc.astimezone(self.et_tz)
            now_et = datetime.now(self.et_tz)

            day_diff = (dt_et.date() - now_et.date()).days
            if day_diff == 0:
                day_str = "Today"
            elif day_diff == 1:
                day_str = "Tomorrow"
            elif day_diff == -1:
                day_str = "Yesterday"
            else:
                day_str = dt_et.strftime("%a %b %d")

            time_str = dt_et.strftime("%I:%M %p").lstrip("0")
            return f"{day_str} {time_str}"
        except Exception:
            return "Today Scheduled"

    def get_schedule(self, league: str, date_str: Optional[str] = None) -> List[Dict[str, Any]]:
        league_key = league.lower()
        if league_key not in self.leagues_map:
            return []

        sport, l_code = self.leagues_map[league_key]
        url = f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{l_code}/scoreboard"
        if date_str:
            url += f"?dates={date_str}"

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

                home_score = int(home_team_data.get('score', 0) or 0)
                away_score = int(away_team_data.get('score', 0) or 0)
                live_score = {"home": home_score, "away": away_score} if (is_live or is_final) else None

                odds_list = comp.get('odds', [])
                market_spread = 2.5 if league_key == 'nfl' else (1.5 if league_key == 'mlb' else (0.5 if 'soc' in sport or league_key in ['epl', 'laliga'] else 4.5))
                market_total = 46.5 if league_key == 'nfl' else (8.5 if league_key == 'mlb' else (2.5 if 'soc' in sport or league_key in ['epl', 'laliga'] else 224.5))
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
                            if league_key == 'mlb' and spread_val > 5.0:
                                market_spread = 1.5
                            else:
                                market_spread = spread_val
                            if fav_team_abbr == away_team_data.get('team', {}).get('abbreviation'):
                                favored_team = "away"
                        except Exception:
                            pass

                start_time_et = self._format_time_et(comp.get('date', ''))
                home_records = home_team_data.get('records', [])
                home_rec = home_records[0].get('summary', '0-0') if home_records else '0-0'
                away_records = away_team_data.get('records', [])
                away_rec = away_records[0].get('summary', '0-0') if away_records else '0-0'

                home_logo = home_team_data.get('team', {}).get('logo') or f"https://a.espncdn.com/i/teamlogos/{league_key}/500/{home_team_data.get('team', {}).get('abbreviation', 'team').lower()}.png"
                away_logo = away_team_data.get('team', {}).get('logo') or f"https://a.espncdn.com/i/teamlogos/{league_key}/500/{away_team_data.get('team', {}).get('abbreviation', 'team').lower()}.png"

                games.append({
                    "event_id": str(ev.get('id')),
                    "game_id": f"{league_key}_{ev.get('id')}",
                    "league_id": league_key,
                    "name": ev.get('name', f"{away_team_data.get('team', {}).get('displayName')} at {home_team_data.get('team', {}).get('displayName')}"),
                    "start_time": start_time_et,
                    "date_iso": comp.get('date'),
                    "status": status_str,
                    "period": period_str if is_live else None,
                    "live_score": live_score,
                    "home_team": {
                        "id": str(home_team_data.get('team', {}).get('id', '')),
                        "name": home_team_data.get('team', {}).get('displayName', 'Home'),
                        "code": home_team_data.get('team', {}).get('abbreviation', 'HOM'),
                        "record": home_rec,
                        "logo": home_logo
                    },
                    "away_team": {
                        "id": str(away_team_data.get('team', {}).get('id', '')),
                        "name": away_team_data.get('team', {}).get('displayName', 'Away'),
                        "code": away_team_data.get('team', {}).get('abbreviation', 'AWY'),
                        "record": away_rec,
                        "logo": away_logo
                    },
                    "market_spread": market_spread,
                    "favored_team": favored_team,
                    "market_total": market_total
                })
            except Exception:
                continue

        return games

    def get_game_details(self, league: str, event_id: str) -> Dict[str, Any]:
        league_key = league.lower()
        if league_key not in self.leagues_map:
            return {}

        sport, l_code = self.leagues_map[league_key]
        url = f"https://site.api.espn.com/apis/site/v2/sports/{sport}/{l_code}/summary?event={event_id}"
        data = self._fetch_json(url)
        if not data:
            return {}

        # 1. Player Boxscore Stats
        boxscore_data = data.get('boxscore', {})
        players_grouped = []
        for team_box in boxscore_data.get('players', []):
            team_info = team_box.get('team', {})
            categories = []
            for stat_cat in team_box.get('statistics', []):
                cat_name = stat_cat.get('type') or stat_cat.get('name') or 'Player Stats'
                labels = stat_cat.get('labels', [])
                athletes_list = []
                for a in stat_cat.get('athletes', []):
                    ath = a.get('athlete', {})
                    athletes_list.append({
                        "name": ath.get('displayName', 'Player'),
                        "shortName": ath.get('shortName', ''),
                        "jersey": ath.get('jersey', ''),
                        "position": ath.get('position', {}).get('abbreviation', ''),
                        "headshot": ath.get('headshot', {}).get('href', ''),
                        "stats": a.get('stats', []),
                        "starter": a.get('starter', False)
                    })
                categories.append({
                    "category": cat_name.capitalize(),
                    "labels": labels,
                    "athletes": athletes_list
                })
            players_grouped.append({
                "teamId": str(team_info.get('id', '')),
                "teamName": team_info.get('displayName', ''),
                "teamAbbr": team_info.get('abbreviation', ''),
                "categories": categories
            })

        # 2. Rosters (Soccer / additional fallback)
        roster_players = []
        for r_team in data.get('rosters', []):
            r_info = r_team.get('team', {})
            p_list = []
            for p in r_team.get('roster', []):
                ath = p.get('athlete', {})
                p_list.append({
                    "name": ath.get('displayName', ''),
                    "jersey": p.get('jersey', ''),
                    "position": p.get('position', {}).get('name', ''),
                    "headshot": ath.get('headshot', {}).get('href', ''),
                    "starter": p.get('starter', False),
                    "subbedIn": p.get('subbedIn', False)
                })
            roster_players.append({
                "teamId": str(r_info.get('id', '')),
                "teamName": r_info.get('displayName', ''),
                "players": p_list
            })

        # 3. Game Leaders
        leaders_list = []
        for l_group in data.get('leaders', []):
            team_info = l_group.get('team', {})
            cat_leaders = []
            for cat in l_group.get('leaders', []):
                sub_leaders = cat.get('leaders', [])
                if sub_leaders:
                    lead_ath = sub_leaders[0].get('athlete', {})
                    cat_leaders.append({
                        "category": cat.get('displayName', ''),
                        "athleteName": lead_ath.get('displayName', ''),
                        "jersey": lead_ath.get('jersey', ''),
                        "position": lead_ath.get('position', {}).get('abbreviation', ''),
                        "headshot": lead_ath.get('headshot', {}).get('href', ''),
                        "displayValue": sub_leaders[0].get('displayValue', '')
                    })
            leaders_list.append({
                "teamId": str(team_info.get('id', '')),
                "teamName": team_info.get('displayName', ''),
                "leaders": cat_leaders
            })

        # 4. Last 5 Game Logs
        last_five = []
        for lf in data.get('lastFiveGames', []):
            team_info = lf.get('team', {})
            events_list = []
            for ev in lf.get('events', []):
                events_list.append({
                    "opponent": ev.get('opponent', {}).get('displayName', 'Opponent'),
                    "opponentAbbr": ev.get('opponent', {}).get('abbreviation', ''),
                    "opponentLogo": ev.get('opponent', {}).get('logo', ''),
                    "result": ev.get('gameResult', 'W'),
                    "score": ev.get('score', ''),
                    "date": ev.get('gameDate', '')
                })
            last_five.append({
                "teamId": str(team_info.get('id', '')),
                "teamName": team_info.get('displayName', ''),
                "teamAbbr": team_info.get('abbreviation', ''),
                "games": events_list
            })

        # 5. Head-to-Head History (seasonseries)
        h2h_matches = []
        for ss in data.get('seasonseries', []):
            for ss_ev in ss.get('events', []):
                try:
                    comps = ss_ev.get('competitions', [{}])[0]
                    teams = comps.get('competitors', [])
                    if len(teams) >= 2:
                        h2h_matches.append({
                            "date": self._format_time_et(ss_ev.get('date', '')),
                            "team1": {
                                "name": teams[0].get('team', {}).get('displayName', ''),
                                "score": teams[0].get('score', ''),
                                "winner": teams[0].get('winner', False)
                            },
                            "team2": {
                                "name": teams[1].get('team', {}).get('displayName', ''),
                                "score": teams[1].get('score', ''),
                                "winner": teams[1].get('winner', False)
                            },
                            "status": ss_ev.get('statusType', {}).get('shortDetail', 'Final')
                        })
                except Exception:
                    continue

        # 6. Venue & Broadcast
        game_info = data.get('gameInfo', {})
        venue = game_info.get('venue', {})

        return {
            "eventId": event_id,
            "leagueId": league_key,
            "boxscore": players_grouped,
            "rosters": roster_players,
            "leaders": leaders_list,
            "lastFiveGames": last_five,
            "h2hMatches": h2h_matches,
            "venue": {
                "name": venue.get('fullName', ''),
                "city": venue.get('address', {}).get('city', ''),
                "indoor": venue.get('indoor', False)
            }
        }

espn_client = ESPNClient()
