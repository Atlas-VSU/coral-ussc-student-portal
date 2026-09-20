import { Badge } from "@/components/ui/badge";
import { Building2, ChevronRight } from "lucide-react";
import { OrganizationData, OrganizationCardProps } from "../../types/types";
import { useState } from "react";

const getStatusBadge = (status: "unpaid" | "pending" | "rejected" | "verified" | "cleared") => {
  switch (status) {
    case "pending":
      return {
        label: "Pending Review",
        className: "border-warning bg-warning-muted text-warning-foreground",
      };
    case "verified":
      return {
        label: "Approved",
        className: "border-success/40 bg-success-muted text-success",
      };
    case "rejected":
      return {
        label: "Declined",
        className: "border-destructive/20 bg-destructive/10 text-destructive",
      };
    case "unpaid":
      return {
        label: "Unpaid",
        className: "border-primary/20 bg-primary/10 text-primary",
      };
    case "cleared":
      return {
        label: "Cleared",
        className: "border-muted bg-muted text-muted-foreground",
      };
    default:
      return {
        label: "Unpaid",
        className: "border-primary/20 bg-primary/10 text-primary",
      };
  }
};

export function OrganizationCard({ org, isSelected, isPayable, onSelect }: OrganizationCardProps) {
  const [failedLogo, setFailedLogo] = useState(false);

  const summaryStates: Array<"unpaid" | "pending" | "rejected" | "verified" | "cleared"> =
    org.statusStates && org.statusStates.length > 0
      ? org.statusStates
      : org.outstandingAmount > 0 || (org.paymentSummary?.unpaid ?? 0) > 0
        ? ["unpaid"]
        : isPayable
          ? []
          : ["cleared"];

  return (
    <button
      onClick={() => onSelect(org.id)}
      disabled={!isPayable}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex items-start justify-between gap-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 cursor-pointer ${isPayable
          ? "hover:border-brand-green/50 hover:bg-brand-green/5"
          : "opacity-70 cursor-not-allowed"
        } ${isSelected && isPayable
          ? "border-brand-green bg-brand-green/5 shadow-sm"
          : "border-border bg-white"
        }`}
    >
      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
        {org.orgLogoUrl && !failedLogo ? (
          <div className="h-11 w-11 mt-1 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-white">
            <img
              src={org.orgLogoUrl}
              alt={`${org.acronym} logo`}
              loading="lazy"
              onError={() => setFailedLogo(true)}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-brand-green/10 mt-1 shrink-0">
            <Building2 className="h-5 w-5 text-brand-green" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-base text-foreground leading-tight">
              {org.name}
            </h3>
            <Badge variant="secondary" className="text-[11px] sm:text-xs shrink-0 rounded-full font-bold uppercase">
              {org.acronym}
            </Badge>
            {summaryStates.map((status) => {
              const badge = getStatusBadge(status);
              return (
                <Badge
                  key={status}
                  variant="outline"
                  className={`text-[11px] sm:text-xs shrink-0 rounded-full font-bold uppercase ${badge.className}`}
                >
                  {badge.label}
                </Badge>
              );
            })}
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground">
              Outstanding Balance:
            </span>
            <span
              className={`text-base font-bold ${org.outstandingAmount > 0
                  ? "text-destructive"
                  : "text-primary"
                }`}
            >
              ₱{org.outstandingAmount.toFixed(2)}
            </span>
          </div>
          {org.paymentSummary && (org.paymentSummary.pending > 0 || org.paymentSummary.verified > 0 || org.paymentSummary.rejected > 0) && (
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              {org.paymentSummary.pending > 0 && `${org.paymentSummary.pending} pending`}
              {org.paymentSummary.pending > 0 && org.paymentSummary.verified > 0 ? " · " : ""}
              {org.paymentSummary.verified > 0 && `${org.paymentSummary.verified} verified`}
              {(org.paymentSummary.pending > 0 || org.paymentSummary.verified > 0) && org.paymentSummary.rejected > 0 ? " · " : ""}
              {org.paymentSummary.rejected > 0 && `${org.paymentSummary.rejected} rejected`}
            </p>
          )}
          {!isPayable && (
            <p className="mt-2 text-xs text-muted-foreground font-medium">
              No payment needed for now. Current submissions are pending or already verified.
            </p>
          )}
        </div>
      </div>
      <ChevronRight
        className={`mt-2 hidden h-5 w-5 shrink-0 min-[400px]:block transition-transform duration-300 ${isSelected && isPayable ? "text-brand-green translate-x-0.5" : "text-muted-foreground"
          }`}
      />
    </button>
  );
}
