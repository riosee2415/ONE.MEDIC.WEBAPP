const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

const router = express.Router();

router.post("/list", isLoggedIn, async (req, res, next) => {
  const { page } = req.body;

  const LIMIT = 9;

  const _page = page ? page : 1;

  const __page = _page - 1;
  const OFFSET = __page * 9;

  const selectQuery = `
    SELECT  id,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일")	AS viewCreatedAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")	AS viewUpdatedAt
      FROM  userDeliveryRequest
     WHERE  UserId = ${req.user.id}
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
      `;

  const lengthQuery = `
    SELECT  id,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일")	AS viewCreatedAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")	AS viewUpdatedAt
      FROM  userDeliveryRequest
     WHERE  UserId = ${req.user.id}
     LIMIT  ${LIMIT}
    OFFSET  ${OFFSET}
      `;

  try {
    const result = await models.sequelize.query(selectQuery);

    const lengthResult = await models.sequelize.query(lengthQuery);

    const requestLen = lengthResult[0].length;

    const lastPage =
      requestLen % LIMIT > 0 ? requestLen / LIMIT + 1 : requestLen / LIMIT;

    return res.status(200).json({
      list: result[0],
      lastPage: parseInt(lastPage),
    });
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올 수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { content } = req.body;

  const selectQuery = `
    INSERT INTO userDeliveryRequest (
      content,
      createdAt,
      updatedAt,
      UserId
    ) VALUES (
      '${content}',
      NOW(),
      NOW(),
      ${req.user.id}
    )
    `;

  try {
    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 생성할 수 없습니다.");
  }
});

router.post("/update", isLoggedIn, async (req, res, next) => {
  const { id, content } = req.body;

  const updateQuery = `
    UPDATE  userDeliveryRequest
       SET  content = '${content}',
            updatedAt = NOW()
     WHERE  id = ${id}
      `;

  try {
    const result = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 수정할 수 없습니다.");
  }
});

router.post("/delete", isLoggedIn, async (req, res, next) => {
  const { id } = req.body;

  const deleteQuery = `
    DELETE  
      FROM  userDeliveryRequest  
     WHERE  id = ${id}
      `;

  try {
    const result = await models.sequelize.query(deleteQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 삭제할 수 없습니다.");
  }
});

router.post("/allList", isLoggedIn, async (req, res, next) => {
  const selectQuery = `
    SELECT  id,
            content,
            DATE_FORMAT(createdAt, "%Y년 %m월 %d일")	AS viewCreatedAt,
            DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")	AS viewUpdatedAt
      FROM  userDeliveryRequest
     WHERE  UserId = ${req.user.id}
      `;

  try {
    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올 수 없습니다.");
  }
});

module.exports = router;
