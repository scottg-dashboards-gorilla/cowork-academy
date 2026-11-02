// Generates the general (any-industry) edition's practice data: a fictional company, Lakeview Supply Co.,
// into data/core/, plus the starter folder, its zip, and a FACTS.md answer sheet (not published).
// Deterministic: same output every run. Usage: node tools/make-core-data.js [facts-output-path]
// Patterns planted on purpose so learners have something to find:
//  - Online store brings the most orders; Sales rep orders are the biggest and bring the most revenue.
//  - Marketplace has the highest cancellation rate; Furniture has the highest return rate.
//  - From July, SwiftRoute deliveries in the West slow down; West revenue dips in August and September,
//    late-delivery complaints and Delivery tickets pile up there.
//  - Billing tickets take the longest to close.
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');
let seed=20261102;const rnd=()=>((seed=(seed*1103515245+12345)%2147483648)/2147483648);
const pick=a=>a[Math.floor(rnd()*a.length)];const between=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const d=(y,m,day)=>new Date(Date.UTC(y,m-1,day));const iso=x=>x.toISOString().slice(0,10);
const addDays=(x,n)=>new Date(x.getTime()+n*864e5);
const csv=rows=>rows.map(r=>r.map(v=>{v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',')).join('\n')+'\n';
const weighted=list=>{const t=list.reduce((a,x)=>a+x[1],0);let r=rnd()*t;for(const x of list){r-=x[1];if(r<0)return x[0];}return list[0][0];};

const customers={
 North:['Cedar Ridge Accounting','Northgate Insurance Agency','Birchwood Schools','Pioneer Logistics','Maple Street Dental','Summit Engineering','Riverbend Library','Granite Realty Group'],
 South:['Magnolia Hotels Group','Bayou Legal Partners','Sunrise Pediatrics','Coastal Credit Union','Palmetto Realty','Gulfview Construction','Oakline Veterinary','Harbor Fitness Clubs'],
 East:['Liberty Architects','Brookside Medical','Keystone Manufacturing','Hudson Media','Atlantic Charter School','Bluebird Coworking','Patriot Auto Group','Elmwood Senior Living'],
 West:['Desert Bloom Clinics','Redwood Software','Canyon Facilities Group','Pacific Design Studio','Sierra Outdoor Gear','Golden State Labs','Mesa Family Dental','Bayview Nonprofit Alliance']};
const regionOf={};for(const [r,a] of Object.entries(customers))a.forEach(c=>regionOf[c]=r);
const custWeights=Object.values(customers).flat().map(c=>[c,c==='Desert Bloom Clinics'?5:['Magnolia Hotels Group','Keystone Manufacturing','Birchwood Schools'].includes(c)?2.2:1]);
const reps={North:['Alicia R.','Ben K.'],South:['Carmen D.'],East:['David M.','Erin S.'],West:['Felix T.']};
const channels=[['Online store',.44],['Sales rep',.2],['Phone',.15],['Marketplace',.21]];
const lines={'Office supplies':[.36,[5,60],[4,25]],'Tech accessories':[.2,[2,30],[15,120]],'Cleaning and facilities':[.17,[10,80],[6,30]],'Furniture':[.14,[1,12],[140,650]],'Service plans':[.13,[1,1],[600,2400]]};

// ---- orders.csv: April to September 2026, weekdays ----
const orders=[['order_id','order_date','customer','region','channel','product_line','units','unit_price','discount_pct','order_value','carrier','days_to_deliver','status','revenue','sales_rep']];
let oid=50001;
for(let day=d(2026,4,1);day<=d(2026,9,30);day=addDays(day,1)){
  const wd=day.getUTCDay();if(wd===0||wd===6)continue;const month=day.getUTCMonth()+1;
  const n=between(6,11);
  for(let k=0;k<n;k++){
    const cust=weighted(custWeights);const region=regionOf[cust];
    if(region==='West'&&month>=8&&rnd()<.35)continue; // the West slows down after delivery problems
    let ch=weighted(channels);let line=weighted(Object.entries(lines).map(([l,v])=>[l,v[0]]));
    if(line==='Service plans'&&ch==='Marketplace')ch='Phone';
    const [,u,p]=lines[line];let units=between(u[0],u[1]);if(ch==='Sales rep'&&line!=='Service plans')units=Math.round(units*1.7);
    if(cust==='Desert Bloom Clinics'&&line!=='Service plans')units=Math.round(units*1.5);
    const price=Math.round((p[0]+rnd()*(p[1]-p[0]))*100)/100;
    const disc=ch==='Sales rep'?pick([5,10,10,15]):(rnd()<.25?5:0);
    const value=Math.round(units*price*(1-disc/100));
    let carrier='',days='';
    if(line!=='Service plans'){
      if(region==='West')carrier=rnd()<.7?'SwiftRoute':'Northline Freight';else carrier=rnd()<.5?'Northline Freight':'ParcelPro';
      days=carrier==='SwiftRoute'?(month>=7?between(5,10):between(3,5)):between(2,4);
    }
    let status='Delivered';
    const cancel=ch==='Marketplace'?.11:.03;
    const ret=(line==='Furniture'?.13:.025)+(ch==='Marketplace'?.04:0)+(days>=7?.05:0);
    const r=rnd();if(r<cancel){status='Cancelled';days='';}else if(r<cancel+ret)status='Returned';
    orders.push(['SO-'+oid++,iso(day),cust,region,ch,line,units,price.toFixed(2),disc,value,status==='Cancelled'?'':carrier,days,status,status==='Delivered'?value:0,ch==='Sales rep'||ch==='Phone'?pick(reps[region]):'']);
  }
}
const O=orders.slice(1).map(r=>Object.fromEntries(orders[0].map((c,i)=>[c,r[i]])));

// ---- customer-feedback.csv ----
const pos={
 speed:['Arrived a day early.','Delivery was quick and on time.','Fast shipping as always.','Showed up exactly when promised.','Next-day delivery saved our week.'],
 rep:['Our account rep sorted everything in one call.','Rep remembered our usual order, very helpful.','Great advice from the sales team on what to buy.','Support answered my question within the hour.'],
 product:['Good quality for the price.','The chairs are comfortable and sturdy.','Everything was packed well.','Exactly what we ordered.','Toner and paper were the right ones this time.'],
 easy:['Online ordering is easy.','Reordering from our saved list takes two minutes.','Invoice was clear and easy to approve.','Love the order tracking emails.']};
const neg={
 late:['Delivery was a week late, no update from the carrier.','Order arrived 8 days after the promised date.','Still waiting on part of this order, tracking has not moved.','Late again. We had to buy supplies locally in the meantime.','Carrier missed two delivery windows.','Our clinic ran short because the delivery was late.'],
 damaged:['Desk arrived with a cracked top.','Chair base was broken in the box.','Furniture was scratched and had to go back.','Bookcase panels were damaged on arrival.'],
 billing:['We were charged twice for the same order.','Invoice did not show our agreed discount.','Billing was confusing, two invoices for one order.','Took three emails to get a corrected invoice.'],
 wrong:['Received the wrong item.','Order was missing two boxes.']};
const combo=(a,b)=>rnd()<.45?pick(a)+' '+pick(b):pick(a);
const fb=[['response_id','order_id','customer','region','response_date','rating','comment']];const seen=new Set();let rid=1;
for(const o of O){
  if(o.status==='Cancelled'||rnd()>(o.days_to_deliver>=7||o.status==='Returned'?.8:.3))continue;
  let c,rating;
  if(o.days_to_deliver>=7&&rnd()<.75){c=combo(neg.late,[...pos.rep,...pos.product]);rating=between(1,3);}
  else if(o.status==='Returned'&&o.product_line==='Furniture'){c=pick(neg.damaged);rating=between(1,2);}
  else if(rnd()<.06){c=pick(neg.billing);rating=between(2,3);}
  else if(rnd()<.03){c=pick(neg.wrong);rating=2;}
  else{const ks=Object.keys(pos);const k1=pick(ks);let k2=pick(ks);c=pos[k1][Math.floor(rnd()*pos[k1].length)];if(rnd()<.5&&k2!==k1)c+=' '+pick(pos[k2]);rating=rnd()<.7?5:4;}
  if(seen.has(c)&&rnd()<.7)continue;seen.add(c);
  const when=addDays(new Date(o.order_date+'T00:00:00Z'),(+o.days_to_deliver||1)+between(1,5));if(when>d(2026,9,30))continue;
  fb.push(['FB'+String(rid++).padStart(4,'0'),o.order_id,o.customer,o.region,iso(when),rating,c]);
}
const F=fb.slice(1).map(r=>Object.fromEntries(fb[0].map((c,i)=>[c,r[i]])));

// ---- support-tickets.csv ----
const issues={Delivery:['Order not delivered','Delivery late','Tracking not updating','Partial delivery'],Billing:['Charged twice','Discount missing from invoice','Invoice copy needed','Wrong billing address'],
 Returns:['Return request','Refund not received','Return label needed'],'Product issue':['Item damaged','Wrong item sent','Item stopped working'],
 'Account and login':['Cannot log in','Add a new user','Password reset'],'How-to question':['How to set up a standing order','How to use saved lists','How to download invoices']};
const team={Delivery:'Warehouse',Billing:'Billing',Returns:'Warehouse','Product issue':'Support','Account and login':'Support','How-to question':'Support'};
const tickets=[];
function ticket(cat,opened,cust,orderId){
  if(opened>d(2026,9,30))return;
  const days=cat==='Billing'?between(3,16):cat==='Delivery'?between(1,6):cat==='How-to question'?between(0,2):between(1,8);
  const closed=addDays(opened,days);const open=closed>d(2026,9,30);
  const credit=cat==='Delivery'?pick([0,25,50,50,75,100,150]):cat==='Billing'?pick([0,0,0,40,80]):cat==='Product issue'?pick([0,0,60,120]):0;
  const prio=cat==='Delivery'||cat==='Billing'?pick(['High','Medium','Medium']):pick(['Low','Low','Medium']);
  tickets.push({opened:iso(opened),closed:open?'':iso(closed),days_open:open?'':days,customer:cust,region:regionOf[cust],category:cat,issue:pick(issues[cat]),order_id:orderId||'',channel:pick(['Email','Email','Phone','Chat']),priority:prio,team:team[cat],credit_issued:open?0:credit,status:open?'Open':'Closed'});
}
for(const o of O){const od=new Date(o.order_date+'T00:00:00Z');
  if(o.days_to_deliver>=7&&rnd()<.55)ticket('Delivery',addDays(od,between(5,7)),o.customer,o.order_id);
  else if(o.status==='Returned'&&rnd()<.6)ticket(o.product_line==='Furniture'&&rnd()<.5?'Product issue':'Returns',addDays(od,(+o.days_to_deliver||2)+between(0,3)),o.customer,o.order_id);
}
const allCust=Object.values(customers).flat();
for(const [cat,n] of [['Billing',48],['Account and login',30],['How-to question',38],['Product issue',22],['Delivery',18]])
  for(let i=0;i<n;i++){const c=pick(allCust);const ord=O.filter(o=>o.customer===c&&o.status!=='Cancelled');ticket(cat,addDays(d(2026,4,1),between(0,182)),c,cat==='Account and login'||cat==='How-to question'?'':pick(ord).order_id);}
tickets.sort((a,b)=>a.opened<b.opened?-1:a.opened>b.opened?1:0);
const T=tickets.map((t,i)=>({ticket_id:'CS-'+(1001+i),...t}));
const tcols=['ticket_id','opened','closed','days_open','customer','region','category','issue','order_id','channel','priority','team','credit_issued','status'];

// ---- write data/core ----
const D=path.join(__dirname,'..','data','core');fs.mkdirSync(D,{recursive:true});
fs.writeFileSync(path.join(D,'orders.csv'),csv(orders));
fs.writeFileSync(path.join(D,'customer-feedback.csv'),csv(fb));
fs.writeFileSync(path.join(D,'support-tickets.csv'),csv([tcols,...T.map(t=>tcols.map(c=>t[c]))]));

// ---- vendor invoice with 3 planted mistakes ----
const RATE=14.5,FUEL=0.08;
const sep=O.filter(o=>o.carrier==='SwiftRoute'&&o.order_date.startsWith('2026-09')&&o.status!=='Cancelled').slice(0,14);
const inv=[['shipment_date','order_id','customer','packages','rate_per_package','base_charge','fuel_surcharge_8pct','line_total']];const mistakes=[];
sep.forEach((o,i)=>{const pk=Math.max(1,Math.min(6,Math.ceil(+o.units/12)));let base=+(pk*RATE).toFixed(2),fuel=+(base*FUEL).toFixed(2);
  if(i===3){const wrong=+((pk+2)*RATE).toFixed(2);mistakes.push(`${o.order_id}: base_charge ${wrong.toFixed(2)} is for ${pk+2} packages, but the line shows ${pk} packages (should be ${base.toFixed(2)}).`);base=wrong;fuel=+(base*FUEL).toFixed(2);}
  if(i===7){const right=fuel;fuel=+(base*0.12).toFixed(2);mistakes.push(`${o.order_id}: fuel surcharge is 12% (${fuel.toFixed(2)}) instead of the agreed 8% (${right.toFixed(2)}).`);}
  inv.push([o.order_date,o.order_id,o.customer,pk,RATE.toFixed(2),base.toFixed(2),fuel.toFixed(2),(base+fuel).toFixed(2)]);});
const dup=inv[inv.length-1].slice();inv.push(dup);mistakes.push(`${dup[1]} is billed twice (the last two lines are identical).`);
const invTot=inv.slice(1).reduce((a,r)=>a+ +r[7],0);inv.push(['TOTAL','','','','','','',invTot.toFixed(2)]);

// ---- starter folder ----
const SD=path.join(D,'starter');fs.rmSync(SD,{recursive:true,force:true});const OUT=path.join(SD,'Cowork Academy');fs.mkdirSync(OUT,{recursive:true});
for(const f of ['orders.csv','customer-feedback.csv','support-tickets.csv'])fs.copyFileSync(path.join(D,f),path.join(OUT,f));
fs.writeFileSync(path.join(OUT,'vendor-invoice-swiftroute-september-2026.csv'),csv(inv));
const westDel=T.filter(t=>t.region==='West'&&t.category==='Delivery'&&t.opened>='2026-07-01');
const westCredit=westDel.reduce((a,t)=>a+ +t.credit_issued,0);
const dbLate=O.filter(o=>o.customer==='Desert Bloom Clinics'&&o.days_to_deliver>=7).length;
fs.writeFileSync(path.join(OUT,'customer-messages.txt'),`Practice customer inbox (made up for training). Names and numbers are fictional.

1. From: Rosa M., Palmetto Realty
Can you send a quote for 12 standing desks? We're moving offices in November.

2. From: Dr. Hana Okafor, Desert Bloom Clinics
Our supply order still hasn't arrived and we open a new clinic tomorrow morning. Tracking hasn't moved in 4 days. Please call me today.

3. From: Greg P., Hudson Media
One of the office chairs from our last order arrived with a broken base. How do I return it?

4. From: Lena W., Birchwood Schools
Please change the delivery address for next week's order to our north campus. Same contact person.

5. From: Tariq S., Coastal Credit Union
We were charged twice for invoice 50412. Please refund the duplicate charge.

6. From: Mei L., Bluebird Coworking
Can you resend the August invoices? Our accountant needs them by Friday.

7. From: Owen B., Keystone Manufacturing
Great service this quarter. Can we lock in the same pricing for next year?

8. From: Priya N., Redwood Software
I can't log in to the ordering site. It says my account is locked.
`);
fs.writeFileSync(path.join(OUT,'team-notes.txt'),`Email thread (made up for training): late deliveries in the West

From: Sam (Operations)
SwiftRoute is late again in the West. Since July their deliveries are taking 5 to 10 days instead of 3. Their September invoice just came in too.

From: Kelly (Customer Support)
We've logged ${westDel.length} delivery tickets from West customers since July and given $${westCredit} in credits. Desert Bloom Clinics alone has had ${dbLate} late orders.

From: Sam (Operations)
Northline Freight can take over the West. About $1.10 more per package, roughly $1,900 a month extra, but they quote 3-day delivery. We could switch in two weeks.

From: Jordan (Sales)
I need to update Dr. Okafor at Desert Bloom Clinics this week. They're our biggest account and their contract renews in November. She'll want to know what we're doing about it and when. Keep it short, she reads email on her phone.
`);
fs.writeFileSync(path.join(OUT,'sample-business-brief.md'),`# Business brief: Lakeview Supply Co. (sample)

- What we do: supply offices, clinics and schools with everyday supplies, furniture, tech accessories and cleaning products, plus service plans that keep their equipment running.
- Who we serve: about 30 business customers in four regions (North, South, East and West), from small offices to multi-site clinics.
- Team: about 140 people across sales, customer support, operations and the warehouse, finance and HR.
- Tone: friendly, clear and practical. Short sentences. No jargon or hype.
- Never: promise discounts, credits or delivery dates without approval; share one customer's details with another.
`);
fs.writeFileSync(path.join(OUT,'README.txt'),`Cowork Academy starter folder
=============================
Everything here is made up for practice: Lakeview Supply Co., a fictional company that sells supplies and services to other businesses, April to September 2026.
Point Claude Cowork at this folder and every mission's files are ready.

orders.csv              One row per order. order_value is the order's price after discount. revenue counts only Delivered orders (Cancelled and Returned orders show 0).
customer-feedback.csv   Customer survey responses linked to orders, with a 1 to 5 rating.
support-tickets.csv     Customer support tickets with category, team, any credit issued, and status. Tickets still open on 30 September 2026 show status Open.
vendor-invoice-swiftroute-september-2026.csv  A practice carrier invoice. The agreed rate is $14.50 per package plus an 8% fuel surcharge. It contains mistakes on purpose.
customer-messages.txt   A practice customer inbox.
team-notes.txt          A practice email thread about late deliveries.
sample-business-brief.md  A sample company brief to use if you don't want to write your own.
`);
fs.copyFileSync(path.join(OUT,'README.txt'),path.join(D,'README.txt'));
const zip=path.join(D,'cowork-academy-starter.zip');fs.rmSync(zip,{force:true});
execSync(`cd "${SD}" && zip -qrX "${zip}" "Cowork Academy" -x "*.DS_Store"`);

// ---- FACTS (answer sheet) ----
const by=(arr,k)=>arr.reduce((m,x)=>((m[x[k]]=m[x[k]]||[]).push(x),m),{});
const sum=(a,k)=>a.reduce((s,x)=>s+ +x[k],0);const pct=(n,t)=>Math.round(n/t*100);
let S='# Practice data facts (computed): general edition, Lakeview Supply Co.\n\n## orders.csv\n';
S+=`- ${O.length} orders, ${O[0].order_date} to ${O[O.length-1].order_date}; total revenue $${sum(O,'revenue')}\n`;
for(const [c,a] of Object.entries(by(O,'channel'))){const del=a.filter(x=>x.status==='Delivered');
  S+=`- channel ${c}: ${a.length} orders, ${pct(a.filter(x=>x.status==='Cancelled').length,a.length)}% cancelled, ${pct(a.filter(x=>x.status==='Returned').length,a.length)}% returned, revenue $${sum(a,'revenue')}, avg delivered order $${Math.round(sum(del,'order_value')/del.length)}\n`;}
for(const [c,a] of Object.entries(by(O,'product_line')))S+=`- product line ${c}: ${a.length} orders, ${pct(a.filter(x=>x.status==='Returned').length,a.length)}% returned, revenue $${sum(a,'revenue')}\n`;
for(const [m,a] of Object.entries(by(O.map(x=>({...x,m:x.order_date.slice(0,7)})),'m')).sort())S+=`- ${m}: ${a.length} orders, revenue $${sum(a,'revenue')}; by region: ${Object.entries(by(a,'region')).sort().map(([r,b])=>r+' $'+sum(b,'revenue')).join(', ')}\n`;
S+='- revenue by region: '+Object.entries(by(O,'region')).map(([r,a])=>[r,sum(a,'revenue')]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]+' $'+x[1]).join('; ')+'\n';
S+='- top customers by revenue: '+Object.entries(by(O,'customer')).map(([r,a])=>[r,sum(a,'revenue')]).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]+' $'+x[1]).join('; ')+'\n';
S+='- revenue by sales rep (Sales rep and Phone orders): '+Object.entries(by(O.filter(x=>x.sales_rep),'sales_rep')).map(([r,a])=>[r,sum(a,'revenue'),a.length]).sort((a,b)=>b[1]-a[1]).map(x=>`${x[0]} $${x[1]} (${x[2]} orders)`).join('; ')+'\n';
const shipped=O.filter(x=>x.days_to_deliver!=='');
for(const [c,a] of Object.entries(by(shipped,'carrier'))){const early=a.filter(x=>x.order_date<'2026-07-01'),late=a.filter(x=>x.order_date>='2026-07-01');
  S+=`- carrier ${c}: ${a.length} shipments, avg ${(sum(a,'days_to_deliver')/a.length).toFixed(1)} days (Apr-Jun ${(sum(early,'days_to_deliver')/early.length).toFixed(1)}, Jul-Sep ${(sum(late,'days_to_deliver')/late.length).toFixed(1)}), ${a.filter(x=>x.days_to_deliver>=7).length} took 7+ days\n`;}
S+='- avg days to deliver by region: '+Object.entries(by(shipped,'region')).map(([r,a])=>r+' '+(sum(a,'days_to_deliver')/a.length).toFixed(1)).join('; ')+'\n';
S+='\n## customer-feedback.csv\n';
S+=`- ${F.length} responses, ${new Set(F.map(x=>x.comment)).size} distinct comments, avg rating ${(sum(F,'rating')/F.length).toFixed(2)}\n`;
S+=Object.entries(by(F,'region')).map(([r,a])=>`- ${r}: ${a.length} responses, avg ${(sum(a,'rating')/a.length).toFixed(2)}, ${a.filter(x=>+x.rating<=2).length} rated 2 or below`).join('\n')+'\n';
const th={'late delivery':/late|waiting|missed|tracking|ran short/i,'damaged furniture':/cracked|broken|scratched|damaged/i,billing:/charged twice|invoice did not|billing|corrected invoice/i,'wrong or missing items':/wrong item|missing two/i};
for(const [k,re] of Object.entries(th)){const a=F.filter(x=>re.test(x.comment)&&+x.rating<=3);S+=`- complaints about ${k}: ${a.length} (by region: ${Object.entries(by(a,'region')).map(([r,b])=>r+' '+b.length).join(', ')})\n`;}
S+='\n## support-tickets.csv\n';
S+=`- ${T.length} tickets, ${T[0].opened} to ${T[T.length-1].opened}\n`;
S+=Object.entries(by(T,'category')).map(([c,a])=>{const cl=a.filter(x=>x.status==='Closed');return `- ${c}: ${a.length} tickets, avg ${(sum(cl,'days_open')/cl.length).toFixed(1)} days to close, credits $${sum(a,'credit_issued')}`;}).sort().join('\n')+'\n';
S+='- tickets by region: '+Object.entries(by(T,'region')).map(([r,a])=>r+' '+a.length).join('; ')+'\n';
S+=`- West Delivery tickets opened from 2026-07-01: ${westDel.length}, credits $${westCredit}\n`;
S+='- Delivery tickets by month: '+Object.entries(by(T.filter(x=>x.category==='Delivery').map(x=>({...x,m:x.opened.slice(0,7)})),'m')).sort().map(([m,a])=>m+' '+a.length).join('; ')+'\n';
S+='- customers with most tickets: '+Object.entries(by(T,'customer')).map(([c,a])=>[c,a.length]).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]+' '+x[1]).join('; ')+'\n';
const op=T.filter(x=>x.status==='Open');S+=`- ${op.length} tickets still Open on 2026-09-30: ${op.map(x=>`${x.ticket_id} ${x.customer} ${x.category} "${x.issue}" (opened ${x.opened})`).join('; ')}\n`;
S+='- tickets opened 2026-09-21 to 2026-09-27: '+T.filter(x=>x.opened>='2026-09-21'&&x.opened<='2026-09-27').length+'; by category: '+Object.entries(by(T.filter(x=>x.opened>='2026-09-21'&&x.opened<='2026-09-27'),'category')).map(([c,a])=>c+' '+a.length).join(', ')+'\n';
S+=`\n## vendor-invoice-swiftroute-september-2026.csv (planted mistakes; agreed $14.50/package + 8% fuel)\n- invoice total as billed: $${invTot.toFixed(2)}\n`+mistakes.map(m=>'- '+m).join('\n')+'\n';
S+=`\n## Other starter files\n- customer-messages.txt: 8 messages; urgent = #2 Dr. Okafor, Desert Bloom Clinics, order not arrived and new clinic opens tomorrow; #5 Coastal Credit Union charged twice. Others: quote request (#1), broken chair return (#3), address change (#4), resend invoices (#6), pricing for next year (#7), locked account (#8).\n- team-notes.txt: SwiftRoute late in the West since July (5-10 days vs 3); ${westDel.length} West delivery tickets since July, $${westCredit} credits; Desert Bloom Clinics ${dbLate} late orders; Northline Freight ~$1.10 more per package, ~$1,900/month, 3-day delivery, switch in two weeks; update Dr. Okafor (biggest account, renews November), short, reads on phone.\n- sample-business-brief.md: Lakeview Supply Co., ~140 staff, ~30 business customers, 4 regions.\n`;
const fo=process.argv[2]||path.join(__dirname,'missions-core','FACTS.md');fs.mkdirSync(path.dirname(fo),{recursive:true});fs.writeFileSync(fo,S);
console.log('orders',O.length,'feedback',F.length,'tickets',T.length,'mistakes',mistakes.length,'-> facts',fo);
