import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BackConfirmationModalProps } from "@/features/payment/types/types";


export function BackConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Are you sure you want to go back?",
  description = "You will lose all your progress if you go back to the previous step.",
  confirmText = "Yes, go back",
  cancelText = "Cancel",
}: BackConfirmationModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-linear-to-r from-brand-leaf to-brand-green text-white hover:brightness-105 bg-transparent hover:bg-transparent shadow-none"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
