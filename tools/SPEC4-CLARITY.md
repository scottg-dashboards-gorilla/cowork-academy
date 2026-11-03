# Cowork Academy: clarity pass (applies to both editions)

A learner who is technical told us the missions are hard to follow. Each step says *what to paste*, but not **what the step is trying to accomplish**, or **what the learner is looking at** when the result appears. Here's an example from the Avari edition: the step "Find the themes" only says "guest-reviews.csv is already in your folder. Paste this into your Cowork task and press Enter." The learner can't tell that the point is to find out what guests are really saying about the stays.

Your job is to edit the steps so that every one is self-explanatory, professional and flows from the step before. **This is an editing pass, not a rewrite.**

## For every `do` step (in missions, the setup/safety/ideas missions, and how-to guides)
1. **Add `goal`.** It goes as the first key of the step. It's one or two plain sentences, 40–260 characters, saying what this step accomplishes and why it matters to the learner. Write it from the learner's point of view, as "You'll…" or an imperative.
   - Good: "Have Cowork read every guest review and group the comments into themes, so you see what guests complain about most, not just the loudest one-off remarks."
   - Bad: "Run the prompt." Bad: anything that repeats the title.
2. **Make `title` descriptive.** Use 3–7 words, at most 48 characters, sentence case, and name the object. "Find the themes" becomes "Find what guests talk about most". "Make the charts" becomes "Turn the findings into two charts". In how-to guides, steps have no `title`; add one.
3. **Tighten `do`.** It is the *how*, and must be one or two short sentences: where to do it (which task, which folder), what to paste, and what to change in brackets. Remove anything already said in `goal`. Keep any sentence telling the learner that a file is already in their folder.
4. **Make `see` explanatory.** Describe what will appear **and what to notice in it**. For example: "A list of five themes with a count for each, such as AC problems or door codes, then a table of all 12 properties, worst first. Notice which properties show up in both." Keep it concrete and checkable, in 1–2 sentences.
5. **`stuck`:** keep it, and improve it only if it's unclear.

## Flow across the mission
Read each mission as a whole. Each step's `goal` should make the sequence obvious: step 2 builds on step 1, and the last `do` step clearly produces the mission's `result`. If a mission's `lead` is vague about the end product, make it concrete: one or two sentences naming exactly what the learner will have at the end.

## Don't change
- `prompt` text. Fix it only if it's genuinely confusing, and never change the numbers, file names or what it asks for.
- Any `check` step (q, options, answer, why): the answers are verified against the data.
- `quiz` items, `think`, `mins`, `files`, `link`, `blk`, mission titles `t`, the order of missions, or the number and order of steps.
- Placeholders like {{ROLE}} and {{NOTES}}.

## House style
Plain words, sentence case, no em dashes, no exclamation marks, no "→". Say "task", never "conversation" or "chat". Use [square brackets] for placeholders. In the **general edition** (`tools/missions-core/`), never use these words: guest, booking, property, owner, vacation, rental, Airbnb, Vrbo, housekeeping, listing, check-in, hot tub, Driftwood, Pine Ridge, Saltwater, maintenance ticket.

## Validate
- **Mission files** (out2-beginner, out2-intermediate, out2-higher, out2-roles): run `node tools/validate2.js <file> <count>` from /Users/scott/cowork-academy-hub until it prints OK. It now requires `goal` and checks title length.
- **special.json and out2-howtos.json:** run this, and it must print OK:
  `node -e "const f=process.argv[1];const d=require('./'+f);const all=Array.isArray(d)?d:Object.values(d);let bad=[];all.forEach((m,i)=>m.steps.forEach((s,j)=>{if((s.type||'do')==='do'&&!s.noGoal){if(!s.goal||s.goal.length<40||s.goal.length>260)bad.push(i+'.'+j+' goal');if(!s.title||s.title.length>48)bad.push(i+'.'+j+' title')}}));console.log(bad.length?bad.join('\n'):'OK')" <file path relative to repo>`
