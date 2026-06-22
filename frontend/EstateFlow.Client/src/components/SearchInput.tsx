import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = "Ara" }: SearchInputProps) {
  return (
    <div className="relative min-w-64">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-12 pr-4 text-sm outline-none transition placeholder:text-on-surface-variant/65 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
      />
    </div>
  );
}
