import { SectionHeadingProps } from "../../types/types";

export function SectionHeading({ number, title, optional = false }: SectionHeadingProps) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-brand-leaf to-brand-green text-white text-xs font-bold shadow-sm">
        {number}
      </span>
      <p className="text-sm font-bold text-foreground">
        {title}
        {optional && <span className="ml-1 text-xs font-normal text-muted-foreground">(optional)</span>}
      </p>
    </div>
  );
}
