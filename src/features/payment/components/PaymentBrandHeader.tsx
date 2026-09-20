import Image from "next/image";

import { PaymentBrandHeaderProps } from "../types/types";

export function PaymentBrandHeader({ stepLabel }: PaymentBrandHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 select-none">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Image src="/images/ussc-logo-1.webp" alt="USSC Connect" width={60} height={60} className="size-12 shrink-0 object-contain" priority />
        <div className="flex flex-col">
          <span className="text-lg font-extrabold leading-none tracking-wide bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
            USSC CONNECT
          </span>
          <span className="mt-1 inline-flex w-fit items-center font-medium uppercase tracking-wider bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
            SUREPAY
          </span>
        </div>
      </div>

      {stepLabel && (
        <p className="mt-5 text-sm text-brand-green font-medium">{stepLabel}</p>
      )}
    </div>
  );
}
