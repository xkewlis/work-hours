import { Options } from 'sequelize';
import AppConfig from '@/shared/env';

export const config: Options = {
  host: AppConfig.DB_HOST,
  username: AppConfig.DB_USERNAME,
  password: AppConfig.DB_PASSWORD,
  database: AppConfig.DB_NAME,
  port: AppConfig.DB_PORT,
  dialect: 'postgres',
  logging: false,
  benchmark: true,
  timezone: '+00:00',
  define: {
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};