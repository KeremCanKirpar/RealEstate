export type UserRole = "Admin" | "Consultant";
export type ListingType = "ForSale" | "ForRent";
export type PropertyType = "Apartment" | "Villa" | "Land" | "Office" | "Shop";
export type PropertyStatus = "Active" | "Passive" | "Sold" | "Rented";
export type CustomerType = "Buyer" | "Tenant" | "PropertyOwner";
export type CustomerStatus = "New" | "Interested" | "Contacted" | "DealMade" | "Passive";
export type AppointmentType = "PropertyViewing" | "OfficeMeeting" | "PhoneCall";
export type AppointmentStatus = "Planned" | "Completed" | "Cancelled";
export type TaskStatus = "Todo" | "InProgress" | "Waiting" | "Done";
export type Priority = "Low" | "Medium" | "High";
export type DocumentType = "TitleDeed" | "Contract" | "IdCopy" | "AuthorizationDocument" | "ExpertiseReport";

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface PropertyImage {
  id: number;
  imageUrl: string;
  isMainImage: boolean;
  createdAt: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  city: string;
  district: string;
  neighborhood?: string | null;
  address?: string | null;
  squareMeters: number;
  roomCount: string;
  buildingAge?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  heatingType?: string | null;
  isFurnished: boolean;
  dues?: number | null;
  deposit?: number | null;
  status: PropertyStatus;
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt?: string | null;
  userId: number;
  consultantName: string;
  images: PropertyImage[];
}

export type PropertyPayload = Omit<
  Property,
  "id" | "createdAt" | "updatedAt" | "userId" | "consultantName" | "images"
>;

export interface PublicPropertyImage {
  id: number;
  imageUrl: string;
  isMainImage: boolean;
}

export interface PublicProperty {
  id: number;
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  city: string;
  district: string;
  neighborhood?: string | null;
  squareMeters: number;
  roomCount: string;
  buildingAge?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  heatingType?: string | null;
  isFurnished: boolean;
  dues?: number | null;
  deposit?: number | null;
  createdAt: string;
  images: PublicPropertyImage[];
}

export interface PublicLeadPayload {
  fullName: string;
  phone: string;
  email?: string | null;
  customerType?: CustomerType | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  desiredPropertyType?: PropertyType | null;
  desiredCity?: string | null;
  desiredDistrict?: string | null;
  notes?: string | null;
  propertyId?: number | null;
  preferredContactTime?: string | null;
  website?: string | null;
}

export interface CustomerNote {
  id: number;
  customerId: number;
  note: string;
  createdAt: string;
  userId: number;
  consultantName: string;
}

export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  customerType: CustomerType;
  budgetMin?: number | null;
  budgetMax?: number | null;
  desiredPropertyType?: PropertyType | null;
  desiredCity?: string | null;
  desiredDistrict?: string | null;
  notes?: string | null;
  status: CustomerStatus;
  createdAt: string;
  userId: number;
  consultantName: string;
  customerNotes: CustomerNote[];
}

export type CustomerPayload = Omit<Customer, "id" | "createdAt" | "userId" | "consultantName" | "customerNotes">;

export interface Appointment {
  id: number;
  customerId: number;
  customerName: string;
  propertyId?: number | null;
  propertyTitle?: string | null;
  appointmentDate: string;
  appointmentType: AppointmentType;
  location: string;
  status: AppointmentStatus;
  notes?: string | null;
  createdAt: string;
  userId: number;
  consultantName: string;
}

export interface AppointmentPayload {
  customerId: number;
  propertyId?: number | null;
  appointmentDate: string;
  appointmentType: AppointmentType;
  location: string;
  status: AppointmentStatus;
  notes?: string | null;
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: TaskStatus;
  userId: number;
  consultantName: string;
  customerId?: number | null;
  customerName?: string | null;
  propertyId?: number | null;
  propertyTitle?: string | null;
  createdAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: TaskStatus;
  customerId?: number | null;
  propertyId?: number | null;
}

export interface DocumentItem {
  id: number;
  fileName: string;
  fileUrl: string;
  documentType: DocumentType;
  propertyId?: number | null;
  propertyTitle?: string | null;
  customerId?: number | null;
  customerName?: string | null;
  createdAt: string;
  userId: number;
  consultantName: string;
}

export interface DashboardStats {
  totalProperties: number;
  activeListings: number;
  customers: number;
  appointmentsThisWeek: number;
  completedDeals: number;
  estimatedCommission: number;
}

export interface TaskSummary {
  status: TaskStatus;
  count: number;
}
