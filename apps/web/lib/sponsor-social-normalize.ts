/** Optional IG/TG fields — blank is fine; messy paste/@handle OK before API save. */
export function normalizeInstagramInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith('@')) {
    const handle = t.slice(1).replace(/\/$/, '').split(/[/?#]/)[0];
    return handle ? `https://www.instagram.com/${handle}` : null;
  }
  if (/^[\w.]+$/i.test(t) && !t.includes('://') && !t.includes('/')) {
    return `https://www.instagram.com/${t}`;
  }
  let url = t;
  if (url.startsWith('instagram.com') || url.startsWith('www.instagram.com')) {
    url = `https://${url}`;
  } else if (url.startsWith('http://')) {
    url = `https://${url.slice(7)}`;
  }
  if (!url.startsWith('https://')) {
    return url;
  }
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (host !== 'instagram.com') return url;
    const path = u.pathname.replace(/\/$/, '') || '';
    return `https://www.instagram.com${path}`;
  } catch {
    return url;
  }
}

export function normalizeTelegramInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith('@')) {
    const handle = t.slice(1).replace(/\/$/, '').split(/[/?#]/)[0];
    return handle ? `https://t.me/${handle}` : null;
  }
  if (t.startsWith('t.me/') || t.startsWith('telegram.me/')) {
    return `https://${t}`;
  }
  if (t.startsWith('http://')) {
    return `https://${t.slice(7)}`;
  }
  if (/^[\w+]+$/i.test(t) && !t.includes('.')) {
    return `https://t.me/${t}`;
  }
  return t;
}