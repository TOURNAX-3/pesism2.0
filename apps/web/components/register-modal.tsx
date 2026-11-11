import { Icon, UseIcon } from './icon';

export function RegisterModal() {
  return (
    <div className="modal" id="register" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
      <div className="modal__dialog">
        <button className="modal__close" type="button" aria-label="Close registration">
          <UseIcon id="i-close" />
        </button>

        <div className="modal__view" data-view="form">
          <div className="modal__head">
            <h2 className="modal__title" id="modal-title">Join Season 3.</h2>
            <p>Fill in your details. We&rsquo;ll confirm your slot on WhatsApp.</p>
          </div>
          <form className="form" noValidate>
            <div className="field">
              <label htmlFor="f-name">Full name</label>
              <input id="f-name" name="name" type="text" autoComplete="name" required placeholder="Arjun Menon" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <div className="field">
              <label htmlFor="f-gamer">Gaming username</label>
              <input id="f-gamer" name="gamer" type="text" autoComplete="nickname" required placeholder="ArjunFC" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <div className="field">
              <label htmlFor="f-email">Email address</label>
              <input id="f-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <div className="field">
              <label htmlFor="f-phone">WhatsApp number</label>
              <input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required pattern="[0-9+ ]{10,16}" placeholder="+91 98765 43210" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <div className="field">
              <label htmlFor="f-city">City</label>
              <input id="f-city" name="city" type="text" autoComplete="address-level2" required placeholder="Kochi" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <div className="field">
              <label htmlFor="f-efb">eFootball username</label>
              <input id="f-efb" name="efootball" type="text" required placeholder="Your in game name" />
              <span className="field__error" aria-live="polite"></span>
            </div>
            <fieldset className="field field--full">
              <legend>Preferred platform</legend>
              <div className="choices">
                <label className="choice"><input type="radio" name="platform" value="PlayStation" required /><span>PlayStation</span></label>
                <label className="choice"><input type="radio" name="platform" value="Xbox" /><span>Xbox</span></label>
                <label className="choice"><input type="radio" name="platform" value="PC" /><span>PC</span></label>
              </div>
              <span className="field__error" aria-live="polite"></span>
            </fieldset>
            <div className="form__foot field--full">
              <p className="form__fine">Demo form. Nothing is sent anywhere yet (Supabase wiring lands in Phase 2).</p>
              <button className="btn btn--primary" type="submit">
                <span className="btn__label">Confirm registration</span>
              </button>
            </div>
          </form>
        </div>

        <div className="modal__view success" data-view="success" hidden>
          <span className="success__badge" aria-hidden="true">
            <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" html={'<path d="m5 12.5 4.5 4.5L19 7.5"/>'} />
          </span>
          <h2 tabIndex={-1}>You&rsquo;re on the list!</h2>
          <p>Thanks for registering. Now go back up what you&rsquo;ve been saying in the group.</p>
          <button className="btn btn--primary success__done" type="button">Done</button>
        </div>
      </div>
    </div>
  );
}
