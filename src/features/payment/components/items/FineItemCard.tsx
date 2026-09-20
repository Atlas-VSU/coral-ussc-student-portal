import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FineItem, Fine, FineItemCardProps } from "../../types/types";

const formatDisplayDate = (value?: unknown) => {
  if (!value) return null;

  if (
    typeof value === "object" &&
    value !== null &&
    "_seconds" in value &&
    typeof (value as { _seconds?: unknown })._seconds === "number"
  ) {
    const seconds = (value as { _seconds: number })._seconds;
    return new Date(seconds * 1000).toLocaleDateString();
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toLocaleDateString();
  }

  if (typeof value !== "string") return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

export function FineItemCard({
  fine,
  parentFine,
  isSelectable,
  isSelected,
  onToggle,
  statusLabel,
  statusClassName,
}: FineItemCardProps) {
  return (
    <div
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={() => isSelectable && onToggle(fine.refId)}
      onKeyDown={(event) => {
        if (!isSelectable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle(fine.refId);
        }
      }}
      className={`flex items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors ${!isSelectable
          ? "bg-muted/40 border-border/50"
          : isSelected
            ? "bg-destructive/10 border-destructive cursor-pointer"
            : "bg-card border-border hover:bg-destructive/5 cursor-pointer"
        }`}
    >
      <Checkbox
        checked={isSelected}
        disabled={!isSelectable}
        aria-label={`Select ${fine.title}`}
        onCheckedChange={() => isSelectable && onToggle(fine.refId)}
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-foreground">{fine.title}</p>
          <Badge variant="outline" className={`rounded-full font-bold uppercase text-[11px] ${statusClassName}`}>
            {statusLabel}
          </Badge>
        </div>
        {formatDisplayDate(fine.date) && (
          <p className="text-xs text-muted-foreground font-medium">Date: {formatDisplayDate(fine.date)}</p>
        )}
        {parentFine?.reason && (
          <p className="text-xs text-muted-foreground italic font-medium">{parentFine.reason}</p>
        )}
        {fine.isPending && (
          <p className="text-xs text-warning-foreground font-medium">
            Status: Pending verification (not selectable)
          </p>
        )}
        {fine.isPaid && !fine.isPending && (
          <p className="text-xs text-success font-medium">
            {fine.isWaived ? "Waived by the organization" : "Settled"}
          </p>
        )}
        {fine.latestRejectionReason && !fine.isPending && (
          <p className="text-xs text-destructive font-medium">
            Last rejected reason: {fine.latestRejectionReason}
          </p>
        )}
      </div>
      <span className="text-sm font-bold text-destructive shrink-0 tabular-nums">
        ₱{fine.amount.toFixed(2)}
      </span>
    </div>
  );
}
