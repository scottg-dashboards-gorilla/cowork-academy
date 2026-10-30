# 🎓 Cowork Academy

> **Which repo is this?** The **PUBLIC live course for anyone** — the general, pick-your-level training.
> Related: `henry-founder-quest` (Henry's game) · `cowork-academy-private` (internal facilitator guide + backups).

A self-paced, leveled course for learning **Claude Cowork** hands-on — building real websites, documents, data, decks and more, and connecting Cowork to real tools.

**▶️ Live site: https://scottg-dashboards-gorilla.github.io/cowork-academy/**

## Pick your level (or a 4 / 8 / 12-hour track)
- 🌱 **Beginner — Your First Wins:** a one-page site, Word doc, spreadsheet, image, research, your first skill and one connector. Step-by-step.
- ⚡ **Intermediate — The Smart Business:** a multi-section site, your own saved skill, agents, live connector data, charts, a deck, a PDF, automation and a dashboard.
- 🔥 **Higher Intermediate — The Connected Product:** a multi-page site, agents + skills, two connectors together, a live dashboard, browser and desktop control, plugins and orchestration.

## How it works
Each mission gives you a task to do in **Claude Cowork** (open in another window). You check off steps and jot notes in the app as you go.

Learners enter their name and email once. Checked steps, chosen track, team, capstone links and mission feedback are recorded so a program administrator can track progress; they're also cached in the browser so the page loads instantly and works offline. **Personal notes stay on-device only.** Use **Backup** / **Restore** to move a full on-device record (including notes) between machines. **Reset** clears both the on-device record and the administrator's copy.

## Files
| File | What it is |
|------|-----------|
| `index.html` | The course app (UI, progress, sync) |
| `course-data.js` | All course content (`LEVELS`) — shared by the course and the admin report |
| `admin.html` | Passphrase-protected progress report (cohort filter, stalled learners, capstones, CSV export) |
| `certificate.html` | Certificate of completion, unlocked per level, per track and for full mastery |
| `OPEN-IN-CLAUDE-CODE.md` | How to open and work on this repo in Claude Code |
| `.github/workflows/keepalive.yml` | Pings Supabase every few days so the free-tier database doesn't pause |

## Editing the course
Edit missions in `course-data.js` — the admin report picks up changes automatically. Progress is stored by position (`missionIndex.stepIndex`), so **add new missions or steps at the end of a level**; reordering or deleting existing ones shifts learners' saved ticks.

## Backend
Supabase project `datapath-ai-assessment` (ref `zyavgqznjznjsddldyxg`, tables prefixed `academy_`). Learners write only via the `academy_upsert` RPC (publishable key); the admin page reads via the `academy-report` edge function using the passphrase. The SQL and edge-function source are not in this repo.
