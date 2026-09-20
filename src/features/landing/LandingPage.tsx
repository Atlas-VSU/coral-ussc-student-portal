"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelfRegisterDialog } from "./components/SelfRegisterDialog";
import { UpdateInformationDialog } from "./components/UpdateInformationDialog";
import { LandingHeader } from "./components/LandingHeader";
import { LandingHero } from "./components/LandingHero";
import { LandingFeatureCards } from "./components/LandingFeatureCards";

export default function LandingPage() {
  const router = useRouter();
  const [selfRegisterOpen, setSelfRegisterOpen] = useState(false);
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false);

  const handleMakePayment = () => {
    router.push("/payment");
  };

  const handleSelfRegisterClick = () => setSelfRegisterOpen(true);
  const handleUpdateInfoClick = () => setUpdateInfoOpen(true);

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col relative overflow-hidden font-sans">
      <LandingHeader />
      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-16 md:pt-40 md:pb-24 max-w-6xl mx-auto w-full text-center relative z-10">
        <LandingHero />
        <LandingFeatureCards
          onSelfRegisterClick={handleSelfRegisterClick}
          onUpdateInfoClick={handleUpdateInfoClick}
          onMakePaymentClick={handleMakePayment}
        />
      </main>

      {/* Dialog Modals */}
      <SelfRegisterDialog isOpen={selfRegisterOpen} onOpenChange={setSelfRegisterOpen} />
      <UpdateInformationDialog isOpen={updateInfoOpen} onOpenChange={setUpdateInfoOpen} />
    </div>
  );
}
