const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class UserAddress extends Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: DataTypes.STRING(300),
          allowNull: false, // 필수
        },
        userMobile: {
          type: DataTypes.STRING(150),
          allowNull: false, // 필수
        },
        postCode: {
          type: DataTypes.STRING(10),
          allowNull: false, // 필수
        },
        address: {
          type: DataTypes.STRING(500),
          allowNull: false, // 필수
        },
        detailAddress: {
          type: DataTypes.STRING(500),
          allowNull: false, // 필수
        },
        isNormal: {
          type: DataTypes.BOOLEAN, // 기본 배송지 설정
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
        modelName: "UserAddress",
        tableName: "userAddress",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
