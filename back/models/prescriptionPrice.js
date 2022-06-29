const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 탕전처방 포장 가격
module.exports = class PrescriptionPrice extends Model {
  static init(sequelize) {
    return super.init(
      {
        price: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
      },
      {
        modelName: "PrescriptionPrice",
        tableName: "prescriptionPrice",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
