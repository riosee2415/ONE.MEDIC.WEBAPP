const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { PaymentRequest, User } = require("../models");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  try {
    const result = await PaymentRequest.findAll();

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("결제 요청이 없습니다.");
  }
});

router.get("/create", isLoggedIn, async (req, res, next) => {
  const { userId, chup, pack, packVolumn, totalVolumn } = req.body;

  try {
    if (userId) {
      const exUser = await User.findOne({
        where: {
          id: userId,
        },
      });

      if (exUser) {
        return res.status(400).send("존재하지 않는 회원입니다.");
      }
    }

    const result = await PaymentRequest.create({
      UserId: parseInt(userId),
      chup,
      pack,
      packVolumn,
      totalVolumn,
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청 입니다.");
  }
});

module.exports = router;
