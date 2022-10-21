const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 장바구니
module.exports = class WishList extends Model {
  static init(sequelize) {
    return super.init(
      {
        temp: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        modelName: "WishList",
        tableName: "wishLists",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.WishList.hasMany(db.WishPaymentContainer);
    db.WishList.hasMany(db.WishPreContainer);
    db.WishList.belongsTo(db.User);
  }
};
