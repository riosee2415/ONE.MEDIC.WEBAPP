const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const models = require("../models");
const { PrescriptionPaymentRequest, UseMaterial, User } = require("../models");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { isCondition, type } = req.query;
  try {
    const condition =
      type === "1"
        ? `WHERE  ppr.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK )`
        : type === "2"
        ? `WHERE  ppr.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH )`
        : "";

    const completedCondition =
      isCondition === "1"
        ? `AND  ppr.isCompleted = false 
           AND  ppr.isRefuse = false`
        : isCondition === "2"
        ? `AND  ppr.isCompleted = true
           AND  ppr.isRefuse = false`
        : isCondition === "3"
        ? `AND  ppr.isRefuse = true
           AND  ppr.isCompleted = false`
        : "";

    const selectQuery = `
        SELECT  ppr.id,
                ppr.isCompleted,
		        DATE_FORMAT(ppr.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS completedAt,
		        ppr.isRefuse,
		        ppr.refuseContent,
		        ppr.deliveryCompany,
		        ppr.deliveryNo,
		        DATE_FORMAT(ppr.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS orderAt,
                u.username,
                u.email,
                u.nickname,
                u.mobile,
                u.companyName,
                u.companyNo
          FROM  prescriptionPaymentRequest ppr
          JOIN  users u
            ON  u.id = ppr.UserId
         ${condition}
           ${completedCondition};
        `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { userId, useMaterialData } = req.body;

  if (isNanCheck(userId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  if (!Array.isArray(useMaterialData)) {
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

    const pprResult = await PrescriptionPaymentRequest.create({
      UserId: parseInt(userId),
    });

    await Promise.all(
      useMaterialData.map(
        async (data) =>
          await UseMaterial.create({
            qnt: parseInt(data.qnt),
            unit: data.unit,
            MaterialId: parseInt(data.materialId),
            PrescriptionPaymentRequestId: parseInt(pprResult.id),
          })
      )
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/isCompleted/:pprId", isAdminCheck, async (req, res, next) => {
  const { pprId } = req.params;

  try {
    if (pprId) {
      const exPayment = await PrescriptionPaymentRequest.findOne({
        where: {
          id: parseInt(pprId),
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

    const result = await PrescriptionPaymentRequest.update(
      {
        isCompleted: true,
        completedAt: new Date(),
      },
      {
        where: {
          id: parseInt(pprId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/isRefuse/:pprId", isAdminCheck, async (req, res, next) => {
  const { pprId } = req.params;
  const { refuseContent } = req.body;

  console.log(pprId);

  if (isNanCheck(pprId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  try {
    if (pprId) {
      const exPayment = await PrescriptionPaymentRequest.findOne({
        where: {
          id: parseInt(pprId),
        },
      });

      if (!exPayment) {
        return res.status(400).send("주문이 없습니다.");
      }
    }

    const result = await PrescriptionPaymentRequest.update(
      {
        isRefuse: true,
        refuseContent,
      },
      {
        where: {
          id: parseInt(pprId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/delivery/:pprId", isAdminCheck, async (req, res, next) => {
  const { pprId } = req.params;
  const { deliveryNo, deliveryCompany } = req.body;

  if (isNanCheck(pprId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  try {
    if (pprId) {
      const exPayment = await PrescriptionPaymentRequest.findOne({
        where: {
          id: parseInt(pprId),
        },
      });

      if (!exPayment) {
        return res.status(400).send("주문이 없습니다.");
      }
    }

    const result = await PrescriptionPaymentRequest.update(
      {
        deliveryNo,
        deliveryCompany,
      },
      {
        where: {
          id: parseInt(pprId),
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
