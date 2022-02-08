const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { UserAddress, User } = require("../models");
const models = require("../models");

const router = express.Router();

router.get("/list", isLoggedIn, async (req, res, next) => {
  const { searchAddress } = req.query;

  try {
    const exUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
      },
    });

    if (!exUser) {
      return res.status(400).send("존재하지 않는 회웝입니다.");
    }

    const detail = await UserAddress.findOne({
      where: {
        UserId: parseInt(req.user.id),
        isDelete: false,
        isNormal: true,
      },
    });

    const selectQuery = `
    SELECT  ua.id,
        		ua.postCode,
        		ua.address ,
        		ua.detailAddress ,
        		ua.username ,
        		ua.userMobile,
            ua.isNormal
      FROM  userAddress ua
     WHERE  ua.username LIKE '%${searchAddress}%'
       AND  isDelete = false
       AND  UserId = ${req.user.id}
     ORDER  BY ua.isNormal = true DESC;
    `;

    const lists = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: lists[0], detail });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { postCode, address, detailAddress, userId, username, userMobile } =
    req.body;

  try {
    if (userId) {
      const exUser = await User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("존재하지 않는 회원입니다.");
      }
    }

    const result = await UserAddress.create({
      postCode,
      address,
      detailAddress,
      username,
      userMobile,
      UserId: parseInt(userId),
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { postCode, address, detailAddress, addressId, username, userMobile } =
    req.body;

  try {
    if (addressId) {
      const exAddress = await UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("존재하지 않는 주소입니다.");
      }
    }

    const result = await UserAddress.update(
      {
        postCode,
        address,
        detailAddress,
        username,
        userMobile,
      },
      {
        where: {
          id: parseInt(addressId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.delete("/delete/:addressId", isLoggedIn, async (req, res, next) => {
  const { addressId } = req.params;

  try {
    if (addressId) {
      const exAddress = await UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("존재하지 않는 주소입니다.");
      }
    }

    const result = await UserAddress.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(addressId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/isNormal", isLoggedIn, async (req, res, next) => {
  const { addressId } = req.body;

  try {
    if (addressId) {
      const exAddress = await UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("존재하지 않는 주소입니다.");
      }

      const exAddressCheck = await UserAddress.findOne({
        where: {
          isDelete: false,
          isNormal: true,
        },
      });

      if (exAddressCheck) {
        const checkOffAddress = await UserAddress.update(
          {
            isNormal: false,
          },
          {
            where: {
              id: parseInt(exAddressCheck.id),
            },
          }
        );
      }
    }

    const result = await UserAddress.update(
      {
        isNormal: true,
      },
      {
        where: {
          id: parseInt(addressId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

module.exports = router;
