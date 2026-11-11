import { Icon } from './icon';
import { SplitHeading } from './split-heading';
import { SCHEDULE, type ScheduleItem } from '@/lib/seed';

const STATUS_LABEL: Record<ScheduleItem['status'], string> = {
  open: 'Open',
  upcoming: 'Upcoming',
  done: 'Completed',
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    mon: d.toLocaleString('en-GB', { month: 'short' }),
    full: d.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
  };
}

export function Schedule() {
  return (
    <section className="section schedule" id="schedule" aria-labelledby="schedule-title">
      <div className="container schedule__layout">
        <div className="schedule__sticky">
          <div className="section__head" style={{ marginBottom: 0 }}>
            <SplitHeading id="schedule-title" lines={['Every match', 'matters.']} />
            <p className="lead" data-reveal>
              Six milestones from sign up to the trophy lift. All matches are played online, and kickoff times are shared in the player group before each round.
            </p>
          </div>
          <p className="schedule__note" data-reveal>
            <Icon viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="var(--blue)" strokeWidth={2} html={'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'} />
            <span>All times are <strong>IST (UTC+5:30)</strong>.</span>
          </p>
        </div>
        <ol className="timeline" aria-label="Tournament schedule">
          {SCHEDULE.map(item => {
            const date = formatDate(item.date);
            return (
              <li className={`slot ${item.status === 'open' ? 'is-open' : ''}`} data-reveal key={item.title}>
                <time className="slot__date" dateTime={item.date}>
                  <span className="slot__day">{date.day}</span>
                  <span className="slot__mon">{date.mon}</span>
                </time>
                <div className="slot__body">
                  <div>
                    <h3 className="slot__title">{item.title}</h3>
                    <p className="slot__full">{date.full}</p>
                  </div>
                  <span className={`status status--${item.status}`}>{STATUS_LABEL[item.status]}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
