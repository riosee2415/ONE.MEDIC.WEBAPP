import React, { useState, useCallback, useEffect, useRef } from "react";
import ClientLayout from "../../components/ClientLayout";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import {
  CHECKCODE_REQUEST,
  FILE_UPLOAD_REQUEST,
  LOAD_MY_INFO_REQUEST,
  SIGNUP_REQUEST,
} from "../../reducers/user";
import axios from "axios";
import { END } from "redux-saga";
import { useDispatch, useSelector } from "react-redux";
import wrapper from "../../store/configureStore";
import {
  RsWrapper,
  Wrapper,
  WholeWrapper,
  TextInput,
  CommonButton,
  Text,
  CommonCheckBox,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import { Checkbox, Form, message } from "antd";
import { useRouter } from "next/router";

const CustomForm = styled(Form)`
  width: 100%;
  & .ant-form-item {
    width: 100%;
  }
`;

const Join = () => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const {
    filePath,
    //
    st_checkCodeLoading,
    st_checkCodeDone,
    st_checkCodeError,
    st_fileUploadLoading,
    st_fileUploadDone,
    st_fileUploadError,
    st_signUpLoading,
    st_signUpDone,
    st_signUpError,
  } = useSelector((state) => state.user);

  ////// HOOKS //////
  const [checkCode, setCheckCode] = useState(null);
  const [isCheckCode, setIsCheckCode] = useState(false);
  const [terms, setTerms] = useState(false);
  const [emailData, setEmailData] = useState(null);

  const [submitForm] = Form.useForm();

  const router = useRouter();

  const fileRef = useRef();

  ////// REDUX //////

  const dispatch = useDispatch();
  ////// USEEFFECT //////

  useEffect(() => {
    if (st_checkCodeDone) {
      return message.success("전송되었습니다.");
    }
  }, [st_checkCodeDone]);

  useEffect(() => {
    if (st_fileUploadDone) {
      submitForm.setFieldsValue({
        file: filePath,
      });
      return message.success("첨부파일이 등록되었습니다.");
    }
  }, [st_fileUploadDone]);

  useEffect(() => {
    if (st_signUpDone) {
      router.push("/login");
      return message.success("회원가입이 되었습니다.");
    }
  }, [st_signUpDone]);

  useEffect(() => {
    if (st_checkCodeError) {
      return message.error(st_checkCodeError);
    }
  }, [st_checkCodeError]);

  useEffect(() => {
    if (st_fileUploadError) {
      return message.error(st_fileUploadError);
    }
  }, [st_fileUploadError]);

  useEffect(() => {
    if (st_signUpError) {
      return message.error(st_signUpError);
    }
  }, [st_signUpError]);

  ////// TOGGLE //////
  ////// HANDLER //////

  const termsChangeHandler = useCallback(
    (data) => {
      setTerms(data.target.checked);
    },
    [terms]
  );

  const checkCodeSendHandler = useCallback(
    (data) => {
      let randomCheckCode = "";
      for (let i = 0; i < 6; i++) {
        randomCheckCode += String(parseInt(Math.random() * 10));
      }

      setCheckCode(randomCheckCode);

      setEmailData(data.email);

      dispatch({
        type: CHECKCODE_REQUEST,
        data: {
          email: data.email,
          checkCode: randomCheckCode,
        },
      });
    },
    [checkCode, emailData]
  );

  const isCheckCodeHandler = useCallback(
    (data) => {
      console.log(data);
      if (data.checkCode === checkCode) {
        setIsCheckCode(true);
        return message.success("인증되었습니다.");
      } else {
        return message.error("인증번호가 같지 않습니다.");
      }
    },
    [checkCode]
  );

  const fileChangeHandler = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("file", file);
    });

    dispatch({
      type: FILE_UPLOAD_REQUEST,
      data: formData,
    });
  }, []);

  const fileUploadClick = useCallback(() => {
    fileRef.current.click();
  }, [fileRef.current]);

  const joinUserHandler = useCallback(
    (data) => {
      if (data.pass !== data.repass) {
        return message.error("비밀번호가 다릅니다.");
      }
      if (!isCheckCode) {
        return message.error("인증번호를 인증해주세요.");
      }

      if (!terms) {
        return message.error("개인정보제공에 동의해주세요.");
      }

      const checkPass =
        /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{10,12}$/.test(data.pass);

      if (!checkPass) {
        return message.error(
          "비밀번호는 영문, 숫자, 특수문자를 포함하여 10~12자리 이내로 입력해주세요."
        );
      }

      dispatch({
        type: SIGNUP_REQUEST,
        data: {
          email: emailData,
          username: data.name,
          nickname: data.nickname,
          mobile: data.mobile,
          password: data.pass,
          terms: terms,
          businessFile: data.file,
        },
      });
    },
    [isCheckCode, terms, emailData]
  );

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
            <Wrapper
              width={width < 800 ? `100%` : `450px`}
              padding={`100px 0`}
              al={`flex-start`}
            >
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                이메일
              </Text>
              <Wrapper dr={`row`} margin={`0 0 10px`}>
                <CustomForm onFinish={checkCodeSendHandler}>
                  <Wrapper dr={`row`}>
                    <Wrapper
                      width={
                        width < 800
                          ? `calc(100% - 105px)`
                          : `calc(100% - 120px)`
                      }
                      margin={`0 10px 0 0`}
                    >
                      <Form.Item
                        name="email"
                        rules={[
                          { required: true, message: "이메일을 입력해주세요." },
                        ]}
                      >
                        <TextInput
                          readOnly={isCheckCode}
                          placeholder={`이메일`}
                          type="email"
                          width={`100%`}
                        />
                      </Form.Item>
                    </Wrapper>
                    <CommonButton
                      disabled={isCheckCode}
                      loading={st_checkCodeLoading}
                      htmlType="submit"
                      width={width < 800 ? `95px` : `110px`}
                      height={`45px`}
                      kindOf={`white`}
                      margin={`0 0 25px`}
                    >
                      전송하기
                    </CommonButton>
                  </Wrapper>
                </CustomForm>
              </Wrapper>
              <Text
                fontSize={width < 800 ? `16px` : `18px`}
                margin={`0 0 5px`}
                color={Theme.grey_C}
              >
                인증번호
              </Text>
              <Wrapper dr={`row`} margin={`0 0 10px`}>
                <CustomForm onFinish={isCheckCodeHandler}>
                  <Wrapper dr={`row`}>
                    <Wrapper
                      width={
                        width < 800
                          ? `calc(100% - 105px)`
                          : `calc(100% - 120px)`
                      }
                      margin={`0 10px 0 0`}
                    >
                      <Form.Item
                        name="checkCode"
                        rules={[
                          {
                            required: true,
                            message: "인증번호를 입력해주세요.",
                          },
                        ]}
                      >
                        <TextInput
                          readOnly={isCheckCode}
                          placeholder={`인증번호를 입력해주세요.`}
                          type={`text`}
                          width={`100%`}
                        />
                      </Form.Item>
                    </Wrapper>
                    <CommonButton
                      disabled={isCheckCode}
                      htmlType="submit"
                      width={width < 800 ? `95px` : `110px`}
                      height={`45px`}
                      margin={`0 0 25px`}
                    >
                      확인하기
                    </CommonButton>
                  </Wrapper>
                </CustomForm>
              </Wrapper>
              <CustomForm form={submitForm} onFinish={joinUserHandler}>
                <Text
                  fontSize={width < 800 ? `16px` : `18px`}
                  margin={`0 0 5px`}
                  color={Theme.grey_C}
                >
                  비밀번호
                </Text>
                <Text fontSize={`12px`} color={Theme.red_C}>
                  ※ 비밀번호는 영문, 숫자, 특수문자를 포함하여 10~12자리 이내로
                  입력해주세요.
                </Text>
                <Form.Item
                  name="pass"
                  rules={[
                    {
                      required: true,
                      message: "비밀번호를 입력해주세요.",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={`비밀번호를 입력해주세요.`}
                    type="password"
                    width={`100%`}
                  />
                </Form.Item>
                <Form.Item
                  name="repass"
                  rules={[
                    {
                      required: true,
                      message: "비밀번호를 재입력해주세요.",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={`비밀번호를 재입력해주세요.`}
                    type="password"
                    width={`100%`}
                    margin={`0 0 10px`}
                  />
                </Form.Item>
                <Text
                  fontSize={width < 800 ? `16px` : `18px`}
                  margin={`0 0 5px`}
                  color={Theme.grey_C}
                >
                  이름
                </Text>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "이름을 입력해주세요.",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={`이름을 입력해주세요.`}
                    type={`text`}
                    width={`100%`}
                    margin={`0 0 10px`}
                  />
                </Form.Item>
                <Text
                  fontSize={width < 800 ? `16px` : `18px`}
                  margin={`0 0 5px`}
                  color={Theme.grey_C}
                >
                  닉네임
                </Text>
                <Form.Item
                  name="nickname"
                  rules={[
                    {
                      required: true,
                      message: "닉네임을 입력해주세요.",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={`닉네임을 입력해주세요.`}
                    type={`text`}
                    width={`100%`}
                    margin={`0 0 10px`}
                  />
                </Form.Item>
                <Text
                  fontSize={width < 800 ? `16px` : `18px`}
                  margin={`0 0 5px`}
                  color={Theme.grey_C}
                >
                  전화번호
                </Text>
                <Form.Item
                  name="mobile"
                  rules={[
                    {
                      required: true,
                      message: "전화번호를 입력해주세요.",
                    },
                  ]}
                >
                  <TextInput
                    placeholder={`전화번호를 입력해주세요.`}
                    type={`number`}
                    width={`100%`}
                    margin={`0 0 10px`}
                  />
                </Form.Item>
                <Text
                  fontSize={width < 800 ? `16px` : `18px`}
                  margin={`0 0 5px`}
                  color={Theme.grey_C}
                >
                  첨부파일
                </Text>
                <Wrapper dr={`row`} margin={`0 0 15px`}>
                  <Wrapper
                    width={
                      width < 800 ? `calc(100% - 105px)` : `calc(100% - 120px)`
                    }
                    margin={`0 10px 0 0`}
                  >
                    <input
                      type="file"
                      name="file"
                      hidden
                      ref={fileRef}
                      onChange={fileChangeHandler}
                    />
                    <Form.Item
                      name="file"
                      rules={[
                        {
                          required: true,
                          message: "첨부파일을 등록해주세요.",
                        },
                      ]}
                    >
                      <TextInput
                        readOnly
                        placeholder={`한의사면허증 또는 한의원사업자등록증`}
                        type={`text`}
                        width={`100%`}
                      />
                    </Form.Item>
                  </Wrapper>
                  <CommonButton
                    width={width < 800 ? `95px` : `110px`}
                    height={`45px`}
                    margin={`0 0 25px`}
                    loading={st_fileUploadLoading}
                    onClick={fileUploadClick}
                  >
                    첨부하기
                  </CommonButton>
                </Wrapper>

                <CommonCheckBox value={terms} onChange={termsChangeHandler}>
                  개인정보제공에 동의합니다.
                </CommonCheckBox>

                <CommonButton
                  loading={st_signUpLoading}
                  htmlType="submit"
                  width={`100%`}
                  height={`45px`}
                  margin={`15px 0 0`}
                >
                  회원가입
                </CommonButton>
              </CustomForm>
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
