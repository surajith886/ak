import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Notification extends Model {
  public id!: string;
  public type!: 'low_stock' | 'expiry_warning' | 'new_order' | 'general';
  public title!: string;
  public message!: string;
  public read!: boolean;
  public relatedId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('low_stock', 'expiry_warning', 'new_order', 'general'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    relatedId: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
  }
);

export default Notification;
