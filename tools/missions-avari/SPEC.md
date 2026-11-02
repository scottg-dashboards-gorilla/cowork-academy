# Cowork Academy: guided mission rewrite spec

You are rewriting training missions for Cowork Academy, a self-paced site that teaches employees to use **Claude Cowork**. Cowork is the mode in the Claude desktop app where Claude works on the files in a folder you choose and can use connected apps.

The old missions failed real users. A technical tester couldn't follow them:
- They said "copy this into Cowork" without saying where.
- They used checkboxes for vague tasks ("write your 3 rules") with no explanation of what to do or why.
- They expected people to work things out themselves.

The new format is a **one-step-at-a-time player**. Every step must be impossible to misunderstand for a busy non-technical employee who has never used Cowork before (for example, a reservations agent at a vacation-rental company).

## What the site adds automatically (do NOT write these)
- **Step 1 of every mission:** "Start a new task in Cowork, in your Cowork Academy folder." Learners already set this folder up in a setup mission. Your first step can assume an empty Cowork task is open and ready.
- **Final step of every mission:** a reflection that shows the mission's `think` scene and question, and saves the learner's answer to their idea notebook.

## Output
Write a JSON file (an array of mission objects, **in the same order as the source missions**) to the path you're given. Each mission:

```json
{
  "t": "Mission title (keep the source title unless it's unclear; plain sentence case)",
  "blk": "Short area label, e.g. Documents, Data, Skills, Connectors",
  "mins": 20,
  "lead": "1–2 sentences: what you'll make in this mission, concretely.",
  "why": "1 sentence: why this matters at work.",
  "result": "What the learner has at the end, as a noun phrase. e.g. 'A Word document resume, downloaded and opened.'",
  "think": {"scene": "...", "ask": "..."},
  "steps": [
    {"type": "do", "title": "Short step name (2–5 words)", "do": "...", "prompt": "...", "see": "...", "stuck": "...", "files": ["bookings.csv"]},
    {"type": "check", "q": "...", "options": ["...", "...", "..."], "answer": 1, "why": "..."}
  ]
}
```

## Rules for `do` steps (2–4 per mission)
- **One action per step.** If you'd write "and then", split it into two steps.
- **`do`** says exactly what to do, in 1–2 short imperative sentences. If there's a prompt, `do` says where it goes, for example: "Paste this into your Cowork task and press Enter." or "Paste this into the same task and press Enter."
- **`prompt`** (optional) is the complete text to paste. Fill everything in so it works as-is. Where the learner must personalize something, use square brackets with an example inside, like `[your business, e.g. a beach rental company]`. Never use `____`. Keep prompts under about 70 words.
- **`see`** describes concretely what appears in Cowork when it worked, such as "A table with one row per channel, and a bar chart below it." Never write "Cowork responds."
- **`stuck`** (optional but usually present) names the most likely problem and the exact fix.
- **`files`** (optional) lists practice files the step needs. Only these exist: `bookings.csv`, `guest-reviews.csv`, `maintenance-tickets.csv`. When used, `do` says: "Download [file] below and save it in your Cowork Academy folder." The next step's prompt refers to the file by name. Cowork reads files in its folder; learners don't need to upload them.
- **Downloads:** when Cowork makes a file (docx, xlsx, pptx, pdf), it saves it in the Cowork Academy folder. `see` says the file appears there, and a step can say "Open [file] from your Cowork Academy folder."
- **Optional steps:** if the source mission is optional (browser control, computer use, publishing), say so in `why` and keep it.
- **Safety habits:** keep them. Cowork drafts and the learner sends. Read-only access first. Nothing spends money or sends messages by itself.
- **Don't invent specific menu paths or button names** in Claude or Cowork that you aren't sure exist. Describe outcomes instead, or have the learner ask Cowork, for example: "Ask Cowork: 'How do I connect my calendar?'" Connecting an app means the learner signs in themselves in a pop-up.
- **Don't promise exact output.** Claude varies, so describe the kind of result.

## Rules for the `check` step (exactly 1 per mission, last in `steps`)
- One multiple-choice question with 3 options that tests **understanding** (when or why to use something, or what to check), not trivia or wording recall.
- `answer` is the 0-based index of the correct option. Vary which position is correct across missions.
- `why` is 1–2 sentences explaining the right answer.

## Voice
- Plain, warm, direct. Sentence case. Active voice. Short sentences. US English.
- No hype, no exclamation marks, no emoji, no em dashes (use commas, periods or colons), no "→" arrows, no "simply" or "just".
- Talk to the learner as "you".
- `mins`: realistic time for a beginner, including Cowork's working time, usually 15–25. It must be a multiple of 5.

## `think`
Copy the source mission's `think` exactly unless it's clearly wrong for the rewritten mission. If so, adjust it in the same style: `scene` begins "At work: ...", and `ask` is one question about the learner's own job.

## Example (Intermediate: "Analyze real data and chart it")
```json
{
  "t": "Analyze real data and chart it",
  "blk": "Data",
  "mins": 20,
  "lead": "You'll give Cowork a spreadsheet of bookings and get back the three most useful findings, with charts.",
  "why": "Most teams have exports nobody has time to analyze. Cowork can turn one into answers in minutes.",
  "result": "Three findings and two charts from a real data file.",
  "think": {"scene": "At work: operations uploads a bookings or sales export and finds which weeks and channels actually make money.", "ask": "Which export or report do you have but never find time to analyze?"},
  "steps": [
    {"type": "do", "title": "Get the data", "do": "Download bookings.csv below and save it in your Cowork Academy folder. Using your own export instead is fine, as long as it has no customer personal details.", "see": "bookings.csv is in your Cowork Academy folder.", "stuck": "If the file opened in your browser instead of downloading, right-click the button and choose to save the link.", "files": ["bookings.csv"]},
    {"type": "do", "title": "Ask for the findings", "do": "Paste this into your Cowork task and press Enter.", "prompt": "Open bookings.csv in this folder. Tell me the 3 most important findings about revenue, channels and cancellations, with the numbers behind each one.", "see": "Three numbered findings in plain English, each with figures such as revenue per channel or cancellation rates.", "stuck": "If Cowork says it can't find the file, check that bookings.csv is in the folder this task is using."},
    {"type": "do", "title": "Make the charts", "do": "Paste this into the same task and press Enter.", "prompt": "Make 2 charts that show these findings, and save them in this folder as images.", "see": "Two chart images in your Cowork Academy folder, for example revenue by channel and bookings by month.", "stuck": "If the charts appear only in the chat, ask: \"Save those charts as PNG files in this folder.\""},
    {"type": "do", "title": "Check one number", "do": "Paste this into the same task and press Enter. Checking is a habit, not a sign of distrust.", "prompt": "Show me how you calculated the first finding, step by step, so I can check it.", "see": "The calculation broken down so you can follow it, with totals you could check in the spreadsheet yourself."},
    {"type": "check", "q": "Cowork gives you a finding with a surprising number. What should you do before sharing it?", "options": ["Share it, because Cowork read the file directly", "Ask Cowork to show how it calculated it, and check it", "Delete the finding and start over"], "answer": 1, "why": "Claude can make mistakes. Asking it to show its working and checking a key number takes a minute and protects your credibility."}
  ]
}
```

When you're done, run `node /private/tmp/claude-504/-Users-scott/059353ab-7f05-4671-81a0-c7596c40e462/scratchpad/missions/validate.js <your-file> <expected-count>` and fix anything it reports.
