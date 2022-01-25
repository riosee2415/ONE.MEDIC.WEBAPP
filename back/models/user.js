const DataTypes = require("sequelize");
const { Model } = DataTypes;

// nickname 빼고 (유지)

module.exports = class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        // id가 기본적으로 들어있다.
        email: {
          type: DataTypes.STRING(60), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        username: {
          // 대표자명
          type: DataTypes.STRING(30), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        mobile: {
          type: DataTypes.STRING(30),
          allowNull: false, // 필수
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false, // 필수
        },
        level: {
          // 사용자 권한 [1 : 일반회원, 2 : 비어있음, 3: 운영자, 4: 최고관리자, 5: 개발사]
          type: DataTypes.INTEGER,
          allowNull: false, //
          defaultValue: 1,
        },
        secret: {
          type: DataTypes.STRING(10),
          allowNull: true,
          defaultValue: null,
        },

        terms: {
          // 이용약관동의
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        // 업체명
        companyName: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        // 사업자번호
        companyNo: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        // 사업자인증
        isCompany: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        // 사업첨부파일
        companyFile: {
          type: DataTypes.STRING(600),
          allowNull: true,
        },
        // 운영레벨 [1 : 기본값]
        operatorLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        // 거절여부
        isRefusal: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        // 거절사유
        resusalReason: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        licenseNo: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci", // 한글 저장
        sequelize,
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Question);
    db.User.hasMany(db.Payment);
    db.User.hasMany(db.UserAddress);
    db.User.hasMany(db.PrescriptionPaymentRequest);
    db.User.hasMany(db.UserCard);
  }
};
