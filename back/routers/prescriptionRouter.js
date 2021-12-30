const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Prescription } = require("../models");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const models = require("../models");

const router = express.Router();

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_Id,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.S3_BUCKET_NAME,
    key(req, file, cb) {
      cb(
        null,
        `${
          process.env.S3_STORAGE_FOLDER_NAME
        }/original/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, done) {
//       done(null, "uploads");
//     },
//     filename(req, file, done) {
//       const ext = path.extname(file.originalname); // 확장자 추출 (.png)
//       const basename = path.basename(file.originalname, ext);

//       done(null, basename + "_" + new Date().getTime() + ext);
//     },
//   }),
//   limits: { fileSize: 10 * 1024 * 2024 }, // 20MB
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get(["/list", "/list/:title"], async (req, res, next) => {
  const { title } = req.params;

  const _title = title || "";

  try {
    const selectQuery = `
    SELECT	A.id,
            A.title,
            A.price								AS	originPrice,
            CONCAT(FORMAT(A.price, 0), "원")		AS 	viewPrice,
            A.imageURL1, 
            A.imageURL2, 
            A.imageURL3, 
            A.imageURL4,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일") 	AS createdAt,
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일") 	AS updatedAt
     FROM	prescriptions	A
    WHERE	isDelete = false
      AND   A.title LIKE '%${_title}%'
    `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res.status(400).send("데이터를 조회할 수 없습니다.");
  }
});

module.exports = router;
