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
import { useRef } from "react";
import {
  PRODUCT_PACK_LIST_REQUEST,
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_UNIT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
} from "../../../reducers/prescription";
import { PAYMENTREQUEST_CREATE_REQUEST } from "../../../reducers/paymentRequest";
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
const Detail = ({}) => {
  const { me } = useSelector((state) => state.user);

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const width = useWidth();
  ////// GLOBAL STATE //////

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { typeList, packList, unitList, product } = useSelector(
    (state) => state.prescription
  );

  const {
    paymentId,
    st_payemtnRequestCreateDone,
    st_paymentRequestCreateError,
  } = useSelector((state) => state.paymentRequest);

  ////// HOOKS //////

  const type = useInput(null);
  const pack = useInput(null);
  const unit = useInput(null);
  const otherInput = useInput(null);

  const [topSlider, setTopSlider] = useState(null);
  const [temporaryDatum, setTemporaryDatum] = useState([]);

  const dispatch = useDispatch();

  const router = useRouter();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: PRODUCT_UNIT_LIST_REQUEST,
        data: {
          id: router.query.d,
        },
      });
      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: {
          id: router.query.d,
        },
      });
      dispatch({
        type: PRODUCT_TYPE_LIST_REQUEST,
        data: {
          id: router.query.d,
        },
      });

      dispatch({
        type: PRODUCT_DETAIL_REQUEST,
        data: {
          id: router.query.d,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (typeList) {
      if (typeList.length > 0) {
        type.setValue(typeList[0].name);
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
    if (st_payemtnRequestCreateDone) {
      router.push(`/deliveryInfo/${paymentId}?type=payment`);
    }
  }, [st_payemtnRequestCreateDone]);
  ////// TOGGLE //////
  ////// HANDLER //////

  const typeChangeHandler = useCallback(
    (value) => {
      type.setValue(value);
    },
    [type]
  );

  const packChangeHandler = useCallback(
    (value) => {
      pack.setValue(value);
    },
    [pack]
  );

  const unitChangeHandler = useCallback(
    (value) => {
      unit.setValue(value);
    },
    [unit]
  );

  const createPaymentArrHandler = useCallback(() => {
    if (!type) {
      return message.error("종류을 선택해주세요.");
    }
    if (!pack) {
      return message.error("포장을 선택해주세요.");
    }
    if (!unit) {
      return message.error("단위을 선택해주세요.");
    }

    temporaryDatum.push({
      payment: product.price,
      packVolumn: type.value,
      typeVolumn: pack.value,
      unitVolumn: unit.value,
      otherRequest: otherInput.value,
    });

    setTemporaryDatum(temporaryDatum);
  }, [type, pack, unit, otherInput.value, temporaryDatum, product]);

  const createPaymentRequestHandler = useCallback(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }

    if (temporaryDatum.length === 0) {
      return message.error("주문을 추가해주세요.");
    }
    dispatch({
      type: PAYMENTREQUEST_CREATE_REQUEST,
      data: {
        userId: me.id,
        paymentRequestDatum: temporaryDatum,
      },
    });
  }, [temporaryDatum, me]);

  ////// DATAVIEW //////

  // 원외탕에서
  // 종류, 포장, 단위를 선택하고 주문 추가하기를 하면 추가가 되야하는데 데이터 상으로는 추가가 되거든요 근데 누른후에 다른 이벤트? 가 발생이 되야 화면에 보여져서 이걸 어떻게 처리해줘야할지 모르겟어요

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
                          width={`calc(100% / 2 - 4px)`}
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={type.value === data.name}
                          onClick={() => typeChangeHandler(data.name)}
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
                {packList && packList.length === 0 ? (
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
                        width={`calc(100% / 3 - 4px)`}
                        height={`45px`}
                        radius={`15px`}
                        margin={`2px`}
                        kindOf={pack.value === data.name}
                        onClick={() => packChangeHandler(data.name)}
                      >
                        {data.name}
                      </CheckdButton>
                    );
                  })
                )}
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
                          width={`calc(100% / 4 - 4px)`}
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={unit.value === data.name}
                          onClick={() => unitChangeHandler(data.name)}
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
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `15px 10px` : `15px 38px`}
            >
              {temporaryDatum &&
                temporaryDatum.length > 0 &&
                temporaryDatum.map((data, idx) => {
                  console.log(data);
                  return (
                    <Wrapper
                      key={idx}
                      shadow={Theme.shadow_C}
                      padding={`25px`}
                      bgColor={Theme.white_C}
                      margin={`0 0 15px`}
                      radius={`20px`}
                    >
                      <Wrapper dr={`row`} ju={`space-between`}>
                        <Text color={Theme.grey2_C}>
                          {data.typeVolumn} | {data.packVolumn} |
                          {data.unitVolumn}
                        </Text>
                        <Image
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
                  {product &&
                    temporaryDatum &&
                    String(product.price * temporaryDatum.length).replace(
                      /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                      ","
                    )}
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

export default Detail;
