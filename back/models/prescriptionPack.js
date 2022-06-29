const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 약속처방 포장
module.exports = class PrescriptionPack extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        name: {
          type: DataTypes.STRING(300), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        addPrice: {
          type: DataTypes.INTEGER,
          allowNull: true, // 필수
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "PrescriptionPack",
        tableName: "prescriptionPacks",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.PrescriptionPack.belongsTo(db.Prescription);
  }
};
