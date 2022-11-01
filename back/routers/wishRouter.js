const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

const router = express.Router();

router.post("/list/view", isLoggedIn, async (req, res, next) => {
  const findQuery = `
  SELECT  id
    FROM  wishLists
   WHERE  UserId = ${req.user.id}
  `;

  try {
    const findWishList = await models.sequelize.query(findQuery);

    if (findWishList[0].length === 0) {
      return res.status(200).json([]);
    }

    const selcetQuery = `
SELECT	id				AS paymentId,	
    		productname,
    		totalPrice,
    		CONCAT(FORMAT(totalPrice, 0), "원")   AS viewTotalPrice,
    		totalQun,
    		WishListId,
    		1				  AS isPayment
  FROM	wishPaymentContainer
 WHERE	WishListId = ${findWishList[0][0].id}
 UNION
   ALL
 SELECT	id				AS preId,
   			title,
   			totalPrice,
        CONCAT(FORMAT(totalPrice, 0), "원")   AS viewTotalPrice,		
   			qnt,
   			WishListId,
   			0				AS isPayment
   FROM	wishPrescriptionItem
  WHERE	WishListId = ${findWishList[0][0].id}
    `;

    const wishListData = await models.sequelize.query(selcetQuery);

    return res.status(200).json(wishListData[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 목록을 불러올 수 없습니다.");
  }
});

///////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// - PAYMENT - ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

// 장바구니 상품 상세 정보
router.post("/payment/container/detail", isLoggedIn, async (req, res, next) => {
  const { containerId } = req.body;

  const detailQuery = `
  SELECT  id,
          productname,
          totalPrice,
          CONCAT(FORMAT(totalPrice, 0), "원")        AS viewTotalPrice,
          totalQun,
          CONCAT(FORMAT(totalQun, 0), "원")          AS viewTotalQun,
          medication,
          receiverName,
          content,
          createdAt,
          updatedAt,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")    AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")    AS viewUpdatedAt
    FROM  wishPaymentContainer
   WHERE  id = ${containerId}
  `;

  const itemQuery = `
  SELECT  id,
          paymentId,
          title,
          price,
          CONCAT(FORMAT(price, 0), "원")             AS viewPrice,
          pack,
          type,
          unit,
          qnt,
          createdAt,
          updatedAt,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")    AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")    AS viewUpdatedAt
    FROM  wishPaymentItem
   WHERE  WishPaymentContainerId = ${containerId}
  `;

  try {
    const detailData = await models.sequelize.query(detailQuery);

    if (detailData[0].length === 0) {
      return res.status(401).send("존재하지 않는 상품입니다.");
    }

    const itemData = await models.sequelize.query(itemQuery);

    return res
      .status(200)
      .json({ detailData: detailData[0][0], items: itemData[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("상품 정보를 불러올 수 없습니다.");
  }
});

/// 장바구니에 상품 추가
/// 바로 wishList에 추가됨 (약속처방)
router.post("/payment/container/create", isLoggedIn, async (req, res, next) => {
  const {
    productname,
    totalPrice,
    totalQun,
    medication,
    receiverName,
    content,
    items,
  } = req.body;

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
  //   qnt
  //   ------------------------

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
      medication,
      receiverName,
      content,
      createdAt,
      updatedAt,
      WishListId
    )
    VALUES
    (
      "${productname}",
      ${totalPrice},
      ${totalQun},
      ${medication ? `"${medication}"` : null},
      "${receiverName}",
      ${content ? `"${content}"` : null},
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
            "${data.unit}",
            "${data.otherRequest}",
            NOW(),
            NOW(),
            ${data.qnt},
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

// 장바구니 상품 수정
router.post("/payment/container/update", isLoggedIn, async (req, res, next) => {
  const {
    containerId,
    productname,
    totalPrice,
    totalQun,
    medication,
    receiverName,
    content,
  } = req.body;

  const updateQuery = `
  UPDATE  wishPaymentContainer
     SET  productname = "${productname}",
          totalPrice = ${totalPrice},
          totalQun = ${totalQun},
          medication = ${medication ? `"${medication}"` : null},
          receiverName = "${receiverName}",
          content = ${content ? `"${content}"` : null},
          updatedAt = NOW()
   WHERE  id = ${containerId}
  `;

  try {
    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품 정보를 수정할 수 없습니다.");
  }
});

// 장바구니 상품 삭제
router.post("/payment/container/delete", isLoggedIn, async (req, res, next) => {
  const { containerId } = req.body;

  const findContainerQuery = `
  SELECT  id
    FROM  wishPaymentContainer
   WHERE  id = ${containerId}
  `;

  const deleteQuery1 = `
  DELETE
    FROM  wishPaymentContainer
   WHERE  id = ${containerId}
  `;

  const deleteQuery2 = `
  DELETE
    FROM  wishPaymentItem
   WHERE  WishPaymentContainerId = ${containerId}
  `;

  try {
    const findData = await models.sequelize.query(findContainerQuery);

    if (findData[0].length === 0) {
      return res.status(401).send("존재하지 않는 상품 정보입니다.");
    }

    await models.sequelize.query(deleteQuery2);

    await models.sequelize.query(deleteQuery1);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 삭제할 수 없습니다.");
  }
});

// container 안에 상품 추가 (약속처방)
router.post("/payment/item/create", isLoggedIn, async (req, res, next) => {
  const { containerId, paymentId, title, price, pack, type, unit, qnt } =
    req.body;

  const insertQuery = `
  INSERT  INTO    wishPaymentItem
  (
      paymentId,
      title,
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
      ${paymentId},
      "${title}",
      ${price},
      "${pack}",
      "${type}",
      "${unit}",
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
  const { wishPaymentItemId, price, pack, type, unit } = req.body;

  const updateQuery = `
  UPDATE    wishPaymentItem
     SET    price = ${price},
            pack = "${pack}",
            type = "${type}",
            unit = "${unit}",
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

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// - prescription - ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

router.post("/pre/item/detail", isLoggedIn, async (req, res, next) => {
  const { wishPrescriptrionId } = req.body;

  const detailQuery = `
  SELECT	id,
          prescriptionId,
          title,
          totalPrice,
          CONCAT(FORMAT(totalPrice, 0), "원")   AS viewTotalPrice,
          cheob,
          pack,
          unit,
          qnt,
          medication,
          receiverName,
          content,
          createdAt,
          updatedAt,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")  AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")  AS viewUpdatedAt
    FROM	wishPrescriptionItem
   WHERE  id = ${wishPrescriptrionId}
  `;

  const materialQuery = `
  SELECT	id,
          materialId,
          name,
          price,
          CONCAT(FORMAT(price, 0), "원")           AS viewPrice,
          qnt,
          unit,
          createdAt,
          updatedAt,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")  AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")  AS viewUpdatedAt,
          WishPrescriptionItemId 
    FROM	wishMaterialsItem
   WHERE  WishPrescriptionItemId = ${wishPrescriptrionId}
  `;

  try {
    const detailData = await models.sequelize.query(detailQuery);

    if (detailData[0].length === 0) {
      return res.status(401).send("존재하지 않는 상품입니다.");
    }

    const materialData = await models.sequelize.query(materialQuery);

    return res
      .status(200)
      .json({ detailData: detailData[0][0], materials: materialData[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품 정보를 불러올 수 없습니다.");
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

  // "materials": [
  //     {
  //         "materialId": 1,
  //         "name": "재료이름",
  //         "price": 10000,
  //         "qnt": 3.0,
  //         "unit": "단위"
  //     },
  //     {
  //         "materialId": 2,
  //         "name": "재료이름2",
  //         "price": 10000,
  //         "qnt": 0.5,
  //         "unit": "단위"
  //     }
  // ]

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
      ${medication ? `"${medication}"` : null},
      "${receiverName}",
      ${content ? `"${content}"` : null},
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

router.post("/pre/item/update", isLoggedIn, async (req, res, next) => {
  const {
    itemId,
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
  } = req.body;

  const updateQuery = `
  UPDATE  wishPrescriptionItem
     SET  prescriptionId = ${prescriptionId},
          title = "${title}",
          totalPrice = ${totalPrice},
          cheob = ${cheob},
          pack = ${pack},
          unit = ${unit},
          qnt = ${qnt},
          medication = "${medication}",
          receiverName = "${receiverName}",
          content = "${content}",
          updatedAt = NOW()
   WHERE  id = ${itemId}
  `;

  try {
    await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 수정할 수 없습니다.");
  }
});

router.post("/pre/item/delete", isLoggedIn, async (req, res, next) => {
  const { itemId } = req.body;

  const findQuery = `
  SELECT  id
    FROM  wishPrescriptionItem
   WHERE  id = ${itemId}
  `;

  const deleteQuery1 = `
DELETE
  FROM  wishPrescriptionItem
 WHERE  id = ${itemId}
`;

  const deleteQuery2 = `
  DELETE
    FROM  wishMaterialsItem
   WHERE  WishPrescriptionItemId = ${itemId}
  `;

  try {
    const findData = await models.sequelize.query(findQuery);

    if (findData[0].length === 0) {
      return res.status(401).send("존재하지 않는 상품 정보입니다.");
    }

    await models.sequelize.query(deleteQuery2);

    await models.sequelize.query(deleteQuery1);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 삭제할 수 없습니다.");
  }
});

router.post("/pre/material/create", isLoggedIn, async (req, res, next) => {
  const { materialId, name, price, qnt, unit, wishPrescriptionItemId } =
    req.body;

  const insertQuery = `
  INSERT  INTO  wishMaterialsItem
  (
    materialId,
    name,
    price,
    qnt,
    unit,
    WishPrescriptionItemId,
    createdAt,
    updatedAt
  )
  VALUES
  (
    ${materialId},
    "${name}",
    ${price},
    ${qnt},
    "${unit}",
    ${wishPrescriptionItemId},
    NOW(),
    NOW()
  )
  `;

  try {
    await models.sequelize.query(insertQuery);

    return res.status(201).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 추가할 수 없습니다.");
  }
});

router.post("/pre/material/update", isLoggedIn, async (req, res, next) => {
  const { wishMaterialsItemId, materialId, name, price, qnt, unit } = req.body;

  const updateQuery = `
    UPDATE  wishMaterialsItem
       SET  materialId = ${materialId},
            name = "${name}",
            price = ${price},
            qnt = ${qnt},
            unit = "${unit}",
            updatedAt = NOW()
     WHERE  id = ${wishMaterialsItemId}
  `;

  try {
    await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 추가할 수 없습니다.");
  }
});

router.post("/pre/material/delete", isLoggedIn, async (req, res, next) => {
  const { wishMaterialsItemId } = req.body;

  const deleteQuery = `
  DELETE
    FROM  wishMaterialsItem
   WHERE  id = ${wishMaterialsItemId}
  `;

  try {
    await models.sequelize.query(deleteQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 추가할 수 없습니다.");
  }
});

module.exports = router;
