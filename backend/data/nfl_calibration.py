import os
import pandas as pd
import numpy as np

DATA_PATH = r"C:\Users\vill3\.gemini\antigravity\scratch\sports-oracle\backend\data\verified\nfl_verified.csv"

def compute_nfl_empirical_baselines():
    if not os.path.exists(DATA_PATH):
        return None
    df = pd.read_csv(DATA_PATH)
    
    # Filter to completed regular season games
    df = df[df['game_type'] == 'REG']
    
    home_win_pct = (df['result'] > 0).mean()
    avg_home_score = df['home_score'].mean()
    avg_away_score = df['away_score'].mean()
    avg_total_points = df['total'].mean()
    home_field_advantage = avg_home_score - avg_away_score
    
    # Key number frequencies (spread margin == 3, 7, 6, 10)
    abs_margin = df['result'].abs()
    pct_3 = (abs_margin == 3).mean()
    pct_7 = (abs_margin == 7).mean()
    pct_6 = (abs_margin == 6).mean()
    pct_10 = (abs_margin == 10).mean()
    
    return {
        "games_analyzed": len(df),
        "home_win_pct": round(home_win_pct * 100, 1),
        "home_field_advantage_pts": round(home_field_advantage, 2),
        "avg_total_points": round(avg_total_points, 1),
        "key_number_3_freq": round(pct_3 * 100, 2),
        "key_number_7_freq": round(pct_7 * 100, 2),
        "key_number_6_freq": round(pct_6 * 100, 2)
    }

if __name__ == "__main__":
    baselines = compute_nfl_empirical_baselines()
    print("Verified NFL Baselines:", baselines)