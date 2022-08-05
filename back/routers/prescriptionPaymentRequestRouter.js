const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const models = require("../models");
const axios = require("axios");
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

router.post("/detail", isLoggedIn, async (req, res, next) => {
  const { pprId } = req.body;

  const findPprDataQuery = `
  SELECT  *
    FROM  prescriptionPaymentRequest
   WHERE  id = ${pprId}
  `;

  const pprQuery = `
  SELECT  ppr.id,
          ppr.completedAt,
          ppr.deliveryNo,
          ppr.receiveUser,
          ppr.receiveMobile,
          ppr.receiveAddress,
          ppr.receiveDetailAddress,
          ppr.sendUser,
          ppr.sendMobile,
          ppr.sendAddress,
          ppr.sendDetailAddress,
          ppr.deliveryCompany,
          DATE_FORMAT(ppr.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS completedAt,
          DATE_FORMAT(ppr.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
          ppr.createdAt,
          u.username,
          u.email,
          u.mobile,
          u.nickname,
          u.companyName,
          u.companyNo,
          ppr.totalPrice,
          FORMAT(ppr.totalPrice, 0)			                  					AS viewTotalPrice
    FROM  prescriptionPaymentRequest                                ppr
    JOIN  users                                                     u
      ON  u.id = ppr.UserId
   WHERE  1 = 1
     AND  ppr.id = ${pprId}
   ORDER  BY  ppr.createdAt DESC
  `;

  const materialQuery = `
  SELECT  um.id,
		      um.name,
		      um.buyPrice,
		      um.qnt,
		      um.unit,
		      um.PrescriptionPaymentRequestId,
		      um.MaterialId
    FROM  useMaterial um
   WHERE  1 = 1
     AND  um.PrescriptionPaymentRequestId = ${pprId}
  `;

  try {
    const findResult = await models.sequelize.query(findPprDataQuery);

    let newCom = "";

    if (findResult[0][0].deliveryCompany === "CJ대한통운") {
      newCom = "04";
    } else if (findResult[0][0].deliveryCompany === "한진택배") {
      newCom = "05";
    } else if (findResult[0][0].deliveryCompany === "로젠택배") {
      newCom = "06";
    } else if (findResult[0][0].deliveryCompany === "롯데택배") {
      newCom = "08";
    } else if (findResult[0][0].deliveryCompany === "경동택배") {
      newCom = "23";
    }

    const value = await axios({
      url: `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${process.env.SWEET_TRACKER_KEY}&t_code=${newCom}&t_invoice=${findResult[0][0].deliveryNo}`,
      method: "get",
    });

    if (!value.data.level) {
      return res.status(401).send(`${value.data.msg}`);
    }

    const updateQuery = `
    UPDATE  prescriptionPaymentRequest
       SET  deliveryStatus = ${value.data.level},
            updatedAt = now()
     WHERE  id = ${pprId}
    `;

    const deliveryResult = await models.sequelize.query(updateQuery);

    const pprDatum = await models.sequelize.query(pprQuery);
    const materialDatum = await models.sequelize.query(materialQuery);

    return res.status(200).json({ ...pprDatum[0][0], materialDatum });
  } catch (e) {
    console.error(e);
    return res.status(400).send("주문 상세정보를 불러올 수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { useMaterialData, totalPrice } = req.body;

  if (!Array.isArray(useMaterialData)) {
    return res.status(400).send("잘못된 요청입니다.");
  }
  try {
    const pprResult = await PrescriptionPaymentRequest.create({
      UserId: req.user.id,
      totalPrice,
    });

    await Promise.all(
      useMaterialData.map(
        async (data) =>
          await UseMaterial.create({
            name: data.name,
            qnt: parseInt(data.qnt),
            unit: data.unit,
            buyPrice: parseInt(data.price),
            MaterialId: parseInt(data.id),
            PrescriptionPaymentRequestId: parseInt(pprResult.id),
          })
      )
    );

    return res.status(200).json({ result: true, pprId: pprResult.id });
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

router.patch("/address/update", isLoggedIn, async (req, res, next) => {
  const {
    id,
    receiveUser,
    receiveMobile,
    receiveAddress,
    receiveDetailAddress,
    sendUser,
    sendMobile,
    sendAddress,
    sendDetailAddress,
    deliveryMessage,
    deliveryRequest,
  } = req.body;

  const udpateQuery = `
    UPDATE  prescriptionPaymentRequest 
       SET  receiveUser = ${receiveUser},
		        receiveMobile = ${receiveMobile},
		        receiveAddress = ${receiveAddress},
		        receiveDetailAddress = ${receiveDetailAddress},
		        sendUser = ${sendUser},
		        sendMobile = ${sendMobile},
		        sendAddress = ${sendAddress},
		        sendDetailAddress = ${sendDetailAddress},
		        deliveryMessage = ${deliveryMessage},
		        deliveryRequest = ${deliveryRequest}
     WHERE  id = ${id};
    `;

  try {
    const result = await models.sequelize.query(udpateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("배송정보를 저장할수 없습니다.");
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

    let newCom = "";

    if (deliveryCompany === "CJ대한통운") {
      newCom = "04";
    } else if (deliveryCompany === "한진택배") {
      newCom = "05";
    } else if (deliveryCompany === "로젠택배") {
      newCom = "06";
    } else if (deliveryCompany === "롯데택배") {
      newCom = "08";
    } else if (deliveryCompany === "경동택배") {
      newCom = "23";
    }

    const value = await axios({
      url: `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${process.env.SWEET_TRACKER_KEY}&t_code=${newCom}&t_invoice=${deliveryNo}`,
      method: "get",
    });

    if (!value.data.level) {
      return res.status(401).send(`${value.data.msg}`);
    }

    const result = await PrescriptionPaymentRequest.update(
      {
        deliveryNo,
        deliveryCompany,
        deliveryStatus: value.data.level,
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

router.patch("/isPayment/:paymentId", isLoggedIn, async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    const result = await PrescriptionPaymentRequest.update(
      {
        isPayment: true,
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

router.post("/allDeliveryUpdate", isAdminCheck, async (req, res, next) => {
  const allPrePaymentQuery = `
  SELECT  *
    FROM  prescriptionPaymentRequest
   WHERE  deliveryStatus != 6
     AND	deliveryNo IS NOT NULL
     AND	deliveryCompany IS NOT NULL
  `;
  try {
    const pprePayments = await models.sequelize.query(allPrePaymentQuery);

    if (pprePayments[0].length === 0) {
      return res.status(401).send("조회할 데이터가 존재하지 않습니다.");
    }

    Promise.all(
      pprePayments[0].map(async (item) => {
        let newCom = "";

        if (item.deliveryCompany === "CJ대한통운") {
          newCom = "04";
        } else if (item.deliveryCompany === "한진택배") {
          newCom = "05";
        } else if (item.deliveryCompany === "로젠택배") {
          newCom = "06";
        } else if (item.deliveryCompany === "롯데택배") {
          newCom = "08";
        } else if (item.deliveryCompany === "경동택배") {
          newCom = "23";
        }

        const value = await axios({
          url: `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${process.env.SWEET_TRACKER_KEY}&t_code=${newCom}&t_invoice=${item.deliveryNo}`,
          method: "get",
        });

        if (!value.data.level) {
          return res.status(401).send(`${value.data.msg}`);
        }

        const updateQuery = `
        UPDATE  prescriptionPaymentRequest
           SET  deliveryStatus = ${value.data.level},
                updatedAt = now()
         WHERE  id = ${item.id}
        `;

        const updateResult = await models.sequelize.query(updateQuery);
      })
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("배송정보를 조회할 수 없습니다.");
  }
});

module.exports = router;
