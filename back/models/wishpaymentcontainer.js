const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 약속처방 장바구니 상품
module.exports = class WishPaymentContainer extends Model {
  static init(sequelize) {
    return super.init(
      {
        productname: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        medication: {
          type: DataTypes.STRING(600), // 복약지도
          allowNull: true,
        },
        receiverName: {
          type: DataTypes.STRING(100), // 환자이름
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        paymentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        modelName: "WishPaymentContainer",
        tableName: "wishPaymentContainer",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.WishPaymentContainer.hasMany(db.WishPaymentItem);
  }
};
