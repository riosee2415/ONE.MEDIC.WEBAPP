const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 탕전처방 결제 요청
module.exports = class PaymentRequest extends Model {
  static init(sequelize) {
    return super.init(
      {
        payment: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        packVolumn: {
          // 포장
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },

        typeVolumn: {
          // 종류
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },

        unitVolumn: {
          // 단위
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },

        otherRequest: {
          // 추가 요청사항
          type: DataTypes.STRING(2000),
          allowNull: true,
        },
      },
      {
        modelName: "PaymentRequest",
        tableName: "paymentRequest",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
