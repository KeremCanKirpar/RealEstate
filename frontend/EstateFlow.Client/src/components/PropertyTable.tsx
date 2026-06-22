import { Edit, Eye, Trash2 } from "lucide-react";
import type { Property } from "../types";
import { currency, propertyStatusLabel, propertyTypeLabel, shortDate } from "../utils/format";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

interface PropertyTableProps {
  properties: Property[];
  onView: (property: Property) => void;
  onEdit: (property: Property) => void;
  onDelete: (property: Property) => void;
}

export function PropertyTable({ properties, onView, onEdit, onDelete }: PropertyTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-outline-variant bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant/60">
          <thead className="bg-surface-container-low">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-outline">
              <th className="px-4 py-3">İlan</th>
              <th className="px-4 py-3">Konum</th>
              <th className="px-4 py-3">Tür</th>
              <th className="px-4 py-3">Fiyat</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Oluşturma</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-sm">
            {properties.map((property) => (
              <tr key={property.id} className="transition hover:bg-surface-container-low">
                <td className="px-4 py-4 font-bold text-primary">{property.title}</td>
                <td className="px-4 py-4 text-on-surface-variant">
                  {property.city}, {property.district}
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{propertyTypeLabel[property.propertyType]}</td>
                <td className="px-4 py-4 font-bold text-secondary">{currency.format(property.price)}</td>
                <td className="px-4 py-4">
                  <StatusBadge>{propertyStatusLabel[property.status]}</StatusBadge>
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{shortDate.format(new Date(property.createdAt))}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" className="h-9 w-9 p-0" icon={<Eye className="h-4 w-4" />} onClick={() => onView(property)} aria-label="Görüntüle" />
                    <Button variant="ghost" className="h-9 w-9 p-0" icon={<Edit className="h-4 w-4" />} onClick={() => onEdit(property)} aria-label="Düzenle" />
                    <Button variant="ghost" className="h-9 w-9 p-0 text-red-600" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(property)} aria-label="Sil" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
