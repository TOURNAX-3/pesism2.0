import type { SVGProps } from 'react';

/**
 * Renders a small inline SVG icon from a raw path string.
 * The icon set is a handful of static, trusted shapes ported from design/landing.html —
 * dangerouslySetInnerHTML avoids hand-converting every path/circle attribute to JSX casing.
 */
export function Icon({ html, ...props }: { html: string } & SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} {...props} />;
}

export function UseIcon({ id, ...props }: { id: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" {...props}>
      <use href={`#${id}`} />
    </svg>
  );
}
