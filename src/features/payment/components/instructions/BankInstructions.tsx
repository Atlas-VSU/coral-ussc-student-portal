import { Landmark, Building2, User, Receipt, Copy, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

import { BankInstructionsProps } from "../../types/types";

export function BankInstructions({
  bankQrUrl,
  bankAccountName,
  bankName,
  bankAccountNumber,
  mobileTotal,
}: BankInstructionsProps) {
  const copy = (value: string, label: string) => {
    void navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <Card className="mt-4 border border-brand-green/20 bg-brand-green/5 shadow-soft">
      <CardContent className="pt-6 flex flex-col items-center gap-6">
        <p className="text-xs text-muted-foreground self-start flex items-center gap-1.5 font-medium">
          <Landmark className="h-4 w-4 text-brand-green" />
          Pay via bank transfer using InstaPay or PESONet
        </p>

        {/* QR Code Section */}
        {bankQrUrl && (
          <div className="border border-border/50 bg-white p-3 rounded-2xl shadow-soft">
            <img
              src={bankQrUrl}
              alt={`${bankAccountName} Bank QR Ph Code`}
              className="max-h-72 w-auto object-contain rounded-xl"
            />
          </div>
        )}

        {/* Bank Account Details */}
        <div className="w-full bg-white/90 rounded-2xl p-5 border border-border shadow-soft">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-brand-green" />
            Bank Account Details
          </h4>
          <div className="space-y-3">
            <div className="flex flex-col gap-1 p-3 bg-brand-green/5 border border-brand-green/10 rounded-xl min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-green" />
                <span className="text-xs md:text-sm text-muted-foreground font-medium">Bank:</span>
              </div>
              <span className="font-bold text-sm md:text-base text-foreground">{bankName}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-brand-green/5 border border-brand-green/10 rounded-xl min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand-green" />
                <span className="text-xs md:text-sm text-muted-foreground font-medium">Account Name:</span>
              </div>
              <span className="font-bold text-sm md:text-base break-words text-left min-[430px]:text-right text-foreground">{bankAccountName}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-brand-green/5 border border-brand-green/10 rounded-xl min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-brand-green" />
                <span className="text-xs md:text-sm text-muted-foreground font-medium">Account Number:</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2 min-[430px]:w-auto min-[430px]:justify-end">
                <span className="font-bold text-sm md:text-base text-foreground">{bankAccountNumber}</span>
                <button
                  type="button"
                  onClick={() => copy(bankAccountNumber, "Account number")}
                  className="p-1.5 hover:bg-brand-green/10 rounded-full transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-brand-green" />
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Payment Steps */}
        <div className="w-full space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-brand-green" />
            How to pay via Bank Transfer:
          </h4>
          <div className="space-y-2 bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Via InstaPay / PESONet</p>
            <ol className="space-y-1.5 pl-5 list-decimal text-xs text-muted-foreground font-medium">
              <li>Open your bank&apos;s app (BDO, BPI, UnionBank, etc.)</li>
              <li>Go to <span className="font-bold text-foreground">Transfer → InstaPay</span> or <span className="font-bold text-foreground">PESONet</span></li>
              <li>Enter the account number: <span className="font-bold text-foreground">{bankAccountNumber}</span></li>
              <li>Verify the account name: <span className="font-bold text-foreground">{bankAccountName}</span></li>
              <li>Enter the amount: <span className="font-bold text-foreground">₱{mobileTotal}</span></li>
              <li>Type your <span className="font-bold text-foreground">Student ID (Optional)</span> in the Remarks or Notes field</li>
              <li>Confirm the transfer and screenshot the receipt</li>
            </ol>
          </div>
        </div>

        <div className="w-full space-y-3 bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Add your Student ID to the remarks</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Your bank&apos;s transfer form has a field called{" "}
            <span className="font-bold text-foreground">Remarks</span>,{" "}
            <span className="font-bold text-foreground">Notes</span>,{" "}
            <span className="font-bold text-foreground">Message</span> or{" "}
            <span className="font-bold text-foreground">Purpose</span>. Type your Student ID there and nothing
            else, so the treasurer can match the transfer to your record.
          </p>

          <div className="rounded-xl border border-border bg-brand-green/5 p-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-brand-green px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                Type
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                <span className="font-mono font-bold">21-1-12345</span>{" "}
                <span className="text-muted-foreground">— your Student ID, exactly as you entered it above</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Some banks do not show a remarks field for InstaPay transfers. If yours does not, continue without
            it — your reference number and receipt are enough.
          </p>
        </div>

        {/* Receipts vary: most print one reference, some print two, and a few
            show only the InstaPay trace. The rule has to stay conditional —
            telling a student to skip the InstaPay number when it is the only
            one on their receipt leaves them with nothing to enter. */}
        <div className="w-full space-y-3 bg-card border border-border rounded-xl p-4 shadow-sm">
          <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Which reference number to enter</p>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            Enter the one labelled <span className="font-bold text-foreground">Reference Number</span>. 
          </p>

          <div className="rounded-xl border border-border bg-brand-green/5 p-3 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-brand-green px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-white">
                Enter
              </span>
              <p className="text-xs font-medium text-foreground leading-relaxed">
                Reference Number: <span className="font-mono font-bold">UB676547</span>
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
                Skip
              </span>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                InstaPay Reference Number: <span className="font-mono font-bold">814986</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
            If your receipt shows only an InstaPay or PESONet reference, enter that one instead.
          </p>
        </div>

        {/* <div className="w-full bg-white/90 border border-border rounded-2xl p-4 shadow-soft">
          <p className="text-xs flex items-start gap-2.5 font-medium leading-relaxed text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-brand-green mt-0.5" />
            <span>
              <span className="font-bold text-foreground">Verification time:</span>{" "}
              InstaPay transfers arrive within minutes. PESONet might settle on the next banking day. Your payment
              stays <span className="font-bold text-foreground">pending</span> until the treasurer confirms it
              on the account.
            </span>
          </p>
        </div> */}

        {/* Important Reminder */}
        <div className="w-full bg-brand-green/5 border border-brand-green/20 rounded-[1.5rem] p-4 shadow-soft">
          <p className="text-xs flex items-start gap-2.5 font-medium leading-relaxed">
            <span className="text-muted-foreground">
              <span className="font-bold text-brand-green">Important:</span>{' '}
              Upload a screenshot of the transaction confirmation or receipt details.
            </span>
          </p>
        </div>

        <p className="font-bold text-brand-green mt-2 flex items-center justify-center gap-2 text-sm md:text-base text-center">
          <CheckCircle className="h-5 w-5" />
          Keep your receipt until the payment is verified
        </p>
      </CardContent>
    </Card>
  );
}
