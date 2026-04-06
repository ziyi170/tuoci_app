# 拓词 (TuCi) — IELTS Smart Vocabulary App

> An adaptive vocabulary learning system built for IELTS candidates, powered by spaced repetition (SRS), synonym networks, and AI-generated example sentences.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
![Tech: React](https://img.shields.io/badge/React-18-blue)
![Tech: Node.js](https://img.shields.io/badge/Node.js-20-green)
![Tech: MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 Adaptive Learning | SRS algorithm schedules each word based on your personal performance |
| 📊 Frequency-Driven | IELTS high-frequency words prioritised by exam relevance |
| 🔁 Synonym Networks | Practise paraphrasing with curated synonym clusters |
| 🤖 AI Example Sentences | OpenAI generates IELTS-band-appropriate example sentences on demand |
| 📱 PWA | Installable on iOS & Android — works offline |
| 👤 User Accounts | Progress synced to the cloud via JWT-authenticated API |

---

## 🏗 Architecture

```
Frontend (React + Vite + PWA)
        ↓  REST API
Backend (Node.js + Express)
        ↓
Database (MongoDB Atlas)
        ↓  on-demand
AI Service (OpenAI API)
```

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios
- Recharts (statistics charts)
- PWA (Workbox)

**Backend**
- Node.js 20 + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- OpenAI API integration

**DevOps**
- GitHub (version control)
- Vercel (frontend deployment)
- Railway (backend deployment)
- MongoDB Atlas (cloud database)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/tunci.git
cd tunci
```

### 2. Set up the backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT secret, OpenAI key)
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 📁 Project Structure

```
tunci/
├── frontend/                  # React app
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── data/              # Static word data (IELTS vocabulary)
│   │   └── utils/             # SRS algorithm, helpers
│   └── public/                # PWA manifest, icons
│
├── backend/                   # Node.js API
│   ├── routes/                # auth, books, words, progress
│   ├── models/                # Mongoose schemas
│   └── middleware/            # JWT auth guard
│
└── README.md
```

---

## 🧠 Core Algorithm — SRS (Spaced Repetition System)

The scheduling is based on a simplified SM-2 algorithm:

```
Correct answer → next_review = today + 2^(correct_count) days
Wrong answer   → next_review = today + 0.5 days (12 hours)
Mastered       → correct_count >= 5
```

Words are scored and ranked for each session:

```
score = (wrong × 2) - correct + due_bonus + status_bonus
```

Today's session always surfaces the highest-priority words first.

---

## 🤖 AI Module

On demand, the backend calls OpenAI to generate:
- 2 IELTS-band-appropriate example sentences
- 3 synonyms with usage differences
- 1 paraphrase exercise

Generated content is **cached in MongoDB** — each word is only generated once, keeping API costs near zero.

---

## 🌐 Deployment

| Service | URL |
|---|---|
| Frontend | https://tunci.vercel.app |
| Backend API | https://tunci-api.railway.app |

---

## 📄 License

MIT © 2025
