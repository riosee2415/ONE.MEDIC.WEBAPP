const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { Discount } = require("../models");

const router = express.Router();

router.get("/list", isAdminCheck, async (req, res, next) => {
  try {
    const result = await Discount.findAll({
      where: {
        isDelete: false,
      },
    });

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(201).send("혜택이 존재하지 않습니다.");
    }
  } catch (e) {
    console.error(e);
    return res.status(401).send("혜택 목록을 불러올 수 없습니다.");
  }
});

router.post("/create", isAdminCheck, async (req, res, next) => {
  const { value } = req.body;

  try {
    const discountList = await Discount.findAll();

    if (discountList.length === 5) {
      return res.status(401).send("혜택이 5개 이상 있습니다.");
    }

    const result = await Discount.create({
      value: parseFloat(value),
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청 입니다.");
  }
});

router.patch("/update", isAdminCheck, async (req, res, next) => {
  const { id, value } = req.body;

  try {
    if (id) {
      const exDiscount = await Discount.findOne({
        where: { id: parseInt(id) },
      });

      if (!exDiscount) {
        return res.status(401).send("혜택이 존재하지 않습니다.");
      }
    }

    const reuslt = await Discount.update(
      {
        value: parseFloat(value),
      },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청 입니다.");
  }
});

router.delete("/delete/:discountId", isAdminCheck, async (req, res, next) => {
  const { discountId } = req.params;
  try {
    if (discountId) {
      const exDiscount = await Discount.findOne({
        where: { id: parseInt(discountId) },
      });

      if (!exDiscount) {
        return res.status(401).send("혜택이 존재하지 않습니다.");
      }
    }

    const reuslt = await Discount.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(discountId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("잘못된 요청 입니다.");
  }
});

module.exports = router;
