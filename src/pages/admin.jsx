import React, { useState, useEffect } from 'react';
import { Icon, Badge, StatCard, EmptyState, Field, Row, formatCurrency, formatDate, timeAgo, useToast, Modal, SearchBar } from '../components/shared.jsx';
import { AdminAITools } from '../components/ai.jsx';
import { sget, sset, KEYS, SEED_ARTISTS, SEED_DEALS, SEED_PROSPECTS, SEED_MESSAGES, SEED_INVOICES, SEED_NOTIFICATIONS } from '../data/index.js';

// ── Overview ──────────────────────────────────────────────────────────────────
export function AdminOverview({ artists, deals, invoices, onTab }) {
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const activeDeals = deals.filter(d => d.status === 'Active');
  const totalStreams = artists.reduce((s, a) => s + (a.streams || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="grid-4">
        <StatCard label="Total Artists" value={artists.length} icon="users" color="var(--blue)" />
        <StatCard label="Active Deals" value={activeDeals.length} icon="briefcase" color="var(--green)" />
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon="dollar" color="var(--gold)" />
        <StatCard label="Total Streams" value={`${(totalStreams / 1000000).toFixed(1)}M`} icon="music" color="var(--purple)" />
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Artist Roster</span>
          <Badge color="var(--green)">{artists.filter(a => a.stage === 'Signed').length} Signed</Badge>
        </div>
        {artists.map(a => (
          <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${a.color},${a.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {a.name?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.genre} • {(a.streams || 0).toLocaleString()} streams</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Badge color={a.stage === 'Signed' ? 'var(--green)' : 'var(--gold)'}>{a.stage}</Badge>
              <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4 }}>+{a.growth}% growth</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Recent Deals</div>
        {deals.slice(0, 5).map(d => {
          const artist = artists.find(a => a.id === d.artistId);
          return (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{d.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{artist?.name} • {d.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--gold)' }}>{formatCurrency(d.value)}</div>
                <Badge color={{ Active: 'var(--green)', Pending: 'var(--gold)', Closed: 'var(--text3)', Negotiation: 'var(--blue)' }[d.status]}>{d.status}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Roster ─────────────────────────────────────────────────────────────────────
export function AdminRoster({ artists, onAddArtist, onEditArtist }) {
  const [search, setSearch] = useState('');
  const filtered = artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.genre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ flex: 1 }}><SearchBar value={search} onChange={setSearch} placeholder="Search artists..." /></div>
        <button onClick={onAddArtist} className="btn btn-primary"><Icon name="plus" size={14} /> Add Artist</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(a => (
          <div key={a.id} className="card card-hover" style={{ borderLeft: `4px solid ${a.color}` }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${a.color},${a.color}66)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{a.name?.[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)' }}>{a.genre} • {a.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Badge color={a.stage === 'Signed' ? 'var(--green)' : 'var(--gold)'}>{a.stage}</Badge>
                    <button onClick={() => onEditArtist(a)} className="btn btn-ghost btn-sm"><Icon name="edit" size={12} /></button>
                  </div>
                </div>
                <div className="grid-3" style={{ gap: 8 }}>
                  <div style={{ background: 'var(--bg3)', padding: '6px 10px', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>STREAMS</div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{(a.streams || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', padding: '6px 10px', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>GROWTH</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--green)' }}>+{a.growth}%</div>
                  </div>
                  <div style={{ background: 'var(--bg3)', padding: '6px 10px', borderRadius: 6 }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>DEAL VALUE</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gold)' }}>{formatCurrency(a.dealValue)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Deals ─────────────────────────────────────────────────────────────────────
export function AdminDeals({ deals, artists, onAddDeal }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const statusColor = { Active: 'var(--green)', Pending: 'var(--gold)', Closed: 'var(--text3)', Negotiation: 'var(--blue)' };
  const filtered = deals.filter(d => {
    const a = artists.find(x => x.id === d.artistId);
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || (a?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || d.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}><SearchBar value={search} onChange={setSearch} placeholder="Search deals..." /></div>
        {['All', 'Active', 'Pending', 'Negotiation', 'Closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`tab ${filter === s ? 'active' : ''}`}>{s}</button>
        ))}
        <button onClick={onAddDeal} className="btn btn-primary btn-sm"><Icon name="plus" size={12} /> Add Deal</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(d => {
          const artist = artists.find(a => a.id === d.artistId);
          return (
            <div key={d.id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{d.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>
                    <span style={{ color: artist?.color || 'var(--text2)', fontWeight: 600 }}>{artist?.name}</span> • {d.type} • {formatDate(d.date)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--gold)' }}>{formatCurrency(d.value)}</div>
                  <Badge color={statusColor[d.status]}>{d.status}</Badge>
                </div>
              </div>
              {d.notes && <div style={{ fontSize: 13, color: 'var(--text2)' }}>{d.notes}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Prospects ─────────────────────────────────────────────────────────────────
export function AdminProspects({ prospects, onUpdate }) {
  const statusColor = { 'Hot Lead': 'var(--red2)', Contacted: 'var(--blue)', Qualified: 'var(--green)', 'Passed': 'var(--text3)' };

  async function updateStatus(id, status) {
    const updated = prospects.map(p => p.id === id ? { ...p, status } : p);
    await sset(KEYS.prospects, updated);
    onUpdate(updated);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {prospects.map(p => (
        <div key={p.id} className="card card-hover">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)' }}>{p.genre} • {(p.followers || 0).toLocaleString()} followers</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: p.score >= 80 ? 'var(--green)' : p.score >= 60 ? 'var(--gold)' : 'var(--text2)' }}>{p.score}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>AI Score</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>{p.notes}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Badge color={statusColor[p.status] || 'var(--text3)'}>{p.status}</Badge>
            <select className="input" value={p.status} onChange={e => updateStatus(p.id, e.target.value)} style={{ width: 'auto', padding: '4px 8px', fontSize: 12 }}>
              {['Hot Lead', 'Contacted', 'Qualified', 'Passed'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Applications ──────────────────────────────────────────────────────────────
export function AdminApplications({ onUpdate }) {
  const [apps, setApps] = useState([]);
  useEffect(() => {
    (async () => { setApps(await sget(KEYS.applications) || []); })();
  }, []);

  async function updateStatus(id, status) {
    const updated = apps.map(a => a.id === id ? { ...a, status } : a);
    await sset(KEYS.applications, updated);
    setApps(updated);
  }

  return (
    <div>
      {apps.length === 0 ? (
        <EmptyState icon="users" title="No applications yet" sub="Artists who apply through the portal will appear here" />
      ) : apps.map(a => (
        <div key={a.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{a.genre} • {a.email}</div>
          <div style={{ fontSize: 13, marginBottom: 10 }}>{a.bio}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => updateStatus(a.id, 'Approved')} className="btn btn-primary btn-sm"><Icon name="check" size={12} /> Approve</button>
            <button onClick={() => updateStatus(a.id, 'Rejected')} className="btn btn-danger btn-sm"><Icon name="x" size={12} /> Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Financial ─────────────────────────────────────────────────────────────────
export function AdminFinancial({ invoices, artists }) {
  const paid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="grid-3">
        <StatCard label="Collected Revenue" value={formatCurrency(paid)} icon="dollar" color="var(--green)" />
        <StatCard label="Pending" value={formatCurrency(pending)} icon="clock" color="var(--gold)" />
        <StatCard label="Overdue" value={formatCurrency(overdue)} icon="info" color="var(--red2)" />
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 16 }}>All Invoices</div>
        {invoices.map(inv => {
          const artist = artists.find(a => a.id === inv.artistId);
          return (
            <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{inv.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{artist?.name} • Due: {formatDate(inv.due)}</div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>{formatCurrency(inv.amount)}</span>
                <Badge color={{ Paid: 'var(--green)', Pending: 'var(--gold)', Overdue: 'var(--red2)' }[inv.status]}>{inv.status}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────────────────────
export function AdminMessages({ artists }) {
  const [selected, setSelected] = useState(artists[0]?.id || null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const all = await sget(KEYS.messages) || SEED_MESSAGES;
      setMsgs(all || []);
    })();
  }, []);

  const artist = artists.find(a => a.id === selected);
  const conv = msgs.filter(m => m.artistId === selected);

  async function send() {
    if (!input.trim() || !selected) return;
    const msg = { id: 'm' + Date.now(), artistId: selected, from: 'admin', content: input, ts: Date.now(), read: false };
    const updated = [...msgs, msg];
    await sset(KEYS.messages, updated);
    setMsgs(updated);
    setInput('');
    toast('Message sent!', 'success');
  }

  return (
    <div style={{ display: 'flex', gap: 16, height: 520 }}>
      <div style={{ width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {artists.map(a => (
          <button key={a.id} onClick={() => setSelected(a.id)}
            className={`nav-link ${selected === a.id ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{a.name?.[0]}</div>
            <span style={{ fontSize: 13 }}>{a.name}</span>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>{artist?.name}</div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {conv.map(m => (
            <div key={m.id} style={{
              background: m.from === 'admin' ? 'var(--red)22' : 'var(--bg3)',
              border: `1px solid ${m.from === 'admin' ? 'var(--red)44' : 'var(--border)'}`,
              borderRadius: 10, padding: '10px 14px',
              alignSelf: m.from === 'admin' ? 'flex-end' : 'flex-start',
              maxWidth: '75%'
            }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, fontWeight: 600 }}>
                {m.from === 'admin' ? 'You' : artist?.name} • {timeAgo(m.ts)}
              </div>
              <div style={{ fontSize: 14 }}>{m.content}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
          <input className="input" value={input} onChange={e => setInput(e.target.value)}
            placeholder={`Message ${artist?.name}...`} onKeyDown={e => e.key === 'Enter' && send()} />
          <button onClick={send} className="btn btn-primary"><Icon name="send" size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ── Public Roster ─────────────────────────────────────────────────────────────
export function AdminPublicRoster({ artists }) {
  return (
    <div>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 14, color: 'var(--text2)' }}>
        <Icon name="info" size={14} style={{ marginRight: 6 }} /> This is how your public roster appears to potential clients and partners.
      </div>
      <div className="grid-2">
        {artists.filter(a => a.stage === 'Signed').map(a => (
          <div key={a.id} className="card card-hover" style={{ borderTop: `3px solid ${a.color}` }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${a.color},${a.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>{a.name?.[0]}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{a.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{a.genre}</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>{a.bio}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--bg3)', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{(a.streams / 1000000).toFixed(1)}M</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>STREAMS</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--bg3)', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--green)' }}>+{a.growth}%</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>GROWTH</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Section ─────────────────────────────────────────────────────────────────
export function AdminAISection({ artists }) {
  return (
    <div>
      <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="zap" size={16} color="var(--gold)" /> Admin AI Suite
        </div>
        <div style={{ fontSize: 14, color: 'var(--text2)' }}>Powered by Claude AI — prospect scoring, roster intelligence, and strategic direction</div>
      </div>
      <AdminAITools artists={artists} />
    </div>
  );
}

// ── Modals ─────────────────────────────────────────────────────────────────────
export function AddDealModal({ artists, onAdd, onClose }) {
  const [form, setForm] = useState({ artistId: artists[0]?.id || '', title: '', value: '', type: 'Brand Deal', status: 'Pending', notes: '', date: new Date().toISOString().split('T')[0] });
  const toast = useToast();

  async function submit() {
    if (!form.title || !form.value) { toast('Fill in all required fields', 'error'); return; }
    const deals = await sget(KEYS.deals) || SEED_DEALS;
    const newDeal = { ...form, id: 'd' + Date.now(), value: Number(form.value) };
    const updated = [...deals, newDeal];
    await sset(KEYS.deals, updated);
    onAdd(updated);
    toast('Deal added!', 'success');
    onClose();
  }

  return (
    <Modal title="Add Deal" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Field label="Artist">
          <select className="input" value={form.artistId} onChange={e => setForm(f => ({ ...f, artistId: e.target.value }))}>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Deal Title *">
          <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Brand Partnership – Nike" />
        </Field>
        <Row gap={12}>
          <Field label="Value ($) *" style={{ flex: 1 }}>
            <input className="input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="25000" />
          </Field>
          <Field label="Type" style={{ flex: 1 }}>
            <select className="input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {['Brand Deal', 'Booking', 'Sync', 'Distribution', 'Sponsorship'].map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </Row>
        <Field label="Status">
          <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {['Pending', 'Active', 'Negotiation', 'Closed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Notes">
          <textarea className="input" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ resize: 'vertical' }} />
        </Field>
        <Row gap={10} style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={submit} className="btn btn-primary"><Icon name="plus" size={14} /> Add Deal</button>
        </Row>
      </div>
    </Modal>
  );
}

export function AddArtistModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', genre: '', stage: 'Development', bio: '', streams: '', followers: '', growth: '', dealValue: '', color: '#7c3aed' });
  const toast = useToast();

  async function submit() {
    if (!form.name || !form.email) { toast('Name and email are required', 'error'); return; }
    const artists = await sget(KEYS.artists) || SEED_ARTISTS;
    const newArtist = { ...form, id: 'a' + Date.now(), streams: Number(form.streams) || 0, followers: Number(form.followers) || 0, growth: Number(form.growth) || 0, dealValue: Number(form.dealValue) || 0, joinDate: new Date().toISOString().split('T')[0], weeklyReport: null, socials: {} };
    const updated = [...artists, newArtist];
    await sset(KEYS.artists, updated);
    onAdd(updated);
    toast('Artist added!', 'success');
    onClose();
  }

  return (
    <Modal title="Add Artist" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Row gap={12}>
          <Field label="Artist Name *" style={{ flex: 1 }}>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="NOVA" />
          </Field>
          <Field label="Color" style={{ flexShrink: 0 }}>
            <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 48, height: 40, border: '1px solid var(--border)', borderRadius: 8, background: 'none', cursor: 'pointer' }} />
          </Field>
        </Row>
        <Field label="Email *">
          <input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="artist@soundovault.com" />
        </Field>
        <Row gap={12}>
          <Field label="Genre" style={{ flex: 1 }}>
            <input className="input" value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="Pop/Electronic" />
          </Field>
          <Field label="Stage" style={{ flex: 1 }}>
            <select className="input" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
              {['Development', 'Signed', 'Emerging'].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </Row>
        <div className="grid-2">
          <Field label="Monthly Streams">
            <input className="input" type="number" value={form.streams} onChange={e => setForm(f => ({ ...f, streams: e.target.value }))} placeholder="500000" />
          </Field>
          <Field label="Followers">
            <input className="input" type="number" value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))} placeholder="25000" />
          </Field>
          <Field label="Monthly Growth %">
            <input className="input" type="number" value={form.growth} onChange={e => setForm(f => ({ ...f, growth: e.target.value }))} placeholder="15" />
          </Field>
          <Field label="Deal Value ($)">
            <input className="input" type="number" value={form.dealValue} onChange={e => setForm(f => ({ ...f, dealValue: e.target.value }))} placeholder="50000" />
          </Field>
        </div>
        <Field label="Bio">
          <textarea className="input" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} style={{ resize: 'vertical' }} />
        </Field>
        <Row gap={10} style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={submit} className="btn btn-primary"><Icon name="plus" size={14} /> Add Artist</button>
        </Row>
      </div>
    </Modal>
  );
}
