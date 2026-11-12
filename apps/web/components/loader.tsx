import { UseIcon } from './icon';

export function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite" aria-label="Loading TOURNAX">
      <div className="loader__inner">
        <UseIcon id="emblem" className="loader__emblem" />
        <div className="loader__name">TOURNAX · PESISM 2.0</div>
        <div className="loader__status" aria-hidden="true">Loading egos&hellip;</div>
        <div className="loader__bar" aria-hidden="true">
          <div className="loader__fill"></div>
        </div>
        <div className="loader__pct">
          <span className="loader__num">0</span>%
        </div>
      </div>
    </div>
  );
}
