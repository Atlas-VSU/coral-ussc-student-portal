"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentVerificationPage from "@/features/payment/components/steps/StudentVerificationPage";
import TermsSelectionPage from "@/features/payment/components/steps/TermsSelectionPage";
import OrganizationSelectionPage from "@/features/payment/components/steps/OrganizationSelectionPage";
import FinesFeesSelectionPage from "@/features/payment/components/steps/FinesFeesSelectionPage";
import FinesPaymentFormPage from "@/features/payment/components/steps/FinesPaymentFormPage";
import { StudentData, TermData, FeeItem, FineItem, Fine, SelectedPaymentItems, OrganizationDueData, PaymentStep } from "@/features/payment/types/types";

export default function PaymentClientPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PaymentStep>("verification");
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermData | null>(null);

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [organizationDues, setOrganizationDues] = useState<OrganizationDueData[]>([]);
  const [isLoadingDues, setIsLoadingDues] = useState(false);
  const [duesError, setDuesError] = useState<string | null>(null);
  const [selectedPaymentItems, setSelectedPaymentItems] = useState<SelectedPaymentItems | null>(null);

  const selectedOrganization = useMemo(() => {
    return organizationDues.find((org) => org.id === selectedOrgId) || null;
  }, [organizationDues, selectedOrgId]);

  const getOrganizationStatusStates = (org: OrganizationDueData) => {
    const states = new Set<"unpaid" | "pending" | "rejected" | "verified">();

    for (const fee of org.fees) {
      states.add(fee.paymentState ?? "unpaid");
    }

    for (const fine of org.fines) {
      if (org.fineItems.length > 0) {
        states.add(fine.paymentState ?? "unpaid");
      }
    }

    const orderedStates: Array<"pending" | "verified" | "rejected" | "unpaid"> = [
      "pending",
      "verified",
      "rejected",
      "unpaid",
    ];

    return orderedStates.filter((state) => states.has(state));
  };

  const loadStudentDues = async (studentId: string, AY: string, semester: string) => {
    setIsLoadingDues(true);
    setDuesError(null);

    try {
      const response = await fetch(
        `/api/student-dues?studentId=${encodeURIComponent(studentId)}&AY=${encodeURIComponent(AY)}&semester=${encodeURIComponent(semester)}`
      );
      const result = await response.json();

      if (!response.ok || !result.success || !Array.isArray(result.organizations)) {
        throw new Error(result.error || "Failed to fetch outstanding dues.");
      }

      setOrganizationDues(
        result.organizations.map((org: OrganizationDueData) => ({
          id: org.id,
          name: org.name,
          acronym: org.acronym,
          orgLogoUrl: org.orgLogoUrl ?? null,
          outstandingAmount: Number(org.outstandingAmount ?? 0),
          paymentSummary: org.paymentSummary ?? { pending: 0, verified: 0, rejected: 0, unpaid: 0 },
          feeAmount: Number(org.feeAmount ?? 0),
          fineAmount: Number(org.fineAmount ?? 0),
          fees: Array.isArray(org.fees) ? org.fees : [],
          fines: Array.isArray(org.fines) ? org.fines : [],
          fineItems: Array.isArray(org.fineItems) ? org.fineItems : [],
          orgTreasurerName: org.orgTreasurerName,
          orgTreasurerUrl: org.orgTreasurerUrl,
          orgTreasurerNumber: org.orgTreasurerNumber,
          orgAuditorName: org.orgAuditorName,
          orgAuditorUrl: org.orgAuditorUrl,
          orgAuditorNumber: org.orgAuditorNumber,
          orgBankName: org.orgBankName,
          orgBankAccountNumber: org.orgBankAccountNumber,
          orgBankAccountName: org.orgBankAccountName,
          orgBankQrUrl: org.orgBankQrUrl,
        }))
      );
    } catch (error) {
      setOrganizationDues([]);
      setDuesError(
        error instanceof Error
          ? error.message
          : "Unable to load outstanding dues right now."
      );
    } finally {
      setIsLoadingDues(false);
    }
  };

  const handleStudentVerified = async (data: StudentData) => {
    setStudentData(data);
    setSelectedTerm(null);
    setSelectedOrgId(null);
    setSelectedPaymentItems(null);
    setCurrentStep("term");
  };

  const handleTermSelected = async (term: { AY: string; semester: string }) => {
    setSelectedTerm(term);
    setSelectedOrgId(null);
    setSelectedPaymentItems(null);

    if (studentData) {
      await loadStudentDues(studentData.studentId, term.AY, term.semester);
    }
    setCurrentStep("organization");
  };

  const handleBackToVerification = () => {
    setSelectedTerm(null);
    setSelectedOrgId(null);
    setSelectedPaymentItems(null);
    setCurrentStep("verification");
  };

  const handleBackToTerm = () => {
    setSelectedOrgId(null);
    setSelectedPaymentItems(null);
    setCurrentStep("term");
  };

  const handleOrganizationSelected = (organizationId: string) => {
    setSelectedOrgId(organizationId);
    setSelectedPaymentItems(null);
    setCurrentStep("fees");
  };

  const handleBackToOrganization = async () => {
    setCurrentStep("organization");
    if (studentData && selectedTerm) {
      await loadStudentDues(studentData.studentId, selectedTerm.AY, selectedTerm.semester);
    }
  };

  const handleFeesSelected = (items: SelectedPaymentItems) => {
    setSelectedPaymentItems(items);
    setCurrentStep("payment");
  };

  const handleBackToFees = async () => {
    setCurrentStep("fees");
    if (studentData && selectedTerm) {
      await loadStudentDues(studentData.studentId, selectedTerm.AY, selectedTerm.semester);
    }
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-lg bg-background/60 backdrop-blur-md hover:bg-background/90 shadow-sm border-brand-green/20 text-brand-green"
          title="Go Back to Previous Page?"
        >
          <ChevronLeft className="h-5 w-5 text-brand-green" />
        </Button>
      </div>

      {currentStep === "verification" && (
        <StudentVerificationPage onVerified={handleStudentVerified} currentStep={1} />
      )}

      {currentStep === "term" && studentData && (
        <TermsSelectionPage
          currentStep={2}
          studentData={studentData}
          onBack={handleBackToVerification}
          onNext={handleTermSelected}
        />
      )}

      {currentStep === "organization" && studentData && (
        <OrganizationSelectionPage
          studentData={studentData}
          selectedTerm={selectedTerm}
          organizations={organizationDues.map((org) => ({
            id: org.id,
            name: org.name,
            acronym: org.acronym,
            orgLogoUrl: org.orgLogoUrl ?? null,
            outstandingAmount: org.outstandingAmount,
            statusStates: getOrganizationStatusStates(org),
            paymentSummary: org.paymentSummary,
          }))}
          currentStep={3}
          isLoading={isLoadingDues}
          error={duesError}
          onBack={handleBackToTerm}
          onNext={handleOrganizationSelected}
        />
      )}
      {currentStep === "fees" && studentData && selectedOrganization && (
        <FinesFeesSelectionPage
          studentData={studentData}
          selectedTerm={selectedTerm}
          organizationData={selectedOrganization}
          currentStep={4}
          fees={selectedOrganization.fees}
          fines={selectedOrganization.fines}
          fineItems={selectedOrganization.fineItems}
          isLoading={isLoadingDues}
          onBack={handleBackToOrganization}
          onNext={handleFeesSelected}
        />
      )}
      {currentStep === "payment" && studentData && selectedOrganization && selectedPaymentItems && (
        <FinesPaymentFormPage
          studentData={studentData}
          selectedTerm={selectedTerm}
          organizationData={selectedOrganization}
          selectedPaymentItems={selectedPaymentItems}
          currentStep={5}
          onBack={handleBackToFees}
          onRestart={handleBackToVerification}
        />
      )}
    </>
  );
}
