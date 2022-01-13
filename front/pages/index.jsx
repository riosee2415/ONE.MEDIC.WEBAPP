import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../reducers/user";
import useInput from "../hooks/useInput";
import ClientLayout from "../components/ClientLayout";
import axios from "axios";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  TextInput,
  CommonButton,
} from "../components/commonComponents";
import useWidth from "../hooks/useWidth";
import Theme from "../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../reducers/seo";
import Head from "next/head";
import Popup from "../components/popup/popup";
import { useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { DatePicker, Space } from "antd";

const TagBtn = styled(Wrapper)`
  width: 75px;
  height: 35px;
  font-size: 15px;
  border-radius: ${(props) => props.radius || `10px`};
  background: ${(props) => props.theme.lightGrey2_C};
  color: ${(props) => props.theme.grey_C};
  border: 1px solid ${(props) => props.theme.lightGrey2_C};
`;

const Home = ({}) => {
  const width = useWidth();
  const { RangePicker } = DatePicker;
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

  const getEditContent = (contentValue) => {
    console.log(contentValue);
  };

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
            minHeight={`calc(100vh - 64px)`}
            ju={`flex-start`}
            position={`relative`}
            padding={`0`}
          >
            <Wrapper padding={width < 800 ? `0 10px` : `0 38px`}>
              <Wrapper position={`relative`} margin={`15px 0`}>
                <Wrapper
                  position={`absolute`}
                  top={`50%`}
                  left={`10px`}
                  width={`auto`}
                  color={Theme.basicTheme_C}
                  zIndex={`10`}
                  fontSize={`25px`}
                  margin={`-13px 0 0`}
                >
                  <SearchOutlined />
                </Wrapper>
                <TextInput
                  radius={`20px`}
                  height={`45px`}
                  width={`100%`}
                  type={`text`}
                  placeholder={`주문목록에서 검색`}
                  padding={`0 0 0 45px`}
                />
              </Wrapper>
              <RangePicker
                style={{
                  width: "100%",
                  border: "none",
                  height: 45,
                  borderRadius: 20,
                  boxShadow:
                    "5px 5px 15px rgba(77, 92, 123, 0.2), inset -5px -5px 15px rgba(77, 92, 123, 0.05)",
                }}
              />
            </Wrapper>

            <Wrapper
              dr={`row`}
              ju={`space-between`}
              margin={`20px 0`}
              padding={width < 800 ? `10px` : `10px 38px`}
              position={`sticky`}
              top={`0`}
              left={`0`}
              bgColor={Theme.white_C}
              zIndex={`10`}
            >
              <Text color={Theme.grey_C} fontWeight={`bold`}>
                주문목록
              </Text>
              <Text color={Theme.subTheme2_C}>처방하기</Text>
            </Wrapper>

            <Wrapper
              padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
              minHeight={`calc(100vh - 149px - 170px)`}
              ju={`flex-start`}
            >
              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`15px`}
                al={`flex-start`}
                margin={`0 0 15px`}
              >
                <Text fontSize={`14px`} color={Theme.grey_C}>
                  2022/01/04
                </Text>
                <Wrapper dr={`row`} ju={`space-between`} margin={`15px 0`}>
                  <Wrapper width={`auto`} al={`flex-start`}>
                    <Text fontSize={`18px`} fontWeight={`bold`}>
                      생강귤피탕
                    </Text>
                    <Text color={Theme.grey_C}>고객명</Text>
                    <Text>환자명</Text>
                  </Wrapper>
                  <TagBtn>결제완료</TagBtn>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  color={Theme.grey_C}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                  padding={`10px 0 0`}
                >
                  <Wrapper width={`calc(100% / 3)`}>배송조회</Wrapper>
                  <Wrapper
                    width={`calc(100% / 3)`}
                    borderRight={`1px solid ${Theme.grey2_C}`}
                    borderLeft={`1px solid ${Theme.grey2_C}`}
                  >
                    주문내역
                  </Wrapper>
                  <Wrapper width={`calc(100% / 3)`}>재처방</Wrapper>
                </Wrapper>
              </Wrapper>

              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`15px`}
                al={`flex-start`}
                margin={`0 0 15px`}
              >
                <Text fontSize={`14px`} color={Theme.grey_C}>
                  2022/01/04
                </Text>
                <Wrapper dr={`row`} ju={`space-between`} margin={`15px 0`}>
                  <Wrapper width={`auto`} al={`flex-start`}>
                    <Text fontSize={`18px`} fontWeight={`bold`}>
                      생강귤피탕
                    </Text>
                    <Text color={Theme.grey_C}>고객명</Text>
                    <Text>환자명</Text>
                  </Wrapper>
                  <TagBtn>결제완료</TagBtn>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  color={Theme.grey_C}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                  padding={`10px 0 0`}
                >
                  <Wrapper width={`calc(100% / 3)`}>배송조회</Wrapper>
                  <Wrapper
                    width={`calc(100% / 3)`}
                    borderRight={`1px solid ${Theme.grey2_C}`}
                    borderLeft={`1px solid ${Theme.grey2_C}`}
                  >
                    주문내역
                  </Wrapper>
                  <Wrapper width={`calc(100% / 3)`}>재처방</Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`15px`}
                al={`flex-start`}
                margin={`0 0 15px`}
              >
                <Text fontSize={`14px`} color={Theme.grey_C}>
                  2022/01/04
                </Text>
                <Wrapper dr={`row`} ju={`space-between`} margin={`15px 0`}>
                  <Wrapper width={`auto`} al={`flex-start`}>
                    <Text fontSize={`18px`} fontWeight={`bold`}>
                      생강귤피탕
                    </Text>
                    <Text color={Theme.grey_C}>고객명</Text>
                    <Text>환자명</Text>
                  </Wrapper>
                  <TagBtn>결제완료</TagBtn>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  color={Theme.grey_C}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                  padding={`10px 0 0`}
                >
                  <Wrapper width={`calc(100% / 3)`}>배송조회</Wrapper>
                  <Wrapper
                    width={`calc(100% / 3)`}
                    borderRight={`1px solid ${Theme.grey2_C}`}
                    borderLeft={`1px solid ${Theme.grey2_C}`}
                  >
                    주문내역
                  </Wrapper>
                  <Wrapper width={`calc(100% / 3)`}>재처방</Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper
              height={`50px`}
              position={`sticky`}
              bottom={`0`}
              left={`0`}
              dr={`row`}
              zIndex={`10`}
              bgColor={Theme.white_C}
            >
              <Wrapper
                height={`100%`}
                dr={`row`}
                width={
                  width < 800 ? `calc(100% - 130px)` : `calc(100% - 170px)`
                }
                ju={`flex-start`}
                padding={width < 800 ? `0 10px` : `0 38px`}
                fontSize={width < 800 ? `15px` : `20px`}
              >
                <Text fontWeight={`bold`}>총 주문금액 : </Text>
                <Text fontWeight={`bold`}> 432,000</Text>
              </Wrapper>
              <CommonButton
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
              >
                주문하기
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
export default Home;
