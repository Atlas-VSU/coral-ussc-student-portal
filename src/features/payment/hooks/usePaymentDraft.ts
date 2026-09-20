"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormData } from "@/lib/validators";
import { ImageData, PaymentDraft, UsePaymentDraftProps } from "../types/types";

export function usePaymentDraft({
  studentId,
  orgId,
  form,
  image,
  selectedTypes,
  defaultAmount,
  defaultUserName,
  defaultStudentId,
}: UsePaymentDraftProps) {
  const [draftRestored, setDraftRestored] = useState(false);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<number | null>(null);

  const draftStorageKey = useMemo(() => {
    const studentKey = studentId ?? "anonymous";
    const organizationKey = orgId ?? "general";
    return `public-payment-draft:${studentKey}:${organizationKey}`;
  }, [orgId, studentId]);

  const clearDraft = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(draftStorageKey);
  };

  const persistDraft = (draft: PaymentDraft) => {
    if (typeof window === "undefined") return;

    try {
      window.sessionStorage.setItem(draftStorageKey, JSON.stringify(draft));
      setLastDraftSavedAt(Date.now());
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        try {
          const fallbackDraft: PaymentDraft = {
            ...draft,
            image: draft.image
              ? {
                name: draft.image.name,
                type: draft.image.type,
              }
              : null,
          };

          window.sessionStorage.setItem(draftStorageKey, JSON.stringify(fallbackDraft));
          setLastDraftSavedAt(Date.now());
          return;
        } catch {
          window.sessionStorage.removeItem(draftStorageKey);
        }
      }

      console.warn("Failed to persist payment draft:", error);
    }
  };

  // Restore draft on mount
  useEffect(() => {
    let cancelled = false;

    const restoreDraft = async () => {
      if (typeof window === "undefined") return;

      try {
        const rawDraft = window.sessionStorage.getItem(draftStorageKey);
        if (!rawDraft) {
          setDraftRestored(true);
          return;
        }

        setRestoredFromDraft(true);

        const draft = JSON.parse(rawDraft) as PaymentDraft;

        if (draft.form) {
          form.reset({
            ...form.getValues(),
            ...draft.form,
            userName: defaultUserName ?? draft.form.userName ?? form.getValues("userName"),
            studentId: defaultStudentId ?? draft.form.studentId ?? form.getValues("studentId"),
            amount: defaultAmount ?? draft.form.amount ?? form.getValues("amount"),
            type: selectedTypes.length === 1 ? selectedTypes[0] : draft.form.type,
          });
        }
      } catch (error) {
        console.error("Failed to restore payment draft:", error);
      } finally {
        if (!cancelled) {
          setDraftRestored(true);
        }
      }
    };

    void restoreDraft();

    return () => {
      cancelled = true;
    };
  }, [draftStorageKey, form, defaultAmount, selectedTypes, defaultUserName, defaultStudentId]);

  // Save draft on form changes
  useEffect(() => {
    if (!draftRestored || typeof window === "undefined") return;

    const subscription = form.watch((value) => {
      const draft: PaymentDraft = {
        form: {
          ...value,
          userName: value.userName ?? "",
          studentId: value.studentId ?? "",
          amount: value.amount ?? 0,
          paymentMethod: value.paymentMethod,
          referenceNumber: value.referenceNumber ?? "",
          senderNumber: value.senderNumber ?? "",
          notes: value.notes ?? "",
          type: value.type,
          paymentHistoryId: value.paymentHistoryId,
          referenceId: value.referenceId,
        },
        image: image
          ? {
            name: image.file.name,
            type: image.file.type,
          }
          : null,
      };

      persistDraft(draft);
    });

    return () => subscription.unsubscribe();
  }, [draftRestored, draftStorageKey, form, image]);

  // Save draft on image changes
  useEffect(() => {
    if (!draftRestored || typeof window === "undefined") return;

    const currentDraft = window.sessionStorage.getItem(draftStorageKey);
    const parsedDraft = currentDraft ? (JSON.parse(currentDraft) as PaymentDraft) : { form: {} };

    persistDraft({
      ...parsedDraft,
      image: image
        ? {
          name: image.file.name,
          type: image.file.type,
        }
        : null,
    });
  }, [draftRestored, draftStorageKey, image]);

  return {
    draftRestored,
    restoredFromDraft,
    lastDraftSavedAt,
    clearDraft,
  };
}
