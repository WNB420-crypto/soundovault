import React, { useState, useRef, useEffect } from 'react';
import { Icon, Spinner, Badge } from './shared.jsx';

const AI_MODEL = 'claude-sonnet-4-20250514';

export async function callAI(system, user, maxTokens = 1024) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': window.__SV_API_KEY__ || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const data = await res.json();
  return data.content[0].text;
}

export async function callAIJson(system, user, maxTokens = 1024) {
  const raw = await callAI(system + '\n\nRespond ONLY with valid JSON.', user, maxTokens);
  const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON found in response');
  return JSON.parse(match[0]);
}

export async function generateWeeklyReport(artist) {
  return callAI(
    `You are a music industry analyst writing weekly performance reports for a signing agency.
    Be concise, professional, and actionable. Use bullet points. Max 400 words.`,
    `Write a weekly performance report for artist: ${artist.name}
    Genre: ${artist.genre}
    Monthly Streams: ${artist.streams?.toLocaleString()}
    Followers: ${artist.followers?.toLocaleString()}
    Monthly Growth: ${artist.growth}%
    Active Deals: ${artist.dealValue ? '$' + artist.dealValue.toLocaleString() : 'None'}

    Include: performance highlights, social media momentum, recommended actions for this week, opportunities to pursue.`
  );
}

// ── AI Manager Chat ────────────────────────────────────────────────────────────
export function AIManagerChat({ artist }) {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: `Hey ${artist?.name || 'there'}! I'm your AI manager. Ask me anything about your career, strategy, or the music industry. 🎵` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const quickPrompts = [
    'How do I grow my fanbase?',
    'What should I post this week?',
    'How do I get on playlists?',
    'Tips for my next release',
  ];

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = msgs.slice(-6).map(m => `${m.role === 'user' ? 'Artist' : 'Manager'}: ${m.content}`).join('\n');
      const reply = await callAI(
        `You are an expert AI music manager for ${artist?.name || 'an artist'} (${artist?.genre || 'music'} artist).
        You have deep knowledge of the music industry, digital marketing, streaming platforms, and artist development.
        Be encouraging, specific, and practical. Keep responses under 200 words.`,
        `Conversation so far:\n${history}\n\nArtist: ${msg}`
      );
      setMsgs(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'assistant', content: `Sorry, I couldn't connect right now. Please check your API key in settings. (${e.message})` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0', marginBottom: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : ''}`}
            style={{ marginLeft: m.role === 'user' ? 'auto' : 0, maxWidth: '85%' }}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="ai-msg" style={{ maxWidth: 80, display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
            <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {quickPrompts.map(p => (
          <button key={p} onClick={() => send(p)} className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>{p}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Ask your AI manager..." onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()} />
        <button onClick={() => send()} className="btn btn-primary" disabled={loading || !input.trim()}>
          <Icon name="send" size={14} />
        </button>
      </div>
    </div>
  );
}

// ── AI Content Generator ───────────────────────────────────────────────────────
export function AIContentGenerator({ artist }) {
  const [type, setType] = useState('caption');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const types = [
    { id: 'caption', label: 'Social Caption' },
    { id: 'strategy', label: 'Growth Strategy' },
    { id: 'pitch', label: 'Brand Pitch' },
    { id: 'bio', label: 'Artist Bio' },
    { id: 'press', label: 'Press Release' },
    { id: 'email', label: 'Fan Email' },
  ];

  async function generate() {
    setLoading(true);
    setOutput('');
    const prompts = {
      caption: `Write 3 engaging Instagram/TikTok captions for ${artist?.name} (${artist?.genre}). Include relevant hashtags. Make them authentic and shareable.`,
      strategy: `Create a 30-day social media growth strategy for ${artist?.name} (${artist?.genre}) with ${artist?.followers?.toLocaleString()} followers. Be specific with daily actions.`,
      pitch: `Write a compelling brand partnership pitch email for ${artist?.name} (${artist?.genre}) with ${artist?.streams?.toLocaleString()} monthly streams. Target lifestyle/fashion brands.`,
      bio: `Write a professional artist bio for ${artist?.name} (${artist?.genre}). Include a short version (100 words) and long version (250 words). Make it compelling for press and booking.`,
      press: `Write a press release announcing ${artist?.name}'s new single release. Genre: ${artist?.genre}. Make it newsworthy and ready to send to music blogs.`,
      email: `Write a fan newsletter email from ${artist?.name} (${artist?.genre}) about an upcoming release. Make it personal, engaging, and include a call to action.`,
    };
    try {
      const result = await callAI(
        `You are a professional music industry copywriter. Write compelling, authentic content.`,
        prompts[type],
        800
      );
      setOutput(result);
    } catch (e) {
      setOutput(`Error: ${e.message}\n\nMake sure your Claude API key is configured.`);
    }
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {types.map(t => (
          <button key={t.id} onClick={() => setType(t.id)}
            className={`tab ${type === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>
      <button onClick={generate} className="btn btn-primary w-full" disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? <><Spinner /> Generating...</> : <><Icon name="zap" size={14} /> Generate {types.find(t => t.id === type)?.label}</>}
      </button>
      {output && (
        <div style={{ position: 'relative' }}>
          <div className="ai-msg" style={{ maxHeight: 300, overflowY: 'auto' }}>{output}</div>
          <button onClick={copy} className="btn btn-ghost btn-sm" style={{ position: 'absolute', top: 8, right: 8 }}>
            <Icon name="copy" size={12} /> {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── AI Career Coach ────────────────────────────────────────────────────────────
export function AICareerCoach({ artist }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    setReport(null);
    try {
      const data = await callAIJson(
        `You are an expert music career analyst. Return a JSON object with exactly these fields:
        score (number 0-100), strengths (array of 3 strings), weaknesses (array of 3 strings),
        opportunities (array of 3 strings), threats (array of 3 strings), summary (string 1-2 sentences)`,
        `Analyze the career of: ${artist?.name}, Genre: ${artist?.genre},
        Monthly Streams: ${artist?.streams?.toLocaleString()}, Followers: ${artist?.followers?.toLocaleString()},
        Monthly Growth: ${artist?.growth}%, Deal Value: $${artist?.dealValue?.toLocaleString()}`
      );
      setReport(data);
    } catch (e) {
      setDetail(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  async function getDetail(aspect) {
    setDetailLoading(true);
    setDetail('');
    try {
      const text = await callAI(
        `You are a music industry expert coach. Give specific, actionable advice. Be concise (150 words max).`,
        `For artist ${artist?.name} (${artist?.genre}), give specific advice about: ${aspect}
        Current stats: ${artist?.streams?.toLocaleString()} streams, ${artist?.followers?.toLocaleString()} followers, ${artist?.growth}% growth`
      );
      setDetail(text);
    } catch (e) {
      setDetail(`Error: ${e.message}`);
    }
    setDetailLoading(false);
  }

  const scoreColor = report ? (report.score >= 75 ? 'var(--green)' : report.score >= 50 ? 'var(--gold)' : 'var(--red2)') : 'var(--border2)';

  return (
    <div>
      <button onClick={analyze} className="btn btn-primary w-full" disabled={loading} style={{ marginBottom: 20 }}>
        {loading ? <><Spinner /> Analyzing Career...</> : <><Icon name="brain" size={14} /> Run Career Analysis</>}
      </button>
      {report && (
        <div style={{ animation: 'fadeIn .3s ease' }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20, padding: 20, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: 80, height: 80 }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="3"
                  strokeDasharray={`${report.score} 100`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: scoreColor }}>{report.score}</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Career Score</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{report.summary}</div>
            </div>
          </div>
          <div className="grid-2" style={{ marginBottom: 16 }}>
            {[
              { key: 'strengths', label: 'Strengths', color: 'var(--green)', icon: 'trending' },
              { key: 'weaknesses', label: 'Weaknesses', color: 'var(--red2)', icon: 'info' },
              { key: 'opportunities', label: 'Opportunities', color: 'var(--blue)', icon: 'rocket' },
              { key: 'threats', label: 'Threats', color: 'var(--gold)', icon: 'shield' },
            ].map(({ key, label, color, icon }) => (
              <div key={key} style={{ background: 'var(--bg3)', border: `1px solid ${color}33`, borderRadius: 'var(--radius)', padding: 14 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                  <Icon name={icon} size={14} color={color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
                </div>
                {(report[key] || []).map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${color}44` }}>{item}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {['Streaming growth tactics', 'Brand deal strategy', 'Fan engagement tips', 'Release timing advice'].map(a => (
              <button key={a} onClick={() => getDetail(a)} className="btn btn-ghost btn-sm">{a}</button>
            ))}
          </div>
          {detailLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><Spinner /></div>}
          {detail && <div className="ai-msg">{detail}</div>}
        </div>
      )}
    </div>
  );
}

// ── AI Deal Scout ──────────────────────────────────────────────────────────────
export function AIDealScout({ artist }) {
  const [deals, setDeals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pitching, setPitching] = useState(null);
  const [pitch, setPitch] = useState('');

  async function scout() {
    setLoading(true);
    setDeals(null);
    try {
      const data = await callAIJson(
        `You are a music deal scout. Return a JSON array of 5 deal opportunities.
        Each item: {type, brand, value, probability, description, timeline}
        type: one of "Brand Deal", "Sync License", "Booking", "Sponsorship", "Distribution"
        value: estimated dollar amount (number)
        probability: percentage 1-100
        timeline: e.g. "2-4 weeks"`,
        `Find deals for: ${artist?.name}, Genre: ${artist?.genre}, Followers: ${artist?.followers?.toLocaleString()}, Streams: ${artist?.streams?.toLocaleString()}/month`
      );
      setDeals(Array.isArray(data) ? data : data.deals || []);
    } catch (e) {
      setDeals([]);
    }
    setLoading(false);
  }

  async function generatePitch(deal) {
    setPitching(deal.brand);
    setPitch('');
    try {
      const text = await callAI(
        `You are an expert music industry deal negotiator. Write compelling, professional pitches.`,
        `Write a pitch email from ${artist?.name} to ${deal.brand} for a ${deal.type} worth ~$${deal.value?.toLocaleString()}.
        Artist stats: ${artist?.streams?.toLocaleString()} streams, ${artist?.followers?.toLocaleString()} followers, ${artist?.genre} genre.
        Keep it under 200 words, professional yet authentic.`
      );
      setPitch(text);
    } catch {}
    setPitching(null);
  }

  return (
    <div>
      <button onClick={scout} className="btn btn-primary w-full" disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? <><Spinner /> Scouting Deals...</> : <><Icon name="target" size={14} /> Scout Deal Opportunities</>}
      </button>
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: 72, background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
      {deals && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn .3s ease' }}>
          {deals.map((d, i) => (
            <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{d.brand}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>{d.description}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)' }}>${(d.value || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--green)' }}>{d.probability}% match</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge color="var(--blue)">{d.type}</Badge>
                  <Badge color="var(--text3)">{d.timeline}</Badge>
                </div>
                <button onClick={() => generatePitch(d)} className="btn btn-ghost btn-sm" disabled={pitching === d.brand}>
                  {pitching === d.brand ? <Spinner /> : <><Icon name="send" size={12} /> Pitch</>}
                </button>
              </div>
              {pitch && pitching === null && deals[i] === d && (
                <div className="ai-msg" style={{ marginTop: 10, fontSize: 12 }}>{pitch}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {pitch && pitching === null && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--gold)' }}>Generated Pitch:</div>
          <div className="ai-msg">{pitch}</div>
        </div>
      )}
    </div>
  );
}

// ── Admin AI Tools ─────────────────────────────────────────────────────────────
export function AdminAITools({ artists = [] }) {
  const [tab, setTab] = useState('scorer');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [prospect, setProspect] = useState('');

  const tabs = [
    { id: 'scorer', label: 'Prospect Scorer' },
    { id: 'intel', label: 'Roster Intel' },
    { id: 'director', label: 'AI Director Chat' },
  ];

  const [chatMsgs, setChatMsgs] = useState([
    { role: 'assistant', content: 'Welcome to AI Director mode. I have full visibility into your roster and can help you make strategic decisions. What would you like to analyze?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  async function scoreProspect() {
    if (!prospect.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const text = await callAI(
        `You are a music A&R director scoring artist prospects. Be analytical and decisive.`,
        `Score this artist prospect: ${prospect}
        Rate them 1-10 and explain: streaming potential, marketability, genre fit, development needs, recommended action.
        Format as a clear report with scores and bullet points.`
      );
      setOutput(text);
    } catch (e) { setOutput(`Error: ${e.message}`); }
    setLoading(false);
  }

  async function getRosterIntel() {
    setLoading(true);
    setOutput('');
    try {
      const rosterSummary = artists.map(a => `${a.name} (${a.genre}): ${a.streams?.toLocaleString()} streams, ${a.growth}% growth`).join('\n');
      const text = await callAI(
        `You are a music industry intelligence analyst. Provide strategic insights for a signing agency.`,
        `Analyze this artist roster and provide strategic recommendations:
        ${rosterSummary}

        Cover: portfolio balance, underperformers, stars to invest in, genre gaps, cross-promotion opportunities, Q4 strategy.`
      );
      setOutput(text);
    } catch (e) { setOutput(`Error: ${e.message}`); }
    setLoading(false);
  }

  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput;
    setChatInput('');
    setChatMsgs(m => [...m, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const rosterCtx = artists.map(a => `${a.name}: ${a.streams?.toLocaleString()} streams, ${a.growth}% growth, $${a.dealValue?.toLocaleString()} deals`).join('\n');
      const reply = await callAI(
        `You are an AI director for SoundoVault music agency. You have full knowledge of the roster:
        ${rosterCtx}
        Give strategic, data-driven advice. Be direct and decisive.`,
        msg
      );
      setChatMsgs(m => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      setChatMsgs(m => [...m, { role: 'assistant', content: `Error: ${e.message}` }]);
    }
    setChatLoading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab ${tab === t.id ? 'active' : ''}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'scorer' && (
        <div>
          <textarea className="input" rows={4} placeholder="Describe the prospect: name, genre, follower count, links, recent activity..." value={prospect} onChange={e => setProspect(e.target.value)} style={{ marginBottom: 12, resize: 'vertical' }} />
          <button onClick={scoreProspect} className="btn btn-primary w-full" disabled={loading || !prospect.trim()} style={{ marginBottom: 16 }}>
            {loading ? <><Spinner /> Analyzing...</> : <><Icon name="target" size={14} /> Score Prospect</>}
          </button>
          {output && <div className="ai-msg" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>}
        </div>
      )}

      {tab === 'intel' && (
        <div>
          <button onClick={getRosterIntel} className="btn btn-primary w-full" disabled={loading} style={{ marginBottom: 16 }}>
            {loading ? <><Spinner /> Analyzing Roster...</> : <><Icon name="brain" size={14} /> Generate Roster Intelligence Report</>}
          </button>
          {output && <div className="ai-msg" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>}
        </div>
      )}

      {tab === 'director' && (
        <div style={{ display: 'flex', flexDirection: 'column', height: 400 }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {chatMsgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : ''}`}
                style={{ maxWidth: '85%', marginLeft: m.role === 'user' ? 'auto' : 0 }}>{m.content}</div>
            ))}
            {chatLoading && (
              <div className="ai-msg" style={{ maxWidth: 80, display: 'flex', gap: 4, alignItems: 'center' }}>
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="input" value={chatInput} onChange={e => setChatInput(e.target.value)}
              placeholder="Ask the AI Director..." onKeyDown={e => e.key === 'Enter' && sendChat()} />
            <button onClick={sendChat} className="btn btn-primary" disabled={chatLoading}>
              <Icon name="send" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
