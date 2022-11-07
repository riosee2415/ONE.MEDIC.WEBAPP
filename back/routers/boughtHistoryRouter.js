const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const { AcceptRecord } = require("../models");
const { Op } = require("sequelize");
const models = require("../models");
const isLoggedIn = require("../middlewares/isLoggedIn");
const axios = require("axios");

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
          isPay = ${payInfo === "nobank" ? 0 : isPay},
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
      SELECT  id
        FROM  wishPrescriptionItem
       WHERE  BoughtHistoryId = ${id}
      `;
      const selectResult = await models.sequelize.query(selectQuery);

      if (selectResult[0][0]) {
        for (let v = 0; v < selectResult[0].length; v++) {
          const materialQuery = `
          SELECT  A.materialId,
                  A.qnt,
                  B.stock,
                  ROUND(B.stock - A.qnt, 2)       AS  leftStock
            FROM  wishMaterialsItem       A
           INNER
            JOIN  materials               B
              ON  A.materialId = B.id
           WHERE  wishPrescriptionItemId = ${selectResult[0][v].id}
          `;

          const materialResult = await models.sequelize.query(materialQuery);

          console.log("1", selectResult[0][v]);
          for (let i = 0; i < materialResult[0].length; i++) {
            console.log("2", materialResult[0][i]);
            console.log(
              "3",
              Math.round(
                materialResult[0][i].stock - materialResult[0][i].qnt * 100
              ) / 100
            );
            const updateQuery = `
              UPDATE  materials
                 SET  stock = ${materialResult[0][i].leftStock}
               WHERE  id = ${materialResult[0][i].materialId}
              `;

            const updateResult = await models.sequelize.query(updateQuery);
          }
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
          A.type,
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
          A.totalPrice,
          A.deliveryCompany,
          A.deliveryNo,
          CASE
                WHEN	A.payInfo = 'card' THEN "신용카드"
                WHEN	A.payInfo = 'phone' THEN "휴대폰 결제"
                WHEN	A.payInfo = 'nobank' THEN "무통장입금"
                WHEN	A.payInfo = 'simpleCard' THEN "간편 카드 결제"
                WHEN	A.payInfo = 'trans' THEN "계좌 간편 결제"
                ELSE	A.payInfo
            END	                                                   AS viewPayInfo,
          CONCAT(FORMAT(A.totalPrice, 0), '원')                     AS viewTotalPrice,
          CONCAT(FORMAT(A.pharmacyPrice, 0), '원')                  AS viewPharmacyPrice,
          CONCAT(FORMAT(A.tangjeonPrice, 0), '원')                  AS viewTangjeonPrice,
          CONCAT(FORMAT(A.deliveryPrice, 0), '원')                  AS viewDeliveryPrice,
          DATE_FORMAT(A.createdAt, '%Y년 %m월 %d일')		             AS viewCreatedAt,
          CASE
                WHEN	A.isRefuse = 1 THEN "거절"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 1 THEN "결제 승인"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 0 AND A.payInfo = "nobank" THEN "입금 대기"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 0 THEN "결제 진행"
                WHEN	A.deliveryStatus = 1 THEN "배송 준비중"
                WHEN	A.deliveryStatus = 2 THEN "집화 완료"
                WHEN	A.deliveryStatus = 3 THEN "배송 중"
                WHEN	A.deliveryStatus = 4 THEN "지점 도착"
                WHEN	A.deliveryStatus = 5 THEN "배송 출발"
                WHEN	A.deliveryStatus = 6 THEN "배송 완료"
               	ELSE	A.deliveryStatus
          END	                                                    AS viewDeliveryStatus
    FROM  boughtHistory   A
   WHERE  A.id = ${id}
    `;

  // 약속처방
  const paymentDetailQuery = `
    SELECT  id,
            productname         AS title,
            medication,
            receiverName,
            content
      FROM  wishPaymentContainer
     WHERE  BoughtHistoryId = ${id}
    `;

  const paymentItemDetailQuery = `
    SELECT  A.id,
            A.price,
            A.pack,
            A.type,
            A.unit,
            A.qnt,
            CONCAT(FORMAT(A.price, 0), '원')    AS viewPrice,
            A.WishPaymentContainerId,
            CONCAT(FORMAT(ROUND(A.price * A.qnt), 0), "원")             AS viewTotalPrice,
            ROUND(A.price * A.qnt)                   AS totalPrice
      FROM  wishPaymentItem           A
     INNER
      JOIN  wishPaymentContainer      B
        ON  B.id = A.WishPaymentContainerId
     WHERE  B.BoughtHistoryId = ${id}
    `;

  // 탕전처방
  const preDetailQuery = `
    SELECT  id,
            title,
            cheob,
            pack,
            unit,
            packPrice,
            CONCAT(FORMAT(packPrice, 0), '원')    AS viewPackPrice,
            medication,
            receiverName,
            content
      FROM  wishPrescriptionItem
     WHERE  BoughtHistoryId = ${id}
    `;

  const preItemDetailQuery = `
    SELECT  A.id,
            A.name,
            A.price,
            A.qnt,
            A.unit,
            CONCAT(FORMAT(A.price, 0), '원')    AS viewPrice,
            A.WishPrescriptionItemId,
            CONCAT(FORMAT(ROUND(A.price * A.qnt * 100), 0), "원")             AS viewTotalPrice,
            ROUND(A.price * A.qnt * 100)                   AS totalPrice
      FROM  wishMaterialsItem           A
     INNER
      JOIN  wishPrescriptionItem      B
        ON  B.id = A.WishPrescriptionItemId
     WHERE  B.BoughtHistoryId = ${id}
    `;

  try {
    const detailResult = await models.sequelize.query(detailQuery);

    if (detailResult[0][0].type === 1) {
      const paymentDetailResult = await models.sequelize.query(
        paymentDetailQuery
      );
      const paymentItemDetailResult = await models.sequelize.query(
        paymentItemDetailQuery
      );
      return res.status(200).json({
        ...detailResult[0][0],
        lists: paymentDetailResult[0],
        items: paymentItemDetailResult[0],
      });
    } else if (detailResult[0][0].type === 2) {
      const preDetailResult = await models.sequelize.query(preDetailQuery);
      const preItemDetailResult = await models.sequelize.query(
        preItemDetailQuery
      );
      return res.status(200).json({
        ...detailResult[0][0],
        lists: preDetailResult[0],
        items: preItemDetailResult[0],
      });
    } else {
      return res.status(401).send("상세정보를 불러올 수 없습니다.");
    }
  } catch (e) {
    console.error(e);
    return res.status(401).send("상세정보를 불러올 수 없습니다.");
  }
});

// 리스트
router.post("/list", isLoggedIn, async (req, res, next) => {
  const { startDate, endDate, productName } = req.body;

  const _startDate = startDate || null;
  const _endDate = endDate || null;
  const _productName = productName || "";

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
                     LIMIT  1
		        			)
		        	WHEN    type = 2
		        	THEN	(
		        				SELECT  B.title
		        				  FROM  wishPrescriptionItem B
		        				 WHERE  A.id = B.BoughtHistoryId
                     LIMIT  1
		        			)
		        END											AS title,
		        CASE 
		        	WHEN	type = 1 
		        	THEN	(
		        				SELECT  B.paymentId
		        				  FROM  wishPaymentContainer B
		        				 WHERE  A.id = B.BoughtHistoryId
                     LIMIT  1
		        			)
					    ELSE	NULL
		        END											AS paymentId,
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
                WHEN	isRefuse = 1 THEN "거절"
                WHEN	deliveryStatus = 0 AND isPay = 1 THEN "결제 승인"
                WHEN	deliveryStatus = 0 AND isPay = 0 AND payInfo = "nobank" THEN "입금 대기"
                WHEN	deliveryStatus = 0 AND isPay = 0 THEN "결제 진행"
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
       AND  (
            SELECT  CASE 
                       WHEN	type = 1 
                       THEN	(
                             SELECT  B.productname
                               FROM  wishPaymentContainer B
                              WHERE  A.id = B.BoughtHistoryId
                              LIMIT  1
                           )
                       WHEN    type = 2
                       THEN	(
                             SELECT  B.title
                               FROM  wishPrescriptionItem B
                              WHERE  A.id = B.BoughtHistoryId
                              LIMIT  1
                            )
                    END											AS title
              FROM  boughtHistory C
             WHERE  C.id = A.id
            ) LIKE '%${_productName}%'
        ${
          _startDate
            ? `AND  DATE_FORMAT(createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_startDate}', '%Y-%m-%d') `
            : ``
        }
        ${
          _endDate
            ? `AND  DATE_FORMAT(createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
            : ``
        }
        ORDER BY createdAt DESC
    `;

  try {
    const listResult = await models.sequelize.query(listQuery);

    return res.status(200).json(listResult[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("주문목록을 불러올 수 없습니다.");
  }
});

// 관리자 리스트
router.post("/admin/list", isAdminCheck, async (req, res, next) => {
  const { isComplete, date, type } = req.body;

  const dateCondition =
    date === 1
      ? `AND  A.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK )`
      : date === 2
      ? `AND  A.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH )`
      : "";

  const completedCondition =
    isComplete === 1
      ? `AND  A.isCompleted = false
      AND  A.isRefuse = false`
      : isComplete === 2
      ? `AND  A.isCompleted = true
      AND  A.isRefuse = false`
      : isComplete === 3
      ? `AND  A.isRefuse = true`
      : "";

  const typeCondition =
    type === 1 ? `AND A.type = 1` : type === 2 ? `AND A.type = 2` : ``;

  const listQuery = `
    SELECT  A.id,
		        CASE 
		        	WHEN    A.type = 1 THEN '약속'
		        	ELSE    '탕전'
		        END											AS viewType,
            C.username,
            C.mobile,
            C.email,
            C.companyName,
            C.companyNo,
		        A.type,
		        CASE 
		        	WHEN	A.type = 1 
		        	THEN	(
		        				SELECT  B.productname
		        				  FROM  wishPaymentContainer B
		        				 WHERE  A.id = B.BoughtHistoryId
                     LIMIT  1
		        			)
		        	WHEN  A.type = 2
		        	THEN	(
		        				SELECT  B.title
		        				  FROM  wishPrescriptionItem B
		        				 WHERE  A.id = B.BoughtHistoryId
                     LIMIT  1
		        			)
		        END											AS title,
            CASE 
            WHEN	A.type = 1 
            THEN	(
                  SELECT  B.id
                    FROM  wishPaymentContainer B
                   WHERE  A.id = B.BoughtHistoryId
                   LIMIT  1
                )
            WHEN  A.type = 2
            THEN	(
                  SELECT  B.id
                    FROM  wishPrescriptionItem B
                   WHERE  A.id = B.BoughtHistoryId
                   LIMIT  1
                )
            END											AS typeId,
		        A.isRefuse,
		        A.refuseContent,
		        A.isCompleted,
		        A.isNobank,
		        A.isMonth,
		        A.isPay,
		        A.deliveryCompany,
		        A.deliveryNo,
		        A.receiveUser,
		        A.receiveMobile,
		        A.receiveAddress,
		        A.receiveDetailAddress,
		        A.sendUser,
		        A.sendMobile,
		        A.sendAddress,
		        A.sendDetailAddress,
		        A.deliveryMessage,
		        A.payInfo,
		        A.totalPrice,
		        CONCAT(FORMAT(A.totalPrice, 0), '원')     AS viewTotalPrice,
		        A.pharmacyPrice,
		        A.tangjeonPrice,
		        A.deliveryPrice,
            CONCAT(FORMAT(A.pharmacyPrice, 0),'원')   AS viewPharmacyPrice,
            CONCAT(FORMAT(A.tangjeonPrice, 0),'원')   AS viewTangjeonPrice,
            CONCAT(FORMAT(A.deliveryPrice, 0),'원')   AS viewDeliveryPrice,
		        CASE
                WHEN	A.payInfo = 'card' THEN "신용카드"
                WHEN	A.payInfo = 'phone' THEN "휴대폰 결제"
                WHEN	A.payInfo = 'nobank' THEN "무통장입금"
                WHEN	A.payInfo = 'simpleCard' THEN "간편 카드 결제"
                WHEN	A.payInfo = 'trans' THEN "계좌 간편 결제"
                ELSE	A.payInfo
            END	                                                    AS viewPayInfo,
            CASE
                WHEN	A.isRefuse = 1 THEN "거절완료"
                WHEN	A.isCompleted = 1 THEN "처리완료"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 1 THEN "결제 승인"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 0 AND A.payInfo = "nobank" THEN "입금 대기"
                WHEN	A.deliveryStatus = 0 AND A.isPay = 0 THEN "결제 미승인"
                WHEN	A.deliveryStatus = 1 THEN "배송 준비중"
                WHEN	A.deliveryStatus = 2 THEN "집화 완료"
                WHEN	A.deliveryStatus = 3 THEN "배송 중"
                WHEN	A.deliveryStatus = 4 THEN "지점 도착"
                WHEN	A.deliveryStatus = 5 THEN "배송 출발"
                WHEN	A.deliveryStatus = 6 THEN "배송 완료"
               	ELSE	A.deliveryStatus
            END	                                                    AS viewDeliveryStatus,
            DATE_FORMAT(A.createdAt, '%Y년 %m월 %d일')		AS viewCreatedAt
      FROM  boughtHistory   A
     INNER
      JOIN  users           C
        ON  A.UserId = C.id
     WHERE  1 = 1
       AND  A.payInfo IS NOT NULL
       ${dateCondition}
       ${completedCondition}
       ${typeCondition}
    `;

  try {
    const listResult = await models.sequelize.query(listQuery);

    return res.status(200).json(listResult[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("주문목록을 불러올 수 없습니다.");
  }
});

router.post("/delivery/update", isAdminCheck, async (req, res, next) => {
  const { id, deliveryCompany, deliveryNo } = req.body;

  try {
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

    const updateQuery = `
    UPDATE  boughtHistory
       SET  deliveryCompany = '${deliveryCompany}',
            deliveryNo = ${deliveryNo},
            deliveryStatus = ${value.data.level},
            updatedAt = NOW()
     WHERE  id = ${id}
    `;
    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("배송정보를 수정할 수 없습니다.");
  }
});

router.post("/complete/update", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;

  const completeQuery = `
  UPDATE  boughtHistory
     SET  isCompleted = true,
          completedAt = NOW()
   WHERE  id = ${id}
  `;

  try {
    const completeResult = await models.sequelize.query(completeQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("");
  }
});

router.post("/isRefuse/update", isAdminCheck, async (req, res, next) => {
  const { id, content } = req.body;

  const refuseQuery = `
  UPDATE  boughtHistory
     SET  isRefuse = true,
          refuseContent = '${content}'
   WHERE  id = ${id}
  `;

  try {
    const refuseResult = await models.sequelize.query(refuseQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("");
  }
});

router.post("/reBuy/update", isLoggedIn, async (req, res, next) => {
  const { id, type } = req.body;

  // 약속처방
  const paymentDetailQuery = `
    SELECT  id,
            productname         AS title,
            medication,
            receiverName,
            content,
            paymentId,
            WishListId
      FROM  wishPaymentContainer
     WHERE  BoughtHistoryId = ${id}
    `;

  const paymentItemDetailQuery = `
    SELECT  A.id,
            A.price,
            A.pack,
            A.type,
            A.unit,
            A.qnt,
            A.WishPaymentContainerId
      FROM  wishPaymentItem           A
     INNER
      JOIN  wishPaymentContainer      B
        ON  B.id = A.WishPaymentContainerId
     WHERE  B.BoughtHistoryId = ${id}
    `;

  // 탕전처방
  const preDetailQuery = `
    SELECT  id,
            title,
            cheob,
            pack,
            unit,
            packPrice,
            medication,
            receiverName,
            content,
            WishListId
      FROM  wishPrescriptionItem
     WHERE  BoughtHistoryId = ${id}
    `;

  const preItemDetailQuery = `
    SELECT  A.id,
            A.name,
            A.price,
            A.qnt,
            A.unit,
            A.WishPrescriptionItemId,
            A.materialId
      FROM  wishMaterialsItem           A
     INNER
      JOIN  wishPrescriptionItem      B
        ON  B.id = A.WishPrescriptionItemId
     WHERE  B.BoughtHistoryId = ${id}
    `;

  try {
    if (type === 1) {
      // 약속처방
      const paymentDetailResult = await models.sequelize.query(
        paymentDetailQuery
      );
      const paymentItemDetailResult = await models.sequelize.query(
        paymentItemDetailQuery
      );

      for (let i = 0; i < paymentDetailResult[0].length; i++) {
        const paymentCreateQuery = `
        INSERT  INTO  wishPaymentContainer
        (
          paymentId,
          productname,
          medication,
          receiverName,
          content,
          createdAt,
          updatedAt,
          WishListId
        )
        VALUES
        (
          ${paymentDetailResult[0][i].paymentId},
          "${paymentDetailResult[0][i].title}",
          ${
            paymentDetailResult[0][i].medication
              ? `"${paymentDetailResult[0][i].medication}"`
              : `NULL`
          },
          "${paymentDetailResult[0][i].receiverName}",
          ${
            paymentDetailResult[0][i].content
              ? `"${paymentDetailResult[0][i].content}"`
              : `NULL`
          },
          NOW(),
          NOW(),
          ${paymentDetailResult[0][i].WishListId}
        )
        `;

        const paymentCreateResult = await models.sequelize.query(
          paymentCreateQuery
        );

        const filterPaymentItem = paymentItemDetailResult[0].filter(
          (data) => data.WishPaymentContainerId === paymentDetailResult[0][i].id
        );

        for (let v = 0; v < filterPaymentItem.length; v++) {
          const paymentItemCreateQuery = `
          INSERT  INTO    wishPaymentItem
          (
              price,
              pack,
              type,
              unit,
              createdAt,
              updatedAt,
              qnt,
              WishPaymentContainerId
          )
          VALUES
          (
              ${filterPaymentItem[v].price},
              "${filterPaymentItem[v].pack}",
              "${filterPaymentItem[v].type}",
              "${filterPaymentItem[v].unit}",
              NOW(),
              NOW(),
              ${filterPaymentItem[v].qnt},
              ${paymentCreateResult[0].insertId}
          )
          `;

          const paymentItemCreateResult = await models.sequelize.query(
            paymentItemCreateQuery
          );
        }
      }

      return res.status(200).json({ result: true });
    } else if (type === 2) {
      // 탕전처방
      const preDetailResult = await models.sequelize.query(preDetailQuery);
      const preItemDetailResult = await models.sequelize.query(
        preItemDetailQuery
      );

      for (let i = 0; i < preDetailResult[0].length; i++) {
        const preCreateQuery = `
        INSERT  INTO  wishPrescriptionItem
        (
          title,
          cheob,
          pack,
          unit,
          packPrice,
          medication,
          receiverName,
          content,
          createdAt,
          updatedAt,
          WishListId
        )
        VALUES
        (
          "${preDetailResult[0][i].title}",
          ${preDetailResult[0][i].cheob},
          ${preDetailResult[0][i].pack},
          ${preDetailResult[0][i].unit},
          ${preDetailResult[0][i].packPrice},
          ${
            preDetailResult[0][i].medication
              ? `"${preDetailResult[0][i].medication}"`
              : null
          },
          "${preDetailResult[0][i].receiverName}",
          ${
            preDetailResult[0][i].content
              ? `"${preDetailResult[0][i].content}"`
              : null
          },
          NOW(),
          NOW(),
          ${preDetailResult[0][i].WishListId}
        )
        `;

        const preCreateResult = await models.sequelize.query(preCreateQuery);

        const filterPreItem = preItemDetailResult[0].filter(
          (data) => data.WishPrescriptionItemId === preDetailResult[0][i].id
        );

        for (let v = 0; v < filterPreItem.length; v++) {
          const preItemCreateQuery = `
          INSERT  INTO  wishMaterialsItem
          (
            materialId,
            name,
            price,
            qnt,
            unit,
            createdAt,
            updatedAt,
            WishPrescriptionItemId
          )
          VALUES
          (
            ${filterPreItem[v].materialId},
            "${filterPreItem[v].name}",
            ${filterPreItem[v].price},
            ${filterPreItem[v].qnt},
            "${filterPreItem[v].unit}",
            NOW(),
            NOW(),
            ${preCreateResult[0].insertId}
          )
          `;

          const preItemCreateResult = await models.sequelize.query(
            preItemCreateQuery
          );
        }
      }
      return res.status(200).json({ result: true });
    } else {
      return res.status(401).send("상세정보를 불러올 수 없습니다.");
    }
  } catch (e) {
    console.error(e);
    return res.status(401).send("상세정보를 불러올 수 없습니다.");
  }
});

module.exports = router;
