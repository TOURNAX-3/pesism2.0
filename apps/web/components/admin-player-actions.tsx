import { revalidatePath } from 'next/cache';
import { approveRegistration, removeRegistration } from '@/lib/tournax-api';

export function AdminPlayerActions({ playerId, approved }: { playerId: string; approved: boolean }) {
  async function approve() {
    'use server';
    await approveRegistration(playerId);
    revalidatePath('/admin/players');
    revalidatePath('/admin');
  }

  async function remove() {
    'use server';
    await removeRegistration(playerId);
    revalidatePath('/admin/players');
    revalidatePath('/admin');
  }

  return (
    <div className="admin-actions-inner">
      {!approved ? (
        <form action={approve}>
          <button type="submit" className="admin-btn admin-btn--sm">
            Approve
          </button>
        </form>
      ) : null}
      <form action={remove}>
        <button type="submit" className="admin-btn admin-btn--sm admin-btn--danger">
          Remove
        </button>
      </form>
    </div>
  );
}
