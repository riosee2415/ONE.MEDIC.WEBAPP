const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

const router = express.Router();

// router.post("/payment/container/detail", isLoggedIn, async (req, res, next) => {
//   const { containerId } = req.body;

//   try {
//   } catch (error) {
//     console.error(error);
//     return res.status(401).send("상품 정보를 불러올 수 없습니다.");
//   }
// });

/// 장바구니에 상품 추가
/// 바로 wishList에 추가됨 (약속처방)
router.post("/payment/container/create", isLoggedIn, async (req, res, next) => {
  const { productname, totalPrice, totalQun, items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  //   item informations
  //   -----------------------
  //   paymentId,
  //   title,
  //   price,
  //   pack,
  //   type,
  //   unit,
  //   qnt,
  //   otherRequest
  //   -----------------------

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

    await Promise.all(
      items.map(async (data) => {
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
            ${data.paymentId},
            "${data.title}",
            ${data.price},
            "${data.pack}",
            "${data.type}",
            ${data.unit},
            "${data.otherRequest}",
            NOW(),
            NOW(),
            ${qnt},
            ${containerInsertResult[0].insertId}
        )
        `;

        await models.sequelize.query(insertQuery);
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니에 상품을 추가할 수 없습니다.");
  }
});

// router.post("/payment/container/update", isLoggedIn, async (req, res, next) => {
//   const { containerId } = req.body;

//   try {
//   } catch (error) {
//     console.error(error);
//     return res.status(401).send("상품 정보를 불러올 수 없습니다.");
//   }
// });

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
      ${unit},
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

// container안에 상품 수정(약속처방)
router.post("/payment/item/update", isLoggedIn, async (req, res, next) => {
  const { wishPaymentItemId, price, pack, type, unit, otherRequest } = req.body;

  const updateQuery = `
  UPDATE    wishPaymentItem
     SET    price = ${price},
            pack = "${pack}",
            type = "${type}",
            unit = ${unit},
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

//container 안에 상품 삭제(약속처방)
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

/// 장바구니에 상품 추가
/// 바로 wishList에 추가됨 (탕전처방)
router.post("/pre/item/create", isLoggedIn, async (req, res, next) => {
  const {
    prescriptionId,
    title,
    totalPrice,
    cheob,
    pack,
    unit,
    qnt,
    receiverName,
    content,
    medication,
    materials,
  } = req.body;

  if (!Array.isArray(materials)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

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

    const preScriptionItemCreateQuery = `
    INSERT  INTO  wishPrescriptionItem
    (
      prescriptionId,
      title,
      totalPrice,
      cheob,
      pack,
      unit,
      qnt,
      medication,
      receiverName,
      content,
      createdAt,
      updatedAt,
      WishListId
    )
    VALUES
    (
      ${prescriptionId},
      "${title}",
      ${totalPrice},
      ${cheob},
      ${pack},
      ${unit},
      ${qnt},
      ${medication ? medication`"${medication}"` : null},
      "${receiverName}",
      ${content ? content`"${content}"` : null},
      NOW(),
      NOW(),
      ${
        findResult[0].length !== 0
          ? findResult[0][0].id
          : createResult[0].insertId
      }
    )
    `;

    const preInsertResult = await models.sequelize.query(
      preScriptionItemCreateQuery
    );

    await Promise.all(
      materials.map(async (data) => {
        const insertMaterialQuery = `
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
          ${data.materialId},
          "${data.name}",
          ${data.price},
          ${data.qnt},
          "${data.unit}",
          NOW(),
          NOW(),
          ${preInsertResult[0].insertId}
        )
        `;

        await models.sequelize.query(insertMaterialQuery);
      })
    );

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니에 상품을 추가할 수 없습니다.");
  }
});

// router.post("/pre/item/detail", isLoggedIn, async (req, res, next) => {
//   const {} = req.body;
//   try {
//   } catch (error) {
//     console.error(error);
//     return res.status(401).send("상품 정보를 불러올 수 없습니다.");
//   }
// });

module.exports = router;
