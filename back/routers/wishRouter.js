const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

const router = express.Router();
/// 장바구니에 상품 추가

/// 바로 wishList에 추가됨 (약속처방)
router.post("/payment/create", isLoggedIn, async (req, res, next) => {
  const {
    productname,
    totalPrice,
    totalQun,
    paymentId,
    title,
    price,
    pack,
    type,
    unit,
    qnt,
    otherRequest,
  } = req.body;

  const findWishList = `
  SELECT  id
    FROM  wishLists
   WHERE  UserId = ${req.user.id}
  `;

  try {
    const findResult = await models.sequelize.query(findWishList);

    let createResult = [];

    if (findResult[0].length === 0) {
      const createWishListQuery = `
        INSERT  INTO    wishLists
        (
            createdAt,
            updatedAt,
            UserId
        )
        VALUES
        (   
            NOW(),
            NOW(),
            ${req.user.id}
        )
        `;

      createResult = await models.sequelize.query(createWishListQuery);
    }

    const containerInsertQuery = `
    INSERT  INTO  wishPaymentContainer
    (
      productname,
      totalPrice,
      totalQun,
      createdAt,
      updatedAt,
      WishListId
    )
    VALUES
    (
      "${productname}",
      ${totalPrice},
      ${totalQun},
      NOW(),
      NOW(),
      ${
        findResult[0].length !== 0
          ? findResult[0][0].id
          : createResult[0].insertId
      }
    )
    `;

    const containerInsertResult = await models.sequelize.query(
      containerInsertQuery
    );

    const insertQuery = `
    INSERT  INTO    wishPaymentItem
    (
        paymentId,
        title,
        price,
        pack,
        type,
        unit,
        otherRequest,
        createdAt,
        updatedAt,
        qnt,
        WishPaymentContainerId
    )
    VALUES
    (
        ${paymentId},
        "${title}",
        ${price},
        "${pack}",
        "${type}",
        "${unit}",
        "${otherRequest}",
        NOW(),
        NOW(),
        ${qnt},
        ${containerInsertResult[0].insertId}
    )
    `;

    const insertResult = await models.sequelize.query(insertQuery);

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니에 상품을 추가할 수 없습니다.");
  }
});

// container 안에 상품 추가 (약속처방)
router.post("/payment/item/create", isLoggedIn, async (req, res, next) => {
  const {
    containerId,
    paymentId,
    title,
    price,
    pack,
    type,
    unit,
    qnt,
    otherRequest,
  } = req.body;

  const insertQuery = `
  INSERT  INTO    wishPaymentItem
  (
      paymentId,
      title,
      price,
      pack,
      type,
      unit,
      otherRequest,
      createdAt,
      updatedAt,
      qnt,
      WishPaymentContainerId
  )
  VALUES
  (
      ${paymentId},
      "${title}",
      ${price},
      "${pack}",
      "${type}",
      "${unit}",
      "${otherRequest}",
      NOW(),
      NOW(),
      ${qnt},
      ${containerId}
  )
  `;

  try {
    const insertResult = await models.sequelize.query(insertQuery);

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("상품을 추가할 수 없습니다.");
  }
});

router.post("/payment/item/update", isLoggedIn, async (req, res, next) => {
  const { wishPaymentItemId, price, pack, type, unit, otherRequest } = req.body;

  const updateQuery = `
  UPDATE    wishPaymentItem
     SET    price = ${price},
            pack = "${pack}",
            type = "${type}",
            unit = "${unit}",
            otherRequest = "${otherRequest}",
            updatedAt = NOW()
   WHERE    id = ${wishPaymentItemId}
  `;

  try {
    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 수정할 수 없습니다.");
  }
});

router.post("/payment/item/delete", isLoggedIn, async (req, res, next) => {
  const { wishPaymentItemId } = req.body;

  const deleteQuery = `
  DELETE    
    FROM    wishPaymentItem
   WHERE    id = ${wishPaymentItemId}
  `;

  try {
    const deleteResult = await models.sequelize.query(deleteQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니에 상품을 삭제할 수 없습니다.");
  }
});

router.post("/pre/item/create", isLoggedIn, async (req, res, next) => {
  const {} = req.body;
  try {
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니에 상품을 추가할 수 없습니다.");
  }
});
module.exports = router;
