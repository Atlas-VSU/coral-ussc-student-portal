"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  GraduationCap,
  Pencil,
  ShieldCheck,
  Globe,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { SelfRegisterDialog } from "./components/SelfRegisterDialog";
import { UpdateInformationDialog } from "./components/UpdateInformationDialog";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selfRegisterOpen, setSelfRegisterOpen] = useState(false);
  const [updateInfoOpen, setUpdateInfoOpen] = useState(false);

  const handleMakePayment = () => {
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-linear-to-b lg:bg-linear-to-br from-white from-30% to-brand-meadow text-foreground flex flex-col relative overflow-hidden font-sans">
      {/* Background Blurred Blobs */}
      <div className="absolute top-1/4 -left-32 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-[35rem] h-[35rem] bg-secondary/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

      {/* Header - Sticky Floating Navbar */}
      <header className="sticky top-4 z-40 max-w-5xl w-[calc(100%-2rem)] mx-auto bg-card/80 backdrop-blur-md border border-border/50 shadow-sm px-6 py-3 rounded-xl flex items-center justify-between transition-all duration-300 mt-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Image src="/images/ussc-logo-1.webp" alt="USSC Connect" width={40} height={40} className="size-10 shrink-0 object-contain" priority />
          <div className="flex flex-col">
            <span className="text-lg font-bold leading-none tracking-wide text-brand-ink">
              USSC Connect
            </span>
            <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
              Student Portal
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-brand-green">
          <button
            onClick={() => setSelfRegisterOpen(true)}
            className="hover:text-brand-ink transition-colors cursor-pointer"
          >
            Self-Register
          </button>
          <button
            onClick={() => setUpdateInfoOpen(true)}
            className="hover:text-brand-ink transition-colors cursor-pointer"
          >
            Update Record
          </button>
          <Button
            onClick={handleMakePayment}
            variant="secondary"
            size="sm"
            className="bg-linear-to-r from-brand-leaf to-brand-green text-white hover:brightness-105"
          >
            Pay Dues
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-primary hover:bg-muted rounded-full transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </header>

      {/* Mobile Menu - Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-24 left-4 right-4 z-40 bg-popover/95 backdrop-blur-md border border-border/50 p-6 space-y-4 flex flex-col shadow-lg rounded-xl animate-fade-in">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSelfRegisterOpen(true);
            }}
            className="text-left py-2 font-bold text-brand-green hover:text-brand-ink transition-colors cursor-pointer"
          >
            Self-Register
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setUpdateInfoOpen(true);
            }}
            className="text-left py-2 font-bold text-brand-green hover:text-brand-ink transition-colors cursor-pointer"
          >
            Update Record
          </button>
          <Button
            onClick={() => {
              setMobileMenuOpen(false);
              handleMakePayment();
            }}
            variant="secondary"
            className="w-full bg-linear-to-r from-brand-leaf to-brand-green text-white hover:brightness-105"
          >
            Pay Dues
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 md:py-24 max-w-6xl mx-auto w-full text-center relative z-10">
        <div className="max-w-4xl space-y-8 animate-fade-in-up">

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-brand-ink leading-[1.1] tracking-tight">
            Real-Time Eligibility.{" "}
            <span className="block">
              Effortless Settlement.
            </span>{" "}
            <span className="block">
              Total Clarity.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-ink leading-relaxed max-w-2xl mx-auto font-medium">
            Streamline your semestral clearance process by tracking your organizational fees and fines, settle payments online, and monitor your clearance status in real-time.
          </p>
        </div>

        {/* Portal Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-16 md:mt-24 text-left">
          {/* Card 1 — Self-Registration */}
          <div
            onClick={() => setSelfRegisterOpen(true)}
            className="bg-card border border-border/50 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-500 flex flex-col h-full group"
          >
            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
              <GraduationCap className="size-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Student Self-Registration</h3>
            <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
              New students can easily register for organization membership online by verifying their email address.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:text-secondary transition-colors duration-300">
              Register Now <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2 — Update Record */}
          <div
            onClick={() => setUpdateInfoOpen(true)}
            className="bg-card border border-border/50 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-500 flex flex-col h-full group"
          >
            <div className="size-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-secondary group-hover:text-secondary-foreground">
              <Pencil className="size-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Update Student Record</h3>
            <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
              Ensure your student information is accurate and up-to-date in order to receive correct clearance status.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:text-secondary transition-colors duration-300">
              Update Record <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3 — Pay Dues */}
          <div
            onClick={handleMakePayment}
            className="bg-card border border-border/50 rounded-xl p-8 shadow-sm hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-500 flex flex-col h-full group sm:col-span-2 lg:col-span-1"
          >
            <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
              <CreditCard className="size-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Pay Dues &amp; Fines</h3>
            <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
              Verify your enrollment, review academic term dues or attendance fines, and securely submit GCash receipts.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:text-secondary transition-colors duration-300">
              Settle Dues <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </main>

      {/* Dialog Modals */}
      <SelfRegisterDialog isOpen={selfRegisterOpen} onOpenChange={setSelfRegisterOpen} />
      <UpdateInformationDialog isOpen={updateInfoOpen} onOpenChange={setUpdateInfoOpen} />
    </div>
  );
}
