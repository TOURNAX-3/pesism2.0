import type { CSSProperties, ReactNode } from 'react';

/** A two-line uppercase heading with the `[data-split]` line-reveal animation. */
export function SplitHeading({ id, lines }: { id?: string; lines: [ReactNode, ReactNode] }) {
  return (
    <h2 className="h2" id={id} data-split>
      {lines.map((line, i) => (
        <span className="line" key={i}>
          <span style={{ '--i': i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </h2>
  );
}
