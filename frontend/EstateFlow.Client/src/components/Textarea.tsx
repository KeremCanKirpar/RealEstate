import type { TextareaHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2">
      {label && <span className="text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">{label}</span>}
      <textarea
        className={cn(
          "min-h-28 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/65 focus:border-secondary focus:ring-2 focus:ring-secondary/20",
          error && "border-red-400 bg-red-50/40 focus:border-red-500 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
