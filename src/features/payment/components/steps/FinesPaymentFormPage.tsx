"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, AlertCircle, Smartphone, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { SuccessScreen } from "../SuccessScreen";
import { PaymentFormData } from "@/lib/validators";
import { usePaymentForm } from "../../hooks/usePaymentForm";
import { usePaymentDraft } from "../../hooks/usePaymentDraft";
import { ImageUpload } from "../ImageUpload";
import { PaymentBrandHeader } from "../PaymentBrandHeader";
import { PaymentProgressBar } from "../PaymentProgressBar";
import { PaymentMethodSelector } from "../PaymentMethodSelector";
import { availableOnlinePaymentMethods, configuredPaymentDetail } from "../../utils/payment-methods";

// Newly extracted atomized components
import { PaymentSummaryCard } from "../cards/PaymentSummaryCard";
import { StudentInfoCard } from "../cards/StudentInfoCard";
import { GCashInstructions } from "../instructions/GCashInstructions";
import { BankInstructions } from "../instructions/BankInstructions";
import { SectionHeading } from "../form/SectionHeading";
import { FieldError } from "../form/FieldError";
import { FloatingSubmitBar } from "../form/FloatingSubmitBar";
import { BackConfirmationModal } from "../BackConfirmationModal";
import { StudentData, TermData, OrganizationData, SelectedPaymentItems, FinesPaymentFormPageProps, PublicSubmitResult, ImageData, PaymentMethodOption } from "../../types/types";

const fieldLabelClass = "text-brand-green font-semibold text-sm";
const fieldInputClass = "rounded-xl border-border bg-white/50 focus-visible:ring-brand-green/30";
const fieldHintClass = "text-xs text-muted-foreground font-medium leading-snug";

export default function FinesPaymentFormPage({
  studentData,
  selectedTerm,
  organizationData,
  selectedPaymentItems,
  currentStep,
  onBack,
  onRestart,
}: FinesPaymentFormPageProps) {
  const isContextualFlow = Boolean(studentData && organizationData && selectedPaymentItems);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<PublicSubmitResult | null>(null);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  const selectedFineItems = selectedPaymentItems?.fineItems.filter(f => !f.isPending) ?? [];

  const selectedTypes = useMemo(() => {
    if (!selectedPaymentItems) return [] as Array<"fees" | "fines">;
    return [
      ...(selectedPaymentItems.fees.length > 0 ? (["fees"] as const) : []),
      ...(selectedFineItems.length > 0 ? (["fines"] as const) : []),
    ];
  }, [selectedPaymentItems, selectedFineItems.length]);

  const handleContextualSubmit = async (data: PaymentFormData, image: ImageData | null) => {
    setSubmitError(null);
    setSubmitResult(null);
    setReceiptError(null);

    if (!image?.file) {
      const msg = "Receipt image is required before submitting payment.";
      setReceiptError(msg);
      setSubmitError(msg);
      throw new Error(msg);
    }

    let imageUrl = "";
    if (image?.file) {
      const fd = new FormData();
      fd.append("file", image.file);
      fd.append("studentId", studentData!.studentId);
      const uploadRes = await fetch("/api/upload-receipt", { method: "POST", body: fd });
      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok || !uploadResult.success) {
        const msg = uploadResult.error ?? "Failed to upload receipt image.";
        setSubmitError(msg);
        throw new Error(msg);
      }
      imageUrl = uploadResult.url as string;
    }

    const unpaidDues = [
      ...(selectedPaymentItems?.fees ?? []).map(fee => ({
        refId: fee.id,
        title: fee.description,
        amount: fee.amount,
        paymentType: "fees",
        parentFineId: "",
        academicYear: fee.academicYear || selectedTerm?.AY || "",
        semester: fee.semester || selectedTerm?.semester || "",
      })),
      ...(selectedFineItems.filter(f => !f.isPaid && !f.isPending) ?? []).map(fine => ({
        refId: fine.refId,
        title: fine.title,
        amount: fine.amount,
        paymentType: "fines",
        parentFineId: fine.parentFineId,
        academicYear: fine.academicYear || selectedTerm?.AY || "",
        semester: fine.semester || selectedTerm?.semester || "",
      })),
    ];

    if (unpaidDues.some((due) => !due.academicYear || !due.semester)) {
      const msg = "Could not determine the academic term for these dues. Go back and re-select the term.";
      setSubmitError(msg);
      throw new Error(msg);
    }

    let referenceId = "bulk_transaction";
    if (selectedPaymentItems?.fees.length === 1 && selectedFineItems.length === 0) {
      referenceId = selectedPaymentItems.fees[0].id;
    } else if (selectedFineItems.length === 1 && selectedPaymentItems?.fees.length === 0) {
      referenceId = selectedPaymentItems.fines[0].id;
    }

    const res = await fetch("/api/submit-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: data.userName,
        studentId: data.studentId,
        orgId: organizationData!.id,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        referenceNumber: data.referenceNumber,
        senderNumber: data.senderNumber,
        imageUrl,
        notes: data.notes,
        type: selectedTypes.length === 1 ? selectedTypes[0] : "bulk",
        referenceId,
        dues: unpaidDues,
      }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      const msg = result.error ?? "Payment submission failed. Please try again.";
      setSubmitError(msg);
      throw new Error(msg);
    }

    setSubmitResult({
      paymentHistoryId: result.paymentHistoryId,
      submissionIds: result.submissionIds || [],
    });
    // The draft clear is handled in usePaymentDraft directly if we return success,
    // or we can expose clearDraft and call it.
  };

  const {
    form,
    image, setImage,
    status,
    isGcash, isBank,
    handleMethodSelect,
    handleReset,
    onSubmit,
  } = usePaymentForm({
    initialValues: {
      userName: studentData?.name ?? "",
      studentId: studentData?.studentId ?? "",
      amount: selectedPaymentItems?.totalAmount ?? 0,
      type: selectedTypes.length === 1 ? selectedTypes[0] : undefined,
    },
    onSubmitPayment: isContextualFlow ? handleContextualSubmit : undefined,
  });

  const { register, formState: { errors }, watch } = form;

  const { restoredFromDraft, lastDraftSavedAt, draftRestored, clearDraft } = usePaymentDraft({
    studentId: studentData?.studentId,
    orgId: organizationData?.id,
    form,
    image,
    selectedTypes,
    defaultAmount: selectedPaymentItems?.totalAmount ?? 0,
    defaultUserName: studentData?.name ?? "",
    defaultStudentId: studentData?.studentId ?? "",
  });

  // On successful submit in the contextual flow, we clear draft
  useEffect(() => {
    if (submitResult) {
      clearDraft();
    }
  }, [submitResult, clearDraft]);

  const watchedAmount = Number(watch("amount") ?? 0);
  const mobileTotal = isContextualFlow
    ? Number(selectedPaymentItems?.totalAmount ?? 0)
    : (Number.isFinite(watchedAmount) ? watchedAmount : 0);
  const feeCount = selectedPaymentItems?.fees.length ?? 0;
  const fineCount = selectedFineItems.length ?? 0;

  const availablePaymentMethods = useMemo(() => {
    const methods: PaymentMethodOption[] = [];
    const available = availableOnlinePaymentMethods(organizationData);
    if (available.includes("gcash")) {
      methods.push({ value: "gcash", label: "GCash", description: "Mobile wallet", icon: Smartphone } as PaymentMethodOption);
    }
    if (available.includes("bank_transfer")) {
      methods.push({ value: "bank_transfer", label: "Bank", description: "Bank / InstaPay", icon: Landmark } as PaymentMethodOption);
    }
    return methods;
  }, [organizationData]);

  // Keep the selected method aligned with the current org configuration after restoring a draft.
  useEffect(() => {
    if (!draftRestored || availablePaymentMethods.length === 0) return;
    const current = form.getValues("paymentMethod");
    const isCurrentAvailable = availablePaymentMethods.some(m => m.value === current);
    if (!isCurrentAvailable) {
      form.setValue("paymentMethod", availablePaymentMethods[0].value, { shouldValidate: false });
      form.setValue("referenceNumber", "");
      form.setValue("senderNumber", "");
      form.clearErrors(["referenceNumber", "senderNumber"]);
    }
  }, [draftRestored, availablePaymentMethods, form]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.visualViewport) return;

    const updateKeyboardOffset = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;

      const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardOffset(offset > 120 ? offset : 0);
    };

    updateKeyboardOffset();
    window.visualViewport.addEventListener("resize", updateKeyboardOffset);
    window.visualViewport.addEventListener("scroll", updateKeyboardOffset);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboardOffset);
      window.visualViewport?.removeEventListener("scroll", updateKeyboardOffset);
    };
  }, []);

  const handleSuccessReset = () => {
    setSubmitError(null);
    setSubmitResult(null);
    clearDraft();
    handleReset();
    onRestart?.();
  };

  const selectedMethodAvailable = availablePaymentMethods.some(
    (method) => method.value === watch("paymentMethod")
  );

  if (status === "success") {
    return (
      <SuccessScreen
        form={form.getValues()}
        onReset={handleSuccessReset}
        paymentHistoryId={submitResult?.paymentHistoryId}
        submissionCount={submitResult?.submissionIds.length ?? 0}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pb-8 sm:pb-36 relative overflow-hidden font-sans">
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <PaymentBrandHeader />
        <div className="mb-8 w-full mt-4">
          <PaymentProgressBar currentStep={currentStep} subtitle="Review payment details and submit proof of payment" />
        </div>
        <div className="w-full">



          <div className="mb-4">
            {restoredFromDraft && (
              <p className="text-xs text-primary font-bold">Draft restored from your previous session.</p>
            )}
            {lastDraftSavedAt && (
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Draft saved at {new Date(lastDraftSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {isContextualFlow && studentData && organizationData && selectedPaymentItems && (
            <PaymentSummaryCard
              selectedTerm={selectedTerm}
              organizationData={organizationData}
              selectedPaymentItems={selectedPaymentItems}
              selectedFineItems={selectedFineItems}
            />
          )}

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            <div>
              <SectionHeading number={1} title="Student Info" />
              <StudentInfoCard
                userName={watch("userName")}
                studentId={watch("studentId")}
                userNameRegister={register("userName")}
                studentIdRegister={register("studentId")}
              />
            </div>

            <div className="flex flex-col">
              <SectionHeading number={2} title="Payment Details" />

              {availablePaymentMethods.length === 0 ? (
                <div className="mt-2 rounded-2xl border border-border/50 bg-amber-50 p-5 text-sm text-amber-800 font-medium">
                  <p className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    No payment methods are currently configured for this organization.
                    Please contact your organization directly to settle this payment.
                  </p>
                </div>
              ) : (
                <div className="mt-2">
                  <PaymentMethodSelector
                    value={watch("paymentMethod")}
                    onSelect={handleMethodSelect}
                    error={errors.paymentMethod?.message}
                    methods={availablePaymentMethods}
                  />
                </div>
              )}

              {selectedMethodAvailable && isGcash && organizationData && (
                <GCashInstructions
                  organizationData={organizationData}
                  treasurerName={organizationData.orgTreasurerName || ""}
                  treasurerNumber={configuredPaymentDetail(organizationData.orgTreasurerNumber)}
                  auditorName={organizationData.orgAuditorName || ""}
                  auditorNumber={configuredPaymentDetail(organizationData.orgAuditorNumber)}
                  mobileTotal={mobileTotal}
                />
              )}

              {selectedMethodAvailable && isBank && organizationData && (
                <BankInstructions
                  bankQrUrl={configuredPaymentDetail(organizationData.orgBankQrUrl)}
                  bankAccountName={configuredPaymentDetail(organizationData.orgBankAccountName)}
                  bankName={configuredPaymentDetail(organizationData.orgBankName)}
                  bankAccountNumber={configuredPaymentDetail(organizationData.orgBankAccountNumber)}
                  mobileTotal={mobileTotal}
                />
              )}

              {availablePaymentMethods.length > 0 && (
                <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative mt-4">
                  <CardContent className="px-6 sm:px-8 py-6 flex flex-col gap-4 relative z-10">
                    <input type="hidden" {...register("amount", { valueAsNumber: true })} />
                    <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-3">
                      <p className="text-xs text-branding-green font-medium">Amount</p>
                      <p className="text-base font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text mt-0.5">₱{(Number(watch("amount") ?? 0)).toFixed(2)}</p>
                    </div>
                    {errors.amount && <FieldError message={errors.amount.message!} />}

                    <Separator className="bg-border/50" />

                    <input type="hidden" {...register("paymentMethod")} />
                    {selectedMethodAvailable && isGcash && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mt-2">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="referenceNumber" className={fieldLabelClass}>GCash Reference Number <span className="text-brand-green">*</span></Label>
                          <Input id="referenceNumber" inputMode="numeric" placeholder="e.g. 1234567890123" {...register("referenceNumber")} className={fieldInputClass} />
                          <p className={fieldHintClass}>The 10 to 13-digit number on your GCash receipt.</p>
                          {errors.referenceNumber && <FieldError message={errors.referenceNumber.message!} />}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="senderNumber" className={fieldLabelClass}>Sender Mobile Number <span className="text-brand-green">*</span></Label>
                          <Input id="senderNumber" inputMode="tel" placeholder="e.g. 09123456789" {...register("senderNumber")} className={fieldInputClass} />
                          <p className={fieldHintClass}>The GCash number the money was sent from.</p>
                          {errors.senderNumber && <FieldError message={errors.senderNumber.message!} />}
                        </div>
                      </div>
                    )}
                    {selectedMethodAvailable && isBank && (
                      <div className="mt-2 flex flex-col gap-2">
                        <Label htmlFor="referenceNumber" className={fieldLabelClass}>Bank Reference Number <span className="text-brand-green">*</span></Label>
                        <Input id="referenceNumber" placeholder="e.g. UB676547" {...register("referenceNumber")} className={fieldInputClass} />
                        <p className={fieldHintClass}>
                          The number labelled just <span className="font-semibold text-foreground">&quot;Reference Number&quot;</span> on
                          your receipt. If yours also shows an{" "}
                          <span className="font-semibold text-foreground">InstaPay</span> or{" "}
                          <span className="font-semibold text-foreground">PESONet</span> reference, ignore it.
                        </p>
                        {errors.referenceNumber && <FieldError message={errors.referenceNumber.message!} />}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {availablePaymentMethods.length > 0 && (
              <div>
                <SectionHeading number={3} title="Upload Receipt" />
                <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
                  <CardContent className="px-6 sm:px-8 py-6 relative z-10">
                    <ImageUpload
                      value={image}
                      onChange={(nextImage) => {
                        setImage(nextImage);
                        if (nextImage?.file) {
                          setReceiptError(null);
                        }
                      }}
                    />
                    <p className="mt-3 text-xs text-muted-foreground font-medium">Receipt image is required.</p>
                    {receiptError && <FieldError message={receiptError} />}
                  </CardContent>
                </Card>
              </div>
            )}

            {availablePaymentMethods.length > 0 && (
              <div>
                <SectionHeading number={4} title="Notes" optional />
                <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
                  <CardContent className="px-6 sm:px-8 py-6 relative z-10">
                    <Textarea id="notes" placeholder="Any additional notes or remarks..." {...register("notes")} rows={3} className="rounded-2xl border-border bg-white/50 focus-visible:ring-brand-green/30 p-4" />
                  </CardContent>
                </Card>
              </div>
            )}

            {submitError && (
              <Alert variant="destructive" className="rounded-2xl border border-destructive/20 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs font-semibold">{submitError}</AlertDescription>
              </Alert>
            )}

            {availablePaymentMethods.length > 0 && (
              <FloatingSubmitBar
                keyboardOffset={keyboardOffset}
                status={status}
                isContextualFlow={isContextualFlow}
                feeCount={feeCount}
                fineCount={fineCount}
                mobileTotal={mobileTotal}
                canSubmit={!!image?.file && selectedMethodAvailable}
                onBack={() => setShowBackConfirm(true)}
              />
            )}

            {availablePaymentMethods.length === 0 && (
              <div className="flex flex-col-reverse min-[400px]:flex-row justify-end gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setShowBackConfirm(true)} className="w-full min-[400px]:w-auto">
                  Back
                </Button>
              </div>
            )}

          </form>
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