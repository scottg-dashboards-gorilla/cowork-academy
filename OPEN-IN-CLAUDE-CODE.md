# 💻 How to open & work on this project in Claude Code

This repo (**cowork-academy**) is the live Cowork Academy training site. The live version runs on **GitHub Pages** and its progress-tracking backend runs on **Supabase**. GitHub is the source of truth — pushing to it redeploys the live site automatically.

---

## Step 1 — Install & open Claude Code
1. Go to **https://claude.com/download** and get (or update) the **Claude Code desktop app**.
2. Open it and **sign in with the same account** you use for Cowork.

## Step 2 — Clone this repo
Start a session in Claude Code (pick or make a folder where you keep projects), and paste this as your **first message**:

> Clone https://github.com/scottg-dashboards-gorilla/cowork-academy and open it. This is my "Cowork Academy" training site — the live version runs on GitHub Pages and the progress-tracking backend is on Supabase. Read all the files and the README first, and summarize how it works before changing anything. When we make changes, commit and push to GitHub so the live site updates.

This repo is **public**, so it clones with no extra setup.

## Step 3 — Work on it (what to say)
Just talk to Claude Code in plain English, e.g.:
- *"Add a new mission to the Beginner level about [topic]."*
- *"Change the admin dashboard so it also shows [X]."*
- *"Something's broken on the live site — help me find and fix it."*

## Step 4 — Save changes back to the cloud (important)
Claude Code edits files **on your computer**. To publish and back up, finish with:

> Commit these changes and push them to GitHub.

GitHub Pages redeploys the live site automatically a minute or two after each push.

---

## Good to know
- **The live site URL** doesn't change: https://scottg-dashboards-gorilla.github.io/cowork-academy/
- **The admin dashboard** is `admin.html` (passphrase-protected). The admin passphrase is kept private — not in this repo.
- **The backend** is Supabase (project `datapath-ai-assessment`, tables prefixed `academy_`). A GitHub Action (`.github/workflows/keepalive.yml`) pings it every 3 days so the free-tier database never auto-pauses.
- **Related repos:** `henry-founder-quest` (public — Henry's game) · `cowork-academy-private` (🔒 private — facilitator guide + backups; needs GitHub sign-in to clone).
- Claude Code works inside one folder on your machine — it won't have Cowork's pinned-projects sidebar, and Cowork Projects/scheduled tasks don't carry over (only files/context do).

---

*Keep GitHub as your source of truth: clone → edit in Claude Code → commit & push.*
