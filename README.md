# ORACLE SPORTS — AI Sports Prediction Platform (Web & Mobile)

A high-performance sports analytics platform featuring the signature **DraftKings Sportsbook layout and UX**, where traditional betting odds are replaced with **Machine Learning match predictions, win probabilities, and cover edges**.

---

## 🌟 Key Features

1. **DraftKings-Style Multi-League UI**:
   - Signature dark sportsbook design system (`#0a0d14` background, neon `#00e700` green accents, gold edge badges).
   - **Horizontal League Selector**: Filter between `All`, `⚡ Top Edges`, `🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League`, `🏈 NFL`, `🏀 NBA`, `⚾ MLB`, and `🇪🇸 La Liga`.
   - **Live In-Game Tracker**: Filter by live games with dynamic in-game momentum and updated win probabilities.

2. **Odds Matrix Reimagined as ML Predictions**:
   - **Win Probability Column**: Replaces Moneyline odds with exact model win percentages (e.g. `Arsenal 64.2%`) and projected scores.
   - **Spread / Margin Column**: Displays algorithmic cover probability and edge delta compared to market lines (e.g. `Chiefs -2.5 Cover (59%) • +1.9 pts edge`).
   - **Projected Total Column**: Highlights over/under recommendation with expected points differential.

3. **Smart Prediction Slip (Replacing the Betslip)**:
   - **Mobile**: Docked floating bottom bar with smooth slide-up bottom sheet drawer.
   - **Desktop**: Persistent sticky right-hand rail.
   - **Compound Probability Calculator**: Selecting multiple picks calculates real-time joint win probability (`P_joint = P1 × P2 × ... × Pn`) and average model edge.
   - **Paper Portfolio Tracker**: Save prediction combinations directly into persistent local storage.

4. **Explainable AI (XAI) Modals**:
   - Click "Model Factor Breakdown" on any match card to see why the engine made the pick:
     - Expected Goals (xG) / EPA per dropback
     - Rest and fatigue disparities
     - Tactical matchups and injury impacts
     - Monte Carlo outcome distributions

5. **Multi-League ML Engines**:
   - Modular Python backend with specialized models for each sport:
     - **Premier League & La Liga**: XGBoost Poisson Goal-Expectancy Engine.
     - **NFL**: EPA/Play and Pass/Rush DVOA Monte Carlo Ensemble.
     - **NBA**: Four-Factors (eFG%, TOV%, ORB%, FTR) & Pace Simulator.
     - **MLB**: Sabermetric Starting Pitcher FIP & Run Expectancy Model.

---

## 🚀 Quick Start

### 1-Click Launch (Windows)
Double-click `run_app.bat` to launch both the backend API and the frontend dev server in separate console windows.

### Manual Launch

#### Start the Python ML Backend:
```bash
cd backend
python main.py
```
*API docs available at: http://127.0.0.1:8000/docs*

#### Start the Web/Mobile Frontend:
```bash
cd frontend
npm.cmd run dev
```
*Frontend running at: http://localhost:3000*

---

## 📱 Mobile App Testing & Packaging

### Testing on Mobile Devices
1. Ensure your phone and computer are on the same Wi-Fi network.
2. In `frontend/vite.config.ts`, `server.host: true` is enabled.
3. Run `npm.cmd run dev` and open the printed Network IP address on your phone's browser (e.g., `http://192.168.1.X:3000`).
4. On iOS (Safari) or Android (Chrome), tap **"Add to Home Screen"** to run it as a full-screen standalone PWA app.

### Packaging into Native iOS & Android Apps (Capacitor)
To package into native Xcode (.ipa) and Android Studio (.apk) projects:
```bash
cd frontend
npm.cmd install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx.cmd cap init "Oracle Sports" "com.oraclesports.app" --web-dir dist
npm.cmd run build
npx.cmd cap add android
npx.cmd cap add ios
npx.cmd cap sync
```

---

## 🧠 Connecting Your Own ML Models
Each league has its own engine file under `backend/engines/`. To plug in a new trained model (e.g. from `scratch/soccer_ml`):
1. Place your `.pkl` or `.onnx` model inside `backend/models/`.
2. Implement the `BaseLeagueEngine` interface in `backend/engines/<league>.py`.
3. Register the engine in `backend/main.py` under the `ENGINES` dictionary.