import type { CSSProperties } from 'react';
import Image from 'next/image';
import { getAdminDashboard } from '@/lib/tournax-api';
import { Button } from './ui/button';

function d(ms: number): CSSProperties {
  return { '--d': `${ms}ms` } as CSSProperties;
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return null;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

export async function Hero() {
  let dashboard: Awaited<ReturnType<typeof getAdminDashboard>> | null = null;
  try {
    dashboard = await getAdminDashboard();
  } catch {
    dashboard = null;
  }

  const spotsLeft =
    dashboard?.maxPlayers != null ? Math.max(0, dashboard.maxPlayers - dashboard.totalRegistrations) : null;
  const spotsLabel =
    dashboard?.registrationOpen && spotsLeft !== null
      ? `${spotsLeft} spots left`
      : dashboard?.maxPlayers != null
        ? `${dashboard.maxPlayers} spots`
        : null;
  // No explicit "league starts" field on the tournament yet — registration close is the closest
  // real date we have for "when this gets going", so that's what this fact shows.
  const startDate = formatDate(dashboard?.registrationClosesAt);

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
              <span className="word"><span style={d(700)}>PESISM</span></span> <span className="word"><span style={d(850)}>2.0</span></span>
            </span>
          </h1>

          <div className="hero__sub">
            <p className="hero__tagline" data-hero style={d(1000)}>The group chat ends here. The pitch decides.</p>
            <p className="hero__desc" data-hero style={d(1100)}>
              The banter&rsquo;s been loud all year. Now it gets settled. One league, one champion, and a group chat that never forgets.
            </p>
            <div className="hero__ctas" data-hero style={d(1200)}>
              <Button className="btn btn--primary" type="button" data-open-register>
                Claim your spot
              </Button>
              <a className="btn--text" href="#standings">
                See the table
              </a>
            </div>
          </div>

          <ul className="hero__facts" data-hero style={d(1300)}>
            {spotsLabel ? <li>{spotsLabel}</li> : null}
            <li>Free entry</li>
            {startDate ? <li>Starts {startDate}</li> : null}
            <li>1 crown</li>
          </ul>
        </div>

        <div className="hero__visual" data-hero style={d(750)}>
          <div className="trophy-stage">
            <Image
              src="/hero/trophy.png"
              alt=""
              width={993}
              height={1583}
              priority
              className="hero__trophy-img"
              sizes="(min-width: 1020px) 320px, 70vw"
            />
            <div className="trophy-stage__ground" aria-hidden="true"></div>
          </div>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">Scroll</div>
    </section>
  );
}
