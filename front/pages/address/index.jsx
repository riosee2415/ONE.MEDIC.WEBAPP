import React, { useEffect, useCallback, useState } from "react";
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
import Head from "next/head";
import { Checkbox, Empty, Form, Input, message, Modal } from "antd";
import { useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import {
  ADDRESS_MODAL_TOGGLE,
  SEARCH_ADDRESS_MODAL_TOGGLE,
  ADDRESS_LIST_REQUEST,
  ADDRESS_CREATE_REQUEST,
  ADDRESS_ISNORMAL_REQUEST,
  ADDRESS_UPDATE_REQUEST,
  ADDRESS_DELETE_MODAL_TOGGLE,
  ADDRESS_DELETE_REQUEST,
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

const CustomForm = styled(Form)`
  width: 100%;

  & .ant-form-item {
    margin: 0;
  }
`;

const style = {
  overflow: "hidden",
};

const Address = ({}) => {
  const width = useWidth();
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);
  const {
    addressList,
    //
    addressModal,
    searchAddressModal,
    addressDeleteModal,
    //
    st_addressCreateDone,
    st_addressCreateError,
    st_addressUpdateDone,
    st_addressUpdateError,
    st_addressDeleteDone,
    st_addressDeleteError,
    st_addressIsNormalDone,
    st_addressIsNormalError,
  } = useSelector((state) => state.address);

  ////// HOOKS //////

  const [cForm] = Form.useForm();
  const cFormRef = useRef();

  const [isNormalCheck, setIsNormalCheck] = useState(null);
  const [updateAddressData, setUpdateAddressData] = useState(null);
  const [deleteAddressData, setDeleteAddressData] = useState(null);

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
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });

      addressModalToggle(null);

      return message.success("주소가 추가되었습니다.");
    }
  }, [st_addressCreateDone]);

  useEffect(() => {
    if (st_addressCreateError) {
      return message.error(st_addressCreateError);
    }
  }, [st_addressCreateError]);

  useEffect(() => {
    if (st_addressUpdateDone) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });

      addressModalToggle(null);

      return message.success("주소가 수정되었습니다.");
    }
  }, [st_addressUpdateDone]);

  useEffect(() => {
    if (st_addressUpdateError) {
      return message.error(st_addressUpdateError);
    }
  }, [st_addressUpdateError]);

  useEffect(() => {
    if (st_addressDeleteDone) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });

      addressDeleteModalToggle(null);

      return message.success("주소가 삭제되었습니다.");
    }
  }, [st_addressDeleteDone]);

  useEffect(() => {
    if (st_addressDeleteError) {
      return message.error(st_addressDeleteError);
    }
  }, [st_addressDeleteError]);

  useEffect(() => {
    if (st_addressIsNormalDone) {
      dispatch({
        type: ADDRESS_LIST_REQUEST,
        data: {
          searchAddress: "",
        },
      });

      setIsNormalCheck(null);

      return message.success("기본주소가 설정되었습니다.");
    }
  }, [st_addressIsNormalDone]);

  useEffect(() => {
    if (st_addressIsNormalError) {
      return message.error(st_addressIsNormalError);
    }
  }, [st_addressIsNormalError]);

  useEffect(() => {
    if (updateAddressData) {
      onFill(updateAddressData);
    }
  }, [updateAddressData]);

  ////// TOGGLE //////
  const addressModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateAddressData(data);
      } else {
        cForm.resetFields();
        setUpdateAddressData(null);
      }
      dispatch({
        type: ADDRESS_MODAL_TOGGLE,
      });
    },
    [addressModal, updateAddressData]
  );

  const addressDeleteModalToggle = useCallback(
    (data) => {
      if (data) {
        setDeleteAddressData(data);
      } else {
        setDeleteAddressData(null);
      }
      dispatch({
        type: ADDRESS_DELETE_MODAL_TOGGLE,
      });
    },
    [addressDeleteModal, deleteAddressData]
  );

  const deliveryModalToggle = useCallback(() => {
    dispatch({
      type: SEARCH_ADDRESS_MODAL_TOGGLE,
    });
  }, [searchAddressModal]);

  ////// HANDLER //////

  const onFill = useCallback((data) => {
    cFormRef.current.setFieldsValue({
      username: data.username,
      tel: data.userMobile,
      address: `${data.address}(${data.postCode})`,
      detailAddress: data.detailAddress,
    });
  }, []);

  const addressSearchHandler = useCallback((data) => {
    dispatch({
      type: ADDRESS_LIST_REQUEST,
      data: {
        searchAddress: data.address,
      },
    });
  }, []);

  const addressCreateSubmitHandler = useCallback(
    (data) => {
      if (!/^[0-9]{2,3}[0-9]{3,4}[0-9]{4}/.test(data.tel)) {
        return message.error("전화번호를 정확하게 입력해주세요.");
      }

      dispatch({
        type: ADDRESS_CREATE_REQUEST,
        data: {
          postCode: data.address.split("(")[1].substring(0, 5),
          address: data.address.split("(")[0],
          detailAddress: data.detailAddress,
          userId: me.id,
          username: data.username,
          userMobile: data.tel,
        },
      });
    },
    [me]
  );

  const addressCheckBoxHandler = useCallback(
    (data) => {
      setIsNormalCheck(data);
    },
    [isNormalCheck]
  );

  const addressIsNormalHandler = useCallback(() => {
    if (!isNormalCheck) {
      return message.error("기본주소로 설정할 주소를 선택해주세요.");
    }
    dispatch({
      type: ADDRESS_ISNORMAL_REQUEST,
      data: {
        addressId: isNormalCheck,
        isNormal: true,
      },
    });
  }, [isNormalCheck]);

  const addressUpdateHandler = useCallback(
    (data) => {
      dispatch({
        type: ADDRESS_UPDATE_REQUEST,
        data: {
          postCode: data.address.split("(")[1].substring(0, 5),
          address: data.address.split("(")[0],
          detailAddress: data.detailAddress,
          username: data.username,
          tel: data.tel,
          addressId: updateAddressData.id,
        },
      });
    },
    [updateAddressData]
  );

  const addressDeleteHandler = useCallback(() => {
    dispatch({
      type: ADDRESS_DELETE_REQUEST,
      data: {
        addressId: deleteAddressData.id,
      },
    });
  }, [deleteAddressData]);

  ////// DATAVIEW //////

  const getEditContent = (contentValue) => {
    console.log(contentValue);
  };

  return (
    <>
      <Head>
        <title>MorderlLab | 나의주소록</title>
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
                <CustomForm onFinish={addressSearchHandler}>
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
                  <Form.Item name="address">
                    <TextInput
                      radius={`20px`}
                      height={`45px`}
                      width={`100%`}
                      type={`text`}
                      placeholder={`주소록에서 검색`}
                      padding={`0 0 0 45px`}
                    />
                  </Form.Item>
                </CustomForm>
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
                <Text
                  cursor={`pointer`}
                  margin={`0 20px 0 0`}
                  onClick={addressIsNormalHandler}
                >
                  기본주소로 설정
                </Text>
                <Text
                  cursor={`pointer`}
                  onClick={() => addressModalToggle(false)}
                >
                  주소 추가
                </Text>
              </Wrapper>
            </Wrapper>

            <Wrapper minHeight={`calc(100vh - 185px - 75px)`} ju={`flex-start`}>
              <Wrapper
                padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
                dr={`row`}
                ju={`flex-start`}
                al={`flex-start`}
              >
                {addressList &&
                  (addressList.lenght === 0 ? (
                    <Wrapper>
                      <Empty description={`주소가 없습니다.`} />
                    </Wrapper>
                  ) : (
                    addressList.map((data) => {
                      return (
                        <Wrapper
                          key={data.id}
                          width={
                            width < 1100
                              ? width < 700
                                ? `100%`
                                : `calc(100% / 2 - 16px)`
                              : `calc(100% / 3 - 16px)`
                          }
                          radius={`20px`}
                          shadow={Theme.shadow_C}
                          padding={`15px`}
                          al={`flex-start`}
                          ju={`space-between`}
                          margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
                        >
                          <Wrapper
                            dr={`row`}
                            ju={`space-between`}
                            margin={`15px 0`}
                          >
                            <Wrapper dr={`row`} ju={`flex-start`}>
                              {data.isNormal ? (
                                <Wrapper
                                  al={`flex-start`}
                                  margin={`0 0 0 15px`}
                                >
                                  <Text fontSize={`18px`} fontWeight={`bold`}>
                                    {data.username}
                                  </Text>
                                  <Wrapper dr={`row`} ju={`space-between`}>
                                    <Text
                                      color={Theme.grey_C}
                                      width={
                                        data.isNormal
                                          ? `calc(100% - 76px)`
                                          : `100%`
                                      }
                                      isEllipsis
                                    >
                                      {data.address}&nbsp;({data.postCode})
                                    </Text>
                                    {data.isNormal && (
                                      <Wrapper
                                        width={`75px`}
                                        height={`33px`}
                                        radius={`8px`}
                                        border={`1px solid ${Theme.basicTheme_C}`}
                                        color={Theme.subTheme2_C}
                                        bgColor={Theme.subTheme4_C}
                                        fontSize={`16px`}
                                      >
                                        기본주소
                                      </Wrapper>
                                    )}
                                  </Wrapper>
                                  <Text>{data.tel}</Text>
                                </Wrapper>
                              ) : (
                                <CommonCheckBox
                                  onChange={() =>
                                    addressCheckBoxHandler(
                                      isNormalCheck === data.id ? null : data.id
                                    )
                                  }
                                  checked={isNormalCheck === data.id}
                                  style={{ alignItems: "center" }}
                                >
                                  <Wrapper
                                    al={`flex-start`}
                                    margin={`0 0 0 15px`}
                                  >
                                    <Text fontSize={`18px`} fontWeight={`bold`}>
                                      {data.username}
                                    </Text>
                                    <Wrapper dr={`row`} ju={`space-between`}>
                                      <Text color={Theme.grey_C}>
                                        {data.address}&nbsp;({data.postCode})
                                      </Text>
                                    </Wrapper>
                                    <Text>{data.tel}</Text>
                                  </Wrapper>
                                </CommonCheckBox>
                              )}
                            </Wrapper>
                          </Wrapper>
                          <Wrapper
                            dr={`row`}
                            color={Theme.grey_C}
                            borderTop={`1px solid ${Theme.grey2_C}`}
                            padding={`10px 0 0`}
                          >
                            <Wrapper
                              width={`calc(100% / 2)`}
                              cursor={`pointer`}
                              onClick={() => addressModalToggle(data)}
                            >
                              상세정보
                            </Wrapper>
                            <Wrapper
                              width={`calc(100% / 2)`}
                              cursor={`pointer`}
                              borderLeft={`1px solid ${Theme.grey2_C}`}
                              onClick={() => addressDeleteModalToggle(data)}
                            >
                              삭제
                            </Wrapper>
                          </Wrapper>
                        </Wrapper>
                      );
                    })
                  ))}
              </Wrapper>
            </Wrapper>

            {/* CREATE . UPDATE MODAL */}
            <CustomModal
              visible={addressModal}
              footer={null}
              width={`450px`}
              onCancel={() => addressModalToggle(null)}
            >
              <Wrapper al={`flex-start`} margin={`0 0 30px`}>
                <Text fontSize={`20px`} fontWeight={`bold`}>
                  {updateAddressData ? "주소 수정" : "주소 추가"}
                </Text>
              </Wrapper>
              <Form
                form={cForm}
                ref={cFormRef}
                onFinish={
                  updateAddressData
                    ? addressUpdateHandler
                    : addressCreateSubmitHandler
                }
              >
                <Text>고객명</Text>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "고객명을 입력해주세요." },
                  ]}
                >
                  <Input placeholder="고객명을 입력해주세요." />
                </Form.Item>
                <Text>전화번호</Text>
                <Form.Item
                  name="tel"
                  rules={[
                    { required: true, message: "전화번호를 입력해주세요." },
                  ]}
                >
                  <Input placeholder="전화번호를 입력해주세요." type="tel" />
                </Form.Item>
                <Text>주소</Text>
                <Form.Item
                  name="address"
                  rules={[{ required: true, message: "주소를 입력해주세요." }]}
                >
                  <Input
                    placeholder="주소를 입력해주세요."
                    readOnly
                    onClick={deliveryModalToggle}
                  />
                </Form.Item>
                <Text>상세주소</Text>
                <Form.Item
                  name="detailAddress"
                  rules={[
                    { required: true, message: "상세주소를 입력해주세요." },
                  ]}
                >
                  <Input placeholder="상세주소를 입력해주세요." />
                </Form.Item>
                <Wrapper
                  al={`flex-end`}
                  padding={`20px 0 0`}
                  borderTop={`1px solid ${Theme.grey2_C}`}
                >
                  <CommonButton htmlType="submit">
                    {updateAddressData ? "주소 수정" : "주소 추가"}
                  </CommonButton>
                </Wrapper>
              </Form>
            </CustomModal>

            {/* ADDRESS MODAL */}
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

            {/* DELETE MODAL */}
            <CustomModal
              visible={addressDeleteModal}
              footer={null}
              onCancel={() => addressDeleteModalToggle(null)}
            >
              <Wrapper al={`flex-start`}>
                <Text fontSize={`20px`} fontWeight={`bold`}>
                  주소 삭제
                </Text>
              </Wrapper>
              <Wrapper margin={`15px 0 10px`} fontSize={`17px`}>
                <Text>삭제 된 데이터는 다시 복구할 수 없습니다.</Text>
                <Text>정말 삭제하시겠습니까?</Text>
              </Wrapper>
              <Wrapper al={`flex-end`}>
                <CommonButton onClick={addressDeleteHandler}>
                  삭제하기
                </CommonButton>
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
