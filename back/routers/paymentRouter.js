const express = require("express");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNanCheck = require("../middlewares/isNanCheck");
const models = require("../models");
const { PaymentRequest, User, Payment } = require("../models");
const axios = require("axios");

const router = express.Router();

router.get("/list", async (req, res, next) => {
  const { isComplete, type } = req.query;

  try {
    const condition =
      type === "1"
        ? `AND  p.createdAt > DATE_ADD(NOW(),INTERVAL -1 WEEK )`
        : type === "2"
        ? `AND  p.createdAt > DATE_ADD(NOW(),INTERVAL -1 MONTH )`
        : "";

    const completedCondition =
      isComplete === "1"
        ? `AND  p.isCompleted = false`
        : isComplete === "2"
        ? `AND  p.isCompleted = true`
        : "";

    const selectQuery = `
    SELECT  p.id,
		        p.productName,
            p.completedAt,
            p.deliveryNo,
            p.receiveUser,
            p.receiveMobile,
            p.receiveAddress,
            p.receiveDetailAddress,
            p.sendUser,
            p.sendMobile,
            p.sendAddress,
            p.sendDetailAddress,
            p.deliveryCompany,
		        DATE_FORMAT(p.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS completedAt,
		        DATE_FORMAT(p.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
            u.username,
		        u.email,
		        u.mobile,
		        u.nickname,
		        u.companyName,
		        u.companyNo
      FROM  payment p
      JOIN  users u
        ON  u.id = p.UserId
     WHERE  isPayment = true
     ${condition}
     ${completedCondition}
     ORDER  BY  p.createdAt DESC;
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("결제 요청이 없습니다.");
  }
});

router.get("/user/list", isLoggedIn, async (req, res, next) => {
  const { startDate, endDate, productName } = req.query;

  try {
    const _startDate = startDate || null;
    const _endDate = endDate || null;
    const _productName = productName || "";

    const selectQuery = `
      SELECT  p.id,
              p.productName,
              p.completedAt,
              p.deliveryNo,
              p.receiveUser,
              p.receiveMobile,
              p.receiveAddress,
              p.receiveDetailAddress,
              p.sendUser,
              p.sendMobile,
              p.sendAddress,
              p.sendDetailAddress,
              p.deliveryCompany,
              DATE_FORMAT(p.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS completedAt,
              DATE_FORMAT(p.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
              p.createdAt,
              u.username,
              u.email,
              u.mobile,
              u.nickname,
              u.companyName,
              u.companyNo
        FROM  payment p
        JOIN  users u
          ON  u.id = p.UserId
       WHERE  1 = 1
         ${
           _startDate
             ? `AND  DATE_FORMAT(p.createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_startDate}', '%Y-%m-%d') `
             : ``
         }
         ${
           _endDate
             ? `AND  DATE_FORMAT(p.createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
             : ``
         }
         AND  p.productName LIKE '%${_productName}%'
         AND  u.id = ${req.user.id}
       ORDER  BY  p.createdAt DESC
    `;

    const reuslt = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: reuslt[0] });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.get("/list/request/:paymentId", async (req, res, next) => {
  const { paymentId } = req.params;

  try {
    const selectQuery = `
      SELECT  p.payment,
              p.packVolumn,
              p.typeVolumn,
              p.unitVolumn,
              p.otherRequest
        FROM  paymentRequest p
       WHERE  PaymentId = ${paymentId};
      `;

    const result = await models.sequelize.query(selectQuery);
    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { userId, productName, paymentRequestDatum, totalPrice } = req.body;

  if (isNanCheck(userId)) {
    return res
      .status(403)
      .send("올바르지 않은 요청 입니다. 다시 시도해주세요.");
  }

  if (!Array.isArray(paymentRequestDatum)) {
    return res.status(400).send("잘못된 요청입니다.");
  }

  try {
    const currentUser = await User.findOne({
      where: {
        id: parseInt(userId),
      },
    });

    if (!currentUser) {
      return res.status(400).send("존재하지 않는 회원입니다.");
    }

    const result = await Payment.create({
      productName,
      UserId: parseInt(userId),
      totalPrice,
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
    const result = await Payment.update(
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
        const exPayment = await Payment.findOne({
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

      const result = await Payment.update(
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

router.get("/detail/:paymentId", isLoggedIn, async (req, res, next) => {
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

router.patch("/address/update", async (req, res, next) => {
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
    if (id) {
      const exPayment = await Payment.findOne({
        where: {
          id: parseInt(id),
        },
      });

      if (!exPayment) {
        return res.status(400).send("주문이 없습니다.");
      }
    }
    const result = await Payment.update(
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
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/isPayment/:paymentId", isLoggedIn, async (req, res, next) => {
  const { paymentId } = req.params;
  const { isCard, totalPrice, payInfo } = req.body;

  try {
    const currentUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
      },
    });
    const currentPayment = await Payment.findOne({
      where: {
        id: parseInt(paymentId),
      },
    });

    const _payinfo = payInfo;

    if (_payinfo) {
      await User.update(
        {
          payInfo: _payinfo,
        },
        {
          where: { id: req.user.id },
        }
      );
    }

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
          name: "간편 카드 결제",
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
        const result = await Payment.update(
          {
            isPayment: true,
          },
          {
            where: {
              id: parseInt(paymentId),
            },
          }
        );

        return res.status(200).json({ result: true, paymentId: result.id });
      } else {
        return res.status(401).send(message);
      }
    } else {
      const result = await Payment.update(
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
    }
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

module.exports = router;
