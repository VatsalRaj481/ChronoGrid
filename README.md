<div align="center">

# 🏎️ CHRONOGRID
### Next-Generation Real-Time Formula 1 Analytics & Telemetry Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/Frontend-React_19_|_TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_5.4-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![OpenF1](https://img.shields.io/badge/Data-OpenF1_API-E10600?style=for-the-badge)](https://openf1.org/)

*Engineered with design inspiration from Apple, Porsche, and Formula 1 telemetry telemetry systems.*

---

</div>

## 📌 Overview

**ChronoGrid** is a production-ready, ultra-premium Formula 1 analytics platform built to provide fans, aerodynamicists, and race strategists with real-time telemetry telemetry and comparative analytics. Powered by a hybrid data pipeline combining **OpenF1**, **FastF1**, and **Jolpica/Ergast** APIs, ChronoGrid delivers millisecond-precision speed traces, pedal actuation metrics, telemetry curves, and AI-driven pit strategy models.

---

## ✨ Key Features

### ⏱️ 1. High-Precision Telemetry Studio (`/telemetry`)
- **Synchronized Speed Traces**: Overlay telemetry traces of any two drivers turn-by-turn.
- **Pedal & Gear Actuation**: Real-time visualization of Throttle %, Brake pressure %, RPM, Gear shifts, and DRS activation.
- **Interactive Playback Controls**: Replay lap telemetry in real time with synchronized data cards.
- **2D GPS Track Position**: Interactive minimap displaying real-time coordinates mapped onto circuit layouts.

### 📊 2. Championship Command Hub (`/dashboard`)
- **Live Track Radar**: Real-time ambient weather, track temperature, and wind speed updates.
- **World Drivers' & Constructors' Standings**: Live points progression, victory counts, and team power unit metadata.
- **Speed Trap Records & Sector Leaders**: Monitor maximum velocities and purple sector achievements.

### ⚔️ 3. Driver Head-to-Head Comparison (`/comparison`)
- **5-Axis Performance Radar**: Comparative radar models analyzing Qualifying Pace, Racecraft, Tire Management, Consistency, and Wet Weather skill.
- **Career Metrics Breakdown**: Direct side-by-side comparison of WDC championships, race wins, podiums, and pole positions.

### 🤖 4. AI Pit Strategy & Undercut Simulator (`/simulator`)
- **Compound Degradation Modeling**: Estimate tire wear for Soft, Medium, and Hard compounds across race stints.
- **Undercut Delta Calculation**: Model pit stop timing windows to compute time gains and finish position probabilities.

### 🏎️ 5. Circuits & Race Deep-Dive (`/circuits`, `/race-analysis`)
- **Circuit Directory**: DRS activation zones, track lengths, turn counts, and lap records.
- **Stint Strategy Timeline**: Color-coded tire compound timelines detailing stint lengths and pit stop durations.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS (Custom OLED Dark Theme `#070709`, Glassmorphism, Carbon fiber textures)
- **Animations**: Framer Motion
- **Visualizations**: Recharts, Canvas
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **HTTP Engine**: HTTPX (Async caching client)
- **Data Schemas**: Pydantic v2
- **Data Integrations**: OpenF1 API, Ergast / Jolpica F1 API Mirror, FastF1 Python engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.10+ recommended)

---

### 1. Running the Backend Server

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server via Uvicorn
uvicorn main:app --reload --port 8000
```
*The FastAPI backend will be available at `http://localhost:8000` with interactive API docs at `http://localhost:8000/api/v1/docs`.*

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

To create an optimized production build of the frontend:
```bash
cd frontend
npm run build
```
The production bundle will be output to `frontend/dist/`.

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
    │   ├── services/       # Axios API integration client
    │   ├── types/          # TypeScript interfaces
    │   ├── App.tsx         # React Router configuration
    │   └── index.css       # Tailwind directives & glassmorphic design system
    ├── package.json
    └── vite.config.ts
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
