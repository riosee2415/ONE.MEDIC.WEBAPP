import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../../reducers/user";
import useInput from "../../hooks/useInput";
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
import { useRef } from "react";

const Promise = ({}) => {
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
            padding={`10px 0`}
          >
            <Wrapper
              width={`90%`}
              height={`calc(100vh / 3 - 40px)`}
              shadow={Theme.shadow_C}
              radius={`15px`}
              cursor={`pointer`}
            >
              <Image
                alt="image"
                height={`calc(100% - 45px)`}
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/logo/logo.png`}
              />
              <Text fontSize={`20px`}>공진당</Text>
            </Wrapper>
            <Wrapper
              width={`90%`}
              height={`calc(100vh / 3 - 40px)`}
              shadow={Theme.shadow_C}
              radius={`15px`}
              cursor={`pointer`}
              margin={`10px 0`}
            >
              <Image
                alt="image"
                height={`calc(100% - 45px)`}
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/logo/logo.png`}
              />
              <Text fontSize={`20px`}>경옥고</Text>
            </Wrapper>
            <Wrapper
              width={`90%`}
              height={`calc(100vh / 3 - 40px)`}
              shadow={Theme.shadow_C}
              radius={`15px`}
              cursor={`pointer`}
            >
              <Image
                alt="image"
                height={`calc(100% - 45px)`}
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/logo/logo.png`}
              />
              <Text fontSize={`20px`}>다이어트처방</Text>
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
export default Promise;
