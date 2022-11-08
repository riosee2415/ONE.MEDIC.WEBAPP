const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class UserDeliveryRequest extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.STRING(300), // 요청사항
          allowNull: false,
        },
      },
      {
        modelName: "UserDeliveryRequest",
        tableName: "userDeliveryRequest",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
