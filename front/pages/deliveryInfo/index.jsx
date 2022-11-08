import React, { useEffect, useCallback, useState, useRef } from "react";
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
  TextInput,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RightOutlined, SearchOutlined } from "@ant-design/icons";
import { Modal, Select, Form, Empty, message, Input } from "antd";
import {
  DELIVERY_MODAL_TOGGLE,
  PAYMENT_DETAIL_REQUEST,
  SEND_DELIVERY_MODAL_TOGGLE,
  RECEIVE_DELIVERY_MODAL_TOGGLE,
  PAYMENT_DELIVERY_REQUEST,
} from "../../reducers/paymentRequest";
import DaumPostcode from "react-daum-postcode";
import {
  ADDRESS_LIST_REQUEST,
  ADDRESS_LIST_MODAL_TOGGLE,
  ADDRESS_CREATE_REQUEST,
} from "../../reducers/address";
import useInput from "../../hooks/useInput";
import { numberWithCommas } from "../../components/commonUtils";
import {
  PPR_ADDRESS_UPDATE_REQUEST,
  PPR_DETAIL_REQUEST,
} from "../../reducers/prescriptionPaymentRequest";
import { BOUGHT_DELIVERY_REQUEST } from "../../reducers/boughtHistory";
import { DELIVERY_REQUEST_ALL_LIST_REQUEST } from "../../reducers/userDeliveryRequest";

const CustomModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }
`;

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
    border: 1px solid ${Theme.black_C} !important;
    border-radius: 10px !important;
  }

  & .ant-select-selection-placeholder {
    font-size: 18px !important;
  }
`;

const style = {
  overflow: "hidden",
};

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    width: 100%;
    margin: 0;
  }
`;

const AddressInput = styled(TextInput)`
  &:read-only {
    background-color: ${Theme.white_C} !important;
  }
`;

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);
  const { addressList, addressDetail, addressListModal } = useSelector(
    (state) => state.address
  );

  const {
    boughtId,
    //
    st_boughtDeliveryLoading,
    st_boughtDeliveryDone,
    st_boughtDeliveryError,
  } = useSelector((state) => state.boughtHistory);

  const { deliveryRequestAllList } = useSelector(
    (state) => state.userDeliveryRequest
  );

  ////// HOOKS //////
  const router = useRouter();

  const formRef = useRef();

  const dispatch = useDispatch();

  const searchInput = useInput("");

  const [payment, setPayment] = useState(null);
  const [oModal, setOModal] = useState(false);

  const [isMeterialData, setIsMeterialData] = useState([]);
  const [isMeterialData2, setIsMeterialData2] = useState([]);

  const [dRequest, setDRequest] = useState(""); // 배송시 요청사항

  const [boughtData, setBoughtData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  const [sendDeliveryModal, setSendDeliveryModal] = useState(false);
  const [receiveDeliveryModal, setReceiveDeliveryModal] = useState(false);

  ////// REDUX //////
  ////// USEEFFECT //////
  useEffect(() => {
    const result = sessionStorage.getItem("METAERIAL")
      ? JSON.parse(sessionStorage.getItem("METAERIAL"))
      : [];
    const result2 = sessionStorage.getItem("METAERIAL2")
      ? JSON.parse(sessionStorage.getItem("METAERIAL2"))
      : [];

    setIsMeterialData(result);
    setIsMeterialData2(result2);
  }, []);

  useEffect(() => {
    if (!me) {
      router.push("/login");
      return message.error("로그인 후 이용해주세요.");
    }
  }, []);

  useEffect(async () => {
    if (router.query.type === "payment") {
      const paymentData = sessionStorage.getItem("paymentBought")
        ? JSON.parse(sessionStorage.getItem("paymentBought"))
        : null;

      if (!paymentData) {
        router.push("/cart");
        return message.error("잘못된 경로입니다.");
      }
      setBoughtData(paymentData);

      setTotalPrice(
        paymentData.map((data) => data.originTotalPrice).reduce((a, b) => a + b)
      );

      await sessionStorage.removeItem("paymentBought");
    } else {
      const preData = sessionStorage.getItem("preBought")
        ? JSON.parse(sessionStorage.getItem("preBought"))
        : null;

      if (!preData) {
        router.push("/cart");
        return message.error("잘못된 경로입니다.");
      }

      setBoughtData(preData);
      setTotalPrice(
        preData.map((data) => data.originTotalPrice).reduce((a, b) => a + b)
      );

      await sessionStorage.removeItem("preBought");
    }
  }, [router.query]);

  useEffect(() => {
    if (searchInput && me) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: searchInput.value,
        },
      });
    }
  }, [searchInput.value]);

  // 주문하기

  useEffect(() => {
    if (st_boughtDeliveryDone) {
      router.push(`/payInfo/${boughtId}`);

      return message.success("배송정보가 등록되었습니다.");
    }
  }, [st_boughtDeliveryDone]);

  useEffect(() => {
    if (st_boughtDeliveryError) {
      return message.error(st_boughtDeliveryError);
    }
  }, [st_boughtDeliveryError]);

  ////// TOGGLE //////

  const deliveryModalToggle = useCallback(
    (type) => {
      if (type === "receive") {
        setReceiveDeliveryModal((prev) => !prev);
      } else {
        setSendDeliveryModal((prev) => !prev);
      }
    },
    [receiveDeliveryModal, sendDeliveryModal]
  );

  const addressListModalToggle = useCallback((type) => {
    if (type) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });
    }

    if (type === 2) {
      dispatch({
        type: ADDRESS_LIST_MODAL_TOGGLE,
      });
    }
  }, []);
  ////// TOGGLE //////
  const oModalToggle = useCallback(() => {
    setOModal(!oModal);
  }, [oModal]);
  ////// HANDLER //////

  const deliveryUpdateHandler = useCallback(
    (data) => {
      if (!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(data.rmobile)) {
        return message.error("전화번호를 정확하게 입력해주세요.");
      }
      if (!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(data.smobile)) {
        return message.error("전화번호를 정확하게 입력해주세요.");
      }

      dispatch({
        type: BOUGHT_DELIVERY_REQUEST,
        data: {
          idItems: boughtData.map((data) => data.id),
          type: router.query.type === "payment" ? 1 : 2,
          receiveUser: data.ruser,
          receiveMobile: data.rmobile,
          receiveAddress: data.raddress,
          receiveDetailAddress: data.rdetailAddress,
          sendUser: data.suser,
          sendMobile: data.smobile,
          sendAddress: data.saddress,
          sendDetailAddress: data.sdetailAddress,
          deliveryMessage:
            data.deliveryMessage === "직접입력"
              ? data.deliveryRequest
              : data.deliveryMessage
              ? data.deliveryMessage
              : "-",
        },
      });

      if (data.raddress.split("(")[1]) {
        dispatch({
          type: ADDRESS_CREATE_REQUEST,
          data: {
            postCode: data.raddress.split("(")[1].substring(0, 5),
            address: data.raddress.split("(")[0],
            detailAddress: data.rdetailAddress,
            userId: me.id,
            username: data.ruser,
            userMobile: data.rmobile,
          },
        });
      }
    },
    [router.query, boughtData, me]
  );

  console.log(boughtData);

  const selectAddressHandler = useCallback((data) => {
    formRef.current.setFieldsValue({
      ruser: data.username,
      rmobile: data.userMobile,
      raddress: data.address,
      rdetailAddress: data.detailAddress,
    });
    dispatch({
      type: ADDRESS_LIST_MODAL_TOGGLE,
    });
  }, []);

  const receiveMeAddressHandler = useCallback(() => {
    formRef.current.setFieldsValue({
      ruser: addressDetail.username,
      rmobile: addressDetail.userMobile,
      raddress: addressDetail.address,
      rdetailAddress: addressDetail.detailAddress,
    });
  }, []);

  const normalAddressHandler = useCallback(() => {
    if (!addressDetail) {
      return message.error("기본주소가 없습니다. 기본주소를 추가해주세요.");
    }

    formRef.current.setFieldsValue({
      suser: addressDetail.username,
      smobile: addressDetail.userMobile,
      saddress: addressDetail.address,
      sdetailAddress: addressDetail.detailAddress,
    });
  }, [addressDetail]);

  const deliRequestHandler = useCallback(
    (e) => {
      setDRequest(e);
    },
    [dRequest]
  );

  ////// DATAVIEW //////

  const deliveryMessageArr = [
    "배송 전에 미리 연락주세요.",
    "부재시 경비실에 맡겨주세요.",
    "부재시 문앞에 놓아주세요.",
    "부재시 택배함에 넣어주세요.",
    "부재시 전화 주시거나 문자 남겨 주세요.",
    "파손의 위험이 있으니 주의해주세요.",
    "직접입력",
  ];

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
                  src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/process_icon/4.card_g.png`}
                  width={`22px`}
                />
                <Text fontSize={`12px`} margin={`5px 0 0`} color={Theme.grey_C}>
                  결제정보
                </Text>
              </Wrapper>
            </Wrapper>

            <CustomForm onFinish={deliveryUpdateHandler} ref={formRef}>
              <Wrapper
                minHeight={`calc(100vh - 120px)`}
                padding={width < 800 ? `30px 10px` : `30px 38px`}
                al={`flex-start`}
                ju={`flex-start`}
              >
                <Wrapper>
                  <Wrapper
                    dr={`row`}
                    ju={`space-between`}
                    padding={`0 0 15px`}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <Text
                      fontSize={`18px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      받는 사람
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.subTheme2_C}
                      cursor={`pointer`}
                      onClick={() => addressListModalToggle(2)}
                    >
                      주소록 불러오기
                    </Text>
                  </Wrapper>
                  <Wrapper padding={`20px 20px 0`}>
                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        받는사람
                      </Text>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "받는사람을 입력해주세요.",
                          },
                        ]}
                        name="ruser"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          placeholder={`받는 사람을 입력해주세요`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        연락처
                      </Text>
                      <Form.Item
                        rules={[
                          { required: true, message: "연락처를 입력해주세요." },
                        ]}
                        name="rmobile"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          type="tel"
                          placeholder={`(필수)연락처를 입력해주세요`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        주소
                      </Text>
                      <Wrapper
                        position={`relative`}
                        onClick={() => deliveryModalToggle("receive")}
                      >
                        <Form.Item
                          rules={[
                            { required: true, message: "주소를 입력해주세요." },
                          ]}
                          name="raddress"
                        >
                          <AddressInput
                            readOnly={true}
                            border={`none`}
                            borderBottom={`1px solid ${Theme.grey2_C}`}
                            radius={`0`}
                            shadow={`none`}
                            width={`100%`}
                            placeholder={`주소를 입력해주세요.`}
                            phFontSize={width < 450 ? `14px` : `16px`}
                            focusBorder={`none`}
                            focusBorderBottom={`1px solid ${Theme.black_C}`}
                          />
                        </Form.Item>
                        <Wrapper
                          position={`absolute`}
                          width={`auto`}
                          right={`0`}
                          top={`0`}
                          bottom={`0`}
                        >
                          <SearchOutlined style={{ fontSize: `16px` }} />
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        상세주소
                      </Text>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "상세주소를 입력해주세요.",
                          },
                        ]}
                        name="rdetailAddress"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          placeholder={`상세주소를 입력해주세요`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                {/* recive */}

                <Wrapper margin={`20px 0 0 0`}>
                  <Wrapper
                    dr={`row`}
                    ju={`space-between`}
                    padding={`0 0 15px`}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <Text
                      fontSize={`18px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      보내는 사람
                    </Text>
                    <Text
                      fontSize={`16px`}
                      color={Theme.subTheme2_C}
                      cursor={`pointer`}
                      onClick={normalAddressHandler}
                    >
                      기본주소 불러오기
                    </Text>
                  </Wrapper>

                  <Wrapper padding={`20px 20px 0`}>
                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        보내는 사람
                      </Text>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "보내는사람을 입력해주세요.",
                          },
                        ]}
                        name="suser"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          placeholder={`보내는 사람을 입력해주세요`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        연락처
                      </Text>
                      <Form.Item
                        rules={[
                          { required: true, message: "연락처를 입력해주세요." },
                        ]}
                        name="smobile"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          type="tel"
                          placeholder={`(필수)연락처를 입력해주세요`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        주소
                      </Text>
                      <Wrapper
                        position={`relative`}
                        onClick={() => deliveryModalToggle("send")}
                      >
                        <Form.Item
                          rules={[
                            { required: true, message: "주소를 입력해주세요." },
                          ]}
                          name="saddress"
                        >
                          <AddressInput
                            readOnly={true}
                            border={`none`}
                            borderBottom={`1px solid ${Theme.grey2_C}`}
                            radius={`0`}
                            shadow={`none`}
                            width={`100%`}
                            placeholder={`경기 수원시 팔달구 효원로 269(인계동 ,에스팝타워)`}
                            phFontSize={width < 450 ? `14px` : `16px`}
                            focusBorder={`none`}
                            focusBorderBottom={`1px solid ${Theme.black_C}`}
                          />
                        </Form.Item>
                        <Wrapper
                          position={`absolute`}
                          width={`auto`}
                          right={`0`}
                          top={`0`}
                          bottom={`0`}
                        >
                          <SearchOutlined style={{ fontSize: `16px` }} />
                        </Wrapper>
                      </Wrapper>
                    </Wrapper>

                    <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                      <Text
                        color={Theme.grey_C}
                        fontSize={`16px`}
                        fontWeight={`700`}
                        padding={`0 0 0 10px`}
                      >
                        상세주소
                      </Text>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: "상세주소를 입력해주세요.",
                          },
                        ]}
                        name="sdetailAddress"
                      >
                        <TextInput
                          border={`none`}
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          radius={`0`}
                          shadow={`none`}
                          width={`100%`}
                          placeholder={`214호`}
                          phFontSize={width < 450 ? `14px` : `16px`}
                          focusBorder={`none`}
                          focusBorderBottom={`1px solid ${Theme.black_C}`}
                        />
                      </Form.Item>
                    </Wrapper>
                  </Wrapper>
                </Wrapper>

                <Wrapper>
                  <Wrapper
                    al={`flex-start`}
                    padding={`0 0 15px`}
                    borderBottom={`1px solid ${Theme.grey_C}`}
                  >
                    <Text
                      fontSize={`18px`}
                      color={Theme.black_C}
                      fontWeight={`700`}
                    >
                      배송시 요청사항
                    </Text>
                  </Wrapper>

                  <Wrapper padding={`20px 20px 0`}>
                    <Form.Item name="deliveryMessage">
                      <CustomSelect
                        defaultValue={`default`}
                        onChange={deliRequestHandler}
                      >
                        <Select.Option value={`default`}>
                          배송 메세지를 선택해주세요.
                        </Select.Option>

                        {/* 기본 배송메세지 */}
                        {deliveryMessageArr &&
                          deliveryMessageArr.map((data) => {
                            return (
                              <Select.Option value={data}>{data}</Select.Option>
                            );
                          })}

                        {/* 회원이 넣은 배송 메세지 */}
                        {deliveryRequestAllList &&
                          deliveryRequestAllList.map((data) => {
                            return (
                              <Select.Option value={data.content}>
                                {data.content}
                              </Select.Option>
                            );
                          })}
                      </CustomSelect>
                    </Form.Item>

                    {dRequest === "직접입력" && (
                      <Wrapper al={`flex-start`} margin={`30px 0 10px`}>
                        <Text
                          color={Theme.grey_C}
                          fontSize={`16px`}
                          fontWeight={`700`}
                          padding={`0 0 0 10px`}
                        >
                          요청사항
                        </Text>
                        <Form.Item
                          rules={[
                            {
                              required: dRequest === "직접입력" ? true : false,
                              message: "상세주소를 입력해주세요.",
                            },
                          ]}
                          name="deliveryRequest"
                        >
                          <TextInput
                            border={`none`}
                            borderBottom={`1px solid ${Theme.grey2_C}`}
                            radius={`0`}
                            shadow={`none`}
                            width={`100%`}
                            placeholder={"요청사항을 입력해주세요."}
                          />
                        </Form.Item>
                      </Wrapper>
                    )}
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
                  ju={`space-between`}
                  padding={width < 800 ? `0 10px` : `0 18px 0 38px`}
                  fontSize={width < 800 ? `15px` : `20px`}
                >
                  <Wrapper dr={`row`} width={`auto`}>
                    <Text fontWeight={`bold`}>총 주문금액 : </Text>
                    <Text fontWeight={`bold`}>
                      {totalPrice && numberWithCommas(totalPrice)}
                    </Text>
                  </Wrapper>

                  {router.query && router.query.type !== "payment" && (
                    <Wrapper width={`20px`} onClick={oModalToggle}>
                      <Image
                        src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/pay_icon/delivery.png`}
                        alt={`delivery_price`}
                      />
                    </Wrapper>
                  )}
                </Wrapper>
                <CommonButton
                  shadow={`0`}
                  width={width < 800 ? `130px` : `170px`}
                  height={`100%`}
                  radius={`0`}
                  cursor={`pointer`}
                  htmlType="submit"
                  loading={st_boughtDeliveryLoading}
                >
                  주문하기
                </CommonButton>
              </Wrapper>
            </CustomForm>
          </RsWrapper>

          {/* SEND DELIVERY MODAL */}
          <Modal
            width={`500px`}
            style={{ top: 200 }}
            footer={null}
            visible={sendDeliveryModal}
            onCancel={() => deliveryModalToggle("send")}
          >
            <DaumPostcode
              onComplete={(data) => {
                formRef.current.setFieldsValue({
                  saddress: `${data.address}(${data.zonecode})`,
                });
                deliveryModalToggle("send");
              }}
              width={width < 600 ? `100%` : `600px`}
              height={`500px`}
              style={style}
              animation={true}
              popupKey="postCode_1"
              autoClose={false}
            />
          </Modal>

          {/* RECEIVE DELIVERY MODAL */}
          <Modal
            width={`500px`}
            style={{ top: 200 }}
            footer={null}
            visible={receiveDeliveryModal}
            onCancel={() => deliveryModalToggle("receive")}
          >
            <DaumPostcode
              onComplete={(data) => {
                formRef.current.setFieldsValue({
                  raddress: `${data.address}(${data.zonecode})`,
                });
                deliveryModalToggle("receive");
              }}
              width={width < 600 ? `100%` : `600px`}
              height={`500px`}
              style={style}
              animation={true}
              popupKey="postCode_2"
              autoClose={false}
            />
          </Modal>

          {/* 주문하기 옆 모달 */}
          {/* <CustomModal footer={null} visible={oModal} onCancel={oModalToggle}>
            <Wrapper
              padding={`20px`}
              shadow={Theme.shadow_C}
              radius={`20px`}
              margin={`20px 0 15px`}
            >
              <Wrapper dr={`row`} ju={`flex-start`}>
                <Text color={Theme.grey_C}>종류</Text>
              </Wrapper>
              <Wrapper argin={`10px 0 0`} al={`flex-start`}>
                <Text fontSize={width < 800 ? `16px` : `18px`}>
                  {isMeterialData2 && isMeterialData2.chubSelect} /{" "}
                  {isMeterialData2 && isMeterialData2.packSelect} /{" "}
                  {isMeterialData2 && isMeterialData2.volumnSelect}
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper
              padding={`20px`}
              shadow={Theme.shadow_C}
              radius={`20px`}
              margin={`20px 0 15px`}
            >
              <Wrapper
                dr={`row`}
                ju={`space-between`}
                borderBottom={`1px solid ${Theme.grey2_C}`}
                padding={`10px`}
                color={Theme.grey_C}
              >
                <Wrapper al={`flex-start`} width={`calc(100% / 3)`}>
                  구성약재
                </Wrapper>
                <Wrapper width={`calc(100% / 3)`}>단위</Wrapper>
                <Wrapper al={`flex-end`} width={`calc(100% / 3)`}>
                  금액
                </Wrapper>
              </Wrapper>
              <Wrapper>
                {isMeterialData.map((data) => {
                  return (
                    <Wrapper
                      dr={`row`}
                      ju={`space-between`}
                      borderBottom={`1px solid ${Theme.lightGrey_C}`}
                      padding={`20px 10px 5px`}
                    >
                      <Wrapper
                        width={`calc(100% / 3)`}
                        fontSize={width < 800 ? `16px` : `18px`}
                        al={`flex-start`}
                      >
                        {data.name}
                      </Wrapper>
                      <Wrapper
                        width={`calc(100% / 3)`}
                        fontSize={width < 800 ? `16px` : `18px`}
                      >
                        {data.qnt}
                        {data.unit}
                      </Wrapper>
                      <Wrapper
                        width={`calc(100% / 3)`}
                        fontSize={width < 800 ? `16px` : `18px`}
                        al={`flex-end`}
                      >
                        {data.price * data.qnt}
                      </Wrapper>
                    </Wrapper>
                  );
                })}
              </Wrapper>
            </Wrapper>
          </CustomModal> */}

          {/* SEARCH ADDRESS MODAL */}

          <CustomModal
            width={width < 700 ? `424px` : `500px`}
            style={{ top: 200, borderRadius: 30 }}
            visible={addressListModal}
            footer={null}
            closable={false}
            onCancel={() => addressListModalToggle(2)}
          >
            <Wrapper>
              <Wrapper dr={`row`} margin={`0 0 21px`} ju={`space-between`}>
                <Text
                  fontSize={width < 500 ? `18px` : `22px`}
                  fontWeight={`bold`}
                >
                  주소록 불러오기
                </Text>
                <Wrapper width={width < 500 ? `190px` : `212px`}>
                  <Input
                    {...searchInput}
                    style={{
                      height: `45px`,
                      borderRadius: `20px`,
                      border: `none`,
                      boxShadow: `5px 5px 5px ${Theme.lightGrey_C}`,
                    }}
                    placeholder="주소록에서 검색"
                    prefix={<SearchOutlined />}
                  />
                </Wrapper>
              </Wrapper>
              <Wrapper borderTop={`1px solid ${Theme.grey2_C}`}>
                {addressList &&
                  (addressList.length === 0 ? (
                    <Wrapper margin={`20px 0 0`}>
                      <Empty description={`주소가 없습니다.`} />
                    </Wrapper>
                  ) : (
                    addressList.map((data) => {
                      return (
                        <Wrapper
                          borderBottom={`1px solid ${Theme.grey2_C}`}
                          dr={`row`}
                          padding={`17px 0 15px`}
                        >
                          <Wrapper width={`25%`}>
                            <Text>{data.username}</Text>
                            <Text color={Theme.subTheme2_C}>
                              {data.isNormal ? "기본주소" : ""}
                            </Text>
                          </Wrapper>
                          <Wrapper
                            width={`45%`}
                            al={`flex-start`}
                            fontSize={`14px`}
                          >
                            <Text>{data.address}</Text>
                            <Text>{data.detailAddress}</Text>
                            <Text>{data.userMobile}</Text>
                          </Wrapper>
                          <Wrapper width={`30%`}>
                            <CommonButton
                              kindOf={`white`}
                              width={`70%`}
                              onClick={() => selectAddressHandler(data)}
                            >
                              선택
                            </CommonButton>
                          </Wrapper>
                        </Wrapper>
                      );
                    })
                  ))}
              </Wrapper>

              <Wrapper dr={`row`} ju={`flex-end`} margin={`14px 0 0`}>
                <CommonButton
                  kindOf={`grey`}
                  height={`40px`}
                  onClick={() => addressListModalToggle(2)}
                >
                  취소
                </CommonButton>
                <CommonButton margin={`0 0 0 10px`} height={`40px`}>
                  나에게 보내기
                </CommonButton>
              </Wrapper>
            </Wrapper>
          </CustomModal>
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
      type: DELIVERY_REQUEST_ALL_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Index;
