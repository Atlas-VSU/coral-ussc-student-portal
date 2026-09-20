"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, GraduationCap, IdCard } from "lucide-react";

import { StudentData, ConfirmationModalProps } from "../types/types";

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  studentData,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle className="text-center font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">Confirm Your Information</DialogTitle>
          <DialogDescription className="text-center">
            Please verify that the following details are correct
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Full Name */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-brand-green/90" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
              <p className="text-sm font-bold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
                {studentData.name}
              </p>
            </div>
          </div>

          {/* Student ID */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <IdCard className="w-5 h-5 text-brand-green/90" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Student ID</p>
              <p className="text-sm font-bold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text font-mono">
                {studentData.studentId}
              </p>
            </div>
          </div>

          {/* Program */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-brand-green/90" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Program</p>
              <p className="text-sm font-bold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text">
                {studentData.programAcronym || studentData.programShortName || studentData.program}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            onClick={onConfirm}
            className="w-full sm:w-auto font-semibold bg-linear-to-r from-brand-leaf to-brand-green hover:brightness-105"
          >
            Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
