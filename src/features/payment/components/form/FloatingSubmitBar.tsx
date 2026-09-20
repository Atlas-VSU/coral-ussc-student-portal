import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { FormStatus, FloatingSubmitBarProps } from "../../types/types";

export function FloatingSubmitBar({
  keyboardOffset,
  status,
  isContextualFlow,
  feeCount,
  fineCount,
  mobileTotal,
  canSubmit,
  onBack,
}: FloatingSubmitBarProps) {
  return (
    <div
      className="relative sm:fixed sm:inset-x-0 sm:bottom-0 sm:z-[60] sm:border-t sm:border-border mt-8 sm:mt-0 bg-transparent sm:bg-[#FDFCF8]/95 sm:backdrop-blur-md px-0 sm:px-6 py-0 sm:py-4 sm:pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:shadow-float w-full"
      style={{ bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 0 }}
    >
      <div className="mx-auto max-w-2xl">
        {status === "submitting" ? (
          <div className="w-full rounded-md bg-linear-to-r from-brand-leaf to-brand-green opacity-60 text-white px-6 py-3 flex items-center justify-center gap-2 font-bold shadow-xs cursor-not-allowed">
            <Loader2 className="size-5 animate-spin" />
            Submitting payment…
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 text-center sm:text-left bg-white sm:bg-transparent rounded-2xl p-4 sm:p-0 border sm:border-none shadow-sm sm:shadow-none">
              <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
              {isContextualFlow && (
                <p className="text-[11px] text-muted-foreground font-medium">
                  Includes {feeCount} fees + {fineCount} fines
                </p>
              )}
              <p className="text-2xl font-bold text-brand-green">₱{mobileTotal.toFixed(2)}</p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
                  Back
                </Button>
              )}
              <Button
                type="submit"
                disabled={!canSubmit}
                className="px-8 bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white"
              >
                Submit Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
