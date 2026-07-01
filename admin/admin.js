/* ==========================================================================
   আখৰ ঘৰ — Admin Panel (local demo CMS)
   Auth is intentionally simple client-side gating for this static prototype.
   In production, replace this with a real server-side session (see README).
   ========================================================================== */

const ADMIN_USER = 'Rumashree';
const ADMIN_PASS = 'incompletejourney@k';
const SESSION_KEY = 'akhor_admin_session';

const $ = (id) => document.getElementById(id);

function showDash() {
  $('loginScreen').style.display = 'none';
  $('dashScreen').style.display = 'block';
  renderAudioTab();
  renderImageTab();
  renderWordsTab();
  renderGrammarTab();
}

if (sessionStorage.getItem(SESSION_KEY) === '1') showDash();

$('loginBtn').addEventListener('click', () => {
  const u = $('loginUser').value.trim();
  const p = $('loginPass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem(SESSION_KEY, '1');
    showDash();
  } else {
    $('loginError').textContent = 'ভুল Username বা Password। আকৌ চেষ্টা কৰক।';
  }
});
$('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
    btn.classList.add('active');
    $('tab-' + btn.dataset.tab).style.display = 'block';
  });
});

/* --------------------------- shared entry list --------------------------- */
function allLetterEntries() {
  const items = VOWELS_DATA.map(v => ({ id: v.id, label: v.letter, name: `স্বৰ · ${v.letter} (${v.word})` }));
  CONSONANT_GROUPS.forEach(g => g.letters.forEach(l => {
    items.push({ id: l.letter, label: l.letter, name: `ব্যঞ্জন · ${l.letter} (${l.word})` });
  }));
  return items;
}

function readMap(key) { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; } }
function writeMap(key, map) { localStorage.setItem(key, JSON.stringify(map)); }
function fileToDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ------------------------------ Audio tab -------------------------------- */
function renderAudioTab() {
  const entries = allLetterEntries();
  const map = readMap('akhor_cms_audio');
  const wrap = el(`<div><div class="section-label">প্ৰকৃত উচ্চাৰণ অডিঅ' আপলোড কৰক (mp3/wav)</div></div>`);
  entries.forEach(entry => {
    const has = !!map[entry.id];
    const row = el(`
      <div class="entry-row">
        <div class="entry-letter">${entry.label}</div>
        <div class="entry-main">
          <div class="entry-name">${entry.name}</div>
          <div class="entry-status">${has ? '✅ অডিঅ\' আপলোড হৈছে' : '⏳ TTS প্লেচহলদাৰ ব্যৱহাৰ হৈ আছে'}</div>
        </div>
        <div class="entry-actions">
          <label class="upload-btn">${has ? 'সলনি কৰক' : 'আপলোড'}<input type="file" accept="audio/*"></label>
          ${has ? '<button class="clear-btn">মচক</button>' : ''}
        </div>
      </div>
    `);
    const fileInput = row.querySelector('input[type=file]');
    fileInput.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const dataUrl = await fileToDataUrl(f);
      const m = readMap('akhor_cms_audio');
      m[entry.id] = dataUrl;
      writeMap('akhor_cms_audio', m);
      renderAudioTab();
    });
    const clearBtn = row.querySelector('.clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      const m = readMap('akhor_cms_audio');
      delete m[entry.id];
      writeMap('akhor_cms_audio', m);
      renderAudioTab();
    });
    wrap.appendChild(row);
  });
  $('tab-audio').innerHTML = '';
  $('tab-audio').appendChild(wrap);
}

/* ------------------------------ Image tab -------------------------------- */
function renderImageTab() {
  const entries = allLetterEntries();
  const map = readMap('akhor_cms_images');
  const wrap = el(`<div><div class="section-label">প্ৰকৃত অবজেক্ট ছবি আপলোড কৰক (jpg/png)</div></div>`);
  entries.forEach(entry => {
    const has = map[entry.id];
    const row = el(`
      <div class="entry-row">
        <div class="entry-letter">${entry.label}</div>
        <div class="entry-main">
          <div class="entry-name">${entry.name}</div>
          <div class="entry-status">${has ? '✅ ছবি আপলোড হৈছে' : '⏳ ইমোজি প্লেচহলদাৰ ব্যৱহাৰ হৈ আছে'}</div>
        </div>
        <div class="entry-actions">
          ${has ? `<img class="entry-thumb" src="${has}">` : ''}
          <label class="upload-btn">${has ? 'সলনি' : 'আপলোড'}<input type="file" accept="image/*"></label>
          ${has ? '<button class="clear-btn">মচক</button>' : ''}
        </div>
      </div>
    `);
    const fileInput = row.querySelector('input[type=file]');
    fileInput.addEventListener('change', async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const dataUrl = await fileToDataUrl(f);
      const m = readMap('akhor_cms_images');
      m[entry.id] = dataUrl;
      writeMap('akhor_cms_images', m);
      renderImageTab();
    });
    const clearBtn = row.querySelector('.clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      const m = readMap('akhor_cms_images');
      delete m[entry.id];
      writeMap('akhor_cms_images', m);
      renderImageTab();
    });
    wrap.appendChild(row);
  });
  $('tab-image').innerHTML = '';
  $('tab-image').appendChild(wrap);
}

/* ------------------------------ Words tab -------------------------------- */
function renderWordsTab() {
  const wordsMap = readMap('akhor_cms_words');
  const wrap = el(`<div></div>`);
  wrap.appendChild(el(`<div class="section-label">স্বৰবৰ্ণ শব্দ</div>`));
  VOWELS_DATA.forEach(v => {
    wrap.appendChild(wordRow(`${v.id}_w1`, `${v.letter} — শব্দ ১`, wordsMap[`${v.id}_w1`] ?? v.word));
    if (v.word2) wrap.appendChild(wordRow(`${v.id}_w2`, `${v.letter} — শব্দ ২`, wordsMap[`${v.id}_w2`] ?? v.word2));
  });
  wrap.appendChild(el(`<div class="section-label">ব্যঞ্জনবৰ্ণ শব্দ</div>`));
  CONSONANT_GROUPS.forEach(g => g.letters.forEach(l => {
    wrap.appendChild(wordRow(`${l.letter}_word`, `${l.letter} — শব্দ`, wordsMap[`${l.letter}_word`] ?? l.word));
  }));

  const saveBar = el(`<div class="save-bar"><span class="saved-flash" id="wordsFlash"></span><button class="save-btn" id="saveWordsBtn">সংৰক্ষণ কৰক</button></div>`);
  wrap.appendChild(saveBar);

  $('tab-words').innerHTML = '';
  $('tab-words').appendChild(wrap);

  $('saveWordsBtn').addEventListener('click', () => {
    const m = {};
    wrap.querySelectorAll('input[data-key]').forEach(inp => { m[inp.dataset.key] = inp.value.trim(); });
    writeMap('akhor_cms_words', m);
    $('wordsFlash').textContent = '✅ সংৰক্ষিত হ\'ল';
    setTimeout(() => { const f = $('wordsFlash'); if (f) f.textContent = ''; }, 2000);
  });
}
function wordRow(key, label, value) {
  return el(`
    <div class="word-input-row">
      <label>${label}</label>
      <input type="text" data-key="${key}" value="${value || ''}">
    </div>
  `);
}

/* ----------------------------- Grammar tab -------------------------------- */
function renderGrammarTab() {
  $('tab-grammar').innerHTML = '';
  $('tab-grammar').appendChild(el(`
    <div class="coming-soon">
      📚<br><br>ব্যাকৰণ সম্পাদক এতিয়া নিৰ্মাণাধীন।<br>
      কাৰ-চিহ্ন, যুক্তাক্ষৰ, আৰু লিংগ গেমৰ কনটেন্ট ব্যৱস্থাপনা আহিব লগীয়া সংস্কৰণত যোগ কৰা হ'ব।
    </div>
  `));
}

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
