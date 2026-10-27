import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// ── CSS ──────────────────────────────────────────────────────────────────────
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  /* SoundoVault Brand Colors */
  --cyan:#00D4F5;--blue:#165DFF;--violet:#7B20F9;
  --midnight:#080D24;--cloud:#F5F7FC;
  /* Backgrounds — deep midnight palette */
  --bg:#060A1E;--bg2:#0B1030;--bg3:#111840;--bg4:#182050;
  --border:#1E2A5E;--border2:#2A3A7A;
  /* Text */
  --text:#F5F7FC;--text2:#8899CC;--text3:#5566AA;
  /* Accent aliases (keep --gold vars so old refs don't break) */
  --gold:#00D4F5;--gold2:#165DFF;--gold3:#7B20F9;
  /* Status */
  --red:#dc2626;--red2:#ef4444;
  --green:#059669;--purple:#7B20F9;
  --radius:12px;--radius2:8px;--radius3:16px;
  --shadow:0 4px 24px rgba(0,0,0,0.5);
  --shadow2:0 8px 40px rgba(0,212,245,0.12);
  /* Brand gradient */
  --grad:linear-gradient(135deg,#00D4F5,#165DFF,#7B20F9);
  --grad-r:linear-gradient(135deg,#7B20F9,#165DFF,#00D4F5);
}
html,body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden}
#root{min-height:100vh}
button{cursor:pointer;font-family:inherit}
input,textarea,select{font-family:inherit}
a{color:inherit;text-decoration:none}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

@keyframes shimmer{0%{background-position:0% center}100%{background-position:200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{transform:translateX(110%)}to{transform:translateX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ripple{0%{transform:scale(.8);opacity:1}100%{transform:scale(2);opacity:0}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(0,212,245,.3)}50%{box-shadow:0 0 40px rgba(22,93,255,.5),0 0 60px rgba(123,32,249,.2)}}

.page{animation:fadeIn .3s ease}
.card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:20px}
.card-hover{transition:border-color .2s,transform .2s,box-shadow .2s}
.card-hover:hover{border-color:var(--blue);transform:translateY(-2px);box-shadow:0 8px 32px rgba(22,93,255,.2)}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:var(--radius2);border:none;font-size:14px;font-weight:600;transition:all .2s;letter-spacing:.02em;font-family:'Space Grotesk','Inter',sans-serif}
.btn-primary{background:var(--grad);color:#fff;box-shadow:0 4px 20px rgba(22,93,255,.35)}
.btn-primary:hover{filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 6px 28px rgba(22,93,255,.5)}
.btn-ghost{background:transparent;color:var(--text2);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--blue);color:var(--text);background:rgba(22,93,255,.08)}
.btn-danger{background:var(--red);color:#fff}
.btn-danger:hover{background:var(--red2)}
.btn-sm{padding:6px 12px;font-size:12px}
.input{width:100%;background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius2);color:var(--text);padding:10px 14px;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
.input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0,212,245,.1)}
.input::placeholder{color:var(--text3)}
.label{font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;display:block;font-family:'Space Grotesk',sans-serif}
.stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px}
.stat-val{font-size:28px;font-weight:700;color:var(--text);font-family:'Space Grotesk',sans-serif}
.stat-label{font-size:12px;color:var(--text2);margin-top:4px}
.stat-change{font-size:12px;font-weight:600;margin-top:8px}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-family:'Space Grotesk',sans-serif}
.nav-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--radius2);color:var(--text2);font-size:14px;font-weight:500;transition:all .2s;cursor:pointer;border:1px solid transparent}
.nav-link:hover{background:rgba(22,93,255,.08);color:var(--text)}
.nav-link.active{background:linear-gradient(135deg,rgba(0,212,245,.1),rgba(22,93,255,.08));color:var(--cyan);border-color:rgba(0,212,245,.25)}
.tab{padding:8px 16px;border-radius:var(--radius2);font-size:13px;font-weight:600;border:none;background:transparent;color:var(--text2);transition:all .2s;cursor:pointer;font-family:'Space Grotesk',sans-serif}
.tab.active{background:var(--bg3);color:var(--cyan);border:1px solid rgba(0,212,245,.3)}
.tab:hover:not(.active){color:var(--text)}
.modal-overlay{position:fixed;inset:0;background:rgba(6,10,30,.8);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;backdrop-filter:blur(8px)}
.modal{background:var(--bg2);border:1px solid var(--border2);border-radius:var(--radius3);padding:28px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 60px rgba(22,93,255,.1)}
.modal-title{font-size:20px;font-weight:700;margin-bottom:20px;font-family:'Space Grotesk',sans-serif}
.divider{height:1px;background:var(--border);margin:16px 0}
.empty-state{text-align:center;padding:60px 20px;color:var(--text2)}
.empty-icon{font-size:48px;margin-bottom:12px;opacity:.4}
.empty-text{font-size:16px;font-weight:600;color:var(--text);margin-bottom:8px}
.empty-sub{font-size:14px}
.toast-container{position:fixed;top:20px;right:20px;z-index:2000;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{background:var(--bg3);border:1px solid var(--border2);border-radius:var(--radius2);padding:12px 16px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:10px;animation:slideIn .3s ease;box-shadow:var(--shadow2);pointer-events:all;min-width:240px;max-width:320px}
.toast-success{border-color:var(--green)}
.toast-error{border-color:var(--red2)}
.gold-text{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% auto;animation:shimmer 3s linear infinite}
.brand-text{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.spinner{width:20px;height:20px;border:2px solid var(--border2);border-top-color:var(--cyan);border-radius:50%;animation:spin .7s linear infinite}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pulse 1.2s ease infinite}
.typing-dot:nth-child(2){animation-delay:.2s}
.typing-dot:nth-child(3){animation-delay:.4s}
.ai-msg{background:var(--bg3);border:1px solid var(--border);border-radius:var(--radius2);padding:14px 16px;font-size:14px;line-height:1.7;white-space:pre-wrap}
.ai-msg-user{background:linear-gradient(135deg,rgba(0,212,245,.08),rgba(22,93,255,.05));border-color:rgba(0,212,245,.2);text-align:right;margin-left:40px}
.progress-bar{height:4px;background:var(--border);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:var(--grad);border-radius:2px;transition:width .5s ease}
.search-bar{position:relative}
.search-bar input{padding-left:38px}
.search-bar-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@media(max-width:768px){.grid-2,.grid-3,.grid-4{grid-template-columns:1fr}}
.flex{display:flex}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-2{gap:8px}.gap-3{gap:12px}.gap-4{gap:16px}.mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}
.w-full{width:100%}.text-sm{font-size:13px}.text-xs{font-size:11px}.font-bold{font-weight:700}.font-semibold{font-weight:600}.text-muted{color:var(--text2)}.text-gold{color:var(--cyan)}.text-green{color:var(--green)}.text-red{color:var(--red2)}.text-blue{color:var(--blue)}
h1,h2,h3,h4{font-family:'Space Grotesk','Inter',sans-serif}
`;

// ── Icons ─────────────────────────────────────────────────────────────────────
export const icons = {
  home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  music: 'M9 18V5l12-2v13 M6 21a3 3 0 100-6 3 3 0 000 6z M18 19a3 3 0 100-6 3 3 0 000 6z',
  dollar: 'M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  chart: 'M18 20V10 M12 20V4 M6 20v-6',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75 M9 7a4 4 0 100 8 4 4 0 000-8z',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7a4 4 0 100 8 4 4 0 000-8z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
  msg: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
  report: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M8 13h8 M8 17h8 M8 9h2',
  ai: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M8 12h8 M12 8v8',
  brain: 'M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-5 0V4.5A2.5 2.5 0 019.5 2z M14.5 2A2.5 2.5 0 0117 4.5v15a2.5 2.5 0 01-5 0V4.5A2.5 2.5 0 0114.5 2z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  trending: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  chevron_down: 'M6 9l6 6 6-6',
  chevron_right: 'M9 18l6-6-6-6',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
  eye_off: 'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22',
  globe: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
  instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h.01 M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z',
  youtube: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z M9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  tiktok: 'M9 12a4 4 0 100 8 4 4 0 000-8z M15 8a4 4 0 004 4V8h-4z M9 16v-4',
  spotify: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M8 13.5a7 7 0 018-1 M7 10.5a10 10 0 0111.5-1.5 M8.5 16.5a4 4 0 015-0.5',
  menu: 'M3 12h18M3 6h18M3 18h18',
  award: 'M12 15a6 6 0 100-12 6 6 0 000 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  briefcase: 'M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2',
  target: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z',
  send: 'M22 2L11 13 M22 2L15 22 9 13 2 9l20-7z',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2',
  copy: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  unlock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 019.9-1',
  info: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 8h.01 M11 12h1v4h1',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  calendar: 'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  rocket: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
};

export function Icon({ name, size = 18, color, className = '', strokeWidth = 2 }) {
  const d = icons[name];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || 'currentColor'} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
export function SoundoVaultLogo({ size = 48, showText = true }) {
  // Use official brand asset — horizontal lockup on dark (SVG with embedded real symbol PNG)
  // The horizontal SVG is 1100×240 viewBox; scale to desired height keeping aspect ratio
  const logoH = size * 1.1;
  const logoW = logoH * (1100 / 240);

  if (showText) {
    // Full horizontal lockup: real symbol + wordmark
    return (
      <img
        src="/assets/logos/soundovault-horizontal-on-dark.svg"
        alt="SoundoVault"
        height={logoH}
        width={logoW}
        style={{
          display: 'block',
          filter: 'drop-shadow(0 0 12px rgba(22,93,255,0.4))',
          flexShrink: 0,
        }}
      />
    );
  }

  // Symbol only — use the standalone PNG emblem
  return (
    <img
      src="/assets/logos/soundovault-symbol.png"
      alt="SoundoVault"
      width={size}
      height={size}
      style={{
        display: 'block',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 10px rgba(22,93,255,0.5))',
        flexShrink: 0,
      }}
    />
  );
}

export function SoundoVaultNav({ onLogout }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
      <SoundoVaultLogo size={32} />
      {onLogout && (
        <button onClick={onLogout} className="btn btn-ghost btn-sm">
          <Icon name="logout" size={14} /> Logout
        </button>
      )}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' && <Icon name="check" size={14} color="var(--green)" />}
            {t.type === 'error' && <Icon name="x" size={14} color="var(--red2)" />}
            {t.type === 'info' && <Icon name="info" size={14} color="var(--gold)" />}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() { return useContext(ToastCtx); }

// ── UI Components ─────────────────────────────────────────────────────────────
export function Field({ label, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label className="label">{label}</label>}
      {children}
    </div>
  );
}

export function Row({ children, gap = 16, style }) {
  return <div style={{ display: 'flex', gap, alignItems: 'center', ...style }}>{children}</div>;
}

export function Badge({ children, color = '#d4af37', bg }) {
  return (
    <span className="badge" style={{
      background: bg || `${color}22`,
      color,
      border: `1px solid ${color}44`,
    }}>{children}</span>
  );
}

export function StatCard({ label, value, change, icon, color = 'var(--gold)' }) {
  return (
    <div className="stat-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span className="stat-label">{label}</span>
        {icon && <Icon name={icon} size={16} color={color} />}
      </div>
      <div className="stat-val">{value}</div>
      {change !== undefined && (
        <div className="stat-change" style={{ color: change >= 0 ? 'var(--green)' : 'var(--red2)' }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
}

export function EmptyState({ icon = 'music', title = 'Nothing here yet', sub = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={icon} size={48} color="var(--text3)" /></div>
      <div className="empty-text">{title}</div>
      {sub && <div className="empty-sub">{sub}</div>}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span className="search-bar-icon"><Icon name="search" size={14} /></span>
      <input className="input" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="modal-title">{title}</div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><Icon name="x" size={14} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function formatCurrency(n) {
  return '$' + (n || 0).toLocaleString();
}
export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
export function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}
