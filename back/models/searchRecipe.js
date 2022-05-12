const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class SearchRecipe extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "SearchRecipe",
        tableName: "searchRecipe",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.SearchRecipe.hasMany(db.SearchMaterial);
  }
};
