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
  TextInput,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  DropboxOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";

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
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/2.cart.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
                  장바구니
                </Text>
              </Wrapper>
              <RightOutlined
                style={{ color: Theme.grey2_C, margin: "0 20px" }}
              />
              <Wrapper width={`auto`}>
                <Image
                  alt="icon"
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/3.delivery.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
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
              minHeight={`calc(100vh - 120px)`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              al={`flex-start`}
              ju={`flex-start`}
            >
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                padding={`0 0 15px`}
                borderBottom={`1px solid ${Theme.grey_C}`}
              >
                <Text
                  fontSize={`18px`}
                  color={Theme.black_C}
                  fontWeight={`700`}
                >
                  받는 사람
                </Text>
                <Text
                  fontSize={`16px`}
                  color={Theme.subTheme2_C}
                  cursor={`pointer`}
                >
                  주소록 불러오기
                </Text>
              </Wrapper>
              <Wrapper padding={`20px 20px 0`}>
                <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                  <Text
                    color={Theme.grey_C}
                    fontSize={`16px`}
                    fontWeight={`700`}
                    padding={`0 0 0 10px`}
                  >
                    받는사람
                  </Text>
                  <TextInput
                    border={`none`}
                    borderBottom={`1px solid ${Theme.grey2_C}`}
                    radius={`0`}
                    shadow={`none`}
                    width={`100%`}
                    placeholder={`받는 사람을 입력해주세요`}
                    phFontSize={`16px`}
                    focusBorder={`none`}
                    focusBorderBottom={`1px solid ${Theme.black_C}`}
                  />
                </Wrapper>

                <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                  <Text
                    color={Theme.grey_C}
                    fontSize={`16px`}
                    fontWeight={`700`}
                    padding={`0 0 0 10px`}
                  >
                    연락처
                  </Text>
                  <TextInput
                    border={`none`}
                    borderBottom={`1px solid ${Theme.grey2_C}`}
                    radius={`0`}
                    shadow={`none`}
                    width={`100%`}
                    placeholder={`(필수)연락처를 입력해주세요`}
                    phFontSize={`16px`}
                    focusBorder={`none`}
                    focusBorderBottom={`1px solid ${Theme.black_C}`}
                  />
                </Wrapper>

                <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                  <Text
                    color={Theme.grey_C}
                    fontSize={`16px`}
                    fontWeight={`700`}
                    padding={`0 0 0 10px`}
                  >
                    주소
                  </Text>
                  <Wrapper position={`relative`}>
                    <TextInput
                      border={`none`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      radius={`0`}
                      shadow={`none`}
                      width={`100%`}
                      placeholder={`받는 사람을 입력해주세요`}
                      phFontSize={`16px`}
                      focusBorder={`none`}
                      focusBorderBottom={`1px solid ${Theme.black_C}`}
                    />
                    <Wrapper
                      position={`absolute`}
                      width={`auto`}
                      right={`0`}
                      top={`0`}
                      bottom={`0`}
                    >
                      <SearchOutlined style={{ fontSize: `16px` }} />
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                  <Text
                    color={Theme.grey_C}
                    fontSize={`16px`}
                    fontWeight={`700`}
                    padding={`0 0 0 10px`}
                  >
                    상세주소
                  </Text>
                  <TextInput
                    border={`none`}
                    borderBottom={`1px solid ${Theme.grey2_C}`}
                    radius={`0`}
                    shadow={`none`}
                    width={`100%`}
                    placeholder={`상세주소를 입력해주세요`}
                    phFontSize={`16px`}
                    focusBorder={`none`}
                    focusBorderBottom={`1px solid ${Theme.black_C}`}
                  />
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
              <CommonButton
                shadow={`0`}
                width={`100%`}
                height={`50px`}
                radius={`0`}
                cursor={`pointer`}
              >
                확인
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
export default Index;
