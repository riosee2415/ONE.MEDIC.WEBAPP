import React, { useState, useCallback, useEffect } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { LOAD_MY_INFO_REQUEST, LOGIN_SUCCESS } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../../store/configureStore";
import {
  RsWrapper,
  Wrapper,
  WholeWrapper,
  Text,
  CommonButton,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { message, notification } from "antd";
import { useRouter } from "next/router";

const MyinfoBtn = styled(CommonButton)`
  width: 85px;
  height: 30px;
  box-shadow: none;
  border: none;
  margin: 0 0 0 5px;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Question = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { me } = useSelector((state) => state.user);

  ////// HOOKS //////
  ////// REDUX //////

  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [router.query]);

  useEffect(() => {
    if (!me) {
      message.error(`로그인 후 이용하실 수 있습니다.`);
      router.push(`/login`);
    }
  }, [router.query, me]);
  ////// TOGGLE //////
  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);
  ////// DATAVIEW //////

  const tangjeonTestData = [
    {
      Hydraulics: "12000",
      bontang: "0",
      pouch: "일반 170원(개당)",
      packaging: "일반 0원",
    },
  ];

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
            minHeight={`calc(100vh - 170px - 64px)`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 27px`}
              al={`flex-start`}
              margin={`16px 0`}
            >
              <Wrapper al={`flex-start`}>
                <Text fontSize={`22px`} padding={`0 0 23px`}>
                  회원정보
                </Text>
              </Wrapper>

              <Wrapper dr={`row`}>
                <Text width={`25%`}>이메일</Text>
                <Text width={`75%`} fontWeight={`bold`}>
                  {me && me.email}
                </Text>
              </Wrapper>
              <Wrapper dr={`row`} padding={`18px 0`}>
                <Text width={`25%`}>연락처</Text>
                <Text width={`75%`} fontWeight={`bold`}>
                  {me && me.mobile}
                </Text>
              </Wrapper>
              <Wrapper dr={`row`}>
                <Text width={`25%`}>면허번호</Text>
                <Text width={`75%`} fontWeight={`bold`}>
                  {me && me.licenseNo}
                </Text>
              </Wrapper>
            </Wrapper>
            {/* <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 27px`}
              al={`flex-start`}
              margin={`0 0 16px`}
            >
              <Wrapper al={`flex-start`} ju={`space-between`} dr={`row`}>
                <Text fontSize={`22px`} padding={`0 0 23px`}>
                  탕전정보
                </Text>
                <MyinfoBtn>설정</MyinfoBtn>
              </Wrapper> */}
            {/* {me.map((data) => {
                return (
                  <>
                    <Wrapper dr={`row`}>
                      <Text width={`25%`}>유압</Text>
                      <Text width={`75%`} fontWeight={`bold`}>
                        {data.Hydraulics}
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} padding={`18px 0`}>
                      <Text width={`25%`}>본탕</Text>
                      <Text width={`75%`} fontWeight={`bold`}>
                        {data.bontang}
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`}>
                      <Text width={`25%`}>파우치</Text>
                      <Text width={`75%`} fontWeight={`bold`}>
                        {data.pouch}
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} padding={`18px 0 0`}>
                      <Text width={`25%`}>포장</Text>
                      <Text width={`75%`} fontWeight={`bold`}>
                        {data.packaging}
                      </Text>
                    </Wrapper>
                  </>
                );
              })} */}
            {/* </Wrapper> */}
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 27px`}
              al={`flex-start`}
              margin={`0 0 16px`}
            >
              <Wrapper al={`flex-start`} ju={`space-between`} dr={`row`}>
                <Text fontSize={`22px`} padding={`0 0 23px`}>
                  결제정보
                </Text>
                <MyinfoBtn onClick={() => moveLinkHandler(`./payment`)}>
                  추가
                </MyinfoBtn>
              </Wrapper>
              <Text>결제정보를 추가해주세요.</Text>
            </Wrapper>
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 27px`}
              al={`flex-start`}
              margin={`0 0 16px`}
            >
              <Wrapper al={`flex-start`} ju={`space-between`} dr={`row`}>
                <Text fontSize={`22px`} padding={`0 0 23px`}>
                  나의 주소록
                </Text>
                <MyinfoBtn
                  onClick={() => {
                    moveLinkHandler(`/address`);
                  }}
                >
                  설정
                </MyinfoBtn>
              </Wrapper>
              <Text>기본주소를 추가해주세요.</Text>
            </Wrapper>
            {/* <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 27px`}
              al={`flex-start`}
              margin={`0 0 16px`}
            >
              <Wrapper al={`flex-start`} ju={`space-between`} dr={`row`}>
                <Text fontSize={`22px`} padding={`0 0 23px`}>
                  쿠폰 관리
                </Text>
                <MyinfoBtn>설정</MyinfoBtn>
              </Wrapper>
              <Text>쿠폰을 등록해주세요.</Text>
            </Wrapper> */}
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

export default Question;
