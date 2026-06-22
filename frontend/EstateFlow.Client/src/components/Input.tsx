import type { InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2">
      {label && <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>}
      <input
        className={cn(
          "h-12 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/65 focus:border-secondary focus:ring-2 focus:ring-secondary/20",
          error && "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
