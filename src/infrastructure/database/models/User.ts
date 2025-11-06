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
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(...Object.values(UserType)),
      allowNull: false,
      defaultValue: UserType.LOCAL
    },
    googleUuid: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'users',
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