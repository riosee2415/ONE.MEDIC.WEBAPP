const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { UserAddress, User } = require("../models");

const router = express.Router();

router.get("/list/:userId", isLoggedIn, async (req, res, next) => {
  const { userId } = req.params;

  try {
    if (userId) {
      const exUser = User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("회원이 없습니다.");
      }
    }

    const result = await UserAddress.findAll({
      where: {
        UserId: parseInt(userId),
        isDelete: false,
      },
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { postCode, address, detailAddress, userId } = req.body;

  try {
    if (userId) {
      const exUser = User.findOne({
        where: {
          id: parseInt(userId),
        },
      });

      if (!exUser) {
        return res.status(400).send("회원이 없습니다.");
      }
    }

    const result = await UserAddress.create({
      postCode,
      address,
      detailAddress,
      UserId: parseInt(userId),
    });

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/update", isLoggedIn, async (req, res, next) => {
  const { postCode, address, detailAddress, addressId } = req.body;

  try {
    if (addressId) {
      const exAddress = UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("주소가 없습니다.");
      }
    }

    const result = await UserAddress.update(
      {
        postCode,
        address,
        detailAddress,
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
  const { addressId } = req.body;

  try {
    if (addressId) {
      const exAddress = UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("주소가 없습니다.");
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
  const { addressId, isNormal } = req.body;

  try {
    if (addressId) {
      const exAddress = UserAddress.findOne({
        where: {
          id: parseInt(addressId),
          isDelete: false,
        },
      });

      if (!exAddress) {
        return res.status(400).send("주소가 없습니다.");
      }

      if (isNormal) {
        const exAddressCheck = UserAddress.findOne({
          where: {
            id: parseInt(addressId),
            isDelete: false,
            isNormal: true,
          },
        });

        if (exAddressCheck) {
          return res.status(400).send("기본배송지가 있습니다.");
        }
      }
    }

    const result = await UserAddress.update(
      {
        isNormal,
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
