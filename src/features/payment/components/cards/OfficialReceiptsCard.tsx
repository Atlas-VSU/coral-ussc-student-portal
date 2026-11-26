"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { formatPaymentMethodLabel, formatShortReceiptDate } from "../../utils/receipt-print";
import { StudentReceiptData } from "../../types/types";

interface OfficialReceiptsCardProps {
  receipts: StudentReceiptData[];
  onViewReceipt: (receipt: StudentReceiptData) => void;
}

export function OfficialReceiptsCard({
  receipts,
  onViewReceipt,
}: OfficialReceiptsCardProps) {
  if (receipts.length === 0) return null;

  return (
    <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/30 p-0 overflow-hidden relative">
      <CardHeader className="px-6 sm:px-8 pt-7 pb-2 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-green" />
            <CardTitle className="text-xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
              Official Payment Receipts
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-brand-green border-brand-green/30 bg-brand-green/5 rounded-full font-bold"
          >
            {receipts.length} {receipts.length === 1 ? "Receipt" : "Receipts"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Verified payment transactions for this term — bulk payments covering multiple items share a single receipt
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-7 pt-3 space-y-3 relative z-10">
        {receipts.map((receipt) => {
          const shortDate = formatShortReceiptDate(receipt.date);
          return (
            <div
              key={receipt.receiptId}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-brand-green/25 bg-brand-green/5"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-foreground">
                    Receipt #{receipt.receiptId}
                  </span>
                  <Badge
                    variant="outline"
                    className="rounded-full text-[11px] font-bold uppercase border-brand-green/30 bg-white text-brand-green"
                  >
                    {formatPaymentMethodLabel(receipt.paymentMethod)}
                  </Badge>
                  {shortDate && (
                    <span className="text-xs text-muted-foreground font-medium">
                      · {shortDate}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/85 font-medium truncate">
                  Covers ({receipt.items.length}{" "}
                  {receipt.items.length === 1 ? "item" : "items"}):{" "}
                  {receipt.items.map((i) => i.name).join(", ")}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium">
                  Verified by {receipt.verifiedByName}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <span className="text-base font-bold text-brand-green tabular-nums">
                  ₱{receipt.total.toFixed(2)}
                </span>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => onViewReceipt(receipt)}
                  className="gap-1.5 bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white"
                >
                  <Receipt className="h-3.5 w-3.5" />
                  View Receipt
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
