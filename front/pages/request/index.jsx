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
  TextArea,
} from "../../components/commonComponents";
import useWidth from "../../hooks/useWidth";
import {
  REQUEST_CREATE_REQUEST,
  REQUEST_DELETE_REQUEST,
  REQUEST_LIST_REQUEST,
  REQUEST_UPDATE_REQUEST,
} from "../../reducers/userRequest";
import Theme from "../../components/Theme";

import { END } from "redux-saga";
import axios from "axios";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import wrapper from "../../store/configureStore";

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
    requestList,
    requestLastPage,
    //
    st_requestListError,
    //
    st_requestCreateLoading,
    st_requestCreateDone,
    st_requestCreateError,
    //
    st_requestUpdateLoading,
    st_requestUpdateDone,
    st_requestUpdateError,
    //
    st_requestDeleteLoading,
    st_requestDeleteDone,
    st_requestDeleteError,
  } = useSelector((state) => state.userRequest);

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
        type: REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });
    }
  }, [currentPage]);

  // 요청사항 리스트

  useEffect(() => {
    if (st_requestListError) {
      return message.error(st_requestListError);
    }
  }, [st_requestListError]);

  // 요청사항 생성

  useEffect(() => {
    if (st_requestCreateDone) {
      dispatch({
        type: REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      cuModalToggle(null);

      return message.success("요청사항이 생성되었습니다.");
    }
  }, [st_requestCreateDone]);

  useEffect(() => {
    if (st_requestCreateError) {
      return message.error(st_requestCreateError);
    }
  }, [st_requestCreateError]);

  // 요청사항 수정

  useEffect(() => {
    if (st_requestUpdateDone) {
      dispatch({
        type: REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      cuModalToggle(null);

      return message.success("요청사항이 수정되었습니다.");
    }
  }, [st_requestUpdateDone]);

  useEffect(() => {
    if (st_requestUpdateError) {
      return message.error(st_requestUpdateError);
    }
  }, [st_requestUpdateError]);

  // 요청사항 삭제

  useEffect(() => {
    if (st_requestDeleteDone) {
      dispatch({
        type: REQUEST_LIST_REQUEST,
        data: {
          page: currentPage,
        },
      });

      dModalToggle(null);

      return message.success("요청사항이 삭제되었습니다.");
    }
  }, [st_requestDeleteDone]);

  useEffect(() => {
    if (st_requestDeleteError) {
      return message.error(st_requestDeleteError);
    }
  }, [st_requestDeleteError]);

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
  const requestCreateHandler = useCallback((data) => {
    dispatch({
      type: REQUEST_CREATE_REQUEST,
      data: data,
    });
  }, []);

  // 요청사항 수정
  const requestUpdateHandler = useCallback(
    (data) => {
      dispatch({
        type: REQUEST_UPDATE_REQUEST,
        data: { id: modalData.id, ...data },
      });
    },
    [modalData]
  );

  // 요청사항 삭제
  const requestDeleteHandler = useCallback(() => {
    dispatch({
      type: REQUEST_DELETE_REQUEST,
      data: {
        id: modalData.id,
      },
    });
  }, [modalData]);

  // 페이지 네이션 - 페이지 교체
  const pageChangeHandler = useCallback(
    (page) => {
      console.log(page);
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
              {requestList &&
                (requestList.length === 0 ? (
                  <Wrapper>
                    <Empty description={`요청사항이 없습니다.`} />
                  </Wrapper>
                ) : (
                  requestList.map((data) => {
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
                              <Wrapper
                                dr={`row`}
                                ju={`space-between`}
                                margin={`0 0 15px`}
                              >
                                <Text
                                  width={`50%`}
                                  isEllipsis
                                  fontSize={`18px`}
                                  fontWeight={`bold`}
                                >
                                  {data.title}
                                </Text>

                                <Text
                                  width={`50%`}
                                  isEllipsis
                                  textAlign={`end`}
                                >
                                  {data.receiverName}
                                </Text>
                              </Wrapper>

                              <Text
                                width={`100%`}
                                margin={`0 0 5px`}
                                isEllipsis
                              >
                                {data.medication}
                              </Text>

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
              total={requestLastPage * 9}
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
              <Text>처방명</Text>
              <Form.Item
                name="title"
                rules={[{ required: true, message: "처방명을 입력해주세요." }]}
              >
                <Input placeholder="처방명을 입력해주세요." />
              </Form.Item>

              <Text>환자이름</Text>
              <Form.Item
                name="receiverName"
                rules={[
                  { required: true, message: "환자이름을 입력해주세요." },
                ]}
              >
                <Input placeholder="환자이름을 입력해주세요." />
              </Form.Item>

              <Text>복약지도</Text>
              <Form.Item
                name="medication"
                rules={[
                  { required: true, message: "복약지도를 입력해주세요." },
                ]}
              >
                <Input.TextArea placeholder="복약지도을 입력해주세요." />
              </Form.Item>

              <Text>추가 요청사항</Text>
              <Form.Item
                name="content"
                rules={[
                  { required: true, message: "추가 요청사항을 입력해주세요." },
                ]}
              >
                <Input.TextArea placeholder="추가 요청사항을 입력해주세요." />
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
