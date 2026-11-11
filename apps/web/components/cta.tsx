import type { CSSProperties } from 'react';
import { SplitHeading } from './split-heading';

export function Cta() {
  return (
    <section className="cta" id="register-cta" aria-labelledby="cta-title">
      <div className="cta__bg" aria-hidden="true"></div>
      <div className="cta__lines" aria-hidden="true">
        <svg viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none" stroke="var(--line-2)" strokeWidth={1.5}>
          <rect x={80} y={80} width={1280} height={540} />
          <line x1={720} y1={80} x2={720} y2={620} />
          <circle cx={720} cy={350} r={120} />
          <rect x={80} y={210} width={190} height={280} />
          <rect x={1170} y={210} width={190} height={280} />
          <path d="M270 290a70 70 0 0 1 0 120M1170 290a70 70 0 0 0 0 120" />
        </svg>
      </div>
      <div className="container cta__inner">
        <SplitHeading id="cta-title" lines={['Fight for', 'the crown.']} />
        <p className="lead" data-reveal>Good at talking? Prove it on the pitch. Represent your skills, climb the table and take the Season 3 title.</p>
        <div data-reveal>
          <button className="btn btn--primary" type="button" data-open-register style={{ padding: '0 2.25rem' } as CSSProperties}>
            Register for Season 3
          </button>
        </div>
        <p className="cta__small" data-reveal>Limited slots available. Secure your place before registration closes.</p>
      </div>
    </section>
  );
}
