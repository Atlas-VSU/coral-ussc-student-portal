import { ArrowRight } from "lucide-react";
import { FeatureCardProps } from "../types";

export function FeatureCard({
  title,
  description,
  icon: Icon,
  onClick,
  className = "",
  iconColorClass = "text-brand-leaf",
  titleClass,
  actionText,
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-2xl drop-shadow-[2px_2px_0px_rgba(139,195,74,0.1)] border border-brand-green/10 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:drop-shadow-[6px_6px_0px_rgba(139,195,74,0.12)] hover:border-brand-green/15 flex items-center min-h-[130px] group ${className}`}
    >
      {/* Right side curved accent */}
      <div className={`absolute -right-6 top-0 bottom-0 w-24 rounded-l-[100px] transition-transform duration-500 group-hover:scale-105 bg-linear-to-r from-brand-leaf to-brand-green`} />

      {/* Floating circular icon badge */}
      <div className={`absolute right-8 top-1/2 -translate-y-1/2 size-12 bg-white rounded-full shadow-lg flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-110 ${iconColorClass}`}>
        <Icon className="size-6" strokeWidth={1.5} />
      </div>

      {/* Content */}
      <div className="relative z-10 py-6 pl-6 pr-24 w-full h-full flex flex-col justify-center transition-transform duration-300 -translate-y-2 md:translate-y-0 group-hover:-translate-y-2">
        <h3 className={`text-sm font-extrabold uppercase tracking-wider mb-1.5 ${titleClass}`}>
          {title}
        </h3>
        <p className="text-xs text-brand-green leading-relaxed transition-opacity duration-300 group-hover:opacity-70">
          {description}
        </p>

        {/* Hover Action Text */}
        {actionText && (
          <div className={`absolute bottom-2 left-6 opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 font-bold text-xs`}>
            <span className="bg-linear-to-r from-brand-leaf to-brand-green text-transparent font-semibold bg-clip-text">
              {actionText}
            </span>
            <ArrowRight className={`size-3.5 ${iconColorClass}`} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}
