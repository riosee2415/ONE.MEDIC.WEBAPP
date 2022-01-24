const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class UserCard extends Model {
  static init(sequelize) {
    return super.init(
      {
        cardNo: {
          type: DataTypes.STRING(50),
          allowNull: false, // 필수
        },
        cardDate: {
          type: DataTypes.STRING(500),
          allowNull: false, // 필수
        },
        birth: {
          type: DataTypes.STRING(500),
          allowNull: false, // 필수
        },
        terms: {
          type: DataTypes.BOOLEAN, // 이용약관동의
          allowNull: false,
          defaultValue: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "UserCard",
        tableName: "userCard",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
