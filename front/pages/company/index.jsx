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

  @media (max-width: 700px) {
    &::placeholder {
      font-size: 14px;
    }
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

const WordBreackText = styled(Text)`
  word-break: break-all;
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

  const router = useRouter();

  const fileRef = useRef();

  const titleInput = useInput("");
  const companyNoInput = useInput("");

  const [fileValue, setFileValue] = useState(null);
  const [compnayNumCheck, setCompanyNumCheck] = useState(false);

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
      message.success("등록되었습니다.");
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

  // 사업자 번호 있는 사업자 번호인지 아닌지 검증
  const checkCompnayNumHandler = useCallback(() => {
    const b1 = companyNoInput.value.substr(0, 3);
    const b2 = companyNoInput.value.substr(2, 2);
    const b3 = companyNoInput.value.substr(4, 5);

    let checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
    // let tmpBizID, i, chkSum=0, c2, remander;

    let chkSum = 0;
    let c2 = null;
    let remander = null;
    let bizID = b1 + b2 + b3;

    if (bizID) return false;

    for (i = 0; i <= 7; i++) chkSum += checkID[i] * bizID.charAt(i);
    c2 = "0" + checkID[8] * bizID.charAt(8);
    c2 = c2.substring(c2.length - 2, c2.length);
    chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
    remander = (10 - (chkSum % 10)) % 10;

    if (Math.floor(bizID.charAt(9)) == remander) {
      setCompanyNumCheck(true);
    } // OK!
    else {
      setCompanyNumCheck(false);
    }
  }, [companyNoInput.value]);

  const onSubmit = useCallback(() => {
    if (!titleInput.value || titleInput.value.trim() === "") {
      return LoadNotification("안내", "화시 이름을 입력해주세요.");
    }

    if (!companyNoInput.value || companyNoInput.value.trim() === "") {
      return LoadNotification("안내", "사업자번호를 입력해주세요.");
    }

    // checkCompnayNumHandler();

    // if (!compnayNumCheck) {
    //   return LoadNotification("안내", "사업자번호를 정확하게 입력해주세요.");
    // }

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
  }, [
    me,
    titleInput.value,
    companyNoInput.value,
    companyFilePath,
    compnayNumCheck,
  ]);

  const onCancel = useCallback(() => {
    titleInput.setValue("");
    companyNoInput.setValue("");
  }, [titleInput.value, companyNoInput.value]);

  const fileClick = useCallback(() => {
    fileRef.current.click();
  }, []);

  const fileUploadHandler = useCallback((e) => {
    setFileValue(e.target.files[0].name);

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
        <title>ModerlLab | 한의원 등록</title>
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
                  한의원 등록
                </Text>
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  한의원 명
                </Text>
                <TitleInput
                  placeholder="등록할 한의원 명을 적어주세요."
                  {...titleInput}
                />
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  사업자번호
                </Text>
                <TitleInput
                  type="number"
                  placeholder="등록할 사업자번호를 `-`를 제외하고 적어주세요."
                  {...companyNoInput}
                />

                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  value={null}
                  onChange={fileUploadHandler}
                  accept=".png, .jpg"
                />
                <CommonButton onClick={fileClick}>
                  사업첨부파일 업로드
                </CommonButton>
                <WordBreackText>{fileValue}</WordBreackText>

                <Wrapper
                  dr={`row`}
                  ju={`flex-end`}
                  margin={width < 700 ? `20px 0 0` : `0`}
                >
                  <QuestionBtn onClick={onCancel} kindOf={`white`}>
                    취소
                  </QuestionBtn>
                  <QuestionBtn onClick={onSubmit}>등록</QuestionBtn>
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
