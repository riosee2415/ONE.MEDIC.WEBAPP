import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
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
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { DownOutlined, RightOutlined, UpOutlined } from "@ant-design/icons";
import { Modal, Select, message, notification } from "antd";
import {
  PAYMENT_DETAIL_REQUEST,
  PAYMENT_ISPAYMENT_REQUEST,
} from "../../reducers/paymentRequest";
import { DISCOUNT_USER_REQUEST } from "../../reducers/discount";
import {
  PPR_DETAIL_REQUEST,
  PPR_ISPAYMENT_REQUEST,
} from "../../reducers/prescriptionPaymentRequest";
import { numberWithCommas } from "../../components/commonUtils";
import { PP_GET_REQUEST } from "../../reducers/prescriptionPrice";
import {
  BOUGHT_DETAIL_REQUEST,
  BOUGHT_PAY_REQUEST,
} from "../../reducers/boughtHistory";
import {
  WISH_PAYMENT_DETAIL_REQUEST,
  WISH_PRE_DETAIL_REQUEST,
} from "../../reducers/wish";

const CustomModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    style: {
      marginTop: "100px",
    },
    onClick: () => {},
  });
};

const PayBtn = styled.button`
  width: calc(50% - 2px);
  height: 50px;
  border-radius: 10px;
  padding: 0px;
  cursor: pointer;
  color: ${(props) =>
    props.isActive ? props.theme.white_C : props.theme.basicTheme_C};
  background-color: ${(props) =>
    props.isActive ? props.theme.basicTheme_C : props.theme.white_C};
  border: 1px solid
    ${(props) =>
      props.isActive ? props.theme.basicTheme_C : props.theme.grey2_C};
`;

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const { paymentDetail, st_paymentIsPaymentDone, st_paymentIsPaymentError } =
    useSelector((state) => state.paymentRequest);

  const { userDiscount } = useSelector((state) => state.discount);

  const {
    pprDetail,
    //
    st_pprDetailError,
    //
    st_pprIsPayMentDone,
    st_pprIsPayMentError,
  } = useSelector((state) => state.prescriptionPaymentRequest);

  const { boughtDetail } = useSelector((state) => state.boughtHistory);

  const {
    wishPaymentDetail,
    wishPreDetail,

    st_boughtPayDone,
    st_boughtPayError,
  } = useSelector((state) => state.wish);

  const { price } = useSelector((state) => state.prescriptionPrice);

  ////// HOOKS //////
  const router = useRouter();

  const dispatch = useDispatch();

  const [payOkModal, setPayOkModal] = useState(false);
  const [payOpenToggle, setPayOpenToggle] = useState(false);

  const [productPayment, setProductPayment] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [paymentType, setPaymentType] = useState(null);

  const [isAgree1, setIsAgree1] = useState(false);
  const [isAgree2, setIsAgree2] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    } else {
      if (me.payInfo && me.payInfo.trim().length > 0) {
        setPaymentType(me.payInfo);
        setIsAgree1(true);
      }

      dispatch({
        type: DISCOUNT_USER_REQUEST,
        data: {
          operatorLevel: me.operatorLevel,
        },
      });
    }
  }, [me]);

  useEffect(() => {
    if (userDiscount && productPayment) {
      setDiscount(parseInt((userDiscount.value / 100) * productPayment));
    }
  }, [userDiscount, productPayment]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: BOUGHT_DETAIL_REQUEST,
        data: {
          id: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (boughtDetail) {
      if (boughtDetail.wishPaymentId) {
        dispatch({
          type: WISH_PAYMENT_DETAIL_REQUEST,
          data: {
            containerId: boughtDetail.wishPaymentId,
          },
        });
      } else {
        dispatch({
          type: WISH_PRE_DETAIL_REQUEST,
          data: {
            wishPrescriptrionId: boughtDetail.wishPreId,
          },
        });
      }
    }
  }, [boughtDetail]);

  useEffect(() => {
    if (boughtDetail) {
      if (boughtDetail.wishPaymentId) {
        // 약속처방
        if (wishPaymentDetail) {
          setProductPayment(
            wishPaymentDetail.items
              .map((data) => data.price)
              .reduce((a, b) => a + b)
          );
        }
      } else {
        // 탕전처방
        if (wishPreDetail) {
          setProductPayment(
            wishPreDetail.materials
              .map((data) => data.totalPrice)
              .reduce((a, b) => a + b) +
              wishPreDetail.packPrice +
              price.pharmacyPrice +
              price.tangjeonPrice
          );
        }
      }
    }
  }, [wishPaymentDetail, wishPreDetail, boughtDetail]);

  // 결제

  useEffect(() => {
    if (st_boughtPayDone) {
      message.success("주문되었습니다.");
      return router.push("/");
    }
  }, [st_boughtPayDone]);

  useEffect(() => {
    if (st_boughtPayError) {
      return message.error(st_boughtPayError);
    }
  }, [st_boughtPayError]);

  useEffect(() => {
    if (st_pprDetailError) {
      return message.error(st_pprDetailError);
    }
  }, [st_pprDetailError]);

  ////// TOGGLE //////

  ////// HANDLER //////

  const paymentSelectHadnler = useCallback(
    (type) => {
      setPaymentType(type);
    },
    [paymentType]
  );

  const boughtProductHandler = useCallback(() => {
    if (!isAgree2) {
      return LoadNotification("안내", "결제 동의을 체크해주세요.");
    }
    if (!paymentType) {
      return LoadNotification("안내", "결제 수단을 선택해주세요.");
    }

    if (paymentType === "simpleCard") {
      dispatch({
        type: PAYMENT_ISPAYMENT_REQUEST,
        data: {
          paymentId: router.query.id,
          isCard: "1",
          totalPrice:
            productPayment - discount + (price && price.deliveryPrice),
        },
      });
    } else {
      const d = new Date();

      let year = d.getFullYear() + "";
      let month = d.getMonth() + 1 + "";
      let date = d.getDate() + "";
      let hour = d.getHours() + "";
      let min = d.getMinutes() + "";
      let sec = d.getSeconds() + "";
      let mSec = d.getMilliseconds() + "";

      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      hour = hour < 10 ? "0" + hour : hour;
      min = min < 10 ? "0" + min : min;
      sec = sec < 10 ? "0" + sec : sec;
      mSec = mSec < 10 ? "0" + mSec : mSec;

      let orderPK = "ORD" + year + month + date + hour + min + sec + mSec;

      const IMP = window.IMP;

      if (me) {
        if (boughtDetail) {
          if (paymentType === "nobank") {
            dispatch({
              type: BOUGHT_PAY_REQUEST,
              data: {
                id: router.query.id,
                isMonth: 0,
                isPay: 1,
                payInfo: paymentType,
                totalPrice: productPayment + (price && price.deliveryPrice),
                pharmacyPrice: price && price.pharmacyPrice,
                tangjeonPrice: price && price.tangjeonPrice,
                deliveryPrice: price && price.deliveryPrice,
                impUid: null,
                merchantUid: null,
              },
            });
          } else {
            IMP.request_pay(
              {
                pg: paymentType === "phone" ? "danal" : "danal_tpay",
                pay_method: paymentType,
                merchant_uid: orderPK,
                name: boughtDetail.wishPaymentId
                  ? wishPaymentDetail.productName
                  : wishPreDetail.title,
                // amount: productPayment + (price && price.deliveryPrice),
                amount: 150,
                buyer_name: me.username,
                buyer_tel: me.mobile.replace(
                  /^(\d{2,3})(\d{3,4})(\d{4})$/,
                  `$1-$2-$3`
                ),
                buyer_email: me.email,
                buyer_addr: boughtDetail.wishPaymentId
                  ? wishPaymentDetail.receiveAddress
                  : wishPreDetail.receiveAddress,

                // buyer_postcode: boughtDetail.wishPaymentId
                //   ? wishPaymentDetail.receiveAddress.substring(
                //       wishPaymentDetail.receiveAddress.length - 6,
                //       wishPaymentDetail.receiveAddress.length - 1
                //     )
                //   : wishPreDetail.receiveAddress.substring(
                //       wishPreDetail.receiveAddress.length - 6,
                //       wishPreDetail.receiveAddress.length - 1
                //     ),
              },
              async (rsp) => {
                if (rsp.success) {
                  console.log(rsp);
                  dispatch({
                    type: BOUGHT_PAY_REQUEST,
                    data: {
                      id: router.query.id,
                      isMonth: 0,
                      isPay: 1,
                      payInfo: paymentType,
                      totalPrice:
                        productPayment + (price && price.deliveryPrice),
                      pharmacyPrice: price && price.pharmacyPrice,
                      tangjeonPrice: price && price.tangjeonPrice,
                      deliveryPrice: price && price.deliveryPrice,
                      impUid: rsp.imp_uid,
                      merchantUid: rsp.merchant_uid,
                    },
                  });
                } else {
                  console.log(rsp);
                  return console.log("결제실패");
                }
              }
            );
          }
        }
      }
    }
  }, [
    isAgree2,
    productPayment,
    discount,
    router.query,
    paymentType,
    me,
    isAgree1,
    wishPaymentDetail,
    wishPreDetail,
  ]);

  ////// DATAVIEW //////

  return (
    <>
      <Head>
        <title>ModerlLab</title>
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
                    {boughtDetail && boughtDetail.receiveUser}
                  </Text>
                  <Text
                    fontSize={`16px`}
                    color={Theme.grey_C}
                    margin={`0 0 12px`}
                  >
                    {boughtDetail && boughtDetail.receiveMobile}
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    {boughtDetail && boughtDetail.receiveAddress}
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    {boughtDetail && boughtDetail.receiveDetailAddress}
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    {boughtDetail && boughtDetail.deliveryMessage}
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

                  {boughtDetail &&
                    (boughtDetail.wishPaymentId
                      ? wishPaymentDetail && (
                          // 약속처방
                          <>
                            <Text
                              fontSize={`18px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPaymentDetail.productname}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPaymentDetail.receiverName}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPaymentDetail.medication}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPaymentDetail.content}
                            </Text>
                          </>
                        )
                      : wishPreDetail && (
                          // 탕전처방
                          <>
                            <Text
                              fontSize={`18px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPreDetail.title}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPreDetail.receiverName}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPreDetail.medication}
                            </Text>
                            <Text
                              fontSize={`16px`}
                              color={Theme.black_C}
                              margin={`0 0 12px`}
                            >
                              {wishPreDetail.content}
                            </Text>
                          </>
                        ))}
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
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  al={`flex-end`}
                  ju={`space-between`}
                  margin={`0 0 20px`}
                >
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.productName
                      : pprDetail && pprDetail.name}
                  </Text>

                  <Text
                    fontSize={`18px`}
                    color={Theme.black_C}
                    cursor={`pointer`}
                  >
                    {me && me.username}
                  </Text>
                </Wrapper>

                <Wrapper
                  borderBottom={`1px solid ${Theme.grey_C}`}
                  margin={`0 0 20px`}
                >
                  {boughtDetail &&
                    (boughtDetail.wishPaymentId
                      ? wishPaymentDetail && (
                          // 약속처방
                          <>
                            {wishPaymentDetail.items.map((data) => {
                              return (
                                <Wrapper
                                  dr={`row`}
                                  ju={`space-between`}
                                  margin={`0 0 20px`}
                                >
                                  <Text color={Theme.gray_C} fontSize={`16px`}>
                                    {data.pack}/{data.type}/{data.unit}
                                  </Text>
                                  <Text fontSize={`18px`} color={Theme.grey_C}>
                                    {data.viewPrice}
                                  </Text>
                                </Wrapper>
                              );
                            })}
                          </>
                        )
                      : wishPreDetail && (
                          // 탕전처방
                          <>
                            {wishPreDetail.materials.map((data) => (
                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                margin={`0 0 20px`}
                              >
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`start`}
                                  color={Theme.gray_C}
                                  fontSize={`16px`}
                                >
                                  {data.name}
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`center`}
                                  fontSize={`18px`}
                                  color={Theme.grey_C}
                                >
                                  {data.qnt}
                                  {data.unit}
                                </Text>
                                <Text
                                  width={`calc(100% / 3)`}
                                  textAlign={`end`}
                                  fontSize={`18px`}
                                  color={Theme.grey_C}
                                >
                                  {data.viewTotalPrice}
                                </Text>
                              </Wrapper>
                            ))}
                          </>
                        ))}

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      종류
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      {wishPreDetail && wishPreDetail.viewPackPrice}
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      탕전
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      {price && price.viewTangjeonPrice}
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      조제
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      {price && price.viewPharmacyPrice}
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.gray_C} fontSize={`16px`}>
                      합계
                    </Text>
                    <Text fontSize={`18px`} color={Theme.grey_C}>
                      {String(productPayment).replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                      원
                    </Text>
                  </Wrapper>
                </Wrapper>

                {/* 처방가격 */}

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
                      {String(productPayment).replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                      원
                    </Text>
                  </Wrapper>

                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 20px`}>
                    <Text color={Theme.black_C} fontSize={`16px`}>
                      회원할인적용
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      -
                      {String(discount).replace(
                        /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                        ","
                      )}
                      원
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
                      {price && price.viewDeliveryPrice}
                    </Text>
                  </Wrapper>
                </Wrapper>
                <Wrapper al={`flex-end`}>
                  <Text fontSize={`18px`} fontWeight={`700`}>
                    {String(
                      productPayment - discount + (price && price.deliveryPrice)
                    ).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    <SpanText fontWeight={`500`}>원</SpanText>
                  </Text>
                </Wrapper>
              </Wrapper>

              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`25px 20px`}
                margin={`0 0 40px`}
              >
                <Wrapper dr={`row`} ju={`space-between`}>
                  <Text fontSize={`22px`}>결제수단</Text>
                  {/* {payOpenToggle ? (
                    <UpOutlined
                      onClick={() => setPayOpenToggle((prev) => !prev)}
                      style={{ fontSize: `16px` }}
                    />
                  ) : (
                    <DownOutlined
                      onClick={() => setPayOpenToggle((prev) => !prev)}
                      style={{ fontSize: `16px` }}
                    />
                  )} */}
                </Wrapper>
                {/* {payOpenToggle && ( */}
                <Wrapper margin={`20px 0 0 0`}>
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 5px`}>
                    <PayBtn
                      isActive={paymentType === "card"}
                      onClick={() => paymentSelectHadnler("card")}
                    >
                      <Text fontSize={`16px`}>신용카드</Text>
                    </PayBtn>
                    <PayBtn
                      isActive={paymentType === "trans"}
                      onClick={() => paymentSelectHadnler("trans")}
                    >
                      <Text fontSize={`16px`}>계좌 간편 결제</Text>
                    </PayBtn>
                  </Wrapper>
                  <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 30px`}>
                    <PayBtn
                      isActive={paymentType === "phone"}
                      onClick={() => paymentSelectHadnler("phone")}
                    >
                      <Text fontSize={`16px`}>휴대폰 결제</Text>
                    </PayBtn>
                    <PayBtn
                      isActive={paymentType === "nobank"}
                      onClick={() => paymentSelectHadnler("nobank")}
                    >
                      <Text fontSize={`16px`}>무통장입금</Text>
                    </PayBtn>
                  </Wrapper>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    <CommonCheckBox
                      checked={isAgree1}
                      onClick={() => setIsAgree1((prev) => !prev)}
                      style={{ margin: `0 5px 0 0` }}
                    />
                    <Text
                      fontSize={`16px`}
                      color={Theme.black_C}
                      cursor={`pointer`}
                      onClick={() => setIsAgree1((prev) => !prev)}
                    >
                      선택한 결제 수단을 다음에도 선택
                    </Text>
                  </Wrapper>
                </Wrapper>
                {/* )} */}
              </Wrapper>

              <Wrapper dr={`row`} ju={`flex-start`} al={`flex-start`}>
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                  <CommonCheckBox
                    checked={isAgree2}
                    onClick={() => setIsAgree2((prev) => !prev)}
                  />
                  <Text
                    cursor={`pointer`}
                    onClick={() => setIsAgree2((prev) => !prev)}
                    margin={`0 0 0 16px`}
                    fontSize={`20px`}
                  >
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

              <Wrapper
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
                margin={`40px 0 0`}
              >
                <Wrapper dr={`row`} ju={`flex-start`} margin={`0 0 20px`}>
                  <Text
                    cursor={`pointer`}
                    onClick={() => setIsAgree2((prev) => !prev)}
                    margin={`0 0 0 30px`}
                    fontSize={`20px`}
                  >
                    환불 안내
                  </Text>
                </Wrapper>
                <Wrapper al={`flex-start`} padding={`0 0 0 32px`}>
                  <Text fontSize={`16px`} margin={`0 0 13px`}>
                    휴대폰 결제의 경우 당월은 결제 취소만 가능합니다.
                  </Text>
                  <Text fontSize={`16px`} margin={`0 0 13px`}>
                    익월 이후 환불요청은 구매자 명의로 된 계좌로만 환불이
                    가능합니다.
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
                  {String(
                    productPayment - discount + (price && price.deliveryPrice)
                  ).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                  원 결제하기
                </Text>
              </CommonButton>
            </Wrapper>

            {/* BOUHGT MODAL */}
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
                  주문할 상품을 결제하시겠습니까?
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
                    onClick={boughtProductHandler}
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
      type: PP_GET_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Index;
