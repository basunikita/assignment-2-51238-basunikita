import type { Swatch as SwatchData } from "@/app/moods";

export default function Swatch({
  swatch,
  textToken,
  className = "h-36",
}: {
  swatch: SwatchData;
  textToken: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-end p-3 font-label ${className}`}
      style={{ background: swatch.hex, color: `var(--swatch-${textToken})` }}
    >
      <p className="text-sm font-bold">{swatch.name}</p>
      <p className="text-xs">
        {swatch.hex} · {swatch.role}
      </p>
    </div>
  );
}
