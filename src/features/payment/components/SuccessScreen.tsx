import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PaymentFormData } from "@/lib/validators";

import { SuccessScreenProps } from "../types/types";

export function SuccessScreen({
  form,
  onReset,
  paymentHistoryId,
  submissionCount = 0,
}: SuccessScreenProps) {
  const summary = [
    ["Student", form.userName],
    ["Student ID", form.studentId],
    ["Amount", `₱${parseFloat(String(form.amount)).toLocaleString()}`],
    ["Payment Method", form.paymentMethod.replace("_", " ")],
    ...(form.referenceNumber ? [["Reference No.", form.referenceNumber]] : []),
    ...(submissionCount > 0 ? [["Items Submitted", String(submissionCount)]] : []),
    ...(paymentHistoryId ? [["Request ID", paymentHistoryId]] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 relative overflow-hidden font-sans">
      <Card className="w-full max-w-md bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 relative z-10 p-0">
        <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-8 text-center relative z-10">

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">Payment Submitted</h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Payment for{" "}
              <span className="font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">{form.userName}</span>{" "}
              has been submitted and is pending review.
            </p>
          </div>

          <Separator className="bg-border/50" />

          <div className="w-full rounded-xl bg-white border border-brand-green/20 bg-brand-green/5 p-4 text-left space-y-2">
            {summary.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 py-1 text-sm font-medium">
                <span className="text-branding-green leading-snug">{k}</span>
                <span className="max-w-[11rem] text-right font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text capitalize break-words leading-snug">{v}</span>
              </div>
            ))}
          </div>

          <Button onClick={onReset} className="w-full bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105 border-0 text-white font-bold">
            Submit Another Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
