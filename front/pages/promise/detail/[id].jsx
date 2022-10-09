import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../../../reducers/user";
import useInput from "../../../hooks/useInput";
import ClientLayout from "../../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  TextInput,
  CommonButton,
  Image,
} from "../../../components/commonComponents";
import useWidth from "../../../hooks/useWidth";
import Theme from "../../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../../reducers/seo";
import ProductSlider from "../../../components/slide/ProductSlider";
import Head from "next/head";
import {
  PRODUCT_PACK_LIST_REQUEST,
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_UNIT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
} from "../../../reducers/prescription";
import {
  PAYMENTREQUEST_CREATE_REQUEST,
  PAYMENT_DETAIL_REQUEST,
} from "../../../reducers/paymentRequest";
import { useRouter } from "next/router";
import { message } from "antd";

const CheckdButton = styled.button`
  padding: 5px 10px;

  outline: none;
  background-color: ${Theme.white_C};
  color: ${Theme.basicTheme_C};
  border: 1px solid ${Theme.basicTheme_C};
  width: ${(props) => props.width};
  height: 45px;
  border-radius: 15px;
  margin: 2px;
  transition: 0.3s;

  cursor: pointer;

  ${(props) =>
    props.kindOf &&
    `background-color: ${Theme.basicTheme_C}; color: ${Theme.white_C};`}

  &:hover {
    background-color: ${Theme.basicTheme_C};
    color: ${Theme.white_C};
  }
`;
const PromiseDetail = () => {
  ////// GLOBAL STATE //////
  const { me } = useSelector((state) => state.user);

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { typeList, packList, unitList, product } = useSelector(
    (state) => state.prescription
  );

  const {
    paymentId,

    paymentDetail,
    st_paymentRequestCreateDone,
    st_paymentRequestCreateError,
  } = useSelector((state) => state.paymentRequest);

  ////// HOOKS //////
  const width = useWidth();

  const type = useInput("");
  const pack = useInput("");
  const unit = useInput("");
  const otherInput = useInput("");

  const [totalPayment, setTotalPayment] = useState(null);
  const [topSlider, setTopSlider] = useState(null);
  const [temporaryDatum, setTemporaryDatum] = useState([]);
  const [temporaryId, setTemporaryId] = useState(0);

  const dispatch = useDispatch();

  const router = useRouter();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (temporaryDatum) {
      let total = 0;
      for (let i = 0; i < temporaryDatum.length; i++) {
        total += temporaryDatum[i].payment;
      }

      setTotalPayment(total);
    }
  }, [temporaryDatum]);

  useEffect(() => {
    const rePaymentData = sessionStorage.getItem("rePaymentData")
      ? JSON.parse(sessionStorage.getItem("rePaymentData"))
      : null;

    if (rePaymentData) {
      dispatch({
        type: PAYMENT_DETAIL_REQUEST,
        data: {
          paymentId: rePaymentData.id,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (paymentDetail) {
      const paymentArr = [];

      for (let i = 0; i < paymentDetail.PaymentRequest.length; i++) {
        paymentArr.push({
          id: paymentDetail.PaymentRequest[i].id,
          payment: paymentDetail.PaymentRequest[i].payment,
          packVolumn: paymentDetail.PaymentRequest[i].packVolumn,
          typeVolumn: paymentDetail.PaymentRequest[i].typeVolumn,
          unitVolumn: paymentDetail.PaymentRequest[i].unitVolumn,
          otherRequest: paymentDetail.PaymentRequest[i].otherRequest,
        });
      }

      setTemporaryDatum(paymentArr);

      sessionStorage.removeItem("rePaymentData");
    }
  }, [paymentDetail]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: PRODUCT_UNIT_LIST_REQUEST,
        data: {
          id: router.query.id,
        },
      });
      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: {
          id: router.query.id,
        },
      });
      dispatch({
        type: PRODUCT_TYPE_LIST_REQUEST,
        data: {
          id: router.query.id,
        },
      });

      dispatch({
        type: PRODUCT_DETAIL_REQUEST,
        data: {
          id: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (typeList) {
      if (typeList.length > 0) {
        type.setValue(typeList[0]);
      }
    }

    if (product) {
      setTopSlider([
        product.imageURL1,
        product.imageURL2,
        product.imageURL3,
        product.imageURL4,
      ]);
    }
  }, [typeList, packList, unitList, product]);

  useEffect(() => {
    if (st_paymentRequestCreateError) {
      return message.error(st_paymentRequestCreateError);
    }
  }, [st_paymentRequestCreateError]);

  useEffect(() => {
    if (st_paymentRequestCreateDone) {
      return router.push(`/deliveryInfo/${paymentId}?type=payment`);
    }
  }, [st_paymentRequestCreateDone]);
  ////// TOGGLE //////
  ////// HANDLER //////

  const typeChangeHandler = useCallback(
    (value) => {
      type.setValue(value);
    },
    [type.value]
  );

  const packChangeHandler = useCallback(
    (value) => {
      pack.setValue(value);
    },
    [pack.value]
  );

  const unitChangeHandler = useCallback(
    (value) => {
      unit.setValue(value);
    },
    [unit.value]
  );

  const createPaymentArrHandler = useCallback(async () => {
    if (!type.value) {
      return message.error("종류을 선택해주세요.");
    }
    if (!pack.value) {
      return message.error("포장을 선택해주세요.");
    }
    if (!unit.value) {
      return message.error("단위을 선택해주세요.");
    }

    let temporayArr = temporaryDatum.map((data) => data);

    setTemporaryId(temporaryId + 1);

    temporayArr.push({
      id: temporaryId,
      payment:
        product &&
        product.price +
          (type.value.originAddPrice ? type.value.originAddPrice : 0) +
          (pack.value.originAddPrice ? pack.value.originAddPrice : 0) +
          (unit.value.originAddPrice ? unit.value.originAddPrice : 0),
      packVolumn: type.value.name ? type.value.name : type.value,
      typeVolumn: pack.value.name ? pack.value.name : pack.value,
      unitVolumn: unit.value.name ? unit.value.name : unit.value,
      otherRequest: otherInput.value,
    });

    await setTemporaryDatum(temporayArr);
  }, [
    type.value,
    pack.value,
    unit.value,
    otherInput.value,
    temporaryDatum,
    temporaryId,
  ]);

  const deletePaymentArrHadnler = useCallback(
    async (id) => {
      let temporayArr = temporaryDatum.map((data) => data);

      await setTemporaryDatum(temporayArr.filter((data) => data.id !== id));
    },
    [temporaryDatum]
  );

  const createPaymentRequestHandler = useCallback(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }

    if (!temporaryDatum) {
      return message.error("주문을 추가해주세요.");
    }
    dispatch({
      type: PAYMENTREQUEST_CREATE_REQUEST,
      data: {
        userId: me.id,
        productName:
          temporaryDatum.length > 1
            ? `${product.title} ${unit.value.name} 외 ${
                temporaryDatum.length - 1
              }개`
            : `${product.title} ${unit.value.name}`,
        paymentRequestDatum: temporaryDatum,
        totalPrice: totalPayment,
        prescriptionId: product.id,
      },
    });
  }, [temporaryDatum, me, product, totalPayment, unit.value]);

  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>
          {seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        </title>

        <meta
          name="subject"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          name="title"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta name="keywords" content={seo_keywords} />
        <meta
          name="description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        {/* <!-- OG tag  --> */}
        <meta
          property="og:title"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          property="og:site_name"
          content={seo_title.length < 1 ? "ModerlLab" : seo_title[0].content}
        />
        <meta
          property="og:description"
          content={
            seo_desc.length < 1 ? "undefined description" : seo_desc[0].content
          }
        />
        <meta property="og:keywords" content={seo_keywords} />
        <meta
          property="og:image"
          content={seo_ogImage.length < 1 ? "" : seo_ogImage[0].content}
        />
      </Head>

      <ClientLayout>
        <WholeWrapper>
          <RsWrapper
            minHeight={`calc(100vh - 64px)`}
            ju={`flex-start`}
            position={`relative`}
            padding={`0`}
          >
            <Wrapper
              ju={`flex-start`}
              al={`flex-start`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              minHeight={`calc(100vh - 164px)`}
            >
              <Text color={Theme.grey_C} fontWeight={`bold`}>
                {product && product.title}
              </Text>
              <ProductSlider topSlider={topSlider} />

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                종류
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                {typeList &&
                  (typeList.length === 0 ? (
                    <TextInput
                      placeholder="직접입력"
                      type={`text`}
                      width={`100%`}
                      {...type}
                    />
                  ) : (
                    typeList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            width < 700
                              ? typeList.length === 1
                                ? `calc(100% - 4px)`
                                : `calc(100% / 2 - 4px)`
                              : typeList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : typeList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : typeList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : typeList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={type.value && type.value.id === data.id}
                          onClick={() => typeChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })
                  ))}
              </Wrapper>

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                포장
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                {packList &&
                  (packList.length === 0 ? (
                    <TextInput
                      placeholder="직접입력"
                      type={`text`}
                      width={`100%`}
                      {...pack}
                    />
                  ) : (
                    packList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            width < 700
                              ? packList.length === 1
                                ? `calc(100% - 4px)`
                                : `calc(100% / 2 - 4px)`
                              : packList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : packList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : packList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : packList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={pack.value && pack.value.id === data.id}
                          onClick={() => packChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })
                  ))}
              </Wrapper>
              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                단위
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                {unitList &&
                  (unitList.length === 0 ? (
                    <TextInput
                      placeholder="직접입력"
                      type={`text`}
                      width={`100%`}
                      {...unit}
                    />
                  ) : (
                    unitList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            width < 700
                              ? unitList.length === 1
                                ? `calc(100% - 4px)`
                                : `calc(100% / 2 - 4px)`
                              : unitList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : unitList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : unitList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : unitList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={unit.value && unit.value.id === data.id}
                          onClick={() => unitChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })
                  ))}
              </Wrapper>

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                추가요청사항
              </Text>
              <TextInput type={`text`} width={`100%`} {...otherInput} />
            </Wrapper>
            <Wrapper
              al={`flex-end`}
              margin={`0 0 20px`}
              padding={width < 800 ? `0 10px` : `0 35px`}
            >
              <CommonButton onClick={createPaymentArrHandler}>
                주문추가하기
              </CommonButton>
            </Wrapper>

            <Wrapper
              dr={`row`}
              ju={`flex-start`}
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `15px 10px` : `15px 38px`}
            >
              {temporaryDatum &&
                temporaryDatum.map((data, idx) => {
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
                      shadow={Theme.shadow_C}
                      padding={`25px`}
                      bgColor={Theme.white_C}
                      margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
                      radius={`20px`}
                    >
                      <Wrapper dr={`row`} ju={`space-between`}>
                        <Text color={Theme.grey2_C}>
                          {data.typeVolumn}&nbsp;|&nbsp;{data.packVolumn}
                          &nbsp;|&nbsp;
                          {data.unitVolumn}
                        </Text>
                        <Image
                          cursor={`pointer`}
                          onClick={() => deletePaymentArrHadnler(data.id)}
                          alt="close"
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/header_icon/close-grey.png`}
                          width={`16px`}
                        />
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`10px 0 0`}
                      >
                        <Wrapper width={`auto`} dr={`row`}>
                          <Text>수량</Text>
                          <Text width={`100px`} textAlign={`center`}>
                            1
                          </Text>
                        </Wrapper>
                        <Wrapper width={`auto`} dr={`row`}>
                          <Text fontSize={`12px`}>총 {data.unitVolumn}</Text>
                          <Text
                            fontSize={`20px`}
                            fontWeight={`bold`}
                            margin={`0 0 0 15px`}
                            color={Theme.basicTheme_C}
                          >
                            {String(data.payment).replace(
                              /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  );
                })}
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
                <Text fontWeight={`bold`}>총 주문금액&nbsp;:&nbsp;</Text>
                <Text fontWeight={`bold`}>
                  {String(totalPayment).replace(
                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                  &nbsp;원
                </Text>
              </Wrapper>
              <CommonButton
                shadow={`0`}
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
                onClick={createPaymentRequestHandler}
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
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default PromiseDetail;
