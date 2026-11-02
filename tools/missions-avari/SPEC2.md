# Cowork Academy: revision 2 of the guided missions

You're revising missions that already follow SPEC.md (same folder). **Read SPEC.md first.** Every rule there still applies unless this file overrides it. Professional reviewers took the course as learners and found real problems; your job is to fix them.

## What changed for the whole course
1. **The starter folder.** In the setup mission, every learner downloads one zip and unzips it as their **Cowork Academy** folder (in Documents). It already contains these files:
   - bookings.csv
   - guest-reviews.csv
   - maintenance-tickets.csv
   - owner-statement-driftwood-july-2026.csv: has 3 planted mistakes
   - guest-messages.txt: a practice guest inbox, 8 messages
   - team-notes.txt: a messy email thread about the Pine Ridge hot tub
   - sample-business-brief.md: a fictional company, "Saltwater Stays"
   - README.txt

   So **don't write "download X" steps.** Write "bookings.csv is already in your Cowork Academy folder." You may still set `"files": ["bookings.csv"]` on a step that needs one of the three CSVs. The site shows it as a small "Missing the file? Download it" fallback link. Only those three CSVs can be listed in `files`.
2. **Every mission must work on its own.** Sessions mix missions from different levels. If a step uses a file made in an earlier mission (business-brief.md, project-notes.md, index.html, site.html, product-plan.md, charts and so on), the step's `stuck` must give a fallback. For example: "Don't have business-brief.md? Use sample-business-brief.md instead." Or "...ask Cowork to create a quick one first." Where it's easy, make prompts say "business-brief.md (or sample-business-brief.md if you don't have one)".
3. **Workplace projects only.** The learners are employees at a vacation rental management company, and their employer pays for the training. Replace anything personal:
   - a résumé becomes an owner update letter from team-notes.txt
   - a personal budget becomes a team tracker
   - a hobby site becomes a one-page internal team page

   Keep each mission's skill (Word document, spreadsheet with formulas, and so on), and its position.
4. **Don't promise features we haven't confirmed.** Use this wording:
   - **Dashboards** are "dashboards" or "refreshable dashboards", never "live". An HTML file opened from the folder doesn't update by itself; you refresh it by asking Cowork to rebuild it from the newest data.
   - **Logos and images:** Cowork designs simple logos as SVG files (logo-1.svg). Don't call it an image generator.
   - **Connecting apps:** don't promise a read-only choice. Say: "Only connect apps your company has approved." and "Tell Cowork not to send, change or delete anything." Never suggest a personal account.
   - **Scheduled tasks:** say they may only run while your computer is on and the Claude app is open.
   - **Saving skills:** say Cowork will create the skill and may ask you to approve or turn it on. Don't describe menus.
   - **Agents:** don't promise a separate agent will run. Teach writing a clear brief (goal, scope, sources, output format) and judge the output.
   - **Plugins, Chrome, computer use:** these may not be available. The step's `stuck` says how to skip.
5. **Never write "ask Cowork how to do X in Cowork" as a fix.** Claude can describe buttons that don't exist. Instead write: "Check Claude's help center at support.claude.com, or ask your Academy program contact." You can still ask Cowork about its work ("Show me the formula you used").
6. **Don't use real customer data.** Use the practice files. If a mission connects a real inbox or calendar, it must say: "Only if your company has approved this connector. Otherwise, use guest-messages.txt."
7. **Mission titles** are sentence case, with no "&" and no "Bonus:" prefix. For optional missions, put "Optional:" at the start of `why`.

## Quiz questions: rewrite every `check`
Reviewers could guess the right answer just by picking the longest option, and the wrong answers were jokes. New rules:
- Each check is a short **workplace scenario** of 1–2 sentences, followed by a question.
- All three options are **believable**, about the same length, and in the same voice. Wrong options are real mistakes a busy employee might make: "Trust it, since Cowork read every row", "Fix the layout first, then check the figures", "Send it to the owner, who can flag anything wrong".
- **The right answer must not be the longest option.** Make it shorter or the same length.
- **Answer positions:** spread `answer` evenly over 0, 1 and 2 within your file, roughly a third each, in no pattern.
- **Data missions:** when a mission analyzes a practice file, the check is a **proof-of-work question** that can only be answered by doing the mission. Use the real values in FACTS.md (same folder). For example: "Which channel had the highest cancellation rate?" with the options Booking.com, Vrbo and Airbnb. Wrong options must be other real values from the data.
- `why` explains the right answer in 1–2 sentences, and briefly says why the tempting wrong answer is wrong.

## Steps
- Keep 2–4 `do` steps. **Fold small ones together** so the whole path fits its time.
- `mins` must be realistic for a beginner, including Cowork's working time. Total time matters.
- Dates in prompts must fall within the data range in FACTS.md. If a prompt asks for "open tickets", remember that tickets show status Open only if they were still open on 2026-09-30. For a weekly brief, use the week of 21–27 September 2026, or "the most recent week in the data".
- Use [square brackets] for every placeholder, never `____`. Say "task", never "conversation" or "chat".

## Output
Write JSON in the same shape and order as before. Then run:

`node validate2.js <file> <count>`

and fix everything it reports until it prints OK.
