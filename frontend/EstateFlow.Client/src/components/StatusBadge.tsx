import { cn } from "../utils/cn";

interface StatusBadgeProps {
  children: string;
  tone?: "teal" | "gold" | "red" | "slate" | "green";
}

const autoTone: Record<string, StatusBadgeProps["tone"]> = {
  Active: "green",
  Sold: "gold",
  Rented: "gold",
  Passive: "slate",
  Cancelled: "red",
  High: "red",
  Medium: "gold",
  Low: "teal",
  Done: "green",
  InProgress: "teal",
  Waiting: "gold",
  New: "teal",
  Interested: "gold",
  Contacted: "teal",
  DealMade: "green",
  Planned: "teal",
  Completed: "green",
  Aktif: "green",
  Satıldı: "gold",
  Kiralandı: "gold",
  Pasif: "slate",
  Yeni: "teal",
  İlgili: "gold",
  Görüşüldü: "teal",
  Anlaşma: "green",
  Planlandı: "teal",
  Tamamlandı: "green",
  İptal: "red",
  Yüksek: "red",
  Orta: "gold",
  Düşük: "teal",
};

const tones = {
  teal: "bg-primary-fixed/70 text-primary ring-primary-fixed-dim/70",
  gold: "bg-secondary-container/60 text-secondary ring-secondary-container",
  red: "bg-red-50 text-red-700 ring-red-100",
  slate: "bg-surface-container-high text-on-surface-variant ring-outline-variant/70",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
};

export function StatusBadge({ children, tone }: StatusBadgeProps) {
  const badgeTone = tone ?? autoTone[children] ?? "slate";

  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ring-1", tones[badgeTone])}>
      {children}
    </span>
  );
}
