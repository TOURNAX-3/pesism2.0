'use server';

import { revalidatePath } from 'next/cache';
import {
  addGrievanceComment,
  closeRegistration,
  openRegistration,
  recordAdminMatch,
  scheduleAdminFixture,
  updateAdminMatch,
  updateGrievanceStatus,
  updatePlayerAvatar,
  type GrievanceStatus,
  type RecordMatchBody,
  type ScheduleFixtureBody,
  type UpdateMatchBody,
} from '@/lib/tournax-api';
import { uploadPlayerAvatar } from '@/lib/supabase-server';

export async function closeRegistrationAction() {
  await closeRegistration();
  revalidatePath('/admin');
  revalidatePath('/admin/players');
}

export async function openRegistrationAction() {
  await openRegistration();
  revalidatePath('/admin');
  revalidatePath('/admin/players');
}

/** Runs on the Next.js server so `ADMIN_API_KEY` is never sent from the browser. */
export async function recordMatchAction(body: RecordMatchBody) {
  const row = await recordAdminMatch(body);
  revalidatePath('/admin/fixtures');
  revalidatePath('/admin/schedule');
  revalidatePath('/admin/table');
  revalidatePath('/table');
  revalidatePath('/fixtures');
  revalidatePath('/');
  return row;
}

export async function scheduleFixtureAction(body: ScheduleFixtureBody) {
  const row = await scheduleAdminFixture(body);
  revalidatePath('/admin/schedule');
  revalidatePath('/fixtures');
  revalidatePath('/');
  return row;
}

export async function uploadPlayerAvatarAction(playerId: string, formData: FormData) {
  const photo = formData.get('photo');
  if (!(photo instanceof File) || photo.size === 0) {
    throw new Error('Choose a photo file.');
  }
  const avatarUrl = await uploadPlayerAvatar(photo);
  await updatePlayerAvatar(playerId, avatarUrl);
  revalidatePath('/admin/players');
  revalidatePath('/');
  revalidatePath('/table');
}

export async function updateGrievanceStatusAction(grievanceId: string, status: GrievanceStatus) {
  const detail = await updateGrievanceStatus(grievanceId, status);
  revalidatePath('/admin/grievances');
  revalidatePath(`/admin/grievances/${grievanceId}`);
  return detail;
}

export async function addGrievanceCommentAction(grievanceId: string, body: string) {
  const detail = await addGrievanceComment(grievanceId, body);
  revalidatePath('/admin/grievances');
  revalidatePath(`/admin/grievances/${grievanceId}`);
  return detail;
}

export async function updateMatchAction(matchId: string, body: UpdateMatchBody) {
  const detail = await updateAdminMatch(matchId, body);
  revalidatePath('/admin/fixtures');
  revalidatePath('/admin/schedule');
  revalidatePath(`/admin/fixtures/${matchId}`);
  revalidatePath('/admin/table');
  revalidatePath('/table');
  revalidatePath('/fixtures');
  revalidatePath('/');
  return detail;
}
