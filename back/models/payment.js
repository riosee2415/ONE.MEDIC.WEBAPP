const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Payment extends Model {
  static init(sequelize) {
    return super.init(
      {
        isCompleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },

        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        deliveryCompany: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },

        deliveryNo: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },

        receiveUser: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },

        receiveMobile: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },

        receiveAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        receiveDetailAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        sendUser: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },

        sendMobile: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },

        sendAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        sendDetailAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        deliveryMessage: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        deliveryRequest: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
      },
      {
        modelName: "Payment",
        tableName: "payment",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Payment.hasMany(db.PaymentRequest);
  }
};
