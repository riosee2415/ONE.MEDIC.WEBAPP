const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PaymentRequest extends Model {
  static init(sequelize) {
    return super.init(
      {
        totalPayment: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        chup: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        pack: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        packVolumn: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        totalVolumn: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        isComplete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: false,
        },

        completedAt: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: "PaymentRequest",
        tableName: "paymentRequest",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PaymentRequest.belongsTo(db.User);
    db.PaymentRequest.hasMany(db.PaymentRequestMaterial);
  }
};
