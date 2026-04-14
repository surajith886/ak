import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicine extends Document {
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
}

const medicineSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    category: { type: String, required: true },
    manufacturer: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, required: true, default: 10 },
    expiryDate: { type: String, required: true },
    description: { type: String, required: true },
    dosage: { type: String, required: true },
    requiresPrescription: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model<IMedicine>('Medicine', medicineSchema);

export default Medicine;
