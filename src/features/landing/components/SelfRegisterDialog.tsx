"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSendRegistrationLink } from "@/features/self-register/hooks/useSendRegistrationLink";
import { SelfRegisterDialogProps } from "../types";

export function SelfRegisterDialog({ isOpen, onOpenChange }: SelfRegisterDialogProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { sendRegistrationLink, isSending, sendSuccess, reset } = useSendRegistrationLink();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setEmail("");
      setEmailError("");
      reset();
    }
    onOpenChange(open);
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    await sendRegistrationLink(email.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-8 overflow-hidden">
        {/* Top-left corner accent */}
        <div className="absolute top-0 left-0 w-20 h-3 rounded-br-full bg-linear-to-r from-brand-leaf to-brand-green" />
        <div className="absolute top-0 left-0 w-3 h-20 rounded-br-full bg-linear-to-r from-brand-leaf to-brand-green" />

        <DialogHeader className="items-center text-center relative z-10">
          {!sendSuccess ? (
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 mx-auto border border-brand-green/10">
              <Mail className="w-8 h-8 text-brand-green" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 mx-auto border border-brand-green/10">
              <CheckCircle className="w-8 h-8 text-brand-green" />
            </div>
          )}
          <DialogTitle className="text-2xl font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text w-full text-center">
            {!sendSuccess ? "Verify Your Email" : "Verification Link Sent"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm max-w-sm text-center text-brand-green">
            {!sendSuccess
              ? "Self-registered students are required to verify their email before registration. We will send a secure self-registration link to your inbox."
              : `We've sent a link to ${email}. Click the link in the email to proceed with your registration.`}
          </DialogDescription>
        </DialogHeader>

        {!sendSuccess ? (
          <form onSubmit={handleSendLink} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="your_address@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                disabled={isSending}
                className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-3">
              <Button
                type="submit"
                disabled={isSending}
                className="w-full bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending Link...
                  </>
                ) : (
                  "Send Verification Link"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSending}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 mt-6">
            <p className="text-xs text-center text-muted-foreground">
              If you didn't receive the email, please check your spam folder or try again in a few minutes.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="w-full bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
