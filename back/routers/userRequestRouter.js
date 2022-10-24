const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const models = require("../models");

const router = express.Router();

router.post("/list", isLoggedIn, async (req, res, next) => {
  const selectQuery = `
  SELECT  id,
          title,
          receiverName,
          medication,
          content,
          DATE_FORMAT(createdAt, "%Y년 %m월 %d일")	AS viewCreatedAt,
          DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")	AS viewUpdatedAt
    FROM  userRequest
   WHERE  UserId = ${req.user.id}
    `;

  try {
    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올수 없습니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { title, receiverName, medication, content } = req.body;

  const selectQuery = `
  INSERT INTO userRequest (
    title,
    receiverName,
    medication,
    content,
    createdAt
  ) VALUES (
    '${title}',
    '${receiverName}',
    '${medication}',
    '${content}'
  )
  `;

  try {
    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올수 없습니다.");
  }
});

router.post("/update", isLoggedIn, async (req, res, next) => {
  const { id, title, receiverName, medication, content } = req.body;

  const updateQuery = `
  UPDATE  userRequest
     SET  title = '${title}',
          receiverName = '${receiverName}',
          medication = '${medication}',
          content = '${content}',
          updatedAt = NOW()
   WHERE  id = ${id}
    `;

  try {
    const result = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올수 없습니다.");
  }
});

router.post("/delete", isLoggedIn, async (req, res, next) => {
  const { id } = req.body;

  const deleteQuery = `
  DELETE  
    FROM  userRequest  
   WHERE  id = ${id}
    `;

  try {
    const result = await models.sequelize.query(deleteQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(401).send("요청사항을 불러올수 없습니다.");
  }
});

module.exports = router;
