import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'player-avatars';
const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

function resolveImageType(file: File): string {
  if (file.type && ALLOWED.has(file.type)) {
    return file.type;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  return file.type;
}

async function ensureAvatarBucket(supabase: SupabaseClient) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(listError.message);
  }
  if (buckets?.some((b) => b.name === BUCKET)) {
    return;
  }
  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (createError && !createError.message.toLowerCase().includes('already exists')) {
    throw new Error(
      createError.message.includes('not authorized')
        ? 'Storage bucket missing. In Supabase create a public bucket named player-avatars, or use a secret key with storage admin rights.'
        : createError.message,
    );
  }
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function uploadPlayerAvatar(file: File): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Photo upload is not configured (Supabase keys missing).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Photo must be 2 MB or smaller.');
  }
  const contentType = resolveImageType(file);
  if (!ALLOWED.has(contentType)) {
    throw new Error('Use a JPG, PNG, or WebP photo.');
  }
  await ensureAvatarBucket(supabase);

  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  const path = `season-3/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) {
    throw new Error(
      error.message.includes('Bucket not found')
        ? `Create the "${BUCKET}" bucket in Supabase Storage (public).`
        : error.message,
    );
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
