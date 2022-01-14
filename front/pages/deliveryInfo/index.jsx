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
  Image,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DropboxOutlined } from "@ant-design/icons";

const Index = ({}) => {
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
              al={`flex-start`}
              ju={`flex-start`}
            >
              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 30px`}
              >
                <Wrapper
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                >
                  <Text
                    fontSize={`1rem`}
                    fontWeight={`700`}
                    color={Theme.grey_C}
                    margin={`0 0 20px`}
                  >
                    배송조회
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`15px 12px`}
                >
                  <Wrapper
                    width={`20px`}
                    margin={`0 40px 0 0`}
                    al={`flex-start`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/delivery_icon/box.png`}
                      alt={`box`}
                    />
                  </Wrapper>
                  <Wrapper
                    al={`flex-start`}
                    ju={`flex-start`}
                    width={`calc(100% - 60px)`}
                  >
                    <Text
                      color={Theme.black_C}
                      fontSize={`18px`}
                      fontWeight={`700`}
                      margin={`0 0 7px`}
                    >
                      -12-15:21:00
                    </Text>
                    <Text
                      color={Theme.black_C}
                      fontSize={`16px`}
                      margin={`0 0 5px`}
                    >
                      310-0002 영업소에서 물품을 접수했습니다.
                    </Text>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      310팀: 곽봉남 010-5277-6257
                    </Text>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`15px 12px`}
                >
                  <Wrapper
                    width={`20px`}
                    margin={`0 40px 0 0`}
                    al={`flex-start`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/delivery_icon/truck.png`}
                      alt={`truck`}
                    />
                  </Wrapper>
                  <Wrapper
                    al={`flex-start`}
                    ju={`flex-start`}
                    width={`calc(100% - 60px)`}
                  >
                    <Text
                      color={Theme.black_C}
                      fontSize={`18px`}
                      fontWeight={`700`}
                      margin={`0 0 7px`}
                    >
                      -12-15:21:00
                    </Text>
                    <Text
                      color={Theme.black_C}
                      fontSize={`16px`}
                      margin={`0 0 5px`}
                    >
                      310-0002 영업소에서 물품을 접수했습니다.
                    </Text>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      310팀: 곽봉남 010-5277-6257
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper al={`flex-start`} ju={`flex-start`}>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    받는 사람
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    청구경희한의원
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    보내는 사람
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    청구경희한의원
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    운송장번호
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    4075-8320-25
                  </Text>
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
export default Index;
