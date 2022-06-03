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
import { Form, message, notification } from "antd";
import useOnlyNumberInput from "../../hooks/useOnlyNumberInput";
import useWidth from "../../hooks/useWidth";
import { useRouter } from "next/router";
import Modal from "antd/lib/modal/Modal";
import { CARD_PATCH_REQUEST } from "../../reducers/user";

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item:nth-child(1),
  & .ant-form-item:nth-child(3) {
    width: 100%;
  }
`;

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

  const { me, st_cardPatchDone, st_cardPatchError } = useSelector(
    (state) => state.user
  );

  const [isTerms, setIsTerms] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  ////// HOOKS //////
  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      message.error("로그인 후 이용해주세요.");
      return router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (st_cardPatchDone) {
      message.success("카드가 저장되었습니다.");
      return router.push("/user/myinfo");
    }
  }, []);

  useEffect(() => {
    if (st_cardPatchError) {
      return message.error(st_cardPatchError);
    }
  }, [st_cardPatchError]);

  ////// TOGGLE //////
  ////// HANDLER //////
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  const onSubmit = useCallback(
    (data) => {
      if (!data.cardNo) {
        return message.error("카드번호를 입력해주세요.");
      }
      if (!data.year || !data.month) {
        return message.error("유효기간을 입력해주세요.");
      }
      if (!data.password) {
        return message.error("비밀번호 앞두라지를 입력해주세요.");
      }
      if (!data.birth) {
        return message.error("주민등록번호 앞 6자리를 입력해주세요.");
      }
      if (!isTerms) {
        return message.error("정기과금 이용약관을 동의해주세요.");
      }

      dispatch({
        type: CARD_PATCH_REQUEST,
        data: {
          cardNo: data.cardNo,
          cardDate: "20" + data.year + "-" + data.month,
          cardPassword: data.password,
          cardBirth: data.birth,
        },
      });
    },
    [isTerms]
  );

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
            <CustomForm onFinish={onSubmit}>
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
                    <Form.Item name="cardNo">
                      <PaymentInput
                        width={`100%`}
                        margin={`0 0 30px`}
                        placeholder="카드번호"
                        maxLength="16"
                        type={`number`}
                      />
                    </Form.Item>

                    <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 30px`}>
                      <Form.Item style={{ width: `23%` }} name="month">
                        <PaymentInput
                          width={`100%`}
                          placeholder="월"
                          maxLength="2"
                          type={`number`}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{
                          width: `23%`,
                          marginRight: `20px`,
                          marginLeft: `20px`,
                        }}
                        name="year"
                      >
                        <PaymentInput
                          width={`100%`}
                          placeholder="년: 2자리"
                          maxLength="2"
                          type={`number`}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ width: `calc(54% - 40px)` }}
                        name="password"
                      >
                        <PaymentInput
                          width={`100%`}
                          placeholder="비밀번호: 앞 2자리"
                          type="password"
                          maxLength="2"
                        />
                      </Form.Item>
                    </Wrapper>
                    <Form.Item name="birth">
                      <PaymentInput
                        width={`100%`}
                        margin={`0 0 30px`}
                        placeholder="생년월일: 주민등록번호 앞 6자리"
                        maxLength="6"
                        type={`number`}
                      />
                    </Form.Item>
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
                  <PaymentBtn htmlType="submit">저장</PaymentBtn>
                </Wrapper>
              </Wrapper>
            </CustomForm>

            <TermsModal
              title="약관"
              visible={isModalVisible}
              onCancel={handleCancel}
              width={`350px`}
              footer
            >
              <Wrapper al={`flex-start`} fontSize={`12px`} color={Theme.grey_C}>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  1. 개인정보 수집, 이용 목적
                </Text>
                <Text textAlign={`left`}>
                  1) 회원가입을 위한 본인의 식별 및 회원관리
                </Text>
                <Text textAlign={`left`}>
                  2) 이용자의 수요를 파악하고 회사의 제품 및 서비스의 향상
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  3) 특정 물품(경품이벤트 당첨 등) 발송 또는 기타 필요한 경우
                  회원에 대한 연락의 목적
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  2. 수집하는 개인정보의 항목
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  - ID(전자우편주소), 비밀번호, 이름, 생년월일, 전화번호 및
                  이동전화번호, 면허번호, 진료기관명, 진료기관주소, 우편번호
                </Text>
                <Text textAlign={`left`} fontWeight={`bold`}>
                  3. 개인정보 보유 및 이용기간
                </Text>
                <Text textAlign={`left`} margin={`0 0 10px`}>
                  - 회원탈퇴 시 수집된 개인정보는 즉시 파기합니다.
                </Text>
              </Wrapper>
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
