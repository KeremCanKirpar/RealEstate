import { Eye, Trash2 } from "lucide-react";
import type { Customer } from "../types";
import { currency, customerStatusLabel, customerTypeLabel, propertyTypeLabel } from "../utils/format";
import { isWebLeadCustomer } from "../utils/leadSource";
import { Button } from "./Button";
import { StatusBadge } from "./StatusBadge";

interface CustomerTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerTable({ customers, onView, onDelete }: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-card border border-outline-variant bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-outline-variant/60">
          <thead className="bg-surface-container-low">
            <tr className="text-left text-xs font-bold uppercase tracking-[0.16em] text-outline">
              <th className="px-4 py-3">Müşteri</th>
              <th className="px-4 py-3">Tür</th>
              <th className="px-4 py-3">Bütçe</th>
              <th className="px-4 py-3">İlgi</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-sm">
            {customers.map((customer) => (
              <tr key={customer.id} className="transition hover:bg-surface-container-low">
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-primary">{customer.fullName}</p>
                    {isWebLeadCustomer(customer) && <StatusBadge tone="gold">Web Talebi</StatusBadge>}
                  </div>
                  <p className="text-xs text-on-surface-variant">{customer.phone}</p>
                </td>
                <td className="px-4 py-4 text-on-surface-variant">{customerTypeLabel[customer.customerType]}</td>
                <td className="px-4 py-4 text-on-surface-variant">
                  {customer.budgetMin ? currency.format(customer.budgetMin) : "-"} - {customer.budgetMax ? currency.format(customer.budgetMax) : "-"}
                </td>
                <td className="px-4 py-4 text-on-surface-variant">
                  {customer.desiredPropertyType ? propertyTypeLabel[customer.desiredPropertyType] : "Fark etmez"}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge>{customerStatusLabel[customer.status]}</StatusBadge>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" className="h-9 w-9 p-0" icon={<Eye className="h-4 w-4" />} onClick={() => onView(customer)} aria-label="Görüntüle" />
                    {onDelete && (
                      <Button variant="ghost" className="h-9 w-9 p-0 text-red-600" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(customer)} aria-label="Sil" />
                    )}
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
