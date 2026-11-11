import { Icon, UseIcon } from './icon';
import { SplitHeading } from './split-heading';

const STAGES = [
  {
    label: 'Stage 01',
    title: 'Registration',
    body: 'Sign up, confirm your spot, and get added to the Season 3 player group.',
    icon: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/>',
  },
  {
    label: 'Stage 02',
    title: 'League stage',
    body: 'Everyone plays on official matchdays. Points go on the table and the top spots qualify.',
    icon: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  },
  {
    label: 'Stage 03',
    title: 'Knockout rounds',
    body: 'Qualified players face off in elimination ties. Lose and you’re out.',
    icon: '<path d="M3 4h5v6H3m0 4h5v6H3M8 7h4v10H8m4-5h4m0-3h5v6h-5z"/>',
  },
] as const;

export function Format() {
  return (
    <section className="section format" id="format" aria-labelledby="format-title">
      <div className="container" style={{ position: 'relative' }}>
        <div className="section__head">
          <SplitHeading id="format-title" lines={['The road to', 'the final.']} />
        </div>

        <ol className="track" data-stagger>
          <span className="track__rail" aria-hidden="true"></span>
          <span className="track__fill" aria-hidden="true"></span>
          {STAGES.map(stage => (
            <li className="stage" data-reveal key={stage.title}>
              <span className="stage__num" aria-hidden="true">{stage.label.slice(-2)}</span>
              <div className="stage__card card">
                <span className="stage__icon" aria-hidden="true">
                  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" html={stage.icon} />
                </span>
                <span className="stage__label">{stage.label}</span>
                <h3>{stage.title}</h3>
                <p>{stage.body}</p>
              </div>
            </li>
          ))}
          <li className="stage" data-reveal>
            <span className="stage__num" aria-hidden="true">04</span>
            <div className="stage__card card">
              <span className="stage__icon" aria-hidden="true">
                <UseIcon id="i-trophy" viewBox="0 0 24 24" />
              </span>
              <span className="stage__label">Stage 04</span>
              <h3>Grand final</h3>
              <p>Two players, one match, one crown. The Season 3 champion is decided here.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}
