const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const models = require("../models");
const { PaymentRequest, User, Payment } = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { isComplete, type } = req.query;

  try {
    const condition =
      type === "1"
        ? `WHERE  pr.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK )`
        : type === "2"
        ? `WHERE  pr.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH )`
        : "";

    const completedCondition =
      isComplete === "1"
        ? `AND  pr.isCompleted = false`
        : isComplete === "2"
        ? `AND  pr.isCompleted = true`
        : "";

    const selectQuery = `
    SELECT  pr.id,
		        pr.payment,
		        pr.packVolumn,
		        pr.typeVolumn,
		        pr.unitVolumn,
		        pr.otherRequest,
		        pr.completedAt,
            pr.deliveryNo,
            pr.deliveryCompany,
		        DATE_FORMAT(pr.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS completedAt,
		        DATE_FORMAT(pr.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
            u.username,
		        u.email,
		        u.mobile,
		        u.nickname,
		        companyName,
		        companyNo
      FROM  paymentRequest pr
      JOIN  users u
        ON  u.id = pr.UserId
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

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { userId, paymentRequestDatum } = req.body;

  if (isNanCheck(userId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  if (!Array.isArray(paymentRequestDatum)) {
    return res.status(400).send("잘못된 요청입니다.");
  }

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

    const result = await Payment.create({
      UserId: parseInt(userId),
    });

    await Promise.all(
      paymentRequestDatum.map(
        async (data) =>
          await PaymentRequest.create({
            payment: data.payment,
            packVolumn: data.packVolumn,
            typeVolumn: data.typeVolumn,
            unitVolumn: data.unitVolumn,
            otherRequest: data.otherRequest,
            PaymentId: result.id,
          })
      )
    );

    return res.status(200).json({ result: true, paymentId: result.id });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/delivery/update", async (req, res, next) => {
  const { deliveryCompany, deliveryNo, paymentId } = req.body;

  try {
    const result = await PaymentRequest.update(
      {
        deliveryCompany,
        deliveryNo,
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

router.patch(
  "/isCompleted/:paymentId",
  isAdminCheck,
  async (req, res, next) => {
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
        } else {
          if (!exPayment.deliveryNo) {
            return res.status(400).send("배송정보를 등록해주세요.");
          }
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
  }
);

router.patch("/delivery/:paymentId", isAdminCheck, async (req, res, next) => {
  const { paymentId } = req.params;
  const { deliveryNo, deliveryCompany } = req.body;

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
        deliveryNo,
        deliveryCompany,
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

router.get("/detail/:paymentId", async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    const result = await Payment.findOne({
      where: {
        id: parseInt(paymentId),
      },
      include: [
        {
          model: PaymentRequest,
        },
      ],
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

module.exports = router;
