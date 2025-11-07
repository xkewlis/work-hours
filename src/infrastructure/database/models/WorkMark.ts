import { DataTypes, Model } from 'sequelize';
import sequelize from '@/infrastructure/database/sequelize';
import { WorkDaySequelize } from './WorkDay';
import { MarkType } from '@/shared/enum';

export interface WorkMarkRow {
  id: number;
  workDayId: number;
  type: MarkType;
  markTimestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class WorkMarkSequelize extends Model<WorkMarkRow, Omit<WorkMarkRow, 'id'>>{
  declare id: number;
  declare workDayId: number;
  declare type: MarkType;
  declare markTimestamp: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date | null;
}

WorkMarkSequelize.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    workDayId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: WorkDaySequelize,
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MarkType)),
      allowNull: false
    },
    markTimestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'work_marks',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        fields: ['work_day_id', 'mark_timestamp'],
        name: 'ix_work_marks_day_timestamp'
      }
    ]
  }
);