export function parseMetric(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0,value) : 0;
  const match = String(value ?? '').replace(/,/g,'').trim().match(/^([0-9]+(?:\.[0-9]+)?)\s*([KMB])?$/i);
  if (!match) return 0;
  return Number(match[1]) * ({k:1e3,m:1e6,b:1e9}[match[2]?.toLowerCase()] || 1);
}
export function formatStreams(n) {
  if(n>=1e6) return (n/1e6).toFixed(1).replace(/\.0$/,'')+'M';
  if(n>=1e3) return (n/1e3).toFixed(1).replace(/\.0$/,'')+'K';
  return String(n);
}
export function formatValue(n) {
  if(n>=1e6) return '$'+(n/1e6).toFixed(1).replace(/\.0$/,'')+'M';
  if(n>=1e3) return '$'+Math.round(n/1e3)+'K';
  return '$'+n.toLocaleString('en-US');
}
