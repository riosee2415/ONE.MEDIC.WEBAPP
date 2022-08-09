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
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { useRouter } from "next/router";
import { PAYMENT_DETAIL_REQUEST } from "../../reducers/paymentRequest";
import { numberWithCommas } from "../../components/commonUtils";
import { PPR_DETAIL_REQUEST } from "../../reducers/prescriptionPaymentRequest";
import { message } from "antd";

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  ////// HOOKS //////

  const { me } = useSelector((state) => state.user);
  const { paymentDetail } = useSelector((state) => state.paymentRequest);
  const { pprDetail } = useSelector(
    (state) => state.prescriptionPaymentRequest
  );

  const router = useRouter();
  const dispatch = useDispatch();

  const [openHistory, setOpenHistory] = useState(false);
  const [detailData, setDetailData] = useState(null);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, [me]);

  useEffect(() => {
    if (router.query) {
      if (router.query.type === "payment") {
        dispatch({
          type: PAYMENT_DETAIL_REQUEST,
          data: {
            paymentId: router.query.id,
          },
        });
      } else {
        dispatch({
          type: PPR_DETAIL_REQUEST,
          data: {
            pprId: router.query.id,
          },
        });
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (paymentDetail || pprDetail) {
      setDetailData(paymentDetail || pprDetail);
    }
  }, [paymentDetail, pprDetail]);

  ////// TOGGLE //////
  const historyToggle = useCallback(() => {
    setOpenHistory(!openHistory);
  });
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
                al={`flex-start`}
                ju={`flex-start`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                radius={`20px`}
              >
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
                    {console.log(detailData)}
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
                    받는 사람
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
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
                    연락처
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {detailData && detailData.mobile}
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
                    받는 주소
                  </Text>
                  <Text
                    width={`calc(100% - 100px)`}
                    fontSize={`18px`}
                    fontWeight={`700`}
                  >
                    {detailData && detailData.receiveAddress}
                    <Text margin={`10px 0 0`}>
                      {detailData && detailData.receiveDetailAddress}
                    </Text>
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
                    결제방법
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {detailData &&
                      (detailData.payInfo === "card"
                        ? "신용카드"
                        : detailData.payInfo === "phone"
                        ? "휴대폰 결제"
                        : detailData.payInfo === "nobank"
                        ? "무통장압금"
                        : detailData.payInfo === "simpleCard"
                        ? "간편 카드 결제"
                        : detailData.payInfo === "trans"
                        ? "계좌 간편 결제"
                        : "신용카드")}
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
                    결제일시
                  </Text>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {detailData && detailData.orderAt}
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
                    결제금액
                  </Text>
                  <Wrapper width={`calc(100% - 100px)`} fontSize={`18px`}>
                    <Wrapper dr={`row`} ju={`space-between`}>
                      <Text fontWeight={`700`}>신용카드</Text>
                      {detailData && (
                        <Text fontWeight={`700`}>
                          {numberWithCommas(detailData.totalPrice - 5000)}
                        </Text>
                      )}
                    </Wrapper>
                    <Wrapper dr={`row`} ju={`space-between`}>
                      <Text fontWeight={`700`}>배송비</Text>
                      <Text fontWeight={`700`}>5,000</Text>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>
                {paymentDetail && (
                  <Wrapper
                    borderTop={`1px solid ${Theme.grey2_C}`}
                    fontSize={`18px`}
                    fontWeight={`700`}
                    al={`flex-end`}
                    padding={`15px 0 0`}
                  >
                    {numberWithCommas(paymentDetail.totalPrice)}원
                  </Wrapper>
                )}
              </Wrapper>

              <Wrapper
                al={`flex-start`}
                ju={`flex-start`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                radius={`20px`}
                margin={`10px 0`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontSize={`22px`} fontWeight={`700`}>
                    {paymentDetail && paymentDetail.productName}
                  </Text>
                  <Text fontSize={`18px`}>
                    {paymentDetail && paymentDetail.username}
                  </Text>
                </Wrapper>

                {openHistory ? (
                  router.query && router.query.type === "payment" ? (
                    <>
                      {paymentDetail &&
                        paymentDetail.PaymentRequest.map((data) => (
                          <Wrapper
                            dr={`row`}
                            ju={`space-between`}
                            padding={`15px 0`}
                            borderBottom={`1px solid ${Theme.grey2_C}`}
                          >
                            <Wrapper width={`auto`} al={`flex-start`}>
                              <Text>{data.packVolumn}</Text>
                              <Text>
                                {data.typeVolumn}&nbsp;({data.unitVolumn})
                              </Text>
                            </Wrapper>
                            <Text>{data.viewPayment}</Text>
                          </Wrapper>
                        ))}
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        al={`flex-end`}
                        padding={`15px 0 0`}
                      >
                        189,000원
                      </Wrapper>
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        onClick={historyToggle}
                        cursor={`pointer`}
                        padding={`20px 0 0`}
                      >
                        닫기
                      </Wrapper>
                    </>
                  ) : (
                    <>
                      {pprDetail &&
                        pprDetail.materialDatum.map((data) => (
                          <Wrapper
                            dr={`row`}
                            ju={`space-between`}
                            padding={`15px 0`}
                            borderBottom={`1px solid ${Theme.grey2_C}`}
                          >
                            <Wrapper width={`auto`} al={`flex-start`}>
                              <Text>{data.name}</Text>
                            </Wrapper>
                            <Text>
                              {data.qnt}
                              {data.unit}
                            </Text>
                            <Text>{data.viewBuyPrice}</Text>
                          </Wrapper>
                        ))}
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        al={`flex-end`}
                        padding={`15px 0 0`}
                      >
                        {numberWithCommas(
                          pprDetail.materialDatum
                            .map((data) => data.buyPrice * data.qnt)
                            .reduce((a, b) => a + b)
                        )}
                        원
                      </Wrapper>
                      <Wrapper
                        fontSize={`18px`}
                        fontWeight={`700`}
                        onClick={historyToggle}
                        cursor={`pointer`}
                        padding={`20px 0 0`}
                      >
                        닫기
                      </Wrapper>
                    </>
                  )
                ) : (
                  <Wrapper
                    fontSize={`18px`}
                    padding={`30px 0 5px`}
                    onClick={historyToggle}
                    cursor={`pointer`}
                  >
                    상세내역확인
                  </Wrapper>
                )}
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
