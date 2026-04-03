'use client';

import { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (url: string, path: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        onUpload(data.url, data.path);
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  return (
    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card-hover transition-colors">
      <Upload size={24} className="text-muted mb-2" />
      <span className="text-sm text-muted">
        {uploading ? 'Uploading...' : 'Click to upload a photo'}
      </span>
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </label>
  );
}
