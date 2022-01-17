const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class PaymentRequestMaterial extends Model {
  static init(sequelize) {
    return super.init(
      {
        qnt: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        unit: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        payment: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        modelName: "PaymentRequestMaterial",
        tableName: "paymentRequestMaterial",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PaymentRequestMaterial.belongsTo(db.PaymentRequest);
    db.PaymentRequestMaterial.belongsTo(db.Materials);
  }
};
