import { closeRegistrationAction, openRegistrationAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';

export function AdminRegistrationActions({ registrationOpen }: { registrationOpen: boolean }) {
  return (
    <div className="admin-registration-actions">
      {registrationOpen ? (
        <form action={closeRegistrationAction}>
          <Button type="submit">Close registration</Button>
        </form>
      ) : (
        <form action={openRegistrationAction}>
          <Button type="submit">Reopen registration</Button>
        </form>
      )}
    </div>
  );
}
