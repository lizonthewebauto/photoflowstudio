'use client';

import { VIBE_OPTIONS, type Vibe } from '@/types';
import { cn } from '@/lib/utils';

interface VibeSelectorProps {
  value: Vibe | '';
  onChange: (vibe: Vibe) => void;
}

export function VibeSelector({ value, onChange }: VibeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">Vibe</label>
      <div className="flex flex-wrap gap-2">
        {VIBE_OPTIONS.map((vibe) => (
          <button
            key={vibe}
            type="button"
            onClick={() => onChange(vibe)}
            className={cn(
              'px-3 py-1.5 text-sm rounded border transition-colors',
              value === vibe
                ? 'bg-accent text-white border-accent'
                : 'border-border text-foreground hover:bg-card-hover'
            )}
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
}
