const DataTypes = require("sequelize");
const { Model } = DataTypes;

// 약속처방, 탕전처방 결제
module.exports = class BoughtHistory extends Model {
  static init(sequelize) {
    return super.init(
      {
        // 1. 약속처방 - 2. 탕전처방
        type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },

        // 거절 - 탕전처방
        isRefuse: {
          type: DataTypes.BOOLEAN,
          allowNull: false, // 필수
          defaultValue: false,
        },

        // 거절 사유 - 탕전처방
        refuseContent: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        // 처리완료
        isCompleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false, // 필수
          defaultValue: false,
        },

        // 처리완료 날짜
        completedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        // 무통장입금 입금 처리
        isNobank: {
          type: DataTypes.BOOLEAN,
          allowNull: false, // 필수
          defaultValue: false,
        },

        // 결제 여부
        isPay: {
          type: DataTypes.BOOLEAN,
          allowNull: false, // 필수
          defaultValue: false,
        },

        // 배송회사
        deliveryCompany: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },

        // 운송장번호
        deliveryNo: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },

        // 받는 사람 이름
        receiveUser: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },

        // 받는 사람 전화번호
        receiveMobile: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },

        // 받는 사람 주소
        receiveAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        // 받는 사람 상세주소
        receiveDetailAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        // 보내는 사람 이름
        sendUser: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },

        // 보내는 사람 전화번호
        sendMobile: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },

        // 보내는 사람 주소
        sendAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        // 보내는 사람 상세 주소
        sendDetailAddress: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },

        // 배송시 요청사항
        deliveryMessage: {
          type: DataTypes.STRING(400),
          allowNull: true,
        },

        // 배송 상태
        deliveryStatus: {
          type: DataTypes.INTEGER,
          allowNull: false, // 필수
          defaultValue: 0,
        },

        // 결제 수단
        payInfo: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },

        // 전체 금액
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        modelName: "BoughtHistory",
        tableName: "boughtHistory",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.BoughtHistory.hasMany(db.WishPaymentContainer);
    db.BoughtHistory.hasMany(db.WishPrescriptionItem);
  }
};
