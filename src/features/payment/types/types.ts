export interface StudentData {
  studentId: string;
  program: string;
  name: string;
  programShortName?: string;
  programAcronym?: string;
  /** Retired by the roster sync. They can still reach and settle dues from the
   *  terms they were enrolled in — the term step says which those are. */
  isArchived?: boolean;
}

export interface TermData {
  AY: string;
  semester: string;
  /** Only the active term accepts new payments. Past terms are opened read-only
   *  so a student can still look at what they paid and what was cleared. */
  isActive?: boolean;
}

export interface OrganizationData {
  id: string;
  name: string;
  acronym: string;
  /** Uploaded by the org in the admin app. Null when they have not set one. */
  orgLogoUrl?: string | null;
  outstandingAmount: number;
  statusStates?: Array<"unpaid" | "pending" | "rejected" | "verified">;
  paymentSummary?: {
    pending: number;
    verified: number;
    rejected: number;
    unpaid: number;
  };

  orgTreasurerName?: string;
  orgTreasurerUrl?: string;
  orgTreasurerNumber?: string;
  orgAuditorName?: string;
  orgAuditorUrl?: string;
  orgAuditorNumber?: string;

  orgBankName?: string;
  orgBankAccountNumber?: string;
  orgBankAccountName?: string;
  orgBankQrUrl?: string;
}

export interface OrganizationDueData extends OrganizationData {
  feeAmount: number;
  fineAmount: number;
  paymentSummary?: {
    pending: number;
    verified: number;
    rejected: number;
    unpaid: number;
  };
  fees: FeeItem[];
  fines: Fine[];
  fineItems: FineItem[];
}

/** The states the dues API reports. "verified" was missing here even though the
 *  API has always returned it, so any narrowing on this union was unsound. */
export type PaymentState = "unpaid" | "pending" | "rejected" | "verified";

export interface FeeItem {
  id: string;
  description: string;
  title: string;
  amount: number;
  dueDate?: string;
  latestRejectionReason?: string;
  isPayable?: boolean;
  academicYear?: string;
  semester?: string;
  paymentState?: PaymentState;
}

export interface FineItem {
  refId: string;
  title: string;
  amount: number;
  parentFineId: string;
  isPaid: boolean;
  isPending: boolean;
  isWaived?: boolean;
  date: any; // Timestamp or string
  academicYear?: string;
  semester?: string;
  /** Derived per item from its own flags — never inherited from the parent fine. */
  paymentState?: PaymentState;
  isPayable?: boolean;
  /** Present only when THIS item was part of the declined submission. */
  latestRejectionReason?: string;
}

export interface Fine {
  id: string;
  description: string;
  amount: number;
  date?: string;
  reason: string;
  latestRejectionReason?: string;
  isPayable?: boolean;
  paymentState?: PaymentState;
}

export interface SelectedPaymentItems {
  fees: FeeItem[];
  fines: Fine[];
  fineItems: FineItem[];
  feeAmount: number;
  fineAmount: number;
  totalAmount: number;
}

export type OnlinePaymentMethod = "gcash" | "bank_transfer";
export type PaymentStep = "verification" | "term" | "organization" | "fees" | "payment";

import { UseFormRegisterReturn } from "react-hook-form";

export interface StudentInfoCardProps {
  userName: string;
  studentId: string;
  userNameRegister?: UseFormRegisterReturn;
  studentIdRegister?: UseFormRegisterReturn;
}

export interface PaymentSummaryCardProps {
  selectedTerm?: TermData | null;
  organizationData: OrganizationData;
  selectedPaymentItems: SelectedPaymentItems;
  selectedFineItems: FineItem[];
}

export interface OrganizationCardProps {
  org: OrganizationData;
  isSelected: boolean;
  isPayable: boolean;
  onSelect: (orgId: string) => void;
}

export interface BankInstructionsProps {
  bankQrUrl: string | null;
  bankAccountName: string;
  bankName: string;
  bankAccountNumber: string;
  mobileTotal: number;
}

export interface FeeItemCardProps {
  fee: FeeItem;
  isSelectable: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  statusLabel: string;
  statusClassName: string;
}

export interface GCashInstructionsProps {
  organizationData?: OrganizationData;
  treasurerName: string;
  treasurerNumber: string;
  auditorName: string;
  auditorNumber: string;
  mobileTotal: number;
}

export interface PaymentBrandHeaderProps {
  /** Short label shown below the brand name, e.g. "Student Verification" */
  stepLabel?: string;
}

import { LucideIcon } from "lucide-react";

export interface PaymentMethodOption {
  value: OnlinePaymentMethod;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface PaymentMethodSelectorProps {
  value: string;
  error?: string;
  onSelect: (value: OnlinePaymentMethod) => void;
  methods?: readonly PaymentMethodOption[];
}

export interface PaymentProgressBarProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  subtitle?: string;
}

export interface FinesFeesSelectionPageProps {
  studentData: StudentData;
  selectedTerm: TermData | null;
  organizationData: OrganizationData;
  currentStep: 1 | 2 | 3 | 4 | 5;
  fees: FeeItem[];
  fines: Fine[];
  fineItems: FineItem[];
  /** True while the parent is re-fetching dues — coming back to this step
   *  reloads them, and without this the stale amounts sit there unmarked. */
  isLoading?: boolean;
  onBack: () => void;
  onNext: (selectedItems: {
    fees: FeeItem[];
    fines: Fine[];
    fineItems: FineItem[];
    feeAmount: number;
    fineAmount: number;
    totalAmount: number;
  }) => void | Promise<void>;
}

export interface FinesPaymentFormPageProps {
  studentData?: StudentData;
  organizationData?: OrganizationData;
  selectedTerm?: TermData | null;
  selectedPaymentItems?: SelectedPaymentItems;
  currentStep: 1 | 2 | 3 | 4 | 5;
  onBack?: () => void;
  onRestart?: () => void;
}

export interface PublicSubmitResult {
  paymentHistoryId: string;
  submissionIds: string[];
}

export interface Term {
  id: string;
  AY: string;
  semester: string;
  displayName: string;
  isActive?: boolean;
  /** Whether this student holds any record for the term. Absent when the API
   *  was called without a studentId. */
  hasRecords?: boolean;
}

export interface TermsSelectionPageProps {
  studentData: StudentData;
  currentStep: 1 | 2 | 3 | 4 | 5;
  onBack: () => void;
  onNext: (selectedTerm: { AY: string; semester: string }) => void | Promise<void>;
}

export interface VerificationFormData {
  studentId: string;
  program: string;
}

export interface ProgramOption {
  value: string;
  label: string;
}

export interface StudentVerificationPageProps {
  onVerified: (data: StudentData) => void;
  currentStep: 1 | 2 | 3 | 4 | 5;
}

export interface SuccessScreenProps {
  form: any; // Using any or imported type PaymentFormData
  onReset: () => void;
  paymentHistoryId?: string;
  submissionCount?: number;
}

export interface ImageData {
  file: File;
  preview: string;
}

export interface ImageUploadProps {
  value: ImageData | null;
  onChange: (value: ImageData | null) => void;
  error?: string;
}

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentData: StudentData;
}

import { UseFormReturn } from "react-hook-form";

export interface SectionHeadingProps {
  number: number;
  title: string;
  optional?: boolean;
}

export type FormStatus = "success" | "submitting" | "idle" | "error";

export interface FloatingSubmitBarProps {
  keyboardOffset: number;
  status: FormStatus;
  isContextualFlow: boolean;
  feeCount: number;
  fineCount: number;
  mobileTotal: number;
  canSubmit: boolean;
}

export interface FieldErrorProps {
  message: string;
}

export interface UsePaymentFormOptions {
  initialValues?: any;
  onSubmitPayment?: (data: any, image: ImageData | null) => Promise<void>;
}

export interface PaymentDraft {
  form: any;
  image?: {
    name: string;
    type: string;
    preview?: string;
  } | null;
}

export interface UsePaymentDraftProps {
  studentId?: string;
  orgId?: string;
  form: UseFormReturn<any>;
  image: ImageData | null;
  selectedTypes: Array<"fees" | "fines">;
  defaultAmount: number;
  defaultUserName: string;
  defaultStudentId: string;
}

export interface OrganizationSelectionPageProps {
  studentData: StudentData;
  organizations: OrganizationData[];
  selectedTerm?: TermData | null;
  currentStep: 1 | 2 | 3 | 4 | 5;
  isLoading?: boolean;
  error?: string | null;
  onBack: () => void;
  onNext: (organizationId: string) => void | Promise<void>;
}

export interface FineItemCardProps {
  fine: FineItem;
  parentFine?: Fine;
  isSelectable: boolean;
  isSelected: boolean;
  onToggle: (id: string) => void;
  statusLabel: string;
  statusClassName: string;
}