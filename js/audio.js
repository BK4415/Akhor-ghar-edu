/* ==========================================================================
   আখৰ ঘৰ — Audio Engine
   PLACEHOLDER STRATEGY:
   Real, professionally recorded Assamese pronunciation audio is not
   available yet. Until the admin uploads real files (via /admin), this
   engine speaks the sequence using the browser's speechSynthesis API so the
   app is fully functional and testable today.

   Swap-in path for real audio (no code changes needed elsewhere):
     1. Admin uploads a file in /admin -> CMS -> Audio Upload
     2. File is stored as assets/audio/<entryId>.mp3 (or via API in prod)
     3. getCustomAudio(id) below finds it and playFile() is used instead
        of speechSynthesis automatically.
   ========================================================================== */

const AudioEngine = (() => {
  let unlocked = false;
  let enabled = true;

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    if ('speechSynthesis' in window) {
      // warm up voices list (some browsers load async)
      speechSynthesis.getVoices();
    }
  }

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function speakOne(text) {
    return new Promise(resolve => {
      if (!enabled || !('speechSynthesis' in window) || !text) return resolve();
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        // Closest widely-supported voice; real Assamese audio should replace this.
        u.lang = 'as-IN';
        u.rate = 0.82;
        u.pitch = 1.05;
        u.onend = resolve;
        u.onerror = resolve;
        speechSynthesis.speak(u);
      } catch (e) { resolve(); }
    });
  }

  async function speakSequence(parts) {
    for (const p of parts.filter(Boolean)) {
      await speakOne(p);
      await delay(180);
    }
  }

  function getCustomAudio(entryId) {
    try {
      const map = JSON.parse(localStorage.getItem('akhor_cms_audio') || '{}');
      return map[entryId] || null;
    } catch (e) { return null; }
  }

  function playFile(dataUrlOrPath) {
    return new Promise(resolve => {
      const a = new Audio(dataUrlOrPath);
      a.onended = resolve;
      a.onerror = resolve;
      a.play().catch(resolve);
    });
  }

  async function playEntry(entry, kind) {
    unlock();
    const custom = getCustomAudio(entry.id || entry.letter || entry.n);
    if (custom) { await playFile(custom); return; }

    let seq = [];
    if (kind === 'vowel') {
      const w1 = getWordOverride(`${entry.id}_w1`, entry.word);
      const w2 = getWordOverride(`${entry.id}_w2`, entry.word2);
      seq = [entry.letter, entry.cls, w1 ? `${entry.letter} তে ${w1}` : null,
             w2 ? `${entry.letter} তে ${w2}` : null];
    } else if (kind === 'consonant') {
      const w = getWordOverride(`${entry.letter}_word`, entry.word);
      seq = [entry.letter, `${entry.clsLabel} ${entry.letter}`, `${entry.letter} তে ${w}`];
    } else if (kind === 'number') {
      seq = [entry.numeral, entry.word];
    } else {
      seq = [entry.letter || entry.word || ''];
    }
    await speakSequence(seq);
  }

  function setEnabled(v) { enabled = v; }
  function isEnabled() { return enabled; }

  return { playEntry, speakSequence, speakOne, setEnabled, isEnabled, unlock };
})();
