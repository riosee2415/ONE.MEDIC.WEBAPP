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
  SpanText,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DropboxOutlined, RightOutlined, UpOutlined } from "@ant-design/icons";

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
                    ></Wrapper>
                    <Wrapper
                      width={`calc(100% / 3 - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    ></Wrapper>
                    <Wrapper
                      width={`calc(100% / 3 - 2px)`}
                      height={`50px`}
                      radius={`10px`}
                      border={`1px solid ${Theme.grey2_C}`}
                    ></Wrapper>
                  </Wrapper>
                  <Wrapper dr={`row`}>
                    <Text fontSize={`16px`} color={Theme.black_C}>
                      선택한 결제 수단을 다음에도 선택
                    </Text>
                  </Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper al={`flex-start`} ju={`flex-start`}>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    받는 사람
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    청구경희한의원
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    보내는 사람
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    청구경희한의원
                  </Text>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  ju={`flex-start`}
                  al={`flex-start`}
                  margin={`0 0 15px`}
                >
                  <Text
                    width={`80px`}
                    margin={`0 20px 0 0`}
                    color={Theme.grey_C}
                    fontSize={`16px`}
                  >
                    운송장번호
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    4075-8320-25
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
