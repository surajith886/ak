import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../medivault.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`SQLite Database Connected: ${dbPath}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
