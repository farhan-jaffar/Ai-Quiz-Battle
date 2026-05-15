<div align="center">

# 🧠 AI Quiz Battle

### *Challenge an adaptive AI opponent — powered by Google Gemini*

<br/>

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

[![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

<br/>

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=flat-square)

<br/>

**AI Quiz Battle** is a full-stack MERN web app where you go head-to-head against a simulated AI opponent in a 5-round quiz match. Pick any topic, choose your difficulty, and the **Gemini 2.5 Flash** model generates a fresh set of questions on the fly — no static question banks, every game is unique.

[Getting Started](#-getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Generated Questions** | Gemini 2.5 Flash creates 9 stratified questions (Easy/Medium/Hard) per game in real-time — every session is unique |
| ⚔️ **AI Opponent** | Compete against a simulated neural-net opponent whose accuracy scales with difficulty |
| 📈 **Adaptive Difficulty** | The game adjusts difficulty between rounds based on your speed and accuracy |
| ⚡ **Power-Ups** | 50/50 elimination, +10s extra time, and hint reveal — one use each per game |
| 🏆 **Leaderboard** | Scores persist in MongoDB with a global Hall of Fame and podium for the top 3 |
| 📜 **Game History** | Full local history of every match with topic, difficulty, scores, and outcome |
| ⚙️ **Settings** | Configurable timer duration (10s–30s), sound toggle, animation toggle, and data management |
| 🔊 **Sound Effects** | Immersive audio — ticking timers, correct/wrong buzzes, power-up activation, victory/defeat fanfares |
| 🎨 **Premium UI** | Dark glassmorphism design with smooth Framer Motion animations and responsive layout |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI |
| **Vite 5** | Dev server & bundler |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Page transitions & micro-animations |
| **React Router v6** | Client-side routing |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Persistent score & leaderboard storage |
| **Google Generative AI SDK** | Gemini 2.5 Flash integration for question generation |
| **Zod** | Runtime schema validation of AI responses |
| **mongodb-memory-server** | Zero-config fallback DB for development |

---

## 📁 Project Structure

```
ai-quiz-battle/
├── backend/
│   ├── models/
│   │   └── Score.js            # Mongoose schema for leaderboard entries
│   ├── db.js                   # MongoDB connection logic
│   ├── dbMock.js               # In-memory DB fallback
│   ├── server.js               # Express API (generate, submit, leaderboard)
│   └── .env                    # API keys & DB URI (not committed)
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Home.jsx        # Topic & difficulty selection
│       │   ├── Quiz.jsx        # Core gameplay with timer & power-ups
│       │   ├── Result.jsx      # Score comparison & leaderboard submission
│       │   ├── Leaderboard.jsx # Global rankings with podium
│       │   ├── History.jsx     # Local match history
│       │   ├── Settings.jsx    # User preferences
│       │   ├── Header.jsx      # Navigation bar
│       │   ├── Sidebar.jsx     # Side navigation
│       │   └── Layout.jsx      # Page wrapper
│       ├── context/
│       │   └── GameContext.jsx  # Global state management
│       ├── hooks/
│       │   └── useSounds.js    # Sound effect hooks
│       └── utils/
│           └── sounds.js       # Audio file management
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local install or [Atlas](https://www.mongodb.com/atlas) free tier)
- [Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### 1 · Clone & Install

```bash
git clone https://github.com/farhan-jaffar/Ai-Quiz-Battle.git
cd Ai-Quiz-Battle
```

```bash
# Backend
cd backend && npm install

# Frontend (new terminal)
cd frontend && npm install
```

### 2 · Configure Environment

Create `backend/.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
```

> **Note:** If `MONGODB_URI` is not provided, the app automatically uses `mongodb-memory-server` as an in-memory database — no setup needed for quick testing.

### 3 · Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** and start battling! ⚔️

---

## 🏷️ GitHub Topics

Add these in your repository **Settings → Topics** for discoverability:

```
ai  quiz  gemini-api  react  nodejs  mongodb  mern-stack  tailwindcss  framer-motion  fullstack
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
