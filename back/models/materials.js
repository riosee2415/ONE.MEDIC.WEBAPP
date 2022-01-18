const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Materials extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
        },
        unit: {
          type: DataTypes.STRING(20),
          allowNull: false, // 필수
        },
      },
      {
        modelName: "Materials",
        tableName: "materials",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Materials.hasMany(db.PaymentRequestMaterial);
  }
};
