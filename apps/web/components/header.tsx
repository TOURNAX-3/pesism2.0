import { UseIcon } from './icon';

const NAV_LINKS = [
  { href: '/#top', label: 'Home' },
  { href: '/#overview', label: 'Season 3' },
  { href: '/#format', label: 'Format' },
  { href: '/#standings', label: 'Standings' },
  { href: '/#fixtures', label: 'Fixtures' },
  { href: '/grievances', label: 'Grievances' },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#prizes', label: 'Prize Pool' },
];

export function Header() {
  return (
    <header className="header" id="top">
      <div className="header__inner">
        <a className="brand" href="/" aria-label="TOURNAX home">
          <UseIcon id="emblem" />
          <span className="brand__word">
            <span className="brand__name">TOURNAX</span>
            <small>PESISM 2.0</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary">
          <ul>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__actions">
          <button className="btn btn--primary btn--sm header__cta" type="button" data-open-register>
            Register now
          </button>
          <button className="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu">
            <span className="bars" aria-hidden="true">
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
