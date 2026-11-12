import { UseIcon } from './icon';

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <a className="brand" href="/">
              <UseIcon id="emblem" />
              <span className="brand__word">
                TOURNAX
                <small>Season 3</small>
              </span>
            </a>
            <p>Bringing eFootball players together to settle the debate on the pitch. Competition, community, and a crown worth fighting for.</p>
            <button className="btn btn--ghost btn--sm" type="button" data-open-register style={{ alignSelf: 'flex-start' }}>
              Register now
            </button>
          </div>
          <nav className="footer__col" aria-label="Tournament">
            <h3>Tournament</h3>
            <ul>
              <li><a href="/#overview">Season 3</a></li>
              <li><a href="/#format">Format</a></li>
              <li><a href="/table">Standings</a></li>
              <li><a href="/fixtures">Fixtures</a></li>
              <li><a href="/#prizes">Prize Pool</a></li>
            </ul>
          </nav>
          <nav className="footer__col" aria-label="Community">
            <h3>Community</h3>
            <ul>
              <li><a href="/#players">Players</a></li>
              <li><a href="/grievances">Grievances</a></li>
              <li><a href="mailto:hello@example.com">Contact</a></li>
            </ul>
          </nav>
          <nav className="footer__col" aria-label="Social">
            <h3>Connect</h3>
            <ul>
              <li><a href="https://www.instagram.com/" target="_blank" rel="noopener"><UseIcon id="i-insta" />Instagram</a></li>
              <li><a href="https://www.youtube.com/" target="_blank" rel="noopener"><UseIcon id="i-yt" />YouTube</a></li>
              <li><a href="https://discord.com/" target="_blank" rel="noopener"><UseIcon id="i-discord" />Discord</a></li>
              <li><a href="https://x.com/" target="_blank" rel="noopener"><UseIcon id="i-x" />X</a></li>
            </ul>
          </nav>
        </div>
        <div className="footer__mega" aria-hidden="true">TOURNAX</div>
        <div className="footer__bar">
          <span>© 2026 TOURNAX. eFootball™ is a trademark of KONAMI; TOURNAX is an independent community tournament.</span>
          <nav aria-label="Legal">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms &amp; Conditions</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
