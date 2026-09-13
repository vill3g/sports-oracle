import os
import pandas as pd
import numpy as np

DATA_PATH = r"C:\Users\vill3\.gemini\antigravity\scratch\sports-oracle\backend\data\verified\tennis_verified.csv"

def compute_tennis_surface_baselines():
    if not os.path.exists(DATA_PATH):
        return None
    df = pd.read_csv(DATA_PATH)
    
    # Analyze by surface
    surface_stats = {}
    for s in ['Hard', 'Clay', 'Grass']:
        sub = df[df['Surface'] == s]
        surface_stats[s] = {
            "charted_matches": len(sub),
            "pct_of_tour": round((len(sub) / len(df)) * 100, 1),
            "expected_hold_rate_benchmark": 0.82 if s == 'Hard' else (0.76 if s == 'Clay' else 0.86),
            "tiebreak_freq_benchmark": 0.24 if s == 'Hard' else (0.17 if s == 'Clay' else 0.28)
        }
        
    return {
        "total_atp_matches_verified": len(df),
        "surfaces": surface_stats
    }

if __name__ == "__main__":
    stats = compute_tennis_surface_baselines()
    print("Verified Tennis Surface Baselines:", stats)