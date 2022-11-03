import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import useInput from "../../../hooks/useInput";
import ClientLayout from "../../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  TextInput,
  CommonButton,
  Image,
  GuideLi,
} from "../../../components/commonComponents";
import useWidth from "../../../hooks/useWidth";
import Theme from "../../../components/Theme";
import styled from "styled-components";
import ProductSlider from "../../../components/slide/ProductSlider";
import {
  PRODUCT_PACK_LIST_REQUEST,
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_UNIT_LIST_REQUEST,
  PRODUCT_DETAIL_REQUEST,
} from "../../../reducers/prescription";
import {
  PAYMENTREQUEST_CREATE_REQUEST,
  PAYMENT_DETAIL_REQUEST,
} from "../../../reducers/paymentRequest";
import { useRouter } from "next/router";
import { Form, message, Modal, Select } from "antd";
import { REQUEST_ALL_LIST_REQUEST } from "../../../reducers/userRequest";
import {
  WISH_PAYMENT_CREATE_REQUEST,
  WISH_PAYMENT_DETAIL_REQUEST,
  WISH_PAYMENT_ITEM_CREATE_REQUEST,
  WISH_PAYMENT_ITEM_DELETE_REQUEST,
  WISH_PAYMENT_ITEM_QNT_REQUEST,
  WISH_PAYMENT_UPDATE_REQUEST,
} from "../../../reducers/wish";

const CheckdButton = styled.button`
  padding: 5px 10px;

  outline: none;
  background-color: ${Theme.white_C};
  color: ${Theme.basicTheme_C};
  border: 1px solid ${Theme.basicTheme_C};
  width: ${(props) => props.width};
  height: 45px;
  border-radius: 15px;
  margin: 2px;
  transition: 0.3s;

  cursor: pointer;

  ${(props) =>
    props.kindOf &&
    `background-color: ${Theme.basicTheme_C}; color: ${Theme.white_C};`}

  &:hover {
    background-color: ${Theme.basicTheme_C};
    color: ${Theme.white_C};
  }
`;

const CustomCommonButton = styled(CommonButton)`
  border: 0px;
`;

const CustomModal = styled(Modal)`
  & .ant-modal-close-x {
    display: none;
  }

  & .ant-modal-content {
    border-radius: 20px;
  }
`;

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
  }
`;

const ComboBox = styled(Select)`
  width: 100%;
  border: 0px;

  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 0px;
    border-bottom: 1px solid ${Theme.grey2_C};
    padding: 0px;
  }

  &.ant-select-selector {
    padding: 0;
  }
`;

const PromiseDetail = () => {
  ////// GLOBAL STATE //////
  const { me } = useSelector((state) => state.user);

  const { typeList, packList, unitList, product } = useSelector(
    (state) => state.prescription
  );

  const { paymentDetail } = useSelector((state) => state.paymentRequest);

  const {
    wishPaymentDetail,
    //
    st_wishPaymentCreateLoading,
    st_wishPaymentCreateDone,
    st_wishPaymentCreateError,
    //
    st_wishPaymentUpdateDone,
    st_wishPaymentUpdateError,
    //
    st_wishPaymentItemCreateDone,
    st_wishPaymentItemCreateError,
    //
    st_wishPaymentItemDeleteDone,
    st_wishPaymentItemDeleteError,
    //
    st_wishPaymentItemQntDone,
    st_wishPaymentItemQntError,
  } = useSelector((state) => state.wish);

  const { requestAllList } = useSelector((state) => state.userRequest);

  ////// HOOKS //////
  const width = useWidth();

  const { Option } = Select;

  const type = useInput("");
  const pack = useInput("");
  const unit = useInput("");
  const qntInput = useInput(0);

  const [rForm] = Form.useForm();

  const [totalPayment, setTotalPayment] = useState(null);
  const [topSlider, setTopSlider] = useState(null);
  const [temporaryDatum, setTemporaryDatum] = useState([]);
  const [temporaryId, setTemporaryId] = useState(1);
  const [qntSelect, setQntSelect] = useState(null);

  const [rData, setRData] = useState(null);
  const [rModal, setRModal] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (temporaryDatum) {
      let total = 0;
      for (let i = 0; i < temporaryDatum.length; i++) {
        total += temporaryDatum[i].price * temporaryDatum[i].qnt;
      }

      setTotalPayment(total);
    }
  }, [temporaryDatum]);

  useEffect(() => {
    if (router.query) {
      if (router.query.type === "update") {
        // 수정하기
        const updateData = sessionStorage.getItem("paymentUpdate")
          ? JSON.parse(sessionStorage.getItem("paymentUpdate"))
          : null;

        if (updateData) {
          dispatch({
            type: WISH_PAYMENT_DETAIL_REQUEST,
            data: {
              containerId: updateData.id,
            },
          });
        }
      } else {
        // 재 주문
        const rePaymentData = sessionStorage.getItem("rePaymentData")
          ? JSON.parse(sessionStorage.getItem("rePaymentData"))
          : null;

        if (rePaymentData) {
          dispatch({
            type: PAYMENT_DETAIL_REQUEST,
            data: {
              paymentId: rePaymentData.id,
            },
          });
        }
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: {
          id: router.query.id,
        },
      });
      dispatch({
        type: PRODUCT_TYPE_LIST_REQUEST,
        data: {
          id: router.query.id,
        },
      });

      dispatch({
        type: PRODUCT_DETAIL_REQUEST,
        data: {
          id: router.query.id,
        },
      });
    }
  }, [router.query]);

  // 수정하기
  useEffect(() => {
    if (wishPaymentDetail) {
      const paymentArr = [];

      for (let i = 0; i < wishPaymentDetail.items.length; i++) {
        paymentArr.push({
          id: wishPaymentDetail.items[i].id,
          paymentId: router.query && router.query.id,
          price: wishPaymentDetail.items[i].price,
          pack: wishPaymentDetail.items[i].pack,
          type: wishPaymentDetail.items[i].type,
          unit: wishPaymentDetail.items[i].unit,
          qnt: wishPaymentDetail.items[i].qnt,
        });
      }

      setRData({
        receiverName: wishPaymentDetail.receiverName,
        medication: wishPaymentDetail.medication,
        content: wishPaymentDetail.content,
      });

      rForm.setFieldsValue({
        receiverName: wishPaymentDetail.receiverName,
        medication: wishPaymentDetail.medication,
        content: wishPaymentDetail.content,
      });

      setTemporaryDatum(paymentArr);

      sessionStorage.removeItem("paymentUpdate");
    }
  }, [wishPaymentDetail]);

  // 재 주문
  useEffect(() => {
    if (paymentDetail) {
      const paymentArr = [];

      for (let i = 0; i < paymentDetail.PaymentRequest.length; i++) {
        paymentArr.push({
          id: paymentDetail.PaymentRequest[i].id,
          paymentId: router.query && router.query.id,
          price: paymentDetail.PaymentRequest[i].payment,
          pack: paymentDetail.PaymentRequest[i].packVolumn,
          type: paymentDetail.PaymentRequest[i].typeVolumn,
          unit: paymentDetail.PaymentRequest[i].unitVolumn,
          qnt: 1,
        });
      }

      setTemporaryDatum(paymentArr);

      sessionStorage.removeItem("rePaymentData");
    }
  }, [paymentDetail]);

  useEffect(() => {
    if (typeList) {
      if (typeList.length > 0) {
        type.setValue(typeList[0]);
      }
    }

    if (product) {
      setTopSlider([
        product.imageURL1,
        product.imageURL2,
        product.imageURL3,
        product.imageURL4,
      ]);
    }
  }, [typeList, packList, unitList, product]);

  // 장바구니 담기
  useEffect(() => {
    if (st_wishPaymentCreateDone) {
      router.push("/cart");
      return message.success("장바구니에 담겼습니다.");
    }
  }, [st_wishPaymentCreateDone]);

  useEffect(() => {
    if (st_wishPaymentCreateError) {
      return message.error(st_wishPaymentCreateError);
    }
  }, [st_wishPaymentCreateError]);

  // 장바구니 수정
  useEffect(() => {
    if (st_wishPaymentUpdateDone) {
      dispatch({
        type: WISH_PAYMENT_DETAIL_REQUEST,
        data: {
          containerId: wishPaymentDetail.id,
        },
      });

      return message.success("요청사항을 수정했습니다");
    }
  }, [st_wishPaymentUpdateDone]);

  useEffect(() => {
    if (st_wishPaymentUpdateError) {
      return message.error(st_wishPaymentUpdateError);
    }
  }, [st_wishPaymentUpdateError]);

  // 장바구니 안의 상품 생성하기
  useEffect(() => {
    if (st_wishPaymentItemCreateDone) {
      dispatch({
        type: WISH_PAYMENT_DETAIL_REQUEST,
        data: {
          containerId: wishPaymentDetail.id,
        },
      });

      return message.success("장바구니에 추가되었습니다.");
    }
  }, [st_wishPaymentItemCreateDone]);

  useEffect(() => {
    if (st_wishPaymentItemCreateError) {
      return message.error(st_wishPaymentItemCreateError);
    }
  }, [st_wishPaymentItemCreateError]);

  // 장바구니 안의 상품 삭제하기
  useEffect(() => {
    if (st_wishPaymentItemDeleteDone) {
      dispatch({
        type: WISH_PAYMENT_DETAIL_REQUEST,
        data: {
          containerId: wishPaymentDetail.id,
        },
      });

      return message.success("장바구니에서 삭제되었습니다.");
    }
  }, [st_wishPaymentItemDeleteDone]);

  useEffect(() => {
    if (st_wishPaymentItemDeleteError) {
      return message.error(st_wishPaymentItemDeleteError);
    }
  }, [st_wishPaymentItemDeleteError]);

  // 장바구니 안의 상품 수량 수정
  useEffect(() => {
    if (st_wishPaymentItemQntDone) {
      dispatch({
        type: WISH_PAYMENT_DETAIL_REQUEST,
        data: {
          containerId: wishPaymentDetail.id,
        },
      });

      return message.success("수량이 수정되었습니다.");
    }
  }, [st_wishPaymentItemQntDone]);

  useEffect(() => {
    if (st_wishPaymentItemQntError) {
      return message.error(st_wishPaymentItemQntError);
    }
  }, [st_wishPaymentItemQntError]);

  ////// TOGGLE //////

  const rModalToggle = useCallback(() => {
    setRModal((prev) => !prev);
  }, [rModal]);

  ////// HANDLER //////

  const typeChangeHandler = useCallback(
    (value) => {
      type.setValue(value);
    },
    [type.value]
  );

  const packChangeHandler = useCallback(
    (value) => {
      dispatch({
        type: PRODUCT_UNIT_LIST_REQUEST,
        data: {
          id: value.id,
        },
      });

      pack.setValue(value);
      unit.setValue("");
    },
    [pack.value]
  );

  const unitChangeHandler = useCallback(
    (value) => {
      unit.setValue(value);
    },
    [unit.value]
  );

  const createPaymentArrHandler = useCallback(async () => {
    if (!type.value) {
      return message.error("종류을 선택해주세요.");
    }
    if (!pack.value) {
      return message.error("포장을 선택해주세요.");
    }

    if (unitList && unitList.length > 0 && !unit.value) {
      return message.error("단위을 선택해주세요.");
    }

    if (router.query) {
      if (router.query.type === "update") {
        dispatch({
          type: WISH_PAYMENT_ITEM_CREATE_REQUEST,
          data: {
            containerId: wishPaymentDetail && wishPaymentDetail.id,
            price:
              product &&
              product.price +
                (type.value.originAddPrice ? type.value.originAddPrice : 0) +
                (pack.value.originAddPrice ? pack.value.originAddPrice : 0) +
                (unit.value.originAddPrice ? unit.value.originAddPrice : 0),
            pack: type.value.name ? type.value.name : type.value,
            type: pack.value.name ? pack.value.name : pack.value,
            unit: unit.value.name ? unit.value.name : unit.value,
            qnt: 1,
          },
        });
      } else {
        let temporayArr = temporaryDatum.map((data) => data);

        setTemporaryId(temporaryId + 1);

        temporayArr.push({
          id: temporaryId,
          price:
            product &&
            product.price +
              (type.value.originAddPrice ? type.value.originAddPrice : 0) +
              (pack.value.originAddPrice ? pack.value.originAddPrice : 0) +
              (unit.value.originAddPrice ? unit.value.originAddPrice : 0),
          pack: type.value.name ? type.value.name : type.value,
          type: pack.value.name ? pack.value.name : pack.value,
          unit: unit.value.name ? unit.value.name : unit.value,
          qnt: 1,
          // otherRequest: otherInput.value,
        });

        await setTemporaryDatum(temporayArr);
      }
    }
  }, [
    type.value,
    pack.value,
    unit.value,
    router.query,
    unitList,
    temporaryDatum,
    paymentDetail,
    wishPaymentDetail,
    temporaryId,
  ]);

  const deletePaymentArrHadnler = useCallback(
    async (id) => {
      if (router.query) {
        if (router.query.type === "update") {
          dispatch({
            type: WISH_PAYMENT_ITEM_DELETE_REQUEST,
            data: {
              wishPaymentItemId: id,
            },
          });
        } else {
          let temporayArr = temporaryDatum.map((data) => data);

          await setTemporaryDatum(temporayArr.filter((data) => data.id !== id));
        }
      }
    },
    [temporaryDatum, router.query]
  );

  const createPaymentRequestHandler = useCallback(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }

    if (!temporaryDatum) {
      return message.error("주문을 추가해주세요.");
    }

    if (!rData) {
      return message.error("요청사항을 설정해주세요.");
    }

    dispatch({
      type: WISH_PAYMENT_CREATE_REQUEST,
      data: {
        paymentId: router.query && router.query.id,
        productname: product && product.title,
        totalPrice: totalPayment,
        totalQun:
          temporaryDatum &&
          temporaryDatum.map((data) => data.qnt).reduce((a, b) => a + b),
        medication: rData.medication,
        receiverName: rData.receiverName,
        content: rData.content,
        items: temporaryDatum,
      },
    });
  }, [router.query, temporaryDatum, me, product, totalPayment, rData]);

  // 수량 선택
  const qntSelectHandler = useCallback(
    (data) => {
      if (qntSelect === data.id) {
        setQntSelect(null);
        qntInput.setValue(0);
        return;
      }

      qntInput.setValue(data.qnt);
      setQntSelect(data.id);
    },
    [qntSelect, qntInput.value]
  );

  // 약제 용량 수정
  const qntSaveHandler = useCallback(() => {
    if (
      !qntSelect ||
      temporaryDatum.find((item) => item.id === qntSelect).qnt ===
        parseInt(qntInput.value) ||
      !qntInput.value ||
      parseInt(qntInput.value) === 0
    ) {
      return;
    }

    if (router.query) {
      if (router.query.type === "update") {
        dispatch({
          type: WISH_PAYMENT_ITEM_QNT_REQUEST,
          data: {
            wishPaymentItemId: qntSelect,
            qnt: parseInt(qntInput.value),
          },
        });

        setQntSelect(null);
      } else {
        let temporaryArr = temporaryDatum.map((data) => data);

        const datumFindIndex = temporaryArr.findIndex(
          (data) => data.id === qntSelect
        );

        temporaryArr[datumFindIndex].qnt = parseInt(qntInput.value);

        setTemporaryDatum(temporaryArr);

        setQntSelect(null);
      }
    }
  }, [
    router.query,
    wishPaymentDetail,
    temporaryDatum,
    qntSelect,
    qntInput.value,
  ]);

  // 요청사항 선택
  const requestChangeHandler = useCallback((data) => {
    const jsonData = data ? JSON.parse(data) : null;

    if (jsonData) {
      rForm.setFieldsValue(jsonData);
    }
  }, []);

  // 요청사항 설정
  const requestSetHandler = useCallback(
    (data) => {
      if (router.query) {
        if (router.query.type === "update") {
          dispatch({
            type: WISH_PAYMENT_UPDATE_REQUEST,
            data: {
              containerId: wishPaymentDetail && wishPaymentDetail.id,
              ...data,
            },
          });
        } else {
          setRData(data);
        }
      }

      setRModal(false);
    },
    [rData, rModal]
  );

  ////// DATAVIEW //////

  return (
    <>
      <ClientLayout>
        <WholeWrapper onClick={qntSaveHandler}>
          <RsWrapper
            minHeight={`calc(100vh - 64px)`}
            ju={`flex-start`}
            position={`relative`}
            padding={`0`}
          >
            <Wrapper
              ju={`flex-start`}
              al={`flex-start`}
              padding={width < 800 ? `30px 10px` : `30px 38px`}
              minHeight={`calc(100vh - 164px)`}
            >
              <Text color={Theme.grey_C} fontWeight={`bold`}>
                {product && product.title}
              </Text>
              {topSlider && (
                <ProductSlider topSlider={topSlider.filter((data) => data)} />
              )}

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                종류
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                {typeList &&
                  (typeList.length === 0 ? (
                    <TextInput
                      placeholder="직접입력"
                      type={`text`}
                      width={`100%`}
                      {...type}
                    />
                  ) : (
                    typeList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            // width < 700
                            //   ?
                            typeList.length === 1
                              ? `calc(100% - 4px)`
                              : // : `calc(100% / 2 - 4px)`
                              typeList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : typeList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : typeList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : typeList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={type.value && type.value.id === data.id}
                          onClick={() => typeChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })
                  ))}
              </Wrapper>

              <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                포장
              </Text>
              <Wrapper dr={`row`} ju={`flex-start`}>
                {packList &&
                  (packList.length === 0 ? (
                    <TextInput
                      placeholder="직접입력"
                      type={`text`}
                      width={`100%`}
                      {...pack}
                    />
                  ) : (
                    packList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            // width < 700
                            //   ?
                            packList.length === 1
                              ? `calc(100% - 4px)`
                              : // : `calc(100% / 2 - 4px)`
                              packList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : packList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : packList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : packList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={pack.value && pack.value.id === data.id}
                          onClick={() => packChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })
                  ))}
              </Wrapper>
              {unitList && unitList.length > 0 && (
                <>
                  <Text
                    color={Theme.grey_C}
                    fontWeight={`bold`}
                    margin={`20px 0 10px`}
                  >
                    단위
                  </Text>
                  <Wrapper dr={`row`} ju={`flex-start`}>
                    {unitList.map((data) => {
                      return (
                        <CheckdButton
                          key={data.id}
                          shadow={`0`}
                          width={
                            // width < 700
                            //   ?
                            unitList.length === 1
                              ? `calc(100% - 4px)`
                              : // : `calc(100% / 2 - 4px)`
                              unitList.length >= 4
                              ? `calc(100% / 4 - 4px)`
                              : unitList.length === 3
                              ? `calc(100% / 3 - 4px)`
                              : unitList.length === 2
                              ? `calc(100% / 2 - 4px)`
                              : unitList.length === 1 && `calc(100% - 4px)`
                          }
                          height={`45px`}
                          radius={`15px`}
                          margin={`2px`}
                          kindOf={unit.value && unit.value.id === data.id}
                          onClick={() => unitChangeHandler(data)}
                        >
                          {data.name}
                        </CheckdButton>
                      );
                    })}
                  </Wrapper>
                </>
              )}

              {/* <Text
                color={Theme.grey_C}
                fontWeight={`bold`}
                margin={`20px 0 10px`}
              >
                추가요청사항
              </Text>
              <TextInput type={`text`} width={`100%`} {...otherInput} /> */}
            </Wrapper>
            <Wrapper
              al={`flex-end`}
              margin={`0 0 20px`}
              padding={width < 800 ? `0 10px` : `0 35px`}
            >
              <CommonButton onClick={createPaymentArrHandler}>
                주문추가하기
              </CommonButton>
            </Wrapper>

            <Wrapper
              border={rData && `2px solid ${Theme.basicTheme_C}`}
              bgColor={rData && Theme.subTheme4_C}
              padding={`10px`}
              al={`flex-end`}
              margin={`0 0 20px`}
            >
              <Wrapper dr={`row`} ju={`space-between`}>
                <Text fontWeight={`600`}>{rData && rData.receiverName}</Text>
                <CommonButton
                  margin={
                    width < 800
                      ? rData
                        ? `0 -2px 0 0`
                        : `0`
                      : rData
                      ? `0 23px`
                      : `0 25px`
                  }
                  onClick={rModalToggle}
                >
                  요청사항설정
                </CommonButton>
              </Wrapper>

              {rData && (
                <Wrapper al={`flex-start`} margin={`5px 0 0`}>
                  <Text margin={`10px 0 0`}>{rData.medication}</Text>
                  <Text margin={`10px 0 0`}>{rData.content}</Text>
                </Wrapper>
              )}
            </Wrapper>

            <Wrapper
              dr={`row`}
              ju={`flex-start`}
              al={`flex-start`}
              bgColor={Theme.lightGrey2_C}
              padding={width < 800 ? `15px 10px` : `15px 38px`}
            >
              {temporaryDatum &&
                temporaryDatum.map((data, idx) => {
                  return (
                    <Wrapper
                      width={
                        width < 1100
                          ? width < 700
                            ? `100%`
                            : `calc(100% / 2 - 16px)`
                          : `calc(100% / 3 - 16px)`
                      }
                      key={idx}
                      shadow={Theme.shadow_C}
                      padding={`25px`}
                      bgColor={Theme.white_C}
                      margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
                      radius={`20px`}
                    >
                      <Wrapper dr={`row`} ju={`space-between`}>
                        <Text color={Theme.grey2_C}>
                          {data.type}&nbsp;|&nbsp;{data.pack}
                          {data.unit && ` | ${data.unit}`}
                        </Text>
                        <Image
                          cursor={`pointer`}
                          onClick={() => deletePaymentArrHadnler(data.id)}
                          alt="close"
                          src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/header_icon/close-grey.png`}
                          width={`16px`}
                        />
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`10px 0 0`}
                      >
                        <Wrapper
                          width={`auto`}
                          dr={`row`}
                          cursor={`pointer`}
                          onClick={() => !qntSelect && qntSelectHandler(data)}
                        >
                          <Text>수량</Text>

                          {qntSelect && qntSelect === data.id ? (
                            <TextInput
                              width={`100px`}
                              placeholder={`수량`}
                              type={`number`}
                              {...qntInput}
                              onKeyPress={(e) =>
                                e.key === "Enter" && qntSaveHandler()
                              }
                            />
                          ) : (
                            <Text width={`100px`} textAlign={`center`}>
                              {data.qnt}
                            </Text>
                          )}
                        </Wrapper>
                        <Wrapper width={`auto`} dr={`row`}>
                          <Text fontSize={`12px`}>총 {data.qnt}개</Text>
                          <Text
                            fontSize={`20px`}
                            fontWeight={`bold`}
                            margin={`0 0 0 15px`}
                            color={Theme.basicTheme_C}
                          >
                            {String(data.price * data.qnt).replace(
                              /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                              ","
                            )}
                          </Text>
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>
                  );
                })}
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
                <Text fontWeight={`bold`}>총 주문금액&nbsp;:&nbsp;</Text>
                <Text fontWeight={`bold`}>
                  {String(totalPayment).replace(
                    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                    ","
                  )}
                  &nbsp;원
                </Text>
              </Wrapper>
              <Wrapper width={width < 800 ? `130px` : `170px`}>
                {router.query && router.query.type !== "update" && (
                  <CommonButton
                    shadow={`0`}
                    width={`100%`}
                    height={`100%`}
                    radius={`0`}
                    cursor={`pointer`}
                    onClick={createPaymentRequestHandler}
                    loading={st_wishPaymentCreateLoading}
                  >
                    장바구니 담기
                  </CommonButton>
                )}
              </Wrapper>
            </Wrapper>
          </RsWrapper>
        </WholeWrapper>

        {/* REQUEST MODAL */}
        <CustomModal
          width={`450px`}
          visible={rModal}
          onCancel={rModalToggle}
          footer={null}
        >
          <Wrapper al={`flex-start`} margin={`0 0 30px`}>
            <Text fontSize={`20px`} fontWeight={`bold`}>
              요청사항 설정
            </Text>
          </Wrapper>

          <Wrapper margin={`0 0 30px`} al={`flex-start`}>
            <Text>요청사항</Text>
            <ComboBox
              placeholder={`요청사항을 선택해주세요.`}
              onChange={requestChangeHandler}
            >
              {requestAllList &&
                requestAllList.map((data) => {
                  return (
                    <Option key={data.id} value={JSON.stringify(data)}>
                      {data.title} - {data.receiverName}
                    </Option>
                  );
                })}
            </ComboBox>
            <GuideLi isImpo>
              요청사항을 선택시 정보들이 자동으로 들어갑니다.
            </GuideLi>
          </Wrapper>

          <Form form={rForm} onFinish={requestSetHandler}>
            <Text>환자이름</Text>
            <Form.Item
              name={`receiverName`}
              rules={[{ required: true, message: "환자이름을 입력해주세요." }]}
            >
              <TextInput
                width={`100%`}
                placeholder={`환자이름을 입력해주세요.`}
              />
            </Form.Item>

            <Text>복약지도</Text>
            <Form.Item
              name={`medication`}
              rules={[{ required: true, message: "복약지도를 입력해주세요." }]}
            >
              <TextInput
                width={`100%`}
                placeholder={`복약지도를 입력해주세요.`}
              />
            </Form.Item>

            <Text>추가요청사항</Text>
            <Form.Item
              name={`content`}
              rules={[
                { required: true, message: "추가요청사항을 입력해주세요." },
              ]}
            >
              <TextInput
                width={`100%`}
                placeholder={`추가요청사항을 입력해주세요.`}
              />
            </Form.Item>

            <Wrapper dr={`row`} ju={`flex-end`}>
              <CustomCommonButton
                kindOf={`white`}
                width={`90px`}
                height={`40px`}
                margin={`0 5px 0 0`}
                border={`1px solid ${Theme.white_C}`}
                shadow={`0px`}
                onClick={rModalToggle}
              >
                취소
              </CustomCommonButton>
              <CommonButton width={`90px`} height={`40px`} htmlType="submit">
                설정
              </CommonButton>
            </Wrapper>
          </Form>
        </CustomModal>
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
      type: REQUEST_ALL_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default PromiseDetail;
