import { LucideIcon } from "lucide-react";

export interface LandingActionProps {
  onSelfRegisterClick: () => void;
  onUpdateInfoClick: () => void;
  onMakePaymentClick: () => void;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  iconColorClass?: string;
  titleClass?: string;
  actionText?: string;
}

export interface LandingHeaderProps extends LandingActionProps {}
export interface LandingFeatureCardsProps extends LandingActionProps {}

export interface LandingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface SelfRegisterDialogProps extends LandingDialogProps {}
export interface UpdateInformationDialogProps extends LandingDialogProps {}

export interface ProgramOption {
  value: string;
  label: string;
}

export type UpdateInfoStep = "verify" | "email" | "sent";
