import React, { useCallback, useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";
import axios from "axios";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import { Form, message } from "antd";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import { LOAD_MY_INFO_REQUEST, LOGIN_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import {
  RsWrapper,
  Wrapper,
  Image,
  WholeWrapper,
  TextInput,
  CommonButton,
  Text,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

const CustomForm = styled(Form)`
  width: 450px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Login = () => {
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { st_loginError, st_loginDone, me } = useSelector(
    (state) => state.user
  );

  const router = useRouter();

  ////// HOOKS //////

  const dispatch = useDispatch();

  const loginHandler = useCallback((data) => {
    dispatch({
      type: LOGIN_REQUEST,
      data: {
        email: data.email,
        password: data.password,
      },
    });
  }, []);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (st_loginError) {
      return message.error(st_loginError);
    }
  }, [st_loginError]);

  useEffect(() => {
    if (st_loginDone) {
      router.push("/");
      return message.success("로그인 되었습니다.");
    }
  }, [st_loginDone]);
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
          content={seo_desc.length < 1 ? "ModerlLab" : seo_desc[0].content}
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
          content={seo_desc.length < 1 ? "ModerlLab" : seo_desc[0].content}
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
            <Wrapper padding={`100px 0`}>
              <Image
                alt="logo"
                src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/logo/logo.png`}
                width={`170px`}
                margin={`0 0 60px`}
              />
              <CustomForm onFinish={loginHandler}>
                <Form.Item
                  rules={[
                    { required: true, message: "이메일을 입력해주세요." },
                  ]}
                  name="email"
                >
                  <TextInput
                    type="text"
                    width={`100%`}
                    height={`50px`}
                    placeholder={`이메일`}
                  />
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: true, message: "비밀번호를 입력해주세요." },
                  ]}
                  name="password"
                >
                  <TextInput
                    type="password"
                    width={`100%`}
                    height={`50px`}
                    placeholder={`비밀번호`}
                    margin={`15px 0`}
                  />
                </Form.Item>
                <CommonButton
                  width={`100%`}
                  height={`50px`}
                  margin={`15px 0`}
                  htmlType="submit"
                >
                  로그인
                </CommonButton>
              </CustomForm>

              <Wrapper dr={`row`} color={Theme.grey_C}>
                <Link href={`/join`}>
                  <a>
                    <Text margin={`0 20px 0 0`}>회원가입</Text>
                  </a>
                </Link>
                |
                <Link href={`/find/findEmail`}>
                  <a>
                    <Text margin={`0 20px 0`}>이메일 찾기</Text>
                  </a>
                </Link>
                |
                <Link href={`/find/findPw`}>
                  <a>
                    <Text margin={`0 0 0 20px`}>비밀번호 찾기</Text>
                  </a>
                </Link>
              </Wrapper>
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

export default Login;
