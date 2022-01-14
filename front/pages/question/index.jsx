import React, { useState, useCallback, useEffect } from "react";
import ClientLayout from "../../components/ClientLayout";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
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
import { Checkbox, message, notification } from "antd";
import { QUESTION_CREATE_REQUEST } from "../../reducers/question";
import useInput from "../../hooks/useInput";
import Modal from "antd/lib/modal/Modal";
import useWidth from "../../hooks/useWidth";

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
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );
  const { st_questionCreateDone, st_questionCreateError } = useSelector(
    (state) => state.question
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isTerms, setIsTerms] = useState(false);

  const titleInput = useInput("");
  const contentInput = useInput("");

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////
  ////// HANDLER //////
  useEffect(() => {
    if (st_questionCreateError) {
      return LoadNotification(
        "ERROR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }
  }, [st_questionCreateError]);

  useEffect(() => {
    if (st_questionCreateDone) {
      return LoadNotification(
        "등록완료",
        "문의사항이 정상적으로 등록되었습니다."
      );
    }
    titleInput.setValue("");
    contentInput.setValue("");
    setIsTerms(false);
  }, [st_questionCreateDone]);

  const TermsHandler = useCallback(
    (data) => {
      setIsTerms(data.target.checked);
    },
    [isTerms]
  );

  const onSubmit = useCallback(() => {
    if (!titleInput.value || titleInput.value.trim() === "") {
      return LoadNotification("안내", "제목을 입력해주세요.");
    }

    if (!contentInput.value || contentInput.value.trim() === "") {
      return LoadNotification("안내", "문의내용을 입력해주세요.");
    }

    if (isTerms === false) {
      return LoadNotification("안내", "개인정보 수집을 동의해주세요.");
    }

    dispatch({
      type: QUESTION_CREATE_REQUEST,
      data: {
        title: titleInput.value,
        type: 1,
        content: contentInput.value,
        isterm: isTerms.value,
      },
    });
  }, [titleInput.value, contentInput.value, isTerms]);

  const onCancel = useCallback(() => {
    titleInput.setValue("");
    contentInput.setValue("");
    setIsTerms(false);
  }, [titleInput.value, contentInput.value]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
                  문의하기
                </Text>
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  제목
                </Text>
                <TitleInput
                  placeholder="문의할 제목을 적어주세요."
                  {...titleInput}
                />
                <Text color={Theme.grey_C} fontWeight={`bold`}>
                  내용
                </Text>
                <ContentArea
                  placeholder="문의내용을 적어주세요."
                  {...contentInput}
                />
                <Wrapper
                  width={`auto`}
                  dr={`row`}
                  margin={`0 0 22px`}
                  al={`flex-start`}
                >
                  <Wrapper width={`auto`} padding={`0 12px 0 0`}>
                    <CommonCheckBox
                      checked={isTerms}
                      onChange={TermsHandler}
                      id="check"
                    />
                  </Wrapper>
                  <Wrapper width={`auto`} al={`flex-start`}>
                    <CustomLabel for="check">
                      <Wrapper
                        dr={`row`}
                        ju={`flex-start`}
                        width={`auto`}
                        fontSize={width < 500 ? `12px` : `14px`}
                        padding={`5px 0`}
                      >
                        <Text
                          borderBottom={`1px solid ${Theme.black_C}`}
                          lineHeight={`1`}
                        >
                          개인정보 제공
                        </Text>
                        <Text lineHeight={`1`}>
                          을 확인하였으며 이에 동의합니다.
                        </Text>
                      </Wrapper>
                    </CustomLabel>

                    <CommonButton
                      width={`52px`}
                      height={`25px`}
                      padding={`2px 0 0`}
                      fontSize={`12px`}
                      shadow={`none`}
                      onClick={showModal}
                    >
                      약관보기
                    </CommonButton>
                  </Wrapper>
                </Wrapper>
                <Wrapper dr={`row`} ju={`flex-end`}>
                  <QuestionBtn onClick={onCancel} kindOf={`white`}>
                    취소
                  </QuestionBtn>
                  <QuestionBtn onClick={onSubmit}>저장</QuestionBtn>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <TermsModal
              title="약관"
              visible={isModalVisible}
              onCancel={handleCancel}
              width={`350px`}
              footer
            >
              <Wrapper>test</Wrapper>
            </TermsModal>
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
