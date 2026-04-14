import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connectDB from '../config/db';
import User from '../models/userModel';
import Medicine from '../models/medicineModel';
import Order from '../models/orderModel';
import Notification from '../models/notificationModel';

dotenv.config();
connectDB();

const users = [
  {
    name: 'Dr. Sarah Chen',
    email: 'admin@medivault.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
  },
];

const medicines = [
  {
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    manufacturer: 'Pfizer',
    price: 12.99,
    stock: 150,
    lowStockThreshold: 20,
    expiryDate: '2025-06-15',
    description: 'Broad-spectrum antibiotic used to treat bacterial infections.',
    dosage: '500mg capsule, 3 times daily',
    requiresPrescription: true,
  },
  {
    name: 'Ibuprofen 400mg',
    genericName: 'Ibuprofen',
    category: 'Pain Relief',
    manufacturer: 'GSK',
    price: 8.49,
    stock: 5,
    lowStockThreshold: 30,
    expiryDate: '2026-01-20',
    description: 'Non-steroidal anti-inflammatory drug for pain and inflammation.',
    dosage: '400mg tablet, every 6 hours as needed',
    requiresPrescription: false,
  },
  {
    name: 'Metformin 850mg',
    genericName: 'Metformin',
    category: 'Diabetes',
    manufacturer: 'Merck',
    price: 15.99,
    stock: 200,
    lowStockThreshold: 25,
    expiryDate: '2025-04-18',
    description: 'Oral diabetes medicine that helps control blood sugar levels.',
    dosage: '850mg tablet, twice daily with meals',
    requiresPrescription: true,
  },
  {
    name: 'Cetirizine 10mg',
    genericName: 'Cetirizine',
    category: 'Allergy',
    manufacturer: 'J&J',
    price: 6.99,
    stock: 300,
    lowStockThreshold: 40,
    expiryDate: '2026-08-10',
    description: 'Antihistamine for relief of allergy symptoms.',
    dosage: '10mg tablet, once daily',
    requiresPrescription: false,
  },
  {
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    category: 'Gastric',
    manufacturer: 'AstraZeneca',
    price: 11.49,
    stock: 12,
    lowStockThreshold: 15,
    expiryDate: '2025-04-22',
    description: 'Proton pump inhibitor used to treat GERD and stomach ulcers.',
    dosage: '20mg capsule, once daily before breakfast',
    requiresPrescription: true,
  },
  {
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    category: 'Pain Relief',
    manufacturer: 'GSK',
    price: 4.99,
    stock: 500,
    lowStockThreshold: 50,
    expiryDate: '2026-12-01',
    description: 'Common pain reliever and fever reducer.',
    dosage: '500mg tablet, every 4-6 hours',
    requiresPrescription: false,
  },
  {
    name: 'Losartan 50mg',
    genericName: 'Losartan',
    category: 'Cardiovascular',
    manufacturer: 'Merck',
    price: 18.99,
    stock: 80,
    lowStockThreshold: 15,
    expiryDate: '2025-09-30',
    description: 'ARB used to treat high blood pressure and protect kidneys.',
    dosage: '50mg tablet, once daily',
    requiresPrescription: true,
  },
  {
    name: 'Vitamin D3 1000IU',
    genericName: 'Cholecalciferol',
    category: 'Vitamins',
    manufacturer: "Nature's Way",
    price: 9.99,
    stock: 350,
    lowStockThreshold: 30,
    expiryDate: '2027-03-15',
    description: 'Vitamin D supplement for bone health and immune support.',
    dosage: '1 softgel daily with food',
    requiresPrescription: false,
  },
];

const notifications = [
  {
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Ibuprofen 400mg stock is critically low (5 units remaining).',
    read: false,
  },
  {
    type: 'expiry_warning',
    title: 'Expiry Warning',
    message: 'Metformin 850mg expires on April 18, 2025 (4 days remaining).',
    read: false,
  },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();
    await Notification.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );
    await User.insertMany(hashedUsers);
    
    // Insert medicines
    await Medicine.insertMany(medicines);

    // Insert notifications
    await Notification.insertMany(notifications);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Medicine.deleteMany();
    await User.deleteMany();
    await Notification.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
