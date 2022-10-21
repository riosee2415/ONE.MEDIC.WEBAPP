const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 상세 사용 재료 (탕전 처방)
module.exports = class WishMaterialsItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        materialId: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false, // 필수
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        qnt: {
          type: DataTypes.INTEGER, // 수량
          defaultValue: 1,
          allowNull: false, // 필수
        },
        unit: {
          type: DataTypes.STRING(10), // 단위
          allowNull: false, // 필수
        },
      },
      {
        modelName: "WishMaterialsItem",
        tableName: "wishMaterialsItem",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
