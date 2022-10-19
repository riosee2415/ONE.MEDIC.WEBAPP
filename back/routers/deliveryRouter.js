const express = require("express");
const { DeliveryPrice } = require("../models");
const models = require("../models");

const router = express.Router();

router.post("/get", async (req, res, next) => {
  const selectQuery = `
    SELECT  id,
            price,
            createdAt,
            updatedAt
      FROM  deliveryPrice
     WHERE  id = 1
    `;

  try {
    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0][0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/update", async (req, res, next) => {
  const { price } = req.body;

  const updateQuery = `
    UPDATE  deliveryPrice  SET
            price = ${price},
            updatedAt = NOW()
     WHERE  id = 1
    `;

  try {
    const result = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

module.exports = router;
