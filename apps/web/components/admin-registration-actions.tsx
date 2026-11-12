import { closeRegistrationAction, openRegistrationAction } from '@/app/admin/actions';

export function AdminRegistrationActions({ registrationOpen }: { registrationOpen: boolean }) {
  return (
    <div className="admin-registration-actions">
      {registrationOpen ? (
        <form action={closeRegistrationAction}>
          <button type="submit" className="admin-btn admin-btn--primary">
            Close registration
          </button>
        </form>
      ) : (
        <form action={openRegistrationAction}>
          <button type="submit" className="admin-btn admin-btn--primary">
            Reopen registration
          </button>
        </form>
      )}
    </div>
  );
}
