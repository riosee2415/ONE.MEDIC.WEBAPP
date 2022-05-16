const express = require("express");
const { SearchMaterial, SearchRecipe } = require("../models");
const models = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/recipe/list", async (req, res, next) => {
  const { search } = req.query;

  try {
    const result = await SearchRecipe.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      include: [
        {
          model: SearchMaterial,
        },
      ],
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("레시피를 검색할 수 없습니다.");
  }
});

module.exports = router;
