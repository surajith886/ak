import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  type: 'low_stock' | 'expiry_warning' | 'new_order' | 'general';
  title: string;
  message: string;
  read: boolean;
  relatedId?: string; // id of order or medicine
}

const notificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['low_stock', 'expiry_warning', 'new_order', 'general'],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, required: true, default: false },
    relatedId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;
