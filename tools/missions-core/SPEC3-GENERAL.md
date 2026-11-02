# Cowork Academy: the general edition (any industry)

The Academy was first written for one client, a vacation rental company (the "Avari edition", in `tools/missions-avari/`). Most clients won't get a customized course, so we need a **general edition** that works for any company and any department. Your job is to rewrite one Avari mission file into its general version.

**Read first, in this order:**
1. `tools/missions-core/SPEC.md`: the step format and writing rules.
2. `tools/missions-core/SPEC2.md`: revision 2 rules (scenario quizzes, workplace projects, no unconfirmed features, and so on).
3. This file. Where this file and SPEC2 disagree, this file wins. In particular, SPEC2's file names and "vacation rental company" context are replaced by everything below.
4. `tools/missions-core/FACTS.md`: the real numbers in the new practice data. Every data-based quiz answer must come from here.

## Who the learners are
They are employees at **any** kind of company, such as a clinic group, law firm, manufacturer, school, nonprofit, retailer, bank or software company. They work in customer service, operations, finance, sales, marketing, HR or management, and their employer has paid for a Claude license and this training. The goal isn't just a certificate. They should become comfortable with Cowork and leave with ideas for automating reports, chasing and copy-and-paste in **their own job**. So:
- **"Think about your work" (`think.scene`)** should show a range of industries and departments across the file. Don't repeat one industry. Example: "At work: an accounts payable clerk at a hospital group checks every supplier invoice against the contract rate." `think.ask` is about the learner's own job.
- **Square-bracket examples** in prompts should cover different departments, for example "[your team and what it does, e.g. the accounts payable team, we pay supplier invoices]" or "[e.g. the HR team, we onboard new hires]".
- When it's safe, invite learners to use their own non-confidential work in place of the practice files: "Using your own export instead is fine, as long as it has no customer or employee personal details."

## The practice company: Lakeview Supply Co.
Lakeview is fictional. It has about 140 staff and sells office supplies, furniture, tech accessories, cleaning products and service plans to about 30 business customers across four regions (North, South, East and West). Its data runs from April to September 2026. The Set up mission puts a **Cowork Academy** folder in Documents that already contains:

| File | What it is |
|---|---|
| `orders.csv` | One row per order. Columns: order_id, order_date, customer, region, channel (Online store, Sales rep, Phone, Marketplace), product_line, units, unit_price, discount_pct, order_value, carrier, days_to_deliver, status (Delivered, Returned, Cancelled), revenue, sales_rep. revenue counts only Delivered orders. |
| `customer-feedback.csv` | Survey responses: response_id, order_id, customer, region, response_date, rating (1–5), comment. |
| `support-tickets.csv` | ticket_id, opened, closed, days_open, customer, region, category (Delivery, Billing, Returns, Product issue, Account and login, How-to question), issue, order_id, channel, priority, team, credit_issued, status. Tickets still open on 2026-09-30 show Open. |
| `vendor-invoice-swiftroute-september-2026.csv` | A carrier invoice with 3 planted mistakes. The agreed rate is $14.50 per package plus an 8% fuel surcharge. |
| `customer-messages.txt` | A practice customer inbox with 8 messages. |
| `team-notes.txt` | A messy email thread about late deliveries in the West, and the need to update Dr. Okafor at Desert Bloom Clinics, the biggest account. |
| `sample-business-brief.md` | The Lakeview brief, used as a fallback for business-brief.md. |
| `README.txt` | Explains the files. |

`files` on a step may list only `orders.csv`, `customer-feedback.csv` or `support-tickets.csv`.

## How to translate the Avari content
| Avari edition | General edition |
|---|---|
| bookings.csv | orders.csv |
| guest-reviews.csv | customer-feedback.csv |
| maintenance-tickets.csv | support-tickets.csv |
| owner-statement-driftwood-july-2026.csv (check for errors) | vendor-invoice-swiftroute-september-2026.csv (check for errors) |
| guest-messages.txt | customer-messages.txt |
| team-notes.txt (hot tub) | team-notes.txt (late deliveries, Desert Bloom Clinics) |
| guests | customers |
| properties | customers, regions, product lines or carriers, whichever fits |
| property owners or an owner update letter | a key customer, or a customer update letter to Dr. Okafor |
| a listing that sells | a product or service description that sells |
| a house guide | a customer help guide (ordering, returns, invoices) |
| a housekeeping turnover checklist | a checklist for a routine process (new-customer setup, month-end close, onboarding a new hire) |
| maintenance cost drivers or HVAC vendors | what's driving delivery problems and support tickets; comparing carriers |
| booking channels | sales channels |
| a vacation rental company | "your company" (the learner's own), or Lakeview when the practice data is used |

Keep every mission's **position, title intent, `blk` (the Cowork skill it teaches), `mins` and number of steps** unless there's a clear reason to change them. Session timings depend on `mins`. Titles must be sentence case and industry-neutral. Keep any special keys you find (`noStart`, `noReflect`, `link`, `t`, and so on) and keep their meaning.

**Banned words:** the validator rejects these in the general edition, so don't use them: guest, booking, property/properties, owner, vacation, rental, Airbnb, Vrbo, housekeeping, Driftwood, Pine Ridge, hot tub, check-in, listing, Saltwater, maintenance ticket. For a person who is accountable, write "who's responsible", not "process owner".

## Quizzes
All SPEC2 quiz rules still apply:
- realistic workplace scenarios
- believable wrong options of similar length
- the correct answer never the single longest option
- answer positions spread across 0, 1 and 2
- proof-of-work questions for data missions, using real FACTS.md values, with wrong options drawn from other real values

Good proof-of-work facts include:
- which channel has the highest cancellation rate (Marketplace)
- which product line has the highest return rate (Furniture)
- which region has the lowest average rating (West)
- which ticket category takes longest to close (Billing)
- which carrier slowed down from July (SwiftRoute)
- the top customer (Desert Bloom Clinics)
- which channel has the biggest average order (Sales rep)

Check every number in FACTS.md before you use it.

## Dates
The data covers 2026-04-01 to 2026-09-30. For "this week" style prompts, use 21–27 September 2026 or "the most recent week in the data". For "last month", use September 2026.

## Output and validation
Write the JSON array, in the same shape and order as the source, to the output path you were given. Then run:

`node tools/validate2.js <your output file> <mission count>`

from `/Users/scott/cowork-academy-hub`. Fix everything it reports, including the banned-word check, until it prints OK. Don't edit any other file.
