// Builds the Academy starter folder (data/starter/Cowork Academy/*) and data/cowork-academy-starter.zip,
// plus a FACTS.md answer sheet (not published) for writing data-based quiz questions.
// Run after make-sample-data.js. Usage: node tools/make-starter.js [facts-output-path]
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const D=path.join(__dirname,'..','data');
const parse=f=>{const [h,...rows]=fs.readFileSync(path.join(D,f),'utf8').trim().split('\n');const cols=h.split(',');
  return rows.map(l=>{const v=[];let cur='',q=false;for(const ch of l){if(ch==='"'){q=!q;continue;}if(ch===','&&!q){v.push(cur);cur='';}else cur+=ch;}v.push(cur);
    const o={};cols.forEach((c,i)=>o[c]=v[i]);return o;});};
const B=parse('bookings.csv'),R=parse('guest-reviews.csv'),T=parse('maintenance-tickets.csv');
const csv=rows=>rows.map(r=>r.map(v=>{v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',')).join('\n')+'\n';
const OUT=path.join(D,'starter','Cowork Academy');fs.rmSync(path.join(D,'starter'),{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
for(const f of ['bookings.csv','guest-reviews.csv','maintenance-tickets.csv'])fs.copyFileSync(path.join(D,f),path.join(OUT,f));

// Owner statement for Driftwood Bungalow, July 2026, with 3 planted mistakes.
const RATE=0.20;
const jul=B.filter(b=>b.property==='Driftwood Bungalow'&&b.check_in.startsWith('2026-07')&&b.status==='Completed');
const st=[['booking_id','check_in','nights','nightly_rate','rent','platform_fee','management_fee_20pct','owner_payout']];
const mistakes=[];
jul.forEach((b,i)=>{let rent=+b.nights*+b.nightly_rate,pf=+b.platform_fee,mf=Math.round(rent*RATE);
  if(i===1){rent+= +b.nightly_rate;mistakes.push(`${b.booking_id}: rent shows ${b.nights} nights but is charged for ${+b.nights+1} (rent should be ${+b.nights*+b.nightly_rate}).`);}
  if(i===2){mf=Math.round(rent*0.25);mistakes.push(`${b.booking_id}: management fee is 25% (${mf}) instead of 20% (${Math.round(rent*RATE)}).`);}
  st.push([b.booking_id,b.check_in,b.nights,b.nightly_rate,rent,pf,mf,rent-pf-mf]);});
const dup=st[st.length-1].slice();st.push(dup);mistakes.push(`${dup[0]} is listed twice.`);
const tot=st.slice(1).reduce((a,r)=>a+r[7],0);st.push(['TOTAL','','','','','','',tot]);
fs.writeFileSync(path.join(OUT,'owner-statement-driftwood-july-2026.csv'),csv(st));

fs.writeFileSync(path.join(OUT,'guest-messages.txt'),`Practice guest inbox (made up for training). Names and numbers are fictional.

1. From: Dana P. | Booking B${1000+12} | Seabreeze Cottage
Hi! Is early check-in possible this Saturday? Our flight lands at 9am.

2. From: Marcus L. | Lighthouse View
The lockbox code you sent isn't working and we're standing outside with two kids. Please call ASAP.

3. From: Priya S. | Pine Ridge Cabin
Is the hot tub working now? Last time we stayed it was out of order.

4. From: Tom W. | Old Town Loft
Where do we park? The listing says street parking but the signs say permit only.

5. From: Grace H. | Driftwood Bungalow
The AC isn't cooling the upstairs bedrooms at all. It's 84 degrees inside.

6. From: Leo M. | Lakeside Retreat
Can we bring our dog? He's very well behaved, 30 lbs.

7. From: Aisha K. | Summit Lodge
Loved our stay! Can we book the same week next year at the same price?

8. From: Ben T. | Market Street Studio
What's the wifi password? It's not in the welcome book.
`);
fs.writeFileSync(path.join(OUT,'team-notes.txt'),`Email thread (made up for training): Pine Ridge Cabin hot tub

From: Sam (Maintenance)
Hot tub at Pine Ridge down again, heater element. Blue Water Pools coming Thurs. Part is $380 + labor.

From: Kelly (Guest Services)
2 guests mentioned it in reviews since June. One asked for a partial refund, we gave $75 credit.

From: Sam (Maintenance)
Blue Water says the heater is 9 years old. Replace whole unit = ~$2,400, would stop the repeat calls. 6 repair visits since April.

From: Jordan (Owner Relations)
Need to update the owner (Mr. Alvarez) this week. He'll want options + cost. Keep it short, he reads on his phone.
`);
fs.writeFileSync(path.join(OUT,'sample-business-brief.md'),`# Business brief: Saltwater Stays (sample)

- What we do: manage 12 vacation rental homes for their owners, from guest bookings to cleaning and repairs.
- Who we serve: families and small groups on beach and lake holidays, and the property owners who trust us with their homes.
- Tone: warm, clear and professional. Short sentences. No hype.
- Never: promise refunds, discounts or early check-in without approval; share guest contact details.
`);
fs.writeFileSync(path.join(OUT,'README.txt'),`Cowork Academy starter folder
=============================
Everything here is made up for practice: a fictional company with 12 rental homes, April to September 2026.
Point Claude Cowork at this folder and every mission's files are ready.

bookings.csv            One row per booking. total_revenue is after the platform fee (rent + cleaning fee - platform fee). Cancelled bookings show 0 revenue.
guest-reviews.csv       Guest reviews linked to bookings, with a 1 to 5 rating.
maintenance-tickets.csv Repair tickets with category, vendor, cost and status. Tickets still open on 30 September 2026 show status Open.
owner-statement-driftwood-july-2026.csv  A practice owner statement (management fee is 20% of rent). It contains mistakes on purpose.
guest-messages.txt      A practice guest inbox.
team-notes.txt          A practice email thread about a broken hot tub.
sample-business-brief.md  A sample company brief to use if you don't want to write your own.
`);
const zip=path.join(D,'cowork-academy-starter.zip');fs.rmSync(zip,{force:true});
execSync(`cd "${path.join(D,'starter')}" && zip -qrX "${zip}" "Cowork Academy" -x "*.DS_Store"`);

// ---- FACTS (answer sheet) ----
const by=(arr,k)=>arr.reduce((m,x)=>((m[x[k]]=m[x[k]]||[]).push(x),m),{});
let F='# Practice data facts (computed)\n\n## bookings.csv\n';
for(const [c,a] of Object.entries(by(B,'channel'))){const done=a.filter(x=>x.status==='Completed');const nights=done.reduce((s,x)=>s+ +x.nights,0),rev=done.reduce((s,x)=>s+ +x.total_revenue,0);
  F+=`- ${c}: ${a.length} bookings, ${Math.round(a.filter(x=>x.status==='Cancelled').length/a.length*100)}% cancelled, revenue $${rev}, avg nightly_rate $${Math.round(done.reduce((s,x)=>s+ +x.nightly_rate,0)/done.length)}, revenue per booked night $${Math.round(rev/nights)}\n`;}
for(const [m,a] of Object.entries(by(B.map(x=>({...x,m:x.check_in.slice(0,7)})),'m')).sort())F+=`- ${m}: ${a.length} bookings, revenue $${a.reduce((s,x)=>s+ +x.total_revenue,0)}\n`;
const pr=Object.entries(by(B,'property')).map(([p,a])=>[p,a.reduce((s,x)=>s+ +x.total_revenue,0)]).sort((a,b)=>b[1]-a[1]);F+='- revenue by property: '+pr.map(x=>x[0]+' $'+x[1]).join('; ')+'\n';
F+='\n## guest-reviews.csv\n';
const rp=Object.entries(by(R,'property')).map(([p,a])=>[p,a.length,(a.reduce((s,x)=>s+ +x.rating,0)/a.length).toFixed(2),a.filter(x=>+x.rating<=3).length]).sort((a,b)=>a[2]-b[2]);
F+=rp.map(r=>`- ${r[0]}: ${r[1]} reviews, avg ${r[2]}, ${r[3]} rated 3 or below`).join('\n')+'\n';
const th={AC:/AC|air conditioning|hot to sleep|stuffy|fans/i,wifi:/wifi|internet/i,'hot tub':/hot tub/i,'lock/door code':/lockbox|door code|smart lock/i,cleanliness:/not clean|sand and crumbs|stains/i,noise:/noise|loud/i};
for(const [k,re] of Object.entries(th)){const a=R.filter(x=>re.test(x.comment)&&+x.rating<=4);F+=`- complaints about ${k}: ${a.length} reviews at ${new Set(a.map(x=>x.property)).size} properties (${[...new Set(a.map(x=>x.property))].join(', ')})\n`;}
F+='\n## maintenance-tickets.csv\n';
const tp=Object.entries(by(T,'property')).map(([p,a])=>[p,a.length,a.reduce((s,x)=>s+ +x.cost,0)]).sort((a,b)=>b[2]-a[2]);F+='- cost by property: '+tp.map(x=>`${x[0]} $${x[2]} (${x[1]} tickets)`).join('; ')+'\n';
const tc=Object.entries(by(T,'category')).map(([p,a])=>[p,a.length,a.reduce((s,x)=>s+ +x.cost,0)]).sort((a,b)=>b[2]-a[2]);F+='- cost by category: '+tc.map(x=>`${x[0]} $${x[2]} (${x[1]})`).join('; ')+'\n';
const hv=Object.entries(by(T.filter(x=>x.category==='HVAC'),'vendor')).map(([v,a])=>`${v}: ${a.length} jobs, avg $${Math.round(a.reduce((s,x)=>s+ +x.cost,0)/a.length)}`);F+='- HVAC vendors: '+hv.join('; ')+'\n';
const rep=Object.entries(by(T.map(x=>({...x,k:x.property+' | '+x.issue})),'k')).map(([k,a])=>[k,a.length]).sort((a,b)=>b[1]-a[1]).slice(0,6);F+='- most repeated issue at one property: '+rep.map(x=>x[0]+' x'+x[1]).join('; ')+'\n';
const open=T.filter(x=>x.status==='Open');F+=`- ${open.length} tickets still Open on 2026-09-30, opened ${open.map(x=>x.opened).sort()[0]} to ${open.map(x=>x.opened).sort().pop()}: ${open.map(x=>x.ticket_id+' '+x.property+' '+x.issue+' ('+x.opened+')').join('; ')}\n`;
F+='- date range of tickets: '+T.map(x=>x.opened).sort()[0]+' to '+T.map(x=>x.opened).sort().pop()+'\n';
F+='\n## owner-statement-driftwood-july-2026.csv (planted mistakes)\n'+mistakes.map(m=>'- '+m).join('\n')+'\n';
F+='\n## Other starter files\n- guest-messages.txt: 8 messages; urgent = #2 lockbox (guests locked out) and #5 AC not cooling at Driftwood.\n- team-notes.txt: Pine Ridge hot tub heater, 2 guest review complaints, 6 repair visits since April, $380 part, ~$2,400 full replacement, owner Mr. Alvarez.\n';
const fo=process.argv[2]||path.join(__dirname,'FACTS.md');fs.writeFileSync(fo,F);
console.log('starter + zip written;',mistakes.length,'planted mistakes; facts ->',fo);
