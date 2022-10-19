const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 배송비
module.exports = class DeliveryPrice extends Model {
  static init(sequelize) {
    return super.init(
      {
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        modelName: "DeliveryPrice",
        tableName: "deliveryPrice",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }

  static associate(db) {}
};
