const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const {
  Prescription,
  PrescriptionType,
  PrescriptionPack,
} = require("../models");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const models = require("../models");
const isNanCheck = require("../middlewares/isNanCheck");
const PrescriptionUnit = require("../models/prescriptionUnit");

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

router.post(
  "/image",
  isAdminCheck,
  upload.single("image"),
  async (req, res, next) => {
    return res.json({ path: req.file.location });
  }
);

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

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const {
    id,
    title,
    price,
    imageURL1,
    imageURL2,
    imageURL3,
    imageURL4,
    description,
  } = req.body;

  try {
    await Prescription.update(
      {
        title,
        price: parseInt(price),
        imageURL1,
        imageURL2,
        imageURL3,
        imageURL4,
        description,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("상품 수정에 실패했습니다. 다시 시도해주세요.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const {
    title,
    price,
    imageURL1,
    imageURL2,
    imageURL3,
    imageURL4,
    description,
  } = req.body;

  try {
    await Prescription.create({
      title,
      price: parseInt(price),
      imageURL1,
      imageURL2,
      imageURL3,
      imageURL4,
      description,
    });

    res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("상품 추가에 실패했습니다. 다시 시도해주세요.");
  }
});

router.patch("/delete", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;

  try {
    await Prescription.update(
      {
        isDelete: true,
      },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("삭제가 불가능합니다. 잠시 후 다시 시도해주세요.");
  }
});

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
            DATE_FORMAT(A.updatedAt, "%Y년 %m월 %d일") 	AS updatedAt,
            description
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

router.get("/type/list/:typeId", async (req, res, next) => {
  const { typeId } = req.params;

  if (isNanCheck(typeId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            name,
            addPrice                           AS  originAddPrice,
            CONCAT(FORMAT(addPrice, 0), "원")  AS  viewAddPrice
      FROM	prescriptionTypes
     WHERE	PrescriptionId  = ${typeId}
       AND  isDelete = false
     ORDER  BY  name  ASC
  `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 요청에 실패했습니다. 다시 시도해주세요.");
  }
});

router.post("/type/add", isAdminCheck, async (req, res, next) => {
  const { prescriptionId, name, addPrice } = req.body;

  if (isNanCheck(prescriptionId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    await PrescriptionType.create({
      name,
      addPrice: parseInt(addPrice),
      PrescriptionId: parseInt(prescriptionId),
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("잘못된 요청 입니다. 다시 시도해주세요.");
  }
});

router.patch("/type/delete", isAdminCheck, async (req, res, next) => {
  const { typeId } = req.body;

  if (isNanCheck(typeId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const result = await PrescriptionType.update(
      {
        isDelete: true,
      },
      { where: { id: parseInt(typeId) } }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 삭제에 실패했습니다. 다시 시도해주세요.");
  }
});

router.get("/pack/list/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isNanCheck(id)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            name,
            addPrice                           AS  originAddPrice,
            CONCAT(FORMAT(addPrice, 0), "원")   AS  viewAddPrice
      FROM	prescriptionPacks
     WHERE	PrescriptionId  = ${id}
       AND  isDelete = false
     ORDER  BY  name  ASC
  `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 요청에 실패했습니다. 다시 시도해주세요.");
  }
});

router.post("/pack/add", isAdminCheck, async (req, res, next) => {
  const { prescriptionId, name, addPrice } = req.body;

  if (isNanCheck(prescriptionId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    await PrescriptionPack.create({
      name,
      addPrice: parseInt(addPrice),
      PrescriptionId: parseInt(prescriptionId),
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("잘못된 요청 입니다. 다시 시도해주세요.");
  }
});

router.patch("/pack/delete", isAdminCheck, async (req, res, next) => {
  const { typeId } = req.body;

  if (isNanCheck(typeId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const result = await PrescriptionPack.update(
      {
        isDelete: true,
      },
      { where: { id: parseInt(typeId) } }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 삭제에 실패했습니다. 다시 시도해주세요.");
  }
});

//UNIT

router.get("/unit/list/:id", async (req, res, next) => {
  const { id } = req.params;

  if (isNanCheck(id)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const selectQuery = `
    SELECT	id,
            name,
            addPrice                           AS  originAddPrice,
            CONCAT(FORMAT(addPrice, 0), "원")   AS  viewAddPrice
      FROM	prescriptionUnits
     WHERE	PrescriptionId  = ${id}
       AND  isDelete = false
     ORDER  BY  name  ASC
  `;

    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 요청에 실패했습니다. 다시 시도해주세요.");
  }
});

router.post("/unit/add", isAdminCheck, async (req, res, next) => {
  const { prescriptionId, name, addPrice } = req.body;

  if (isNanCheck(prescriptionId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    await PrescriptionUnit.create({
      name,
      addPrice: parseInt(addPrice),
      PrescriptionId: parseInt(prescriptionId),
    });

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(400).send("잘못된 요청 입니다. 다시 시도해주세요.");
  }
});

router.patch("/unit/delete", isAdminCheck, async (req, res, next) => {
  const { typeId } = req.body;

  if (isNanCheck(typeId)) {
    return res.status(403).send("올바른 요청이 아닙니다. 다시 시도해주세요.");
  }

  try {
    const result = await PrescriptionUnit.update(
      {
        isDelete: true,
      },
      { where: { id: parseInt(typeId) } }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .send("데이터 삭제에 실패했습니다. 다시 시도해주세요.");
  }
});

module.exports = router;
