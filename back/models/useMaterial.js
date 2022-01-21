const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class UseMaterial extends Model {
  static init(sequelize) {
    return super.init(
      {
        qnt: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        unit: {
          type: DataTypes.STRING(10),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "UseMaterial",
        tableName: "useMaterial",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.UseMaterial.belongsTo(db.PrescriptionPaymentRequest);
    db.UseMaterial.belongsTo(db.Materials);
  }
};
