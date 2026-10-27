import React, { useState, useEffect } from 'react';
import BrandLanding from './components/BrandLanding.jsx';
import WorkspaceShell from './components/WorkspaceShell.jsx';
import redesignCSS from './components/redesign.css?raw';
import { parseMetric, formatStreams, formatValue } from './data/metrics.js';
import { CSS, Icon, SoundoVaultLogo, SoundoVaultNav, ToastProvider, useToast, Badge, Field, Row, formatCurrency } from './components/shared.jsx';
import { sget, sset, KEYS, SEED_ARTISTS, SEED_DEALS, SEED_INVOICES, ADMIN_USERS, ARTIST_ACCOUNTS } from './data/index.js';
import {
  PortalOverview, PortalMessaging, PortalAnalytics, PortalDeals,
  PortalInvoices, PortalContracts, PortalSocials, PortalAI,
  PortalReferrals, PortalWeeklyReport, PortalNotifications, PortalProfile
} from './pages/portal.jsx';
import {
  AdminOverview, AdminRoster, AdminDeals, AdminProspects,
  AdminApplications, AdminFinancial, AdminMessages, AdminPublicRoster, AdminAISection,
  AddDealModal, AddArtistModal
} from './pages/admin.jsx';

// ── Inject CSS ─────────────────────────────────────────────────────────────────
function InjectCSS() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS + "\n" + redesignCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

// ── Splash Page ────────────────────────────────────────────────────────────────
function SplashPage({ onArtistLogin, onAdminTap, onApply }) {
  const [tapCount, setTapCount] = useState(0);
  const [stats, setStats] = useState([
    { value: '—', label: 'Signed Artists' },
    { value: '—', label: 'Total Streams' },
    { value: '—', label: 'Deal Value' },
    { value: '—', label: 'Active Deals' },
  ]);

  useEffect(() => {
    (async () => {
      const [artists, deals] = await Promise.all([
        sget(KEYS.artists),
        sget(KEYS.deals),
      ]);
      const a = artists || SEED_ARTISTS;
      const d = deals || SEED_DEALS;

      const artistCount = a.length;
      const activeDeals = d.filter(x => x.status === 'Active' || x.status === 'active').length;
      const totalValue = d.reduce((sum, x) => {
        const v = typeof x.value === 'number' ? x.value : parseFloat(String(x.value || '').replace(/[^0-9.]/g, '')) || 0;
        return sum + v;
      }, 0);

      const totalStreams = a.reduce((sum, ar) => sum + parseMetric(ar.streams), 0);

      setStats([
        { value: String(artistCount), label: 'Signed Artists' },
        { value: formatStreams(totalStreams), label: 'Total Streams' },
        { value: formatValue(totalValue), label: 'Deal Value' },
        { value: String(activeDeals), label: 'Active Deals' },
      ]);
    })();
  }, []);

  function handleLegacyTap() {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) { setTapCount(0); onAdminTap(); }
  }

  return <BrandLanding stats={stats} onArtistLogin={onArtistLogin} onApply={onApply} onLegacy={handleLegacyTap}/>;
}

// ── Artist Login ───────────────────────────────────────────────────────────────
function ArtistLogin({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function login() {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const acc = ARTIST_ACCOUNTS[email.toLowerCase()];
    if (acc && acc.password === password) {
      const artists = await sget(KEYS.artists) || SEED_ARTISTS;
      const artist = artists.find(a => a.id === acc.artistId);
      if (artist) { onLogin(artist); toast('Welcome back, ' + artist.name + '!', 'success'); }
      else setError('Artist profile not found');
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(22,93,255,0.1) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <SoundoVaultLogo size={48} />
        </div>
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Artist Portal</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>Sign in to access your dashboard</p>
          {error && (
            <div style={{ background: 'var(--red)22', border: '1px solid var(--red)44', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--red2)', marginBottom: 16 }}>{error}</div>
          )}
          <Field label="Email">
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nova@soundovault.com" onKeyDown={e => e.key === 'Enter' && login()} />
          </Field>
          <Field label="Password" style={{ marginTop: 12 }}>
            <div style={{ position: 'relative' }}>
              <input className="input" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && login()} style={{ paddingRight: 44 }} />
              <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <Icon name={show ? 'eye_off' : 'eye'} size={16} />
              </button>
            </div>
          </Field>
          <button onClick={login} disabled={loading} className="btn btn-primary w-full" style={{ marginTop: 20, padding: '12px 0', fontSize: 15 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <div style={{ marginTop: 16, padding: 12, background: 'var(--bg3)', borderRadius: 8, fontSize: 12, color: 'var(--text3)' }}>
            <strong style={{ color: 'var(--text2)' }}>Demo Accounts:</strong><br />
            nova@soundovault.com / artist2026<br />
            kstone@soundovault.com / artist2026<br />
            lyra@soundovault.com / artist2026
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={onBack} className="btn btn-ghost btn-sm"><Icon name="chevron_right" size={12} style={{ transform: 'rotate(180deg)' }} /> Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Artist Onboard ─────────────────────────────────────────────────────────────
function ArtistOnboard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', genre: '', email: '', bio: '', goals: '' });
  const toast = useToast();

  const steps = [
    { title: 'Artist Name', field: 'name', placeholder: 'Your stage name', type: 'text' },
    { title: 'Music Genre', field: 'genre', placeholder: 'e.g. Hip-Hop, Pop, R&B', type: 'text' },
    { title: 'Email Address', field: 'email', placeholder: 'your@email.com', type: 'email' },
    { title: 'Artist Bio', field: 'bio', placeholder: 'Tell us about yourself and your music...', type: 'textarea' },
    { title: 'Career Goals', field: 'goals', placeholder: 'What do you want to achieve with SoundoVault?', type: 'textarea' },
  ];

  const current = steps[step - 1];

  function next() {
    if (!form[current.field]?.trim()) { toast('Please fill in this field', 'error'); return; }
    if (current.field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast('Enter a valid email address', 'error'); return; }
    if (step < steps.length) setStep(s => s + 1);
    else submit();
  }

  async function submit() {
    const apps = await sget(KEYS.applications) || [];
    const newApp = { id: 'app' + Date.now(), ...form, status: 'Pending', submittedAt: Date.now() };
    await sset(KEYS.applications, [...apps, newApp]);
    toast('Application submitted!', 'success');
    onComplete();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SoundoVaultLogo size={40} />
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text2)' }}>Step {step} of {steps.length}</div>
          <div style={{ marginTop: 8 }} className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / steps.length) * 100}%` }} />
          </div>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{current.title}</h2>
          {current.type === 'textarea' ? (
            <textarea className="input" rows={5} value={form[current.field]} onChange={e => setForm(f => ({ ...f, [current.field]: e.target.value }))} placeholder={current.placeholder} style={{ resize: 'vertical' }} />
          ) : (
            <input className="input" type={current.type} value={form[current.field]} onChange={e => setForm(f => ({ ...f, [current.field]: e.target.value }))} placeholder={current.placeholder} onKeyDown={e => e.key === 'Enter' && current.type !== 'textarea' && next()} />
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => step > 1 ? setStep(s => s - 1) : onComplete()} className="btn btn-ghost" style={{ flex: 1 }}>{step > 1 ? 'Back' : 'Cancel'}</button>
            <button onClick={next} className="btn btn-primary" style={{ flex: 2 }}>
              {step === steps.length ? 'Submit Application' : 'Next'} <Icon name="chevron_right" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Artist Portal Shell ────────────────────────────────────────────────────────
function ArtistPortal({ artist: initialArtist, onLogout }) {
  const [artist, setArtist] = useState(initialArtist);
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'analytics', label: 'Analytics', icon: 'chart' },
    { id: 'deals', label: 'Deals', icon: 'briefcase' },
    { id: 'messages', label: 'Messages', icon: 'msg' },
    { id: 'invoices', label: 'Invoices', icon: 'file' },
    { id: 'contracts', label: 'Contracts', icon: 'shield' },
    { id: 'socials', label: 'Social Links', icon: 'globe' },
    { id: 'ai', label: 'AI Tools', icon: 'zap' },
    { id: 'referrals', label: 'Referrals', icon: 'gift' },
    { id: 'report', label: 'Weekly Report', icon: 'report' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'profile', label: 'Profile', icon: 'user' },
  ];

  const bottomTabs = [
    { id: 'overview', icon: 'home' },
    { id: 'analytics', icon: 'chart' },
    { id: 'deals', icon: 'briefcase' },
    { id: 'messages', icon: 'msg' },
    { id: 'ai', icon: 'zap' },
  ];

  function renderTab() {
    const props = { artist, onUpdate: setArtist };
    switch (tab) {
      case 'overview': return <PortalOverview {...props} onTab={setTab} />;
      case 'analytics': return <PortalAnalytics {...props} />;
      case 'deals': return <PortalDeals {...props} />;
      case 'messages': return <PortalMessaging {...props} />;
      case 'invoices': return <PortalInvoices {...props} />;
      case 'contracts': return <PortalContracts {...props} />;
      case 'socials': return <PortalSocials {...props} />;
      case 'ai': return <PortalAI {...props} />;
      case 'referrals': return <PortalReferrals {...props} />;
      case 'report': return <PortalWeeklyReport {...props} />;
      case 'notifications': return <PortalNotifications {...props} />;
      case 'profile': return <PortalProfile {...props} />;
      default: return null;
    }
  }

  return <WorkspaceShell tabs={tabs} tab={tab} onTab={setTab} onLogout={onLogout} name={artist.name}>{renderTab()}</WorkspaceShell>;
}

// ── Admin Login ────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function login() {
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    const user = ADMIN_USERS.find(u => u.username === username && u.password === password);
    if (user) { onLogin(username); toast('Welcome, ' + username, 'success'); }
    else setError('Invalid credentials');
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(123,32,249,0.14) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SoundoVaultLogo size={44} />
          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(123,32,249,.15)', border: '1px solid rgba(123,32,249,.4)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: '#A855F7', fontWeight: 600 }}>
            <Icon name="shield" size={12} /> ADMIN ACCESS
          </div>
        </div>
        <div className="card" style={{ padding: 32, borderColor: 'rgba(123,32,249,.3)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Admin Login</h2>
          {error && (
            <div style={{ background: 'var(--red)22', border: '1px solid var(--red)44', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'var(--red2)', marginBottom: 16 }}>{error}</div>
          )}
          <Field label="Username">
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" onKeyDown={e => e.key === 'Enter' && login()} />
          </Field>
          <Field label="Password" style={{ marginTop: 12 }}>
            <div style={{ position: 'relative' }}>
              <input className="input" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && login()} style={{ paddingRight: 44 }} />
              <button onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>
                <Icon name={show ? 'eye_off' : 'eye'} size={16} />
              </button>
            </div>
          </Field>
          <button onClick={login} disabled={loading} className="btn btn-primary w-full" style={{ marginTop: 20, padding: '12px 0', fontSize: 15, background: 'linear-gradient(135deg,#7B20F9,#165DFF)' }}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={onBack} className="btn btn-ghost btn-sm"><Icon name="chevron_right" size={12} style={{ transform: 'rotate(180deg)' }} /> Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard Shell ──────────────────────────────────────────────────────
function AdminDashboard({ adminUser, onLogout }) {
  const [tab, setTab] = useState('overview');
  const [artists, setArtists] = useState([]);
  const [deals, setDeals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [prospects, setProspects] = useState([]);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddArtist, setShowAddArtist] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editArtist, setEditArtist] = useState(null);

  useEffect(() => {
    (async () => {
      const [a, d, inv, p] = await Promise.all([
        sget(KEYS.artists), sget(KEYS.deals), sget(KEYS.invoices), sget(KEYS.prospects)
      ]);
      setArtists(a || SEED_ARTISTS);
      setDeals(d || SEED_DEALS);
      setInvoices(inv || SEED_INVOICES);
      setProspects(p || []);
    })();
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'home' },
    { id: 'roster', label: 'Roster', icon: 'users' },
    { id: 'deals', label: 'Deals', icon: 'briefcase' },
    { id: 'financial', label: 'Financial', icon: 'dollar' },
    { id: 'messages', label: 'Messages', icon: 'msg' },
    { id: 'prospects', label: 'Prospects', icon: 'trending' },
    { id: 'applications', label: 'Applications', icon: 'file' },
    { id: 'public', label: 'Public Roster', icon: 'globe' },
    { id: 'ai', label: 'AI Tools', icon: 'zap' },
  ];

  function renderTab() {
    switch (tab) {
      case 'overview': return <AdminOverview artists={artists} deals={deals} invoices={invoices} onTab={setTab} />;
      case 'roster': return <AdminRoster artists={artists} onAddArtist={() => setShowAddArtist(true)} onEditArtist={setEditArtist} />;
      case 'deals': return <AdminDeals deals={deals} artists={artists} onAddDeal={() => setShowAddDeal(true)} />;
      case 'financial': return <AdminFinancial invoices={invoices} artists={artists} />;
      case 'messages': return <AdminMessages artists={artists} />;
      case 'prospects': return <AdminProspects prospects={prospects} onUpdate={setProspects} />;
      case 'applications': return <AdminApplications />;
      case 'public': return <AdminPublicRoster artists={artists} />;
      case 'ai': return <AdminAISection artists={artists} />;
      default: return null;
    }
  }

  return <WorkspaceShell tabs={tabs} tab={tab} onTab={setTab} onLogout={onLogout} name={adminUser} admin>
    {renderTab()}
    {showAddDeal && <AddDealModal artists={artists} onAdd={setDeals} onClose={() => setShowAddDeal(false)} />}
    {showAddArtist && <AddArtistModal onAdd={setArtists} onClose={() => setShowAddArtist(false)} />}
    {editArtist && <AddArtistModal artist={editArtist} onAdd={setArtists} onClose={() => setEditArtist(null)} />}
  </WorkspaceShell>;
}

// ── Root App ───────────────────────────────────────────────────────────────────
function AppInner() {
  const [screen, setScreen] = useState('splash');
  const [artist, setArtist] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  if (screen === 'splash') return <SplashPage onArtistLogin={() => setScreen('artistLogin')} onAdminTap={() => setScreen('adminLogin')} onApply={() => setScreen('onboard')} />;
  if (screen === 'artistLogin') return <ArtistLogin onLogin={a => { setArtist(a); setScreen('portal'); }} onBack={() => setScreen('splash')} />;
  if (screen === 'onboard') return <ArtistOnboard onComplete={() => setScreen('splash')} />;
  if (screen === 'adminLogin') return <AdminLogin onLogin={u => { setAdminUser(u); setScreen('admin'); }} onBack={() => setScreen('splash')} />;
  if (screen === 'portal' && artist) return <ArtistPortal artist={artist} onLogout={() => { setArtist(null); setScreen('splash'); }} />;
  if (screen === 'admin' && adminUser) return <AdminDashboard adminUser={adminUser} onLogout={() => { setAdminUser(null); setScreen('splash'); }} />;
  return <SplashPage onArtistLogin={() => setScreen('artistLogin')} onAdminTap={() => setScreen('adminLogin')} onApply={() => setScreen('onboard')} />;
}

export default function App() {
  return (
    <ToastProvider>
      <InjectCSS />
      <AppInner />
    </ToastProvider>
  );
}
