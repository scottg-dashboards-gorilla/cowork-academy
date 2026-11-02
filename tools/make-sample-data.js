// Generates the Academy's practice data pack (fictional vacation-rental company) into ../data.
// Deterministic: same output every run. Patterns are planted on purpose so learners have something to find:
//  - Direct bookings earn the most per night; Airbnb brings the most bookings; Booking.com cancels most.
//  - Driftwood Bungalow: repeated HVAC failures and "too hot" reviews. Pine Ridge Cabin: hot tub + wifi complaints.
//  - Coastal Climate Co. costs noticeably more per HVAC job than other vendors.
const fs=require('fs'),path=require('path');
let seed=20261101;const rnd=()=>((seed=(seed*1103515245+12345)%2147483648)/2147483648);
const pick=a=>a[Math.floor(rnd()*a.length)];const between=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const props=[
 ['Seabreeze Cottage','Harbor Point',2,210],['Driftwood Bungalow','Harbor Point',2,195],['Lighthouse View','Harbor Point',4,385],
 ['Pelican Flats','Harbor Point',1,140],['Pine Ridge Cabin','Pine Ridge',3,240],['Aspen Hideaway','Pine Ridge',2,175],
 ['Summit Lodge','Pine Ridge',5,520],['Old Town Loft','Old Town',1,155],['Market Street Studio','Old Town',1,120],
 ['Lakeside Retreat','Lakeside',4,360],['Dockside Cottage','Lakeside',3,265],['Willow Point House','Lakeside',3,280]];
const channels=[['Airbnb',.42,.95,.14],['Vrbo',.28,1.0,.08],['Direct',.18,1.06,0],['Booking.com',.12,.97,.15]]; // share, rate factor, fee
const cancelRate={Airbnb:.07,Vrbo:.06,Direct:.04,'Booking.com':.24};
const d=(y,m,day)=>new Date(Date.UTC(y,m-1,day));const iso=x=>x.toISOString().slice(0,10);
const addDays=(x,n)=>new Date(x.getTime()+n*864e5);
function chooseChannel(){let r=rnd(),a=0;for(const c of channels){a+=c[1];if(r<a)return c;}return channels[0];}
const csv=rows=>rows.map(r=>r.map(v=>{v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',')).join('\n')+'\n';

// Bookings: Apr–Sep 2026, filled per property calendar
const bookings=[['booking_id','property','area','bedrooms','channel','booked_on','check_in','check_out','nights','guests','nightly_rate','cleaning_fee','platform_fee','total_revenue','status']];
let bid=1001;const completed=[];
for(const [name,area,beds,base] of props){
  let day=d(2026,4,1);const end=d(2026,9,30);
  while(day<end){
    day=addDays(day,rnd()<.35?between(1,4):0);
    const nights=between(2,7);const ci=day;const co=addDays(ci,nights);if(co>d(2026,10,2))break;
    const [ch,,rf,fee]=chooseChannel();const month=ci.getUTCMonth()+1;
    const seasonal=({4:.8,5:.9,6:1.05,7:1.15,8:1.08,9:.9})[month];
    const rate=Math.round(base*rf*seasonal*(.92+rnd()*.16));
    const clean=60+beds*25;const gross=rate*nights+clean;const pf=Math.round(gross*fee);
    const status=rnd()<cancelRate[ch]?'Cancelled':'Completed';
    const row=['B'+bid++,name,area,beds,ch,iso(addDays(ci,-between(3,90))),iso(ci),iso(co),nights,between(1,beds*2),rate,clean,pf,status==='Cancelled'?0:gross-pf,status];
    bookings.push(row);if(status==='Completed')completed.push(row);
    day=co;
  }
}
// Reviews
const good={clean:['Spotless and well stocked.','Very clean, felt like home.'],loc:['Perfect location, walked everywhere.','Great spot, close to everything.'],comm:['Host replied within minutes.','Check-in instructions were clear and easy.'],beds:['Beds were super comfortable.'],value:['Great value for the size.']};
const bad={hot:['The AC could not keep up, it was too hot to sleep.','Air conditioning broke on day two, very uncomfortable.','House was hot all afternoon, AC barely worked.'],
 wifi:['Wifi kept dropping, hard to work remotely.','Internet was very slow.'],tub:['Hot tub was not working.','Hot tub was cold and dirty.'],
 checkin:['Lockbox code did not work, waited 40 minutes.'],clean:['Bathroom was not clean when we arrived.','Found sand and crumbs everywhere.'],noise:['Street noise late at night.']};
const reviews=[['review_id','booking_id','property','review_date','rating','comment']];let rid=1;
for(const b of completed){
  if(rnd()>.48)continue;const name=b[1];let theme,rating;const r=rnd();
  if(name==='Driftwood Bungalow'&&r<.5){theme=pick(bad.hot);rating=between(2,3);}
  else if(name==='Pine Ridge Cabin'&&r<.4){theme=pick(rnd()<.5?bad.wifi:bad.tub);rating=between(2,4);}
  else if(name.includes('Old Town')&&r<.25){theme=pick(bad.noise);rating=between(3,4);}
  else if(r<.1){const k=pick(['checkin','clean']);theme=pick(bad[k]);rating=between(2,3);}
  else{theme=pick(good[pick(Object.keys(good))])+(rnd()<.4?' '+pick(good[pick(Object.keys(good))]):'');rating=rnd()<.75?5:4;}
  reviews.push(['R'+rid++,b[0],name,iso(addDays(new Date(b[7]+'T00:00:00Z'),between(1,6))),rating,theme]);
}
// Maintenance tickets
const vendors={HVAC:[['Coastal Climate Co.',1.45],['Reliable Heating & Air',1.0]],Plumbing:[['FlowRight Plumbing',1.0],['Harbor Plumbing',1.1]],
 Appliances:[['ApplianceDoc',1.0]],Electrical:[['BrightLine Electric',1.0]],'Pool & hot tub':[['Blue Water Pools',1.0]],'Locks & access':[['KeySafe Locksmith',1.0]],
 'General repair':[['In-house team',.4],['HandyPros',1.0]],Pest:[['Shield Pest Control',1.0]]};
const baseCost={HVAC:420,Plumbing:260,Appliances:220,Electrical:240,'Pool & hot tub':310,'Locks & access':120,'General repair':150,Pest:180};
const issues={HVAC:['AC not cooling','AC unit leaking','Thermostat not responding'],Plumbing:['Clogged drain','Leaking faucet','Toilet running'],Appliances:['Dishwasher not draining','Fridge too warm','Washer error code'],
 Electrical:['Outlet not working','Lights flickering'],'Pool & hot tub':['Hot tub not heating','Pool pump noise','Hot tub cloudy water'],'Locks & access':['Smart lock offline','Lockbox code reset'],'General repair':['Loose railing','Screen door torn','Drywall patch'],Pest:['Ants in kitchen','Quarterly pest treatment']};
const tickets=[['ticket_id','property','opened','closed','days_open','category','issue','priority','vendor','cost','status']];let tid=1;
function ticket(name,cat,when){
  const [v,mult]=pick(vendors[cat]);const opened=when;const days=between(0,cat==='HVAC'?6:14)+(rnd()<.08?between(15,30):0);
  const closedD=addDays(opened,days);const open=closedD>d(2026,9,30);
  tickets.push(['T'+String(tid++).padStart(4,'0'),name,iso(opened),open?'':iso(closedD),open?'':days,cat,pick(issues[cat]),cat==='HVAC'||cat==='Locks & access'?pick(['High','High','Medium']):pick(['Low','Medium','Medium','High']),v,Math.round(baseCost[cat]*mult*(.7+rnd()*.7)),open?'Open':'Closed']);
}
const cats=Object.keys(baseCost);
for(const [name] of props){const n=between(14,24);for(let i=0;i<n;i++)ticket(name,pick(cats),addDays(d(2026,4,1),between(0,182)));}
for(let i=0;i<16;i++)ticket('Driftwood Bungalow','HVAC',addDays(d(2026,4,1),between(0,182)));
for(let i=0;i<10;i++)ticket('Pine Ridge Cabin','Pool & hot tub',addDays(d(2026,4,1),between(0,182)));
tickets.splice(1,tickets.length-1,...tickets.slice(1).sort((a,b)=>a[2]<b[2]?-1:1).map((t,i)=>(t[0]='T'+String(i+1).padStart(4,'0'),t)));

const out=path.join(__dirname,'..','data');
fs.writeFileSync(path.join(out,'bookings.csv'),csv(bookings));
fs.writeFileSync(path.join(out,'guest-reviews.csv'),csv(reviews));
fs.writeFileSync(path.join(out,'maintenance-tickets.csv'),csv(tickets));
console.log('bookings',bookings.length-1,'reviews',reviews.length-1,'tickets',tickets.length-1);
