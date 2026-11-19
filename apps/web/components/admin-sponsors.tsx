'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition, useCallback } from 'react';
import {
  createSponsorAction,
  deleteSponsorAction,
  setSponsorBannerAction,
  updateSponsorAction,
} from '@/app/admin/actions';
import type { SponsorRow } from '@/lib/tournax-api';
import { normalizeInstagramInput, normalizeTelegramInput } from '@/lib/sponsor-social-normalize';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { MAX_SPONSOR_PRODUCT_IMAGES } from '@/lib/sponsor-limits';

const MAX_PRODUCT_IMAGES = MAX_SPONSOR_PRODUCT_IMAGES;

export type SponsorFormState = {
  name: string;
  tagline: string;
  description: string;
  productUrl: string;
  logoUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  productImageUrls: string[];
};

function emptyForm(): SponsorFormState {
  return {
    name: '',
    tagline: '',
    description: '',
    productUrl: '',
    logoUrl: '',
    instagramUrl: '',
    telegramUrl: '',
    productImageUrls: [],
  };
}

function rowToForm(row: SponsorRow): SponsorFormState {
  return {
    name: row.name,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    productUrl: row.productUrl ?? '',
    logoUrl: row.logoUrl ?? '',
    instagramUrl: row.instagramUrl ?? '',
    telegramUrl: row.telegramUrl ?? '',
    productImageUrls: [...(row.productImageUrls ?? [])],
  };
}

async function uploadSponsorFile(sponsorId: string, kind: 'logo' | 'product', file: File) {
  const fd = new FormData();
  fd.set('sponsorId', sponsorId);
  fd.set('kind', kind);
  fd.set('file', file);
  const res = await fetch('/api/admin/sponsor-asset-upload', { method: 'POST', body: fd });
  const data = (await res.json().catch(() => ({}))) as {
    publicUrl?: string;
    sponsor?: SponsorRow;
    message?: string;
  };
  if (!res.ok) throw new Error(data.message ?? `Upload failed (${res.status})`);
  return { publicUrl: data.publicUrl!, sponsor: data.sponsor };
}

type StagedAsset = { file: File; previewUrl: string };

function stageFile(file: File): StagedAsset {
  return { file, previewUrl: URL.createObjectURL(file) };
}

export function AdminSponsors({ sponsors }: { sponsors: SponsorRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm());
  const [createBanner, setCreateBanner] = useState(false);
  const [createStagedLogo, setCreateStagedLogo] = useState<StagedAsset | null>(null);
  const [createStagedProducts, setCreateStagedProducts] = useState<StagedAsset[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [uploading, setUploading] = useState<string | null>(null);
  const createPanelRef = useRef<HTMLDivElement>(null);

  function clearCreateStaged() {
    if (createStagedLogo) URL.revokeObjectURL(createStagedLogo.previewUrl);
    createStagedProducts.forEach((s) => URL.revokeObjectURL(s.previewUrl));
    setCreateStagedLogo(null);
    setCreateStagedProducts([]);
  }

  function toggleBanner(row: SponsorRow) {
    setError(null);
    startTransition(async () => {
      try {
        await setSponsorBannerAction(row.id, !row.bannerActive);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not update banner');
      }
    });
  }

  function sponsorPayload(form: SponsorFormState) {
    return {
      name: form.name.trim(),
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      productUrl: form.productUrl.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      instagramUrl: normalizeInstagramInput(form.instagramUrl),
      telegramUrl: normalizeTelegramInput(form.telegramUrl),
      productImageUrls: form.productImageUrls,
    };
  }

  function persistEdit(sponsorId: string, form: SponsorFormState) {
    return updateSponsorAction(sponsorId, sponsorPayload(form));
  }

  async function onLogoUpload(
    sponsorId: string,
    file: File,
    setForm: (next: SponsorFormState) => void,
  ) {
    setUploading('logo');
    setError(null);
    try {
      const { sponsor } = await uploadSponsorFile(sponsorId, 'logo', file);
      if (sponsor) setForm(rowToForm(sponsor));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Logo upload failed');
    } finally {
      setUploading(null);
    }
  }

  async function onProductUpload(
    sponsorId: string,
    file: File,
    getForm: () => SponsorFormState,
    setForm: (next: SponsorFormState) => void,
  ) {
    setUploading('product');
    setError(null);
    try {
      const prev = getForm();
      if (prev.productImageUrls.length >= MAX_PRODUCT_IMAGES) {
        throw new Error(`Max ${MAX_PRODUCT_IMAGES} product images.`);
      }
      const { sponsor } = await uploadSponsorFile(sponsorId, 'product', file);
      if (sponsor) setForm(rowToForm(sponsor));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Product upload failed');
    } finally {
      setUploading(null);
    }
  }

  const openCreate = useCallback(() => {
    setEditId(null);
    setError(null);
    setCreateOpen(true);
    requestAnimationFrame(() => createPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  const cancelCreate = useCallback(() => {
    clearCreateStaged();
    setCreateOpen(false);
    setCreateForm(emptyForm());
    setCreateBanner(false);
  }, []);

  return (
    <div className="flex flex-col gap-6" data-live-refresh="pause">
      <p className="text-sm text-muted-foreground">
        Deck them out: logo, product shots (up to {MAX_PRODUCT_IMAGES}), IG + Telegram. One partner runs the home ticker at a
        time — flip &quot;Home ticker&quot; to swap who&apos;s shouting in the scroll.
      </p>
      {error ? <p className="admin-login-error">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="default"
          size="default"
          onClick={() => (createOpen ? cancelCreate() : openCreate())}
        >
          {createOpen ? 'Cancel new sponsor' : 'Add sponsor'}
        </Button>
        {editId && !createOpen ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}>
            Close editor
          </Button>
        ) : null}
      </div>

      {createOpen ? (
        <div ref={createPanelRef}>
        <SponsorEditor
          form={createForm}
          setForm={setCreateForm}
          sponsorId={null}
          uploading={uploading}
          stagedLogoPreview={createStagedLogo?.previewUrl ?? null}
          stagedProductPreviews={createStagedProducts.map((s) => s.previewUrl)}
          onLogoUpload={(file) => {
            setCreateStagedLogo((prev) => {
              if (prev) URL.revokeObjectURL(prev.previewUrl);
              return stageFile(file);
            });
          }}
          onProductUpload={(file) => {
            setCreateStagedProducts((prev) => {
              if (prev.length >= MAX_PRODUCT_IMAGES) return prev;
              return [...prev, stageFile(file)];
            });
          }}
          onRemoveStagedProduct={(previewUrl) => {
            setCreateStagedProducts((prev) => {
              const hit = prev.find((s) => s.previewUrl === previewUrl);
              if (hit) URL.revokeObjectURL(hit.previewUrl);
              return prev.filter((s) => s.previewUrl !== previewUrl);
            });
          }}
          footer={
            <>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={createBanner} onChange={(e) => setCreateBanner(e.target.checked)} />
                Run home ticker right away
              </label>
              <Button
                type="button"
                disabled={pending}
                onClick={() => {
                  setError(null);
                  startTransition(async () => {
                    try {
                      const row = await createSponsorAction({
                        ...sponsorPayload(createForm),
                        bannerActive: createBanner,
                      });

                      let next = rowToForm(row);
                      if (createStagedLogo) {
                        setUploading('logo');
                        const { sponsor } = await uploadSponsorFile(row.id, 'logo', createStagedLogo.file);
                        if (sponsor) next = rowToForm(sponsor);
                      }
                      for (const shot of createStagedProducts) {
                        setUploading('product');
                        const { sponsor } = await uploadSponsorFile(row.id, 'product', shot.file);
                        if (sponsor) next = rowToForm(sponsor);
                      }

                      setCreateForm(emptyForm());
                      setCreateBanner(false);
                      clearCreateStaged();
                      setCreateOpen(false);
                      setEditId(null);
                      router.refresh();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Could not create sponsor');
                    } finally {
                      setUploading(null);
                    }
                  });
                }}
              >
                Save sponsor
              </Button>
            </>
          }
        />
        </div>
      ) : null}

      <ul className="flex flex-col gap-3">
        {sponsors.length === 0 ? (
          <li className="text-sm text-muted-foreground">No sponsors yet.</li>
        ) : (
          sponsors.map((row) => (
            <li key={row.id} className="rounded-lg border border-(--line) p-4">
              {editId === row.id ? (
                <SponsorEditor
                  form={editForm}
                  setForm={setEditForm}
                  sponsorId={row.id}
                  uploading={uploading}
                  onLogoUpload={(f) => onLogoUpload(row.id, f, setEditForm)}
                  onProductUpload={(f) => onProductUpload(row.id, f, () => editForm, setEditForm)}
                  footer={
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={pending}
                        onClick={() => {
                          setError(null);
                          startTransition(async () => {
                            try {
                              await persistEdit(row.id, editForm);
                              setEditId(null);
                              router.refresh();
                            } catch (err) {
                              setError(err instanceof Error ? err.message : 'Could not save');
                            }
                          });
                        }}
                      >
                        Save
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}>
                        Cancel
                      </Button>
                    </div>
                  }
                />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    {row.logoUrl ? (
                      <Image src={row.logoUrl} alt="" width={56} height={56} className="rounded-md object-contain" unoptimized />
                    ) : null}
                    <div>
                      <p className="font-semibold">{row.name}</p>
                      {row.tagline ? <p className="text-sm text-muted-foreground">{row.tagline}</p> : null}
                      {!row.logoUrl && (row.productImageUrls?.length ?? 0) === 0 ? (
                        <p className="text-xs text-(--color-warning,#e8b923) mt-1">No logo or product shots on file — Edit to upload.</p>
                      ) : null}
                      <p className="text-xs text-muted-foreground mt-1">
                        {(row.productImageUrls?.length ?? 0)}/{MAX_PRODUCT_IMAGES} product shots
                        {row.instagramUrl ? ' · IG' : ''}
                        {row.telegramUrl ? ' · TG' : ''}
                      </p>
                      {row.bannerActive ? (
                        <p className="text-xs font-bold uppercase tracking-wider text-(--color-success) mt-1">Home ticker ON</p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={row.bannerActive ? 'default' : 'outline'}
                      disabled={pending}
                      onClick={() => toggleBanner(row)}
                    >
                      {row.bannerActive ? 'Ticker off' : 'Home ticker'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        cancelCreate();
                        setEditId(row.id);
                        setEditForm(rowToForm(row));
                      }}
                    >
                      Edit · logo & shots
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      onClick={() => {
                        if (!confirm(`Delete ${row.name}?`)) return;
                        startTransition(async () => {
                          try {
                            await deleteSponsorAction(row.id);
                            router.refresh();
                          } catch (err) {
                            setError(err instanceof Error ? err.message : 'Could not delete');
                          }
                        });
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function SponsorEditor({
  form,
  setForm,
  sponsorId,
  uploading,
  onLogoUpload,
  onProductUpload,
  stagedLogoPreview = null,
  stagedProductPreviews = [],
  onRemoveStagedProduct,
  footer,
}: {
  form: SponsorFormState;
  setForm: (v: SponsorFormState | ((prev: SponsorFormState) => SponsorFormState)) => void;
  sponsorId: string | null;
  uploading: string | null;
  onLogoUpload: (file: File) => void;
  onProductUpload: (file: File) => void;
  stagedLogoPreview?: string | null;
  stagedProductPreviews?: string[];
  onRemoveStagedProduct?: (previewUrl: string) => void;
  footer: React.ReactNode;
}) {
  const logoRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<HTMLInputElement>(null);

  function removeProductUrl(url: string) {
    setForm((prev) => ({ ...prev, productImageUrls: prev.productImageUrls.filter((u) => u !== url) }));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="sp-name">Name</Label>
          <Input
            id="sp-name"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="sp-tag">Ticker one-liner</Label>
          <Input
            id="sp-tag"
            placeholder="What scrolls on the home banner"
            value={form.tagline}
            onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="sp-desc">Hype on the sponsors page</Label>
          <textarea
            id="sp-desc"
            className="min-h-20 rounded-md border border-(--line) bg-(--bg-2) px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="sm:col-span-2 rounded-lg border border-(--line) bg-(--bg-2)/60 p-3 flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Social (optional)</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sp-ig">Instagram</Label>
              <Input
                id="sp-ig"
                type="text"
                autoComplete="off"
                placeholder="@handle or paste profile link"
                value={form.instagramUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sp-tg">Telegram</Label>
              <Input
                id="sp-tg"
                type="text"
                autoComplete="off"
                placeholder="@channel or t.me/…"
                value={form.telegramUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, telegramUrl: e.target.value }))}
              />
            </div>
          </div>
          <AdminSocialPreview instagramUrl={form.instagramUrl} telegramUrl={form.telegramUrl} />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="sp-url">Store / offer link (optional)</Label>
          <Input
            id="sp-url"
            type="url"
            placeholder="https://…"
            value={form.productUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, productUrl: e.target.value }))}
          />
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-(--line) p-4 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Logo</p>
        <div className="flex flex-wrap items-center gap-3">
          {form.logoUrl ? (
            <Image src={form.logoUrl} alt="" width={72} height={72} className="rounded-md object-contain" unoptimized />
          ) : stagedLogoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob preview before save
            <img src={stagedLogoPreview} alt="" width={72} height={72} className="size-[4.5rem] rounded-md object-contain" />
          ) : (
            <div className="size-[4.5rem] rounded-md border border-(--line) bg-(--bg-2) text-xs text-muted-foreground grid place-items-center px-2 text-center">
              No logo yet
            </div>
          )}
        </div>
        <input
          ref={logoRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) onLogoUpload(f);
          }}
        />
        <Button
          type="button"
          className="w-full sm:w-auto"
          disabled={uploading !== null}
          onClick={() => logoRef.current?.click()}
        >
          {uploading === 'logo' ? 'Uploading…' : sponsorId ? 'Upload logo from computer' : 'Choose logo from computer'}
        </Button>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WebP · max 2 MB. Or paste a URL:</p>
        <Input
          placeholder="https://…"
          value={form.logoUrl}
          onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
        />
      </div>

      <div className="rounded-lg border border-dashed border-(--line) p-3 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Product shots ({form.productImageUrls.length + stagedProductPreviews.length}/{MAX_PRODUCT_IMAGES})
        </p>
        <ul className="flex flex-wrap gap-2">
          {form.productImageUrls.map((url) => (
            <li key={url} className="relative">
              <Image src={url} alt="" width={80} height={80} className="rounded-md object-cover size-20" unoptimized />
              <button
                type="button"
                className="absolute -top-1 -right-1 size-5 rounded-full bg-(--color-ink) text-[10px] text-white"
                aria-label="Remove image"
                onClick={() => removeProductUrl(url)}
              >
                ×
              </button>
            </li>
          ))}
          {stagedProductPreviews.map((previewUrl) => (
            <li key={previewUrl} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- blob preview */}
              <img src={previewUrl} alt="" width={80} height={80} className="size-20 rounded-md object-cover" />
              {onRemoveStagedProduct ? (
                <button
                  type="button"
                  className="absolute -top-1 -right-1 size-5 rounded-full bg-(--color-ink) text-[10px] text-white"
                  aria-label="Remove staged image"
                  onClick={() => onRemoveStagedProduct(previewUrl)}
                >
                  ×
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {form.productImageUrls.length + stagedProductPreviews.length < MAX_PRODUCT_IMAGES ? (
          <>
            <input
              ref={productRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) onProductUpload(f);
              }}
            />
            <Button
              type="button"
              className="w-full sm:w-auto"
              disabled={uploading !== null}
              onClick={() => productRef.current?.click()}
            >
              {uploading === 'product' ? 'Uploading…' : 'Add product image from computer'}
            </Button>
            <p className="text-xs text-muted-foreground">Up to {MAX_PRODUCT_IMAGES} shots · max 4 MB each</p>
          </>
        ) : null}
        <Input
          placeholder="Or paste image URL (https) — add in the list when you Save"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            const input = e.currentTarget;
            const v = input.value.trim();
            if (!v || form.productImageUrls.length >= MAX_PRODUCT_IMAGES) return;
            setForm((prev) => ({ ...prev, productImageUrls: [...prev.productImageUrls, v] }));
            input.value = '';
          }}
        />
        <p className="text-xs text-muted-foreground">Press Enter after a URL to queue it; hit Save to persist.</p>
      </div>

      {footer}
    </div>
  );
}

function AdminSocialPreview({ instagramUrl, telegramUrl }: { instagramUrl: string; telegramUrl: string }) {
  const ig = normalizeInstagramInput(instagramUrl);
  const tg = normalizeTelegramInput(telegramUrl);
  if (!ig && !tg) {
    return <p className="text-xs text-muted-foreground">Leave blank if they have no socials — chips show on the public sponsors page when added.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {ig ? (
        <a
          className="inline-flex items-center rounded-full border border-(--line) px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:border-(--color-accent)"
          href={ig}
          target="_blank"
          rel="noopener noreferrer"
        >
          IG · preview
        </a>
      ) : null}
      {tg ? (
        <a
          className="inline-flex items-center rounded-full border border-(--line) px-3 py-1 text-xs font-semibold uppercase tracking-wide hover:border-(--color-accent)"
          href={tg}
          target="_blank"
          rel="noopener noreferrer"
        >
          TG · preview
        </a>
      ) : null}
    </div>
  );
}