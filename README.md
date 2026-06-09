---

# AnimeMash 🎌

A web app where you vote on anime characters head-to-head until one rises to the top. Think hot-or-not but for your favorite characters.

**Live:** [animemash.vercel.app](https://animemash.vercel.app)

---

## What it does

- Pulls anime characters from the Jikan API (MyAnimeList data)
- Shows you random matchups to vote on
- Tracks wins and builds a live leaderboard
- Has accounts so your votes are yours

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML/CSS/JS — Vercel |
| Backend | FastAPI (Python) — Railway |
| Database | PostgreSQL via Supabase |
| Auth | JWT |
| Anime data | Jikan API |

---

## Running locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Set these in a `.env`:
```
DATABASE_URL=your_supabase_url
SECRET_KEY=your_secret_key
```

**Frontend**

Just open `index.html` in a browser, or use Live Server. Make sure the API URL in your JS points to `localhost:8000`.

---

## Features

- JWT auth with login/register
- Head-to-head voting with duplicate pair protection
- Global leaderboard
- Profile page with logout
- Zenitsu-themed loading animation
- Dramatic login sequence (you'll see)

---

## Known issues

- Login animation blue ball position is hardcoded for 1080p — may look slightly off on other resolutions

---

Built as a personal project to learn full-stack deployment.
