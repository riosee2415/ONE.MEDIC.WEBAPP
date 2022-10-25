const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 약속처방 상품
module.exports = class Prescription extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        title: {
          type: DataTypes.STRING(300), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: true, // 필수
        },
        imageURL1: {
          type: DataTypes.STRING(500), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        imageURL2: {
          type: DataTypes.STRING(500), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        imageURL3: {
          type: DataTypes.STRING(500), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        imageURL4: {
          type: DataTypes.STRING(500), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: true, // 필수
        },
        description: {
          type: DataTypes.STRING(500),
          allowNull: false,
        },
        isDelete: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        modelName: "Prescription",
        tableName: "prescriptions",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {}
};
