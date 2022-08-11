import React, { useState, useEffect, useCallback } from "react";
import {
  Wrapper,
  Text,
  Image,
  ATag,
  WholeWrapper,
  RsWrapper,
  TextInput,
} from "./commonComponents";
import { withResizeDetector } from "react-resize-detector";
import styled from "styled-components";
import Theme from "./Theme";
import { Drawer, message, Empty, Form } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT_REQUEST } from "../reducers/user";
import { MATERIAL_LIST_REQUEST, MATERIAL_USER_ADD } from "../reducers/material";
import useInput from "../hooks/useInput";
import { SEARCH_LIST_REQUEST } from "../reducers/search";

const CustomForm = styled(Form)`
  width: 100%;
  margin: 10px 0 0;

  & .ant-form-item {
    width: 100%;
  }
`;

const Dot = styled(Wrapper)`
  width: 4.5px;
  height: 4.5px;
  background: ${(props) => props.theme.white_C};
  border-radius: 100%;
`;

const ListWrapper = styled(Wrapper)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 5px;
  cursor: pointer;
`;

const DotWrapper = styled(Wrapper)`
  position: relative;
  cursor: pointer;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    height: 5px;
    background: ${(props) => props.theme.red_C};
    border-radius: 100%;
  }
`;

const AppHeader = ({ children, width }) => {
  const router = useRouter();
  ////////////// - USE STATE- ///////////////

  const { me, st_logoutDone, st_logoutError } = useSelector(
    (state) => state.user
  );

  const { searchRecipe, searchMaterial } = useSelector((state) => state.search);
  const { userMaterials } = useSelector((state) => state.material);

  const [headerScroll, setHeaderScroll] = useState(false);
  const [pageY, setPageY] = useState(0);

  const [userMaterialsArr, setUserMaterialsArr] = useState([]);

  // const documentRef = useRef(document);

  const [drawar, setDrawar] = useState(false);

  const dispatch = useDispatch();

  ///////////// - EVENT HANDLER- ////////////

  const drawarToggle = useCallback(() => {
    setDrawar(!drawar);
  });

  const handleScroll = useCallback(() => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const headerScroll = pageY && pageYOffset !== 0 && pageYOffset !== pageY;
    setHeaderScroll(headerScroll);
    setPageY(pageYOffset);
  });

  const moveLinkHandler = useCallback(
    (link) => {
      router.replace(link);
    },
    [router]
  );

  const logoutHandler = useCallback(() => {
    dispatch({
      type: LOGOUT_REQUEST,
    });
  }, []);

  const searchMaterialHandler = useCallback((data) => {
    dispatch({
      type: SEARCH_LIST_REQUEST,
      data: {
        search: data.searchName,
      },
    });
  }, []);

  const materialAddHandler = useCallback(
    (data) => {
      console.log(data);

      let seleteMaterialArr = userMaterials.map((data) => data);

      let checkArr = [];

      for (let i = 0; i < seleteMaterialArr.length; i++) {
        if (data.SearchMaterials) {
          for (let v = 0; v < data.SearchMaterials.length; v++) {
            if (
              seleteMaterialArr[i].id === data.SearchMaterials[v].MaterialId
            ) {
              checkArr.push("true");
            }
          }
        } else {
          if (seleteMaterialArr[i].id === data.id) {
            checkArr.push("true");
          }
        }
      }

      if (checkArr.length === 0) {
        data.SearchMaterials
          ? (sessionStorage.setItem("recipeName", data.name),
            data.SearchMaterials.map((value) =>
              seleteMaterialArr.push({
                id: value.MaterialId,
                name: value.Material.name,
                qnt: value.qnt,
                unit: value.unit,
                price: value.Material.price,
              })
            ))
          : seleteMaterialArr.push({
              id: data.id,
              name: data.name,
              qnt: 0,
              unit: data.unit,
              price: data.price,
            });
      } else {
        return message.error("이미 있는 재료입니다.");
      }

      setUserMaterialsArr(seleteMaterialArr);
      setDrawar(false);
    },
    [userMaterialsArr, userMaterials, drawar]
  );

  ////////////// - USE EFFECT- //////////////
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [pageY]);

  useEffect(() => {
    if (st_logoutError) {
      return message.error(st_logoutError);
    }
  }, [st_logoutError]);

  useEffect(() => {
    if (st_logoutDone) {
      router.push("/");
      setDrawar(false);
      return message.success("로그아웃 되었습니다.");
    }
  }, [st_logoutDone]);

  useEffect(() => {
    dispatch({
      type: MATERIAL_LIST_REQUEST,
      data: {
        name: "",
      },
    });
  }, []);

  useEffect(() => {
    if (userMaterialsArr) {
      dispatch({
        type: MATERIAL_USER_ADD,
        data: userMaterialsArr,
      });
    }
  }, [userMaterialsArr]);

  const headerView = [
    {
      router: "/",
      title: "주문목록",
    },
    {
      router: "/address",
      title: "나의주소록",
    },
    {
      router: "/promise",
      title: "약속처방",
    },
    {
      router: "/promise/detail/[id]",
      title: "약속처방",
    },
    {
      router: "/prescription",
      title: "처방하기",
    },
    {
      router: "/deliveryInfo/[id]",
      title: "배송정보",
    },
    {
      router: "/deliveryList",
      title: "배송조회",
    },
    {
      router: "/payInfo/[id]",
      title: "결제정보",
    },
    {
      router: "/notice",
      title: "공지사항",
    },
    {
      router: "/question",
      title: "문의하기",
    },
    {
      router: "/user/payment",
      title: "결제정보",
    },
    {
      router: "/user/myinfo",
      title: "계정관리",
    },
    {
      router: "/orderList/[id]",
      title: "주문내역",
    },
    {
      router: "/prescription-history",
      title: "처방내역확인",
    },
    {
      router: "/cart",
      title: "장바구니",
    },
    {
      router: "/deliveryList/[id]",
      title: "배송조회",
    },

    {
      router: "/find/findPw",
      title: "비밀번호 찾기",
    },
  ];
  return (
    <WholeWrapper height={`64px`} zIndex={`100`} position={`relative`}>
      {router.pathname === "/find/findPw" ? (
        <RsWrapper>
          <Wrapper
            fontSize={width < 800 ? `20px` : `26px`}
            fontWeight={`bold`}
            dr={`row`}
            ju={`flex-start`}
            cursor={`pointer`}
          >
            <Link href={`/login`}>
              <a>
                <Wrapper
                  width={`auto`}
                  color={Theme.grey2_C}
                  fontSize={`20px`}
                  margin={`0 10px 0 0`}
                >
                  <LeftOutlined />
                </Wrapper>
              </a>
            </Link>
            비밀번호 찾기
          </Wrapper>
        </RsWrapper>
      ) : router.pathname === "/join" ? (
        <RsWrapper>
          <Wrapper
            fontSize={width < 800 ? `20px` : `26px`}
            fontWeight={`bold`}
            dr={`row`}
            ju={`flex-start`}
            cursor={`pointer`}
          >
            <Link href={`/login`}>
              <a>
                <Wrapper
                  width={`auto`}
                  color={Theme.grey2_C}
                  fontSize={`20px`}
                  margin={`0 10px 0 0`}
                >
                  <LeftOutlined />
                </Wrapper>
              </a>
            </Link>
            회원가입
          </Wrapper>
        </RsWrapper>
      ) : router.pathname === "/login" ? (
        <RsWrapper>
          <Wrapper
            fontSize={width < 800 ? `20px` : `26px`}
            fontWeight={`bold`}
            dr={`row`}
            ju={`flex-start`}
            cursor={`pointer`}
          >
            로그인
          </Wrapper>
        </RsWrapper>
      ) : router.pathname === "/prescription" ? (
        <RsWrapper bgColor={Theme.basicTheme_C} color={Theme.white_C}>
          <Wrapper dr={`row`} ju={`space-between`}>
            <Text fontSize={width < 800 ? `20px` : `26px`} fontWeight={`bold`}>
              {headerView.map((data) => {
                return data.router === router.pathname && data.title;
              })}
            </Text>
            <SearchOutlined style={{ fontSize: 26 }} onClick={drawarToggle} />
          </Wrapper>

          {drawar && (
            <Drawer
              placement="right"
              onClose={drawarToggle}
              visible={drawarToggle}
              getContainer={false}
              closable={false}
            >
              <Wrapper>
                <RsWrapper bgColor={Theme.basicTheme_C} color={Theme.black_C}>
                  <Wrapper height={`64px`} dr={`row`} ju={`space-between`}>
                    <Wrapper width={`auto`} position={`relative`}>
                      <Wrapper
                        position={`absolute`}
                        top={`50%`}
                        left={`10px`}
                        width={`auto`}
                        color={Theme.basicTheme_C}
                        zIndex={`10`}
                        fontSize={`25px`}
                        margin={`-18px 0 0`}
                      >
                        <SearchOutlined />
                      </Wrapper>
                      <CustomForm onFinish={searchMaterialHandler}>
                        <Form.Item name="searchName">
                          <TextInput
                            radius={`10px`}
                            height={`45px`}
                            width={`300px`}
                            type={`text`}
                            placeholder={`약재 또는 처방 검색`}
                            padding={`0 0 0 45px`}
                          />
                        </Form.Item>
                      </CustomForm>
                    </Wrapper>
                    <Wrapper
                      width={`auto`}
                      bgColor={Theme.basicTheme_C}
                      color={Theme.white_C}
                      fontSize={`18px`}
                      zIndex={`10`}
                      onClick={drawarToggle}
                      cursor={`pointer`}
                      margin={`-10px 0 0`}
                    >
                      취소
                    </Wrapper>
                  </Wrapper>
                </RsWrapper>
              </Wrapper>
              <Wrapper padding={`0 38px`}>
                <Wrapper
                  padding={width < 800 ? `15px 10px` : `15px 38px`}
                  minHeight={`calc(100vh - 170px)`}
                  ju={`flex-start`}
                >
                  <Wrapper
                    padding={`20px`}
                    shadow={Theme.shadow_C}
                    radius={`20px`}
                  >
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      padding={`0 5px 10px`}
                    >
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`bold`}
                      >
                        약재
                      </Text>
                    </Wrapper>
                    <Wrapper>
                      {searchMaterial &&
                        (searchMaterial.length === 0 ? (
                          <Wrapper margin={`20px 0`} color={Theme.black_C}>
                            <Empty description="약재가 없습니다." />
                          </Wrapper>
                        ) : (
                          searchMaterial.map((data) => {
                            return (
                              <ListWrapper
                                borderBottom={`1px solid ${Theme.grey2_C}`}
                                onClick={() => materialAddHandler(data)}
                              >
                                <Wrapper
                                  dr={`row`}
                                  width={`auto`}
                                  fontSize={width < 600 ? `16px` : `18px`}
                                  color={`${Theme.black_C}`}
                                >
                                  <Text fontWeight={`800`}>{data.name}</Text>
                                </Wrapper>
                              </ListWrapper>
                            );
                          })
                        ))}
                    </Wrapper>
                  </Wrapper>

                  <Wrapper
                    padding={`20px`}
                    shadow={Theme.shadow_C}
                    radius={`20px`}
                  >
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      padding={`0 5px 10px`}
                    >
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`bold`}
                      >
                        레시피
                      </Text>
                    </Wrapper>
                    <Wrapper>
                      {searchRecipe &&
                        (searchRecipe.length === 0 ? (
                          <Wrapper margin={`20px 0`} color={Theme.black_C}>
                            <Empty description="레시피가 없습니다." />
                          </Wrapper>
                        ) : (
                          searchRecipe.map((data) => {
                            return (
                              <ListWrapper
                                borderBottom={`1px solid ${Theme.grey2_C}`}
                                onClick={() => materialAddHandler(data)}
                              >
                                <Wrapper
                                  dr={`row`}
                                  width={`auto`}
                                  fontSize={width < 600 ? `16px` : `18px`}
                                  color={`${Theme.black_C}`}
                                >
                                  <Text fontWeight={`800`}>{data.name}</Text>
                                </Wrapper>
                              </ListWrapper>
                            );
                          })
                        ))}
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Drawer>
          )}
        </RsWrapper>
      ) : (
        <RsWrapper bgColor={Theme.basicTheme_C} color={Theme.white_C}>
          <Wrapper dr={`row`} ju={`space-between`}>
            <Text fontSize={width < 800 ? `20px` : `26px`} fontWeight={`bold`}>
              {headerView.map((data) => {
                return data.router === router.pathname && data.title;
              })}
            </Text>

            <DotWrapper width={`26px`} onClick={drawarToggle}>
              <Dot />
              <Dot margin={`4px 0`} />
              <Dot />
            </DotWrapper>
          </Wrapper>
          {drawar && (
            <Drawer
              placement="right"
              closable={true}
              onClose={drawarToggle}
              visible={drawarToggle}
              getContainer={false}
            >
              <Wrapper>
                <Wrapper
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  height={`64px`}
                  borderBottom={`1px solid ${Theme.subTheme_C}`}
                ></Wrapper>
                <Wrapper
                  bgColor={Theme.basicTheme_C}
                  color={Theme.white_C}
                  padding={width < 800 ? `25px 20px 40px` : `25px 38px 40px`}
                >
                  {me ? (
                    <Wrapper dr={`row`} ju={`space-between`}>
                      <Wrapper
                        width={`auto`}
                        dr={`row`}
                        fontSize={width < 800 ? `16px` : `18px`}
                      >
                        <Image
                          alt="profile"
                          width={`50px`}
                          height={`50px`}
                          radius={`100%`}
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/thumbnail/detail_thumb.png`}
                        />
                        <Text
                          fontSize={`20px`}
                          fontWeight={`bold`}
                          margin={`0 2px 0 10px`}
                        >
                          {me.username}
                        </Text>
                        님
                      </Wrapper>
                      <Wrapper
                        width={`auto`}
                        dr={`row`}
                        fontSize={`14px`}
                        color={Theme.grey2_C}
                      >
                        <Text
                          margin={`0 10px 0 0`}
                          cursor={`pointer`}
                          onClick={() => moveLinkHandler("/user/myinfo")}
                        >
                          계정관리
                        </Text>
                        <Text cursor={`pointer`} onClick={logoutHandler}>
                          로그아웃
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  ) : (
                    <Wrapper dr={`row`} ju={`space-between`}>
                      <Wrapper
                        width={`auto`}
                        dr={`row`}
                        fontSize={width < 800 ? `16px` : `18px`}
                      ></Wrapper>
                      <Wrapper
                        width={`auto`}
                        dr={`row`}
                        fontSize={`14px`}
                        color={Theme.grey2_C}
                      >
                        <Text
                          cursor={`pointer`}
                          margin={`0 10px 0 0`}
                          onClick={() => moveLinkHandler("/login")}
                        >
                          로그인
                        </Text>
                        <Text
                          cursor={`pointer`}
                          onClick={() => moveLinkHandler("/join")}
                        >
                          회원가입
                        </Text>
                      </Wrapper>
                    </Wrapper>
                  )}
                </Wrapper>
                <Wrapper padding={width < 800 ? `0 20px` : `0 38px`}>
                  <Wrapper
                    radius={`15px`}
                    bgColor={Theme.white_C}
                    color={Theme.black_C}
                    shadow={Theme.shadow_C}
                    margin={`-20px 0 0`}
                    padding={width < 800 ? `30px` : `50px`}
                  >
                    <Link href={`/promise`}>
                      <ATag al={`flex-start`} onClick={drawarToggle}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 0 20px`}
                        >
                          <Image
                            alt="icon"
                            width={`26px`}
                            height={`26px`}
                            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/1.jar.png`}
                          />
                          <Text
                            fontSize={width < 800 ? `16px` : `18px`}
                            margin={`0 0 0 30px`}
                          >
                            약속처방
                          </Text>
                        </Wrapper>
                      </ATag>
                    </Link>
                    {/* ====== 탕전처방 ====== */}
                    <Link href={`/prescription`}>
                      <ATag al={`flex-start`} onClick={drawarToggle}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          padding={`0 0 20px`}
                          margin={`0 0 20px`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                        >
                          <Image
                            alt="icon"
                            width={`26px`}
                            height={`26px`}
                            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/2.prescript.png`}
                          />
                          <Text
                            fontSize={width < 800 ? `16px` : `18px`}
                            margin={`0 0 0 30px`}
                          >
                            처방하기
                          </Text>
                        </Wrapper>
                      </ATag>
                    </Link>
                    {/* ====== 탕전처방 ====== */}
                    {me && (
                      <>
                        <Link href={`/`}>
                          <ATag al={`flex-start`} onClick={drawarToggle}>
                            <Wrapper
                              dr={`row`}
                              ju={`flex-start`}
                              margin={`0 0 20px`}
                            >
                              <Image
                                alt="icon"
                                width={`26px`}
                                height={`26px`}
                                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/3.list.png`}
                              />
                              <Text
                                fontSize={width < 800 ? `16px` : `18px`}
                                margin={`0 0 0 30px`}
                              >
                                주문조회
                              </Text>
                            </Wrapper>
                          </ATag>
                        </Link>
                      </>
                    )}
                    <Link href={`/notice`}>
                      <ATag al={`flex-start`} onClick={drawarToggle}>
                        <Wrapper
                          dr={`row`}
                          ju={`flex-start`}
                          margin={`0 0 20px`}
                        >
                          <Image
                            alt="icon"
                            width={`26px`}
                            height={`26px`}
                            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/5.megaphone.png`}
                          />
                          <Text
                            fontSize={width < 800 ? `16px` : `18px`}
                            margin={`0 0 0 30px`}
                          >
                            공지사항
                          </Text>
                        </Wrapper>
                      </ATag>
                    </Link>
                    <Link href={`/question`}>
                      <ATag al={`flex-start`} onClick={drawarToggle}>
                        <Wrapper dr={`row`} ju={`flex-start`}>
                          <Image
                            alt="icon"
                            width={`26px`}
                            height={`26px`}
                            src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/6.consult.png`}
                          />
                          <Text
                            fontSize={width < 800 ? `16px` : `18px`}
                            margin={`0 0 0 30px`}
                          >
                            문의하기
                          </Text>
                        </Wrapper>
                      </ATag>
                    </Link>
                  </Wrapper>
                  <Wrapper
                    radius={`15px`}
                    bgColor={Theme.white_C}
                    color={Theme.black_C}
                    shadow={Theme.shadow_C}
                    margin={`15px 0 0`}
                    padding={`30px`}
                    dr={`row`}
                  >
                    <Image
                      alt="icon"
                      width={`55px`}
                      height={`55px`}
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/menu_icon/public-number.png`}
                    />
                    <Wrapper
                      width={`calc(100% - 55px)`}
                      al={`flex-start`}
                      padding={`0 0 0 30px`}
                    >
                      <Text
                        fontSize={width < 800 ? `16px` : `18px`}
                        fontWeight={`bold`}
                      >
                        대표번호
                      </Text>
                      <Text
                        fontSize={width < 800 ? `20px` : `24px`}
                        fontWeight={`bold`}
                        color={Theme.basicTheme_C}
                      >
                        02-466-1575
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Drawer>
          )}
        </RsWrapper>
      )}
    </WholeWrapper>
  );
};

export default withResizeDetector(AppHeader);
