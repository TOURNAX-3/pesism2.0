import type { Metadata } from 'next';
import { GrievanceForm } from '@/components/grievance-form';

export const metadata: Metadata = {
  title: 'Grievances · TOURNAX Season 3',
  description: 'Raise an issue with the game committee or tournament admin.',
};

export default function GrievancesPage() {
  return (
    <section className="section" style={{ paddingTop: 'calc(var(--header-h) + 2rem)' }}>
      <div className="container" style={{ maxWidth: '44rem' }}>
        <div className="section__head">
          <h2 className="h2">Raise a grievance.</h2>
          <p className="lead">
            Disputes about admin decisions, scheduling, opponents, or committee calls. Only approved players can submit;
            responses are handled privately for now.
          </p>
        </div>
        <div className="panel" style={{ padding: '1.5rem 1.75rem' }}>
          <GrievanceForm />
        </div>
      </div>
    </section>
  );
}
