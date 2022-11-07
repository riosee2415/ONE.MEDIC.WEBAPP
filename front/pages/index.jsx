import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/router";

import axios from "axios";
import { END } from "redux-saga";

import { DatePicker, Empty, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
} from "../components/commonComponents";
import Theme from "../components/Theme";
import { BOUGHT_LIST_REQUEST } from "../reducers/boughtHistory";

const TagBtn = styled(Wrapper)`
  width: 85px;
  height: 35px;
  font-size: 15px;
  border-radius: ${(props) => props.radius || `10px`};
  background: ${(props) => props.theme.lightGrey2_C};
  color: ${(props) => props.theme.grey_C};
  border: 1px solid ${(props) => props.theme.lightGrey2_C};
`;

const Home = ({}) => {
  const width = useWidth();
  const { RangePicker } = DatePicker;
  ////// GLOBAL STATE //////
  const router = useRouter();

  const { me } = useSelector((state) => state.user);

  const { boughtList } = useSelector((state) => state.boughtHistory);

  ////// HOOKS //////

  const dispatch = useDispatch();

  const productName = useInput("");

  const [searchDate, setSearchDate] = useState(["", ""]);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

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

  ////// TOGGLE //////
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

  const reBoughtHandler = useCallback((data) => {
    if (data.paymentType === "payment") {
      sessionStorage.setItem("rePaymentData", JSON.stringify(data));
      router.push(`/promise/detail/${data.prescriptionId}`);
      return;
    } else {
      sessionStorage.setItem("rePprData", JSON.stringify(data));
      router.push(`/prescription`);
      return;
    }
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
                              {data.orderAt}
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
                                cursor={
                                  data.viewDeliveryStatus === "결제 진행" &&
                                  `pointer`
                                }
                                onClick={() =>
                                  data.viewDeliveryStatus === "결제 진행" &&
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
