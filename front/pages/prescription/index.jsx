import React, { useEffect, useCallback } from "react";
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
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { PRODUCT_LIST_REQUEST } from "../../reducers/prescription";
import { Empty } from "antd";
import { useRouter } from "next/router";
import { RightOutlined } from "@ant-design/icons";

const Prescription = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  ////// REDUX //////
  ////// USEEFFECT //////

  ////// TOGGLE //////
  ////// HANDLER //////

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
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/2.cart_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
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
              <Wrapper
                padding={`20px`}
                shadow={Theme.shadow_C}
                radius={`20px`}
                margin={`0 0 15px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text color={Theme.grey_C}>종류</Text>
                  <Image
                    alt="icon"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/pencil.png`}
                    width={`16px`}
                  />
                </Wrapper>
                <Wrapper margin={`10px 0 0`} al={`flex-start`}>
                  <Text fontSize={width < 800 ? `16px` : `18px`}>
                    20첩 / 32팩 / 120ml
                  </Text>
                </Wrapper>
              </Wrapper>
              <Wrapper padding={`20px`} shadow={Theme.shadow_C} radius={`20px`}>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`0 5px 10px`}
                >
                  <Text color={Theme.grey_C}>구성약재</Text>
                  <Image
                    alt="icon"
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/comp_icon/garbage.png`}
                    width={`16px`}
                  />
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
export default Prescription;
