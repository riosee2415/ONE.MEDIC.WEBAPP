const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { AcceptRecord } = require("../models");
const { Op } = require("sequelize");
const models = require("../models");
const isLoggedIn = require("../middlewares/isLoggedIn");

const router = express.Router();

// 배송 정보
router.post("/create/delivery", isLoggedIn, async (req, res, next) => {
  const {
    idItems,
    type,
    receiveUser,
    receiveMobile,
    receiveAddress,
    receiveDetailAddress,
    sendUser,
    sendMobile,
    sendAddress,
    sendDetailAddress,
    deliveryMessage,
  } = req.body;

  if (!Array.isArray(idItems)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  const insertQuery = `
    INSERT  INTO  boughtHistory
    (   
        type,
        receiveUser,
        receiveMobile,
        receiveAddress,
        receiveDetailAddress,
        sendUser,
        sendMobile,
        sendAddress,
        sendDetailAddress,
        deliveryMessage,
        createdAt,
        updatedAt,
        UserId
    )
    VALUES
    (
        ${type},
        '${receiveUser}',
        '${receiveMobile}',
        '${receiveAddress}',
        '${receiveDetailAddress}',
        '${sendUser}',
        '${sendMobile}',
        '${sendAddress}',
        '${sendDetailAddress}',
        '${deliveryMessage}',
        NOW(),
        NOW(),
        ${req.user.id}
    )
    `;

  try {
    const insertResult = await models.sequelize.query(insertQuery);

    if (type === 1) {
      // 약속처방
      await Promise.all(
        idItems.map(async (data) => {
          const updateQuery = `
          UPDATE  wishPaymentContainer
             SET  BoughtHistoryId = ${insertResult[0].insertId}
           WHERE  id = ${data}
          `;

          const updateResult = await models.sequelize.query(updateQuery);
        })
      );
    } else {
      // 탕전처방
      await Promise.all(
        idItems.map(async (data) => {
          const updateQuery = `
          UPDATE  wishPrescriptionItem
             SET  BoughtHistoryId = ${insertResult[0].insertId}
           WHERE  id = ${data}
          `;

          const updateResult = await models.sequelize.query(updateQuery);
        })
      );
    }

    return res.status(200).json({ result: true, id: insertResult[0].insertId });
  } catch (e) {
    console.error(e);
    return res.status(401).send("배송정보를 등록할수 없습니다.");
  }
});

// 결제 정보
router.post("/create/isPay", isLoggedIn, async (req, res, next) => {
  const {
    id,
    type,
    isMonth,
    isPay,
    payInfo,
    totalPrice,
    pharmacyPrice,
    tangjeonPrice,
    deliveryPrice,
    impUid,
    merchantUid,
  } = req.body;

  const updateQuery = `
  UPDATE  boughtHistory
     SET  isMonth = ${isMonth},
          isPay = ${isPay},
          payInfo = '${payInfo}',
          totalPrice = ${totalPrice},
          pharmacyPrice = ${pharmacyPrice},
          tangjeonPrice = ${tangjeonPrice},
          deliveryPrice = ${deliveryPrice},
          impUid = '${impUid}',
          merchantUid = '${merchantUid}'
   WHERE  id = ${id}
  `;

  try {
    const updateResult = await models.sequelize.query(updateQuery);

    if (type === 2) {
      const selectQuery = `
      SELECT  B.id
        FROM  boughtHistory             A
       INNER
        JOIN  wishPrescriptionItem      B
          ON  A.id = B.BoughtHistoryId
       WHERE  id = ${id}
      `;
      const selectResult = await models.sequelize.query(selectQuery);

      if (selectResult[0][0]) {
        const materialQuery = `
        SELECT  A.materialId,
                A.qnt,
                B.stock       
          FROM  wishMaterialsItem       A
         INNER
          JOIN  materials               B
            ON  A.materialId = B.id
         WHERE  wishPrescriptionItemId = ${selectResult[0][0].id}
        `;

        const materialResult = await models.sequelize.query(materialQuery);

        for (let i = 0; i < materialResult[0].length; i++) {
          const updateQuery = `
            UPDATE  materials
               SET  stock = ${
                 materialResult[0][i].stock - materialResult[0][i].qnt
               }
             WHERE  id = ${materialResult[0][i].materialId}
            `;
        }
      }
    }

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("구매할 수 업습니다.");
  }
});

// 상세정보
router.post("/detail", isLoggedIn, async (req, res, next) => {
  const { id } = req.body;

  const detailQuery = `
  SELECT  A.id,
          A.receiveUser,
          A.receiveMobile,
          A.receiveAddress,
          A.receiveDetailAddress,
          A.sendUser,
          A.sendMobile,
          A.sendAddress,
          A.sendDetailAddress,
          A.deliveryMessage,
          A.pharmacyPrice,
          A.tangjeonPrice,
          A.deliveryPrice,
          B.id				wishPaymentId,
          C.id				wishPreId
    FROM  boughtHistory   A
    LEFT
   OUTER
    JOIN  wishPaymentContainer B
      ON  B.BoughtHistoryId = A.id
    LEFT
   OUTER
    JOIN  wishPrescriptionItem C
      ON  C.BoughtHistoryId = A.id
   WHERE  A.id = ${id};
    `;

  try {
    const detailResult = await models.sequelize.query(detailQuery);

    return res.status(200).json(detailResult[0][0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("상세정보를 불러올수 없습니다.");
  }
});

// 리스트
router.post("/list", isLoggedIn, async (req, res, next) => {
  const listQuery = `
    SELECT  id,
		        CASE 
		        	WHEN    type = 1 THEN '약속처방'
		        	ELSE    '탕전처방'
		        END											AS viewType,
		        type,
		        CASE 
		        	WHEN	type = 1 
		        	THEN	(
		        				SELECT  B.productname
		        				  FROM  wishPaymentContainer B
		        				 WHERE  A.id = B.BoughtHistoryId
		        			)
		        	WHEN    type = 2
		        	THEN	(
		        				SELECT  B.title
		        				  FROM  wishPrescriptionItem B
		        				 WHERE  A.id = B.BoughtHistoryId
		        			)
		        END											AS title,
		        isRefuse,
		        refuseContent
		        isCompleted,
		        isNobank,
		        isMonth,
		        isPay,
		        deliveryCompany,
		        deliveryNo,
		        receiveUser,
		        receiveMobile,
		        receiveAddress,
		        receiveDetailAddress,
		        sendUser,
		        sendMobile,
		        sendAddress,
		        sendDetailAddress,
		        deliveryMessage,
		        payInfo,
		        totalPrice,
		        pharmacyPrice,
		        tangjeonPrice,
		        deliveryPrice,
		        CASE
                WHEN	payInfo = 'card' THEN "신용카드"
                WHEN	payInfo = 'phone' THEN "휴대폰 결제"
                WHEN	payInfo = 'nobank' THEN "무통장입금"
                WHEN	payInfo = 'simpleCard' THEN "간편 카드 결제"
                WHEN	payInfo = 'trans' THEN "계좌 간편 결제"
                ELSE	payInfo
            END	                                                    AS viewPayInfo,
            CASE
                WHEN	deliveryStatus = 0 AND isPay = 1 THEN "결제 승인"
                WHEN	deliveryStatus = 0 AND isPay = 0 AND payInfo = "nobank" THEN "입금 대기"
                WHEN	deliveryStatus = 0 AND isPay = 0 THEN "결제 미승인"
                WHEN	deliveryStatus = 1 THEN "배송 준비중"
                WHEN	deliveryStatus = 2 THEN "집화 완료"
                WHEN	deliveryStatus = 3 THEN "배송 중"
                WHEN	deliveryStatus = 4 THEN "지점 도착"
                WHEN	deliveryStatus = 5 THEN "배송 출발"
                WHEN	deliveryStatus = 6 THEN "배송 완료"
               	ELSE	deliveryStatus
            END	                                                    AS viewDeliveryStatus,
            DATE_FORMAT(createdAt, '%Y년 %m월 %d일')		AS viewCreatedAt
      FROM  boughtHistory   A
     WHERE  UserId = ${req.user.id}
    `;

  try {
    const listResult = await models.sequelize.query(listQuery);

    return res.status(200).json(listResult[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("주문목록을 불러올 수 없습니다.");
  }
});

module.exports = router;
