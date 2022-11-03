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
    SELECT	id,	
            productname                          	AS title,
            WishListId,
            receiverName,
            paymentId,
            1				  						AS isPayment,
            CASE
              WHEN 
                !ISNULL((
                  SELECT  ROUND(SUM(B.price * B.qnt))
                    FROM  wishPaymentItem B 
                   WHERE  A.id = B.WishPaymentContainerId
                ))
              THEN
                (
                  SELECT  ROUND(SUM(B.price * B.qnt))
                    FROM  wishPaymentItem B 
                  WHERE  A.id = B.WishPaymentContainerId
                )
              ELSE 0
            END AS originTotalPrice,
            CASE
              WHEN 
                !ISNULL((
                  SELECT  ROUND(SUM(B.price * B.qnt))
                    FROM  wishPaymentItem B 
                   WHERE  A.id = B.WishPaymentContainerId
                ))
              THEN
                FORMAT((
                  SELECT  ROUND(SUM(B.price * B.qnt))
                    FROM  wishPaymentItem B 
                  WHERE  A.id = B.WishPaymentContainerId
                ), 0)
              ELSE 0
            END AS viewTotalPrice,
            (
              SELECT  COUNT(id)
                FROM  wishPaymentItem B 
               WHERE  A.id = B.WishPaymentContainerId
            )                      AS length
      FROM	wishPaymentContainer    A
     WHERE	WishListId = ${findWishList[0][0].id}
       AND  BoughtHistoryId IS NULL
     UNION
       ALL
    SELECT	id,
            title,	
            WishListId,
            receiverName,
            1                                       AS paymentId,
            0										AS isPayment,
            CASE
              WHEN 
                !ISNULL((
                  SELECT  ROUND(SUM(B.price * B.qnt * 100) + A.packPrice)
                    FROM  wishMaterialsItem B 
                   WHERE  A.id = B.WishPrescriptionItemId
                )) 
              THEN 
                (
                  SELECT  ROUND(SUM(B.price * B.qnt * 100) + A.packPrice)
                    FROM  wishMaterialsItem B 
                   WHERE  A.id = B.WishPrescriptionItemId
                )
              ELSE A.packPrice
            END                                  AS originTotalPrice,
            CASE
              WHEN 
                !ISNULL((
                  SELECT  ROUND(SUM(B.price * B.qnt * 100) + A.packPrice)
                    FROM  wishMaterialsItem B 
                   WHERE  A.id = B.WishPrescriptionItemId
                )) 
              THEN 
                FORMAT((
                  SELECT  ROUND(SUM(B.price * B.qnt * 100) + A.packPrice)
                    FROM  wishMaterialsItem B 
                   WHERE  A.id = B.WishPrescriptionItemId
                ), 0)
              ELSE FORMAT(A.packPrice, 0)
            END                                  AS viewTotalPrice,
            (
              SELECT  COUNT(id)
                FROM  wishMaterialsItem B 
               WHERE  A.id = B.WishPrescriptionItemId
            )                      AS length
      FROM	wishPrescriptionItem					A
     WHERE	WishListId = ${findWishList[0][0].id}
       AND  BoughtHistoryId IS NULL
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
          paymentId,
          productname,
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

    return res.status(200).json({ ...detailData[0][0], items: itemData[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("상품 정보를 불러올 수 없습니다.");
  }
});

/// 장바구니에 상품 추가
/// 바로 wishList에 추가됨 (약속처방)
router.post("/payment/container/create", isLoggedIn, async (req, res, next) => {
  const { paymentId, productname, medication, receiverName, content, items } =
    req.body;

  if (!Array.isArray(items)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  //   item informations
  //   -----------------------
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
      ${paymentId},
      "${productname}",
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
            ${data.price},
            "${data.pack}",
            "${data.type}",
            "${data.unit}",
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
  const { containerId, medication, receiverName, content } = req.body;

  const updateQuery = `
  UPDATE  wishPaymentContainer
     SET  medication = ${medication ? `"${medication}"` : null},
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
router.post("/delete", isLoggedIn, async (req, res, next) => {
  const { idArr } = req.body;

  if (!Array.isArray(idArr)) {
    return res.status(401).send("잘못된 요청입니다.");
  }

  try {
    await Promise.all(
      idArr.map(async (data) => {
        if (data.type === "payment") {
          // 약속처방
          const findContainerQuery = `
          SELECT  id
            FROM  wishPaymentContainer
           WHERE  id = ${data.id}
          `;

          const findData = await models.sequelize.query(findContainerQuery);

          if (findData[0].length === 0) {
            return res.status(401).send("존재하지 않는 상품 정보입니다.");
          }
        } else if (data.type === "pre") {
          // 탕전처방
          const findQuery = `
          SELECT  id
            FROM  wishPrescriptionItem
           WHERE  id = ${data.id}
          `;

          const findData = await models.sequelize.query(findQuery);

          if (findData[0].length === 0) {
            return res.status(401).send("존재하지 않는 상품 정보입니다.");
          }
        }
      })
    );

    await Promise.all(
      idArr.map(async (data) => {
        if (data.type === "payment") {
          // 약속처방
          const deleteQuery1 = `
          DELETE
          FROM  wishPaymentContainer
          WHERE  id = ${data.id}
          `;

          const deleteQuery2 = `
          DELETE
          FROM  wishPaymentItem
          WHERE  WishPaymentContainerId = ${data.id}
          `;

          await models.sequelize.query(deleteQuery2);

          await models.sequelize.query(deleteQuery1);
        } else if (data.type === "pre") {
          // 탕전처방
          const deleteQuery1 = `
          DELETE
            FROM  wishPrescriptionItem
           WHERE  id = ${data.id}
          `;

          const deleteQuery2 = `
          DELETE
            FROM  wishMaterialsItem
           WHERE  WishPrescriptionItemId = ${data.id}
          `;

          await models.sequelize.query(deleteQuery2);

          await models.sequelize.query(deleteQuery1);
        }
      })
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품을 삭제할 수 없습니다.");
  }
});

// container 안에 상품 추가 (약속처방)
router.post("/payment/item/create", isLoggedIn, async (req, res, next) => {
  const { containerId, price, pack, type, unit, qnt } = req.body;

  const insertQuery = `
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
    // insertResult[0].insertId -> create된 id값임
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

//container 안에 상품 수량(약속처방)
router.post("/payment/item/qnt", isLoggedIn, async (req, res, next) => {
  const { wishPaymentItemId, qnt } = req.body;

  const qntUpdateQuery = `
  UPDATE  wishPaymentItem
     SET  qnt = ${qnt}
   WHERE  id = ${wishPaymentItemId}
  `;

  try {
    const qntUpdate = await models.sequelize.query(qntUpdateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("수량을 수정할 수 업습니다.");
  }
});
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// - prescription - ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

router.post("/pre/item/detail", isLoggedIn, async (req, res, next) => {
  const { wishPrescriptrionId } = req.body;

  const detailQuery = `
  SELECT	id,
          title,
          cheob,
          pack,
          unit,
          packPrice,
          CONCAT(FORMAT(packPrice, 0), "원")       AS viewPackPrice,
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
          CONCAT(FORMAT(price, 0), "원")             AS viewPrice,
          ROUND(price * qnt * 100)                   AS totalPrice,
          CONCAT(FORMAT(price * qnt * 100, 0), "원") AS viewTotalPrice,            
          qnt,
          unit,
          createdAt,
          updatedAt,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")    AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")    AS viewUpdatedAt,
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
      .json({ ...detailData[0][0], materials: materialData[0] });
  } catch (error) {
    console.error(error);
    return res.status(401).send("장바구니 상품 정보를 불러올 수 없습니다.");
  }
});

/// 장바구니에 상품 추가
/// 바로 wishList에 추가됨 (탕전처방)
router.post("/pre/item/create", isLoggedIn, async (req, res, next) => {
  const {
    title,
    cheob,
    pack,
    unit,
    packPrice,
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
      "${title}",
      ${cheob},
      ${pack},
      ${unit},
      ${packPrice},
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
    title,
    cheob,
    pack,
    unit,
    medication,
    receiverName,
    content,
  } = req.body;

  const updateQuery = `
  UPDATE  wishPrescriptionItem
     SET  title = "${title}",
          cheob = ${cheob},
          pack = ${pack},
          unit = ${unit},
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

//item 안에 상품 수량(탕전처방)
router.post("/payment/material/qnt", isLoggedIn, async (req, res, next) => {
  const { wishMaterialsItemId, qnt } = req.body;

  const qntUpdateQuery = `
  UPDATE  wishMaterialsItem
     SET  qnt = ${qnt}
   WHERE  id = ${wishMaterialsItemId}
  `;

  try {
    const qntUpdate = await models.sequelize.query(qntUpdateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("수량을 수정할 수 업습니다.");
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
