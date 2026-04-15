import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import bcrypt from 'bcrypt';

export class User extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'customer';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      defaultValue: 'customer',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

// Hash password before saving
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default User;
