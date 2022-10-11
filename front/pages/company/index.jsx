import React, { useState, useCallback, useEffect, useRef } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import {
  COMPANY_SUBMIT_REQUEST,
  COMPANY_UPLOAD_REQUEST,
  LOAD_MY_INFO_REQUEST,
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
  Text,
  SpanText,
  CommonButton,
  TextArea,
  CommonCheckBox,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { Checkbox, message, notification, Empty } from "antd";
import useInput from "../../hooks/useInput";
import Modal from "antd/lib/modal/Modal";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";

const TitleInput = styled(TextInput)`
  height: 43px;
  width: 100%;
  box-shadow: none;
  border-bottom: 1px solid ${Theme.grey2_C};
  border-radius: 0;
  margin: 0 0 30px;

  &::placeholder {
    font-size: 18px;
  }

  &:focus {
    border: none;
    border-bottom: 1px solid ${Theme.grey_C};
  }
`;

const ContentArea = styled(TextArea)`
  width: 100%;
  border: 1px solid ${Theme.lightGrey_C};
  border-radius: 0;
  margin: 0 0 20px;

  &::placeholder {
    font-size: 18px;
    color: ${Theme.grey2_C};
  }

  &:focus {
    border: 1px solid ${Theme.grey_C};
  }
`;

const CustomLabel = styled.label`
  cursor: pointer;
`;

const QuestionBtn = styled(CommonButton)`
  width: 85px;
  height: 30px;
  box-shadow: none;
  border: none;
  margin: 0 0 0 5px;
`;

const TermsModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
  }

  .ant-modal-header {
    border-radius: 20px;
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const Question = () => {
  const width = useWidth();
  const dispatch = useDispatch();
  ////// GLOBAL STATE //////

  const {
    me,
    companyFilePath,

    st_companyFileUploadDone,
    st_companyFileUploadError,

    st_companyCreateDone,
    st_companyCreateError,
  } = useSelector((state) => state.user);

  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const router = useRouter();

  const fileRef = useRef();

  const titleInput = useInput("");
  const companyNoInput = useInput("");

  const [fileValue, setFileValue] = useState(null);

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      router.push("/login");
    }
  }, [me]);

  // 파일 업로드

  useEffect(() => {
    if (st_companyFileUploadDone) {
      setFileValue(null);
      return message.success("업로드되었습니다.");
    }
  }, [st_companyFileUploadDone]);

  useEffect(() => {
    if (st_companyFileUploadError) {
      return message.error(st_companyFileUploadError);
    }
  }, [st_companyFileUploadError]);

  // 화사 신청

  useEffect(() => {
    if (st_companyCreateDone) {
      message.success("신청되었습니다.");
      return router.push("/");
    }
  }, [st_companyCreateDone]);

  useEffect(() => {
    if (st_companyCreateError) {
      return message.error(st_companyCreateError);
    }
  }, [st_companyCreateError]);

  ////// TOGGLE //////
  ////// HANDLER //////

  const onSubmit = useCallback(() => {
    if (!titleInput.value || titleInput.value.trim() === "") {
      return LoadNotification("안내", "화시 이름을 입력해주세요.");
    }

    if (!companyNoInput.value || companyNoInput.value.trim() === "") {
      return LoadNotification("안내", "사업자번호를 입력해주세요.");
    }

    if (!companyFilePath || companyFilePath.trim() === "") {
      return LoadNotification("안내", "사업첨부파일을 업로드해주세요.");
    }

    dispatch({
      type: COMPANY_SUBMIT_REQUEST,
      data: {
        id: me.id,
        companyName: titleInput.value,
        companyNo: companyNoInput.value,
        companyFile: companyFilePath,
      },
    });
  }, [me, titleInput.value, companyNoInput.value, companyFilePath]);

  const onCancel = useCallback(() => {
    titleInput.setValue("");
    companyNoInput.setValue("");
  }, [titleInput.value, companyNoInput.value]);

  const fileClick = useCallback(() => {
    fileRef.current.click();
  }, []);

  const fileUploadHandler = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("file", file);
    });

    dispatch({
      type: COMPANY_UPLOAD_REQUEST,
      data: formData,
    });
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
            minHeight={`calc(100vh - 170px - 64px)`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 20px`}
              al={`flex-start`}
              margin={`16px 0 15px`}
            >
              <Wrapper al={`flex-start`}>
                <Text padding={`0 0 23px`} fontSize={`22px`}>
                  회사신청하기
                </Text>
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  회사 이름
                </Text>
                <TitleInput
                  placeholder="신청할 회사 이름을 적어주세요."
                  {...titleInput}
                />
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  사업자번호
                </Text>
                <TitleInput
                  placeholder="신청할 사업자번호를 적어주세요."
                  {...companyNoInput}
                />

                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  value={null}
                  onChange={fileUploadHandler}
                />
                <CommonButton onClick={fileClick}>
                  사업첨부파일 업로드
                </CommonButton>
                <Text>{companyFilePath}</Text>

                <Wrapper dr={`row`} ju={`flex-end`}>
                  <QuestionBtn onClick={onCancel} kindOf={`white`}>
                    취소
                  </QuestionBtn>
                  <QuestionBtn onClick={onSubmit}>신청</QuestionBtn>
                </Wrapper>
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

export default Question;
