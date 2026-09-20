import { useState } from "react";
import { CreditCard, Phone, User, Copy, CheckCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { OrganizationData, GCashInstructionsProps } from "../../types/types";

export function GCashInstructions({
  organizationData,
  treasurerName,
  treasurerNumber,
  auditorName,
  auditorNumber,
  mobileTotal,
}: GCashInstructionsProps) {
  const [showAuditorQr, setShowAuditorQr] = useState(false);

  return (
    <Card className="mt-4 border border-secondary/20 bg-secondary/5 shadow-soft">
      <CardContent className="pt-6 flex flex-col items-center gap-6">
        <p className="text-xs text-muted-foreground self-start flex items-center gap-1.5 font-medium">
          <CreditCard className="h-4 w-4 text-secondary" />
          Pay via GCash using either QR code or manual send money
        </p>

        {/* QR Code Section */}
        <div className="border border-border/50 bg-white p-3 rounded-2xl shadow-soft">
          <img
            src={organizationData?.orgTreasurerUrl || "/images/public-student-payment/404-QRNOTFOUND.png"}
            alt={`${treasurerName} GCash Payment QR Code`}
            className="max-h-72 w-auto object-contain rounded-xl"
          />
        </div>

        {/* GCash Account Details */}
        <div className="w-full bg-white/90 rounded-2xl p-5 border border-border shadow-soft">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4 text-secondary" />
            Treasurer GCash Details
          </h4>
          <div className="space-y-4">
            <div className="flex flex-col gap-1 p-3 bg-secondary/5 border border-secondary/10 rounded-xl min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                <span className="text-xs md:text-sm text-muted-foreground font-medium">Treasurer Name:</span>
              </div>
              <span className="font-bold text-sm md:text-base break-words text-left min-[430px]:text-right text-foreground">{treasurerName}</span>
            </div>
            <div className="flex flex-col gap-1 p-3 bg-secondary/5 border border-secondary/10 rounded-xl min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span className="text-xs md:text-sm text-muted-foreground font-medium">GCash Number:</span>
              </div>
              <div className="flex w-full items-center justify-between gap-2 min-[430px]:w-auto min-[430px]:justify-end">
                <span className="font-bold text-sm md:text-base text-foreground">{treasurerNumber}</span>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(treasurerNumber);
                    toast.success("Copied to clipboard!");
                  }}
                  className="p-1.5 hover:bg-secondary/10 rounded-full transition-colors cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-secondary" />
                </button>
              </div>
            </div>
            <Dialog open={showAuditorQr} onOpenChange={setShowAuditorQr}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto w-full whitespace-normal py-3 text-xs leading-snug border-secondary/30 text-secondary hover:bg-secondary/10 sm:text-sm"
                >
                  Use alternative payment account (Auditor)
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100%-1.5rem)] max-w-md bg-card text-foreground border border-border/50 rounded-[2rem] p-8 shadow-float overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold font-serif">Alternative GCash Account</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground font-medium">
                    Use the auditor account only if the treasurer account is unavailable.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="relative mx-auto max-h-56 w-auto rounded-2xl border border-border bg-white p-3 overflow-hidden shadow-soft flex items-center justify-center">
                    <img
                      src={organizationData?.orgAuditorUrl || "/images/public-student-payment/404-QRNOTFOUND.png"}
                      alt={`${auditorName} GCash Payment QR Code`}
                      className="max-h-48 w-auto object-contain rounded-lg"
                    />
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/5 p-4 space-y-3 shadow-soft">
                    <div className="flex flex-col gap-1 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between min-[430px]:gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Auditor Name:</span>
                      <span className="text-sm font-bold text-foreground break-words text-left min-[430px]:text-right">{auditorName}</span>
                    </div>
                    <div className="flex flex-col gap-1 min-[430px]:flex-row min-[430px]:items-center min-[430px]:justify-between min-[430px]:gap-2">
                      <span className="text-xs text-muted-foreground font-medium">GCash Number:</span>
                      <div className="flex w-full items-center justify-between gap-2 min-[430px]:w-auto min-[430px]:justify-end">
                        <span className="text-sm font-bold text-foreground">{auditorNumber}</span>
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(auditorNumber);
                            toast.success("Copied to clipboard!");
                          }}
                          className="rounded-full p-1.5 transition-colors hover:bg-secondary/10 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5 text-secondary" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payment Steps */}
        <div className="w-full space-y-4">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-brand-green" />
            How to pay via GCash:
          </h4>

          {/* Option 1: QR Code */}
          <div className="space-y-2 bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Option 1: Scan QR Code</p>
            <ol className="space-y-1.5 pl-5 list-decimal text-xs text-muted-foreground font-medium">
              <li>Open GCash app and tap &quot;Scan QR&quot;</li>
              <li>Scan the QR code above</li>
              <li>Verify the account name: <span className="font-bold text-foreground">{treasurerName}</span></li>
              <li>Enter the amount: <span className="font-bold text-foreground">₱{mobileTotal}</span></li>
              <li>Add your Student ID as a note (Optional)</li>
              <li>Complete payment and save reference number</li>
            </ol>
          </div>

          {/* Option 2: Send Money */}
          <div className="space-y-2 bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold text-brand-green uppercase tracking-wider">Option 2: Send Money</p>
            <ol className="space-y-1.5 pl-5 list-decimal text-xs text-muted-foreground font-medium">
              <li>Open GCash app and tap &quot;Send Money&quot;</li>
              <li>Enter GCash number: <span className="font-bold text-foreground">{treasurerNumber}</span></li>
              <li>Verify account name: <span className="font-bold text-foreground">{treasurerName}</span></li>
              <li>Enter amount: <span className="font-bold text-foreground">₱{mobileTotal}</span></li>
              <li>Add your Student ID in the message/notes (Optional)</li>
              <li>Review and confirm payment</li>
              <li>Save the reference number shown after payment</li>
            </ol>
          </div>
        </div>

        {/* Important Reminder */}
        <div className="w-full bg-secondary/5 border border-secondary/20 rounded-[1.5rem] p-4 shadow-soft">
          <p className="text-xs flex items-start gap-2.5 font-medium leading-relaxed">
            <span className="text-muted-foreground">
              <span className="font-bold text-secondary">Important:</span>{' '}
              Save your GCash reference number. Take a screenshot of the confirmation page and send it to our support for faster verification.
            </span>
          </p>
        </div>

        {/* Reference Number Reminder */}
        <p className="font-bold text-brand-green mt-2 flex items-center justify-center gap-2 text-sm md:text-base text-center">
          <CheckCircle className="h-5 w-5" />
          Save your reference number for verification
        </p>
      </CardContent>
    </Card>
  );
}
