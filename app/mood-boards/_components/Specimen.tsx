import type { ReactNode } from "react";

export default function Specimen({
  caption,
  children,
  className = "",
}: {
  caption: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
      <p className="mt-4 font-label text-[11px] uppercase tracking-[0.14em] text-muted">{caption}</p>
    </div>
  );
}
