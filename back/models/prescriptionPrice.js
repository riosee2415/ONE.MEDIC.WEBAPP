const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 탕전처방 포장 가격
module.exports = class PrescriptionPrice extends Model {
  static init(sequelize) {
    return super.init(
      {
        // 조제료
        pharmacyPrice: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
        },
        // 탕전료
        tangjeonPrice: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
        },
        // 팩가격
        packPrice: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
        },
        //배송비
        deliveryPrice: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
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
