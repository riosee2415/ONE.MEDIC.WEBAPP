import React, { useEffect, useCallback, useState } from "react";
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
  SpanText,
  CommonCheckBox,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  CloseOutlined,
  DropboxOutlined,
  RightOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Modal, Select } from "antd";

const CustomSelect = styled(Select)`
  width: 100%;
  & .ant-select-selection-item {
    font-size: ${(props) => props.fontSize || `18px`};
    color: ${(props) => props.color || Theme.black_C};
    line-height: 45px !important;
  }

  & .ant-select-selector {
    height: ${(props) => props.height || `45px`} !important;
  }
  & .ant-select-selector:hover {
    height: ${(props) => props.height || `45px`} !important;
    border-color: ${Theme.basicTheme_C} !important;
  }

  & .ant-select-selection-placeholder {
    line-height: 45px !important;
  }
  & .ant-select-selection-search-input {
    height: 45px !important;
    font-size: 18px !important;
  }

  & .ant-select-selector {
    border: 1px solid ${Theme.grey2_C} !important;
    border-radius: 10px !important;
  }

  & .ant-select-selection-placeholder {
    font-size: 18px !important;
  }
`;

const CustomModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }
`;

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispacth = useDispatch();

  const [couponModal, setCouponModal] = useState(false);
  const [payOkModal, setPayOkModal] = useState(false);

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
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/4.card.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`}>
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
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 16px`}
              >
                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`22px`}
                    color={Theme.black_C}
                    margin={`0 0 20px`}
                  >
                    배송지
                  </Text>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`700`}
                    color={Theme.black_C}
                    margin={`0 0 12px`}
                  >
                    고객명
                  </Text>
                  <Text
                    fontSize={`16px`}
                    color={Theme.grey_C}
                    margin={`0 0 12px`}
                  >
                    고객명
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    주소
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 16px`}
              >
                <Wrapper al={`flex-start`}>
                  <Text
                    fontSize={`22px`}
                    color={Theme.black_C}
                    margin={`0 0 20px`}
                  >
                    요청사항
                  </Text>
                  <Text
                    fontSize={`18px`}
                    color={Theme.black_C}
                    margin={`0 0 12px`}
                  >
                    배송시 요청사항이 없습니다.
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 16px`}
              >
                <Wrapper
                  dr={`row`}
                  al={`flex-end`}
                  ju={`space-between`}
                  margin={`0 0 22px`}
                >
                  <Text fontSize={`22px`} color={Theme.black_C}>
                    주문내역
                  </Text>
                  <Text
                    fontSize={`16px`}
                    color={Theme.subTheme2_C}
                    cursor={`pointer`}
                    onClick={() => setCouponModal(true)}
                  >
                    쿠폰함
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  al={`flex-end`}
                  ju={`space-between`}
                  margin={`0 0 20px`}
                >
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    생강귤피탕
                  </Text>
                  <Text
                    fontSize={`18px`}
                    color={Theme.black_C}
                    cursor={`pointer`}
                  >
                    고객명
                  </Text>
                </Wrapper>

                <Wrapper
                  borderBottom={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      약재
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      174,000
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      조제
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      3,000
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      탕전
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      12,000
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      포장
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      5,440
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      합계
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      5,440
                    </Text>
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  borderBottom={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      처방전 총 금액
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      195,840
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      쿠폰적용
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      -5,000
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      배송비
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      5,000
                    </Text>
                  </Wrapper>
                </Wrapper>
                <Wrapper al={`flex-end`}>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    195,840<SpanText fontWeight={`500`}>원</SpanText>
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 16px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontSize={`22px`} margin={`0 0 20px`}>
                    결재수단
                  </Text>
                  <UpOutlined style={{ fontSize: `16px` }} />
                </Wrapper>
                <Wrapper>
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 5px`}>
                    <Wrapper
                      width={`calc(50% - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    >
                      <Text fontSize={`16px`} color={Theme.black_C}>
                        카드 간편 결제
                      </Text>
                    </Wrapper>
                    <Wrapper
                      width={`calc(50% - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    >
                      <Text fontSize={`16px`} color={Theme.black_C}>
                        계좌 간편 결제
                      </Text>
                    </Wrapper>
                  </Wrapper>
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
                    <Wrapper
                      width={`calc(100% / 3 - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    >
                      <Text fontSize={`16px`} color={Theme.black_C}>
                        신용카드
                      </Text>
                    </Wrapper>
                    <Wrapper
                      width={`calc(100% / 3 - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    >
                      <Text fontSize={`16px`} color={Theme.black_C}>
                        휴대폰 결제
                      </Text>
                    </Wrapper>
                    <Wrapper
                      width={`calc(100% / 3 - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    >
                      <Text fontSize={`16px`} color={Theme.black_C}>
                        무통장입금
                      </Text>
                    </Wrapper>
                  </Wrapper>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <CommonCheckBox style={{ margin: `0 5px 0 0` }} />
                    <Text fontSize={`16px`} color={Theme.black_C}>
                      선택한 결제 수단을 다음에도 선택
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                  <CommonCheckBox />
                  <Text margin={`0 0 0 16px`} fontSize={`20px`}>
                    결제 진행 필수 동의
                  </Text>
                </Wrapper>
                <Wrapper
                  al={`flex-start`}
                  width={`calc(100% - 16px)`}
                  padding={`0 0 0 32px`}
                >
                  <Text fontSize={`16px`} margin={`0 0 13px`}>
                    개인정보 수집 · 이용 및 처리 동의&nbsp;
                    <SpanText color={Theme.grey_C}>(필수)</SpanText>
                  </Text>
                  <Text fontSize={`16px`} margin={`0 0 13px`}>
                    결제대행 서비스 약관 동의&nbsp;
                    <SpanText color={Theme.grey_C}>(필수)</SpanText>
                  </Text>
                  <Text fontSize={`16px`}>
                    전자지급 결제대행 서비스 이용약관 동의&nbsp;
                    <SpanText color={Theme.grey_C}>(필수)</SpanText>
                  </Text>
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
                <Text
                  fontSize={`20px`}
                  fontWeight={`700`}
                  onClick={() => setPayOkModal(true)}
                >
                  195,840원 결제하기
                </Text>
              </CommonButton>
            </Wrapper>
            <CustomModal
              visible={couponModal}
              footer={null}
              closable={false}
              width={360}
            >
              <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
                <Text fontSize={`20px`} fontWeight={`700`}>
                  쿠폰함
                </Text>
                <CloseOutlined
                  onClick={() => setCouponModal(false)}
                  style={{ fontSize: `18px` }}
                />
              </Wrapper>
              <Wrapper
                padding={`0 0 30px`}
                borderBottom={`1px solid ${Theme.grey2_C}`}
              >
                <CustomSelect placeholder={`쿠폰선택`}>
                  <Select.Option></Select.Option>
                </CustomSelect>
              </Wrapper>
              <Wrapper margin={`20px 0 0 0`}>
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontSize={`18px`} color={Theme.black_C}>
                    처방 금액
                  </Text>
                  <Text color={Theme.black_C} fontSize={`18px`}>
                    36,000
                  </Text>
                </Wrapper>
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontSize={`18px`} color={Theme.black_C}>
                    쿠폰 할인가
                  </Text>
                  <Text
                    color={Theme.black_C}
                    fontSize={`18px`}
                    fontWeight={`700`}
                    color={Theme.subTheme2_C}
                  >
                    8,600
                  </Text>
                </Wrapper>
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text
                    fontSize={`18px`}
                    fontWeight={`700`}
                    color={Theme.black_C}
                  >
                    최종 처방 금액
                  </Text>
                  <Text
                    color={Theme.black_C}
                    fontSize={`18px`}
                    fontWeight={`700`}
                  >
                    27,400
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} ju={`flex-end`} margin={`30px 0 0 0`}>
                <Wrapper
                  fontSize={`18px`}
                  width={`90px`}
                  height={`40px`}
                  padding={`0`}
                  margin={`0 5px 0 0`}
                  cursor={`pointer`}
                  onClick={() => setCouponModal(false)}
                >
                  취소
                </Wrapper>
                <CommonButton
                  fontSize={`18px`}
                  fontWeight={`700`}
                  width={`90px`}
                  height={`40px`}
                  padding={`0`}
                  onClick={() => setCouponModal(false)}
                >
                  적용하기
                </CommonButton>
              </Wrapper>
            </CustomModal>

            <CustomModal
              visible={payOkModal}
              footer={null}
              closable={false}
              width={330}
              centered
            >
              <Wrapper>
                <Text
                  color={Theme.grey_C}
                  fontSize={`18px`}
                  margin={`0 0 18px`}
                >
                  주문된 상품을 결제하시겠습니까?
                </Text>
                <Wrapper dr={`row`} ju={`flex-end`} margin={`30px 0 0 0`}>
                  <Wrapper
                    fontSize={`18px`}
                    width={`90px`}
                    height={`40px`}
                    padding={`0`}
                    margin={`0 5px 0 0`}
                    cursor={`pointer`}
                    onClick={() => setPayOkModal(false)}
                  >
                    아니요
                  </Wrapper>
                  <CommonButton
                    fontSize={`18px`}
                    fontWeight={`700`}
                    width={`90px`}
                    height={`40px`}
                    padding={`0`}
                    onClick={() => setPayOkModal(false)}
                  >
                    네
                  </CommonButton>
                </Wrapper>
              </Wrapper>
            </CustomModal>
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
