const fs=require('fs');const [,,f,n]=process.argv;const errs=[];
let a;try{a=JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){console.log('INVALID JSON:',e.message);process.exit(1);}
if(!Array.isArray(a))errs.push('top level must be an array');
if(n&&a.length!==+n)errs.push(`expected ${n} missions, got ${a.length}`);
const CORE=/missions-core/.test(f);
const FILES=CORE?['orders.csv','customer-feedback.csv','support-tickets.csv']:['bookings.csv','guest-reviews.csv','maintenance-tickets.csv'];
a.forEach((m,i)=>{const w=(s)=>errs.push(`mission ${i+1} (${m.t}): ${s}`);
  for(const k of ['t','blk','lead','why','result'])if(typeof m[k]!=='string'||!m[k].trim())w('missing '+k);
  if(!Number.isInteger(m.mins)||m.mins%5||m.mins<10||m.mins>40)w('mins must be a multiple of 5 between 10 and 40');
  if(!m.think||!m.think.scene||!m.think.ask)w('missing think.scene/ask');
  if(!Array.isArray(m.steps))return w('steps missing');
  const dos=m.steps.filter(s=>s.type==='do'),chk=m.steps.filter(s=>s.type==='check');
  if(dos.length<2||dos.length>4)w(`needs 2-4 do steps, has ${dos.length}`);
  if(chk.length!==1||m.steps[m.steps.length-1].type!=='check')w('needs exactly 1 check step, last');
  dos.forEach((s,j)=>{if(!s.title||!s.do||!s.see)w(`do step ${j+1} needs title, do, see`);
    if(typeof s.goal!=='string'||s.goal.length<40||s.goal.length>260)w(`do step ${j+1} needs a goal of 40-260 characters`);
    if(s.title&&s.title.length>48)w(`do step ${j+1} title over 48 characters`);
    if(s.prompt&&/____/.test(s.prompt))w(`step ${j+1} prompt uses ____`);
    if(s.files&&s.files.some(x=>!FILES.includes(x)))w(`step ${j+1} unknown file`);});
  chk.forEach(c=>{if(!c.q||!Array.isArray(c.options)||c.options.length!==3||!(c.answer>=0&&c.answer<3)||!c.why)w('check needs q, 3 options, answer 0-2, why');});
  const txt=JSON.stringify(m);
  if(CORE){const hit=txt.match(/\b(guests?|bookings?|propert(y|ies)|owners?|vacation|rentals?|airbnb|vrbo|booking\.com|housekeep\w*|driftwood|pine ridge|hot tub|check-in|listings?|saltwater|maintenance tickets?)\b/gi);if(hit)w('vacation-rental wording: '+[...new Set(hit.map(x=>x.toLowerCase()))].join(', '));}
if(/—/.test(txt))w('contains an em dash');if(/→/.test(txt))w('contains →');if(/!/.test(txt.replace(/!=/g,'')))w('contains an exclamation mark');
});
console.log(errs.length?errs.join('\n'):'OK '+a.length+' missions');process.exit(errs.length?1:0);
