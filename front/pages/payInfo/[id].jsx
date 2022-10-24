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
    if (router.query.type === "payment") {
      dispatch({
        type: PAYMENT_DETAIL_REQUEST,
        data: {
          paymentId: router.query.id,
        },
      });
    } else if (router.query.type === "ppr") {
      dispatch({
        type: PPR_DETAIL_REQUEST,
        data: {
          pprId: router.query.id,
        },
      });
    }
  }, [router.query]);

  useEffect(() => {
    if (router.query) {
      if (router.query.type === "payment") {
        // 약속처방
        if (paymentDetail) {
          let total = 0;
          for (let i = 0; i < paymentDetail.PaymentRequest.length; i++) {
            total += paymentDetail.PaymentRequest[i].payment;
          }

          setProductPayment(total);
        }
      } else {
        // 탕전처방
        if (pprDetail) {
          setProductPayment(pprDetail.totalPrice);
        }
      }
    }
  }, [paymentDetail, pprDetail, router.query]);

  // 약속처방 결제

  useEffect(() => {
    if (st_paymentIsPaymentDone) {
      message.success("주문되었습니다.");
      return router.push("/");
    }
  }, [st_paymentIsPaymentDone]);

  useEffect(() => {
    if (st_paymentIsPaymentError) {
      return message.error(st_paymentIsPaymentError);
    }
  }, [st_paymentIsPaymentError]);

  // 탕전처방 결제

  useEffect(() => {
    if (st_pprIsPayMentDone) {
      message.success("주문되었습니다.");
      return router.push("/");
    }
  }, [st_pprIsPayMentDone]);

  useEffect(() => {
    if (st_pprIsPayMentError) {
      return message.error(st_pprIsPayMentError);
    }
  }, [st_pprIsPayMentError]);

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
        if (router.query.type === "payment") {
          if (paymentDetail) {
            if (paymentType === "nobank") {
              dispatch({
                type: PAYMENT_ISPAYMENT_REQUEST,
                data: {
                  paymentId: router.query.id,
                  isCard: "0",
                  totalPrice:
                    productPayment - discount + (price && price.deliveryPrice),
                  payInfo: paymentType,
                  userPayinfo: isAgree1 ? paymentType : null,
                  name: paymentDetail.productName,
                },
              });
            } else {
              IMP.request_pay(
                {
                  pg: paymentType === "phone" ? "danal" : "danal_tpay",
                  pay_method: paymentType,
                  merchant_uid: orderPK,
                  name: paymentDetail.productName,
                  amount:
                    productPayment - discount + (price && price.deliveryPrice),
                  // amount: 150,
                  buyer_name: me.username,
                  buyer_tel: me.mobile.replace(
                    /^(\d{2,3})(\d{3,4})(\d{4})$/,
                    `$1-$2-$3`
                  ),
                  buyer_email: me.email,
                  buyer_addr: paymentDetail.receiveAddress,
                  buyer_postcode: paymentDetail.receiveAddress.substring(
                    paymentDetail.receiveAddress.length - 6,
                    paymentDetail.receiveAddress.length - 1
                  ),
                },
                async (rsp) => {
                  if (rsp.success) {
                    dispatch({
                      type: PAYMENT_ISPAYMENT_REQUEST,
                      data: {
                        paymentId: router.query.id,
                        isCard: "0",
                        totalPrice:
                          productPayment -
                          discount +
                          (price && price.deliveryPrice),
                        payInfo: paymentType,
                        userPayinfo: isAgree1 ? paymentType : null,
                        name: paymentDetail.productName,
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
        } else {
          if (pprDetail) {
            if (paymentType === "nobank") {
              dispatch({
                type: PPR_ISPAYMENT_REQUEST,
                data: {
                  pprId: router.query.id,
                  isCard: "0",
                  totalPrice:
                    productPayment - discount + (price && price.deliveryPrice),
                  payInfo: paymentType,
                  userPayinfo: isAgree1 ? paymentType : null,
                },
              });
            } else {
              IMP.request_pay(
                {
                  pg: paymentType === "phone" ? "danal" : "danal_tpay",
                  pay_method: paymentType,
                  merchant_uid: orderPK,
                  name: `${pprDetail.materialDatum[0].name}${
                    pprDetail.materialDatum.length > 1
                      ? `외 ${pprDetail.materialDatum.length}개`
                      : ""
                  }`,
                  amount:
                    productPayment - discount + (price && price.deliveryPrice),
                  // amount: 150,
                  buyer_name: me.username,
                  buyer_tel: me.mobile.replace(
                    /^(\d{2,3})(\d{3,4})(\d{4})$/,
                    `$1-$2-$3`
                  ),
                  buyer_email: me.email,
                  buyer_addr: pprDetail.receiveAddress,
                  buyer_postcode: pprDetail.receiveAddress.substring(
                    pprDetail.receiveAddress.length - 6,
                    pprDetail.receiveAddress.length - 1
                  ),
                },
                async (rsp) => {
                  if (rsp.success) {
                    dispatch({
                      type: PPR_ISPAYMENT_REQUEST,
                      data: {
                        pprId: router.query.id,
                        isCard: "0",
                        totalPrice:
                          productPayment -
                          discount +
                          (price && price.deliveryPrice),
                        payInfo: paymentType,
                        userPayinfo: isAgree1 ? paymentType : null,
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
    }
  }, [
    isAgree2,
    productPayment,
    discount,
    router.query,
    paymentType,
    me,
    pprDetail,
    isAgree1,
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
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.receiveUser
                      : pprDetail && pprDetail.receiveUser}
                  </Text>
                  <Text
                    fontSize={`16px`}
                    color={Theme.grey_C}
                    margin={`0 0 12px`}
                  >
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.receiveMobile
                      : pprDetail && pprDetail.receiveMobile}
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.receiveAddress
                      : pprDetail && pprDetail.receiveAddress}
                  </Text>
                  <Text fontSize={`16px`} color={Theme.grey_C}>
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.receiveDetailAddress
                      : pprDetail && pprDetail.receiveDetailAddress}
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
                    {router.query && router.query.type === "payment"
                      ? paymentDetail && paymentDetail.deliveryMessage
                        ? paymentDetail.deliveryMessage
                        : "요청사항이 없습니다."
                      : pprDetail && pprDetail.deliveryMessage
                      ? pprDetail.deliveryMessage
                      : "요청사항이 없습니다."}
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
                  {router.query &&
                    (router.query.type === "payment"
                      ? paymentDetail && (
                          // 약속처방
                          <>
                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              margin={`0 0 20px`}
                            >
                              <Text color={Theme.gray_C} fontSize={`16px`}>
                                가격
                              </Text>
                              <Text fontSize={`18px`} color={Theme.grey_C}>
                                {String(productPayment).replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ","
                                )}
                              </Text>
                            </Wrapper>
                          </>
                        )
                      : pprDetail && (
                          // 탕전처방
                          <>
                            {pprDetail.materialDatum.map((data) => (
                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                margin={`0 0 20px`}
                              >
                                <Text color={Theme.gray_C} fontSize={`16px`}>
                                  {data.name}
                                </Text>
                                <Text fontSize={`18px`} color={Theme.grey_C}>
                                  {data.qnt}
                                  {data.unit}
                                </Text>
                                <Text fontSize={`18px`} color={Theme.grey_C}>
                                  {numberWithCommas(data.buyPrice * data.qnt)}원
                                </Text>
                              </Wrapper>
                            ))}

                            <Wrapper
                              dr={`row`}
                              ju={`space-between`}
                              margin={`0 0 20px`}
                            >
                              <Text color={Theme.gray_C} fontSize={`16px`}>
                                탕전
                              </Text>
                              <Text fontSize={`18px`} color={Theme.grey_C}>
                                {numberWithCommas(
                                  pprDetail.totalPrice -
                                    pprDetail.materialDatum
                                      .map((data) => data.buyPrice * data.qnt)
                                      .reduce((a, b) => a + b)
                                )}
                                원
                              </Text>
                            </Wrapper>
                          </>
                        ))}

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
