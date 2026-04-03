import type { TemplateData } from '@/types';

export function CinematicOverlay({ data }: { data: TemplateData }) {
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden">
      {/* Full-bleed photo */}
      {data.photoUrl && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${data.colorPrimary} 0%, ${data.colorPrimary}cc 30%, transparent 70%)`,
        }}
      />

      {/* Top brand bar */}
      <div className="absolute top-0 left-0 right-0 p-12 flex items-center justify-between z-10">
        <span
          className="text-sm tracking-[0.25em] uppercase opacity-80"
          style={{
            fontFamily: data.fontBody,
            color: data.colorSecondary,
          }}
        >
          {data.brandName}
        </span>
        {data.reviewCount && (
          <span
            className="text-sm opacity-60"
            style={{
              fontFamily: data.fontBody,
              color: data.colorSecondary,
            }}
          >
            {data.reviewCount}
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-16 z-10">
        <h2
          className="text-6xl font-bold mb-4 leading-tight max-w-[800px]"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorSecondary,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="text-xl leading-relaxed opacity-80 max-w-[650px]"
          style={{
            fontFamily: data.fontBody,
            color: data.colorSecondary,
          }}
        >
          {data.bodyText}
        </p>
      </div>
    </div>
  );
}
