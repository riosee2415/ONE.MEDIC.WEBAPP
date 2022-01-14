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
  CommonCheckBox,
  Image,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  const Title = styled(Wrapper)`
    align-items: flex-start;
    border-bottom: 1px solid ${Theme.grey2_C};
    padding: 0 0 20px 0;
    font-weight: 800;
    color: ${Theme.grey_C};
  `;

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
              ju={`flex-start`}>
              <Wrapper
                shadow={Theme.shadow_C}
                radius={`20px`}
                padding={`35px 20px`}>
                <Title>탕전설정</Title>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  padding={`15px`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}>
                  <CommonCheckBox>
                    <Text
                      padding={`0 0 0 25px`}
                      fontWeight={`800`}
                      fontSize={width < 600 ? `16px` : `18px`}>
                      유압
                    </Text>
                  </CommonCheckBox>

                  <Wrapper width={`auto`}>
                    <Text
                      color={Theme.black_C}
                      fontSize={width < 600 ? `16px` : `18px`}>
                      12,000원
                    </Text>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  padding={`15px`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}>
                  <CommonCheckBox>
                    <Text
                      padding={`0 0 0 25px`}
                      fontWeight={`800`}
                      fontSize={width < 600 ? `16px` : `18px`}>
                      본탕
                    </Text>
                  </CommonCheckBox>

                  <Wrapper width={`auto`}>
                    <Text
                      color={Theme.black_C}
                      fontSize={width < 600 ? `16px` : `18px`}>
                      0원
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper
                shadow={Theme.shadow_C}
                radius={`20px`}
                margin={`20px 0 0 0`}
                padding={`25px  20px`}>
                <Title>포장</Title>
                <Wrapper
                  dr={`row`}
                  ju={`space-between`}
                  padding={`15px`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}>
                  <CommonCheckBox style={{ alignItems: "center" }}>
                    <Wrapper dr={`row`} padding={`0 0 0 20px`}>
                      <Image
                        width={`60px`}
                        height={`60px`}
                        src={`https://via.placeholder.com/60x60`}
                      />

                      <Text
                        padding={`0 0 0 10px`}
                        fontWeight={`800`}
                        fontSize={width < 600 ? `16px` : `18px`}>
                        일반
                      </Text>
                    </Wrapper>
                  </CommonCheckBox>

                  <Wrapper width={`auto`}>
                    <Text
                      color={Theme.black_C}
                      fontSize={width < 600 ? `16px` : `18px`}>
                      개당 170원
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}>
              <Link href={`/cart`}>
                <ATag width={`100%`}>
                  <CommonButton
                    shadow={`0`}
                    width={`100%`}
                    height={`50px`}
                    radius={`0`}
                    cursor={`pointer`}>
                    입력완료
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
export default Index;
