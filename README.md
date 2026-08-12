<div align="center">

# 🏎️ CHRONOGRID
### Next-Generation Real-Time Formula 1 Analytics & Telemetry Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_|_TypeScript_5.4-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![OpenF1](https://img.shields.io/badge/Data-OpenF1_API-E10600?style=for-the-badge)](https://openf1.org/)

*Engineered with design inspiration from Apple Design Guidelines, Porsche paddock interfaces, and official Formula 1 telemetry telemetry systems.*

---

</div>

## 📌 Overview

**ChronoGrid** is a production-ready, ultra-premium Formula 1 analytics platform built to provide fans, aerodynamicists, and race strategists with real-time telemetry and comparative analytics. Powered by a hybrid data pipeline combining **OpenF1**, **FastF1**, and **Jolpica/Ergast** APIs, ChronoGrid delivers millisecond-precision speed traces, pedal actuation metrics, telemetry curves, and AI-driven pit strategy models.

---

## 🎨 Design Language: Apple x Formula 1

ChronoGrid is built around a bespoke **Dark Motorsport Paddock** aesthetic:
- **Carbon Grid Motif**: Custom-styled checkered grids, asphalt texture layers (`carbon-pattern`), and high-contrast typography (using Google Fonts like `F1 Bold` / `Outfit` and `JetBrains Mono` for data parameters).
- **Apple Fluid Motion**: Smooth UI interactions using Framer Motion springs with F1-inspired physics properties:
  - High response rate with critical damping parameters (`stiffness: 250`, `damping: 25` to prevent overshoot).
  - Tactile micro-animations on interactive sliders, dropdowns, and button clicks (`active-press`).
  - Native support for `prefers-reduced-motion` to keep layouts accessible.

---

## ✨ Key Features & Functionality

### ⏱️ 1. High-Precision Telemetry Studio (`/telemetry`)
- **Synchronized Speed Traces**: Overlay telemetry traces of any two drivers turn-by-turn.
- **Pedal & Gear Actuation**: Real-time visualization of Throttle %, Brake pressure %, RPM, Gear shifts, and DRS activation.
- **Interactive Playback Controls**: Replay lap telemetry in real time with synchronized data cards.
- **2D GPS Track Position**: Interactive minimap displaying real-time coordinates mapped onto circuit layouts.

### 📊 2. Championship Command Hub (`/dashboard`)
- **Live Track Radar**: Real-time ambient weather, track temperature, and wind speed updates.
- **World Drivers' & Constructors' Standings**: Live points progression, victory counts, and team power unit metadata.
- **Speed Trap Records & Sector Leaders**: Monitor maximum velocities and purple sector achievements.
- **Dynamic Fastest Lap Resolution**: Automatically resolves and updates latest completed race results to show actual completed fastest laps.

### ⚔️ 3. Driver Head-to-Head Comparison (`/comparison`)
- **5-Axis Performance Radar**: Comparative radar models analyzing Qualifying Pace, Racecraft, Tire Management, Consistency, and Wet Weather skill.
- **Career Metrics Breakdown**: Direct side-by-side comparison of WDC championships, race wins, podiums, and pole positions.
- **Jolpica Historical Career Stats**: Fetches live F1 career statistics dynamically from Jolpica API mirrors to keep profiles fully accurate.

### 🤖 4. AI Pit Strategy & Undercut Simulator (`/simulator`)
- **Compound Degradation Modeling**: Estimate tire wear for Soft, Medium, and Hard compounds across race stints.
- **Undercut Delta Calculation**: Model pit stop timing windows to compute time gains and finish position probabilities.

### 🏎️ 5. Circuits & Race Deep-Dive (`/circuits`, `/race-analysis`)
- **Circuit Directory**: DRS activation zones, track lengths, turn counts, and lap records. Includes correct case-sensitive official F1 CDN track mapping layouts.
- **Stint Strategy Timeline**: Color-coded tire compound timelines detailing stint lengths and pit stop durations.

---

## ⚙️ Global State & Hydration System

- **Zustand Global Loader** (`src/store/useLoaderStore.ts`): Manages the loading state centrally.
- **App-Level Overlay** (`App.tsx`): The `<LoadingScreen>` renders globally at the root layout level (`z-[100]`), covering the entire viewport, including the `Navbar` and `Footer` to eliminate layout snapping.
- **Instant Route Transition**: Listens to pathname changes and triggers the loading overlay instantly, covering the screen *before* the new page mounts to prevent flashes of background code/scaffolding.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.12+ recommended)

---

### 1. Running the Backend Server

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server via Uvicorn
uvicorn main:app --reload --port 8000
```
*The FastAPI backend will be available at `http://localhost:8000` with interactive API docs at `http://localhost:8000/docs`.*

---

### 2. Running the Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
*Open your browser at `http://localhost:3000` to access the ChronoGrid dashboard.*

---

### 3. Building for Production

To compile and verify the build:
```bash
cd frontend
npm run build
```

---

## 💡 Important Stuff to Know

1.  **Offline Mock Fallbacks**: `frontend/src/services/api.ts` implements robust catch-block fallback models. If the backend FastAPI server goes offline, the frontend will automatically serve high-quality F1 mock data to ensure the UI remains fully functional and testable.
2.  **TypeScript 5.4 Upgrade**: The TypeScript version has been updated to `v5.4.5` to support modern Vite `moduleResolution: bundler` configurations and suppress build compilation conflicts. Always build using `npm run build` so that the local node compiler resolves correctly.
3.  **Vite Dev Server Proxy**: The frontend proxies `/api` calls directly to `http://localhost:8000` via the proxy rule defined in `vite.config.ts`.
4.  **CORS Configuration**: FastAPI includes full CORS middleware allowing requests from `http://localhost:3000`.

---

## 📁 Project Structure

```text
ChronoGrid/
├── backend/
│   ├── app/
│   │   ├── routers/        # API endpoints (drivers, races, telemetry, standings)
│   │   ├── services/       # Async F1 data engine & caching layer
│   │   └── config.py       # App configuration
│   ├── main.py             # FastAPI entry point & CORS configuration
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/     # Reusable layout components (Navbar, Footer)
    │   ├── pages/          # Application pages (Telemetry, Dashboard, Comparison, Simulator)
    │   ├── store/          # Zustand global stores (loader, etc.)
    │   ├── services/       # Axios API integration client with offline mock fallbacks
    │   ├── types/          # TypeScript interfaces
    │   ├── App.tsx         # React Router & Global Loading Configuration
    │   └── index.css       # Tailwind directives & motorsport design tokens
    ├── package.json
    └── vite.config.ts
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
