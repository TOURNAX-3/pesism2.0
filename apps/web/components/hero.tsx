import type { CSSProperties } from 'react';
import { Icon, UseIcon } from './icon';

function d(ms: number): CSSProperties {
  return { '--d': `${ms}ms` } as CSSProperties;
}

const TROPHY_LAYERS = 14;

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true"></div>
      <svg className="hero__swoosh" aria-hidden="true" viewBox="0 0 900 700" fill="none">
        <path d="M-40 640C140 600 260 520 320 400C380 280 340 180 420 100" stroke="var(--color-tag)" strokeWidth="2" />
        <path d="M-80 690C140 660 300 580 380 440C460 300 420 190 520 90" stroke="var(--color-tag)" strokeWidth="2" opacity=".6" />
        <path d="M-10 580C180 540 280 460 340 350C400 240 380 160 460 70" stroke="var(--color-tag)" strokeWidth="2" opacity=".35" />
      </svg>

      <div className="hero__layout">
        <div className="hero__content">
          <h1 className="hero__title" id="hero-title">
            <span className="row">
              <span className="word"><span style={d(250)}>Welcome to</span></span>
            </span>
            <span className="row">
              <span className="word"><span className="accent" style={d(550)}>TOURNAX</span></span>
            </span>
            <span className="row">
              <span className="word"><span style={d(700)}>Season</span></span> <span className="word"><span style={d(850)}>3.</span></span>
            </span>
          </h1>

          <div className="hero__sub">
            <p className="hero__tagline" data-hero style={d(1000)}>Every win counts. Every goal matters.</p>
            <p className="hero__desc" data-hero style={d(1100)}>
              Time to find out who&rsquo;s actually good at eFootball and who&rsquo;s just good at talking. TOURNAX is back for Season 3, and this time it&rsquo;s even more intense.
            </p>
            <div className="hero__ctas" data-hero style={d(1200)}>
              <button className="btn btn--primary" type="button" data-open-register>
                Register now
              </button>
              <a className="btn--text" href="#overview">
                Explore the tournament
              </a>
            </div>
          </div>

          {/* Edit these values for your tournament */}
          <dl className="hero__info">
            <div className="info card" data-reveal data-hero-card>
              <dt className="info__tag">
                <span className="info__tag-num">01</span>
                <span className="info__tag-label">Tournament date</span>
              </dt>
              <dd className="info__value">
                <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} html={'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4m8-4v4"/>'} />
                <span className="info__value-text">28 Nov to 15 Dec 2026</span>
              </dd>
            </div>
            <div className="info card" data-reveal data-hero-card>
              <dt className="info__tag">
                <span className="info__tag-num">02</span>
                <span className="info__tag-label">Players</span>
              </dt>
              <dd className="info__value">
                <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} html={'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7m2.5 8.5a6.5 6.5 0 0 0-3-5.5"/>'} />
                <span className="info__value-text">128 slots</span>
              </dd>
            </div>
            <div className="info card" data-reveal data-hero-card>
              <dt className="info__tag">
                <span className="info__tag-num">03</span>
                <span className="info__tag-label">Entry fee</span>
              </dt>
              <dd className="info__value">
                <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} html={'<path d="M3 9V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a3 3 0 0 0 0 6v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a3 3 0 0 0 0-6z"/><path d="M14 4v16" stroke-dasharray="2 3"/>'} />
                <span className="info__value-text">Free</span>
              </dd>
            </div>
            <div className="info card" data-reveal data-hero-card>
              <dt className="info__tag">
                <span className="info__tag-num">04</span>
                <span className="info__tag-label">Prize pool</span>
              </dt>
              <dd className="info__value">
                <UseIcon id="i-trophy" />
                <span className="info__value-text">&#8377;50,000</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual" data-hero style={d(750)}>
          <div className="trophy-stage">
            <div className="trophy-stage__glow" aria-hidden="true"></div>
            <div className="hero__trophy" aria-hidden="true">
              <div className="trophy3d">
                {Array.from({ length: TROPHY_LAYERS }).map((_, i) => (
                  <span className="trophy3d__layer" key={i} style={{ '--i': i } as CSSProperties}>
                    <UseIcon id="emblem" />
                  </span>
                ))}
              </div>
            </div>
            <div className="trophy-stage__ground" aria-hidden="true"></div>
          </div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
