import React, { useState, useEffect } from 'react';
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
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

// ── Splash Page ────────────────────────────────────────────────────────────────
function SplashPage({ onArtistLogin, onAdminTap }) {
  const [tapCount, setTapCount] = useState(0);

  function handleLegacyTap() {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) { setTapCount(0); onAdminTap(); }
  }

  const stats = [
    { value: '3', label: 'Signed Artists' },
    { value: '4.4M', label: 'Total Streams' },
    { value: '$192K', label: 'Deal Value' },
    { value: '3', label: 'Active Deals' },
  ];

  const features = [
    { icon: 'chart', title: 'Analytics Dashboard', desc: 'Real-time streaming stats, growth tracking, and platform insights' },
    { icon: 'briefcase', title: 'Deal Management', desc: 'Track brand deals, bookings, sync licenses, and negotiations' },
    { icon: 'zap', title: 'AI-Powered Tools', desc: 'Claude AI for content generation, career coaching, and deal scouting' },
    { icon: 'file', title: 'Contracts & Invoices', desc: 'Manage agreements, track payments, and monitor financial health' },
    { icon: 'msg', title: 'Direct Messaging', desc: 'Secure communication channel between artists and management' },
    { icon: 'report', title: 'Weekly Reports', desc: 'AI-generated performance reports delivered every week' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <SoundoVaultLogo size={36} />
        <button onClick={onArtistLogin} className="btn btn-primary">Artist Login</button>
      </nav>

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)' }}>
        <div style={{ marginBottom: 32 }}>
          <SoundoVaultLogo size={80} showText={false} />
        </div>
        <h1 style={{ fontSize: 'clamp(32px,6vw,60px)', fontWeight: 900, letterSpacing: '-.02em', marginBottom: 16, lineHeight: 1.1 }}>
          <span style={{ background: 'linear-gradient(135deg,#C9972A,#F0C040,#FFE066,#F0C040,#C9972A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite' }}>SoundoVault</span>
        </h1>
        <p style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: 'var(--text2)', maxWidth: 520, lineHeight: 1.6, marginBottom: 32 }}>
          The premier artist management platform for the next generation of music talent
        </p>
        <button onClick={onArtistLogin} className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
          <Icon name="music" size={16} /> Access Your Portal
        </button>
        <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text3)' }}>Demo: nova@soundovault.com / artist2026</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 0, background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '20px 12px', borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none', maxWidth: 180 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ padding: '48px 24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Everything Your Career Needs</h2>
        <div className="grid-3">
          {features.map(f => (
            <div key={f.title} className="card card-hover">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gold)22', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon name={f.icon} size={20} color="var(--gold)" />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text3)', fontSize: 13 }}>
        <span onClick={handleLegacyTap} style={{ cursor: 'default', userSelect: 'none' }}>LEGACY</span>
        {' · '}© 2026 SoundoVault · Powered by VNC
      </div>
    </div>
  );
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 70%)' }}>
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
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="btn btn-ghost" style={{ flex: 1 }}>Back</button>}
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setSidebarOpen(s => !s)} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
          <Icon name="menu" size={16} />
        </button>
        <SoundoVaultLogo size={28} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${artist.color},${artist.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14, flexShrink: 0 }}>{artist.name?.[0]}</div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '20px 12px', zIndex: 1, overflowY: 'auto' }}>
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <SoundoVaultLogo size={28} />
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text2)' }}>{artist.name}</div>
            </div>
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                className={`nav-link ${tab === t.id ? 'active' : ''}`}>
                <Icon name={t.icon} size={16} /> {t.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={onLogout} className="nav-link" style={{ marginTop: 20, color: 'var(--red2)' }}>
              <Icon name="logout" size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', maxWidth: 800, width: '100%', margin: '0 auto', paddingBottom: 80 }} className="page">
        <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18 }}>
          {tabs.find(t => t.id === tab)?.label}
        </div>
        {renderTab()}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg2)', borderTop: '1px solid var(--border)', display: 'flex', padding: '8px 0', zIndex: 100 }}>
        {bottomTabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0', background: 'none', border: 'none', color: tab === t.id ? 'var(--gold)' : 'var(--text3)', cursor: 'pointer', transition: 'color .2s' }}>
            <Icon name={t.icon} size={20} />
          </button>
        ))}
      </div>
    </div>
  );
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 70%)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SoundoVaultLogo size={44} />
          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--red)22', border: '1px solid var(--red)44', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: 'var(--red2)', fontWeight: 600 }}>
            <Icon name="shield" size={12} /> ADMIN ACCESS
          </div>
        </div>
        <div className="card" style={{ padding: 32, borderColor: 'rgba(220,38,38,.2)' }}>
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
          <button onClick={login} disabled={loading} className="btn btn-danger w-full" style={{ marginTop: 20, padding: '12px 0', fontSize: 15 }}>
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg2)', borderBottom: '1px solid rgba(220,38,38,.3)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => setSidebarOpen(s => !s)} className="btn btn-ghost btn-sm"><Icon name="menu" size={16} /></button>
        <SoundoVaultLogo size={28} />
        <div style={{ flex: 1 }} />
        <Badge color="var(--red2)">Admin</Badge>
        <button onClick={onLogout} className="btn btn-ghost btn-sm"><Icon name="logout" size={14} /></button>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', width: 220, background: 'var(--bg2)', borderRight: '1px solid rgba(220,38,38,.2)', display: 'flex', flexDirection: 'column', padding: '20px 12px', zIndex: 1, overflowY: 'auto' }}>
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <Badge color="var(--red2)">ADMIN — {adminUser}</Badge>
            </div>
            {tabs.map(t => (
              <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false); }}
                className={`nav-link ${tab === t.id ? 'active' : ''}`}
                style={tab === t.id ? { borderColor: 'rgba(220,38,38,.3)', color: 'var(--red2)' } : {}}>
                <Icon name={t.icon} size={16} /> {t.label}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={onLogout} className="nav-link" style={{ marginTop: 20, color: 'var(--red2)' }}>
              <Icon name="logout" size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', maxWidth: 1000, width: '100%', margin: '0 auto', paddingBottom: 80 }} className="page">
        <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18 }}>
          {tabs.find(t => t.id === tab)?.label}
        </div>
        {renderTab()}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--bg2)', borderTop: '1px solid rgba(220,38,38,.2)', display: 'flex', padding: '8px 0', zIndex: 100 }}>
        {tabs.slice(0, 5).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 0', background: 'none', border: 'none', color: tab === t.id ? 'var(--red2)' : 'var(--text3)', cursor: 'pointer', transition: 'color .2s' }}>
            <Icon name={t.icon} size={20} />
          </button>
        ))}
      </div>

      {showAddDeal && <AddDealModal artists={artists} onAdd={setDeals} onClose={() => setShowAddDeal(false)} />}
      {showAddArtist && <AddArtistModal onAdd={setArtists} onClose={() => setShowAddArtist(false)} />}
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────────────────────
function AppInner() {
  const [screen, setScreen] = useState('splash');
  const [artist, setArtist] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  if (screen === 'splash') return <SplashPage onArtistLogin={() => setScreen('artistLogin')} onAdminTap={() => setScreen('adminLogin')} />;
  if (screen === 'artistLogin') return <ArtistLogin onLogin={a => { setArtist(a); setScreen('portal'); }} onBack={() => setScreen('splash')} />;
  if (screen === 'onboard') return <ArtistOnboard onComplete={() => setScreen('splash')} />;
  if (screen === 'adminLogin') return <AdminLogin onLogin={u => { setAdminUser(u); setScreen('admin'); }} onBack={() => setScreen('splash')} />;
  if (screen === 'portal' && artist) return <ArtistPortal artist={artist} onLogout={() => { setArtist(null); setScreen('splash'); }} />;
  if (screen === 'admin' && adminUser) return <AdminDashboard adminUser={adminUser} onLogout={() => { setAdminUser(null); setScreen('splash'); }} />;
  return <SplashPage onArtistLogin={() => setScreen('artistLogin')} onAdminTap={() => setScreen('adminLogin')} />;
}

export default function App() {
  return (
    <ToastProvider>
      <InjectCSS />
      <AppInner />
    </ToastProvider>
  );
}
