import React, { useEffect } from "react";
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

const Detail = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////
  ////// HANDLER //////
  ////// DATAVIEW //////

  const getEditContent = (contentValue) => {
    console.log(contentValue);
  };

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
                공진단
              </Text>
              <ProductSlider />

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                종류
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 2 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  가미방
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 2 - 4px)`}
                  radius={`15px`}
                  height={`45px`}
                  margin={`2px`}
                >
                  원방
                </CommonButton>
              </Wrapper>

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                포장
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 3 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  일반포장
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 3 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  지퍼백
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 3 - 4px)`}
                  radius={`15px`}
                  height={`45px`}
                  margin={`2px`}
                >
                  고급포장
                </CommonButton>
              </Wrapper>
              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                단위
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 4 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  10구
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 4 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  20구
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 4 - 4px)`}
                  height={`45px`}
                  kindOf={`white`}
                  radius={`15px`}
                  margin={`2px`}
                >
                  30구
                </CommonButton>
                <CommonButton
                  shadow={`0`}
                  width={`calc(100% / 4 - 4px)`}
                  radius={`15px`}
                  height={`45px`}
                  margin={`2px`}
                >
                  40구
                </CommonButton>
              </Wrapper>

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                추가요청사항
              </Text>
              <TextInput type={`text`} width={`100%`} />
            </Wrapper>
            <Wrapper
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `15px 10px` : `15px 38px`}
            >
              <Wrapper
                shadow={Theme.shadow_C}
                padding={`25px`}
                bgColor={Theme.white_C}
                margin={`0 0 15px`}
                radius={`20px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey2_C}>원방 | 지퍼백 | 직접선택</Text>
                  <Image
                    alt="close"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/header_icon/close-grey.png`}
                    width={`16px`}
                  />
                </Wrapper>
                <Wrapper dr={`row`} ju={`space-between`} margin={`10px 0 0`}>
                  <Wrapper width={`auto`} dr={`row`}>
                    <Text>수량</Text>
                    <Text width={`100px`} textAlign={`center`}>
                      1
                    </Text>
                  </Wrapper>
                  <Wrapper width={`auto`} dr={`row`}>
                    <Text fontSize={`12px`}>총 1구</Text>
                    <Text
                      fontSize={`20px`}
                      fontWeight={`bold`}
                      margin={`0 0 0 15px`}
                      color={Theme.basicTheme_C}
                    >
                      19,500
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper
                shadow={Theme.shadow_C}
                padding={`25px`}
                bgColor={Theme.white_C}
                margin={`0 0 15px`}
                radius={`20px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey2_C}>원방 | 지퍼백 | 직접선택</Text>
                  <Image
                    alt="close"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/header_icon/close-grey.png`}
                    width={`16px`}
                  />
                </Wrapper>
                <Wrapper dr={`row`} ju={`space-between`} margin={`10px 0 0`}>
                  <Wrapper width={`auto`} dr={`row`}>
                    <Text>수량</Text>
                    <Text width={`100px`} textAlign={`center`}>
                      1
                    </Text>
                  </Wrapper>
                  <Wrapper width={`auto`} dr={`row`}>
                    <Text fontSize={`12px`}>총 1구</Text>
                    <Text
                      fontSize={`20px`}
                      fontWeight={`bold`}
                      margin={`0 0 0 15px`}
                      color={Theme.basicTheme_C}
                    >
                      19,500
                    </Text>
                  </Wrapper>
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
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Detail;
