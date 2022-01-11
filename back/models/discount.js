const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Discount extends Model {
  static init(sequelize) {
    return super.init(
      {
        value: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },

      {
        modelName: "Discount",
        tableName: "discount",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }

  static associate(db) {}
};
