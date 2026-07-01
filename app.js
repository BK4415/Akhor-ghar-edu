/* ==========================================================================
   আখৰ ঘৰ — App Shell Logic
   ========================================================================== */

const $app = document.getElementById('screen');
const $navBtns = document.querySelectorAll('.nav-btn');

const STORE_KEY = 'akhor_progress_v1';

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || defaultProgress(); }
  catch (e) { return defaultProgress(); }
}
function defaultProgress() {
  return { stars: 0, streak: 1, lastVisit: new Date().toDateString(), seen: {}, gameBest: 0 };
}
function saveProgress(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }

let progress = loadProgress();
(function bumpStreak() {
  const today = new Date().toDateString();
  if (progress.lastVisit !== today) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    progress.streak = (progress.lastVisit === y.toDateString()) ? progress.streak + 1 : 1;
    progress.lastVisit = today;
    saveProgress(progress);
  }
})();

function markSeen(id) {
  if (!progress.seen[id]) { progress.seen[id] = true; progress.stars += 1; saveProgress(progress); }
}

/* ------------------------------- Router -------------------------------- */
const routes = {};
function route(name, fn) { routes[name] = fn; }
function go(name, params) {
  window.scrollTo(0, 0);
  $navBtns.forEach(b => b.classList.toggle('active', b.dataset.route === name));
  $app.innerHTML = '';
  $app.className = 'screen screen-' + name;
  (routes[name] || routes['home'])(params || {});
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.route));
});
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('drawer').classList.toggle('open');
});
document.getElementById('drawerClose').addEventListener('click', () => {
  document.getElementById('drawer').classList.remove('open');
});
document.getElementById('muteBtn').addEventListener('click', (e) => {
  const on = AudioEngine.isEnabled();
  AudioEngine.setEnabled(!on);
  e.currentTarget.textContent = !on ? '🔊' : '🔇';
});

/* --------------------------- Small UI helpers --------------------------- */
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'শুভ ৰাতিপুৱা!';
  if (h < 17) return 'শুভ দুপৰীয়া!';
  return 'নমস্কাৰ!';
}

/* ================================ HOME ================================= */
route('home', () => {
  $app.appendChild(el(`
    <div class="banner">
      <div class="banner-eyebrow">${greeting()}</div>
      <div class="banner-title">আহক, আজি কিবা এটা নতুন শিকোঁ</div>
    </div>
  `));

  const modules = [
    { key:'vowels', label:'স্বৰ', sub:'Swara · ১১ টা আখৰ', sample:['অ','আ','ই'], grad:'grad-gold' },
    { key:'consonants', label:'ব্যঞ্জন', sub:'Vyanjan · ৪১ টা আখৰ', sample:['ক','খ','গ'], grad:'grad-green' },
    { key:'numbers', label:'সংখ্যা', sub:'Numbers · ১-১০০', sample:['১','২','৩'], grad:'grad-sky' },
    { key:'grammar', label:'ব্যাকৰণ', sub:'Grammar World', sample:['✦','✦','✦'], grad:'grad-purple' },
    { key:'trace', label:'লিখাৰ অনুশীলন', sub:'Tracing Sandbox', sample:['✍️'], grad:'grad-choco' },
    { key:'games', label:'খেলৰ জগত', sub:'Games & Rewards', sample:['★'], grad:'grad-carnival' },
  ];

  const list = el('<div class="module-list"></div>');
  modules.forEach(m => {
    const card = el(`
      <button class="module-card ${m.grad}">
        <span class="module-icon">${m.sample.join(' ')}</span>
        <span class="module-text">
          <span class="module-title">${m.label}</span>
          <span class="module-sub">${m.sub}</span>
        </span>
        <span class="module-arrow">→</span>
      </button>
    `);
    card.addEventListener('click', () => go(m.key));
    list.appendChild(card);
  });
  $app.appendChild(list);
});

/* =============================== LEARN (map) ============================ */
route('learn', () => {
  $app.appendChild(el(`<div class="section-head"><h2>সকলো শিক্ষা বিভাগ</h2><p>তলৰ যিকোনো বিভাগত টিপি শিকিবলৈ আৰম্ভ কৰক</p></div>`));
  go('home'); // reuse home layout by redirect after head (simpler UX: same module list)
});

/* =============================== VOWELS ================================= */
route('vowels', () => {
  $app.appendChild(headerCard('স্বৰ', `Swarabarna · ${VOWELS_DATA.length} letters`, 'কাৰ্ডত টিপি শব্দ শুনক', 'grad-gold'));
  const grid = el('<div class="grid3"></div>');
  VOWELS_DATA.forEach((v, i) => {
    const card = el(`<button class="letter-card ${colorFor(i)}">${v.letter}</button>`);
    card.addEventListener('click', () => go('vowel-detail', { i }));
    grid.appendChild(card);
  });
  $app.appendChild(grid);
  $app.appendChild(bigCta('শিকোঁ আহক', () => go('vowel-detail', { i: 0 })));
});

route('vowel-detail', ({ i }) => {
  renderFlipDetail({
    items: VOWELS_DATA, index: i || 0, backRoute: 'vowels', backLabel: 'স্বৰ', kind: 'vowel',
    render: (v) => `${v.letter}${v.kar !== '—' ? '' : ''}`,
    caption: (v) => v.letter,
    sub: (v) => v.cls ? v.cls : (v.kar !== '—' ? `কাৰ: ${v.kar}` : 'মূল স্বৰ'),
    words: (v) => {
      const w1 = getWordOverride(`${v.id}_w1`, v.word);
      const w2 = getWordOverride(`${v.id}_w2`, v.word2);
      return [w1, w2].filter(Boolean).map(w => `${v.letter} তে ${w}`);
    },
    img: (v) => getImageOverride(v.id) ? { src: getImageOverride(v.id) } : { emoji: v.img },
  });
});

/* ============================= CONSONANTS ================================ */
route('consonants', () => {
  $app.appendChild(headerCard('ব্যঞ্জন', `Vyanjan · ৪১ letters, ${CONSONANT_GROUPS.length} groups`, 'বৰ্গ বাছি শিকা আৰম্ভ কৰক', 'grad-green'));
  const list = el('<div class="group-list"></div>');
  CONSONANT_GROUPS.forEach((g, gi) => {
    const card = el(`
      <button class="group-card ${colorFor(gi)}">
        <span class="group-letters">${g.letters.map(l => l.letter).slice(0,3).join(' ')}</span>
        <span class="group-text">
          <span class="group-title">${g.group}</span>
          <span class="group-sub">${g.title}</span>
        </span>
        <span class="module-arrow">→</span>
      </button>
    `);
    card.addEventListener('click', () => go('consonant-group', { gi }));
    list.appendChild(card);
  });
  $app.appendChild(list);
  $app.appendChild(noteBox(CONSONANT_NOTE));
});

route('consonant-group', ({ gi }) => {
  const g = CONSONANT_GROUPS[gi || 0];
  $app.appendChild(headerCard(g.group, g.title, 'কাৰ্ডত টিপি শব্দ শুনক', 'grad-green', 'consonants'));
  const grid = el('<div class="grid3"></div>');
  g.letters.forEach((l, li) => {
    const card = el(`<button class="letter-card ${colorFor(li)}">${l.letter}</button>`);
    card.addEventListener('click', () => go('consonant-detail', { gi, li }));
    grid.appendChild(card);
  });
  $app.appendChild(grid);
});

route('consonant-detail', ({ gi, li }) => {
  const g = CONSONANT_GROUPS[gi || 0];
  const items = g.letters.map(l => ({ ...l, clsLabel: g.cls }));
  renderFlipDetail({
    items, index: li || 0, backRoute: 'consonant-group', backParams: { gi }, backLabel: g.group, kind: 'consonant',
    render: (c) => c.letter,
    caption: (c) => c.letter,
    sub: (c) => `${g.cls} ${c.letter}`,
    words: (c) => {
      const w = getWordOverride(`${c.letter}_word`, c.word);
      return [`${c.letter} তে ${w}`];
    },
    img: (c) => getImageOverride(c.letter) ? { src: getImageOverride(c.letter) } : { emoji: c.img },
  });
});

/* =============================== NUMBERS ================================= */
route('numbers', () => {
  $app.appendChild(headerCard('সংখ্যা', 'Numbers · ১ - ১০০', 'দহকৰ গোট বাছক', 'grad-sky'));
  const list = el('<div class="decade-grid"></div>');
  for (let d = 0; d < 10; d++) {
    const start = d * 10 + 1, end = d * 10 + 10;
    const card = el(`<button class="decade-card ${colorFor(d)}">${toAssameseNumeral(start)}–${toAssameseNumeral(end)}</button>`);
    card.addEventListener('click', () => go('numbers-decade', { d }));
    list.appendChild(card);
  }
  $app.appendChild(list);
});

route('numbers-decade', ({ d }) => {
  const start = (d || 0) * 10, items = NUMBERS_DATA.slice(start, start + 10);
  $app.appendChild(headerCard(`${toAssameseNumeral(start+1)}–${toAssameseNumeral(start+10)}`, 'Numbers', 'কাৰ্ডত টিপি শুনক', 'grad-sky', 'numbers'));
  const grid = el('<div class="grid3"></div>');
  items.forEach((n, ni) => {
    const card = el(`<button class="letter-card ${colorFor(ni)} small">${n.numeral}</button>`);
    card.addEventListener('click', () => go('number-detail', { d, ni }));
    grid.appendChild(card);
  });
  $app.appendChild(grid);
});

route('number-detail', ({ d, ni }) => {
  const start = (d || 0) * 10, items = NUMBERS_DATA.slice(start, start + 10);
  renderFlipDetail({
    items, index: ni || 0, backRoute: 'numbers-decade', backParams: { d }, backLabel: 'সংখ্যা', kind: 'number',
    render: (x) => x.numeral,
    caption: (x) => x.numeral,
    sub: (x) => x.word,
    words: (x) => [`উচ্চাৰণ: ${x.p}`],
  });
});

/* =============================== GRAMMAR ================================= */
route('grammar', () => {
  $app.appendChild(headerCard('ব্যাকৰণ', 'Grammar World', 'শীঘ্ৰে অহা কাৰ্যকলাপসমূহ', 'grad-purple'));
  const items = [
    { t: 'কাৰ-চিহ্ন প্লেগ্ৰাউণ্ড', d: 'স্বৰবৰ্ণ + ব্যঞ্জনবৰ্ণ মিলাই কাৰ শিকক' },
    { t: 'যুক্তাক্ষৰ বিল্ডাৰ', d: 'দুটা বৰ্ণ মিলাই যুক্তাক্ষৰ গঠন কৰক' },
    { t: 'লিংগ মেচিং গেম', d: 'পুং/স্ত্ৰী শব্দ মিলাওক' },
    { t: 'নিৰ্দেশক প্ৰত্যয় গেম', d: 'শব্দৰ শেষত থকা প্ৰত্যয় চিনাক' },
  ];
  const list = el('<div class="group-list"></div>');
  items.forEach((it, gi) => {
    const card = el(`
      <div class="group-card ${colorFor(gi)} disabled">
        <span class="group-letters">✦</span>
        <span class="group-text"><span class="group-title">${it.t}</span><span class="group-sub">${it.d}</span></span>
        <span class="badge-soon">শীঘ্ৰে</span>
      </div>`);
    list.appendChild(card);
  });
  $app.appendChild(list);
});

/* ============================== TRACE (canvas) ============================ */
route('trace', () => {
  $app.appendChild(headerCard('লিখাৰ অনুশীলন', 'Tracing Sandbox', 'আঙুলিৰে বা মাউচেৰে আখৰ আঁকক', 'grad-choco'));
  const pool = VOWELS_DATA.concat(CONSONANT_GROUPS.flatMap(g => g.letters));
  let idx = 0;

  const wrap = el(`
    <div class="trace-wrap">
      <div class="trace-letter" id="traceGuide">${pool[idx].letter}</div>
      <canvas id="traceCanvas" width="320" height="320"></canvas>
      <div class="trace-actions">
        <button class="pill-btn" id="traceReset">↺ পুনৰাই</button>
        <button class="pill-btn" id="tracePrev">‹ আগৰটো</button>
        <button class="pill-btn primary" id="traceNext">পিছৰটো ›</button>
      </div>
      <div class="trace-score">অনুশীলন স্কোৰ: <span id="traceScore">0</span> ✦</div>
    </div>
  `);
  $app.appendChild(wrap);

  const canvas = document.getElementById('traceCanvas');
  const ctx = canvas.getContext('2d');
  let drawing = false, strokes = 0;

  function pos(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * (canvas.width / r.width), y: (p.clientY - r.top) * (canvas.height / r.height) };
  }
  function start(e) { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
  function move(e) {
    if (!drawing) return;
    const p = pos(e);
    ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#5b3a20';
    ctx.lineTo(p.x, p.y); ctx.stroke();
    e.preventDefault();
  }
  function end() {
    if (drawing) { strokes++; document.getElementById('traceScore').textContent = strokes; }
    drawing = false;
  }
  ['mousedown','touchstart'].forEach(ev => canvas.addEventListener(ev, start));
  ['mousemove','touchmove'].forEach(ev => canvas.addEventListener(ev, move, { passive: false }));
  ['mouseup','mouseleave','touchend'].forEach(ev => canvas.addEventListener(ev, end));

  document.getElementById('traceReset').addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));
  document.getElementById('tracePrev').addEventListener('click', () => { idx = (idx - 1 + pool.length) % pool.length; updateGuide(); });
  document.getElementById('traceNext').addEventListener('click', () => { idx = (idx + 1) % pool.length; updateGuide(); });
  function updateGuide() {
    document.getElementById('traceGuide').textContent = pool[idx].letter;
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
});

/* ================================ GAMES ================================== */
route('games', () => {
  $app.appendChild(headerCard('খেলৰ জগত', 'Games & Rewards', 'শব্দ মিলাই তৰা আৰু বেজ লাভ কৰক', 'grad-carnival'));

  const pool = VOWELS_DATA.map(v => ({ letter: v.letter, word: v.word, img: v.img }))
    .concat(CONSONANT_GROUPS.flatMap(g => g.letters.map(l => ({ letter: l.letter, word: l.word, img: l.img }))));

  let round = 0, score = 0;
  const box = el(`
    <div class="game-box">
      <div class="game-progress">প্ৰশ্ন <span id="gRound">1</span> / 8</div>
      <div class="game-question">এইটো কোনটো ছবিৰ শব্দ? <span class="game-letter" id="gLetter">অ</span></div>
      <div class="game-options" id="gOptions"></div>
      <div class="game-score">★ স্কোৰ: <span id="gScore">0</span></div>
    </div>
  `);
  $app.appendChild(box);

  function shuffle(arr) { return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(v=>v[1]); }
  function nextRound() {
    if (round >= 8) { finish(); return; }
    round++;
    document.getElementById('gRound').textContent = round;
    const correct = pool[Math.floor(Math.random()*pool.length)];
    document.getElementById('gLetter').textContent = correct.letter;
    const distractors = shuffle(pool.filter(p => p.word !== correct.word)).slice(0,2);
    const options = shuffle([correct, ...distractors]);
    const optWrap = document.getElementById('gOptions');
    optWrap.innerHTML = '';
    options.forEach(o => {
      const b = el(`<button class="game-option">${o.img} ${o.word}</button>`);
      b.addEventListener('click', () => {
        if (o.word === correct.word) { score++; document.getElementById('gScore').textContent = score; b.classList.add('correct'); }
        else b.classList.add('wrong');
        setTimeout(nextRound, 500);
      });
      optWrap.appendChild(b);
    });
  }
  function finish() {
    if (score > progress.gameBest) { progress.gameBest = score; saveProgress(progress); }
    $app.innerHTML = '';
    $app.appendChild(el(`
      <div class="finish-box">
        <div class="finish-emoji">🎉</div>
        <h2>বাহ! খেল সমাপ্ত</h2>
        <p>আপুনি ৮ টাৰে ${score} টা শুদ্ধ কৰিছে</p>
        <div class="finish-best">সৰ্বোচ্চ স্কোৰ: ${progress.gameBest} ★</div>
        <button class="pill-btn primary" id="playAgain">আকৌ খেলক</button>
      </div>
    `));
    document.getElementById('playAgain').addEventListener('click', () => go('games'));
  }
  nextRound();
});

/* ================================ PROFILE ================================ */
route('profile', () => {
  const badges = [
    { need: 5, label: 'নতুন শিক্ষাৰ্থী', icon: '🌱' },
    { need: 20, label: 'আখৰ অন্বেষক', icon: '🔎' },
    { need: 50, label: 'অসমীয়া তৰা', icon: '⭐' },
    { need: 100, label: 'আখৰ ঘৰৰ মাষ্টাৰ', icon: '👑' },
  ];
  $app.appendChild(headerCard('মই', 'তোমাৰ অগ্ৰগতি', '', 'grad-purple'));
  $app.appendChild(el(`
    <div class="profile-stats">
      <div class="stat-card"><div class="stat-num">${progress.stars}</div><div class="stat-label">তৰা ✦</div></div>
      <div class="stat-card"><div class="stat-num">${progress.streak}</div><div class="stat-label">দিনৰ ধাৰা 🔥</div></div>
      <div class="stat-card"><div class="stat-num">${progress.gameBest}</div><div class="stat-label">খেলৰ সৰ্বোচ্চ 🎮</div></div>
    </div>
  `));
  const badgeList = el('<div class="badge-list"></div>');
  badges.forEach(b => {
    const unlocked = progress.stars >= b.need;
    badgeList.appendChild(el(`
      <div class="badge-item ${unlocked ? 'unlocked' : ''}">
        <div class="badge-icon">${unlocked ? b.icon : '🔒'}</div>
        <div class="badge-text"><b>${b.label}</b><span>${b.need} তৰা লাগে</span></div>
      </div>
    `));
  });
  $app.appendChild(badgeList);
  const adminLink = el(`<button class="pill-btn" style="margin-top:20px;width:100%">⚙ প্ৰশাসক পেনেল</button>`);
  adminLink.addEventListener('click', () => window.location.href = 'admin/index.html');
  $app.appendChild(adminLink);
});

/* ============================ Shared components =========================== */
function headerCard(title, sub, hint, grad, backRoute) {
  return el(`
    <div class="page-head ${grad}">
      ${backRoute ? `<button class="back-btn" onclick="go('${backRoute}')">← </button>` : ''}
      <div class="page-title">${title}</div>
      ${sub ? `<div class="page-sub">${sub}</div>` : ''}
      ${hint ? `<div class="page-hint">${hint}</div>` : ''}
    </div>
  `);
}
function noteBox(text) {
  return el(`<div class="note-box">📘 ${text}</div>`);
}
function bigCta(label, onClick) {
  const b = el(`<button class="cta-btn">${label}</button>`);
  b.addEventListener('click', onClick);
  return b;
}
function colorFor(i) { return CARD_COLORS[i % CARD_COLORS.length]; }

function renderFlipDetail({ items, index, backRoute, backParams, backLabel, kind, render, caption, sub, words, img }) {
  const item = items[index];
  const total = items.length;
  markSeen((item.id || item.letter || item.n) + '_' + kind);

  const head = el(`
    <div class="detail-nav">
      <button class="back-link" id="detailBack">← ${backLabel}</button>
      <span class="detail-count">${index + 1} / ${total}</span>
    </div>
  `);
  $app.appendChild(head);
  document.getElementById('detailBack').addEventListener('click', () => go(backRoute, backParams));

  const card = el(`
    <div class="flip-card">
      <div class="flip-face">${render(item)}</div>
    </div>
  `);
  $app.appendChild(card);

  $app.appendChild(el(`<div class="detail-caption">${caption(item)}</div>`));
  if (sub) $app.appendChild(el(`<div class="detail-sub">${sub(item)}</div>`));

  if (img) {
    const picture = img(item);
    if (picture) {
      const pic = picture.src
        ? el(`<img class="ref-image" src="${picture.src}" alt="">`)
        : el(`<div class="ref-image ref-emoji">${picture.emoji || ''}</div>`);
      $app.appendChild(pic);
    }
  }

  const soundBtn = el(`<button class="sound-btn">🔊</button>`);
  soundBtn.addEventListener('click', () => AudioEngine.playEntry(item, kind));
  $app.appendChild(soundBtn);

  if (words) {
    const w = words(item);
    if (w && w.length) {
      const wordWrap = el('<div class="word-chip-row"></div>');
      w.forEach(x => wordWrap.appendChild(el(`<span class="word-chip">${x}</span>`)));
      $app.appendChild(wordWrap);
    }
  }

  const nav = el(`
    <div class="detail-footer">
      <button class="pill-btn" id="prevBtn" ${index === 0 ? 'disabled' : ''}>‹ পূৰ্বৰ</button>
      <button class="pill-btn primary" id="nextBtn">${index === total - 1 ? 'সমাপ্ত ✓' : 'পিছৰ ›'}</button>
    </div>
  `);
  $app.appendChild(nav);
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (index > 0) go(currentRouteName(), { ...backParams, i: index - 1, ni: index - 1, li: index - 1 });
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (index < total - 1) go(currentRouteName(), { ...backParams, i: index + 1, ni: index + 1, li: index + 1 });
    else go(backRoute, backParams);
  });

  // auto-play on open
  setTimeout(() => AudioEngine.playEntry(item, kind), 250);

  function currentRouteName() {
    if (kind === 'vowel') return 'vowel-detail';
    if (kind === 'consonant') return 'consonant-detail';
    return 'number-detail';
  }
}

/* First screen */
go('home');

/* Register service worker */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(()=>{}));
}
