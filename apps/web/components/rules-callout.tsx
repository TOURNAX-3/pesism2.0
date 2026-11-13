import Link from 'next/link';

/** Home-page strip above the footer — rules link (not in main nav). */
export function RulesCallout() {
  return (
    <section className="section rules-callout" aria-labelledby="rules-callout-title">
      <div className="container">
        <div className="rules-callout__inner panel" data-reveal>
          <div>
            <p className="rules-callout__eyebrow">Season 3</p>
            <h2 className="rules-callout__title" id="rules-callout-title">
              Know the rulebook before you kick off.
            </h2>
            <p className="rules-callout__text">
              Conduct, room settings, walkovers, screenshots and committee decisions — everything from the official
              TOURNAX regulations in one place.
            </p>
          </div>
          <Link className="btn btn--primary" href="/rules">
            Rules &amp; regulations
          </Link>
        </div>
      </div>
    </section>
  );
}
