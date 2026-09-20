import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FormStatus, FloatingSubmitBarProps } from "../../types/types";

export function FloatingSubmitBar({
  keyboardOffset,
  status,
  isContextualFlow,
  feeCount,
  fineCount,
  mobileTotal,
  canSubmit,
}: FloatingSubmitBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-[#FDFCF8]/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-float"
      style={{ bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 0 }}
    >
      <div className="mx-auto max-w-2xl">
        {status === "submitting" ? (
          <div className="w-full rounded-md bg-linear-to-r from-brand-leaf to-brand-green text-white px-6 py-3 flex items-center justify-center gap-2 font-bold shadow-xs">
            <Loader2 className="size-5 animate-spin" />
            Submitting payment…
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-medium">Total Amount</p>
              {isContextualFlow && (
                <p className="text-[11px] text-muted-foreground font-medium">
                  Includes {feeCount} fees + {fineCount} fines
                </p>
              )}
              <p className="text-2xl font-bold text-brand-green">₱{mobileTotal.toFixed(2)}</p>
            </div>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="px-8 bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white"
            >
              Submit Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
