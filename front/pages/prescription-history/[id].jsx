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
  ATag,
  CommonButton,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const PrescriptionHistory = ({}) => {
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
          <RsWrapper ju={`flex-start`} position={`relative`} padding={`0`}>
            <Wrapper
              minHeight={`calc(100vh - 120px)`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              dr={`row`}
              al={`flex-start`}
            >
              <Wrapper>
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
                    약재
                  </Wrapper>
                  <Wrapper width={`calc(100% - 70px)`}>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      color={Theme.grey_C}
                    >
                      <Text>진피</Text>
                      <Text>160.0g</Text>
                      <Text>22,000</Text>
                    </Wrapper>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      color={Theme.grey_C}
                    >
                      <Text>진피</Text>
                      <Text>160.0g</Text>
                      <Text>22,000</Text>
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
                    조제
                  </Wrapper>
                  <Wrapper width={`calc(100% - 70px)`}>
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      color={Theme.grey_C}
                    >
                      <Text>진피</Text>
                      <Text>160.0g</Text>
                      <Text>22,000</Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  margin={`10px 0 0`}
                  ju={`flex-end`}
                  fontSize={width < 800 ? `16px` : `18px`}
                >
                  <Text fontWeight={`bold`}>195,840</Text>
                  <Text>원</Text>
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

    context.store.dispatch({
      type: SEO_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default PrescriptionHistory;
