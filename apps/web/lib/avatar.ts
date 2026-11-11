const HUES: Array<[string, string]> = [
  ['#2F6BFF', '#0A1230'],
  ['#1FAE68', '#071C14'],
  ['#5B9BFF', '#101B45'],
  ['#3DFF8A', '#0A2418'],
];

/** A generated portrait placeholder, tinted per player, until real photos exist. */
export function avatarSvg(name: string, index: number): string {
  const initials = name.split(' ').map(w => w[0]).join('');
  const [c1, c2] = HUES[index % HUES.length];
  const id = `av${index}`;
  return `
  <svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Portrait of ${name}">
    <defs>
      <radialGradient id="${id}bg" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="${c1}" stop-opacity=".9"/><stop offset="1" stop-color="${c2}"/></radialGradient>
      <linearGradient id="${id}body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2560"/><stop offset="1" stop-color="#060A1E"/></linearGradient>
      <linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5B9BFF"/><stop offset="1" stop-color="#3DFF8A"/></linearGradient>
    </defs>
    <rect width="400" height="420" fill="url(#${id}bg)"/>
    <g stroke="rgba(255,255,255,.08)">${Array.from({ length: 9 }, (_, k) => `<line x1="${k * 50}" y1="0" x2="${k * 50}" y2="420"/>`).join('')}</g>
    <text x="200" y="250" text-anchor="middle" font-family="Onest,sans-serif" font-weight="800" font-size="230" fill="rgba(255,255,255,.07)" letter-spacing="-12">${initials}</text>
    <path d="M60 420c8-80 60-118 140-118s132 38 140 118z" fill="url(#${id}body)"/>
    <path d="M150 312l50 46 50-46" fill="none" stroke="url(#${id}rim)" stroke-width="6" stroke-linejoin="round"/>
    <rect x="178" y="250" width="44" height="58" rx="18" fill="#141D4A"/>
    <ellipse cx="200" cy="200" rx="62" ry="72" fill="#18235A"/>
    <path d="M138 196a62 66 0 0 1 124 0" fill="none" stroke="url(#${id}rim)" stroke-width="9" stroke-linecap="round"/>
    <rect x="124" y="188" width="22" height="42" rx="10" fill="#0B1236" stroke="url(#${id}rim)" stroke-width="3"/>
    <rect x="254" y="188" width="22" height="42" rx="10" fill="#0B1236" stroke="url(#${id}rim)" stroke-width="3"/>
    <path d="M140 222c0 30 18 44 42 46" fill="none" stroke="url(#${id}rim)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="186" cy="268" r="5" fill="#3DFF8A"/>
  </svg>`;
}
