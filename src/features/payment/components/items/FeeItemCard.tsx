import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FeeItem, FeeItemCardProps } from "../../types/types";

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

export function FeeItemCard({
  fee,
  isSelectable,
  isSelected,
  onToggle,
  statusLabel,
  statusClassName,
}: FeeItemCardProps) {
  return (
    <div
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onClick={() => isSelectable && onToggle(fee.id)}
      onKeyDown={(event) => {
        if (!isSelectable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle(fee.id);
        }
      }}
      className={`flex items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-colors ${!isSelectable
          ? "bg-muted/40 border-border/50"
          : isSelected
            ? "bg-brand-green/10 border-brand-green cursor-pointer"
            : "bg-card border-border hover:bg-brand-green/5 cursor-pointer"
        }`}
    >
      <Checkbox
        checked={isSelected}
        disabled={!isSelectable}
        aria-label={`Select ${fee.description}`}
        onCheckedChange={() => isSelectable && onToggle(fee.id)}
        onClick={(e) => e.stopPropagation()}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-foreground">{fee.description}</p>
          <Badge variant="outline" className={`rounded-full font-bold uppercase text-[11px] ${statusClassName}`}>
            {statusLabel}
          </Badge>
        </div>
        {formatDisplayDate(fee.dueDate) && (
          <p className="text-xs text-muted-foreground font-medium">Due: {formatDisplayDate(fee.dueDate)}</p>
        )}
        {fee.paymentState === "pending" && (
          <p className="text-xs text-warning-foreground font-medium">
            Status: Pending verification (not selectable)
          </p>
        )}
        {fee.latestRejectionReason && fee.paymentState === "rejected" && (
          <p className="text-xs text-destructive font-medium">
            Last rejected reason: {fee.latestRejectionReason}
          </p>
        )}
      </div>
      <span className="text-sm font-bold text-brand-green shrink-0 tabular-nums">
        ₱{fee.amount.toFixed(2)}
      </span>
    </div>
  );
}
