import React from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import wrapper from "../../store/configureStore";
import {
  RsWrapper,
  Wrapper,
  WholeWrapper,
  TextInput,
  CommonButton,
  Text,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import { Checkbox } from "antd";

const Join = () => {
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
          <RsWrapper minHeight={`calc(100vh - 170px - 64px)`}>
            <Wrapper padding={`100px 0`} al={`flex-start`}>
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                이메일
              </Text>
              <Wrapper dr={`row`} margin={`0 0 10px`}>
                <TextInput
                  placeholder={`이메일`}
                  type={`text`}
                  width={
                    width < 800 ? `calc(100% - 105px)` : `calc(100% - 120px)`
                  }
                  margin={`0 10px 0 0`}
                />
                <CommonButton
                  width={width < 800 ? `95px` : `110px`}
                  height={`45px`}
                  kindOf={`white`}
                >
                  전송완료
                </CommonButton>
              </Wrapper>
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                인증번호
              </Text>
              <Wrapper dr={`row`} margin={`0 0 10px`}>
                <TextInput
                  placeholder={`인증번호를 입력해주세요.`}
                  type={`text`}
                  width={
                    width < 800 ? `calc(100% - 105px)` : `calc(100% - 120px)`
                  }
                  margin={`0 10px 0 0`}
                />
                <CommonButton
                  width={width < 800 ? `95px` : `110px`}
                  height={`45px`}
                >
                  확인하기
                </CommonButton>
              </Wrapper>
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                비밀번호
              </Text>
              <TextInput
                placeholder={`비밀번호를 입력해주세요.`}
                type={`text`}
                width={`100%`}
                margin={`0 0 10px`}
              />
              <TextInput
                placeholder={`비밀번호를 재입력해주세요.`}
                type={`text`}
                width={`100%`}
                margin={`0 0 10px`}
              />
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                이름
              </Text>
              <TextInput
                placeholder={`이름을 입력해주세요.`}
                type={`text`}
                width={`100%`}
                margin={`0 0 10px`}
              />
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                첨부파일
              </Text>
              <Wrapper dr={`row`} margin={`0 0 15px`}>
                <TextInput
                  placeholder={`한의사면허증 또는 한의원사업자등록증`}
                  type={`text`}
                  width={
                    width < 800 ? `calc(100% - 105px)` : `calc(100% - 120px)`
                  }
                  margin={`0 10px 0 0`}
                />
                <CommonButton
                  width={width < 800 ? `95px` : `110px`}
                  height={`45px`}
                >
                  첨부하기
                </CommonButton>
              </Wrapper>
              <Checkbox>개인정보제공에 동의합니다.</Checkbox>
              <CommonButton width={`100%`} height={`45px`} margin={`15px 0 0`}>
                회원가입
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

export default Join;
