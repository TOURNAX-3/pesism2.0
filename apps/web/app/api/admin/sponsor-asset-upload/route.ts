import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { adminCookieName, isValidAdminSession } from '@/lib/admin-session';
import { uploadSponsorAsset } from '@/lib/upload-sponsor-asset';
import { getAdminSponsor, updateSponsor } from '@/lib/tournax-api';

export const runtime = 'nodejs';

import { MAX_SPONSOR_PRODUCT_IMAGES } from '@/lib/sponsor-limits';

export async function POST(request: Request) {
  const store = await cookies();
  if (!(await isValidAdminSession(store.get(adminCookieName())?.value))) {
    return NextResponse.json({ message: 'Admin login required.' }, { status: 401 });
  }

  const form = await request.formData();
  const sponsorId = String(form.get('sponsorId') ?? '').trim();
  const kindRaw = String(form.get('kind') ?? '');
  const kind = kindRaw === 'logo' || kindRaw === 'product' ? kindRaw : null;
  const raw = form.get('file');

  if (!sponsorId || !kind || !(raw instanceof File) || raw.size === 0) {
    return NextResponse.json({ message: 'Missing sponsor, image type, or file.' }, { status: 400 });
  }

  try {
    const current = await getAdminSponsor(sponsorId);
    if (kind === 'product' && (current.productImageUrls?.length ?? 0) >= MAX_SPONSOR_PRODUCT_IMAGES) {
      return NextResponse.json(
        { message: `Maximum ${MAX_SPONSOR_PRODUCT_IMAGES} product images per sponsor.` },
        { status: 400 },
      );
    }

    const publicUrl = await uploadSponsorAsset(raw, sponsorId, kind);
    const productImageUrls =
      kind === 'product'
        ? [...(current.productImageUrls ?? []), publicUrl].slice(0, MAX_SPONSOR_PRODUCT_IMAGES)
        : current.productImageUrls ?? [];

    const row = await updateSponsor(sponsorId, {
      name: current.name,
      tagline: current.tagline,
      description: current.description,
      productUrl: current.productUrl,
      logoUrl: kind === 'logo' ? publicUrl : current.logoUrl,
      instagramUrl: current.instagramUrl,
      telegramUrl: current.telegramUrl,
      productImageUrls,
    });

    revalidatePath('/admin/sponsors');
    revalidatePath('/sponsors');
    revalidatePath('/');

    return NextResponse.json({ publicUrl, kind, sponsor: row });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}