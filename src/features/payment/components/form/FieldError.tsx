import { FieldErrorProps } from "../../types/types";

export function FieldError({ message }: FieldErrorProps) {
  return (
    <p className="text-xs text-destructive flex items-center gap-1.5 mt-1.5 font-bold">
      <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-destructive text-[11px] font-bold text-white leading-none">!</span>
      {message}
    </p>
  );
}
