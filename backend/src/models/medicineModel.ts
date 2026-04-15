import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Medicine extends Model {
  public id!: string;
  public name!: string;
  public genericName!: string;
  public category!: string;
  public manufacturer!: string;
  public price!: number;
  public stock!: number;
  public lowStockThreshold!: number;
  public expiryDate!: string;
  public description!: string;
  public dosage!: string;
  public requiresPrescription!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Medicine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genericName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manufacturer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lowStockThreshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    expiryDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requiresPrescription: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'medicines',
    timestamps: true,
  }
);

export default Medicine;
