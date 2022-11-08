const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
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
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const router = express.Router();

try {
  fs.accessSync("uploads");
} catch (error) {
  console.log(
    "uploads 폴더가 존재하지 않습니다. 새로 uploads 폴더를 생성합니다."
  );
  fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_Id,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.S3_BUCKET_NAME,
    key(req, file, cb) {
      cb(
        null,
        `${
          process.env.S3_STORAGE_FOLDER_NAME
        }/original/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post("/file", upload.single("file"), async (req, res, next) => {
  try {
    return res.status(200).json({ path: req.file.location });
  } catch (e) {
    console.error(e);
    return res.status(400).send("첨부파일을 업로드 할 수 없습니다.");
  }
});

router.post("/list", isAdminCheck, async (req, res, next) => {
  const { email, name, isStop, isPermission } = req.body;

  const _email = email ? email : ``;
  const _name = name ? name : ``;

  const _isStop = parseInt(isStop) || 3;
  const _isPermission = parseInt(isPermission) || 3;

  const selectQuery = `
SELECT 	ROW_NUMBER() OVER(ORDER BY createdAt)	AS	num,
   			id,
   			email,
   			username,
   			nickname,
   			mobile,
   			level,
   			CASE
   				WHEN	level = 1 THEN "일반회원"
   				WHEN	level = 2 THEN "비어있음"
   				WHEN	level = 3 THEN "운영자"
   				WHEN	level = 4 THEN "최고관리자"
   				WHEN	level = 5 THEN "개발사"
   			END										AS	viewLevel,
   			companyName,
   			companyNo,
   			isCompany,
   			companyFile,
   			businessFile,
   			operatorLevel,
   			isRefusal,
   			resusalReason,
   			licenseNo,
   			cardNo,
   			cardPassword,
   			cardBirth,
   			userCode,
   			cardName,
   			payInfo,
   			isExit,
   			createdAt,
   			updatedAt,
   			DATE_FORMAT(createdAt, "%Y년 %m월 %d일")	AS viewCreatedAt,
   			DATE_FORMAT(updatedAt, "%Y년 %m월 %d일")	AS viewUpdatedAt,
   			isStop,
   			isPermission,
   			DATE_FORMAT(stopedAt, "%Y년 %m월 %d일")	AS viewStopedAt,
   			DATE_FORMAT(permitedAt, "%Y년 %m월 %d일")	AS viewPermitedAt,
        isMonthPay,
        monthPaidAt,
        DATE_FORMAT(monthPaidAt, "%Y년 %m월 %d일")	AS viewMonthPaidAt,
        discountPrice
  FROM	users
 WHERE  1 = 1
   AND  email LIKE '%${_email}%'
   AND  username LIKE '%${_name}%'
   ${
     _isStop === 1
       ? `AND isStop = 0`
       : _isStop === 2
       ? `AND isStop = 1`
       : _isStop === 3
       ? ``
       : ``
   }
   ${
     _isPermission === 1
       ? `AND isPermission = 0`
       : _isPermission === 2
       ? `AND isPermission = 1`
       : _isPermission === 3
       ? ``
       : ``
   }
 ORDER	BY num DESC
  `;

  try {
    const list = await models.sequelize.query(selectQuery);

    return res.status(200).json(list[0]);
  } catch (error) {
    console.error(error);
    return res.status(401).send("사용자 목록을 불러올 수 없습니다.");
  }
});

router.get("/signin", async (req, res, next) => {
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  console.log(req.user);
  console.log("❌❌❌❌❌❌❌❌❌❌❌❌❌❌");
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password", "secret"],
        },
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
        attributes: {
          exclude: ["password", "secret"],
        },
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
        attributes: {
          exclude: ["password", "secret"],
        },
      });

      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
  const { email, username, nickname, mobile, password, terms, businessFile } =
    req.body;

  if (!terms) {
    return res.status(401).send("이용약관에 동의해주세요.");
  }

  try {
    const exUser = await User.findOne({
      where: {
        email,
        isExit: false,
      },
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
      businessFile,
      password: hashedPassword,
    });

    res.status(201).send("SUCCESS");
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// 회원별 할인 금액 수정 라우터
router.post("/discount/update", isAdminCheck, async (req, res, next) => {
  const { id, discountPrice } = req.body;

  const updateQuery = `
  UPDATE  users
     SET  discountPrice = ${discountPrice},
          updatedAt = NOW()
   WHERE  id = ${id}
  `;

  try {
    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("회원정보를 수정할 수 없습니다.");
  }
});
// 월말결제 토글 라우터
router.post("/monthPay/toggle", isAdminCheck, async (req, res, next) => {
  const { id, isMonthPay } = req.body;

  const updateQuery = `
  UPDATE  users
     SET  isMonthPay = ${isMonthPay},
          monthPaidAt = NOW()
   WHERE  id = ${id}
  `;

  try {
    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("회원정보를 수정할 수 없습니다.");
  }
});

router.post("/permission", isAdminCheck, async (req, res, next) => {
  const { id } = req.body;

  const findQuery = `
  SELECT  id
    FROM  users
   WHERE  id = ${id}
  `;

  const updateQuery = `
  UPDATE  users
     SET  isPermission = 1,
          permitedAt = NOW()
   WHERE  id = ${id}
  `;

  try {
    const findResult = await models.sequelize.query(findQuery);

    if (findResult[0].length === 0) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    if (findResult[0][0].isPermission) {
      return res.status(401).send("이미 승인된 회원입니다.");
    }

    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("회원을 승인할 수 없습니다.");
  }
});

router.post("/stop/update", isAdminCheck, async (req, res, next) => {
  const { id, isStop } = req.body;

  const findQuery = `
  SELECT  *
    FROM  users
   WHERE  id = ${id}
  `;

  const updateQuery = `
  UPDATE  users
     SET  isStop = ${isStop},
          stopedAt = NOW()
   WHERE  id = ${id}
  `;

  try {
    const findResult = await models.sequelize.query(findQuery);

    if (findResult[0].length === 0) {
      return res.status(401).send("존재하지 않는 사용자입니다.");
    }

    const updateResult = await models.sequelize.query(updateQuery);

    return res.status(200).json({ result: true });
  } catch (error) {
    console.error(error);
    return res.status(401).send("회원을 정지 처리할 수 없습니다.");
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
    const exUser = await User.findOne({
      where: {
        id: parseInt(id),
        isExit: false,
      },
    });

    if (!exUser) {
      return res.status(401).send("존재하지 않는 사용자 입니다.");
    }

    await User.update(
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
        isExit: false,
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

router.post("/checkCode", async (req, res, next) => {
  const { email, checkCode } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
        isExit: false,
      },
    });

    if (exUser) {
      return res.status(401).send("이미 가입된 이메일 입니다.");
    }

    await sendSecretMail(
      email,
      `🔐 [보안 인증코드 입니다.] 미올한방병원 에서 회원가입을 위한 보안인증 코드를 발송했습니다.`,
      `
      <div>
        <h3>미올한방병원</h3>
        <hr />
        <p>보안 인증코드를 발송해드립니다. 미올한방병원 홈페이지의 인증코드 입력란에 정확히 입력해주시기 바랍니다.</p>
        <p>인증코드는 [<strong>${checkCode}</strong>] 입니다. </p>

        <br /><hr />
        <article>
          발송해드린 인증코드는 외부로 유출하시거나, 유출 될 경우 개인정보 침해의 위험이 있으니, 필히 본인만 사용하며 타인에게 양도하거나 알려주지 마십시오.
        </article>
      </div>
      `
    );

    return res.status(200).json({ result: true });
  } catch (error) {
    console.log(error);
    return res.status(401).send("인증번호를 보낼 수 없습니다.");
  }
});

router.post("/modifypass", async (req, res, next) => {
  const { email } = req.body;

  try {
    // const cookieEmail = req.user.dataValues.email;

    // if (email === cookieEmail) {
    // const currentUserId = req.user.dataValues.id;

    const UUID = generateUUID();

    const updateResult = await User.update(
      { secret: UUID },
      {
        where: { email },
      }
    );

    if (updateResult[0] > 0) {
      // 이메일 전송

      await sendSecretMail(
        email,
        `🔐 [보안 인증코드 입니다.] 미올한방병원 에서 비밀번호 변경을 위한 보안인증 코드를 발송했습니다.`,
        `
          <div>
            <h3>미올한방병원</h3>
            <hr />
            <p>보안 인증코드를 발송해드립니다. 미올한방병원 홈페이지의 인증코드 입력란에 정확히 입력해주시기 바랍니다.</p>
            <p>인증코드는 [<strong>${UUID}</strong>] 입니다. </p>

            <br /><hr />
            <article>
              발송해드린 인증코드는 외부로 유출하시거나, 유출 될 경우 개인정보 침해의 위험이 있으니, 필히 본인만 사용하며 타인에게 양도하거나 알려주지 마십시오.
            </article>
          </div>
          `
      );

      return res.status(200).json({ secretCode: UUID });
    } else {
      return res
        .status(401)
        .send("요청이 올바르지 않습니다. 다시 시도해주세요.");
    }
    // } else {
    //   return res
    //     .status(401)
    //     .send("입력하신 정보가 잘못되었습니다. 다시 확인해주세요.");
    // }
  } catch (error) {
    console.error(error);
    return res.status(401).send("잘못된 요청 입니다. [CODE097]");
  }
});

router.patch("/modifypass/update", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const exUser = await User.findOne({
      where: {
        email,
        isExit: false,
      },
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
        where: { email },
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
      where: {
        id: parseInt(selectUserId),
        isExit: false,
      },
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
            isExit: false,
          },
        });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      // if (companyNo) {
      //   const exCompany = await User.findOne({
      //     where: {
      //       companyNo,
      //     },
      //   });

      //   if (exCompany) {
      //     return res.status(401).send("신청을 한 회원입니다.");
      //   }
      // }

      const result = await User.update(
        {
          companyName,
          companyNo,
          companyFile,
          isCompany: true,
        },
        {
          where: {
            id: parseInt(id),
          },
        }
      );

      return res.status(200).json({ result: true });
    } catch (e) {
      console.error(e);
      return res.status(401).send("잘못된 요청 입니다.");
    }
  }),

  router.patch("/company/refusal", isAdminCheck, async (req, res, next) => {
    const { id, resusalReason } = req.body;

    try {
      if (id) {
        const exUser = await User.findOne({
          id,
          isExit: false,
        });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      await User.update(
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
        const exUser = await User.findOne({
          id,
          isExit: false,
        });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }

      await User.update(
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
        const exUser = await User.findOne({
          id,
          isExit: false,
        });

        if (!exUser) {
          return res.status(401).send("존재하지 않는 회원입니다.");
        }
      }
      await User.update(
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

router.post("/licenseNo/update", isAdminCheck, async (req, res, next) => {
  const { id, licenseNo } = req.body;

  try {
    const result = await User.update(
      {
        licenseNo,
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
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.get("/card/detail", isLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
        isExit: false,
      },
    });

    if (!exUser) {
      return res.status(400).send("회원이 없습니다.");
    }

    const selectQuery = `
    SELECT  cardNo,
		        cardDate,
		        cardName
      FROM  users
     WHERE  userCode IS NOT NULL
       AND  id = ${req.user.id};
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
    const exUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
        isExit: false,
      },
    });

    if (!exUser) {
      return res.status(400).send("존재하지 않는 회원입니다.");
    }

    const d = new Date();

    let year = d.getFullYear() + "";
    let month = d.getMonth() + 1 + "";
    let date = d.getDate() + "";
    let hour = d.getHours() + "";
    let min = d.getMinutes() + "";
    let sec = d.getSeconds() + "";
    let mSec = d.getMilliseconds() + "";

    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    mSec = mSec < 10 ? "0" + mSec : mSec;

    let orderPK = "USER_C" + year + month + date + hour + min + sec + mSec;

    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IMP_KEY, // REST API 키
        imp_secret: process.env.IMP_SECRET,
      },
    });

    const { access_token } = getToken.data.response; // 인증 토큰

    const issueBilling = await axios({
      url: `https://api.iamport.kr/subscribe/customers/${orderPK}`,
      method: "post",
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
      data: {
        card_number: cardNo, // 카드 번호
        expiry: cardDate, // 카드 유효기간
        birth: cardBirth, // 생년월일
        pwd_2digit: cardPassword, // 카드 비밀번호 앞 두자리
      },
    });

    const { code, message } = issueBilling.data;

    if (code === 0) {
      const result = await User.update(
        {
          cardNo,
          cardDate,
          cardBirth,
          cardPassword,
          userCode: orderPK,
        },
        {
          where: {
            id: parseInt(req.user.id),
          },
        }
      );

      if (result[0] > 0) {
        return res.status(200).json({ result: true });
      } else {
        return res.status(200).json({ result: false });
      }
    } else {
      // 빌링키 발급 실패
      console.error(message);
      return res.status(401).send("카드정보를 등록할 수 없습니다.");
    }
  } catch (e) {
    console.error(e);
    return res.status(401).send("카드정보를 등록할 수 없습니다.");
  }
});

router.delete("/card/delete/:cardId", isLoggedIn, async (req, res, next) => {
  const { cardId } = req.body;

  try {
    if (cardId) {
      const exAddress = await User.findOne({
        where: {
          id: parseInt(cardId),
          isExit: false,
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

router.patch("/exit", isLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        id: parseInt(req.user.id),
        isExit: false,
      },
    });

    if (!exUser) {
      return res.status(400).send("존재하지 않는 회원입니다.");
    }

    await User.update(
      {
        isExit: true,
      },
      {
        where: {
          id: parseInt(req.user.id),
        },
      }
    );

    return res.status(200).json({ result: true });
  } catch (e) {
    console.error(e);
    return res.status(400).send("잘못된 요청입니다.");
  }
});

router.post("/bought/list", isLoggedIn, async (req, res, next) => {
  const { startDate, endDate, productName } = req.body;

  const _startDate = startDate || null;
  const _endDate = endDate || null;
  const _productName = productName || "";

  const selectQuery = `
  SELECT  Z.id,
        Z.productName,
        Z.completedAt,
        Z.deliveryNo,
        Z.receiveUser,
        Z.receiveMobile,
        Z.receiveAddress,
        Z.receiveDetailAddress,
        Z.sendUser,
        Z.sendMobile,
        Z.sendAddress,
        Z.sendDetailAddress,
        Z.deliveryCompany,
        Z.viewCompletedAt,
        Z.orderAt,
        Z.createdAt,
        Z.username,
        Z.email,
        Z.mobile,
        Z.nickname,
        Z.companyName,
        Z.companyNo,
        Z.paymentType,
        Z.viewDeliveryStatus,
        Z.prescriptionId
  FROM  (
       	SELECT  p.id,
              	p.productName,
              	p.completedAt,
              	p.deliveryNo,
              	p.receiveUser,
              	p.receiveMobile,
              	p.receiveAddress,
              	p.receiveDetailAddress,
              	p.sendUser,
              	p.sendMobile,
              	p.sendAddress,
              	p.sendDetailAddress,
              	p.deliveryCompany,
              	DATE_FORMAT(p.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS viewCompletedAt,
              	DATE_FORMAT(p.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
              	p.createdAt,
              	u.username,
              	u.email,
              	u.mobile,
              	u.nickname,
              	u.companyName,
              	u.companyNo,
              	"payment"												                        AS paymentType,	
                CASE
                    WHEN	p.deliveryStatus = 0 AND p.isNobank = 1 THEN "결제 완료"
                    WHEN	p.deliveryStatus = 0 AND p.isNobank = 0 AND p.payInfo = "nobank" THEN "입금 대기"
                    WHEN	p.deliveryStatus = 1 THEN "배송 준비중"
                    WHEN	p.deliveryStatus = 2 THEN "집화 완료"
                    WHEN	p.deliveryStatus = 3 THEN "배송 중"
                    WHEN	p.deliveryStatus = 4 THEN "지점 도착"
                    WHEN	p.deliveryStatus = 5 THEN "배송 출발"
                    WHEN	p.deliveryStatus = 6 THEN "배송 완료"
                    ELSE	p.deliveryStatus
                END	                                                    AS viewDeliveryStatus,
                p.prescriptionId                                         
          FROM  payment p
          JOIN  users u
            ON  u.id = p.UserId
         WHERE  u.id = ${req.user.id}
           AND  p.payInfo IS NOT NULL
           AND  p.sendUser IS NOT NULL
         UNION ALL
      	SELECT  ppr.id,
                ppr.name													AS productName,
                ppr.completedAt,
                ppr.deliveryNo,
                ppr.receiveUser,
                ppr.receiveMobile,
                ppr.receiveAddress,
                ppr.receiveDetailAddress,
                ppr.sendUser,
                ppr.sendMobile,
                ppr.sendAddress,
                ppr.sendDetailAddress,
                ppr.deliveryCompany,
                DATE_FORMAT(ppr.completedAt, "%Y년 %m월 %d일 %H시 %i분") 	   AS viewCompletedAt,
                DATE_FORMAT(ppr.createdAt, "%Y년 %m월 %d일 %H시 %i분") 	     AS orderAt,
                ppr.createdAt,
                u.username,
                u.email,
                u.mobile,
                u.nickname,
                u.companyName,
                u.companyNo,
                "ppr"												                              AS paymentType,
                CASE
                    WHEN	ppr.deliveryStatus = 0 AND ppr.isNobank = 1 THEN "결제 완료"
                    WHEN	ppr.deliveryStatus = 0 AND ppr.isNobank = 0 AND ppr.payInfo = "nobank" THEN "입금 대기"
                    WHEN	ppr.deliveryStatus = 1 THEN "배송 준비중"
                    WHEN	ppr.deliveryStatus = 2 THEN "집화 완료"
                    WHEN	ppr.deliveryStatus = 3 THEN "배송 중"
                    WHEN	ppr.deliveryStatus = 4 THEN "지점 도착"
                    WHEN	ppr.deliveryStatus = 5 THEN "배송 출발"
                    WHEN	ppr.deliveryStatus = 6 THEN "배송 완료"
                    ELSE	ppr.deliveryStatus
                END	                                                     AS viewDeliveryStatus,
                0                                                        AS prescriptionId
          FROM  prescriptionPaymentRequest ppr
          JOIN  users u
          	ON  u.id = ppr.UserId
         WHERE  u.id = ${req.user.id}
           AND  ppr.payInfo IS NOT NULL
           AND  ppr.sendUser IS NOT NULL
      	 )				Z
      	 WHERE  1 = 1
           AND  Z.productName LIKE '%${_productName}%'
           ${
             _startDate
               ? `AND  DATE_FORMAT(Z.createdAt, '%Y-%m-%d') >= DATE_FORMAT('${_startDate}', '%Y-%m-%d') `
               : ``
           }
          ${
            _endDate
              ? `AND  DATE_FORMAT(Z.createdAt, '%Y-%m-%d') <= DATE_FORMAT('${_endDate}', '%Y-%m-%d') `
              : ``
          }
         ORDER  BY  Z.createdAt DESC
  `;

  try {
    const reuslt = await models.sequelize.query(selectQuery);

    return res.status(200).json({ list: reuslt[0] });
  } catch (e) {
    console.error(e);
    return res.status(400).send("주문목록을 불러올 수 없습니다.");
  }
});

module.exports = router;
