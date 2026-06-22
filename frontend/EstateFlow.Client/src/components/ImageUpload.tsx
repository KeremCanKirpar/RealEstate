import { ImagePlus } from "lucide-react";
import { Input } from "./Input";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  return (
    <div className="rounded-card border border-outline-variant bg-white p-5 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-primary">
        <ImagePlus className="h-4 w-4 text-secondary" />
        Ana görsel URL'si
      </div>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://..." />
    </div>
  );
}
