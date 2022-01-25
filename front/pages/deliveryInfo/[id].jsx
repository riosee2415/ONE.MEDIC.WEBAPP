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
  TextInput,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  DropboxOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Modal, Select } from "antd";
import {
  DELIVERY_MODAL_TOGGLE,
  PAYMENT_DETAIL_REQUEST,
} from "../../reducers/paymentRequest";
import DaumPostcode from "react-daum-postcode";
import useInput from "../../hooks/useInput";

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

const Index = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { paymentDetail, deliveryModal } = useSelector(
    (state) => state.paymentRequest
  );

  ////// HOOKS //////
  const router = useRouter();

  const address = useInput();
  const zoneCode = useInput();
  const [newPostCode, setNewPostCode] = useState();

  const dispatch = useDispatch();

  ////// REDUX //////
  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: PAYMENT_DETAIL_REQUEST,
        data: {
          paymentId: router.query.id,
        },
      });
    }
  }, [router.query]);

  ////// TOGGLE //////

  const deliveryModalToggle = useCallback(() => {
    dispatch({
      type: DELIVERY_MODAL_TOGGLE,
    });
  }, []);
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
              {/* <Wrapper width={`auto`}>
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
              /> */}
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
                    <TextInput
                      border={`none`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      radius={`0`}
                      shadow={`none`}
                      width={`100%`}
                      placeholder={`(필수)연락처를 입력해주세요`}
                      phFontSize={width < 450 ? `14px` : `16px`}
                      focusBorder={`none`}
                      focusBorderBottom={`1px solid ${Theme.black_C}`}
                    />
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
                    <Wrapper position={`relative`}>
                      <TextInput
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
                  </Wrapper>
                </Wrapper>
              </Wrapper>

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
                    <TextInput
                      border={`none`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      radius={`0`}
                      shadow={`none`}
                      width={`100%`}
                      placeholder={`(필수)연락처를 입력해주세요`}
                      phFontSize={width < 450 ? `14px` : `16px`}
                      focusBorder={`none`}
                      focusBorderBottom={`1px solid ${Theme.black_C}`}
                    />
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
                      onClick={deliveryModalToggle}
                    >
                      <TextInput
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
                  <CustomSelect defaultValue={`default`}>
                    <Select.Option value={`default`}>
                      배송 메세지를 선택해주세요.
                    </Select.Option>
                    <Select.Option></Select.Option>
                    <Select.Option></Select.Option>
                  </CustomSelect>

                  <Wrapper al={`flex-start`} margin={`30px 0 10px`}>
                    <Text
                      color={Theme.grey_C}
                      fontSize={`16px`}
                      fontWeight={`700`}
                      padding={`0 0 0 10px`}
                    >
                      요청사항
                    </Text>
                    <TextInput
                      border={`none`}
                      borderBottom={`1px solid ${Theme.grey2_C}`}
                      radius={`0`}
                      shadow={`none`}
                      width={`100%`}
                    />
                  </Wrapper>
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
                  <Text fontWeight={`bold`}> 432,000</Text>
                </Wrapper>
                <Wrapper width={`20px`}>
                  <Image
                    src={`https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/oneMedic/assets/pay_icon/delivery.png`}
                    alt={`delivery_price`}
                  />
                </Wrapper>
              </Wrapper>
              <CommonButton
                shadow={`0`}
                width={width < 800 ? `130px` : `170px`}
                height={`100%`}
                radius={`0`}
                cursor={`pointer`}
              >
                주문하기
              </CommonButton>
            </Wrapper>
          </RsWrapper>

          {/* DELIVERY MODAL */}
          <Modal
            width={`500px`}
            style={{ top: 200 }}
            footer={null}
            visible={deliveryModal}
            onCancel={deliveryModalToggle}
          >
            <DaumPostcode
              onComplete={(data) => {
                console.log(data);
                address.setValue(data.address);
                zoneCode.setValue(data.zonecode);
                setNewPostCode(false);
              }}
              width={width < 600 ? `100%` : `600px`}
              height={`500px`}
              autoClose
              animation
              style={style}
            />
          </Modal>
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
