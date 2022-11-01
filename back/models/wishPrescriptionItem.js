const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 탕전 장바구니 상품
module.exports = class WishPrescriptionItem extends Model {
  static init(sequelize) {
    return super.init(
      {
        prescriptionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(300), // 처방명
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.INTEGER, // 총가격
          allowNull: false,
        },
        cheob: {
          type: DataTypes.INTEGER, // 첩
          allowNull: false,
          defaultValue: 1,
        },
        pack: {
          type: DataTypes.INTEGER, // 팩
          allowNull: false,
          defaultValue: 1,
        },
        unit: {
          type: DataTypes.INTEGER, // 용량
          allowNull: false,
          defaultValue: 1,
        },
        qnt: {
          type: DataTypes.FLOAT, // 수량
          defaultValue: 1,
          allowNull: false, // 필수
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
    db.WishPrescriptionItem.hasMany(db.WishMaterialsItem);
  }
};
