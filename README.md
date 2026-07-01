# আখৰ ঘৰ (Akhor Ghor)

A mobile-first, offline-capable PWA for teaching children Assamese vowels,
consonants, and numbers — built to match the reference UI you shared
(cream background, red primary accent, colour-coded module cards).

This delivery is a **fully working front-end prototype** with placeholder
media, wired so real content can be dropped in later with no code changes.

---

## 1. What's actually working right now

- **Full navigation**: Home → স্বৰ / ব্যঞ্জন / সংখ্যা / ব্যাকৰণ (stub) / লিখাৰ অনুশীলন / খেলৰ জগত
- **All 11 vowels**, all **41 consonants** (grouped by বৰ্গ exactly as in your spec),
  and all **numbers 1–100** with word + pronunciation, sourced from the data you gave.
- **Audio**: tapping any letter/number speaks Letter → Classification → Word using
  the browser's built-in text-to-speech (see "Audio placeholder" below).
- **Tracing sandbox**: finger/mouse canvas tracing with a faint letter guide.
- **Mini-game**: "which word matches this letter" quiz with score + best-score tracking.
- **Progress system**: stars, daily streak, and unlockable badges (localStorage).
- **Admin panel** at `/admin/index.html` (see credentials below) to upload
  real audio/images per letter and edit example words — changes appear
  immediately in the learner-facing app.
- **PWA**: installable, works offline after first load (`manifest.json` + `sw.js`).

## 2. Placeholder strategy (what you asked for)

### Images
No real photos/illustrations exist yet, so each letter shows an emoji that
represents its example word (e.g. অ → 👶 for অজগৰ/অমিতা). The admin panel's
**🖼 ছবি আপলোড** tab lets you upload a real photo per letter; it instantly
replaces the emoji everywhere that letter appears.

### Audio
Real studio-recorded Assamese pronunciation isn't available yet. Until then,
the app uses the browser's `speechSynthesis` API to *speak* the letter →
classification → word sequence, so the pronunciation flow you specified is
fully testable today. The admin panel's **🎵 অডিঅ' আপলোড** tab lets you
upload a real `.mp3`/`.wav` per letter; the app automatically prefers that
file over text-to-speech the moment it exists (`js/audio.js` →
`getCustomAudio()`).

## 3. Admin panel

URL: `admin/index.html`
Username: `Rumashree`
Password: `incompletejourney@k`

**Important:** this prototype's admin auth and storage are entirely
client-side (`sessionStorage` + `localStorage`), matching a static-file
deliverable. That means:
- Uploaded content is only visible in the browser that uploaded it.
- The password is not cryptographically protected.

This is fine for reviewing/testing content today, but **before a real
launch** wire the admin panel to a real backend (see below) so content is
shared across every child's device.

## 4. Folder structure

```
akhor-ghor/
├── index.html            # App shell (header, screen container, bottom nav)
├── manifest.json         # PWA manifest
├── sw.js                 # Offline service worker (app-shell caching)
├── about.html            # আমাৰ বিষয়ে
├── privacy.html          # গোপনীয়তা নীতি / শিশু সুৰক্ষা নীতি / কপিৰাইট
├── css/
│   └── style.css         # All styling — tokens at top of file
├── js/
│   ├── data.js           # Vowels, consonants, numbers content + CMS override readers
│   ├── audio.js          # TTS placeholder engine + custom-audio override
│   └── app.js             # Router, screen rendering, game, tracing, progress
├── assets/
│   └── icons/            # Placeholder PWA icons (192/512)
└── admin/
    ├── index.html        # Login + dashboard shell
    ├── admin.css
    └── admin.js          # Upload handlers, word editor, localStorage CMS
```

## 5. Turning this into the full spec (React + Node/Express + SQLite CMS)

The current build intentionally stays framework-free so it's instantly
previewable and tiny (loads fast on low-end phones). Your original spec
asked for React + Tailwind on the front and Node/Express + SQLite on the
back for a real multi-device CMS. Recommended path:

1. **Backend**: stand up an Express server with routes:
   - `GET /api/vowels`, `/api/consonants`, `/api/numbers` → return the exact
     JSON shapes already used in `js/data.js` (`VOWELS_DATA`, `CONSONANT_GROUPS`,
     `NUMBERS_DATA`) — the front-end code barely changes.
   - `POST /admin/upload/audio`, `/admin/upload/image` → save files to
     `/uploads/audio/` and `/uploads/images/`, return the served URL.
   - `POST /admin/words` → persist word edits to SQLite instead of localStorage.
2. **Auth**: replace the hardcoded admin check with a real session/JWT.
3. **Front-end**: once the API exists, flip `AKHOR_CONFIG.dataSource` to
   `'api'` in `js/data.js` and swap the localStorage reads for `fetch()`
   calls — the render logic in `app.js` doesn't need to change.
4. **React migration** (optional): the screens map cleanly to components
   (`ModuleCard`, `LetterGrid`, `FlipDetail`, `TraceCanvas`, `QuizGame`) if
   you want to move to React + Tailwind for larger team development later.

## 6. Deployment (as-is, static prototype)

Any static host works since there's no server dependency yet:
- Drag-and-drop the `akhor-ghor` folder into Netlify/Vercel, or
- `npx serve akhor-ghor` locally, or
- Host on GitHub Pages.

Because it's a PWA, once opened once on a phone it can be "Added to Home
Screen" and used offline.

---

Developed by বিকি — content sourced from the vowel/consonant/number lists
and audio-flow spec you provided.
