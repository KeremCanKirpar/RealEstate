import type { Customer, TaskItem } from "../types";

const WEB_LEAD_MARKER = "Kaynak: Web sitesi talebi";

export function isWebLeadCustomer(customer: Pick<Customer, "notes">) {
  return customer.notes?.includes(WEB_LEAD_MARKER) ?? false;
}

export function isWebLeadTask(task: Pick<TaskItem, "title" | "description">) {
  return task.title.startsWith("Web talebini ara") || (task.description?.includes("Public web sitesinden yeni talep geldi") ?? false);
}