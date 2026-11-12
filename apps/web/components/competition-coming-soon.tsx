export function CompetitionComingSoon({ label }: { label: string }) {
  return (
    <div className="competition-soon">
      <p className="competition-soon__eyebrow">Coming soon</p>
      <p className="competition-soon__text">{label}</p>
    </div>
  );
}
