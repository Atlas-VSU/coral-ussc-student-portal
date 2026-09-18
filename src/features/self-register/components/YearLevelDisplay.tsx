import type { UseFormReturn } from "react-hook-form";
import {
  YEAR_LEVELS,
  type SelfRegisterFormData,
} from "../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface YearLevelSelectionProps {
  form: UseFormReturn<SelfRegisterFormData>;
}

/** Students select their year level. */
export function YearLevelSelection({ form }: YearLevelSelectionProps) {
  return (
    <FormField
      control={form.control}
      name="yearLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-primary font-semibold">
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
                  {level == 1 ? "1st Year" : level == 2 ? "2nd Year" : level == 3 ? "3rd Year" : level == 4 ? "4th Year" : level == 5 ? "5th Year" : "6th Year"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
