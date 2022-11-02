import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../../reducers/user";
import ClientLayout from "../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  Image,
  CommonButton,
  ATag,
  CommonCheckBox,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { Checkbox, Empty, message, Popconfirm } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import { WISH_DELETE_REQUEST, WISH_LIST_REQUEST } from "../../reducers/wish";

const Cart = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { me } = useSelector((state) => state.user);

  const {
    wishList,
    st_wishListError,
    //
    st_wishDeleteLoading,
    st_wishDeleteDone,
    st_wishDeleteError,
  } = useSelector((state) => state.wish);

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [itemSelect, setItemSelect] = useState([]);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

  // 리스트
  useEffect(() => {
    if (me && st_wishListError) {
      return message.error(st_wishListError);
    }
  }, [st_wishListError]);

  // 삭제

  useEffect(() => {
    if (st_wishDeleteDone) {
      dispatch({
        type: WISH_LIST_REQUEST,
      });

      setItemSelect([]);

      return message.success("삭제되었습니다.");
    }
  }, [st_wishDeleteDone]);

  useEffect(() => {
    if (st_wishDeleteError) {
      return message.error(st_wishDeleteError);
    }
  }, [st_wishDeleteError]);

  ////// TOGGLE //////
  ////// HANDLER //////

  const itemSelectHandler = useCallback(
    (data) => {
      let itemSelectArr = itemSelect.map((data) => data);

      if (itemSelectArr.find((value) => value.id === data.id)) {
        setItemSelect(itemSelectArr.filter((value) => value.id !== data.id));
        return;
      }

      itemSelectArr.push(data);

      setItemSelect(itemSelectArr);
    },
    [itemSelect]
  );

  const deleteHandler = useCallback(() => {
    dispatch({
      type: WISH_DELETE_REQUEST,
      data: {
        idArr: itemSelect,
      },
    });
  }, [itemSelect]);

  const updateHandler = useCallback((data, link) => {
    if (data.isPayment) {
      sessionStorage.setItem("paymentUpdate", JSON.stringify(data));
    } else {
      sessionStorage.setItem("preUpdate", JSON.stringify(data));
    }
    router.push(link);
  }, []);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  ////// DATAVIEW //////

  return (
    <>
      <ClientLayout>
        <WholeWrapper>
          <RsWrapper
            minHeight={`calc(100vh - 64px)`}
            ju={`flex-start`}
            position={`relative`}
            padding={`0`}
          >
            <Wrapper
              height={`64px`}
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `0px 10px` : `0px 38px`}
              dr={`row`}
            >
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/1.prescrip.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
                  처방정보
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/2.cart.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
                  장바구니
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/3.delivery_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  배송정보
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/4.card_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  결제정보
                </Text>
              </Wrapper>
            </Wrapper>
            <Wrapper
              padding={width < 800 ? `15px 10px` : `15px 38px`}
              minHeight={`calc(100vh - 170px)`}
              ju={`flex-start`}
            >
              <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 15px`}>
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  장바구니
                </Text>
                <Popconfirm
                  placement="topRight"
                  title={`정말 삭제하시겠습니까?`}
                  okText={`삭제`}
                  cancelText={`취소`}
                  onConfirm={deleteHandler}
                  okButtonProps={{ loading: st_wishDeleteLoading }}
                >
                  <Image
                    alt="icon"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/garbage.png`}
                    width={`16px`}
                  />
                </Popconfirm>
              </Wrapper>

              <Wrapper
                minHeight={`calc(100vh - 185px - 75px)`}
                ju={`flex-start`}
              >
                <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                  {wishList &&
                    (wishList.length === 0 ? (
                      <Wrapper>
                        <Empty description={`담겨있는 상품이 없습니다.`} />
                      </Wrapper>
                    ) : (
                      wishList.map((data, idx) => {
                        return (
                          <Wrapper
                            width={
                              width < 1100
                                ? width < 700
                                  ? `100%`
                                  : `calc(100% / 2 - 16px)`
                                : `calc(100% / 3 - 16px)`
                            }
                            key={idx}
                            radius={`20px`}
                            shadow={Theme.shadow_C}
                            padding={`15px`}
                            al={`flex-start`}
                            margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
                          >
                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              margin={`15px 0`}
                            >
                              <Wrapper dr={`row`} width={`auto`}>
                                <CommonCheckBox
                                  style={{ alignItems: "center" }}
                                  checked={itemSelect.find(
                                    (value) =>
                                      value.id === data.id &&
                                      (data.isPayment
                                        ? "payment" === value.type
                                        : "pre" === value.type)
                                  )}
                                  onChange={() =>
                                    itemSelectHandler({
                                      id: data.id,
                                      type: data.isPayment ? "payment" : "pre",
                                    })
                                  }
                                >
                                  <Wrapper
                                    width={`auto`}
                                    al={`flex-start`}
                                    margin={`0 0 0 15px`}
                                  >
                                    <Text fontSize={`18px`} fontWeight={`bold`}>
                                      {data.title}
                                    </Text>
                                    <Text fontSize={`16px`}>
                                      {data.receiverName}
                                    </Text>
                                  </Wrapper>
                                </CommonCheckBox>
                              </Wrapper>
                              <Wrapper
                                dr={`row`}
                                width={`auto`}
                                fontSize={width < 800 ? `16px` : `18px`}
                              >
                                <Text fontWeight={`bold`}>
                                  {data.totalPrice}
                                </Text>
                                <Text>원</Text>
                              </Wrapper>
                            </Wrapper>
                            {data.isPayment ? (
                              <Wrapper
                                dr={`row`}
                                color={Theme.grey_C}
                                borderTop={`1px solid ${Theme.grey2_C}`}
                                padding={`10px 0 0`}
                              >
                                <Wrapper
                                  width={`calc(100% / 2)`}
                                  borderRight={`1px solid ${Theme.grey2_C}`}
                                  cursor={`pointer`}
                                  onClick={() =>
                                    updateHandler(
                                      data,
                                      `/promise/detail/${data.paymentId}?type=update`
                                    )
                                  }
                                >
                                  주문수정
                                </Wrapper>
                                <Link
                                  href={`/prescription-history/${
                                    data.id
                                  }?type=${data.isPayment ? "payment" : "pre"}`}
                                >
                                  <ATag width={`calc(100% / 2)`}>
                                    <Wrapper>내역확인</Wrapper>
                                  </ATag>
                                </Link>
                              </Wrapper>
                            ) : (
                              <Wrapper
                                dr={`row`}
                                color={Theme.grey_C}
                                borderTop={`1px solid ${Theme.grey2_C}`}
                                padding={`10px 0 0`}
                              >
                                <Wrapper
                                  width={`calc(100% / 2)`}
                                  borderRight={`1px solid ${Theme.grey2_C}`}
                                  cursor={`pointer`}
                                  onClick={() =>
                                    updateHandler(
                                      data,
                                      `/prescription?type=update`
                                    )
                                  }
                                >
                                  약재수정
                                </Wrapper>
                                <Link
                                  href={`/prescription-history/${
                                    data.id
                                  }?type=${data.isPayment ? "payment" : "pre"}`}
                                >
                                  <ATag width={`calc(100% / 2)`}>
                                    <Wrapper>내역확인</Wrapper>
                                  </ATag>
                                </Link>
                              </Wrapper>
                            )}
                          </Wrapper>
                        );
                      })
                    ))}
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper
              height={`50px`}
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}
              bgColor={Theme.white_C}
            >
              <Wrapper
                height={`100%`}
                dr={`row`}
                width={
                  width < 800 ? `calc(100% - 130px)` : `calc(100% - 170px)`
                }
                ju={`flex-start`}
                padding={width < 800 ? `0 10px` : `0 38px`}
                fontSize={width < 800 ? `15px` : `20px`}
              >
                <Text fontWeight={`bold`}>총 주문금액 : </Text>
                <Text fontWeight={`bold`}> 432,000</Text>
              </Wrapper>
              <CommonButton
                shadow={`0`}
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
              >
                주문하기
              </CommonButton>
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>
      </ClientLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // SSR Cookie Settings For Data Load/////////////////////////////////////
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    ////////////////////////////////////////////////////////////////////////
    // 구현부

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: WISH_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Cart;
