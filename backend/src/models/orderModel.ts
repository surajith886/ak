import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Order extends Model {
  public id!: string;
  public customerId!: string;
  public customerName!: string;
  public items!: OrderItem[];
  public total!: number;
  public status!: 'pending' | 'approved' | 'rejected' | 'delivered' | 'cancelled';
  public prescriptionUrl?: string;
  public prescriptionRequired!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'delivered', 'cancelled'),
      defaultValue: 'pending',
      allowNull: false,
    },
    prescriptionUrl: {
      type: DataTypes.STRING,
    },
    prescriptionRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
  }
);

export default Order;
