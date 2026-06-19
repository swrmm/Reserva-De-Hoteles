'use strict';

const bcrypt = require('bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.RefreshToken, {
        foreignKey: 'usuarioId',
        as: 'refreshTokens',
      });
      Usuario.hasMany(models.Reserva, {
        foreignKey: 'usuarioId',
        as: 'reservas',
      });
      Usuario.hasMany(models.PasswordResetToken, {
        foreignKey: 'usuarioId',
        as: 'passwordResetTokens',
      });
    }

    static async hashPassword(password) {
      return bcrypt.hash(password, 10);
    }

    async validatePassword(password) {
      return bcrypt.compare(password, this.passwordHash);
    }

    toSafeJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
        email: this.email,
        rol: this.rol,
        activo: this.activo,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  }

  Usuario.init(
    {
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      rol: {
        type: DataTypes.ENUM('admin', 'recepcionista'),
        allowNull: false,
        defaultValue: 'recepcionista',
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );

  return Usuario;
};
