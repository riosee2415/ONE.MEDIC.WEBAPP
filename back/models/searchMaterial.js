const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class SearchMaterial extends Model {
  static init(sequelize) {
    return super.init(
      {
        qnt: {
          type: DataTypes.INTEGER,
          defaultValue: 1,
          allowNull: false, //필수
        },
        unit: {
          type: DataTypes.STRING(10),
          allowNull: false, // 필수
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false, // 필수
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
