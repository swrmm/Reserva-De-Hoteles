'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'usuario',
      });
    }

    isActive() {
      return !this.revokedAt && this.expiresAt > new Date();
    }

    toSessionJSON() {
      return {
        id: this.id,
        userAgent: this.userAgent,
        ip: this.ip,
        expiresAt: this.expiresAt,
        createdAt: this.createdAt,
      };
    }
  }

  RefreshToken.init(
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
      userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'user_agent',
      },
      ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'revoked_at',
      },
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      underscored: true,
    }
  );

  return RefreshToken;
};
