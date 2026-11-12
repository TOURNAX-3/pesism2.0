'use client';

import { useEffect, useRef, useState } from 'react';

export function RegisterPhotoField() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!form) return;

    const onReset = () => {
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (input) input.value = '';
    };

    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onPick(file: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="field field--full field--photo">
      <label htmlFor="f-photo">Profile photo</label>
      <div className="photo-upload">
        <div className="photo-upload__preview" data-empty={preview ? undefined : ''}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob preview in modal
            <img src={preview} alt="" width={72} height={72} />
          ) : (
            <span className="photo-upload__placeholder" aria-hidden="true">
              Photo
            </span>
          )}
        </div>
        <div className="photo-upload__body">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => inputRef.current?.click()}
          >
            Choose photo
          </button>
          <p className="photo-upload__hint">JPG, PNG or WebP · max 2 MB · shown on the site after approval.</p>
        </div>
        <input
          ref={inputRef}
          id="f-photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          required
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />
      </div>
      <span className="field__error" aria-live="polite"></span>
    </div>
  );
}
