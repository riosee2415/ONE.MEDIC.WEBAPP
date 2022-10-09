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
import { PRODUCT_LIST_REQUEST } from "../../reducers/prescription";
import { Empty } from "antd";
import { useCallback } from "react";
import { useRouter } from "next/router";

const Promise = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  const { products, st_productError } = useSelector(
    (state) => state.prescription
  );

  ////// REDUX //////
  ////// USEEFFECT //////
  useEffect(() => {
    dispacth({
      type: PRODUCT_LIST_REQUEST,
      data: { title: false },
    });
  }, []);

  ////// TOGGLE //////
  ////// HANDLER //////

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);
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
            position={`relative`}
            padding={`10px 0`}
            ju={`flex-start`}
          >
            <Wrapper
              padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
              minHeight={`calc(100vh - 149px - 170px)`}
              ju={`space-between`}
              dr={`row`}
            >
              {products && products.length === 0 ? (
                <Wrapper margin={`80px 0`}>
                  <Empty description={"상품이 없습니다."} />
                </Wrapper>
              ) : (
                products &&
                products.map((data) => {
                  return (
                    <Wrapper
                      key={data.id}
                      width={
                        width < 1100
                          ? width < 700
                            ? `100%`
                            : `calc(100% / 2 - 20px)`
                          : `calc(100% / 3 - 20px)`
                      }
                      height={`calc(100vh / 3 - 40px)`}
                      shadow={Theme.shadow_C}
                      radius={`15px`}
                      cursor={`pointer`}
                      onClick={() =>
                        moveLinkHandler(`/promise/detail/${data.id}`)
                      }
                    >
                      <Image
                        alt="image"
                        height={`calc(100% - 45px)`}
                        src={data.imageURL1}
                      />
                      <Text fontSize={`20px`}>{data.title}</Text>
                    </Wrapper>
                  );
                })
              )}
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
