import type { ReactNode } from 'react';
import type { RulesBlock, RulesSection } from '@/content/tournament-rules';
import { TOURNAMENT_RULES_KEY_FACTS, TOURNAMENT_RULES_SECTIONS } from '@/content/tournament-rules';
import { RulesRichText } from '@/components/rules-rich-text';

function listKey(item: string, index: number) {
  return `${index}-${item.slice(0, 32)}`;
}

function renderBlock(block: RulesBlock, key: number) {
  switch (block.type) {
    case 'rule':
      return (
        <p key={key} className="rules-doc__rule">
          <span className="rules-doc__rule-num">{block.num}</span>
          <span className="rules-doc__rule-text">
            <RulesRichText text={block.text} />
          </span>
        </p>
      );
    case 'paragraph':
      return (
        <p key={key} className="rules-doc__p">
          <RulesRichText text={block.text} />
        </p>
      );
    case 'list':
      return (
        <ul key={key} className="rules-doc__list">
          {block.items.map((item, i) => (
            <li key={listKey(item, i)}>
              <RulesRichText text={item} />
            </li>
          ))}
        </ul>
      );
    case 'ordered':
      return (
        <ol key={key} className="rules-doc__ol" start={block.start ?? 1}>
          {block.items.map((item, i) => (
            <li key={listKey(item, i)}>
              <RulesRichText text={item} />
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

function SectionCard({ section }: { section: RulesSection }) {
  return (
    <article className="rules-doc__section panel" id={section.id} aria-labelledby={`${section.id}-title`}>
      <header className="rules-doc__section-head panel__head">
        <span className="rules-doc__num" aria-hidden="true">
          {String(section.number).padStart(2, '0')}
        </span>
        <h2 className="rules-doc__section-title" id={`${section.id}-title`}>
          {section.title}
        </h2>
      </header>
      <div className="rules-doc__body">
        {section.subsections.map((sub) => (
          <RulesSubsection key={sub.id} className="rules-doc__subsection">
            {sub.title ? <h3 className="rules-doc__h3">{sub.title}</h3> : null}
            {sub.blocks.map((block, i) => renderBlock(block, i))}
          </RulesSubsection>
        ))}
      </div>
    </article>
  );
}

function RulesSubsection({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
}

export function RulesDocument() {
  return (
    <div className="rules-doc">
      <aside className="rules-doc__keyfacts panel" aria-label="Key figures">
        <p className="rules-doc__toc-label">At a glance</p>
        <ul className="rules-doc__keyfacts-list">
          {TOURNAMENT_RULES_KEY_FACTS.map((fact) => (
            <li key={fact.label}>
              <span className="rules-doc__keyfacts-label">{fact.label}</span>
              <span className="rules-doc__hi">{fact.value}</span>
            </li>
          ))}
        </ul>
      </aside>
      <nav className="rules-doc__toc panel" aria-label="On this page">
        <p className="rules-doc__toc-label">Contents</p>
        <ol className="rules-doc__toc-list">
          {TOURNAMENT_RULES_SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                {s.number}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="rules-doc__sections">
        {TOURNAMENT_RULES_SECTIONS.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
