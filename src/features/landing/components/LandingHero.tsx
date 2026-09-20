export function LandingHero() {
  return (
    <div className="max-w-4xl space-y-8 animate-fade-in-up">
      <h1 className="text-2xl lg:text-6xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text hover:brightness-105 leading-[1.1] tracking-tight drop-shadow-[2px_2px_0px_rgba(139,195,74,0.2)]">
        Hello Viscan! {" "}
        <span className="block">
          Manage Your Records.
        </span>{" "}
        <span className="block">
          Settle Your Dues.
        </span>
      </h1>

      <p className="text-sm lg:text-md text-brand-green leading-relaxed max-w-2xl mx-auto font-medium">
        Welcome to USSC Connect Student Portal. Easily self-register, keep your student information up to date, and securely pay your USSC fines using SUREPAY, all in one place!
      </p>
    </div>
  );
}
