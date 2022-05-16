const express = require("express");
const { SearchMaterial, SearchRecipe, Materials } = require("../models");
const models = require("../models");
const { Op } = require("sequelize");
const isAdminCheck = require("../middlewares/isAdminCheck");

const router = express.Router();

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// RECIPE //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

router.get("/recipe/list", async (req, res, next) => {
  const { search } = req.query;

  try {
    const result = await SearchRecipe.findAll({
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
        isDelete: false,
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

router.post("/recipe/create", isAdminCheck, async (req, res, next) => {
  const { name } = req.body;

  try {
    const exRecipe = SearchRecipe.findOne({
      where: {
        name,
        isDelete: false,
      },
    });

    if (exRecipe) {
      return res.status(400).send("같은 이름의 레시피가 있습니다.");
    }

    await SearchRecipe.create({
      name,
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("레시피를 생성할 수 없습니다.");
  }
});

router.patch("/recipe/update", isAdminCheck, async (req, res, next) => {
  const { id, name } = req.body;

  try {
    const exRecipe = await SearchRecipe.findOne({
      where: {
        id,
        isDelete: false,
      },
    });

    if (!exRecipe) {
      return res.status(400).send("존재하지 않는 레시피입니다.");
    }

    await SearchRecipe.udpate(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("레시피를 수정할 수 없습니다.");
  }
});

router.delete(
  "/recipe/delete/:recipeId",
  isAdminCheck,
  async (req, res, next) => {
    const { recipeId } = req.params;

    try {
      const exRecipe = await SearchRecipe.findOne({
        where: {
          id: parseInt(recipeId),
          isDelete: false,
        },
      });

      if (!exRecipe) {
        return res.status(400).send("존재하지 않는 레시피 입니다.");
      }

      await SearchRecipe.udpate(
        {
          isDelete: true,
        },
        {
          where: {
            id: parseInt(recipeId),
          },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      console.error(e);
      return res.status(400).send("레시피를 삭제할 수 없습니다.");
    }
  }
);

////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// MATERIAL /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

router.get("/material/list", async (req, res, next) => {
  const { recipeId } = req.query;

  try {
    const exRecipe = await SearchRecipe.findOne({
      where: {
        id: parseInt(searchId),
        isDelete: false,
      },
    });

    if (!exRecipe) {
      return res.status(400).send("존재하지 않는 레시피 입니다.");
    }

    const result = await SearchMaterial.findAll({
      where: {
        SearchRecipeId: parseInt(recipeId),
        isDelete: false,
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("재료를 불러올 수 없습니다.");
  }
});

router.post("/material/create", async (req, res, next) => {
  const { qnt, unit, materialId } = req.body;

  try {
    const exMaterial = await Materials.findOne({
      where: {
        id: materialId,
        isDelete: false,
      },
    });

    if (!exMaterial) {
      return res.status(400).send("존재하지 않는 재료입니다.");
    }

    const result = await SearchMaterial.create({
      where: {
        qnt,
        unit,
        MaterialId: materialId,
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("재료를 생성할 수 없습니다.");
  }
});

router.delete("/material/delete/:materialId", async (req, res, next) => {
  const { materialId } = req.body;

  try {
    const exMaterial = await SearchMaterial.findOne({
      where: {
        id: materialId,
      },
    });

    if (!exMaterial) {
      return res.status(400).send("존재하지 않는 재료입니다.");
    }

    const result = await SearchMaterial.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(materialId),
        },
      }
    );

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("재료를 생성할 수 없습니다.");
  }
});

module.exports = router;
