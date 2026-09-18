"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { RecaptchaSection } from "@/features/self-register/components/RecaptchaSection";
import { useUpdateProgramOptions } from "./hooks/useUpdateProgramOptions";
import {
  updateRecordSchema,
  UpdateRecordFormData,
  YEAR_LEVELS,
  formatYearLevel,
} from "./constants";

interface UpdateStudentRecordFormProps {
  token: string;
  studentId: string;
  email: string;
  initialValues: {
    firstName: string;
    lastName: string;
    programId: string;
    yearLevel: number;
  };
}

export function UpdateStudentRecordForm({
  token,
  studentId,
  email,
  initialValues,
}: UpdateStudentRecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const recaptchaConfigured = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY);
  const recaptchaVerified = recaptchaConfigured ? Boolean(recaptchaToken) : true;

  const { programOptions, isLoadingPrograms, programLoadError } = useUpdateProgramOptions();

  const form = useForm<UpdateRecordFormData>({
    resolver: zodResolver(updateRecordSchema),
    defaultValues: {
      firstName: initialValues.firstName,
      lastName: initialValues.lastName,
      programId: initialValues.programId,
      yearLevel: initialValues.yearLevel ?? 1,
    },
  });

  const onSubmit = async (data: UpdateRecordFormData) => {
    if (recaptchaConfigured && !recaptchaToken) {
      toast.error("Please complete the reCAPTCHA verification.");
      return;
    }
    if (!agreed) {
      toast.error("Please accept the consent before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          firstName: data.firstName,
          lastName: data.lastName,
          programId: data.programId,
          yearLevel: data.yearLevel,
          recaptchaToken: recaptchaToken ?? "",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Update failed.");
      }

      setSubmitted(true);
      toast.success("Your record has been updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border border-border/50 p-0">
          <CardContent className="px-6 py-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-primary">Record Updated!</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your student record has been successfully updated. If you have any
              questions, please contact your organization officer.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-8 sm:py-12">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <Image src="/images/ussc-logo-1.webp" alt="USSC Connect" width={56} height={56} className="size-14 mb-2 object-contain" />
        <h1 className="text-3xl font-extrabold text-foreground">
          Update Student Record
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Review and update your information below. Your student ID and email
          cannot be changed here.
        </p>
      </div>

      <Card className="w-full max-w-2xl bg-card border border-border/50 p-0">
        <CardContent className="px-6 py-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
            <div className="space-y-2">
              <Label className="text-primary font-semibold text-sm">
                Student ID
              </Label>
              <Input
                value={studentId}
                readOnly
                className="opacity-70 cursor-not-allowed bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-primary font-semibold text-sm">
                Email
              </Label>
              <Input
                value={email}
                readOnly
                className="opacity-70 cursor-not-allowed bg-muted"
              />
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold text-sm">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold text-sm">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold text-sm">
                        Program
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingPrograms}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full truncate">
                            <SelectValue
                              placeholder={
                                isLoadingPrograms
                                  ? "Loading programs…"
                                  : "Select a program"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programOptions.map((p) => (
                            <SelectItem
                              key={p.value}
                              value={p.value}
                            >
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {programLoadError && (
                        <p className="text-xs text-warning-foreground">{programLoadError}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold text-sm">
                        Year Level
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select your year level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {YEAR_LEVELS.map((level) => (
                            <SelectItem
                              key={level}
                              value={String(level)}
                            >
                              {formatYearLevel(level)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <RecaptchaSection
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken(null)}
              />

              <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="update-consent"
                    checked={agreed}
                    onCheckedChange={(checked) =>
                      setAgreed(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="update-consent"
                    className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I confirm that the information provided is accurate and
                    consent to the update of my student record.
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !agreed || !recaptchaVerified}
                className="w-full"
              >
                {isSubmitting ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
