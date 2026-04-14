import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  medicineId: mongoose.Types.ObjectId;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'delivered' | 'cancelled';
  prescriptionUrl?: string;
  prescriptionRequired: boolean;
}

const orderItemSchema = new Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Medicine' },
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema: Schema = new Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    customerName: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'delivered', 'cancelled'],
      default: 'pending',
    },
    prescriptionUrl: { type: String },
    prescriptionRequired: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
