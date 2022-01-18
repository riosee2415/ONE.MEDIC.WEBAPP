const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");
const {
  PaymentRequest,
  User,
  PaymentRequestMaterial,
  Materials,
  MaterialsHistory,
} = require("../models");

const router = express.Router();

router.get("/list/:type", async (req, res, next) => {
  const { type } = req.params;

  try {
    const condition =
      type === "1"
        ? `AND  A.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK );`
        : type === "2"
        ? `AND  A.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH );`
        : "";

    const selectQuery = `
    SELECT	 A.id,
            FORMAT(A.totalPayment, 0)							                AS totalPayment,
            A.chup,
            A.pack,
            FORMAT(A.packVolumn, 0)								                AS packVolumn,
            FORMAT(A.totalVolumn, 0) 							                AS totalVolumn,
            DATE_FORMAT(A.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS orderAt,
		        U.username                                             AS questUserName,
		        U.nickname                                             AS questUserNickName,
		        U.email                                                AS questUserEmail,
		        U.mobile                                               AS questUserMobile,
            B.MaterialId
      FROM  paymentRequest					                                A
      JOIN  paymentRequestMaterial 		                            B
        ON  A.id = B.id
      JOIN  materials	                                            M
        ON  B.MaterialId = M.id
      JOIN  users                                                  U 
        ON  A.UserId = U.id
     WHERE  NOT A.totalPayment IS NULL
     ${condition}
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("결제 요청이 없습니다.");
  }
});

// 결재 요청 생성 (total payment X)
router.post("/create", async (req, res, next) => {
  const { userId, chup, pack, packVolumn, totalVolumn } = req.body;

  try {
    if (userId) {
      const exUser = await User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
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

// 걸재 요청 생성 후 결제 요청 재료 생성
// 프론트에서 promiss 로 배열돌려 생성
router.post("/prm/create", async (req, res, next) => {
  const { paymentRequestId, materialId, qnt, unit, payment } = req.body;

  try {
    if (paymentRequestId) {
      const exPayment = await PaymentRequest.findOne({
        where: {
          id: parseInt(paymentRequestId),
        },
      });

      if (!exPayment) {
        return res.status(400).send("존재하지 않는 결재요청입니다.");
      }
    }

    if (materialId) {
      const exMaterial = await Materials.findOne({
        where: {
          id: parseInt(materialId),
        },
      });

      if (!exMaterial) {
        return res.status(400).send("존재하지 않는 재료입니다.");
      } else {
        const materialHistoryReault = await MaterialsHistory.create({
          materialName: exMaterial.name,
          useQnt: qnt,
        });
      }
    }

    const materialResult = await PaymentRequestMaterial.create({
      PaymentRequestId: parseInt(paymentRequestId),
      MaterialId: parseInt(materialId),
      qnt,
      unit,
      payment,
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청 입니다.");
  }
});

router.patch("/totalPayment/update", async (req, res, next) => {
  const { totalPayment, paymentRequestId } = req.body;

  try {
    const paymentResult = await PaymentRequest.update(
      {
        totalPayment,
      },
      {
        where: {
          id: parseInt(paymentRequestId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청 입니다.");
  }
});

module.exports = router;
