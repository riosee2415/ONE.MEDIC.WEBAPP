const express = require("express");
const {
  Materials,
  MaterialsHistory,
  PaymentRequestMaterial,
} = require("../models");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { Op } = require("sequelize");
const models = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { name } = req.query;

  const searchName = name ? name : "";
  try {
    const selectQuery = `
    SELECT  id,
            name,
            CONCAT(FORMAT(price, 0), "원")		         AS viewPrice,
            price		                                AS originPrice,
            stock,
            unit,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일")      AS createdAt
      FROM  materials
     WHERE  isDelete = false
       AND  name LIKE '%${searchName}%';
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("약재 목록을 불러올 수 없습니다.");
  }
});

router.get("/list/detail/:PaymentRequestId", async (req, res, next) => {
  const { PaymentRequestId } = req.params;

  try {
    const result = await PaymentRequestMaterial.findAll({
      where: {
        PaymentRequestId: parseInt(PaymentRequestId),
      },
      include: [
        {
          model: Materials,
        },
      ],
    });
    if (result.length === 0) {
      return res.status(201).send("해당 결제목록의 재료가 존재하지 않습니다.");
    } else {
      return res.status(200).json(result);
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { name, price, stock, unit } = req.body;

  if (isNanCheck(price) || isNanCheck(stock)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  try {
    const result = await Materials.create({
      name,
      price,
      stock,
      unit,
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청입니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, name, price, stock, unit } = req.body;

  if (isNanCheck(id) || isNanCheck(price) || isNanCheck(stock)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  try {
    if (id) {
      const exMaterials = await Materials.findOne({
        where: {
          id: parseInt(id),
        },
      });

      if (!exMaterials) {
        return res.status(401).send("없는 약재입니다.");
      }
    }

    const result = await Materials.update(
      {
        name,
        price,
        stock,
        unit,
      },
      {
        where: {
          id: parseInt(id),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청입니다.");
  }
});

router.delete("/delete/:materialsId", isAdminCheck, async (req, res, next) => {
  const { materialsId } = req.params;

  if (isNanCheck(materialsId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  try {
    if (materialsId) {
      const exMaterials = await Materials.findOne({
        where: {
          id: parseInt(materialsId),
        },
      });

      if (!exMaterials) {
        return res.status(401).send("없는 약재입니다.");
      }
    }

    const result = await Materials.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(materialsId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청입니다.");
  }
});

router.get("/history/list/:type", async (req, res, next) => {
  const { type } = req.params;

  try {
    const condition =
      type === "1"
        ? `WHERE  mh.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK );`
        : type === "2"
        ? `WHERE  mh.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH );`
        : "";

    const selectQuery = `
    SELECT  mh.id,
            mh.useQnt,
            mh.useUnit,
            mh.materialName,
            DATE_FORMAT(mh.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS useAt
      FROM  materialsHistory mh
     ${condition}
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청입니다.");
  }
});

module.exports = router;
