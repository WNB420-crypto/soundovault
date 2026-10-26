import React, { useState, useEffect } from 'react';
import { Icon, Badge, StatCard, EmptyState, Field, Row, formatCurrency, formatDate, timeAgo, useToast, Modal, SearchBar } from '../components/shared.jsx';
import { AIManagerChat, AIContentGenerator, AICareerCoach, AIDealScout, generateWeeklyReport } from '../components/ai.jsx';
import { sget, sset, KEYS, SEED_MESSAGES, SEED_INVOICES, SEED_DEALS, SEED_CONTRACTS, SEED_NOTIFICATIONS } from '../data/index.js';

// ── Overview ──────────────────────────────────────────────────────────────────
export function PortalOverview({ artist, onTab }) {
  const [deals, setDeals] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      const d = await sget(KEYS.deals) || SEED_DEALS;
      const inv = await sget(KEYS.invoices) || SEED_INVOICES;
      const n = await sget(KEYS.notifications) || SEED_NOTIFICATIONS;
      setDeals((d || []).filter(x => x.artistId === artist.id));
      setInvoices((inv || []).filter(x => x.artistId === artist.id));
      setNotifications((n || []).filter(x => x.artistId === artist.id && !x.read).slice(0, 3));
    })();
  }, [artist.id]);

  const activeDeals = deals.filter(d => d.status === 'Active');
  const pendingInvoices = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  const totalEarnings = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${artist.color}22, ${artist.color}08)`, border: `1px solid ${artist.color}44`, borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Welcome back, {artist.name} 👋</div>
        <div style={{ color: 'var(--text2)', fontSize: 15 }}>{artist.genre} • Joined {formatDate(artist.joinDate)}</div>
      </div>
      <div className="grid-2">
        <StatCard label="Monthly Streams" value={(artist.streams || 0).toLocaleString()} change={artist.growth} icon="music" color={artist.color} />
        <StatCard label="Followers" value={(artist.followers || 0).toLocaleString()} icon="users" color="var(--blue)" />
        <StatCard label="Active Deals" value={activeDeals.length} icon="briefcase" color="var(--green)" />
        <StatCard label="Lifetime Earnings" value={formatCurrency(totalEarnings)} icon="dollar" color="var(--gold)" />
      </div>
      {notifications.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="bell" size={16} color="var(--gold)" /> Notifications
          </div>
          {notifications.map(n => (
            <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', marginTop: 6, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14 }}>{n.message}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{timeAgo(n.ts)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {pendingInvoices.length > 0 && (
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="file" size={16} color="var(--red2)" /> Pending Invoices
          </div>
          {pendingInvoices.map(inv => (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14 }}>{inv.title}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: inv.status === 'Overdue' ? 'var(--red2)' : 'var(--gold)' }}>{formatCurrency(inv.amount)}</span>
                <Badge color={inv.status === 'Overdue' ? 'var(--red2)' : 'var(--gold)'}>{inv.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messaging ─────────────────────────────────────────────────────────────────
export function PortalMessaging({ artist }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.messages) || SEED_MESSAGES;
      setMsgs((all || []).filter(m => m.artistId === artist.id));
    })();
  }, [artist.id]);

  async function send() {
    if (!input.trim()) return;
    const msg = { id: 'm' + Date.now(), artistId: artist.id, from: artist.id, content: input, ts: Date.now(), read: false };
    const all = await sget(KEYS.messages) || SEED_MESSAGES;
    const updated = [...(all || []), msg];
    await sset(KEYS.messages, updated);
    setMsgs(updated.filter(m => m.artistId === artist.id));
    setInput('');
    toast('Message sent!', 'success');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 0' }}>
        {msgs.length === 0 && <EmptyState icon="msg" title="No messages yet" sub="Start a conversation with your manager" />}
        {msgs.map(m => (
          <div key={m.id} style={{
            background: m.from === 'admin' ? 'var(--bg3)' : `${artist.color}22`,
            border: `1px solid ${m.from === 'admin' ? 'var(--border)' : artist.color + '44'}`,
            borderRadius: 12, padding: '12px 16px',
            alignSelf: m.from === 'admin' ? 'flex-start' : 'flex-end',
            maxWidth: '80%'
          }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, fontWeight: 600 }}>
              {m.from === 'admin' ? 'Manager' : artist.name} • {timeAgo(m.ts)}
            </div>
            <div style={{ fontSize: 14 }}>{m.content}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Message your manager..." onKeyDown={e => e.key === 'Enter' && send()} />
        <button onClick={send} className="btn btn-primary"><Icon name="send" size={14} /></button>
      </div>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export function PortalAnalytics({ artist }) {
  const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const baseStreams = artist.streams || 500000;
  const streamData = months.map((_, i) => Math.floor(baseStreams * (0.6 + i * 0.08)));
  const maxVal = Math.max(...streamData);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="grid-2">
        <StatCard label="Monthly Streams" value={(artist.streams || 0).toLocaleString()} change={artist.growth} icon="music" color={artist.color} />
        <StatCard label="Monthly Growth" value={`+${artist.growth || 0}%`} icon="trending" color="var(--green)" />
        <StatCard label="Total Followers" value={(artist.followers || 0).toLocaleString()} icon="users" color="var(--blue)" />
        <StatCard label="Deal Value" value={formatCurrency(artist.dealValue)} icon="dollar" color="var(--gold)" />
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Streaming Trend (6 months)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
          {streamData.map((val, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{Math.floor(val / 1000)}K</div>
              <div style={{
                width: '100%', height: `${(val / maxVal) * 100}px`,
                background: `linear-gradient(to top, ${artist.color}, ${artist.color}88)`,
                borderRadius: '4px 4px 0 0', minHeight: 4,
                transition: 'height .5s ease',
              }} />
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>{months[i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Platform Distribution</div>
        {[
          { name: 'Spotify', pct: 48, color: '#1DB954' },
          { name: 'Apple Music', pct: 28, color: '#FA243C' },
          { name: 'YouTube', pct: 16, color: '#FF0000' },
          { name: 'Other', pct: 8, color: 'var(--text3)' },
        ].map(p => (
          <div key={p.name} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span>{p.name}</span><span style={{ color: p.color, fontWeight: 600 }}>{p.pct}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${p.pct}%`, background: p.color }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Deals ─────────────────────────────────────────────────────────────────────
export function PortalDeals({ artist }) {
  const [deals, setDeals] = useState([]);
  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.deals) || SEED_DEALS;
      setDeals((all || []).filter(d => d.artistId === artist.id));
    })();
  }, [artist.id]);

  const statusColor = { Active: 'var(--green)', Pending: 'var(--gold)', Closed: 'var(--text3)', Negotiation: 'var(--blue)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="grid-2">
        <StatCard label="Total Deals" value={deals.length} icon="briefcase" color="var(--blue)" />
        <StatCard label="Total Value" value={formatCurrency(deals.reduce((s, d) => s + d.value, 0))} icon="dollar" color="var(--gold)" />
      </div>
      {deals.length === 0 ? <EmptyState icon="briefcase" title="No deals yet" sub="Your manager will add deals here" /> :
        deals.map(d => (
          <div key={d.id} className="card card-hover">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{d.title}</div>
              <Badge color={statusColor[d.status] || 'var(--text3)'}>{d.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: 13 }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatCurrency(d.value)}</span>
              <span>{d.type}</span>
              <span>{formatDate(d.date)}</span>
            </div>
            {d.notes && <div style={{ marginTop: 8, fontSize: 13, color: 'var(--text2)' }}>{d.notes}</div>}
          </div>
        ))
      }
    </div>
  );
}

// ── Invoices ──────────────────────────────────────────────────────────────────
export function PortalInvoices({ artist }) {
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.invoices) || SEED_INVOICES;
      setInvoices((all || []).filter(i => i.artistId === artist.id));
    })();
  }, [artist.id]);

  const statusColor = { Paid: 'var(--green)', Pending: 'var(--gold)', Overdue: 'var(--red2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {invoices.length === 0 ? <EmptyState icon="file" title="No invoices" sub="Invoices will appear here" /> :
        invoices.map(inv => (
          <div key={inv.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{inv.title}</div>
              <Badge color={statusColor[inv.status]}>{inv.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text2)' }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatCurrency(inv.amount)}</span>
              <span>Issued: {formatDate(inv.date)}</span>
              <span>Due: {formatDate(inv.due)}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Contracts ─────────────────────────────────────────────────────────────────
export function PortalContracts({ artist }) {
  const [contracts, setContracts] = useState([]);
  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.contracts) || SEED_CONTRACTS;
      setContracts((all || []).filter(c => c.artistId === artist.id));
    })();
  }, [artist.id]);

  const statusColor = { Active: 'var(--green)', 'Pending Signature': 'var(--gold)', Expired: 'var(--text3)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {contracts.length === 0 ? <EmptyState icon="file" title="No contracts" sub="Contracts will appear here" /> :
        contracts.map(c => (
          <div key={c.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <Badge color={statusColor[c.status] || 'var(--text3)'}>{c.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text2)' }}>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{formatCurrency(c.value)}</span>
              {c.signedDate && <span>Signed: {formatDate(c.signedDate)}</span>}
              <span>Expires: {formatDate(c.expiryDate)}</span>
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Socials ───────────────────────────────────────────────────────────────────
export function PortalSocials({ artist, onUpdate }) {
  const [socials, setSocials] = useState(artist.socials || {});
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function save() {
    setSaving(true);
    const artists = await sget(KEYS.artists) || [];
    const updated = artists.map(a => a.id === artist.id ? { ...a, socials } : a);
    await sset(KEYS.artists, updated);
    onUpdate({ ...artist, socials });
    toast('Social links saved!', 'success');
    setSaving(false);
  }

  const platforms = [
    { key: 'ig', label: 'Instagram', icon: 'instagram', placeholder: '@handle' },
    { key: 'tiktok', label: 'TikTok', icon: 'tiktok', placeholder: '@handle' },
    { key: 'spotify', label: 'Spotify', icon: 'spotify', placeholder: 'Artist name' },
    { key: 'youtube', label: 'YouTube', icon: 'youtube', placeholder: 'Channel name' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {platforms.map(p => (
          <Field key={p.key} label={p.label}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Icon name={p.icon} size={18} color="var(--text2)" />
              <input className="input" value={socials[p.key] || ''} placeholder={p.placeholder}
                onChange={e => setSocials(s => ({ ...s, [p.key]: e.target.value }))} />
            </div>
          </Field>
        ))}
      </div>
      <button onClick={save} className="btn btn-primary w-full" disabled={saving}>
        <Icon name="check" size={14} /> Save Social Links
      </button>
    </div>
  );
}

// ── AI Tab ─────────────────────────────────────────────────────────────────────
export function PortalAI({ artist }) {
  const [tab, setTab] = useState('chat');
  const tabs = [
    { id: 'chat', label: 'AI Manager', icon: 'msg' },
    { id: 'content', label: 'Content Gen', icon: 'edit' },
    { id: 'coach', label: 'Career Coach', icon: 'award' },
    { id: 'deals', label: 'Deal Scout', icon: 'target' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab ${tab === t.id ? 'active' : ''}`}>
            <Icon name={t.icon} size={13} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'chat' && <AIManagerChat artist={artist} />}
      {tab === 'content' && <AIContentGenerator artist={artist} />}
      {tab === 'coach' && <AICareerCoach artist={artist} />}
      {tab === 'deals' && <AIDealScout artist={artist} />}
    </div>
  );
}

// ── Referrals ─────────────────────────────────────────────────────────────────
export function PortalReferrals({ artist }) {
  const code = `SV-${artist.id?.toUpperCase()}-2026`;
  const [copied, setCopied] = useState(false);
  function copy() { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ background: 'linear-gradient(135deg,var(--gold)22,var(--gold)08)', border: '1px solid var(--gold)44' }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Refer an Artist 🎵</div>
        <div style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 16 }}>Earn $500 for every artist you refer who signs with SoundoVault</div>
        <div style={{ background: 'var(--bg2)', borderRadius: 8, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: '.1em', color: 'var(--gold)', fontWeight: 700 }}>{code}</span>
          <button onClick={copy} className="btn btn-ghost btn-sm">{copied ? 'Copied!' : <><Icon name="copy" size={12} /> Copy</>}</button>
        </div>
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 12 }}>How It Works</div>
        {[
          { step: '1', text: 'Share your referral code with artists' },
          { step: '2', text: 'They apply through SoundoVault using your code' },
          { step: '3', text: 'They get signed and complete their first deal' },
          { step: '4', text: 'You receive $500 in your next invoice' },
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.step}</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', paddingTop: 4 }}>{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weekly Report ──────────────────────────────────────────────────────────────
export function PortalWeeklyReport({ artist, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(artist.weeklyReport);
  const toast = useToast();

  async function generate() {
    setLoading(true);
    try {
      const text = await generateWeeklyReport(artist);
      setReport(text);
      const artists = await sget(KEYS.artists) || [];
      const updated = artists.map(a => a.id === artist.id ? { ...a, weeklyReport: text, reportDate: Date.now() } : a);
      await sset(KEYS.artists, updated);
      onUpdate({ ...artist, weeklyReport: text, reportDate: Date.now() });
      toast('Report generated!', 'success');
    } catch (e) {
      toast('Error: ' + e.message, 'error');
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Weekly Performance Report</div>
          {artist.reportDate && <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>Last generated: {timeAgo(artist.reportDate)}</div>}
        </div>
        <button onClick={generate} className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating...' : <><Icon name="zap" size={14} /> Generate</>}
        </button>
      </div>
      {report ? (
        <div className="ai-msg" style={{ lineHeight: 1.8 }}>{report}</div>
      ) : (
        <EmptyState icon="report" title="No report yet" sub="Click Generate to create your weekly performance report using AI" />
      )}
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
export function PortalNotifications({ artist }) {
  const [notifs, setNotifs] = useState([]);
  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.notifications) || SEED_NOTIFICATIONS;
      setNotifs((all || []).filter(n => n.artistId === artist.id));
    })();
  }, [artist.id]);

  async function markRead(id) {
    const all = await sget(KEYS.notifications) || SEED_NOTIFICATIONS;
    const updated = (all || []).map(n => n.id === id ? { ...n, read: true } : n);
    await sset(KEYS.notifications, updated);
    setNotifs(updated.filter(n => n.artistId === artist.id));
  }

  const typeIcon = { deal: 'briefcase', payment: 'dollar', message: 'msg' };
  const typeColor = { deal: 'var(--blue)', payment: 'var(--gold)', message: 'var(--purple)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {notifs.length === 0 ? <EmptyState icon="bell" title="All caught up!" sub="No notifications" /> :
        notifs.map(n => (
          <div key={n.id} className="card" style={{ opacity: n.read ? .6 : 1 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${typeColor[n.type]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={typeIcon[n.type] || 'bell'} size={16} color={typeColor[n.type]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>{n.message}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{timeAgo(n.ts)}</div>
              </div>
              {!n.read && (
                <button onClick={() => markRead(n.id)} className="btn btn-ghost btn-sm"><Icon name="check" size={12} /> Mark read</button>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
export function PortalProfile({ artist, onUpdate }) {
  const [form, setForm] = useState({ name: artist.name, genre: artist.genre, bio: artist.bio || '' });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function save() {
    setSaving(true);
    const artists = await sget(KEYS.artists) || [];
    const updated = artists.map(a => a.id === artist.id ? { ...a, ...form } : a);
    await sset(KEYS.artists, updated);
    onUpdate({ ...artist, ...form });
    toast('Profile updated!', 'success');
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, padding: 20, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg,${artist.color},${artist.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {artist.name?.[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>{artist.name}</div>
          <div style={{ color: 'var(--text2)', fontSize: 14 }}>{artist.email}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <Field label="Artist Name">
          <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Genre">
          <input className="input" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} />
        </Field>
        <Field label="Bio">
          <textarea className="input" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
        </Field>
      </div>
      <button onClick={save} className="btn btn-primary w-full" disabled={saving}>
        <Icon name="check" size={14} /> Save Changes
      </button>
    </div>
  );
}
