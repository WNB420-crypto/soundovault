import React, { useState } from 'react';
import { SoundoVaultLogo, Icon } from './shared.jsx';
export default function WorkspaceShell({ tabs, tab, onTab, onLogout, name, admin=false, children }) {
  const [open,setOpen]=useState(false);
  const select=id=>{onTab(id);setOpen(false);window.scrollTo(0,0)};
  return <div className={`sv-workspace ${admin?'sv-admin':''}`}>
    {open&&<button className="sv-scrim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <aside className={`sv-sidebar ${open?'is-open':''}`}><SoundoVaultLogo size={35}/><p className="sv-caption">{admin?'MANAGEMENT WORKSPACE':'ARTIST WORKSPACE'}</p><nav aria-label={admin?'Management navigation':'Artist navigation'}>{tabs.map(t=><button key={t.id} className={`sv-nav ${tab===t.id?'selected':''}`} aria-current={tab===t.id?'page':undefined} onClick={()=>select(t.id)}><Icon name={t.icon} size={18}/>{t.label}</button>)}</nav><div className="sv-account"><span>{name?.[0]||'S'}</span><div><strong>{name}</strong><small>{admin?'Management':'Artist portal'}</small></div></div><button className="sv-nav" onClick={onLogout}><Icon name="logout" size={17}/>Sign out</button></aside>
    <div className="sv-workarea"><header className="sv-workheader"><button className="btn btn-ghost sv-menu" aria-expanded={open} aria-label="Toggle navigation" onClick={()=>setOpen(!open)}><Icon name="menu"/></button><span>{admin?'Management':'Workspace'} <span className="sv-breadcrumb">/ {tabs.find(t=>t.id===tab)?.label}</span></span><div className="sv-header-right"><span className="sv-mode">{admin?'ADMIN':'ARTIST'}</span><span className="sv-avatar">{name?.[0]||'S'}</span></div></header><main className="sv-content"><div className="sv-page-heading"><div><p className="sv-caption">YOUR SOUND. YOUR DIRECTION.</p><h1>{tabs.find(t=>t.id===tab)?.label}</h1></div><span className="sv-page-note">{admin?'Build the bigger picture.':'Make your next move.'}</span></div>{children}</main></div>
    <nav className="sv-bottom" aria-label="Quick navigation">{tabs.slice(0,4).map(t=><button key={t.id} aria-current={tab===t.id?'page':undefined} onClick={()=>select(t.id)}><Icon name={t.icon} size={19}/><span>{t.label}</span></button>)}<button onClick={()=>setOpen(!open)} aria-label="More navigation"><Icon name="menu" size={19}/><span>More</span></button></nav>
  </div>
}
