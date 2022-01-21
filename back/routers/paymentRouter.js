const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");
const { PaymentRequest, User } = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { isComplete, type } = req.query;

  console.log(isComplete);
  console.log(type);

  try {
    const condition =
      type === "1"
        ? `WHERE  pr.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK )`
        : type === "2"
        ? `WHERE  pr.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH )`
        : "";

    const completedCondition =
      isComplete === "1"
        ? `AND  pr.isCompleted = TRUE`
        : isComplete === "2"
        ? `AND  pr.isCompleted = FALSE`
        : "";

    const selectQuery = `
    SELECT  pr.id,
		        pr.payment,
		        pr.packVolumn,
		        pr.typeVolumn,
		        pr.unitVolumn,
		        pr.otherRequest,
		        pr.isCompleted,
		        pr.completedAt,
            pr.deliveryNo,
            pr.deliveryCompany
		        DATE_FORMAT(pr.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS orderAt
      FROM  paymentRequest pr
     ${condition}
     ${completedCondition};
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("결제 요청이 없습니다.");
  }
});

router.post("/create", async (req, res, next) => {
  const {
    payment,
    packVolumn,
    typeVolumn,
    unitVolumn,
    otherRequest,
    userId,
    deliveryNo,
    deliveryCompany,
  } = req.body;

  try {
    if (userId) {
      const exUser = await User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("회원이 없습니다.");
      }
    }

    const result = await PaymentRequest.create({
      payment,
      packVolumn,
      typeVolumn,
      unitVolumn,
      otherRequest,
      deliveryNo,
      deliveryCompany,
      UserId: parseInt(userId),
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/isCompleted/:paymentId", async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    if (paymentId) {
      const exPayment = await PaymentRequest.findOne({
        where: {
          id: parseInt(paymentId),
        },
      });

      if (!exPayment) {
        return res.status(400).send("주문이 없습니다.");
      }
    }

    const result = await PaymentRequest.update(
      {
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        where: {
          id: parseInt(paymentId),
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
