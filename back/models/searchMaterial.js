const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class SearchMaterial extends Model {
  static init(sequelize) {
    return super.init(
      {
        quantity: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
          allowNull: false, //필수
        },
      },
      {
        modelName: "SearchMaterial",
        tableName: "searchMaterial",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.SearchMaterial.belongsTo(db.Materials);
  }
};
