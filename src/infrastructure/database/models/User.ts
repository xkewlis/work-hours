import { DataTypes, Model } from 'sequelize';
import sequelize from '@/infrastructure/database/sequelize';
import { UserType } from '@/shared/enum';

export interface UserRow {
  id: number;
  email: string;
  passwordHash?: string | null;
  type: UserType;
  googleUuid?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}


export class UserSequelize extends Model<UserRow, Omit<UserRow, 'id'>>{
  declare id: number;
  declare email: string;
  declare passwordHash?: string | null;
  declare type: UserType;
  declare googleUuid?: string | null;
  declare displayName?: string | null;
  declare photoUrl?: string | null;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;
  declare readonly deletedAt?: Date | null;
}

UserSequelize.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password_hash'
    },
    type: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false,
      defaultValue: UserType.LOCAL
    },
    googleUuid: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      field: 'google_uuid'
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'display_name'
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'photo_url'
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
    tableName: 'users',
    modelName: 'User',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['google_uuid'],
        name: 'ux_users_google_uuid'
      }
    ]
  }
);