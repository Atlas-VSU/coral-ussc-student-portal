import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ProgramOption,
  type SelfRegisterFormData,
} from "../constants";

interface ProgramSelectFieldProps {
  form: UseFormReturn<SelfRegisterFormData>;
  programOptions: ProgramOption[];
  isLoadingPrograms: boolean;
  programLoadError: string | null;
}

/** Program dropdown with loading / error states. */
export function ProgramSelectField({
  form,
  programOptions,
  isLoadingPrograms,
  programLoadError,
}: ProgramSelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name="programId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary font-semibold">
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
              {programOptions.map((program) => (
                <SelectItem
                  key={program.value}
                  value={program.value}
                >
                  {program.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {programLoadError && (
            <p className="text-xs text-warning-foreground">
              {programLoadError}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
