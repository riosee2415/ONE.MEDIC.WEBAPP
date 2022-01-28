const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const isAdminCheck = require("../middlewares/isAdminCheck");
const isLoggedIn = require("../middlewares/isLoggedIn");
const { Op } = require("sequelize");
const generateUUID = require("../utils/generateUUID");
const sendSecretMail = require("../utils/mailSender");
const models = require("../models");
const axios = require("axios");

const router = express.Router();

router.get(
  ["/list", "/list/:listType"],
  isAdminCheck,
  async (req, res, next) => {
    let findType = 1;

    const { listType } = req.params;
    const { name, email } = req.query;

    const validation = Number(listType);
    const numberFlag = isNaN(validation);

    if (numberFlag) {
      findType = parseInt(1);
    }

    if (validation >= 2) {
      findType = 2;
    } else {
      findType = 1;
    }

    try {
      let users = [];

      const searchName = name ? name : "";
      const searchEmail = email ? email : "";

      switch (parseInt(findType)) {
        case 1:
          users = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["createdAt", "DESC"]],
          });
          break;
        case 2:
          users = await User.findAll({
            where: {
              username: {
                [Op.like]: `%${searchName}%`,
              },
              email: {
                [Op.like]: `%${searchEmail}%`,
              },
            },
            attributes: {
              exclude: ["password"],
            },
            order: [["username", "ASC"]],
          });
          break;

        default:
          break;
      }

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(401).send("사용자 목록을 불러올 수 없습니다.");
    }
  }
);

router.get("/signin", async (req, res, next) => {
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  console.log(req.user);
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: [
          "id",
          "nickname",
          "email",
          "level",
          "username",
          "mobile",
          "licenseNo",
          "operatorLevel",
        ],
      });

      console.log("🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀");
      console.log(fullUserWithoutPassword);
      console.log("🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀🍀");
      return res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (info) {
      console.log(`❌ LOGIN FAILED : ${info.reason}`);
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: [
          "id",
          "nickname",
          "email",
          "level",
          "username",
          "mobile",
          "licenseNo",
          "operatorLevel",
        ],
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/signin/admin", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    if (user.level < 3) {
      console.log(`❌ LOGIN FAILED : 관리자 접속 권한이 없습니다.`);
      return res.status(403).send({ reason: "관리자 접속 권한이 없습니다." }); // Forbbiden 권한 없음
    }

    if (info) {
      console.log(`❌ LOGIN FAILED : ${info.reason}`);
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: [
          "id",
          "nickname",
          "email",
          "level",
          "username",
          "mobile",
          "licenseNo",
          "operatorLevel",
        ],
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  const { email, username, nickname, mobile, password, terms } = req.body;

  if (!terms) {
    return res.status(401).send("이용약관에 동의해주세요.");
  }

  try {
    const exUser = await User.findOne({
      where: { email: email },
    });

    if (exUser) {
      return res.status(401).send("이미 가입된 이메일 입니다.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      username,
      nickname,
      mobile,
      terms,
      password: hashedPassword,
    });

    res.status(201).send("SUCCESS");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    return res.status(401).send("사용자 정보를 불러올 수 없습니다.");
  }
});

router.post("/me/update", isLoggedIn, async (req, res, next) => {
  const { id, nickname, mobile } = req.body;

  try {
    const exUser = await User.findOne({ where: { id: parseInt(id) } });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자 입니다.");
    }

    const updateUser = await User.update(
      { nickname, mobile },
      {
        where: { id: parseInt(id) },
      }
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("정보를 수정할 수 없습니다.");
  }
});

router.post("/findemail", async (req, res, next) => {
  const { nickname, mobile } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        nickname,
        mobile,
      },
    });

    if (exUser) {
      return res.status(200).json({ email: exUser.email });
    } else {
      return res.status(200).json({ email: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("아이디를 찾을 수 없습니다.");
  }
});

router.post("/modifypass", isLoggedIn, async (req, res, next) => {
  const { email, nickname, mobile } = req.body;

  try {
    const cookieEmail = req.user.dataValues.email;
    const cookieNickname = req.user.dataValues.nickname;
    const cookieMobile = req.user.dataValues.mobile;

    if (
      email === cookieEmail &&
      nickname === cookieNickname &&
      mobile === cookieMobile
    ) {
      const currentUserId = req.user.dataValues.id;

      const UUID = generateUUID();

      const updateResult = await User.update(
        { secret: UUID },
        {
          where: { id: parseInt(currentUserId) },
        }
      );

      if (updateResult[0] > 0) {
        // 이메일 전송

        await sendSecretMail(
          cookieEmail,
          `🔐 [보안 인증코드 입니다.] ㅁㅁㅁㅁ 에서 비밀번호 변경을 위한 보안인증 코드를 발송했습니다.`,
          `
          <div>
            <h3>ㅁㅁㅁㅁ</h3>
            <hr />
            <p>보안 인증코드를 발송해드립니다. ㅁㅁㅁㅁ 홈페이지의 인증코드 입력란에 정확히 입력해주시기 바랍니다.</p>
            <p>인증코드는 [<strong>${UUID}</strong>] 입니다. </p>

            <br /><hr />
            <article>
              발송해드린 인증코드는 외부로 유출하시거나, 유출 될 경우 개인정보 침해의 위험이 있으니, 필히 본인만 사용하며 타인에게 양도하거나 알려주지 마십시오.
            </article>
          </div>
          `
        );

        return res.status(200).json({ result: true });
      } else {
        return res
          .status(401)
          .send("요청이 올바르지 않습니다. 다시 시도해주세요.");
      }
    } else {
      return res
        .status(401)
        .send("입력하신 정보가 잘못되었습니다. 다시 확인해주세요.");
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다. [CODE097]");
  }
});

router.get("/modifypass", isLoggedIn);

router.patch("/modifypass/update", isLoggedIn, async (req, res, next) => {
  const { secret, password } = req.body;

  try {
    const exUser = await User.findOne({
      where: { id: req.user.dataValues.id },
    });

    if (!exUser) {
      return res
        .status(401)
        .send("잘못된 요청 입니다. 다시 로그인 후 이용해주세요.");
    }

    const hashPassord = await bcrypt.hash(password, 12);

    const updateResult = await User.update(
      { password: hashPassord },
      {
        where: { id: req.user.dataValues.id },
      }
    );

    if (updateResult[0] === 1) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다.");
  }
});

router.patch("/level/update", isAdminCheck, async (req, res, next) => {
  const { selectUserId, changeLevel } = req.body;

  try {
    const exUser = await User.findOne({
      where: { id: parseInt(selectUserId) },
    });

    if (!exUser) {
      return res
        .status(401)
        .send("잘못된 사용자 입니다. 다시 확인 후 시도해주세요.");
    }

    const currentLevel = parseInt(exUser.dataValues.level);

    if (parseInt(currentLevel) === 5) {
      return res.status(403).send("개발사의 권한을 수정할 수 없습니다.");
    }

    if (parseInt(currentLevel) === parseInt(changeLevel)) {
      return res
        .status(401)
        .send(
          "변경하려는 사용자 권한이 동일합니다. 다시 확인 후 시도해주세요."
        );
    }

    const updateResult = await User.update(
      { level: parseInt(changeLevel) },
      {
        where: {
          id: parseInt(selectUserId),
        },
      }
    );

    if (updateResult[0] === 1) {
      return res.status(200).json({ result: true });
    } else {
      return res.status(200).json({ result: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다. 개발사에 문의해주세요.");
  }
});

router.get(
  "/kakaoLogin",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (res, req) => {
    res.redirect("/");
  }
);

router.get(
  "/kakao/oauth",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (res, req) => {
    return res.redirect("/");
  },

  router.get("/company/list/:type", isAdminCheck, async (req, res, next) => {
    const { type } = req.params;
    const { name, email } = req.query;

    const searchName = name ? name : "";
    const searchEmail = email ? email : "";

    try {
      const selectQuery = `
              SELECT  id,
                      username,
                      nickname,
                      email,
                      mobile,
                      companyName,
                      companyFile,
                      companyNo,
                      operatorLevel,
                      resusalReason
                FROM  users
               ${
                 type === "1"
                   ? "WHERE  isCompany = false"
                   : type === "2"
                   ? "WHERE  isCompany = true"
                   : type === "3"
                   ? "WHERE  isRefusal = true"
                   : "WHERE  NOT companyNo IS NULL"
               } 
                ${type === "1" ? "AND  NOT companyNo is NULL" : ""}
                ${type === "1" ? "AND  isRefusal = false" : ""}
                ${
                  type === "2" && searchName.length > 0
                    ? `AND  username LIKE "%${searchName}%"`
                    : ""
                }
                ${
                  type === "2" && searchEmail.length > 0
                    ? `AND  email LIKE "%${searchEmail}%"`
                    : ""
                }
               `;
      const result = await models.sequelize.query(selectQuery);

      return res.status(200).json(result[0]);
    } catch (e) {
      console.error(e);
      return res.status(401).send("잘못된 요청 입니다.");
    }
  }),

  router.patch("/company/create", async (req, res, next) => {
    const { id, companyName, companyNo, companyFile } = req.body;

    try {
      if (id) {
        const exUser = await User.findOne({
          where: {
            id: parseInt(id),
          },
        });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      if (companyNo) {
        const exCompany = await User.findOne({
          where: {
            companyNo,
          },
        });

        if (exCompany) {
          return res.status(401).send("신청을 한 회원입니다.");
        }
      }

      const result = await User.update(
        {
          companyName,
          companyNo,
          companyFile,
        },
        {
          where: {
            id: parseInt(id),
          },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      console.log(e);
      return res.status(401).send("잘못된 요청 입니다.");
    }
  }),

  router.patch("/company/refusal", isAdminCheck, async (req, res, next) => {
    const { id, resusalReason } = req.body;

    try {
      if (id) {
        const exUser = await User.findOne({ id });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      const result = await User.update(
        {
          isRefusal: true,
          resusalReason,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      return res.status(401).send("잘못된 요청 입니다.");
    }
  }),

  router.patch("/company/approval", isAdminCheck, async (req, res, next) => {
    const { id } = req.body;

    try {
      if (id) {
        const exUser = await User.findOne({ id });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      const result = await User.update(
        {
          isCompany: true,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      return res.status(401).send("잘못된 요청 입니다.");
    }
  }),

  router.patch("/company/operator", isAdminCheck, async (req, res, next) => {
    const { id, operatorLevel } = req.body;

    try {
      if (id) {
        const exUser = await User.findOne({ id });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      const result = await User.update(
        {
          operatorLevel,
        },
        {
          where: { id: parseInt(id) },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      console.error(e);
      return res.status(401).send("잘못된 요청 입니다.");
    }
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  req.session.save(() => {
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

router.get("/card/list/:userId", isLoggedIn, async (req, res, next) => {
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

    const selectQuery = `
    SELECT  cardNo,
		        cardDate,
		        cardBirth,
		        userCode
      FROM  users
     WHERE  userCode IS NOT NULL
       AND  id = ${userId};
    `;

    const result = await models.sequelize.query(selectQuery);

    return res.status(200).json(result[0]);
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.patch("/card/create", isLoggedIn, async (req, res, next) => {
  const { cardNo, cardDate, cardPassword, cardBirth, userCode, cardName } =
    req.body;

  try {
    const exUser = User.findOne({
      where: {
        id: parseInt(req.user.id),
      },
    });

    if (!exUser) {
      return res.status(400).send("존재하지 않는 회원입니다.");
    }

    // const d = new Date();

    // let year = d.getFullYear() + "";
    // let month = d.getMonth() + 1 + "";
    // let date = d.getDate() + "";
    // let hour = d.getHours() + "";
    // let min = d.getMinutes() + "";
    // let sec = d.getSeconds() + "";
    // let mSec = d.getMilliseconds() + "";

    // month = month < 10 ? "0" + month : month;
    // date = date < 10 ? "0" + date : date;
    // hour = hour < 10 ? "0" + hour : hour;
    // min = min < 10 ? "0" + min : min;
    // sec = sec < 10 ? "0" + sec : sec;
    // mSec = mSec < 10 ? "0" + mSec : mSec;

    // let orderPK = "USER_C" + year + month + date + hour + min + sec + mSec;

    // const getToken = await axios({
    //   url: "https://api.iamport.kr/users/getToken",
    //   method: "post", // POST method
    //   headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
    //   data: {
    //     imp_key: process.env.IMP_KEY, // REST API 키
    //     imp_secret: process.env.IMP_SECRET,
    //   },
    // });

    // const { access_token } = getToken.data.response; // 인증 토큰

    // const issueBilling = await axios({
    //   url: `https://api.iamport.kr/subscribe/customers/${orderPK}`,
    //   method: "post",
    //   headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    //   data: {
    //     card_number: cardNo, // 카드 번호
    //     expiry: cardDate, // 카드 유효기간
    //     birth: cardBirth, // 생년월일
    //     pwd_2digit: cardPassword, // 카드 비밀번호 앞 두자리
    //   },
    // });

    // const { code, message } = issueBilling.data;

    // if (code === 0) {
    const result = await User.update(
      {
        cardNo,
        cardDate,
        cardBirth,
        cardPassword,
        userCode,
        cardName,
      },
      {
        where: {
          id: parseInt(req.user.id),
        },
      }
    );
    return res.status(200).json({ result: true });
    // } else {
    //   // 빌링키 발급 실패
    //   return res.status(401).send(message);
    // }
  } catch (e) {
    console.error(e);
    return res.status(401).send("카드정보를 등록할 수 없습니다.");
  }
});

router.delete("/card/delete/:cardId", isLoggedIn, async (req, res, next) => {
  const { cardId } = req.body;

  try {
    if (cardId) {
      const exAddress = User.findOne({
        where: {
          id: parseInt(cardId),
        },
      });

      if (!exAddress) {
        return res.status(400).send("등록된 카드가 없습니다.");
      }
    }

    const result = await User.update(
      {
        isDelete: true,
      },
      {
        where: {
          id: parseInt(cardId),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/test", async (req, res, next) => {
  const { imp_uid } = req.body; // request의 body에서 imp_uid 추출
  try {
    // 인증 토큰 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API 키
        imp_secret: process.env.IMP_SECRET, // REST API Secret
      },
    });
    const { access_token } = getToken.data.response; // 인증 토큰

    // imp_uid로 인증 정보 조회
    const getCertifications = await axios({
      url: `https://api.iamport.kr/certifications/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });
    const certificationsInfo = getCertifications.data; // 조회한 인증 정보

    console.log(certificationsInfo);

    return res.status(200).json(certificationsInfo);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
