'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {
    static associate(models) {
      PasswordResetToken.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
    }

    isActive() {
      return !this.usedAt && this.expiresAt > new Date();
    }
  }

  PasswordResetToken.init(
    {
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id',
      },
      tokenHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'token_hash',
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'used_at',
      },
    },
    {
      sequelize,
      modelName: 'PasswordResetToken',
      tableName: 'password_reset_tokens',
      underscored: true,
    }
  );

  return PasswordResetToken;
};
