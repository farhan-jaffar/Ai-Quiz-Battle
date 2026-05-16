<div align="center">

# 🧠 AI Quiz Battle

### *Challenge an adaptive AI opponent — powered by Google Gemini*

<br/>

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

[![PHP](https://img.shields.io/badge/PHP_8-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)

<br/>

![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-2.0.0-brightgreen?style=flat-square)

<br/>

**AI Quiz Battle** is a full-stack web app where you go head-to-head against a simulated AI opponent in a 5-round quiz match. Pick any topic, choose your difficulty, and the **Gemini 2.5 Flash** model generates a fresh set of questions on the fly — no static question banks, every game is unique. Built with a **React** frontend and a **PHP + MySQL** backend.

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
| 🏆 **Leaderboard** | Scores persist in MySQL with a global Hall of Fame and podium for the top 3 |
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
| **PHP 8** | Server-side API with built-in router |
| **MySQL** | Persistent score & leaderboard storage via PDO |
| **Google Gemini REST API** | Gemini 2.5 Flash integration for question generation (via cURL) |
| **XAMPP** | Local development environment (Apache + MySQL + PHP) |

---

## 📁 Project Structure

```
ai-quiz-battle/
├── backend/
│   ├── index.php               # PHP API router (generate, submit, leaderboard)
│   ├── database.php            # MySQL PDO connection & auto-setup
│   ├── .htaccess               # Apache URL rewriting
│   └── .env                    # API keys & DB config (not committed)
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

- [XAMPP](https://www.apachefriends.org/) (includes PHP 8 + MySQL)
- [Node.js](https://nodejs.org/) v16+ (for the React frontend)
- [Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### 1 · Clone & Install

```bash
git clone https://github.com/farhan-jaffar/Ai-Quiz-Battle.git
cd Ai-Quiz-Battle
```

```bash
# Frontend dependencies
cd frontend && npm install
```

> **Note:** The PHP backend has **zero npm dependencies** — PHP and MySQL handle everything natively.

### 2 · Configure Environment

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key

# MySQL (XAMPP defaults)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=ai_quiz_battle
```

### 3 · Start MySQL

Open **XAMPP Control Panel** and start the **MySQL** service.

### 4 · Run

```bash
# Terminal 1 — PHP Backend
cd backend && php -S localhost:5000 index.php

# Terminal 2 — React Frontend
cd frontend && npm run dev
```

Open **http://localhost:3000** and start battling! ⚔️

> **Tip:** You can view your database at any time via phpMyAdmin: http://localhost/phpmyadmin

---

## 🏷️ GitHub Topics

Add these in your repository **Settings → Topics** for discoverability:

```
ai  quiz  gemini-api  react  php  mysql  tailwindcss  framer-motion  fullstack  xampp
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
