import type {
  AppointmentStatus,
  AppointmentType,
  CustomerStatus,
  CustomerType,
  DocumentType,
  ListingType,
  Priority,
  PropertyStatus,
  PropertyType,
  TaskStatus,
} from "../types";

export const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export const shortDate = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const dateTime = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export const listingTypeLabel: Record<ListingType, string> = {
  ForSale: "Satılık",
  ForRent: "Kiralık",
};

export const propertyTypeLabel: Record<PropertyType, string> = {
  Apartment: "Daire",
  Villa: "Villa",
  Land: "Arsa",
  Office: "Ofis",
  Shop: "Mağaza",
};

export const propertyStatusLabel: Record<PropertyStatus, string> = {
  Active: "Aktif",
  Passive: "Pasif",
  Sold: "Satıldı",
  Rented: "Kiralandı",
};

export const customerTypeLabel: Record<CustomerType, string> = {
  Buyer: "Alıcı",
  Tenant: "Kiracı",
  PropertyOwner: "Mal Sahibi",
};

export const customerStatusLabel: Record<CustomerStatus, string> = {
  New: "Yeni",
  Interested: "İlgili",
  Contacted: "Görüşüldü",
  DealMade: "Anlaşma",
  Passive: "Pasif",
};

export const appointmentTypeLabel: Record<AppointmentType, string> = {
  PropertyViewing: "Portföy Gezisi",
  OfficeMeeting: "Ofis Görüşmesi",
  PhoneCall: "Telefon",
};

export const appointmentStatusLabel: Record<AppointmentStatus, string> = {
  Planned: "Planlandı",
  Completed: "Tamamlandı",
  Cancelled: "İptal",
};

export const taskStatusLabel: Record<TaskStatus, string> = {
  Todo: "Yapılacak",
  InProgress: "Devam Ediyor",
  Waiting: "Beklemede",
  Done: "Tamamlandı",
};

export const priorityLabel: Record<Priority, string> = {
  Low: "Düşük",
  Medium: "Orta",
  High: "Yüksek",
};

export const documentTypeLabel: Record<DocumentType, string> = {
  TitleDeed: "Tapu",
  Contract: "Sözleşme",
  IdCopy: "Kimlik",
  AuthorizationDocument: "Yetki Belgesi",
  ExpertiseReport: "Ekspertiz",
};

export function compactNumber(value: number) {
  return new Intl.NumberFormat("tr-TR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
