export const KEYS = {
  artists: 'sv_artists',
  deals: 'sv_deals',
  prospects: 'sv_prospects',
  messages: 'sv_messages',
  invoices: 'sv_invoices',
  notifications: 'sv_notifications',
  contracts: 'sv_contracts',
  applications: 'sv_applications',
};

export async function sget(key) {
  try {
    const r = await window.storage.get(key);
    if (!r) return null;
    return JSON.parse(r.value);
  } catch { return null; }
}

export async function sset(key, val) {
  try {
    await window.storage.set(key, JSON.stringify(val));
  } catch {}
}

export const SEED_ARTISTS = [
  {
    id: 'a1', name: 'NOVA', email: 'nova@soundovault.com',
    genre: 'Pop/Electronic', stage: 'Signed', color: '#7c3aed',
    bio: 'Electro-pop sensation with 2M monthly listeners.',
    streams: 2100000, growth: 18, followers: 145000,
    joinDate: '2024-01-15', dealValue: 85000,
    avatar: null, socials: { ig: '@novamusic', tiktok: '@novaofficial', spotify: 'nova-artist' },
    weeklyReport: null,
  },
  {
    id: 'a2', name: 'K-STONE', email: 'kstone@soundovault.com',
    genre: 'Hip-Hop', stage: 'Development', color: '#0891b2',
    bio: 'Underground hip-hop with razor-sharp lyricism.',
    streams: 890000, growth: 34, followers: 67000,
    joinDate: '2024-03-22', dealValue: 42000,
    avatar: null, socials: { ig: '@kstone', tiktok: '@kstonerap', spotify: 'k-stone' },
    weeklyReport: null,
  },
  {
    id: 'a3', name: 'LYRA', email: 'lyra@soundovault.com',
    genre: 'R&B/Soul', stage: 'Signed', color: '#059669',
    bio: 'Soulful R&B artist with a cinematic sound.',
    streams: 1450000, growth: 22, followers: 98000,
    joinDate: '2024-02-10', dealValue: 67000,
    avatar: null, socials: { ig: '@lyrasoul', tiktok: '@lyraofficial', spotify: 'lyra-artist' },
    weeklyReport: null,
  },
];

export const SEED_DEALS = [
  { id: 'd1', artistId: 'a1', title: 'Brand Partnership – TechWear Co', value: 25000, status: 'Active', type: 'Brand Deal', date: '2024-10-01', notes: 'Social campaign Q4' },
  { id: 'd2', artistId: 'a1', title: 'Festival Booking – SunFest', value: 15000, status: 'Pending', type: 'Booking', date: '2024-11-15', notes: 'Headliner slot' },
  { id: 'd3', artistId: 'a3', title: 'Sync License – Netflix Show', value: 35000, status: 'Closed', type: 'Sync', date: '2024-09-20', notes: 'Background score' },
  { id: 'd4', artistId: 'a2', title: 'Album Distribution Deal', value: 18000, status: 'Negotiation', type: 'Distribution', date: '2024-10-10', notes: 'Indie label' },
];

export const SEED_PROSPECTS = [
  { id: 'p1', name: 'ZARA ECHO', genre: 'Afrobeats', followers: 45000, score: 87, status: 'Hot Lead', notes: 'Viral TikTok, 3M views', contacted: true },
  { id: 'p2', name: 'GHOST THEORY', genre: 'Alternative', followers: 28000, score: 72, status: 'Contacted', notes: 'College circuit buzz', contacted: true },
  { id: 'p3', name: 'MILO WAVE', genre: 'Lo-Fi Hip-Hop', followers: 92000, score: 91, status: 'Hot Lead', notes: 'YouTube channel 500K subs', contacted: false },
];

export const SEED_MESSAGES = [
  { id: 'm1', artistId: 'a1', from: 'admin', content: 'Great job on the festival booking!', ts: Date.now() - 86400000, read: true },
  { id: 'm2', artistId: 'a1', from: 'a1', content: 'Thanks! When does the contract come through?', ts: Date.now() - 43200000, read: false },
  { id: 'm3', artistId: 'a3', from: 'admin', content: 'Netflix deal is confirmed. Congrats!', ts: Date.now() - 3600000, read: false },
];

export const SEED_INVOICES = [
  { id: 'i1', artistId: 'a1', title: 'Q3 Management Fee', amount: 8500, status: 'Paid', date: '2024-09-30', due: '2024-10-15' },
  { id: 'i2', artistId: 'a3', title: 'Sync Deal Commission', amount: 3500, status: 'Pending', date: '2024-10-01', due: '2024-10-31' },
  { id: 'i3', artistId: 'a2', title: 'Studio Session Advance', amount: 5000, status: 'Overdue', date: '2024-08-01', due: '2024-09-01' },
];

export const SEED_NOTIFICATIONS = [
  { id: 'n1', artistId: 'a1', type: 'deal', message: 'New deal proposal from SunFest', ts: Date.now() - 7200000, read: false },
  { id: 'n2', artistId: 'a3', type: 'payment', message: 'Invoice #i2 is due in 5 days', ts: Date.now() - 14400000, read: false },
  { id: 'n3', artistId: 'a1', type: 'message', message: 'New message from your manager', ts: Date.now() - 21600000, read: true },
];

export const SEED_CONTRACTS = [
  { id: 'c1', artistId: 'a1', title: 'Management Agreement 2024', status: 'Active', signedDate: '2024-01-15', expiryDate: '2025-01-15', value: 85000 },
  { id: 'c2', artistId: 'a3', title: 'Recording Contract', status: 'Active', signedDate: '2024-02-10', expiryDate: '2026-02-10', value: 67000 },
  { id: 'c3', artistId: 'a2', title: 'Artist Development Deal', status: 'Pending Signature', signedDate: null, expiryDate: '2025-03-22', value: 42000 },
];

export const ADMIN_USERS = [
  { username: 'admin', password: 'sv@admin2026' },
  { username: 'vincithe1', password: 'Therealwhodee' },
];

export const ARTIST_ACCOUNTS = {
  'nova@soundovault.com': { artistId: 'a1', password: 'artist2026' },
  'kstone@soundovault.com': { artistId: 'a2', password: 'artist2026' },
  'lyra@soundovault.com': { artistId: 'a3', password: 'artist2026' },
};
