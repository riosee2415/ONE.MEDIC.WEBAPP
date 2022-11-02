import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import ClientLayout from "../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  ATag,
  CommonButton,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { message } from "antd";
import {
  WISH_PAYMENT_DETAIL_REQUEST,
  WISH_PRE_DETAIL_REQUEST,
} from "../../reducers/wish";
import { numberWithCommas } from "../../components/commonUtils";

const PrescriptionHistory = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const {
    wishPaymentDetail,
    wishPreDetail,
    //
    st_wishPaymentDetailError,
    st_wishPreDetailError,
  } = useSelector((state) => state.wish);

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  ////// REDUX //////
  ////// USEEFFECT //////

  console.log(wishPaymentDetail);
  console.log(wishPreDetail);

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

  useEffect(() => {
    if (router.query) {
      if (router.query.type === "payment") {
        dispatch({
          type: WISH_PAYMENT_DETAIL_REQUEST,
          data: {
            containerId: router.query.id,
          },
        });
      } else if (router.query.type === "pre") {
        dispatch({
          type: WISH_PRE_DETAIL_REQUEST,
          data: {
            wishPrescriptrionId: router.query.id,
          },
        });
      }
    }
  }, [router.query]);

  // 약속처방 상세
  useEffect(() => {
    if (me && st_wishPaymentDetailError) {
      return message.error(st_wishPaymentDetailError);
    }
  }, [st_wishPaymentDetailError]);

  // 탕전처방 상세
  useEffect(() => {
    if (me && st_wishPreDetailError) {
      return message.error(st_wishPreDetailError);
    }
  }, [st_wishPreDetailError]);

  ////// TOGGLE //////
  ////// HANDLER //////

  ////// DATAVIEW //////

  return (
    <>
      <ClientLayout>
        <WholeWrapper>
          <RsWrapper ju={`flex-start`} position={`relative`} padding={`0`}>
            <Wrapper
              minHeight={`calc(100vh - 120px)`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              dr={`row`}
              al={`flex-start`}
            >
              <Wrapper>
                {router.query &&
                  (router.query.type === "payment" && wishPaymentDetail ? (
                    // 약속처방
                    <>
                      <Wrapper
                        borderBottom={`1px solid ${Theme.grey2_C}`}
                        padding={`10px 0`}
                        al={`flex-start`}
                        ju={`flex-start`}
                      >
                        <Wrapper dr={`row`} ju={`space-between`}>
                          <Text
                            fontSize={width < 800 ? `16px` : `18px`}
                            fontWeight={`bold`}
                          >
                            요청사항
                          </Text>
                          <Text>{wishPaymentDetail.productname}</Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-end`}>
                          <Text>{wishPaymentDetail.receiverName}</Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-end`}>
                          <Text>{wishPaymentDetail.medication}</Text>
                        </Wrapper>
                        <Wrapper dr={`row`} ju={`flex-end`}>
                          <Text>{wishPaymentDetail.content}</Text>
                        </Wrapper>
                      </Wrapper>
                      <Wrapper
                        borderBottom={`1px solid ${Theme.grey2_C}`}
                        padding={`10px 0`}
                        dr={`row`}
                        al={`flex-start`}
                      >
                        <Wrapper
                          width={`70px`}
                          al={`flex-start`}
                          fontSize={width < 800 ? `16px` : `18px`}
                          fontWeight={`bold`}
                        >
                          목록
                        </Wrapper>
                        <Wrapper width={`calc(100% - 70px)`}>
                          {wishPaymentDetail.items.map((data) => {
                            return (
                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                color={Theme.grey_C}
                              >
                                <Text
                                  width={`calc(100% / 2)`}
                                  textAlign={`start`}
                                >
                                  {data.pack}&nbsp;/&nbsp;{data.type}
                                  &nbsp;/&nbsp;{data.unit}
                                </Text>
                                <Text width={`50px`} textAlign={`center`}>
                                  {data.qnt}
                                </Text>
                                <Text
                                  width={`calc(100% / 2 - 50px)`}
                                  textAlign={`end`}
                                >
                                  {data.viewPrice}
                                </Text>
                              </Wrapper>
                            );
                          })}
                        </Wrapper>
                      </Wrapper>
                    </>
                  ) : (
                    router.query.type === "pre" &&
                    wishPreDetail && (
                      //탕전처방
                      <>
                        <Wrapper
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          padding={`10px 0`}
                          al={`flex-start`}
                          ju={`flex-start`}
                        >
                          <Wrapper dr={`row`} ju={`space-between`}>
                            <Text
                              fontSize={width < 800 ? `16px` : `18px`}
                              fontWeight={`bold`}
                            >
                              요청사항
                            </Text>
                            <Text>{wishPreDetail.title}</Text>
                          </Wrapper>
                          <Wrapper dr={`row`} ju={`flex-end`}>
                            <Text>{wishPreDetail.receiverName}</Text>
                          </Wrapper>
                          <Wrapper dr={`row`} ju={`flex-end`}>
                            <Text>{wishPreDetail.medication}</Text>
                          </Wrapper>
                          <Wrapper dr={`row`} ju={`flex-end`}>
                            <Text>{wishPreDetail.content}</Text>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          padding={`10px 0`}
                          dr={`row`}
                          al={`flex-start`}
                        >
                          <Wrapper
                            width={`70px`}
                            al={`flex-start`}
                            fontSize={width < 800 ? `16px` : `18px`}
                            fontWeight={`bold`}
                          >
                            종류
                          </Wrapper>
                          <Wrapper width={`calc(100% - 70px)`}>
                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              color={Theme.grey_C}
                            >
                              <Text
                                width={`calc(100% / 2)`}
                                textAlign={`start`}
                              >
                                {wishPreDetail.cheob}첩&nbsp;/&nbsp;
                                {wishPreDetail.pack}팩&nbsp;/&nbsp;
                                {wishPreDetail.unit}ml
                              </Text>
                              <Text width={`calc(100% / 2)`} textAlign={`end`}>
                                {numberWithCommas(
                                  wishPreDetail.totalPrice -
                                    wishPreDetail.materials
                                      .map((data) => data.price)
                                      .reduce((a, b) => a + b)
                                )}
                                원
                              </Text>
                            </Wrapper>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          padding={`10px 0`}
                          dr={`row`}
                          al={`flex-start`}
                        >
                          <Wrapper
                            width={`70px`}
                            al={`flex-start`}
                            fontSize={width < 800 ? `16px` : `18px`}
                            fontWeight={`bold`}
                          >
                            재료
                          </Wrapper>
                          <Wrapper width={`calc(100% - 70px)`}>
                            {wishPreDetail.materials.map((data) => {
                              return (
                                <Wrapper
                                  dr={`row`}
                                  ju={`space-between`}
                                  color={Theme.grey_C}
                                >
                                  <Text
                                    width={`calc(100% / 3)`}
                                    textAlign={`start`}
                                  >
                                    {data.name}
                                  </Text>
                                  <Text
                                    width={`calc(100% / 3)`}
                                    textAlign={`center`}
                                  >
                                    {data.qnt}
                                    {data.unit}
                                  </Text>
                                  <Text
                                    width={`calc(100% / 3)`}
                                    textAlign={`end`}
                                  >
                                    {data.viewPrice}
                                  </Text>
                                </Wrapper>
                              );
                            })}
                          </Wrapper>
                        </Wrapper>
                      </>
                    )
                  ))}

                <Wrapper
                  dr={`row`}
                  margin={`10px 0 0`}
                  ju={`flex-end`}
                  fontSize={width < 800 ? `16px` : `18px`}
                >
                  <Text fontWeight={`bold`}>
                    {router.query &&
                      (router.query.type === "payment"
                        ? wishPaymentDetail && wishPaymentDetail.viewTotalPrice
                        : router.query.type === "pre" &&
                          wishPreDetail &&
                          wishPreDetail.viewTotalPrice)}
                  </Text>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}
            >
              <Link href={`/cart`}>
                <ATag width={`100%`}>
                  <CommonButton
                    shadow={`0`}
                    width={`100%`}
                    height={`50px`}
                    radius={`0`}
                    cursor={`pointer`}
                  >
                    확인
                  </CommonButton>
                </ATag>
              </Link>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default PrescriptionHistory;
