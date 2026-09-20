"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, ArrowLeft, BookOpen, Building2, Receipt, AlertCircle, CheckCircle2, Loader2, UserCircle } from "lucide-react";
import { PaymentBrandHeader } from "../PaymentBrandHeader";
import { PaymentProgressBar } from "../PaymentProgressBar";
import { StudentData, TermData, OrganizationData, FeeItem, Fine, FineItem, FinesFeesSelectionPageProps } from "../../types/types";
import { FeeItemCard } from "../items/FeeItemCard";
import { FineItemCard } from "../items/FineItemCard";
import { BackConfirmationModal } from "../BackConfirmationModal";
export default function FinesFeesSelectionPage({
  studentData,
  organizationData,
  currentStep,
  fees,
  fines,
  fineItems,
  isLoading = false,
  onBack,
  onNext,
  selectedTerm,
}: FinesFeesSelectionPageProps) {
  // Selection is per item. It used to be two all-or-nothing switches, so a
  // student who could only afford one fine had to pay every fine at once.
  const [selectedFeeIds, setSelectedFeeIds] = useState<Set<string>>(new Set());
  const [selectedFineItemIds, setSelectedFineItemIds] = useState<Set<string>>(new Set());
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const toggleId = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) =>
    (id: string) =>
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

  const toggleFee = toggleId(setSelectedFeeIds);
  const toggleFineItem = toggleId(setSelectedFineItemIds);

  const getPaymentStatus = (item: {
    isPayable?: boolean;
    paymentState?: "unpaid" | "pending" | "rejected" | "verified";
    latestRejectionReason?: string;
  }) => {
    if (item.paymentState === "verified") {
      return {
        label: "Approved",
        className: "border-success/40 bg-success-muted text-success",
      };
    }
    if (item.paymentState === "pending" || (!item.isPayable && item.paymentState !== "rejected")) {
      return {
        label: "Pending",
        className: "border-warning bg-warning-muted text-warning-foreground",
      };
    }

    if (item.paymentState === "rejected" || item.latestRejectionReason) {
      return {
        label: "Declined",
        className: "border-destructive/20 bg-destructive/10 text-destructive",
      };
    }

    return {
      label: "Payable",
      className: "border-primary/20 bg-primary/10 text-primary",
    };
  };

  const formatDisplayDate = (value?: unknown) => {
    if (!value) return null;

    if (
      typeof value === "object" &&
      value !== null &&
      "_seconds" in value &&
      typeof (value as { _seconds?: unknown })._seconds === "number"
    ) {
      const seconds = (value as { _seconds: number })._seconds;
      return new Date(seconds * 1000).toLocaleDateString();
    }

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value.toLocaleDateString();
    }

    if (typeof value !== "string") return null;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString();
  };

  const payableFees = useMemo(() => fees.filter((fee) => fee.isPayable !== false), [fees]);
  // `isPayable` is computed per item on the server from that item's own flags.
  // Filtering on `!isPending` alone counted settled items as payable now that
  // the API returns them, so the student could see paid fines offered for
  // payment again.
  const payableFineItems = useMemo(
    () => fineItems.filter((fine) => (fine.isPayable ?? !fine.isPending) && !fine.isPaid),
    [fineItems]
  );
  const pendingFines = useMemo(() => fineItems.filter((fine) => fine.isPending === true), [fineItems]);
  const payableFines = useMemo(() => payableFineItems.length > 0 ? fines : [], [fines, payableFineItems]);

  // The card headers show what is still OWED. They used to sum every row
  // including settled ones, so the header total silently disagreed with the
  // "Pay All" figure directly beneath it with nothing to explain the gap.
  const feesTotal = useMemo(() => {
    return payableFees.reduce((sum, fee) => sum + fee.amount, 0);
  }, [payableFees]);

  const finesTotal = useMemo(() => {
    return payableFineItems.reduce((sum, fine) => sum + fine.amount, 0);
  }, [payableFineItems]);

  // ── What the student has actually ticked ──────────────────────────────────
  const selectedFees = useMemo(
    () => payableFees.filter((fee) => selectedFeeIds.has(fee.id)),
    [payableFees, selectedFeeIds]
  );

  const selectedFineItems = useMemo(
    () => payableFineItems.filter((item) => selectedFineItemIds.has(item.refId)),
    [payableFineItems, selectedFineItemIds]
  );

  const feesPayableTotal = useMemo(
    () => selectedFees.reduce((sum, fee) => sum + fee.amount, 0),
    [selectedFees]
  );

  const finesPayableTotal = useMemo(
    () => selectedFineItems.reduce((sum, item) => sum + item.amount, 0),
    [selectedFineItems]
  );

  const fineById = useMemo(() => {
    return new Map(fines.map((fine) => [fine.id, fine]));
  }, [fines]);

  // Only the parent fines the chosen items actually belong to — the payment
  // step reads this list, so carrying unrelated fines through would attach the
  // wrong parent to the submission.
  const selectedParentFines = useMemo(() => {
    const parentIds = new Set(selectedFineItems.map((item) => item.parentFineId));
    return fines.filter((fine) => parentIds.has(fine.id));
  }, [fines, selectedFineItems]);

  const grandTotal = feesPayableTotal + finesPayableTotal;

  const handleContinue = async () => {
    if (isAdvancing) return;
    if (selectedFees.length === 0 && selectedFineItems.length === 0) return;

    // Awaited so the button reports progress rather than going dead if the
    // parent ever loads anything before advancing.
    setIsAdvancing(true);
    try {
      await onNext({
        fees: selectedFees,
        fines: selectedParentFines,
        fineItems: selectedFineItems,
        feeAmount: feesPayableTotal,
        fineAmount: finesPayableTotal,
        totalAmount: grandTotal,
      });
    } finally {
      setIsAdvancing(false);
    }
  };

  // A student the roster sync has retired is no longer enrolled, so their
  // records are history to review rather than dues to settle. Nothing here is
  // selectable, and `submit-payment` refuses them server-side regardless.
  const isViewOnly = studentData.isArchived === true;

  const hasSelection =
    !isViewOnly && (selectedFees.length > 0 || selectedFineItems.length > 0);
  const selectedCount = selectedFees.length + selectedFineItems.length;
  const hasPayableFees = !isViewOnly && payableFees.length > 0;
  const hasPayableFineItems = !isViewOnly && payableFineItems.length > 0;

  // ── Select-all helpers, kept so paying everything is still one click ───────
  const allFeesSelected = hasPayableFees && selectedFees.length === payableFees.length;
  const allFinesSelected =
    hasPayableFineItems && selectedFineItems.length === payableFineItems.length;

  const toggleAllFees = (checked: boolean) =>
    setSelectedFeeIds(checked ? new Set(payableFees.map((fee) => fee.id)) : new Set());

  const toggleAllFineItems = (checked: boolean) =>
    setSelectedFineItemIds(
      checked ? new Set(payableFineItems.map((item) => item.refId)) : new Set()
    );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-8 sm:pb-36 relative overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        <PaymentBrandHeader />
        <div className="mb-8 w-full mt-4">
          <PaymentProgressBar
            currentStep={currentStep}
            subtitle="Select the fees and fines you want to pay"
          />
        </div>
        <div className="w-full space-y-8">


          {/* Term, Student & Organization Info Banner Card */}
          <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
            <CardContent className="px-4 sm:px-6 py-5 space-y-4 relative z-10">
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

              {/* Student row */}
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

              <Separator className="bg-border/50" />

              {/* Organization row */}
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-green/5">
                  <Building2 className="h-6 w-6 text-brand-green" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-extrabold text-base leading-tight bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">{organizationData.acronym}</p>
                  <p className="text-xs text-muted-foreground truncate font-medium">{organizationData.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isViewOnly && (
            <Card className="border-warning bg-warning-muted">
              <CardContent className="px-4 sm:px-6 py-4">
                <p className="text-sm font-bold text-warning-foreground">
                  View only — you are no longer enrolled
                </p>
                <p className="text-xs text-warning-foreground font-medium mt-0.5">
                  These are your records and payment history for this term. They are shown
                  for reference and cannot be paid against. If you believe this is wrong,
                  contact your organization.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Fees Section */}
            <Card className="h-fit bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
              <CardHeader className="px-6 sm:px-8 pt-8 pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-brand-green" />
                    <CardTitle className="text-xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">Organization Fees</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-brand-green border-brand-green/30 rounded-full font-bold">
                    ₱{feesTotal.toFixed(2)}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground mt-1">All fees for your organization this semester</CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 pt-4 space-y-4 relative z-10">
                {/* Pay All Fees Toggle */}
                {fees.length > 0 && (
                  <>
                    <div
                      className={`flex flex-wrap items-center gap-x-3 gap-y-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${allFeesSelected
                        ? "bg-brand-green/10 border-brand-green shadow-sm"
                        : hasPayableFees
                          ? "bg-card border-border hover:bg-brand-green/5 cursor-pointer"
                          : "bg-muted/30 border-border opacity-70 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (!hasPayableFees) return;
                        toggleAllFees(!allFeesSelected);
                      }}
                    >
                      <Checkbox
                        id="pay-all-fees"
                        checked={allFeesSelected}
                        disabled={!hasPayableFees}
                        onCheckedChange={(checked) => {
                          if (!hasPayableFees) return;
                          toggleAllFees(checked === true);
                        }}
                        onClick={(e) => e.stopPropagation()}

                      />
                      <span className="text-sm font-bold leading-snug flex-1 min-w-0 text-foreground">
                        Select All Fees
                        {selectedFees.length > 0 && !allFeesSelected && (
                          <span className="ml-2 font-medium text-muted-foreground">
                            ({selectedFees.length} of {payableFees.length} selected)
                          </span>
                        )}
                      </span>
                      <span className="text-lg font-bold text-brand-green shrink-0 tabular-nums">
                        ₱{feesPayableTotal.toFixed(2)}
                      </span>
                    </div>
                    {!hasPayableFees && (
                      <p className="text-xs text-warning-foreground px-1 font-medium">
                        {fees.some(f => f.paymentState === "pending")
                          ? "All fee items are currently pending verification or verified and cannot be selected."
                          : "All fee items are already verified and cannot be selected."}
                      </p>
                    )}
                    <Separator className="bg-border/50" />
                    <p className="text-xs text-muted-foreground px-1 font-medium">Fee Breakdown:</p>
                  </>
                )}

                {/* Fee Items Breakdown */}
                <div className="space-y-3">
                  {fees.map((fee) => {
                    const isSelectable = !isViewOnly && fee.isPayable !== false;
                    const isSelected = selectedFeeIds.has(fee.id);
                    const status = getPaymentStatus(fee);

                    return (
                      <FeeItemCard
                        key={fee.id}
                        fee={fee}
                        isSelectable={isSelectable}
                        isSelected={isSelected}
                        onToggle={toggleFee}
                        statusLabel={status.label}
                        statusClassName={status.className}
                      />
                    );
                  })}
                </div>

                {fees.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50 text-brand-green" />
                    <p className="text-sm font-medium">No outstanding fees</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fines Section */}
            <Card className="h-fit bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
              <CardHeader className="px-6 sm:px-8 pt-8 pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <CardTitle className="text-xl font-extrabold text-destructive">Fines & Penalties</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-destructive rounded-full font-bold">
                    ₱{finesTotal.toFixed(2)}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground mt-1">Outstanding fines and penalty charges</CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8 pt-4 space-y-4">
                {/* Pay All Fines Toggle */}
                {(pendingFines.length > 0 || payableFines.length > 0) && (
                  <>
                    <div
                      className={`flex flex-wrap items-center gap-x-3 gap-y-2 p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${allFinesSelected
                        ? "bg-destructive/10 border-destructive shadow-sm"
                        : hasPayableFineItems
                          ? "bg-card border-border hover:bg-destructive/5 cursor-pointer"
                          : "bg-muted/30 border-border opacity-70 cursor-not-allowed"
                        }`}
                      onClick={() => {
                        if (!hasPayableFineItems) return;
                        toggleAllFineItems(!allFinesSelected);
                      }}
                    >
                      <Checkbox
                        id="pay-all-fines"
                        checked={allFinesSelected}
                        disabled={!hasPayableFineItems}
                        className="data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                        onCheckedChange={(checked) => {
                          if (!hasPayableFineItems) return;
                          toggleAllFineItems(checked === true);
                        }}
                        onClick={(e) => e.stopPropagation()}

                      />
                      <span className="text-sm font-bold leading-snug flex-1 min-w-0 text-foreground">
                        Select All Fines
                        {selectedFineItems.length > 0 && !allFinesSelected && (
                          <span className="ml-2 font-medium text-muted-foreground">
                            ({selectedFineItems.length} of {payableFineItems.length} selected)
                          </span>
                        )}
                      </span>
                      <span className="text-lg font-bold text-destructive shrink-0 tabular-nums">
                        ₱{finesPayableTotal.toFixed(2)}
                      </span>
                    </div>
                    {!hasPayableFineItems && (
                      <p className="text-xs text-warning-foreground px-1 font-medium">
                        {fineItems.some(f => f.isPending)
                          ? "All fine items are currently pending verification or verified and cannot be selected."
                          : "All fine items are already verified and cannot be selected."}
                      </p>
                    )}
                    <Separator className="bg-border/50" />
                    <p className="text-xs text-muted-foreground px-1 font-medium">Fines Breakdown:</p>
                  </>
                )}

                {/* Fine Items Breakdown */}
                <div className="space-y-3">
                  {fineItems.map((fine) => {
                    const parentFine = fineById.get(fine.parentFineId);
                    // The item's own state, computed server-side from its own
                    // flags. It used to read the PARENT's rejection, so one
                    // declined submission marked every unpaid item under that
                    // fine "Declined" — including items raised afterwards that
                    // were never submitted at all.
                    const status = getPaymentStatus({
                      isPayable: fine.isPayable ?? !fine.isPending,
                      paymentState: fine.paymentState ?? (fine.isPending ? "pending" : "unpaid"),
                      latestRejectionReason: fine.latestRejectionReason,
                    });

                    const isSelectable = !isViewOnly && (fine.isPayable ?? !fine.isPending) && !fine.isPaid;
                    const isSelected = selectedFineItemIds.has(fine.refId);

                    return (
                      <FineItemCard
                        key={fine.refId}
                        fine={fine}
                        parentFine={parentFine}
                        isSelectable={isSelectable}
                        isSelected={isSelected}
                        onToggle={toggleFineItem}
                        statusLabel={status.label}
                        statusClassName={status.className}
                      />
                    );
                  })}
                </div>

                {!hasPayableFineItems && pendingFines.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50 text-primary" />
                    <p className="text-sm font-medium">No outstanding fines</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Bar - Static on mobile, floating on desktop */}
        <div className="relative sm:fixed sm:inset-x-0 sm:bottom-0 sm:z-[60] sm:border-t sm:border-border mt-8 sm:mt-0 bg-transparent sm:bg-background/95 sm:backdrop-blur-md px-0 sm:px-6 py-0 sm:py-4 sm:pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:shadow-lg w-full">
          <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-4">
            <div className="min-w-0 text-center sm:text-left bg-white sm:bg-transparent rounded-2xl p-4 sm:p-0 border sm:border-none shadow-sm sm:shadow-none">
              {isViewOnly ? (
                <>
                  <p className="text-xs text-muted-foreground font-medium">
                    Outstanding on record for this term
                  </p>
                  <p className="text-2xl font-bold text-muted-foreground">
                    ₱{(feesTotal + finesTotal).toFixed(2)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground font-medium flex items-center justify-center sm:justify-start gap-1.5">
                    {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                    {isLoading
                      ? "Refreshing your dues…"
                      : selectedCount > 0
                        ? `Total for ${selectedCount} selected item${selectedCount === 1 ? "" : "s"}`
                        : "Select the items you want to pay"}
                  </p>
                  <p className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text tabular-nums">₱{grandTotal.toFixed(2)}</p>
                </>
              )}
            </div>
            {isViewOnly ? (
              <Button variant="outline" onClick={() => setShowBackConfirm(true)} className="w-full sm:w-auto shrink-0 px-6 sm:px-8">
                Back to Terms
              </Button>
            ) : (
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3 shrink-0 w-full sm:w-auto">
                <Button type="button" variant="outline" onClick={() => setShowBackConfirm(true)} className="w-full sm:w-auto">
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!hasSelection || isAdvancing || isLoading}
                  className="shrink-0 px-6 sm:px-8 gap-2 bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white"
                >
                  {isAdvancing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <BackConfirmationModal 
        open={showBackConfirm} 
        onOpenChange={setShowBackConfirm} 
        onConfirm={() => onBack?.()} 
      />
    </div>
  );
}
