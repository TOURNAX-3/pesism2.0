import { revalidatePath } from 'next/cache';
import { approveRegistration, removeRegistration } from '@/lib/tournax-api';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function AdminPlayerActions({ playerId, approved, name }: { playerId: string; approved: boolean; name: string }) {
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
          <Button type="submit" size="sm">
            Approve
          </Button>
        </form>
      ) : null}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" size="sm" variant="destructive">
            Remove
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes their registration entirely. This can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={remove}>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit" variant="destructive">
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
