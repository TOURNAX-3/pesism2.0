import { UseIcon } from './icon';

export function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite" aria-label="Loading TOURNAX Season 3">
      <div className="loader__inner">
        <UseIcon id="emblem" className="loader__emblem" />
        <div className="loader__name">TOURNAX · Season 3</div>
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
