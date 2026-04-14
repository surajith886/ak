// ============================================
// Smart Medicine Management System - Types
// ============================================

export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  expiryDate: string;
  description: string;
  dosage: string;
  requiresPrescription: boolean;
  imageUrl?: string;
}

export type OrderStatus = "pending" | "approved" | "rejected" | "delivered" | "cancelled";

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  prescriptionUrl?: string;
  prescriptionRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = "low_stock" | "expiry_warning" | "new_order" | "general";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface StockUsageData {
  month: string;
  sold: number;
  restocked: number;
}
