"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowLeft, BookOpen, Building2, ChevronRight, Loader2, UserCircle } from "lucide-react";
import { PaymentBrandHeader } from "../PaymentBrandHeader";
import { OrganizationCard } from "../cards/OrganizationCard";
import { PaymentProgressBar } from "../PaymentProgressBar";
import { Separator } from "@/components/ui/separator";
import { BackConfirmationModal } from "../BackConfirmationModal";
import { StudentData, TermData, OrganizationData, OrganizationSelectionPageProps } from "../../types/types";

export default function OrganizationSelectionPage({
  studentData,
  organizations,
  currentStep,
  isLoading = false,
  error = null,
  onBack,
  onNext,
  selectedTerm,
}: OrganizationSelectionPageProps) {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  // A logo URL can be stale or unreachable; falling back to the icon keeps the
  // row from rendering a broken image.
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const isOrganizationPayable = (organization: OrganizationData) => {
    if (organization.outstandingAmount > 0) {
      return true;
    }

    const summary = organization.paymentSummary;
    if (summary) {
      return summary.unpaid > 0 || summary.rejected > 0;
    }

    const states = organization.statusStates ?? [];
    return states.includes("unpaid") || states.includes("rejected");
  };

  const hasPayableOrganizations = organizations.some((organization) => isOrganizationPayable(organization));

  const handleOrgSelect = (orgId: string) => {
    const org = organizations.find((organization) => organization.id === orgId);
    if (!org || !isOrganizationPayable(org)) {
      return;
    }

    setSelectedOrg(orgId);
  };

  const handleContinue = async () => {
    if (isAdvancing) return;

    if (!hasPayableOrganizations) {
      onBack();
      return;
    }

    if (!selectedOrg) return;

    // Awaited even though the parent is currently synchronous: if it ever
    // starts fetching before advancing, the button reports it instead of
    // going dead. A synchronous handler resolves immediately and shows nothing.
    setIsAdvancing(true);
    try {
      await onNext(selectedOrg);
    } finally {
      setIsAdvancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        <PaymentBrandHeader />
        <div className="mb-8 w-full mt-4">
          <PaymentProgressBar
            currentStep={currentStep}
            subtitle="Choose the organization you want to settle dues with"
          />
        </div>
        <div className="w-full space-y-8">


          {/* Term & Student Info Banner Card */}
          <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
            <CardContent className="px-4 sm:px-6 py-4 space-y-4 relative z-10">
              {/* Term Row */}
              {selectedTerm && (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/5">
                      <CalendarDays className="h-6 w-6 text-brand-green" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-extrabold text-base leading-tight truncate bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
                        {selectedTerm.semester} Semester · A.Y. {selectedTerm.AY}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">Payment Term</p>
                    </div>
                  </div>
                  <Separator className="bg-border/50" />
                </>
              )}

              {/* Student Row */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/5">
                  <UserCircle className="h-6 w-6 text-brand-green" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-extrabold text-lg leading-tight truncate bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">{studentData.name}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted-foreground">
                    <span className="font-mono font-bold text-branding-green">{studentData.studentId}</span>
                    <span className="text-branding-green/70">•</span>
                    <span className="flex items-center gap-1 text-branding-green/90">
                      <BookOpen className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {studentData.programAcronym || studentData.programShortName || studentData.program}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Selection Card */}
          <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative mt-6">
            {/* Top-left corner accent */}
            <div className="absolute top-0 left-0 w-20 h-3 rounded-br-full bg-linear-to-r from-brand-leaf to-brand-green pointer-events-none" />
            <div className="absolute top-0 left-0 w-3 h-20 rounded-br-full bg-linear-to-r from-brand-leaf to-brand-green pointer-events-none" />

            <CardHeader className="px-6 sm:px-8 pt-8 pb-2 relative z-10">
              <CardTitle className="text-2xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">Select Organization</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Choose the organization you want to pay fees or fines for
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-8 pt-4">
              {isLoading ? (
                <div className="py-12 text-center text-muted-foreground text-sm flex items-center justify-center gap-2 relative z-10">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-green" />
                  Loading organizations...
                </div>
              ) : organizations.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No organization payment records found for this student.</p>
                  {error && <p className="text-xs text-destructive font-medium mt-2">{error}</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  {organizations.map((org) => (
                    <OrganizationCard
                      key={org.id}
                      org={org}
                      isSelected={selectedOrg === org.id}
                      isPayable={isOrganizationPayable(org)}
                      onSelect={handleOrgSelect}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse min-[400px]:flex-row justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setShowBackConfirm(true)} className="w-full min-[400px]:w-auto">
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={isLoading || isAdvancing || organizations.length === 0 || (hasPayableOrganizations && !selectedOrg)}
              className="w-full min-[400px]:w-auto gap-2 bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white"
            >
              {isAdvancing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </>
              ) : (
                <>
                  {hasPayableOrganizations ? "Continue to Payment Selection" : "Exit"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <BackConfirmationModal
        open={showBackConfirm}
        onOpenChange={setShowBackConfirm}
        onConfirm={onBack}
      />
    </div>
  );
}
