/* ==========================================================================
   আখৰ ঘৰ — Content Data Layer
   This file is the "CMS payload" shape. In production this exact JSON shape
   is what GET /api/vowels, /api/consonants, /api/numbers would return.
   Swap window.AKHOR_DATA_SOURCE = 'api' and set API_BASE to go live.
   ========================================================================== */

const AKHOR_CONFIG = {
  dataSource: 'local',        // 'local' | 'api'
  apiBase: '/api',
  mediaBase: 'assets',        // where /audio and /images live
};

/* Card colour identities — cycles per module so neighbouring cards differ */
const CARD_COLORS = ['gold', 'green', 'sky', 'coral'];

/* ---------------------------- স্বৰবৰ্ণ (11) ---------------------------- */
const VOWELS_DATA = [
  { id:'v01', letter:'অ', kar:'—',  cls:null,            word:'অজগৰ', word2:'অমিতা', img:'👶' },
  { id:'v02', letter:'আ', kar:'া', cls:null,            word:'আম',   word2:null,     img:'🥭' },
  { id:'v03', letter:'ই', kar:'ি', cls:'হ্ৰস্ব ই',      word:'ইটা',  word2:'ইলিশ',   img:'🧱' },
  { id:'v04', letter:'ঈ', kar:'ী', cls:'দীৰ্ঘ ঈ',       word:'ঈশ্বৰ', word2:'ঈগল',    img:'🦅' },
  { id:'v05', letter:'উ', kar:'ু', cls:'হ্ৰস্ব উ',      word:'উট',   word2:'উলু',    img:'🐫' },
  { id:'v06', letter:'ঊ', kar:'ূ', cls:'দীৰ্ঘ ঊ',       word:'ঊষা',  word2:'ঊনবিংশ', img:'🌅' },
  { id:'v07', letter:'ঋ', kar:'ৃ', cls:'ৰি',            word:'ঋষি',  word2:'তৃণ',    img:'🧘' },
  { id:'v08', letter:'এ', kar:'ে', cls:null,            word:'এৰা',  word2:null,     img:'🌿' },
  { id:'v09', letter:'ঐ', kar:'ৈ', cls:null,            word:'ঐক্য', word2:'মই',     img:'🤝' },
  { id:'v10', letter:'ও', kar:'ো', cls:null,            word:'ওল',   word2:null,     img:'🥔' },
  { id:'v11', letter:'ঔ', kar:'ৌ', cls:null,            word:'ঔষধ', word2:'নৌকা',   img:'⛵' },
];

const VOWEL_NOTES = [
  '“ই” আৰু “ঈ”, “উ” আৰু “ঊ” উচ্চাৰণত বিশেষ পাৰ্থক্য নাই, কিন্তু বানান লিখোঁতে পৃথককৈ ব্যৱহাৰ কৰা হয়।',
  'ব্যঞ্জনবৰ্ণৰ লগত যুক্ত হ\'লে স্বৰবৰ্ণবোৰ “কাৰ” ৰূপ লয়। যেনে: ক + া = কা, ক + ি = কি, ক + ী = কী',
];

/* ------------------------- ব্যঞ্জনবৰ্ণ (41) ----------------------------- */
// Each group carries a pronunciation classification used for the audio flow.
const CONSONANT_GROUPS = [
  { group:'ক-বৰ্গ', cls:'কণ্ঠ্য', title:'কণ্ঠ্য ধ্বনি', theme:'leaf-1', letters:[
    {letter:'ক', word:'কলম', img:'✏️'}, {letter:'খ', word:'খৰগোশ', img:'🐇'},
    {letter:'গ', word:'গৰু', img:'🐄'}, {letter:'ঘ', word:'ঘৰ', img:'🏠'},
    {letter:'ঙ', word:'ঙনি', img:'🪵'},
  ]},
  { group:'চ-বৰ্গ', cls:'তালব্য', title:'তালব্য ধ্বনি', theme:'leaf-2', letters:[
    {letter:'চ', word:'চৰাই', img:'🐦'}, {letter:'ছ', word:'ছাগলী', img:'🐐'},
    {letter:'জ', word:'জাহাজ', img:'🚢'}, {letter:'ঝ', word:'ঝৰ্ণা', img:'💦'},
    {letter:'ঞ', word:'ঞান', img:'💡'},
  ]},
  { group:'ট-বৰ্গ', cls:'মূৰ্ধন্য', title:'মূৰ্ধন্য ধ্বনি', theme:'leaf-3', letters:[
    {letter:'ট', word:'টোপোলা', img:'🎒'}, {letter:'ঠ', word:'ঠগ', img:'🎭'},
    {letter:'ড', word:'ডালিম', img:'🍎'}, {letter:'ঢ', word:'ঢোল', img:'🥁'},
    {letter:'ণ', word:'বাণ', img:'🏹'},
  ]},
  { group:'ত-বৰ্গ', cls:'দন্ত্য', title:'দন্ত্য ধ্বনি', theme:'leaf-4', letters:[
    {letter:'ত', word:'তামোল', img:'🌰'}, {letter:'থ', word:'থালা', img:'🍽️'},
    {letter:'দ', word:'দৰ্জা', img:'🚪'}, {letter:'ধ', word:'ধন', img:'💰'},
    {letter:'ন', word:'নাও', img:'🛶'},
  ]},
  { group:'প-বৰ্গ', cls:'ওষ্ঠ্য', title:'ওষ্ঠ্য ধ্বনি', theme:'leaf-5', letters:[
    {letter:'প', word:'পদুম', img:'🪷'}, {letter:'ফ', word:'ফুল', img:'🌸'},
    {letter:'ব', word:'বল', img:'⚽'}, {letter:'ভ', word:'ভালুক', img:'🐻'},
    {letter:'ম', word:'মাছ', img:'🐟'},
  ]},
  { group:'অন্তস্থ বৰ্ণ', cls:'অন্তস্থ', title:'অন্তস্থ বৰ্ণ', theme:'leaf-6', letters:[
    {letter:'য', word:'যাত্ৰা', img:'🚗'}, {letter:'ৰ', word:'ৰং', img:'🎨'},
    {letter:'ল', word:'লাউ', img:'🥒'}, {letter:'ৱ', word:'ৱাৰী', img:'🏘️'},
  ]},
  { group:'উষ্ম বৰ্ণ', cls:'উষ্ম', title:'উষ্ম বৰ্ণ', theme:'leaf-7', letters:[
    {letter:'শ', word:'শৰাই', img:'🦢'}, {letter:'ষ', word:'ষাঁড়', img:'🐂'},
    {letter:'স', word:'সাপ', img:'🐍'}, {letter:'হ', word:'হাতী', img:'🐘'},
  ]},
  { group:'অন্যান্য বৰ্ণ', cls:'বিশেষ', title:'অন্যান্য বৰ্ণ', theme:'leaf-8', letters:[
    {letter:'ক্ষ', word:'ক্ষীৰ', img:'🥛'}, {letter:'ড়', word:'গাড়ী', img:'🚙'},
    {letter:'ঢ়', word:'বাঢ়নি', img:'📈'}, {letter:'য়', word:'ভয়', img:'😨'},
    {letter:'ৎ', word:'সৎ', img:'🙏'}, {letter:'ং', word:'ৰং', img:'🌈'},
    {letter:'ঃ', word:'দুঃখ', img:'😢'}, {letter:'ঁ', word:'কেঁচু', img:'🪱'},
  ]},
];

const CONSONANT_NOTE = 'অসমীয়াত শ, ষ, স ৰ উচ্চাৰণ অধিকাংশ ক্ষেত্ৰতে একে “x” ধ্বনিৰ দৰে হয়। “ক্ষ”ক অসমীয়া বৰ্ণমালাত এটা সুকীয়া বৰ্ণ হিচাপে ধৰা হয়।';

/* ---------------------------- সংখ্যা (1-100) ---------------------------- */
const BN_DIGIT = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
function toAssameseNumeral(n){
  return String(n).split('').map(d => BN_DIGIT[d] ?? d).join('');
}

/* NUMBERS_DATA is injected below (n, w=word, p=pronunciation) */

/* ---------------------- CMS override helpers (localStorage) ----------------------
   The admin panel (admin/index.html) writes to these same localStorage keys.
   In production, replace these reads with GET calls to the real CMS API
   (AKHOR_CONFIG.apiBase) — the shape stays identical.
------------------------------------------------------------------------------- */
function getWordOverride(key, fallback) {
  try {
    const map = JSON.parse(localStorage.getItem('akhor_cms_words') || '{}');
    return (map[key] !== undefined && map[key] !== '') ? map[key] : fallback;
  } catch (e) { return fallback; }
}
function getImageOverride(key) {
  try {
    const map = JSON.parse(localStorage.getItem('akhor_cms_images') || '{}');
    return map[key] || null;
  } catch (e) { return null; }
}
const NUMBERS_DATA = [
  {n:1,w:"এক",p:"ekh"},
  {n:2,w:"দুই",p:"dui"},
  {n:3,w:"তিনি",p:"tini"},
  {n:4,w:"চাৰি",p:"sári"},
  {n:5,w:"পাঁচ",p:"sãs"},
  {n:6,w:"ছয়",p:"soy"},
  {n:7,w:"সাত",p:"xát"},
  {n:8,w:"আঠ",p:"ath"},
  {n:9,w:"ন",p:"no"},
  {n:10,w:"দহ",p:"doh"},
  {n:11,w:"এঘাৰ",p:"egháro"},
  {n:12,w:"বাৰ",p:"báro"},
  {n:13,w:"তেৰ",p:"tero"},
  {n:14,w:"চৈধ্য",p:"soyddho"},
  {n:15,w:"পোন্ধৰ",p:"pondhoro"},
  {n:16,w:"ষোল্ল",p:"xóllo"},
  {n:17,w:"সোতৰ",p:"xotoro"},
  {n:18,w:"ওঠৰ",p:"othoro"},
  {n:19,w:"উনৈশ",p:"unois"},
  {n:20,w:"বিশ",p:"bix"},
  {n:21,w:"একৈশ",p:"ekois"},
  {n:22,w:"বাইশ",p:"báis"},
  {n:23,w:"তেইশ",p:"teis"},
  {n:24,w:"চব্বিশ",p:"sobbix"},
  {n:25,w:"পঁচিশ",p:"põsix"},
  {n:26,w:"ছাব্বিশ",p:"sabbix"},
  {n:27,w:"সাতাইশ",p:"xátáis"},
  {n:28,w:"আঠাইশ",p:"atháis"},
  {n:29,w:"উনত্ৰিশ",p:"unotrix"},
  {n:30,w:"ত্ৰিশ",p:"trix"},
  {n:31,w:"একত্ৰিশ",p:"ekotrix"},
  {n:32,w:"বত্ৰিশ",p:"botrix"},
  {n:33,w:"ত্ৰেত্ৰিশ",p:"tretrix"},
  {n:34,w:"চৌত্ৰিশ",p:"soutrix"},
  {n:35,w:"পঁয়ত্ৰিশ",p:"põyotrix"},
  {n:36,w:"ছত্ৰিশ",p:"sotrix"},
  {n:37,w:"সাতত্ৰিশ",p:"xátotrix"},
  {n:38,w:"আঠত্ৰিশ",p:"athotrix"},
  {n:39,w:"উনচল্লিশ",p:"unosollix"},
  {n:40,w:"চল্লিশ",p:"sollix"},
  {n:41,w:"একচল্লিশ",p:"ekosollix"},
  {n:42,w:"বিয়াল্লিশ",p:"biyallix"},
  {n:43,w:"ত্ৰিতাল্লিশ",p:"tritallix"},
  {n:44,w:"চৌৱাল্লিশ",p:"souwallix"},
  {n:45,w:"পঞ্চল্লিশ",p:"ponsollix"},
  {n:46,w:"ছিয়ল্লিশ",p:"siyollix"},
  {n:47,w:"সাতচল্লিশ",p:"xátosollix"},
  {n:48,w:"আঠচল্লিশ",p:"athosollix"},
  {n:49,w:"উনপঞ্চাশ",p:"unoponsas"},
  {n:50,w:"পঞ্চাশ",p:"ponsas"},
  {n:51,w:"একৱন্ন",p:"ekowonno"},
  {n:52,w:"বাৱন্ন",p:"báwonno"},
  {n:53,w:"ত্ৰেপন",p:"trepon"},
  {n:54,w:"চৌৱন্ন",p:"souwonno"},
  {n:55,w:"পঞ্চৱন্ন",p:"poncowonno"},
  {n:56,w:"ছাপন্ন",p:"sappon"},
  {n:57,w:"সাতৱন্ন",p:"xátowonno"},
  {n:58,w:"আঠৱন্ন",p:"athowonno"},
  {n:59,w:"উনষট্টি",p:"unoxotti"},
  {n:60,w:"ষট্টি",p:"xotti"},
  {n:61,w:"একষট্টি",p:"ekoxotti"},
  {n:62,w:"বাষট্টি",p:"báxotti"},
  {n:63,w:"ত্ৰেষট্টি",p:"trexotti"},
  {n:64,w:"চৌষট্টি",p:"souxotti"},
  {n:65,w:"পঁয়ষট্টি",p:"põyoxotti"},
  {n:66,w:"ছেষট্টি",p:"sexotti"},
  {n:67,w:"সাতষট্টি",p:"xátoxotti"},
  {n:68,w:"আঠষট্টি",p:"athoxotti"},
  {n:69,w:"উনসত্তৰ",p:"unoxottoro"},
  {n:70,w:"সত্তৰ",p:"xottoro"},
  {n:71,w:"একাতৰ",p:"ekatoro"},
  {n:72,w:"বাহাতৰ",p:"báhatoro"},
  {n:73,w:"তিয়াতৰ",p:"tiyatoro"},
  {n:74,w:"চৌহাতৰ",p:"souhatoro"},
  {n:75,w:"পঁচাতৰ",p:"põsatoro"},
  {n:76,w:"ছিয়াতৰ",p:"siyatoro"},
  {n:77,w:"সাতাতৰ",p:"xátatoro"},
  {n:78,w:"আঠাতৰ",p:"athatoro"},
  {n:79,w:"উনআশী",p:"unaxi"},
  {n:80,w:"আশী",p:"axi"},
  {n:81,w:"একাশী",p:"ekaxi"},
  {n:82,w:"বিৰাশী",p:"biraxi"},
  {n:83,w:"ত্ৰাশী",p:"traxi"},
  {n:84,w:"চৌৰাশী",p:"souraxi"},
  {n:85,w:"পঁচাশী",p:"põsaxi"},
  {n:86,w:"ছিয়াশী",p:"siyaxi"},
  {n:87,w:"সাতাশী",p:"xátaxi"},
  {n:88,w:"আঠাশী",p:"athaxi"},
  {n:89,w:"উননব্বৈ",p:"unonobboi"},
  {n:90,w:"নব্বৈ",p:"nobboi"},
  {n:91,w:"একানব্বৈ",p:"ekanobboi"},
  {n:92,w:"বিয়ানব্বৈ",p:"biyanobboi"},
  {n:93,w:"ত্ৰিয়ানব্বৈ",p:"triyanobboi"},
  {n:94,w:"চৌৰানব্বৈ",p:"souranobboi"},
  {n:95,w:"পঁচানব্বৈ",p:"põsanobboi"},
  {n:96,w:"ছিয়ানব্বৈ",p:"siyanobboi"},
  {n:97,w:"সাতানব্বৈ",p:"xátanobboi"},
  {n:98,w:"আঠানব্বৈ",p:"athanobboi"},
  {n:99,w:"নিৰানব্বৈ",p:"niranobboi"},
  {n:100,w:"এশ",p:"ex"}
];

NUMBERS_DATA.forEach(x => x.numeral = toAssameseNumeral(x.n));

