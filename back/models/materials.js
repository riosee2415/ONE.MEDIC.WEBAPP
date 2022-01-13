const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Materials extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: false,
        },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: false,
        },
      },
      {
        modelName: "Materials",
        tableName: "materials",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
