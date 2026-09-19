import Image from "next/image";

export function LandingHeader() {
  return (
    <header className="absolute m-4 md:m-8 inset-x-0 md:inset-x-3 top-0 z-40 px-4 sm:px-6 md:px-10 py-0 flex items-center justify-start bg-transparent h-16 md:h-20">
      <div className="inline-flex items-center gap-2 sm:gap-4 group">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo */}
          <Image
            src="/images/ussc-logo-1.webp"
            alt="USSC Connect"
            width={80}
            height={80}
            className="size-12 sm:size-14 md:size-20 shrink-0 object-contain"
            priority
          />
          <div className="flex flex-col justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-none tracking-wide bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
              USSC CONNECT
            </span>
            <span className="-mt-0.5 text-[10px] sm:text-xs md:text-base font-medium uppercase tracking-wider bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
              Student Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
