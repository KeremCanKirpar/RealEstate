import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-primary/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-card bg-white p-7 shadow-modal">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-primary">{title}</h2>
          <Button type="button" variant="ghost" className="h-10 w-10 p-0" icon={<X className="h-4 w-4" />} onClick={onClose} aria-label="Kapat" />
        </div>
        {children}
      </div>
    </div>
  );
}
