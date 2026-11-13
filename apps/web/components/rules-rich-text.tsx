import { Fragment } from 'react';

/** Wrap must-know figures in `||double pipes||` in content strings. */
export function RulesRichText({ text }: { text: string }) {
  const parts = text.split(/(\|\|[^|]+\|\|)/g).filter((p) => p.length > 0);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('||') && part.endsWith('||')) {
          return (
            <span key={i} className="rules-doc__hi">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
