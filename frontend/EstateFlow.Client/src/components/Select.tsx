import type { SelectHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2">
      {label && <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>}
      <select
        className={cn(
          "h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20",
          error && "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
