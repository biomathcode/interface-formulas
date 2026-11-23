(() => {
'use strict';
const recipes = window.RECIPES;
const categories = [ ['padding','Padding & spacing'], ['typography','Typography'], ['button','Buttons'], ['icon-button','Icon buttons'], ['card','Cards & surfaces'], ['layout','Layout primitives'] ];
const byId = Object.fromEntries(recipes.map(r=>[r.id,r]));
const nav = document.getElementById('recipe-nav'), page = document.getElementById('page-content'), right = document.getElementById('right-content'), search = document.getElementById('search');
let query='', activeFilter='all', current='intro', controls={a:12,b:8,c:16}, showGuides=true;
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = category => categories.find(c=>c[0]===category)?.[1] || category;
const compactName = category => ({padding:'Spacing',typography:'Type',button:'Button','icon-button':'Icon button',card:'Card',layout:'Layout'})[category];
function icon(kind){return ({arrow:'<path d="M5 10h10m-4-4 4 4-4 4"/>',square:'<rect x="4" y="4" width="12" height="12" rx="3"/>',chevron:'<path d="m7 5 5 5-5 5"/>'})[kind]||''}
function categoryArt(cat, big=false) {
 const start=`<svg viewBox="0 0 280 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`, end='</svg>';
 const line='#b6b3a9',soft='#e7e5dc',color='#ce785f';
 if(cat==='padding')return start+`<rect x="77" y="9" width="126" height="92" rx="20" stroke="${line}" stroke-width="1.3"/><rect x="96" y="28" width="88" height="54" rx="9" stroke="${color}" stroke-width="1.4"/><path d="M77 16H96M77 13v6M96 13v6M203 51h28m-6-5 6 5-6 5" stroke="${soft}"/><path d="M77 52h19m-15-4-4 4 4 4m11-8 4 4-4 4" stroke="${color}"/><text x="83" y="43" fill="${color}" font-size="8">8px</text>`+end;
 if(cat==='typography')return start+`<path d="M23 86h234" stroke="${soft}"/><text x="31" y="81" fill="#34332e" font-family="Georgia,serif" font-size="18">Aa</text><text x="103" y="81" fill="#34332e" font-family="Georgia,serif" font-size="29">Aa</text><text x="184" y="81" fill="#34332e" font-family="Georgia,serif" font-size="45">Aa</text><path d="M31 39v-8m77 8V21m88 18V8" stroke="${color}"/><path d="M31 32h165" stroke="${color}" stroke-dasharray="2 5"/><text x="89" y="23" font-size="9" fill="${color}">× 1.25</text>`+end;
 if(cat==='button')return start+`<rect x="71" y="30" width="138" height="49" rx="9" fill="#f9f8f5" stroke="${line}"/><text x="140" y="59" fill="#33332f" text-anchor="middle" font-size="12">Continue →</text><path d="M59 30v49m-4-49h8m-8 49h8M71 87h138m-138-4v8m138-8v8" stroke="${color}"/><text x="42" y="59" fill="${color}" font-size="8" transform="rotate(-90 42 59)">48px</text>`+end;
 if(cat==='icon-button')return start+`<rect x="106" y="18" width="68" height="68" rx="13" stroke="${line}" stroke-dasharray="4 4"/><rect x="117" y="29" width="46" height="46" rx="9" fill="#fbfaf7" stroke="${line}"/><path d="M133 52h14m-7-7v14" stroke="${color}" stroke-width="2" stroke-linecap="round"/><path d="M106 92h68m-68-3v6m68-6v6" stroke="${color}"/><text x="140" y="104" font-size="8" fill="${color}" text-anchor="middle">44px target</text>`+end;
 if(cat==='card')return start+`<rect x="67" y="6" width="145" height="98" rx="13" fill="#fff" stroke="${line}"/><rect x="80" y="19" width="119" height="46" rx="7" fill="#f2f1ec" stroke="${soft}"/><path d="M84 78h73m-73 9h94" stroke="${soft}" stroke-width="5" stroke-linecap="round"/><path d="M67 8h13m-13 5v-5m0 49h13m-13 0v-5" stroke="${color}"/><text x="71" y="37" font-size="7" fill="${color}">13px</text>`+end;
 return start+`<rect x="26" y="16" width="66" height="78" rx="5" stroke="${line}"/><rect x="107" y="16" width="66" height="78" rx="5" stroke="${line}"/><rect x="188" y="16" width="66" height="78" rx="5" stroke="${line}"/><path d="M92 53h15m66 0h15" stroke="${color}" stroke-width="1.2"/><path d="m102 49 5 4-5 4m81-8 5 4-5 4" stroke="${color}"/>`+end;
}
function renderNav() {
 document.getElementById('sidebar-count').textContent=String(recipes.length).padStart(2,'0');
 const matching=recipes.filter(r=>`${r.name} ${r.category} ${r.formula} ${r.why}`.toLowerCase().includes(query.toLowerCase()));
 nav.innerHTML=categories.map(([cat,label])=>{
 const rs=matching.filter(r=>r.category===cat);if(!rs.length)return '';
 return `<section class="nav-group"><button class="group-label" data-filter="${cat}"><span>${label}</span><span class="group-count">${String(rs.length).padStart(2,'0')}</span></button>${rs.map(r=>`<button class="nav-item ${current===r.id?'active':''}" data-id="${r.id}" title="${esc(r.name)}"><span class="nav-id">${r.id.slice(3)}</span><span>${esc(r.name)}</span></button>`).join('')}</section>`;
 }).join('') || '<div class="empty">No matching formulas.</div>';
 nav.querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.id)));
 nav.querySelectorAll('[data-filter]').forEach(el=>el.addEventListener('click',()=>{activeFilter=el.dataset.filter;navigate('intro');}));
}
function home(){
 const featured=[byId['UI-001'],byId['UI-009'],byId['UI-017'],byId['UI-025']];
 page.innerHTML=`<div class="content-wrap">
 <section class="hero"><div class="kicker"><span class="red-dot"></span> A SMALL FIELD GUIDE TO DESIGN ENGINEERING <span> / VOL. 01</span></div><h1>Good interfaces<br/>are <span class="italic">in the details.</span></h1><p class="hero-summary">A collection of practical formulas for the little decisions that make interfaces feel considered. Less guesswork, more intention. Adjust the numbers, see what changes, and understand why.</p><div class="hero-meta"><span><strong>45</strong> field-tested recipes</span><span class="line"></span><span><strong>06</strong> chapters</span><span class="line"></span><span>CSS · Geometry · Perception</span></div></section>
 <section id="featured"><div class="intro-heading"><h2>Start with the small things</h2><span>01 — 04</span></div><div class="featured-list">${featured.map(r=>`<button class="featured" data-id="${r.id}"><div class="featured-top"><span>${r.id} / ${compactName(r.category)}</span><span>↗</span></div><div class="featured-art">${categoryArt(r.category)}</div><div class="featured-bottom"><h3>${esc(r.name)}</h3><p>${esc(r.why)}</p></div></button>`).join('')}</div></section>
 <section class="section-intro" id="all-recipes"><h2>The index.</h2><p>Six chapters, forty-five practical rules. Each one pairs an explanation with an adjustable diagram, copyable CSS, and its original reference. These are working heuristics, not immutable laws.</p><div class="category-row">${[['all','All recipes'],...categories].map(([key,label])=>`<button class="category-pill ${activeFilter===key?'active':''}" data-home-filter="${key}">${label}</button>`).join('')}</div><div class="index-table" id="index-table"></div></section>
 </div>`;
 page.querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.id)));
 page.querySelectorAll('[data-home-filter]').forEach(el=>el.addEventListener('click',()=>{activeFilter=el.dataset.homeFilter;page.querySelectorAll('[data-home-filter]').forEach(b=>b.classList.toggle('active',b.dataset.homeFilter===activeFilter));renderIndex();}));
 renderIndex();
 right.innerHTML=`<div class="right-sticky"><div class="right-label">ON THIS PAGE</div><a class="right-link current" href="#featured">A place to begin</a><a class="right-link" href="#all-recipes">All formulas</a><div class="right-divider"></div><div class="right-label">THE IDEA</div><p class="right-note">An interactive reference for the rules behind comfortable interfaces. Explore every value; copy what works.</p><div class="right-divider"></div><p class="right-note">Influenced by design-engineering writing from <a href="https://jakub.kr/writing/details-that-make-interfaces-feel-better" target="_blank" rel="noopener noreferrer">Jakub Krehel ↗</a> and other cited practitioners. Independent project.</p></div>`;
}
function renderIndex(){
 const matching=recipes.filter(r=>(activeFilter==='all'||r.category===activeFilter)&&`${r.name} ${r.category} ${r.formula} ${r.why}`.toLowerCase().includes(query.toLowerCase()));
 const table=document.getElementById('index-table'); if(!table)return;
 table.innerHTML=matching.map(r=>`<button class="index-row" data-id="${r.id}"><span class="number">${r.id}</span><span class="index-name">${esc(r.name)}</span><span class="index-category">${slug(r.category)}</span><span class="arrow">↗</span></button>`).join('')||'<div class="empty">No matching recipes. Try another search.</div>';
 table.querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.id)));
}
function setupControls(r){
 const cat=r.category;
 if(cat==='padding'||cat==='card')return [{key:'a',label:'Inner radius',min:2,max:32,step:1,value:12,unit:'px'},{key:'b',label:'Padding',min:4,max:36,step:1,value:12,unit:'px'},{key:'c',label:'Content width',min:120,max:220,step:2,value:180,unit:'px'}];
 if(cat==='typography')return [{key:'a',label:'Base size',min:12,max:24,step:1,value:16,unit:'px'},{key:'b',label:'Scale ratio',min:105,max:150,step:1,value:125,unit:'%'},{key:'c',label:'Measure',min:180,max:340,step:5,value:260,unit:'px'}];
 if(cat==='button')return [{key:'a',label:'Font size',min:12,max:21,step:1,value:14,unit:'px'},{key:'b',label:'Vertical inset',min:4,max:19,step:1,value:12,unit:'px'},{key:'c',label:'Horizontal inset',min:10,max:34,step:1,value:22,unit:'px'}];
 if(cat==='icon-button')return [{key:'a',label:'Target size',min:32,max:68,step:1,value:44,unit:'px'},{key:'b',label:'Icon size',min:12,max:32,step:1,value:20,unit:'px'},{key:'c',label:'Corner radius',min:3,max:20,step:1,value:10,unit:'px'}];
 return [{key:'a',label:'Gap',min:4,max:32,step:1,value:16,unit:'px'},{key:'b',label:'Item width',min:60,max:145,step:1,value:100,unit:'px'},{key:'c',label:'Columns',min:2,max:4,step:1,value:3,unit:''}];
}
function svgText(x,y,s,anchor='middle',color='#b96d54',size=11){return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}" font-family="ui-monospace,monospace">${esc(s)}</text>`}
function line(x1,y1,x2,y2,color='#c97659',dash=''){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1" ${dash?'stroke-dasharray="3 4"':''}/>`}
function measureH(x1,x2,y,label){return `<g>${line(x1,y,x2,y)}${line(x1,y-5,x1,y+5)}${line(x2,y-5,x2,y+5)}${svgText((x1+x2)/2,y-9,label)}</g>`}
function measureV(x,y1,y2,label){return `<g>${line(x,y1,x,y2)}${line(x-5,y1,x+5,y1)}${line(x-5,y2,x+5,y2)}${svgText(x-10,(y1+y2)/2+4,label,'end')}</g>`}
function scene(r){
 const {a,b,c}=controls, g=showGuides, cat=r.category;
 let art='';
 if(cat==='padding'||cat==='card'){
  const w=Math.min(370,c+90),h=190, x=(520-w)/2,y=33,outer=a+b,innerW=w-b*2,innerH=h-b*2;
  art=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${outer}" fill="#ffffff" stroke="#b9b7af" stroke-width="1.35"/><rect x="${x+b}" y="${y+b}" width="${innerW}" height="${innerH}" rx="${a}" fill="#eaeae5" stroke="#c4c2b8" stroke-width="1"/>`;
  if(cat==='card')art+=`<rect x="${x+b+15}" y="${y+b+20}" width="${innerW-30}" height="56" rx="${Math.max(4,a-3)}" fill="#dbddd7"/><path d="M${x+b+15} ${y+b+101} h${innerW*.57}" stroke="#b8bab2" stroke-width="7" stroke-linecap="round"/><path d="M${x+b+15} ${y+b+120} h${innerW*.75}" stroke="#d1d3cc" stroke-width="5" stroke-linecap="round"/>`;
  if(cat==='padding')art+=`<text x="260" y="137" fill="#74736b" text-anchor="middle" font-size="14" font-family="Georgia,serif">A little room to breathe.</text>`;
  if(g)art+=measureH(x,x+b,y+90,`${b}px`)+measureV(x+w+19,y,y+h,`${h}px`)+`${svgText(x+outer+2,y+10,`R ${outer}px`,'start')}${svgText(x+b+a+5,y+b+13,`r ${a}px`,'start')}`;
 }
 if(cat==='typography'){
  const ratio=b/100,large=Math.min(48,a*ratio*ratio),mid=Math.round(a*ratio),xx=75;
  art=`<rect x="44" y="26" width="432" height="192" rx="9" fill="#fff" stroke="#e2e1da"/><text x="${xx}" y="95" fill="#363630" font-size="${large}" font-family="Georgia,serif" letter-spacing="-2">Thoughtful type.</text><text x="${xx}" y="137" fill="#55544e" font-size="${mid}" font-family="Georgia,serif">Clear, measured hierarchy.</text><text x="${xx}" y="168" fill="#84827b" font-size="${a}" font-family="ui-sans-serif,sans-serif">Small decisions add up.</text>`;
  if(g)art+=measureV(52,95-large*.76,95,`${Math.round(large)}px`)+measureH(xx,xx+c,188,`${c}px measure`)+`${line(xx+c,39,xx+c,179,'#c97659',true)}`;
 }
 if(cat==='button'){
  const f=a, height=f*1.4+2*b+2, w=155+2*c, x=(520-w)/2,y=(246-height)/2;
  art=`<rect x="${x}" y="${y}" width="${w}" height="${height}" rx="9" fill="#34342f"/><text x="260" y="${y+height/2+f*.32}" fill="#fff" font-size="${f}" text-anchor="middle" font-family="ui-sans-serif,sans-serif">Continue <tspan fill="#d8d5cc">→</tspan></text>`;
  if(g)art+=measureV(x-23,y,y+height,`${Math.round(height)}px`)+measureH(x,x+c,y+height+24,`${c}px`)+measureV(x+w+16,y,y+b,`${b}px`);
 }
 if(cat==='icon-button'){
  const size=a*2.4, icon=b*2.4,x=(520-size)/2,y=(246-size)/2;
  const tX=260-icon/2,tY=123-icon/2;
  art=`<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${c*2.4}" fill="#fff" stroke="#aaa89e" stroke-dasharray="4 5"/><rect x="${x+(size-icon-22)/2}" y="${y+(size-icon-22)/2}" width="${icon+22}" height="${icon+22}" rx="${Math.min(c*2.4,18)}" fill="#efeee9" stroke="#bdbbb0"/><g stroke="#44433d" stroke-width="2.5" stroke-linecap="round"><path d="M${260-icon*.29} 123h${icon*.58}"/><path d="M260 ${123-icon*.29}v${icon*.58}"/></g>`;
  if(g)art+=measureH(x,x+size,y-14,`${a}px target`)+measureH(tX,tX+icon,123+icon/2+14,`${b}px icon`);
 }
 if(cat==='layout'){
  const cols=c, gap=b, item=a, total=cols*item+(cols-1)*gap, x=(520-total)/2,y=61;
  for(let i=0;i<cols;i++){const xx=x+i*(item+gap);art+=`<rect x="${xx}" y="${y}" width="${item}" height="105" rx="8" fill="#fff" stroke="#c3c1b8"/><rect x="${xx+10}" y="${y+10}" width="${Math.max(10,item-20)}" height="42" rx="4" fill="#eaeae5"/>`;
  if(g && i<cols-1)art+=measureH(xx+item,xx+item+gap,y+78,`${gap}px`);
  }
  if(g)art+=measureH(x,x+total,193,`${total}px total`);
 }
 return `<svg viewBox="0 0 520 246" role="img" aria-label="Adjustable diagram for ${esc(r.name)}, with ${g?'visible':'hidden'} measurements">${art}</svg>`;
}
function article(r){
 const n=recipes.indexOf(r),dims=setupControls(r);controls=Object.fromEntries(dims.map(d=>[d.key,d.value]));showGuides=true;
 const source=(()=>{try {return new URL(r.source_url).hostname.replace(/^www\./,'')}catch {return 'Source'}})();
 const evid=r.evidence_type==='derived'?'Derived design heuristic':'Documented technique';
 const intro= `The idea is simple: ${r.why.charAt(0).toLowerCase()}${r.why.slice(1)} It is a starting relationship, not a rule you should follow blindly. Look at the example, change the values, and notice what happens to the balance.`;
 page.innerHTML=`<div class="content-wrap">
 <header class="article-head"><div class="breadcrumb"><a href="#intro">The index</a><span>/</span><span>${slug(r.category)}</span><span>/</span><span>${r.id}</span></div><h1>${esc(r.name)}<span style="color:#c0bdb3">.</span></h1><p class="article-dek">${esc(r.why)}</p><div class="article-meta"><span class="pill">${slug(r.category)}</span><span>${r.id} / ${String(recipes.length).padStart(2,'0')}</span><span>·</span><span>${evid}</span></div></header>
 <section class="article-section" id="principle"><h2 class="numbered-title"><span>01</span> The principle</h2><p class="body-copy">${esc(intro)}</p><div class="formula-callout"><div class="small">THE RELATIONSHIP</div><div class="formula">${esc(r.formula)}</div><div class="formula-note">Use the relationship to guide your choices, then check the result visually.</div></div><p class="body-copy">A good interface rarely depends on a single magic number. What matters is how one value relates to another. When these relationships stay consistent, components feel like they belong together.</p></section>
 <section class="article-section" id="experiment"><h2 class="numbered-title"><span>02</span> See the difference</h2><p class="body-copy">Change the values below. The drawing responds instantly, including its measurements. Turn off the guides to judge the shape without the extra information.</p><div class="demo-shell"><div class="demo-toolbar"><div class="demo-toolbar-left"><span class="traffic"><i></i><i></i><i></i></span><span class="demo-label">interactive / ${r.id.toLowerCase()}</span></div><div class="demo-toolbar-right"><button id="reset-values" class="minor-button" type="button">↺ Reset</button><button id="toggle-guides" class="minor-button is-on" type="button">⌗ Guides</button></div></div><div class="demo-stage"><div class="live-illustration" id="live-scene"></div><span class="stage-tag">LIVE GEOMETRY / NOT TO SCALE</span></div><div class="demo-controls" id="demo-controls">${dims.map(d=>`<label class="control-row"><span class="control-label">${esc(d.label)}</span><input type="range" min="${d.min}" max="${d.max}" step="${d.step}" value="${d.value}" data-key="${d.key}" aria-label="${esc(d.label)}"/><output class="control-val" id="out-${d.key}">${d.value}${d.unit}</output></label>`).join('')}</div><div class="demo-caption"><span><strong>Try it.</strong> Move the controls to see how small changes affect the result.</span><span class="toggle-row">Show values <button id="guide-toggle" class="toggle on" aria-label="Show measurement guides" aria-pressed="true"></button></span></div></div></section>
 <section class="article-section" id="implementation"><h2 class="numbered-title"><span>03</span> Put it to work</h2><p class="body-copy">There is no need for a complicated abstraction. Start with the smallest useful CSS rule, keep related numbers together, and make the intent visible in the code.</p><div class="code-head"><span>example.css</span><button class="copy-code" id="copy-css" type="button">Copy CSS ↗</button></div><pre class="code-block"><code>${esc(r.css)}</code></pre><p class="footnote">This snippet is a compact reference, not necessarily a complete component. Adjust naming, sizing and accessibility to your application.</p></section>
 <section class="article-section" id="details"><h2 class="numbered-title"><span>04</span> The finer point</h2><p class="body-copy">${esc(r.caveat)} In real interfaces, font metrics, border widths, display density, and the surrounding composition can all affect what feels right. Treat the formula as a useful constraint, then make an optical adjustment if the result calls for it.</p><div class="article-intro-pair"><div class="info-chip"><div class="key">USE THIS WHEN</div><div class="value">Building ${compactName(r.category).toLowerCase()} systems that need predictable, repeatable values.</div></div><div class="info-chip"><div class="key">REMEMBER</div><div class="value">Consistency is a tool. Good judgment still matters.</div></div></div></section>
 <section class="article-section" id="references"><h2 class="numbered-title"><span>05</span> Further reading</h2><p class="body-copy">These recipes are indexed from published work by designers, engineers, and maintainers. This record is marked as <strong>${evid.toLowerCase()}</strong>; derived recipes extend a source rather than quote it as a literal formula.</p><div class="source-box"><div class="source-icon">↗</div><div><h3>${esc(r.source_author)}</h3><p>Original reference · ${esc(source)}</p><a href="${esc(r.source_url)}" target="_blank" rel="noopener noreferrer">${esc(r.source_url)} ↗</a></div></div></section>
 <nav class="next-prev" aria-label="Adjacent recipes"><button data-id="${recipes[(n-1+recipes.length)%recipes.length].id}"><small>← PREVIOUS RECIPE</small><strong>${esc(recipes[(n-1+recipes.length)%recipes.length].name)}</strong></button><button data-id="${recipes[(n+1)%recipes.length].id}"><small>NEXT RECIPE →</small><strong>${esc(recipes[(n+1)%recipes.length].name)}</strong></button></nav>
 </div>`;
 right.innerHTML=`<div class="right-sticky"><div class="right-label">IN THIS RECIPE</div>${[['principle','The principle'],['experiment','Interactive example'],['implementation','The CSS'],['details','Finer details'],['references','Further reading']].map(([id,label])=>`<a class="right-link" href="#${id}">${label}</a>`).join('')}<div class="right-divider"></div><div class="right-label">AT A GLANCE</div><p class="right-note">${r.id}<br>${slug(r.category)}<br>${evid}</p><div class="right-divider"></div><a class="right-link" href="#intro">← All formulas</a></div>`;
 const draw=()=>{document.getElementById('live-scene').innerHTML=scene(r);document.getElementById('toggle-guides').classList.toggle('is-on',showGuides);document.getElementById('guide-toggle').classList.toggle('on',showGuides);document.getElementById('guide-toggle').setAttribute('aria-pressed',String(showGuides))};
 draw();
 page.querySelectorAll('input[data-key]').forEach(el=>el.addEventListener('input',()=>{controls[el.dataset.key]=Number(el.value);const d=dims.find(x=>x.key===el.dataset.key);document.getElementById(`out-${el.dataset.key}`).textContent=el.value+d.unit;draw()}));
 document.getElementById('reset-values').addEventListener('click',()=>{dims.forEach(d=>{controls[d.key]=d.value;const el=page.querySelector(`input[data-key="${d.key}"]`);el.value=d.value;document.getElementById(`out-${d.key}`).textContent=d.value+d.unit});draw()});
 const toggle=()=>{showGuides=!showGuides;draw()};document.getElementById('toggle-guides').addEventListener('click',toggle);document.getElementById('guide-toggle').addEventListener('click',toggle);
 document.getElementById('copy-css').addEventListener('click',async(e)=>{try{await navigator.clipboard.writeText(r.css);e.currentTarget.textContent='Copied ✓';setTimeout(()=>{if(e.currentTarget.isConnected)e.currentTarget.textContent='Copy CSS ↗'},1600)}catch{e.currentTarget.textContent='Select code to copy'}});
 page.querySelectorAll('[data-id]').forEach(el=>el.addEventListener('click',()=>navigate(el.dataset.id)));
}
function navigate(id, updateHash=true){
 current=byId[id]?id:'intro';if(updateHash && location.hash.slice(1)!==current)history.pushState(null,'','#'+current);
 if(current==='intro')home();else article(byId[current]);renderNav();window.scrollTo({top:0,behavior:'instant'});
 document.title=current==='intro'?'Interface Formulas — A design engineering field guide':`${byId[current].name} — Interface Formulas`;
}
search.addEventListener('input',e=>{query=e.target.value;renderNav();if(current!=='intro')navigate('intro');else renderIndex()});
const focusSearch=()=>{search.focus();search.select()};document.getElementById('search-shortcut').addEventListener('click',focusSearch);
window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'||(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))){e.preventDefault();focusSearch()}if(e.key==='Escape'&&document.activeElement===search){search.blur()}});
window.addEventListener('popstate',()=>navigate(decodeURIComponent(location.hash.slice(1)),false));
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1));if(id!==current && (id==='intro'||byId[id]))navigate(id,false)});
navigate(decodeURIComponent(location.hash.slice(1)),false);
})();
