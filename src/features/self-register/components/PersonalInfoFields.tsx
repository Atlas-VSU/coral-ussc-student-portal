import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type SelfRegisterFormData } from "../constants";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<SelfRegisterFormData>;
  emailReadOnly?: boolean;
}

/** Student ID, email, first name, and last name fields. */
export function PersonalInfoFields({ form, emailReadOnly }: PersonalInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary font-semibold">
              Student ID
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="xx-x-xxxxx"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary font-semibold">
              Email
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="your_address@gmail.com"
                readOnly={emailReadOnly}
                className={emailReadOnly ? "bg-muted cursor-not-allowed opacity-80" : undefined}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary font-semibold">
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
            <FormLabel className="text-primary font-semibold">
              Last Name
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
