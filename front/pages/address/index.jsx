import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  KAKAO_LOGIN_REQUEST,
  LOAD_MY_INFO_REQUEST,
  LOGIN_REQUEST,
} from "../../reducers/user";
import useInput from "../../hooks/useInput";
import ClientLayout from "../../components/ClientLayout";
import axios from "axios";
import wrapper from "../../store/configureStore";
import { END } from "redux-saga";
import {
  Text,
  WholeWrapper,
  Wrapper,
  RsWrapper,
  TextInput,
  CommonButton,
  CommonCheckBox,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import Theme from "../../components/Theme";
import styled from "styled-components";
import { SEO_LIST_REQUEST } from "../../reducers/seo";
import Head from "next/head";
import { Checkbox, Empty, Form, Input, message, Modal } from "antd";
import { useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import {
  ADDRESS_CREATE_MODAL_TOGGLE,
  SEARCH_ADDRESS_MODAL_TOGGLE,
  ADDRESS_LIST_REQUEST,
  ADDRESS_CREATE_REQUEST,
} from "../../reducers/address";
import DaumPostcode from "react-daum-postcode";

const TagBtn = styled(Wrapper)`
  width: 75px;
  height: 35px;
  font-size: 15px;
  border-radius: ${(props) => props.radius || `10px`};
  background: ${(props) => props.theme.lightGrey_C};
  color: ${(props) => props.theme.subTheme2_C};
  border: 1px solid ${(props) => props.theme.basicTheme_C};
`;

const CustomModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }
`;

const style = {
  overflow: "hidden",
};

const Address = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////
  const { seo_keywords, seo_desc, seo_ogImage, seo_title } = useSelector(
    (state) => state.seo
  );

  const { me } = useSelector((state) => state.user);
  const {
    addressList,
    createModal,
    searchAddressModal,
    st_addressCreateDone,
    st_addressCreateError,
  } = useSelector((state) => state.address);

  ////// HOOKS //////

  const [cForm] = Form.useForm();
  const cFormRef = useRef();

  ////// REDUX //////
  const dispatch = useDispatch();
  const router = useRouter();
  ////// USEEFFECT //////
  useEffect(() => {
    dispatch({ type: LOAD_MY_INFO_REQUEST });
  }, [router.query]);

  useEffect(() => {
    if (me) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });
    } else {
      message.error(`로그인 후 이용하실 수 있습니다.`);
      router.push(`/login`);
    }
  }, [router.query, me]);

  useEffect(() => {
    if (st_addressCreateDone) {
      addressCreateModalToggle(true);

      return message.success("주소가 추가되었습니다.");
    }
  }, [st_addressCreateDone]);

  useEffect(() => {
    if (st_addressCreateError) {
      return message.error(st_addressCreateError);
    }
  }, [st_addressCreateError]);

  ////// TOGGLE //////
  const addressCreateModalToggle = useCallback(
    (isClose) => {
      if (isClose) {
        cForm.resetFields();
      }
      dispatch({
        type: ADDRESS_CREATE_MODAL_TOGGLE,
      });
    },
    [createModal]
  );

  const deliveryModalToggle = useCallback(() => {
    dispatch({
      type: SEARCH_ADDRESS_MODAL_TOGGLE,
    });
  }, [searchAddressModal]);

  ////// HANDLER //////

  const addressCreateSubmitHandler = useCallback(
    (data) => {
      dispatch({
        type: ADDRESS_CREATE_REQUEST,
        data: {
          postCode: data.address.split("(")[1].substring(0, 5),
          address: data.address.split("(")[0],
          detailAddress: data.detailAddress,
          userId: me.id,
          username: data.username,
          userMobile: data.userMobile,
        },
      });
    },
    [me]
  );

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
                  placeholder={`주소록에서 검색`}
                  padding={`0 0 0 45px`}
                />
              </Wrapper>
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
              color={Theme.grey_C}
            >
              <Text color={Theme.grey_C} fontWeight={`bold`}>
                주소록
              </Text>
              <Wrapper dr={`row`} width={`auto`}>
                <Text cursor={`pointer`} margin={`0 20px 0 0`}>
                  기본주소로 설정
                </Text>
                <Text
                  cursor={`pointer`}
                  onClick={() => addressCreateModalToggle(false)}
                >
                  주소 추가
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper
              padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
              minHeight={`calc(100vh - 185px - 75px)`}
              ju={`flex-start`}
            >
              <Wrapper
                radius={`20px`}
                shadow={Theme.shadow_C}
                padding={`15px`}
                al={`flex-start`}
                margin={`0 0 15px`}
              >
                <Wrapper dr={`row`} ju={`space-between`} margin={`15px 0`}>
                  <Wrapper dr={`row`} width={`auto`}>
                    <CommonCheckBox style={{ alignItems: "center" }}>
                      <Wrapper
                        width={`auto`}
                        al={`flex-start`}
                        margin={`0 0 0 15px`}
                      >
                        <Text fontSize={`18px`} fontWeight={`bold`}>
                          고객명
                        </Text>
                        <Text color={Theme.grey_C}>
                          서울 성동구 성수이로6길 13
                        </Text>
                        <Text>010-0000-0000</Text>
                      </Wrapper>
                    </CommonCheckBox>
                  </Wrapper>
                </Wrapper>
                <Wrapper
                  dr={`row`}
                  color={Theme.grey_C}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                  padding={`10px 0 0`}
                >
                  <Wrapper width={`calc(100% / 2)`}>수정</Wrapper>
                  <Wrapper
                    width={`calc(100% / 2)`}
                    borderLeft={`1px solid ${Theme.grey2_C}`}
                  >
                    삭제
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

            <CustomModal
              visible={createModal}
              footer={null}
              width={`450px`}
              onCancel={() => addressCreateModalToggle(true)}
            >
              <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                <Text fontSize={`20px`} fontWeight={`bold`}>
                  주소 추가
                </Text>
              </Wrapper>
              <Form
                form={cForm}
                ref={cFormRef}
                onFinish={addressCreateSubmitHandler}
              >
                <Text>고객명</Text>
                <Form.Item name="username">
                  <Input placeholder="고객명을 입력해주세요." />
                </Form.Item>
                <Text>전화번호</Text>
                <Form.Item name="userMobile">
                  <Input placeholder="전화번호를 입력해주세요." type="number" />
                </Form.Item>
                <Text>주소</Text>
                <Form.Item name="address">
                  <Input
                    placeholder="주소를 입력해주세요."
                    readOnly
                    onClick={deliveryModalToggle}
                  />
                </Form.Item>
                <Text>상세주소</Text>
                <Form.Item name="detailAddress">
                  <Input placeholder="상세주소를 입력해주세요." />
                </Form.Item>
                <Wrapper
                  al={`flex-end`}
                  padding={`20px 0 0`}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                >
                  <CommonButton htmlType="submit">주소 추가</CommonButton>
                </Wrapper>
              </Form>
            </CustomModal>

            <Modal
              width={`500px`}
              style={{ top: 200 }}
              footer={null}
              visible={searchAddressModal}
              onCancel={deliveryModalToggle}
            >
              <DaumPostcode
                onComplete={(data) => {
                  cFormRef.current.setFieldsValue({
                    address: `${data.address}(${data.zonecode})`,
                  });
                  deliveryModalToggle();
                }}
                width={width < 600 ? `100%` : `600px`}
                height={`500px`}
                style={style}
                animation={true}
                popupKey="postCode_2"
                autoClose={false}
              />
            </Modal>
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

    context.store.dispatch({
      type: ADDRESS_LIST_REQUEST,
      data: {
        searchAddress: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);
export default Address;
