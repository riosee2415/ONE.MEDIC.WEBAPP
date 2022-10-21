const Sequelize = require("sequelize");
const user = require("./user");
const mainbanner = require("./mainbanner");
const companyinfo = require("./companyinfo");
const popup = require("./popup");
const acceptrecord = require("./acceptrecord");
const notice = require("./notice");
const gallary = require("./gallary");
const question = require("./question");
const questiontype = require("./questiontype");
const seo = require("./seo");
const prescription = require("./prescription");
const prescriptionPack = require("./prescriptionPack");
const prescriptionType = require("./prescriptionType");
const prescriptionUnit = require("./prescriptionUnit");
const discount = require("./discount");
const materials = require("./materials");
const materialsHistory = require("./materialsHistory");
const paymentRequest = require("./paymentRequest");
const prescriptionPaymentRequest = require("./prescriptionPaymentRequest");
const useMaterial = require("./useMaterial");
const useraddress = require("./useraddress");
const payment = require("./payment");
const searchRecipe = require("./searchRecipe");
const searchMaterial = require("./searchMaterial");
const prescriptionPrice = require("./prescriptionPrice");
const wishpaymentcontainer = require("./wishpaymentcontainer");
const wishprecontainer = require("./wishprecontainer");
const wishPaymentItem = require("./wishPaymentItem");
const wishPrescriptionItem = require("./wishPrescriptionItem");
const wishMaterialsItem = require("./wishMaterialsItem");
const wishList = require("./wishList");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.User = user;
db.MainBanner = mainbanner;
db.CompanyInfo = companyinfo;
db.Popup = popup;
db.AcceptRecord = acceptrecord;
db.Notice = notice;
db.Gallary = gallary;
db.Question = question;
db.QuestionType = questiontype;
db.Seo = seo;
db.Prescription = prescription;
db.PrescriptionPack = prescriptionPack;
db.PrescriptionType = prescriptionType;
db.PrescriptionUnit = prescriptionUnit;
db.Discount = discount;
db.Materials = materials;
db.MaterialsHistory = materialsHistory;
db.PaymentRequest = paymentRequest;
db.PrescriptionPaymentRequest = prescriptionPaymentRequest;
db.UseMaterial = useMaterial;
db.UserAddress = useraddress;
db.Payment = payment;
db.SearchRecipe = searchRecipe;
db.SearchMaterial = searchMaterial;
db.PrescriptionPrice = prescriptionPrice;
db.WishPreContainer = wishprecontainer;
db.WishPaymentContainer = wishpaymentcontainer;
db.WishPaymentItem = wishPaymentItem;
db.WishPrescriptionItem = wishPrescriptionItem;
db.WishMaterialsItem = wishMaterialsItem;
db.WishList = wishList;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
