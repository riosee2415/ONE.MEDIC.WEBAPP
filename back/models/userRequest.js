const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class UserRequest extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(300), // 처방명
          allowNull: false,
        },
        receiverName: {
          type: DataTypes.STRING(100), // 환자이름
          allowNull: false,
        },
        medication: {
          type: DataTypes.STRING(600), // 복약지도
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(500), // 추가요청사항
          allowNull: false,
        },
      },
      {
        modelName: "UserRequest",
        tableName: "userRequest",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
