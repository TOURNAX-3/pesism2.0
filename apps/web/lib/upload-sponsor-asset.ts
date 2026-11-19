import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const SPONSOR_BUCKET = 'sponsor-assets';
const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const PRODUCT_MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

function resolveImageType(file: File): string {
  if (file.type && ALLOWED.has(file.type)) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith('.png')) return 'image/png';
  if (name.endsWith('.webp')) return 'image/webp';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'image/jpeg';
  return file.type;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function ensureBucket(supabase: SupabaseClient, bucket: string) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(listError.message);
  if (buckets?.some((b) => b.name === bucket)) return;
  const { error: createError } = await supabase.storage.createBucket(bucket, { public: true });
  if (createError && !createError.message.toLowerCase().includes('already exists')) {
    throw new Error(
      createError.message.includes('not authorized')
        ? `Storage bucket missing. In Supabase create a public bucket named ${bucket}, or use a secret key with storage admin rights.`
        : createError.message,
    );
  }
}

/** Sponsor logo or product shot — isolated module so API routes don’t trip Turbopack on the big supabase-server barrel. */
export async function uploadSponsorAsset(
  file: File | Blob,
  sponsorId: string,
  kind: 'logo' | 'product',
): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error('Sponsor upload is not configured (Supabase keys missing).');
  }
  const maxBytes = kind === 'logo' ? LOGO_MAX_BYTES : PRODUCT_MAX_BYTES;
  if (file.size > maxBytes) {
    throw new Error(kind === 'logo' ? 'Logo must be 2 MB or smaller.' : 'Product image must be 4 MB or smaller.');
  }
  const asFile = file instanceof File ? file : new File([file], 'upload.jpg');
  const contentType = resolveImageType(asFile);
  if (!ALLOWED.has(contentType)) {
    throw new Error('Use a JPG, PNG, or WebP image.');
  }
  await ensureBucket(supabase, SPONSOR_BUCKET);

  const inputBuffer = Buffer.from(await file.arrayBuffer());
  const side = kind === 'logo' ? 512 : 1400;
  let out: Buffer;
  let uploadType = contentType;
  try {
    const pipeline = sharp(inputBuffer).rotate();
    out =
      kind === 'logo'
        ? await pipeline
            .resize(side, side, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .webp({ quality: 88 })
            .toBuffer()
        : await pipeline.resize(side, side, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toBuffer();
    uploadType = 'image/webp';
  } catch {
    throw new Error('Could not read that image — use a JPG, PNG, or WebP file.');
  }

  const path = `season-3/${sponsorId}/${kind}-${Date.now()}.webp`;
  const { error } = await supabase.storage.from(SPONSOR_BUCKET).upload(path, out, {
    contentType: uploadType,
    upsert: false,
  });
  if (error) {
    throw new Error(
      error.message.includes('Bucket not found')
        ? `Create the "${SPONSOR_BUCKET}" bucket in Supabase Storage (public).`
        : error.message,
    );
  }
  const { data } = supabase.storage.from(SPONSOR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}