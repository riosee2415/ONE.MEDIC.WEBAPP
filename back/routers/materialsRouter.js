const express = require("express");
const { Materials } = require("../models");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isNanCheck = require("../middlewares/isNanCheck");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { name } = req.query;

  const searchName = name ? name : "";
  try {
    const result = await Materials.findAll({
      where: {
        isDelete: false,
        name: {
          [Op.like]: `%${searchName}%`,
        },
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(401).send("약재 목록을 불러올 수 없습니다.");
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

module.exports = router;
