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
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DropboxOutlined } from "@ant-design/icons";
import { PAYMENT_DETAIL_REQUEST } from "../../reducers/paymentRequest";
import { PPR_DETAIL_REQUEST } from "../../reducers/prescriptionPaymentRequest";

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { paymentDetail } = useSelector((state) => state.paymentRequest);
  const { pprDetail } = useSelector(
    (state) => state.prescriptionPaymentRequest
  );

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [detailData, setDetailData] = useState(null);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      if (router.query.type === "payment") {
        dispatch({
          type: PAYMENT_DETAIL_REQUEST,
          data: {
            paymentId: router.query.id,
          },
        });

        return;
      } else {
        dispatch({
          type: PPR_DETAIL_REQUEST,
          data: {
            pprId: router.query.id,
          },
        });

        return;
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (paymentDetail || pprDetail) {
      setDetailData(paymentDetail || pprDetail);
    }
  }, [paymentDetail, pprDetail]);

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
              minHeight={`calc(100vh - 120px)`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              al={`flex-start`}
              ju={`flex-start`}
            >
              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 30px`}
              >
                <Wrapper
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                >
                  <Text
                    fontSize={`1rem`}
                    fontWeight={`700`}
                    color={Theme.grey_C}
                    margin={`0 0 20px`}
                  >
                    배송조회
                  </Text>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  al={`flex-start`}
                  ju={`flex-start`}
                  borderBottom={`1px solid ${Theme.grey2_C}`}
                  padding={`15px 12px`}
                >
                  <Wrapper
                    width={`20px`}
                    margin={`0 40px 0 0`}
                    al={`flex-start`}
                  >
                    <Image
                      src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/delivery_icon/box.png`}
                      alt={`box`}
                    />
                  </Wrapper>
                  <Wrapper
                    al={`flex-start`}
                    ju={`flex-start`}
                    width={`calc(100% - 60px)`}
                  >
                    <Text
                      color={Theme.black_C}
                      fontSize={`18px`}
                      fontWeight={`700`}
                      margin={`0 0 7px`}
                    >
                      {detailData && detailData.viewDeliveryStatus}
                      {console.log(detailData)}
                    </Text>

                    {/* RECIVE DATA */}
                    <Wrapper
                      dr={`row`}
                      ju={`flex-start`}
                      al={`flex-start`}
                      margin={`20px 0 15px`}
                    >
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        받는 사람
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.receiveUser}
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
                        전화번호
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.receiveMobile}
                      </Text>
                    </Wrapper>

                    <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        받는 주소
                      </Text>

                      <Wrapper width={`auto`} al={`flex-start`}>
                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {detailData && detailData.receiveAddress}
                        </Text>

                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {detailData && detailData.receiveDetailAddress}
                        </Text>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      height={`1px`}
                      bgColor={Theme.grey2_C}
                      margin={`15px 0`}
                    />

                    {/* SEND DATA */}
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
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.sendUser}
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
                        전화번호
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.sendMobile}
                      </Text>
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                      <Text
                        width={`80px`}
                        margin={`0 20px 0 0`}
                        color={Theme.grey_C}
                        fontSize={`16px`}
                      >
                        보내는 주소
                      </Text>
                      <Wrapper width={`auto`} al={`flex-start`}>
                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {detailData && detailData.sendAddress}
                        </Text>

                        <Text fontSize={`14px`} fontWeight={`700`}>
                          {detailData && detailData.sendDetailAddress}
                        </Text>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      height={`1px`}
                      bgColor={Theme.grey2_C}
                      margin={`15px 0`}
                    />

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
                        배송회사
                      </Text>
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.deliveryCompany
                          ? detailData.deliveryCompany
                          : "배송회사가 없습니다."}
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
                      <Text fontSize={`14px`} fontWeight={`700`}>
                        {detailData && detailData.deliveryNo
                          ? detailData.deliveryNo
                          : "운송장번호가 없습니다."}
                      </Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            </Wrapper>

            {/* <Wrapper
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
            </Wrapper> */}
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
