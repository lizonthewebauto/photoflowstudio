import type { TemplateData } from '@/types';

export function MinimalCentered({ data }: { data: TemplateData }) {
  return (
    <div
      className="relative w-[1080px] h-[1080px] overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: data.colorSecondary }}
    >
      {data.photoUrl && (
        <div className="w-[400px] h-[400px] rounded-full overflow-hidden mb-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h2
        className="text-5xl font-light mb-6 leading-tight max-w-[800px]"
        style={{
          fontFamily: data.fontHeading,
          color: data.colorPrimary,
        }}
      >
        {data.headline}
      </h2>

      <div
        className="w-12 h-[2px] mb-6"
        style={{ backgroundColor: data.colorPrimary }}
      />

      <p
        className="text-xl leading-relaxed opacity-70 max-w-[600px]"
        style={{
          fontFamily: data.fontBody,
          color: data.colorPrimary,
        }}
      >
        {data.bodyText}
      </p>

      <div className="mt-10">
        <span
          className="text-sm tracking-[0.3em] uppercase"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
            opacity: 0.5,
          }}
        >
          {data.brandName}
        </span>
      </div>
    </div>
  );
}
