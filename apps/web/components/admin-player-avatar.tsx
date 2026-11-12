'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { uploadPlayerAvatarAction } from '@/app/admin/actions';

export function AdminPlayerAvatar({
  playerId,
  name,
  avatarUrl,
}: {
  playerId: string;
  name: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set('photo', file);
      await uploadPlayerAvatarAction(playerId, fd);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-avatar-cell">
      <button
        type="button"
        className="admin-avatar-btn"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title={`Upload photo for ${name}`}
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" width={40} height={40} className="admin-avatar-img" unoptimized />
        ) : (
          <span className="admin-avatar-placeholder">{name.slice(0, 1).toUpperCase()}</span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      {error ? <span className="admin-avatar-error">{error}</span> : null}
    </div>
  );
}
