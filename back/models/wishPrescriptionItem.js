const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class WishPrescriptionItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        prescriptionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(300),
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cheob: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        pack: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        unit: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        qnt: {
          type: DataTypes.INTEGER, // 수량
          defaultValue: 1,
          allowNull: false, // 필수
        },
      },
      {
        modelName: "WishPrescriptionItem",
        tableName: "wishPrescriptionItem",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.WishPrescriptionItem.belongsTo(db.WishPreContainer);
    db.WishPrescriptionItem.hasMany(db.WishMaterialsItem);
  }
};
