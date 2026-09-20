import { CreditCard, UserPen, Pencil } from "lucide-react";
import { LandingFeatureCardsProps } from "../types";
import { FeatureCard } from "./FeatureCard";

export function LandingFeatureCards({
  onSelfRegisterClick,
  onUpdateInfoClick,
  onMakePaymentClick,
}: LandingFeatureCardsProps) {
  const gradientTitleClass = "bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text";

  return (
    <section className="w-full mt-16 md:mt-24 max-w-6xl mx-auto flex flex-col items-center animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      <h2 className="w-full text-xl lg:text-2xl font-bold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text hover:brightness-105 leading-[1.1] tracking-tight drop-shadow-[2px_2px_0px_rgba(139,195,74,0.2)] mb-8 text-left">
        What would you like to do?
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full text-left">
        <FeatureCard
          title="Self-Registration"
          description="New students can register their information for clearance."
          icon={UserPen}
          onClick={onSelfRegisterClick}
          iconColorClass="text-brand-green"
          titleClass={gradientTitleClass}
          actionText="Click to Register"
        />

        <FeatureCard
          title="Update Record"
          description="Update student information to ensure accurate information for clearance."
          icon={Pencil}
          onClick={onUpdateInfoClick}
          iconColorClass="text-secondary"
          titleClass={gradientTitleClass}
          actionText="Click to Update Record"
        />

        <FeatureCard
          title="SUREPAY"
          description="Review your academic term dues, attendance fines and securely pay."
          icon={CreditCard}
          onClick={onMakePaymentClick}
          iconColorClass="text-brand-leaf"
          titleClass={gradientTitleClass}
          actionText="Click to Access SUREPAY"
        />
      </div>
    </section>
  );
}
