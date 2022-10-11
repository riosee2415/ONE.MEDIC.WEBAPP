const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const models = require("../models");
const axios = require("axios");
const {
  PrescriptionPaymentRequest,
  UseMaterial,
  User,
  Materials,
  MaterialsHistory,
} = require("../models");

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
                ppr.name,
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
                u.companyNo,
                CASE
                  WHEN	ppr.payInfo = 'card' THEN "신용카드"
                  WHEN	ppr.payInfo = 'phone' THEN "휴대폰 결제"
                  WHEN	ppr.payInfo = 'nobank' THEN "무통장입금"
                  WHEN	ppr.payInfo = 'simpleCard' THEN "간편 카드 결제"
                  WHEN	ppr.payInfo = 'trans' THEN "계좌 간편 결제"
                  ELSE	ppr.payInfo
                END	                                                    AS viewPayInfo,
                CASE
                  WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 1 THEN "결제 승인"
                  WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 0 AND ppr.payInfo = "nobank" THEN "입금 대기"
                  WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 0 THEN "결제 미승인"
                  WHEN	ppr.deliveryStatus = 1 THEN "배송 준비중"
                  WHEN	ppr.deliveryStatus = 2 THEN "집화 완료"
                  WHEN	ppr.deliveryStatus = 3 THEN "배송 중"
                  WHEN	ppr.deliveryStatus = 4 THEN "지점 도착"
                  WHEN	ppr.deliveryStatus = 5 THEN "배송 출발"
                  WHEN	ppr.deliveryStatus = 6 THEN "배송 완료"
                  ELSE	ppr.deliveryStatus
                END	                                                    AS viewDeliveryStatus
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
  SELECT  id,
          deliveryNo,
          deliveryCompany
    FROM  prescriptionPaymentRequest
   WHERE  id = ${pprId}
  `;

  const pprQuery = `
  SELECT  ppr.id,
          ppr.name,
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
          CASE
              WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 1 THEN "결제 완료"
              WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 0 AND ppr.payInfo = "nobank" THEN "입금 대기"
              WHEN	ppr.deliveryStatus = 0 AND ppr.isCompleted = 0 THEN "결제 미승인"
              WHEN	ppr.deliveryStatus = 1 THEN "배송 준비중"
              WHEN	ppr.deliveryStatus = 2 THEN "집화 완료"
              WHEN	ppr.deliveryStatus = 3 THEN "배송 중"
              WHEN	ppr.deliveryStatus = 4 THEN "지점 도착"
              WHEN	ppr.deliveryStatus = 5 THEN "배송 출발"
              WHEN	ppr.deliveryStatus = 6 THEN "배송 완료"
              ELSE	ppr.deliveryStatus
          END	                                                       AS viewDeliveryStatus,
          ppr.createdAt,
          ppr.payInfo,
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
          CONCAT(FORMAT(um.buyPrice * um.qnt, 0), '원')                      AS viewBuyPrice,
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

    if (findResult[0][0].deliveryNo !== null) {
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
    }

    const pprDatum = await models.sequelize.query(pprQuery);
    const materialDatum = await models.sequelize.query(materialQuery);

    return res.status(200).json({
      ...pprDatum[0][0],
      materialDatum: materialDatum[0].map((data) => data),
    });
  } catch (e) {
    console.error(e);
    return res.status(400).send("주문 상세정보를 불러올 수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { useMaterialData, totalPrice, name } = req.body;

  if (!Array.isArray(useMaterialData)) {
    return res.status(400).send("잘못된 요청입니다.");
  }
  try {
    const materialAllQuery = `
    SELECT  id,
            name,
            stock
      FROM  materials
     WHERE  isDelete = false
    `;

    const materialSelect = await models.sequelize.query(materialAllQuery);

    for (let i = 0; i < useMaterialData.length; i++) {
      const masterialFind = materialSelect[0].find(
        (data) => data.id === useMaterialData[i].id
      );

      if (masterialFind.stock < useMaterialData[i].qnt) {
        return res
          .status(400)
          .send(`${masterialFind.name}의 재고가 부족합니다.`);
      }
    }

    const pprResult = await PrescriptionPaymentRequest.create({
      name,
      UserId: req.user.id,
      totalPrice,
    });

    await Promise.all(
      useMaterialData.map(async (data) => {
        await UseMaterial.create({
          name: data.name,
          qnt: parseInt(data.qnt),
          unit: data.unit,
          buyPrice: parseInt(data.price),
          MaterialId: parseInt(data.id),
          PrescriptionPaymentRequestId: parseInt(pprResult.id),
        });
      })
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

  try {
    const result = await PrescriptionPaymentRequest.update(
      {
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

router.patch("/isPayment/:pprId", isLoggedIn, async (req, res, next) => {
  const { pprId } = req.params;
  const { isCard, totalPrice, payInfo, userPayinfo } = req.body;

  try {
    const currentUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
      },
    });

    const currentPayment = await PrescriptionPaymentRequest.findOne({
      where: {
        id: parseInt(pprId),
      },
    });

    // 사용할 재료 ////////////
    const currentMaterial = await UseMaterial.findAll({
      where: {
        PrescriptionPaymentRequestId: pprId,
      },
    });
    ////////////////////////

    const _payinfo = payInfo ? payInfo : "";

    await User.update(
      {
        payInfo: userPayinfo,
      },
      {
        where: { id: req.user.id },
      }
    );

    if (isCard === "1") {
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: process.env.IMP_KEY, // REST API 키
          imp_secret: process.env.IMP_SECRET, // REST API Secret
        },
      });
      const { access_token } = getToken.data.response; // 인증 토큰

      d = new Date();
      year = d.getFullYear() + "";
      month = d.getMonth() + 1 + "";
      date = d.getDate() + "";
      hour = d.getHours() + "";
      min = d.getMinutes() + "";
      sec = d.getSeconds() + "";
      mSec = d.getMilliseconds() + "";
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      mSec = mSec < 10 ? "0" + mSec : mSec;
      let orderPK = "ORD" + year + month + date + hour + min + sec + mSec;

      const paymentResult = await axios({
        url: `https://api.iamport.kr/subscribe/payments/again`,
        method: "post",
        headers: { Authorization: access_token }, // 인증 토큰을 Authorization header에 추가
        data: {
          customer_uid: currentUser.userCode,
          merchant_uid: orderPK, // 새로 생성한 결제(재결제)용 주문 번호
          amount: totalPrice,
          name,
          buyer_name: currentUser.nickname,
          buyer_tel: currentUser.mobile.replace(
            /^(\d{2,3})(\d{3,4})(\d{4})$/,
            `$1-$2-$3`
          ),
          buyer_email: currentUser.email,
          buyer_addr: currentPayment.receiveAddress,
          buyer_postcode: currentPayment.receiveAddress.substring(
            currentPayment.receiveAddress.length - 6,
            currentPayment.receiveAddress.length - 1
          ),
        },
      });

      const { code, message } = paymentResult.data;

      if (code === 0) {
        // 결제 완료
        const pprUpdateQuery = `
        UPDATE  prescriptionPaymentRequest SET 
		            payInfo = '${_payinfo}',
		            isPayment = TRUE,
		            isNobank = TRUE
         WHERE  id = ${parseInt(pprId)}
        `;

        const pprUpdate = await models.sequelize.query(pprUpdateQuery);

        // 재료 조회
        const materialInfoQuery = `
        SELECT	id,
                name,
                stock,
                unit
          FROM  materials m
         WHERE  id IN (${currentMaterial.map((data) => data.id)})
        `;

        const materialInfo = await models.sequelize.query(materialInfoQuery);

        // 재료 재고 차감
        for (let i = 0; i < currentMaterial.length; i++) {
          const result = materialInfo[0].find(
            (data) => data.id === currentMaterial[i].MaterialId
          );

          // 재료 사용 기록 생성

          const materialHistoryCreateQeury = `
          INSERT INTO  materialsHistory 
            (
            	useQnt, 
            	useUnit, 
            	materialName, 
            	createdAt, 
            	updatedAt
            ) VALUES (
            	${currentMaterial[i].qnt}, 
            	'${currentMaterial[i].unit}', 
            	'${currentMaterial[i].name}', 
            	NOW(), 
            	NOW()
            )
          `;

          const materialHistoryCreate = await models.sequelize.query(
            materialHistoryCreateQeury
          );

          // 재료 차감
          const materialStockUpdateQuery = `
          UPDATE  materials 
             SET  stock = ${result.qnt - currentMaterial[i].qnt}
           WHERE  id = ${currentMaterial[i].MaterialId}
       
          `;

          const materialStockUpdate = await models.sequelize.query(
            materialStockUpdateQuery
          );
        }

        return res.status(200).json({ result: true, pprId: result.id });
      } else {
        return res.status(401).send(message);
      }
    } else {
      // 결제 완료
      const pprUpdateQuery = `
      UPDATE  prescriptionPaymentRequest SET 
		          payInfo = '${_payinfo}',
		          isPayment = TRUE,
		          isNobank = ${_payinfo === "nobank" ? "FALSE" : "TRUE"}
       WHERE  id = ${parseInt(pprId)}
      `;

      const pprUpdate = await models.sequelize.query(pprUpdateQuery);

      let materialIdArr = [];

      await Promise.all(
        currentMaterial.map((data) => materialIdArr.push(data.MaterialId))
      );

      // 재료 조회
      const materialInfoQuery = `
      SELECT	id,
              name,
              stock,
              unit
        FROM  materials m
       WHERE  id IN (${materialIdArr})
      `;

      const materialInfo = await models.sequelize.query(materialInfoQuery);

      // 재료 재고 차감
      for (let i = 0; i < currentMaterial.length; i++) {
        const result = materialInfo[0].find(
          (data) => data.id === currentMaterial[i].MaterialId
        );

        // 재료 사용 기록 생성
        const materialHistoryCreateQeury = `
        INSERT INTO  materialsHistory 
          (
            useQnt, 
            useUnit, 
            materialName, 
            createdAt, 
            updatedAt
          ) VALUES (
            ${currentMaterial[i].qnt}, 
            '${currentMaterial[i].unit}', 
            '${currentMaterial[i].name}', 
            NOW(), 
            NOW()
          )
        `;

        const materialHistoryCreate = await models.sequelize.query(
          materialHistoryCreateQeury
        );

        // 재료 차감
        const materialStockUpdateQuery = `
        UPDATE  materials 
           SET  stock = ${result.stock - currentMaterial[i].qnt}
         WHERE  id = ${currentMaterial[i].MaterialId}
     
        `;

        const materialStockUpdate = await models.sequelize.query(
          materialStockUpdateQuery
        );
      }

      return res.status(200).json({ result: true });
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/allDeliveryUpdate", isAdminCheck, async (req, res, next) => {
  const allPrePaymentQuery = `
  SELECT  id,
          deliveryNo,
          deliveryCompany
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
