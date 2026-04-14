import { Medicine, Notification, Order, User } from "@/types";

type MongoIdEntity = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const mapUser = (user: MongoIdEntity & Omit<User, "id" | "createdAt">): User => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt ?? new Date().toISOString(),
});

export const mapMedicine = (medicine: MongoIdEntity & Omit<Medicine, "id">): Medicine => ({
  id: medicine._id,
  name: medicine.name,
  genericName: medicine.genericName,
  category: medicine.category,
  manufacturer: medicine.manufacturer,
  price: medicine.price,
  stock: medicine.stock,
  lowStockThreshold: medicine.lowStockThreshold,
  expiryDate: medicine.expiryDate,
  description: medicine.description,
  dosage: medicine.dosage,
  requiresPrescription: medicine.requiresPrescription,
});

export const mapOrder = (order: MongoIdEntity & Omit<Order, "id">): Order => ({
  id: order._id,
  customerId: order.customerId,
  customerName: order.customerName,
  items: order.items,
  total: order.total,
  status: order.status,
  prescriptionUrl: order.prescriptionUrl,
  prescriptionRequired: order.prescriptionRequired,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt ?? order.createdAt,
});

export const mapNotification = (
  notification: MongoIdEntity & Omit<Notification, "id">
): Notification => ({
  id: notification._id,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  read: notification.read,
  relatedId: notification.relatedId,
  createdAt: notification.createdAt,
});
