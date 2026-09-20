import { CalendarDays, Building2, CreditCard, Receipt, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TermData, OrganizationData, SelectedPaymentItems, FineItem, PaymentSummaryCardProps } from "../../types/types";

export function PaymentSummaryCard({
  selectedTerm,
  organizationData,
  selectedPaymentItems,
  selectedFineItems,
}: PaymentSummaryCardProps) {
  return (
    <Card className="mb-6 bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
      <CardHeader className="pb-3 relative z-10 pt-6">
        <CardTitle className="text-sm font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-brand-green" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {/* Term Row */}
        {selectedTerm && (
          <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                <CalendarDays className="h-5 w-5 text-brand-green" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {selectedTerm.semester} Semester · A.Y. {selectedTerm.AY}
                </p>
                <p className="text-xs text-muted-foreground truncate font-medium">Payment Term</p>
              </div>
            </div>
          </div>
        )}

        {/* Organization Row */}
        <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
              <Building2 className="h-5 w-5 text-brand-green" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-sm font-bold text-foreground leading-tight">{organizationData.acronym}</p>
              <p className="text-xs text-muted-foreground truncate font-medium">{organizationData.name}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Row */}
        <div className="space-y-3 rounded-xl border border-border/50 bg-white/50 p-4">
          {selectedPaymentItems.feeAmount > 0 && (
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-brand-green" />
                Fees ({selectedPaymentItems.fees.length} item{selectedPaymentItems.fees.length > 1 ? "s" : ""})
              </span>
              <span className="font-bold text-foreground">₱{selectedPaymentItems.feeAmount.toFixed(2)}</span>
            </div>
          )}
          {selectedPaymentItems.fineAmount > 0 && (
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-secondary" />
                Fines ({selectedFineItems.length} item{selectedFineItems.length > 1 ? "s" : ""})
              </span>
              <span className="font-bold text-foreground">₱{selectedPaymentItems.fineAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between font-bold text-base">
            <span>Total Due</span>
            <span className="text-brand-green text-lg">₱{selectedPaymentItems.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
