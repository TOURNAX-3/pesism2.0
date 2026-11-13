import type { Metadata } from 'next';
import { RulesDocument } from '@/components/rules-document';
import { TOURNAMENT_RULES_INTRO } from '@/content/tournament-rules';

export const metadata: Metadata = {
  title: 'Rules & Regulations · TOURNAX Season 3',
  description: 'Official tournament rulebook: conduct, room creation, gameplay, statistics, standings and walkovers.',
};

export default function RulesPage() {
  return (
    <section className="section rules-page" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container rules-page__wrap">
        <header className="section__head rules-page__head">
          <p className="rules-callout__eyebrow">Official rulebook</p>
          <h1 className="h2">Rules &amp; regulations</h1>
          <p className="lead rules-page__intro">{TOURNAMENT_RULES_INTRO}</p>
          <p className="rules-page__meta">
            Key scores, points and time limits are <span className="rules-doc__hi">highlighted</span> throughout.
          </p>
        </header>
        <RulesDocument />
      </div>
    </section>
  );
}
