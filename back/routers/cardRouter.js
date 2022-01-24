const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { UserCard, User } = require("../models");

const router = express.Router();

router.get("/list/:userId", isLoggedIn, async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const exUser = User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("회원이 없습니다.");
      }
    }

    const result = await UserCard.findAll({
      where: {
        UserId: parseInt(userId),
        isDelete: false,
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { cardNo, cardDate, birth, terms, userId } = req.body;

  try {
    if (userId) {
      const exUser = User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("회원이 없습니다.");
      }
    }

    const result = await UserCard.create({
      cardNo,
      cardDate,
      birth,
      terms,
      UserId: parseInt(userId),
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { cardNo, cardDate, birth, terms, cardId } = req.body;

  try {
    if (cardId) {
      const exAddress = UserCard.findOne({
        where: {
          id: parseInt(cardId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("등록된 카드가 없습니다.");
      }
    }

    const result = await UserCard.update(
      {
        cardNo,
        cardDate,
        birth,
        terms,
      },
      {
        where: {
          id: parseInt(cardId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.delete("/delete/:cardId", isLoggedIn, async (req, res, next) => {
  const { cardId } = req.body;

  try {
    if (cardId) {
      const exAddress = UserCard.findOne({
        where: {
          id: parseInt(cardId),
        },
      });

      if (!exAddress) {
        return res.status(400).send("등록된 카드가 없습니다.");
      }
    }

    const result = await UserCard.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(cardId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

module.exports = router;
