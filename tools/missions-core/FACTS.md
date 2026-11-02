# Practice data facts (computed): general edition, Lakeview Supply Co.

## orders.csv
- 1102 orders, 2026-04-01 to 2026-09-30; total revenue $1193478
- channel Online store: 507 orders, 4% cancelled, 3% returned, revenue $532922, avg delivered order $1136
- channel Phone: 171 orders, 5% cancelled, 5% returned, revenue $186977, avg delivered order $1222
- channel Marketplace: 204 orders, 13% cancelled, 8% returned, revenue $150387, avg delivered order $934
- channel Sales rep: 220 orders, 3% cancelled, 6% returned, revenue $323192, avg delivered order $1616
- product line Tech accessories: 235 orders, 3% returned, revenue $257470
- product line Office supplies: 392 orders, 4% returned, revenue $193689
- product line Furniture: 145 orders, 14% returned, revenue $380286
- product line Cleaning and facilities: 182 orders, 4% returned, revenue $161740
- product line Service plans: 148 orders, 2% returned, revenue $200293
- 2026-04: 197 orders, revenue $238156; by region: East $57486, North $57797, South $47080, West $75793
- 2026-05: 178 orders, revenue $196015; by region: East $39515, North $58841, South $29455, West $68204
- 2026-06: 199 orders, revenue $209574; by region: East $28533, North $63505, South $57492, West $60044
- 2026-07: 188 orders, revenue $202202; by region: East $41350, North $40015, South $46592, West $74245
- 2026-08: 164 orders, revenue $148777; by region: East $27945, North $44442, South $55217, West $21173
- 2026-09: 176 orders, revenue $198754; by region: East $51042, North $61026, South $53122, West $33564
- revenue by region: West $333023; North $325626; South $288958; East $245871
- top customers by revenue: Desert Bloom Clinics $204895; Magnolia Hotels Group $74044; Birchwood Schools $61949; Cedar Ridge Accounting $53603; Keystone Manufacturing $49563; Riverbend Library $45552
- revenue by sales rep (Sales rep and Phone orders): Carmen D. $143754 (104 orders); Felix T. $128000 (98 orders); David M. $67451 (48 orders); Alicia R. $65873 (51 orders); Ben K. $64265 (54 orders); Erin S. $40826 (36 orders)
- carrier Northline Freight: 395 shipments, avg 3.0 days (Apr-Jun 3.0, Jul-Sep 3.0), 0 took 7+ days
- carrier SwiftRoute: 188 shipments, avg 5.5 days (Apr-Jun 4.1, Jul-Sep 7.6), 53 took 7+ days
- carrier ParcelPro: 312 shipments, avg 3.0 days (Apr-Jun 3.0, Jul-Sep 3.0), 0 took 7+ days
- avg days to deliver by region: East 3.0; West 4.9; North 3.0; South 3.0

## customer-feedback.csv
- 185 responses, 133 distinct comments, avg rating 4.15
- East: 38 responses, avg 4.39, 3 rated 2 or below
- South: 43 responses, avg 4.33, 3 rated 2 or below
- West: 53 responses, avg 3.51, 16 rated 2 or below
- North: 51 responses, avg 4.47, 6 rated 2 or below
- complaints about late delivery: 17 (by region: West 17)
- complaints about damaged furniture: 7 (by region: West 1, North 3, South 2, East 1)
- complaints about billing: 8 (by region: West 3, East 2, North 2, South 1)
- complaints about wrong or missing items: 4 (by region: East 1, West 2, North 1)

## support-tickets.csv
- 216 tickets, 2026-04-03 to 2026-09-30
- Account and login: 30 tickets, avg 4.4 days to close, credits $0
- Billing: 48 tickets, avg 9.6 days to close, credits $1040
- Delivery: 43 tickets, avg 3.8 days to close, credits $2525
- How-to question: 38 tickets, avg 1.1 days to close, credits $0
- Product issue: 30 tickets, avg 4.8 days to close, credits $1560
- Returns: 27 tickets, avg 5.0 days to close, credits $0
- tickets by region: West 66; East 46; North 48; South 56
- West Delivery tickets opened from 2026-07-01: 25, credits $1450
- Delivery tickets by month: 2026-04 3; 2026-05 2; 2026-06 4; 2026-07 15; 2026-08 9; 2026-09 10
- customers with most tickets: Desert Bloom Clinics 19; Magnolia Hotels Group 12; Birchwood Schools 10; Bayview Nonprofit Alliance 10; Canyon Facilities Group 9
- 7 tickets still Open on 2026-09-30: CS-1204 Magnolia Hotels Group Billing "Invoice copy needed" (opened 2026-09-20); CS-1206 Hudson Media Billing "Invoice copy needed" (opened 2026-09-23); CS-1209 Coastal Credit Union Account and login "Password reset" (opened 2026-09-25); CS-1211 Canyon Facilities Group Billing "Discount missing from invoice" (opened 2026-09-27); CS-1213 Keystone Manufacturing Billing "Wrong billing address" (opened 2026-09-29); CS-1214 Granite Realty Group Account and login "Cannot log in" (opened 2026-09-30); CS-1216 Redwood Software How-to question "How to use saved lists" (opened 2026-09-30)
- tickets opened 2026-09-21 to 2026-09-27: 8; by category: Returns 1, Billing 3, Account and login 3, Product issue 1

## vendor-invoice-swiftroute-september-2026.csv (planted mistakes; agreed $14.50/package + 8% fuel)
- invoice total as billed: $720.94
- SO-50959: base_charge 58.00 is for 4 packages, but the line shows 2 packages (should be 29.00).
- SO-50993: fuel surcharge is 12% (1.74) instead of the agreed 8% (1.16).
- SO-51062 is billed twice (the last two lines are identical).

## Other starter files
- customer-messages.txt: 8 messages; urgent = #2 Dr. Okafor, Desert Bloom Clinics, order not arrived and new clinic opens tomorrow; #5 Coastal Credit Union charged twice. Others: quote request (#1), broken chair return (#3), address change (#4), resend invoices (#6), pricing for next year (#7), locked account (#8).
- team-notes.txt: SwiftRoute late in the West since July (5-10 days vs 3); 25 West delivery tickets since July, $1450 credits; Desert Bloom Clinics 26 late orders; Northline Freight ~$1.10 more per package, ~$1,900/month, 3-day delivery, switch in two weeks; update Dr. Okafor (biggest account, renews November), short, reads on phone.
- sample-business-brief.md: Lakeview Supply Co., ~140 staff, ~30 business customers, 4 regions.
