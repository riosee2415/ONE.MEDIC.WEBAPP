import React, { useCallback, useEffect, useState } from "react";
import { Empty, Form, Input, message, Modal, Pagination } from "antd";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ClientLayout from "../../components/ClientLayout";
import {
  RsWrapper,
  WholeWrapper,
  Wrapper,
  Text,
  CommonButton,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import {
  REQUEST_CREATE_REQUEST,
  REQUEST_DELETE_REQUEST,
  REQUEST_LIST_deliveryREQUEST,
  REQUEST_UPDATE_REQUEST,
} from "../../reducers/userRequest";
import Theme from "../../components/Theme";

import { END } from "redux-saga";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";
import {
  DELIVERY_REQUEST_CREATE_REQUEST,
  DELIVERY_REQUEST_DELETE_REQUEST,
  DELIVERY_REQUEST_LIST_REQUEST,
  DELIVERY_REQUEST_UPDATE_REQUEST,
} from "../../reducers/userDeliveryRequest";

const CustomModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 20px;
  }
`;

const HoverText = styled(Text)`
  &:hover {
    color: ${(props) => props.theme.basicTheme_C};
    font-weight: 600;
  }
`;

const HoverWrapper = styled(Wrapper)`
  &:hover {
    color: ${(props) => props.theme.basicTheme_C};
    font-weight: 600;
  }
`;

const Request = () => {
  ////// GLOBAL STATE //////

  const { me } = useSelector((state) => state.user);

  const {
    deliveryRequestList,
    deliveryRequestLastPage,
    //
    st_deliveryRequestListError,
    //
    st_deliveryRequestCreateLoading,
    st_deliveryRequestCreateDone,
    st_deliveryRequestCreateError,
    //
    st_deliveryRequestUpdateLoading,
    st_deliveryRequestUpdateDone,
    st_deliveryRequestUpdateError,
    //
    st_deliveryRequestDeleteLoading,
    st_deliveryRequestDeleteDone,
    st_deliveryRequestDeleteError,
  } = useSelector((state) => state.userDeliveryRequest);

  ////// HOOKS //////

  const width = useWidth();
  const router = useRouter();
  const dispatch = useDispatch();

  const [cuForm] = Form.useForm();

  // 모달
  const [modalData, setModalData] = useState(false);
  const [cuModal, setCUModal] = useState(false);

  const [dModal, setDModal] = useState(false);

  // 페이지 네이션
  const [currentPage, setCurrentPage] = useState(1);

  ////// USEEFFECT //////

  // 로그인 체크
  useEffect(() => {
    if (!me) {
      router.push(`/login`);
      return message.error(`로그인 후 이용하실 수 있습니다.`);
    }
  }, [me]);

  // 페이지네이션 - 리스트 불러오기
  useEffect(() => {
    if (me) {
      dispatch({
        type: DELIVERY_REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });
    }
  }, [currentPage]);

  // 요청사항 리스트
  useEffect(() => {
    if (st_deliveryRequestListError) {
      return message.error(st_deliveryRequestListError);
    }
  }, [st_deliveryRequestListError]);

  // 요청사항 생성
  useEffect(() => {
    if (st_deliveryRequestCreateDone) {
      dispatch({
        type: DELIVERY_REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      cuModalToggle(null);

      return message.success("요청사항이 생성되었습니다.");
    }
  }, [st_deliveryRequestCreateDone]);

  useEffect(() => {
    if (st_deliveryRequestCreateError) {
      return message.error(st_deliveryRequestCreateError);
    }
  }, [st_deliveryRequestCreateError]);

  // 요청사항 수정

  useEffect(() => {
    if (st_deliveryRequestUpdateDone) {
      dispatch({
        type: DELIVERY_REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      cuModalToggle(null);

      return message.success("요청사항이 수정되었습니다.");
    }
  }, [st_deliveryRequestUpdateDone]);

  useEffect(() => {
    if (st_deliveryRequestUpdateError) {
      return message.error(st_deliveryRequestUpdateError);
    }
  }, [st_deliveryRequestUpdateError]);

  // 요청사항 삭제

  useEffect(() => {
    if (st_deliveryRequestDeleteDone) {
      dispatch({
        type: DELIVERY_REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      dModalToggle(null);

      return message.success("요청사항이 삭제되었습니다.");
    }
  }, [st_deliveryRequestDeleteDone]);

  useEffect(() => {
    if (st_deliveryRequestDeleteError) {
      return message.error(st_deliveryRequestDeleteError);
    }
  }, [st_deliveryRequestDeleteError]);

  ////// TOGGLE //////
  const cuModalToggle = useCallback(
    (data) => {
      if (data) {
        setModalData(data);

        cuForm.setFieldsValue({
          title: data.title,
          receiverName: data.receiverName,
          medication: data.medication,
          content: data.content,
        });
      } else {
        setModalData(null);

        cuForm.resetFields();
      }

      setCUModal((prev) => !prev);
    },
    [modalData, cuModal]
  );

  const dModalToggle = useCallback(
    (data) => {
      if (data) {
        setModalData(data);
      } else {
        setModalData(null);
      }

      setDModal((prev) => !prev);
    },
    [modalData, dModal]
  );

  ////// HANDLER /////

  // 요청사항 추가
  const requestCreateHandler = useCallback(
    (data) => {
      if (st_deliveryRequestCreateLoading) {
        return message.info("추가중입니다.");
      }

      dispatch({
        type: DELIVERY_REQUEST_CREATE_REQUEST,
        data: data,
      });
    },
    [st_deliveryRequestCreateLoading]
  );

  // 요청사항 수정
  const requestUpdateHandler = useCallback(
    (data) => {
      if (st_deliveryRequestUpdateLoading) {
        return message.info("수정중입니다.");
      }

      dispatch({
        type: DELIVERY_REQUEST_UPDATE_REQUEST,
        data: { id: modalData.id, ...data },
      });
    },
    [modalData, st_deliveryRequestUpdateLoading]
  );

  // 요청사항 삭제
  const requestDeleteHandler = useCallback(() => {
    if (st_deliveryRequestDeleteLoading) {
      return message.info("삭제중입니다.");
    }

    dispatch({
      type: DELIVERY_REQUEST_DELETE_REQUEST,
      data: {
        id: modalData.id,
      },
    });
  }, [modalData, st_deliveryRequestDeleteLoading]);

  // 페이지 네이션 - 페이지 교체
  const pageChangeHandler = useCallback(
    (page) => {
      setCurrentPage(page);
    },
    [currentPage]
  );

  return (
    <ClientLayout>
      <WholeWrapper>
        <RsWrapper
          minHeight={`calc(100vh - 64px)`}
          ju={`flex-start`}
          position={`relative`}
          padding={`0`}
        >
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
              요청사항
            </Text>
            <HoverText cursor={`pointer`} onClick={() => cuModalToggle(null)}>
              요청사항 추가
            </HoverText>
          </Wrapper>

          {/* LIST AREA START */}
          <Wrapper minHeight={`calc(100vh - 185px - 75px)`} ju={`flex-start`}>
            <Wrapper
              padding={width < 800 ? `0 10px 30px` : `0 38px 30px`}
              dr={`row`}
              ju={`flex-start`}
              al={`flex-start`}
            >
              {console.log(deliveryRequestList)}
              {deliveryRequestList &&
                (deliveryRequestList.length === 0 ? (
                  <Wrapper>
                    <Empty description={`요청사항이 없습니다.`} />
                  </Wrapper>
                ) : (
                  deliveryRequestList.map((data) => {
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
                        margin={width < 700 ? `0 0 16px` : `0 8px 16px`}
                      >
                        <Wrapper
                          dr={`row`}
                          ju={`space-between`}
                          margin={`15px 0`}
                        >
                          <Wrapper dr={`row`} ju={`flex-start`}>
                            <Wrapper al={`flex-start`}>
                              <Text width={`100%`} isEllipsis>
                                {data.content}
                              </Text>
                            </Wrapper>
                          </Wrapper>
                        </Wrapper>
                        <Wrapper
                          dr={`row`}
                          color={Theme.grey_C}
                          borderTop={`1px solid ${Theme.grey2_C}`}
                          padding={`10px 0 0`}
                        >
                          <HoverWrapper
                            width={`calc(100% / 2)`}
                            cursor={`pointer`}
                            onClick={() => cuModalToggle(data)}
                          >
                            상세정보
                          </HoverWrapper>
                          <HoverWrapper
                            width={`calc(100% / 2)`}
                            borderLeft={`1px solid ${Theme.grey2_C}`}
                            cursor={`pointer`}
                            onClick={() => dModalToggle(data)}
                          >
                            삭제
                          </HoverWrapper>
                        </Wrapper>
                      </Wrapper>
                    );
                  })
                ))}
            </Wrapper>
          </Wrapper>
          <Wrapper margin={`20px 0`}>
            <Pagination
              current={parseInt(currentPage)}
              total={deliveryRequestLastPage * 9}
              pageSize={9}
              onChange={(page) => pageChangeHandler(page)}
            />
          </Wrapper>
          {/* LIST AREA END */}

          {/* CREATE . UPDATE MODAL */}
          <CustomModal
            visible={cuModal}
            footer={null}
            width={`450px`}
            onCancel={() => cuModalToggle(null)}
          >
            <Wrapper al={`flex-start`} margin={`0 0 30px`}>
              <Text fontSize={`20px`} fontWeight={`bold`}>
                {modalData ? "요청사항 상세정보" : "요청사항 추가"}
              </Text>
            </Wrapper>
            <Form
              form={cuForm}
              onFinish={modalData ? requestUpdateHandler : requestCreateHandler}
            >
              <Text>요청사항</Text>
              <Form.Item
                name="content"
                rules={[
                  { required: true, message: "요청사항을 입력해주세요." },
                ]}
              >
                <Input.TextArea placeholder="요청사항을 입력해주세요." />
              </Form.Item>

              <Wrapper
                al={`flex-end`}
                padding={`20px 0 0`}
                borderTop={`1px solid ${Theme.grey2_C}`}
              >
                <CommonButton htmlType="submit">
                  {modalData ? "요청사항 수정" : "요청사항 추가"}
                </CommonButton>
              </Wrapper>
            </Form>
          </CustomModal>

          {/* DELETE MODAL */}
          <CustomModal
            visible={dModal}
            footer={null}
            onCancel={() => dModalToggle(null)}
          >
            <Wrapper al={`flex-start`}>
              <Text fontSize={`20px`} fontWeight={`bold`}>
                요청사항 삭제
              </Text>
            </Wrapper>
            <Wrapper margin={`15px 0 10px`} fontSize={`17px`}>
              <Text>삭제 된 데이터는 다시 복구할 수 없습니다.</Text>
              <Text>정말 삭제하시겠습니까?</Text>
            </Wrapper>
            <Wrapper al={`flex-end`}>
              <CommonButton onClick={requestDeleteHandler}>
                삭제하기
              </CommonButton>
            </Wrapper>
          </CustomModal>
        </RsWrapper>
      </WholeWrapper>
    </ClientLayout>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default Request;
