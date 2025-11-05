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

export class WorkMarkSequelize extends Model<WorkMarkRow, Omit<WorkMarkRow, 'id'>>
  implements WorkMarkRow {
  declare id: number;
  declare workDayId: number;
  declare type: MarkType;
  declare markTimestamp: Date;
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
      field: 'work_day_id',
      references: {
        model: WorkDaySequelize,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(MarkType)),
      allowNull: false
    },
    markTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'mark_timestamp'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  },
  {
    sequelize,
    tableName: 'work_marks',
    modelName: 'WorkMark',
    timestamps: true,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    indexes: [
      {
        fields: ['work_day_id', 'mark_timestamp'],
        name: 'ix_work_marks_day_timestamp'
      }
    ]
  }
);