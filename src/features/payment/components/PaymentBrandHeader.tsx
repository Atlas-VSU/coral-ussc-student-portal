import Image from "next/image";

interface PaymentBrandHeaderProps {
  /** Short label shown below the brand name, e.g. "Student Verification" */
  stepLabel?: string;
}

export function PaymentBrandHeader({ stepLabel }: PaymentBrandHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 select-none">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Image src="/images/ussc-logo-1.webp" alt="USSC Connect" width={40} height={40} className="size-10 shrink-0 object-contain" priority />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-none tracking-wide text-brand-ink">
            USSC Connect
          </span>
          <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            Payment Portal
          </span>
        </div>
      </div>

      {stepLabel && (
        <p className="text-sm text-muted-foreground font-medium">{stepLabel}</p>
      )}
    </div>
  );
}
