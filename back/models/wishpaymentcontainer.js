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
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        totalQun: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
    db.WishPaymentContainer.hasMany(db.WishPrescriptionItem);
  }
};
