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
        createdAt
        updatedAt
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
        NOW()
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
        })
      );
    }

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("배송정보를 등록할수 없습니다.");
  }
});

// 결제 정보
router.post("/create/isPay", isLoggedIn, async (req, res, next) => {
  const { id, isMonth, isPay, payInfo, totalPrice } = req.body;

  const updateQuery = `
    UPDATE  boughtHistory
       SET  isMonth = ${isMonth},
            isPay = ${isPay},
            payInfo = '${payInfo}',
            totalPrice = ${totalPrice}
     WHERE  id = ${id}
    `;

  try {
    const udpateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("구매할 수 업습니다.");
  }
});

module.exports = router;
