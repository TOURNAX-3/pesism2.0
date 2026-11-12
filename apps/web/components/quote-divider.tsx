export function QuoteDivider({ text }: { text: string }) {
  return (
    <div className="quote-divider" data-reveal aria-hidden="true">
      <p>{text}</p>
    </div>
  );
}
