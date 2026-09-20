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
                  onClick={() => {
                    void navigator.clipboard.writeText(bankAccountNumber);
                    toast.success("Copied to clipboard!");
                  }}
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
              <li>Add your Student ID in the remarks/notes (Optional)</li>
              <li>Confirm the transfer and <span className="font-bold text-foreground">save your reference number</span></li>
            </ol>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="w-full bg-brand-green/5 border border-brand-green/20 rounded-[1.5rem] p-4 shadow-soft">
          <p className="text-xs flex items-start gap-2.5 font-medium leading-relaxed">
            <span className="text-muted-foreground">
              <span className="font-bold text-brand-green">Important:</span>{' '}
              Save your bank transfer reference number. Take a screenshot of the confirmation and upload it below for faster verification.
            </span>
          </p>
        </div>

        <p className="font-bold text-brand-green mt-2 flex items-center justify-center gap-2 text-sm md:text-base text-center">
          <CheckCircle className="h-5 w-5" />
          Save your reference number for verification
        </p>
      </CardContent>
    </Card>
  );
}
