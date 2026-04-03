'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import type { Brand } from '@/types';

export function BrandCard({ brand }: { brand: Brand }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${brand.name}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/brands/${brand.id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:bg-card-hover transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{brand.name}</h3>
          {brand.tagline && (
            <p className="text-muted text-sm mt-1">{brand.tagline}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/brands/${brand.id}/edit`}
            className="p-1.5 text-muted hover:text-foreground transition-colors"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={handleDelete}
            className="p-1.5 text-muted hover:text-danger transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mt-3">
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: brand.color_primary }}
          title="Primary"
        />
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: brand.color_secondary }}
          title="Secondary"
        />
        {brand.color_accent && (
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: brand.color_accent }}
            title="Accent"
          />
        )}
      </div>

      <div className="flex gap-2 mt-3 text-xs text-muted">
        <span>{brand.font_heading}</span>
        <span>/</span>
        <span>{brand.font_body}</span>
      </div>

      {brand.is_default && (
        <span className="inline-block mt-3 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
          Default
        </span>
      )}
    </div>
  );
}
