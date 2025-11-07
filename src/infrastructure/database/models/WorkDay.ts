import { DataTypes, Model } from 'sequelize';
import sequelize from '@/infrastructure/database/sequelize';
import { UserSequelize } from './User';

export interface WorkDayRow {
  id: number;
  userId: number;
  workDate: Date;
  totalWorkedSeconds?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class WorkDaySequelize extends Model<WorkDayRow, Omit<WorkDayRow, 'id'>>{
  declare id: number;
  declare userId: number;
  declare workDate: string;
  declare totalWorkedSeconds?: number | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date | null;
}

WorkDaySequelize.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: UserSequelize,
        key: 'id'
      }
    },
    workDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    totalWorkedSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'work_days',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'work_date'],
        name: 'ux_work_days_user_date'
      }
    ]
  }
);
