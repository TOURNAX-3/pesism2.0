import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { adminCookieName, isValidAdminSession } from '@/lib/admin-session';
import { uploadMatchHighlight } from '@/lib/supabase-server';
import { getAdminMatch, updateAdminMatchHighlights } from '@/lib/tournax-api';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const store = await cookies();
  const session = store.get(adminCookieName())?.value;
  if (!(await isValidAdminSession(session))) {
    return NextResponse.json({ message: 'Admin login required.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: 'Could not read upload.' }, { status: 400 });
  }

  const matchId = String(form.get('matchId') ?? '').trim();
  const slotRaw = String(form.get('slot') ?? '');
  const slot = slotRaw === '1' ? 1 : slotRaw === '2' ? 2 : null;
  const raw = form.get('video');

  if (!matchId || slot === null || !(raw instanceof File) || raw.size === 0) {
    return NextResponse.json({ message: 'Choose a valid match, slot, and video file.' }, { status: 400 });
  }

  try {
    const publicUrl = await uploadMatchHighlight(raw, matchId);
    const current = await getAdminMatch(matchId);
    await updateAdminMatchHighlights(matchId, {
      highlightVideoUrl1: slot === 1 ? publicUrl : current.highlightVideoUrl1,
      highlightVideoUrl2: slot === 2 ? publicUrl : current.highlightVideoUrl2,
    });
    revalidatePath(`/admin/fixtures/${matchId}`);
    revalidatePath('/highlights');
    revalidatePath('/');
    return NextResponse.json({ publicUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}