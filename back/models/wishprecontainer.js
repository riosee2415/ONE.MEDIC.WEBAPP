const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class WishPreContainer extends Model {
  static init(sequelize) {
    return super.init(
      {
        ordername: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        receiverName: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        modelName: "WishPreContainer",
        tableName: "wishPreContainer",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.WishPreContainer.hasMany(db.WishPrescriptionItem);
  }
};
