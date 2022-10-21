const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 약속 장바구니 상세 상품
module.exports = class WishPaymentItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        paymentId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        pack: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        unit: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        otherRequest: {
          type: DataTypes.STRING(2000),
          allowNull: false,
        },
        qnt: {
          type: DataTypes.INTEGER, // 수량
          defaultValue: 1,
          allowNull: false, // 필수
        },
      },
      {
        modelName: "WishPaymentItem",
        tableName: "wishPaymentItem",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.WishPaymentItem.belongsTo(db.WishPaymentContainer);
  }
};
