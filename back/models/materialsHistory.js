const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class MaterialsHistory extends Model {
  static init(sequelize) {
    return super.init(
      {
        useQnt: {
          type: DataTypes.FLOAT,
          allowNull: false, // 필수
        },
        useUnit: {
          type: DataTypes.STRING(10),
          allowNull: false, // 필수
        },
        materialName: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "MaterialsHistory",
        tableName: "materialsHistory",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
