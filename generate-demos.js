/**
 * generate-demos.js
 * Generates demos.html — a premium tool-centric gallery with version history.
 * Each top-level folder = one tool card. HTML files inside = versions.
 * Run: node generate-demos.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT   = __dirname;
const OUTPUT = path.join(ROOT, 'demos.html');
const SHOTS  = path.join(ROOT, 'public', 'screenshots');

const SKIP = new Set([
  'node_modules','.git','screenshots','.github',
  'dist','public','about','tools','paper-animator','svg-animator'
]);

const FOLDER_META = {
  'design-demos':           { label:'Animation Lab',          icon:'🧪', cat:'lab',         color:'#10b981' },
  'Borads':                 { label:'Whiteboard Engines',      icon:'📋', cat:'boards',      color:'#3b82f6' },
  '_templates':             { label:'Independent Animators',   icon:'🎬', cat:'templates',   color:'#a855f7' },
  '_demos':                 { label:'Demo Showcases',          icon:'🎯', cat:'demos',       color:'#f59e0b' },
  'yt-experiments':         { label:'YT Experiments',          icon:'📺', cat:'experiments', color:'#ef4444' },
  'motion canvas animator': { label:'Motion Canvas Editor',    icon:'🎞️', cat:'editors',    color:'#06b6d4' },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function versionOf(filename) {
  const b = filename.replace('.html','');
  let m = b.match(/^(v[\d.]+)/i);
  if (m) return m[1];
  m = b.match(/[_-](v[\d.]+)/i);
  if (m) return m[1];
  return b.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

function descOf(filename) {
  const b = filename.replace('.html','');
  return b.replace(/^v[\d.]+-?/i,'').replace(/[_-]+/g,' ').trim();
}

function shotExists(relDir, filename) {
  return fs.existsSync(path.join(SHOTS, relDir, filename.replace('.html','.png')));
}

function shotSrc(relDir, filename) {
  const rel = relDir ? `${relDir}/` : '';
  return `./screenshots/${rel}${filename.replace('.html','.png')}`;
}

function numSort(a,b) {
  const va = parseFloat((a.ver||'0').replace(/[^0-9.]/g,''))||0;
  const vb = parseFloat((b.ver||'0').replace(/[^0-9.]/g,''))||0;
  return va - vb;
}

// ── scanner ──────────────────────────────────────────────────────────────────

function scanVersions(dir, relDir) {
  const entries = fs.readdirSync(dir, { withFileTypes:true });
  const vers = [];
  const subs = [];

  for (const e of entries) {
    if (e.name === 'index.html') continue;
    if (e.isDirectory()) {
      const r = scanVersions(path.join(dir,e.name), relDir ? `${relDir}/${e.name}` : e.name);
      if (r.vers.length || r.subs.length) subs.push({ name:e.name, relDir:`${relDir||''}/${e.name}`.replace(/^\//,''), ...r });
    } else if (e.name.endsWith('.html')) {
      vers.push({
        file: e.name,
        ver:  versionOf(e.name),
        desc: descOf(e.name),
        href: relDir ? `${relDir}/${e.name}` : e.name,
        shot: shotExists(relDir||'', e.name) ? shotSrc(relDir||'', e.name) : null
      });
    }
  }
  vers.sort(numSort);
  return { vers, subs };
}

function scanTools() {
  const tools = [];
  for (const e of fs.readdirSync(ROOT, { withFileTypes:true })) {
    if (!e.isDirectory() || SKIP.has(e.name)) continue;
    const { vers, subs } = scanVersions(path.join(ROOT, e.name), e.name);
    if (!vers.length && !subs.length) continue;

    const starred = e.name.includes('⭐');
    const failed  = e.name.includes('🚫') || e.name.includes('❌');
    const meta    = FOLDER_META[e.name] || {};
    const cleanName = e.name.replace(/[⭐🚫❌✅]/g,'').trim();

    tools.push({
      name: cleanName,
      starred, failed,
      icon:  meta.icon  || (starred ? '⭐' : '🔧'),
      color: meta.color || '#6366f1',
      cat:   starred ? 'flagship' : (meta.cat || 'tools'),
      label: meta.label || cleanName,
      vers, subs,
      total: vers.length + subs.reduce((a,s)=>a+s.vers.length,0),
      latest: vers[vers.length-1] || (subs[0]?.vers[subs[0].vers.length-1]) || null
    });
  }
  return tools.sort((a,b) => {
    if (a.failed !== b.failed) return a.failed ? 1 : -1;
    if (a.starred !== b.starred) return a.starred ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

// ── render ────────────────────────────────────────────────────────────────────

function pill(v) {
  return `<a href="${v.href}" class="vpill" target="_blank" title="${v.desc||v.ver}">${v.ver}</a>`;
}

function subRow(s) {
  const latestHref = s.vers[s.vers.length-1]?.href || '#';
  return `<div class="sub-row">
    <span class="sub-name">${s.name.replace(/[-_]/g,' ')}</span>
    <span class="sub-count">${s.vers.length}v</span>
    <div class="sub-pills">${s.vers.map(pill).join('')}</div>
    <a class="sub-open" href="${latestHref}" target="_blank">↗</a>
  </div>`;
}

function card(t) {
  const thumb = t.latest?.shot
    ? `<img src="${t.latest.shot}" alt="${t.name}" loading="lazy">`
    : `<div class="thumb-placeholder" style="--tc:${t.color}">${t.icon}</div>`;

  const latestHref = t.latest?.href || '#';
  const latestLabel = t.latest?.ver || '';

  const versSection = t.vers.length
    ? `<div class="ver-pills">${t.vers.map(pill).join('')}</div>`
    : '';

  const subsSection = t.subs.length
    ? `<div class="sub-list">${t.subs.map(subRow).join('')}</div>`
    : '';

  return `<article class="card" data-cat="${t.cat}" data-name="${t.name.toLowerCase()}" data-starred="${t.starred}" ${t.failed?'data-failed="1"':''}>
  <div class="thumb">
    ${thumb}
    ${latestLabel ? `<span class="latest-badge">${latestLabel}</span>` : ''}
    ${t.starred ? '<span class="star-badge">⭐</span>' : ''}
  </div>
  <div class="body">
    <div class="card-top">
      <h2 class="card-title">${t.name}</h2>
      <span class="ver-count">${t.total} ver</span>
    </div>
    ${versSection}${subsSection}
    <div class="card-foot">
      <a class="btn-open" href="${latestHref}" target="_blank">Open Latest <span>↗</span></a>
    </div>
  </div>
</article>`;
}

// ── full page ─────────────────────────────────────────────────────────────────

function generateHTML(tools) {
  const total    = tools.reduce((a,t)=>a+t.total,0);
  const buildDate = new Date().toLocaleDateString('en-US',{ year:'numeric',month:'short',day:'numeric' });
  const cards    = tools.map(card).join('\n');

  const cats = [
    { key:'all',        label:'All' },
    { key:'flagship',   label:'⭐ Flagship' },
    { key:'editors',    label:'🎞️ Editors' },
    { key:'lab',        label:'🧪 Lab' },
    { key:'boards',     label:'📋 Boards' },
    { key:'templates',  label:'🎬 Templates' },
    { key:'experiments',label:'📺 Experiments' },
    { key:'demos',      label:'🎯 Demos' },
    { key:'tools',      label:'🔧 Tools' },
  ].map((c,i)=>`<button class="cat-btn${i===0?' active':''}" data-cat="${c.key}">${c.label}</button>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Animator Studio — Demos Gallery</title>
<meta name="description" content="All canvas animation tools, organized by tool with full version history.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* ── CapCut-style gray depth palette ── */
:root{
  /* Surface depth layers — each step ~8-10 lightness units apart */
  --d0:#0d0d0d;   /* absolute base */
  --d1:#141414;   /* page bg */
  --d2:#1c1c1c;   /* card surface */
  --d3:#242424;   /* card inner / sub-rows */
  --d4:#2e2e2e;   /* hover surface */
  --d5:#3a3a3a;   /* active / pressed */
  --d6:#4a4a4a;   /* muted elements */

  /* Borders */
  --b0:rgba(255,255,255,.05);
  --b1:rgba(255,255,255,.09);
  --b2:rgba(255,255,255,.16);

  /* Text */
  --t0:#ffffff;
  --t1:rgba(255,255,255,.82);
  --t2:rgba(255,255,255,.50);
  --t3:rgba(255,255,255,.30);

  /* Accent — CapCut violet/blue-purple */
  --a0:#7B61FF;
  --a1:#9D87FF;
  --a-dim:rgba(123,97,255,.18);

  --radius:14px;
  --radius-sm:8px;
  --radius-xs:5px;
}

html{color-scheme:dark;}
body{
  background:var(--d1);
  color:var(--t1);
  font-family:'Inter',sans-serif;
  min-height:100vh;
  line-height:1.55;
  -webkit-font-smoothing:antialiased;
}

/* ── Scrollbar ── */
::-webkit-scrollbar{width:6px;height:6px;}
::-webkit-scrollbar-track{background:var(--d1);}
::-webkit-scrollbar-thumb{background:var(--d5);border-radius:99px;}

/* ─────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────── */
.site-header{
  position:sticky;top:0;z-index:100;
  background:rgba(20,20,20,.92);
  backdrop-filter:blur(24px) saturate(1.4);
  -webkit-backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--b0);
  padding:.8rem 1.75rem;
}
.header-inner{
  max-width:1480px;margin:0 auto;
  display:flex;align-items:center;gap:1.1rem;flex-wrap:wrap;
}

/* Logo */
.logo{
  display:flex;align-items:center;gap:.5rem;flex-shrink:0;
}
.logo-mark{
  width:30px;height:30px;border-radius:8px;
  background:linear-gradient(135deg,var(--a0),#B476FF);
  display:flex;align-items:center;justify-content:center;
  font-size:.9rem;flex-shrink:0;
}
.logo-text{
  font-size:.95rem;font-weight:700;letter-spacing:-.02em;color:var(--t0);
}
.logo-sub{
  font-size:.72rem;font-weight:400;color:var(--t3);
  margin-top:.05rem;
}

/* Search */
.search-wrap{flex:1;max-width:360px;position:relative;}
.search-icon{
  position:absolute;left:.75rem;top:50%;transform:translateY(-50%);
  color:var(--t3);pointer-events:none;
}
#search{
  width:100%;padding:.52rem .75rem .52rem 2.2rem;
  background:var(--d3);border:1px solid var(--b1);border-radius:var(--radius-sm);
  color:var(--t0);font-family:inherit;font-size:.855rem;outline:none;
  transition:border-color .18s, background .18s;
}
#search:focus{border-color:var(--a0);background:var(--d4);}
#search::placeholder{color:var(--t3);}

/* Header right */
.header-right{margin-left:auto;display:flex;align-items:center;gap:.65rem;}
.stat-chip{
  font-size:.72rem;color:var(--t2);
  background:var(--d3);border:1px solid var(--b0);
  border-radius:99px;padding:.22rem .75rem;white-space:nowrap;
  font-variant-numeric:tabular-nums;
}
.stat-chip b{color:var(--t0);font-weight:600;}
.home-link{
  font-size:.78rem;font-weight:500;color:var(--t2);text-decoration:none;
  background:var(--d3);border:1px solid var(--b1);border-radius:var(--radius-sm);
  padding:.38rem .85rem;transition:all .18s;
}
.home-link:hover{color:var(--t0);background:var(--d4);border-color:var(--b2);}

/* ─────────────────────────────────────────────────────
   FILTER BAR
───────────────────────────────────────────────────── */
.filter-bar{
  max-width:1480px;margin:0 auto;
  padding:1rem 1.75rem .6rem;
  display:flex;gap:.4rem;flex-wrap:wrap;align-items:center;
  border-bottom:1px solid var(--b0);
}
.filter-label{font-size:.72rem;color:var(--t3);font-weight:500;margin-right:.2rem;text-transform:uppercase;letter-spacing:.06em;}
.cat-btn{
  padding:.32rem .8rem;border-radius:99px;font-size:.78rem;font-family:inherit;
  font-weight:500;cursor:pointer;transition:all .16s;
  border:1px solid var(--b0);
  background:transparent;color:var(--t2);white-space:nowrap;
}
.cat-btn:hover{color:var(--t0);background:var(--d3);border-color:var(--b1);}
.cat-btn.active{
  background:var(--a0);color:#fff;border-color:transparent;
  box-shadow:0 2px 12px rgba(123,97,255,.35);
}

/* ─────────────────────────────────────────────────────
   GRID
───────────────────────────────────────────────────── */
.grid-wrap{max-width:1480px;margin:0 auto;padding:1.25rem 1.75rem 5rem;}
#no-results{
  display:none;text-align:center;padding:5rem 0;
  color:var(--t3);font-size:.95rem;letter-spacing:.01em;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:1rem;
}

/* ─────────────────────────────────────────────────────
   CARD
───────────────────────────────────────────────────── */
.card{
  background:var(--d2);
  border:1px solid var(--b0);
  border-radius:var(--radius);
  overflow:hidden;
  display:flex;flex-direction:column;
  transition:transform .2s cubic-bezier(.22,.68,0,1.2),
             box-shadow .2s ease,
             border-color .2s ease;
  position:relative;
  /* Subtle inner-top highlight for depth */
  box-shadow:inset 0 1px 0 rgba(255,255,255,.04);
}
.card:hover{
  transform:translateY(-5px) scale(1.005);
  box-shadow:
    0 20px 50px rgba(0,0,0,.55),
    0 2px 0 rgba(255,255,255,.05) inset;
  border-color:var(--b2);
}
.card[data-starred="true"]{border-color:rgba(123,97,255,.2);}
.card[data-starred="true"]:hover{border-color:rgba(123,97,255,.5);box-shadow:0 20px 50px rgba(0,0,0,.5), 0 0 0 1px rgba(123,97,255,.2);}
.card[data-failed="1"]{opacity:.38;pointer-events:none;}

/* ── Thumbnail ── */
.thumb{
  position:relative;aspect-ratio:16/9;overflow:hidden;
  background:var(--d0);
}
.thumb img{
  width:100%;height:100%;object-fit:cover;
  transition:transform .5s cubic-bezier(.22,.68,0,1);
  display:block;
}
.card:hover .thumb img{transform:scale(1.05);}

/* gradient placeholder — layered grays for depth */
.thumb-placeholder{
  width:100%;height:100%;
  display:flex;align-items:center;justify-content:center;
  font-size:2.2rem;
  background:
    radial-gradient(ellipse at 25% 35%, var(--d4) 0%, var(--d1) 100%);
  position:relative;
}
.thumb-placeholder::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(160deg,
    color-mix(in srgb, var(--tc,#7B61FF) 12%, transparent) 0%,
    transparent 60%);
}

/* Badges */
.latest-badge{
  position:absolute;bottom:.55rem;right:.55rem;
  font-size:.62rem;font-family:'JetBrains Mono',monospace;font-weight:600;
  background:rgba(13,13,13,.8);backdrop-filter:blur(10px);
  color:var(--t0);border-radius:var(--radius-xs);padding:.14rem .48rem;
  border:1px solid var(--b1);letter-spacing:.02em;
}
.star-badge{
  position:absolute;top:.55rem;left:.55rem;font-size:.85rem;
  background:rgba(13,13,13,.7);backdrop-filter:blur(8px);
  border-radius:6px;padding:.12rem .38rem;
  border:1px solid rgba(255,255,255,.1);
}
/* Gradient shimmer on thumb top */
.thumb::after{
  content:'';position:absolute;top:0;left:0;right:0;height:40%;
  background:linear-gradient(to bottom, rgba(255,255,255,.025), transparent);
  pointer-events:none;
}

/* ── Card body ── */
.body{
  padding:.95rem 1.05rem 1.05rem;
  display:flex;flex-direction:column;gap:.65rem;
  flex:1;
}
.card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;}
.card-title{
  font-size:.9rem;font-weight:600;letter-spacing:-.015em;
  line-height:1.35;color:var(--t0);
}
.ver-count{
  font-size:.65rem;font-family:'JetBrains Mono',monospace;font-weight:500;
  color:var(--t3);flex-shrink:0;margin-top:.1rem;
  background:var(--d3);padding:.14rem .45rem;border-radius:var(--radius-xs);
  border:1px solid var(--b0);
}

/* ── Version pills ── */
.ver-pills{display:flex;flex-wrap:wrap;gap:.28rem;}
.vpill{
  font-size:.62rem;font-family:'JetBrains Mono',monospace;font-weight:500;
  padding:.16rem .46rem;border-radius:var(--radius-xs);text-decoration:none;
  background:var(--d3);color:var(--t2);border:1px solid var(--b0);
  transition:all .14s;letter-spacing:.01em;
}
.vpill:hover{background:var(--d5);color:var(--t0);border-color:var(--b1);}
/* Latest version — subtle accent */
.vpill:last-child{
  background:var(--a-dim);color:var(--a1);
  border-color:rgba(123,97,255,.25);
}
.vpill:last-child:hover{background:var(--a0);color:#fff;border-color:transparent;}

/* ── Sub-tool rows (Borads etc.) ── */
.sub-list{display:flex;flex-direction:column;gap:.4rem;}
.sub-row{
  display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
  padding:.5rem .6rem;
  background:var(--d3);border-radius:var(--radius-sm);
  border:1px solid var(--b0);
  /* Inner depth highlight */
  box-shadow:inset 0 1px 0 rgba(255,255,255,.03);
}
.sub-name{font-size:.78rem;font-weight:500;flex:1;min-width:80px;color:var(--t1);}
.sub-count{
  font-size:.6rem;font-family:'JetBrains Mono',monospace;color:var(--t3);
  flex-shrink:0;background:var(--d4);padding:.1rem .38rem;border-radius:4px;
}
.sub-pills{display:flex;flex-wrap:wrap;gap:.22rem;flex:1;}
.sub-open{
  font-size:.72rem;color:var(--t3);text-decoration:none;flex-shrink:0;
  transition:color .14s;padding:.1rem;
}
.sub-open:hover{color:var(--t0);}

/* Divider */
.divider{height:1px;background:var(--b0);margin:.1rem 0;}

/* ── Open button ── */
.card-foot{margin-top:auto;padding-top:.45rem;}
.btn-open{
  display:inline-flex;align-items:center;gap:.3rem;
  font-size:.78rem;font-weight:600;text-decoration:none;
  color:var(--a1);transition:color .14s, gap .14s;
  letter-spacing:-.005em;
}
.btn-open:hover{color:var(--t0);gap:.45rem;}
.btn-open span{font-size:.88rem;transition:transform .14s;}
.btn-open:hover span{transform:translate(2px,-1px);}

/* ─────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────── */
.site-footer{
  text-align:center;padding:2rem 1rem;
  font-size:.7rem;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;
  font-family:'JetBrains Mono',monospace;
  border-top:1px solid var(--b0);
  background:var(--d0);
}

/* ─────────────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────────────── */
@media(max-width:700px){
  .site-header{padding:.7rem 1rem;}
  .filter-bar,.grid-wrap{padding-left:1rem;padding-right:1rem;}
  .grid{grid-template-columns:repeat(auto-fill,minmax(260px,1fr));}
  .header-right .stat-chip{display:none;}
}
@media(max-width:480px){
  .logo-sub{display:none;}
  .search-wrap{max-width:none;flex:1;}
  .grid{grid-template-columns:1fr;}
}
</style>
</head>
<body>

<header class="site-header">
  <div class="header-inner">
    <div class="logo">
      <div class="logo-mark">▶</div>
      <div>
        <div class="logo-text">Animator Studio</div>
        <div class="logo-sub">Demos Gallery</div>
      </div>
    </div>
    <div class="search-wrap">
      <span class="search-icon">⌕</span>
      <input type="text" id="search" placeholder="Search tools…" autocomplete="off">
    </div>
    <div class="header-right">
      <div class="stat-chip"><b id="visible-count">${tools.filter(t=>!t.failed).length}</b> tools &nbsp;·&nbsp; <b>${total}</b> ver</div>
      <a class="home-link" href="index.html">← Index</a>
    </div>
  </div>
</header>

<div class="filter-bar">
  <span class="filter-label">Filter</span>
  ${cats}
</div>

<div class="grid-wrap">
  <div class="grid" id="grid">
    ${cards}
  </div>
  <p id="no-results">No tools match your search.</p>
</div>

<footer class="site-footer">
  BUILD_${buildDate.toUpperCase().replace(/\s/g,'_')} &nbsp;·&nbsp; ${total} VERSIONS ACROSS ${tools.length} TOOLS
</footer>

<script>
(function(){
  const grid   = document.getElementById('grid');
  const cards  = Array.from(grid.querySelectorAll('.card'));
  const noRes  = document.getElementById('no-results');
  const countEl= document.getElementById('visible-count');
  let activeCat= 'all';
  let query    = '';

  function applyFilter(){
    let vis = 0;
    cards.forEach(c=>{
      const cat     = c.dataset.cat;
      const name    = c.dataset.name;
      const starred = c.dataset.starred === 'true';
      const catOk   = activeCat==='all' || cat===activeCat || (activeCat==='flagship'&&starred);
      const qOk     = !query || name.includes(query) || c.querySelectorAll('.vpill,.sub-name,.card-title')[0]?.textContent.toLowerCase().includes(query);
      const show    = catOk && qOk;
      c.style.display = show ? '' : 'none';
      if(show) vis++;
    });
    countEl.textContent = vis;
    noRes.style.display = vis===0 ? 'block' : 'none';
  }

  document.querySelectorAll('.cat-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      applyFilter();
    });
  });

  document.getElementById('search').addEventListener('input',e=>{
    query = e.target.value.toLowerCase().trim();
    applyFilter();
  });
})();
</script>
</body>
</html>`;
}

// ── main ──────────────────────────────────────────────────────────────────────

console.log('🎨 Scanning tools…');
const tools = scanTools();
console.log(`   Found ${tools.length} tools, ${tools.reduce((a,t)=>a+t.total,0)} total versions.`);
const html = generateHTML(tools);
fs.writeFileSync(OUTPUT, html, 'utf8');
console.log(`✅ demos.html written (${(html.length/1024).toFixed(1)} KB)`);
