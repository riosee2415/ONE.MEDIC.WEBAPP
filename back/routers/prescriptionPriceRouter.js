const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");
const { PrescriptionPrice } = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  try {
    const result = await PrescriptionPrice.findOne();

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("가격을 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { price } = req.body;

  try {
    const exPrice = await PrescriptionPrice.findAll();

    if (exPrice.length > 0) {
      return res.status(400).send("가격은 하나만 생성 가능합니다.");
    }

    await PrescriptionPrice.create({
      price,
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("가격을 생성할 수 없습니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, price } = req.body;

  try {
    console.log(id);
    console.log(price);

    const exPrice = await PrescriptionPrice.findOne({
      where: {
        id,
      },
    });

    if (!exPrice) {
      return res.status(400).send("존재하지 않는 가격입니다.");
    }

    await PrescriptionPrice.update(
      {
        price,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("가격을 수정할 수 없습니다.");
  }
});

module.exports = router;
