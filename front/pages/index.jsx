import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";

import { DatePicker, Empty, message, Modal } from "antd";
import { SearchOutlined, CloseCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

import wrapper from "../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";

import useInput from "../hooks/useInput";
import useWidth from "../hooks/useWidth";

import ClientLayout from "../components/ClientLayout";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  TextInput,
  TextArea,
} from "../components/commonComponents";
import Theme from "../components/Theme";
import {
  BOUGHT_LIST_REQUEST,
  BOUGHT_REBUY_UPDATE_REQUEST,
} from "../reducers/boughtHistory";

const TagBtn = styled(Wrapper)`
  width: 85px;
  height: 35px;
  font-size: 15px;
  border-radius: ${(props) => props.radius || `10px`};
  background: ${(props) => props.theme.lightGrey2_C};
  color: ${(props) => props.theme.grey_C};
  border: 1px solid ${(props) => props.theme.lightGrey2_C};
`;

const RefuseModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }

  & .ant-modal-body {
    border-radius: 20px;
    padding: 15px;
    align-items: flex-start;
  }
`;

const Home = ({}) => {
  const width = useWidth();
  const { RangePicker } = DatePicker;
  ////// GLOBAL STATE //////
  const router = useRouter();

  const { me } = useSelector((state) => state.user);

  const {
    boughtList,
    //
    st_boughtReBuyUpdateLoading,
    st_boughtReBuyUpdateDone,
    st_boughtReBuyUpdateError,
  } = useSelector((state) => state.boughtHistory);

  ////// HOOKS //////

  const dispatch = useDispatch();

  const productName = useInput("");

  const [searchDate, setSearchDate] = useState(["", ""]);

  const [refuseData, setRefuseData] = useState(null);
  const [refuseModal, setRefuseModal] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

  // 기본
  useEffect(() => {
    dispatch({
      type: BOUGHT_LIST_REQUEST,
      data: {
        startDate: searchDate[0],
        endDate: searchDate[1],
        productName: productName.value,
      },
    });
  }, [productName.value, searchDate]);

  useEffect(() => {
    if (st_boughtReBuyUpdateDone) {
      router.push("/cart");

      return message.success("장바구니에 담겼습니다.");
    }
  }, [st_boughtReBuyUpdateDone]);

  useEffect(() => {
    if (st_boughtReBuyUpdateError) {
      return message.error(st_boughtReBuyUpdateError);
    }
  }, [st_boughtReBuyUpdateError]);

  ////// TOGGLE //////

  // 거절 모달
  const refuseModalToggle = useCallback(
    (data) => {
      if (data) {
        setRefuseData(data);
      } else {
        setRefuseData(null);
      }

      setRefuseModal((prev) => !prev);
    },
    [refuseData, refuseModal]
  );
  ////// HANDLER //////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const searchHandler = useCallback(
    (data) => {
      if (!me) {
        message.error("로그인 후 이용해주세요.");
        return moveLinkHandler(`/login`);
      }

      setSearchDate([
        data ? data[0].format("YYYY_MM_DD") : null,
        data ? data[1].format("YYYY_MM_DD") : null,
      ]);
    },
    [searchDate]
  );

  const reBoughtHandler = useCallback(
    (data) => {
      // if (data.type === 1) {
      //   sessionStorage.setItem("rePaymentData", JSON.stringify(data));
      //   router.push(`/promise/detail/${data.paymentId}`);
      //   return;
      // } else {
      //   sessionStorage.setItem("rePprData", JSON.stringify(data));
      //   router.push(`/prescription`);
      //   return;
      // }
      if (st_boughtReBuyUpdateLoading) {
        return;
      }
      dispatch({
        type: BOUGHT_REBUY_UPDATE_REQUEST,
        data: {
          id: data.id,
          type: data.type,
        },
      });
    },
    [st_boughtReBuyUpdateLoading]
  );

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
            <Wrapper padding={width < 800 ? `0 10px` : `0 38px`}>
              <Wrapper position={`relative`} margin={`15px 0`}>
                <Wrapper
                  position={`absolute`}
                  top={`50%`}
                  left={`10px`}
                  width={`auto`}
                  color={Theme.basicTheme_C}
                  zIndex={`10`}
                  fontSize={`25px`}
                  margin={`-13px 0 0`}
                  onClick={() => searchHandler(searchHandler)}
                >
                  <SearchOutlined />
                </Wrapper>
                <TextInput
                  {...productName}
                  radius={`20px`}
                  height={`45px`}
                  width={`100%`}
                  type={`text`}
                  placeholder={`주문목록에서 검색`}
                  padding={`0 0 0 45px`}
                />
              </Wrapper>
              <RangePicker
                style={{
                  width: "100%",
                  border: "none",
                  height: 45,
                  borderRadius: 20,
                  boxShadow:
                    "5px 5px 15px rgba(77, 92, 123, 0.2), inset -5px -5px 15px rgba(77, 92, 123, 0.05)",
                }}
                placeholder={["시작일", "종료일"]}
                onChange={searchHandler}
              />
            </Wrapper>
            {me && (
              <>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  margin={`20px 0`}
                  padding={width < 800 ? `10px` : `10px 38px`}
                  position={`sticky`}
                  top={`0`}
                  left={`0`}
                  bgColor={Theme.white_C}
                  zIndex={`10`}
                >
                  <Text color={Theme.grey_C} fontWeight={`bold`}>
                    주문목록
                  </Text>
                  <Text
                    cursor={`pointer`}
                    color={Theme.subTheme2_C}
                    onClick={() => moveLinkHandler("/prescription")}
                  >
                    처방하기
                  </Text>
                </Wrapper>

                <Wrapper
                  padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
                  minHeight={`calc(100vh - 149px - 170px)`}
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                >
                  {boughtList &&
                    (boughtList.length === 0 ? (
                      <Wrapper>
                        <Empty description="주문목록이 없습니다." />
                      </Wrapper>
                    ) : (
                      boughtList.map((data, idx) => {
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
                            <Text fontSize={`14px`} color={Theme.grey_C}>
                              {data.viewCreatedAt}
                            </Text>
                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              margin={`15px 0`}
                            >
                              <Wrapper width={`auto`} al={`flex-start`}>
                                <Text fontSize={`18px`} fontWeight={`bold`}>
                                  {data.title}
                                </Text>
                                <Text color={Theme.grey_C}>
                                  {data.sendUser}
                                </Text>
                                <Text>{data.receiveUser}</Text>
                              </Wrapper>
                              <TagBtn
                                color={
                                  data.viewDeliveryStatus === "거절"
                                    ? `${Theme.red_C} !important`
                                    : (data.viewDeliveryStatus ===
                                        "입금 대기" ||
                                        data.viewDeliveryStatus ===
                                          "결제 진행") &&
                                      `${Theme.subTheme2_C} !important`
                                }
                                cursor={
                                  (data.viewDeliveryStatus === "결제 진행" ||
                                    data.viewDeliveryStatus === "거절") &&
                                  `pointer`
                                }
                                onClick={() =>
                                  data.viewDeliveryStatus === "거절"
                                    ? refuseModalToggle(data)
                                    : data.viewDeliveryStatus === "결제 진행" &&
                                      moveLinkHandler(`/payInfo/${data.id}`)
                                }
                              >
                                {data.viewDeliveryStatus}
                              </TagBtn>
                            </Wrapper>
                            <Wrapper
                              dr={`row`}
                              color={Theme.grey_C}
                              borderTop={`1px solid ${Theme.grey2_C}`}
                              padding={`10px 0 0`}
                            >
                              <Wrapper
                                width={`calc(100% / 3)`}
                                cursor={`pointer`}
                                onClick={() =>
                                  data.isPay
                                    ? moveLinkHandler(
                                        `/deliveryList/${data.id}?type=${data.type}`
                                      )
                                    : (router.push(`/payInfo/${data.id}`),
                                      message.info("결제를 진행해주세요."))
                                }
                              >
                                배송조회
                              </Wrapper>
                              <Wrapper
                                width={`calc(100% / 3)`}
                                borderRight={`1px solid ${Theme.grey2_C}`}
                                borderLeft={`1px solid ${Theme.grey2_C}`}
                                cursor={`pointer`}
                                onClick={() =>
                                  data.isPay
                                    ? moveLinkHandler(
                                        `/orderList/${data.id}?type=${data.type}`
                                      )
                                    : (router.push(`/payInfo/${data.id}`),
                                      message.info("결제를 진행해주세요."))
                                }
                              >
                                주문내역
                              </Wrapper>

                              <Wrapper
                                width={`calc(100% / 3)`}
                                cursor={`pointer`}
                                onClick={() =>
                                  data.isPay
                                    ? reBoughtHandler(data)
                                    : (router.push(`/payInfo/${data.id}`),
                                      message.info("결제를 진행해주세요."))
                                }
                              >
                                재처방
                              </Wrapper>
                            </Wrapper>
                          </Wrapper>
                        );
                      })
                    ))}
                </Wrapper>
              </>
            )}
          </RsWrapper>

          <RefuseModal
            // title={`거절 사유`}
            visible={refuseModal}
            onCancel={refuseModalToggle}
            footer={null}
          >
            {/* <Wrapper
              radius={`20px`}
              shadow={`5px 5px 15px ${Theme.red_C}`}
              padding={`15px`}
              al={`flex-start`}
              margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
            > */}
            <Wrapper dr={`row`} ju={`space-between`} margin={`15px 0`}>
              <Wrapper al={`flex-start`}>
                <Text
                  width={`100%`}
                  fontSize={`18px`}
                  fontWeight={`bold`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`0 0 10px`}
                >
                  거절사유
                  <CloseCircleOutlined
                    style={{ color: Theme.red_C, margin: `0 0 0 5px` }}
                  />
                </Text>
                {refuseData && (
                  <Text margin={`10px 0 0`} color={Theme.grey_C}>
                    {refuseData.refuseContent}
                  </Text>
                )}
              </Wrapper>
            </Wrapper>
            {/* </Wrapper> */}
          </RefuseModal>
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
      type: BOUGHT_LIST_REQUEST,
    });
    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Home;
