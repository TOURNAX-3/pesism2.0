'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { updateMatchHighlightsAction } from '@/app/admin/actions';
import type { AdminMatchDetail } from '@/lib/tournax-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function HighlightSlot({
  id,
  label,
  url,
  onUrlChange,
  onUpload,
  uploading,
}: {
  id: string;
  label: string;
  url: string;
  onUrlChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await onUpload(file);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-(--line) p-3">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="url"
        inputMode="url"
        placeholder="https://…/clip.mp4"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" className="sr-only" onChange={onFileChange} />
        <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? 'Uploading…' : 'Upload file'}
        </Button>
        <span className="text-xs text-muted-foreground">MP4 / WebM / MOV, max 100 MB</span>
      </div>
      {url ? (
        <div className="overflow-hidden rounded-md border border-(--line-2) bg-black/40">
          <video className="w-full max-h-48" src={url} controls playsInline preload="metadata" />
        </div>
      ) : null}
    </div>
  );
}

export function AdminMatchHighlights({ match }: { match: AdminMatchDetail }) {
  const router = useRouter();
  const [url1, setUrl1] = useState(match.highlightVideoUrl1 ?? '');
  const [url2, setUrl2] = useState(match.highlightVideoUrl2 ?? '');
  const [busy, setBusy] = useState(false);
  const [uploadSlot, setUploadSlot] = useState<1 | 2 | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUrl1(match.highlightVideoUrl1 ?? '');
    setUrl2(match.highlightVideoUrl2 ?? '');
  }, [match.highlightVideoUrl1, match.highlightVideoUrl2]);

  async function saveUrls() {
    setError(null);
    setSaved(false);
    setBusy(true);
    try {
      await updateMatchHighlightsAction(match.id, {
        highlightVideoUrl1: url1.trim() === '' ? null : url1.trim(),
        highlightVideoUrl2: url2.trim() === '' ? null : url2.trim(),
      });
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save highlights');
    } finally {
      setBusy(false);
    }
  }

  async function uploadSlotFile(slot: 1 | 2, file: File) {
    setError(null);
    setSaved(false);
    setUploadSlot(slot);
    try {
      const formData = new FormData();
      formData.set('matchId', match.id);
      formData.set('slot', String(slot));
      formData.set('video', file);
      const res = await fetch('/api/admin/match-highlight-upload', { method: 'POST', body: formData });
      const data = (await res.json().catch(() => ({}))) as { publicUrl?: string; message?: string };
      if (!res.ok) {
        throw new Error(data.message ?? `Upload failed (${res.status})`);
      }
      const publicUrl = data.publicUrl ?? '';
      if (slot === 1) setUrl1(publicUrl);
      else setUrl2(publicUrl);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadSlot(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Up to two clips per fixture ({match.homeName} vs {match.awayName}). Upload a file or paste a public{' '}
        <code className="text-xs">https://</code> URL. Clips show on the public Highlights page after save. Supabase bucket:{' '}
        <code className="text-xs">match-highlights</code> (public).
      </p>

      <HighlightSlot
        id="hl-1"
        label="Highlight video 1"
        url={url1}
        onUrlChange={setUrl1}
        uploading={uploadSlot === 1}
        onUpload={(file) => uploadSlotFile(1, file)}
      />
      <HighlightSlot
        id="hl-2"
        label="Highlight video 2 (optional)"
        url={url2}
        onUrlChange={setUrl2}
        uploading={uploadSlot === 2}
        onUpload={(file) => uploadSlotFile(2, file)}
      />

      {saved ? <p className="text-sm" style={{ color: 'var(--color-success)' }}>Highlights saved.</p> : null}
      {error ? <p className="admin-login-error">{error}</p> : null}

      <Button type="button" disabled={busy || uploadSlot !== null} variant="secondary" onClick={() => saveUrls()}>
        {busy ? 'Saving…' : 'Save URL changes'}
      </Button>
    </div>
  );
}