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
  Text,
  CommonButton,
  Image,
  TextInput,
  CommonCheckBox,
} from "../../components/commonComponents";
import Link from "next/link";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { message, notification } from "antd";
import useOnlyNumberInput from "../../hooks/useOnlyNumberInput";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";
import Modal from "antd/lib/modal/Modal";

const PaymentInput = styled(TextInput)`
  height: 43px;
  box-shadow: none;
  border-bottom: 1px solid ${Theme.grey2_C};
  border-radius: 0;
  padding: 0;

  &::placeholder {
    font-size: 16px;
  }

  &:focus {
    border: none;
    border-bottom: 1px solid ${Theme.grey_C};
  }

  @media (max-width: 500px) {
    &::placeholder {
      font-size: 12px;
    }
  }
`;

const CustomLabel = styled.label`
  cursor: pointer;
`;

const PaymentBtn = styled(CommonButton)`
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

const TermsModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 20px;
  }

  .ant-modal-header {
    border-radius: 20px;
  }
`;

const Question = () => {
  const width = useWidth();
  const dispatch = useDispatch();

  const router = useRouter();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const [isTerms, setIsTerms] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const cardNomInput = useOnlyNumberInput("");
  const monInput = useOnlyNumberInput("");
  const yearInput = useOnlyNumberInput("");
  const passwordInput = useOnlyNumberInput("");
  const birthInput = useOnlyNumberInput("");

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////
  ////// TOGGLE //////
  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onSubmit = useCallback(() => {
    if (!cardNomInput.value || cardNomInput.value.trim() === "") {
      return LoadNotification("안내", "카드번호를 입력해주세요.");
    }

    if (!monInput.value || monInput.value.trim() === "") {
      return LoadNotification("안내", "월을 입력해주세요.");
    }

    if (!yearInput.value || yearInput.value.trim() === "") {
      return LoadNotification("안내", "년을 입력해주세요.");
    }

    if (!passwordInput.value || passwordInput.value.trim() === "") {
      return LoadNotification("안내", "비밀번호 앞2자리를 입력해주세요.");
    }

    if (!birthInput.value || birthInput.value.trim() === "") {
      return LoadNotification("안내", "생년월일을 입력해주세요.");
    }

    if (isTerms === false) {
      return LoadNotification("안내", "정기과금 이용약관을 동의해주세요.");
    }

    message.success("카드정보가 등록되었습니다.");
    moveLinkHandler(`./myinfo`);
  }, [
    cardNomInput.value,
    monInput.value,
    yearInput.value,
    passwordInput.value,
    birthInput.value,
    isTerms,
  ]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const TermsHandler = useCallback(
    (data) => {
      setIsTerms(data.target.checked);
    },
    [isTerms]
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
          <RsWrapper
            minHeight={`calc(100vh - 170px - 64px)`}
            al={`flex-start`}
            ju={`flex-start`}
          >
            <Wrapper
              radius={`20px`}
              shadow={Theme.shadow_C}
              padding={`22px 34px 23px 31px`}
              al={`flex-start`}
              margin={`16px 0`}
            >
              <Text fontSize={`22px`} padding={`0 0 23px`}>
                결제카드
              </Text>
              <Wrapper dr={`row`} al={`flex-start`}>
                <Wrapper width={`22px`} margin={`12px 12px 0 0`}>
                  <Image
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/pay_icon/card.png`}
                  />
                </Wrapper>
                <Wrapper width={`calc(100% - 34px)`}>
                  <PaymentInput
                    width={`100%`}
                    margin={`0 0 30px`}
                    placeholder="카드번호"
                    maxLength="16"
                    {...cardNomInput}
                  />
                  <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 30px`}>
                    <PaymentInput
                      width={`23%`}
                      placeholder="월"
                      maxLength="2"
                      {...monInput}
                    />
                    <PaymentInput
                      width={`23%`}
                      margin={`0 20px`}
                      placeholder="년: 2자리"
                      maxLength="2"
                      {...yearInput}
                    />
                    <PaymentInput
                      width={`calc(54% - 40px)`}
                      placeholder="비밀번호: 앞 2자리"
                      type="password"
                      maxLength="2"
                      {...passwordInput}
                    />
                  </Wrapper>
                  <PaymentInput
                    width={`100%`}
                    margin={`0 0 30px`}
                    placeholder="생년월일: 주민등록번호 앞 6자리"
                    maxLength="6"
                    {...birthInput}
                  />
                </Wrapper>
              </Wrapper>
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
                        정기과금 이용약관
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
                <PaymentBtn
                  kindOf={`white`}
                  onClick={() => moveLinkHandler(`./myinfo`)}
                >
                  취소
                </PaymentBtn>
                <PaymentBtn onClick={onSubmit}>저장</PaymentBtn>
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
