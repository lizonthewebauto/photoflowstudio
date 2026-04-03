import type { TemplateData } from '@/types';

export function SplitStory({ data }: { data: TemplateData }) {
  return (
    <div className="relative w-[1080px] h-[1080px] overflow-hidden flex">
      {/* Left: Photo */}
      <div className="w-1/2 h-full relative">
        {data.photoUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.photoUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <div
            className="w-full h-full"
            style={{ backgroundColor: data.colorPrimary, opacity: 0.2 }}
          />
        )}
      </div>

      {/* Right: Content */}
      <div
        className="w-1/2 h-full flex flex-col justify-center px-14"
        style={{ backgroundColor: data.colorSecondary }}
      >
        <div
          className="w-10 h-10 rounded-full mb-8"
          style={{ backgroundColor: data.colorPrimary, opacity: 0.15 }}
        />

        <h2
          className="text-4xl font-bold mb-6 leading-snug"
          style={{
            fontFamily: data.fontHeading,
            color: data.colorPrimary,
          }}
        >
          {data.headline}
        </h2>

        <p
          className="text-lg leading-relaxed opacity-70 mb-8"
          style={{
            fontFamily: data.fontBody,
            color: data.colorPrimary,
          }}
        >
          {data.bodyText}
        </p>

        <div className="flex flex-col gap-1">
          <span
            className="text-base font-semibold"
            style={{
              fontFamily: data.fontHeading,
              color: data.colorPrimary,
            }}
          >
            {data.brandName}
          </span>
          {data.reviewTagline && (
            <span
              className="text-sm opacity-50"
              style={{
                fontFamily: data.fontBody,
                color: data.colorPrimary,
              }}
            >
              {data.reviewTagline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
