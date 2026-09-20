import { Card, CardContent } from "@/components/ui/card";
import { UseFormRegisterReturn } from "react-hook-form";

import { StudentInfoCardProps } from "../../types/types";
export function StudentInfoCard({ userName, studentId, userNameRegister, studentIdRegister }: StudentInfoCardProps) {
  return (
    <Card className="bg-white text-foreground rounded-2xl drop-shadow-[4px_4px_0px_rgba(139,195,74,0.1)] border border-brand-green/20 p-0 overflow-hidden relative">
      <CardContent className="px-6 sm:px-8 py-6 flex flex-col gap-4 relative z-10">
        {userNameRegister && <input type="hidden" {...userNameRegister} />}
        {studentIdRegister && <input type="hidden" {...studentIdRegister} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white border border-brand-green/20 bg-brand-green/5 px-4 py-3">
            <p className="text-xs text-branding-green font-medium">Full Name</p>
            <p className="text-sm font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text break-words mt-0.5">{userName || "—"}</p>
          </div>
          <div className="rounded-xl bg-white border border-brand-green/20 bg-brand-green/5 px-4 py-3">
            <p className="text-xs text-branding-green font-medium">Student ID</p>
            <p className="text-sm font-extrabold bg-linear-to-r from-brand-leaf to-brand-green text-transparent bg-clip-text mt-0.5">{studentId || "—"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
