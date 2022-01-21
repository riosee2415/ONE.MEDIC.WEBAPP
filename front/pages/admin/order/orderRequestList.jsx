import {
  Button,
  Modal,
  Table,
  Input,
  Form,
  Empty,
  Popconfirm,
  message,
} from "antd";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";
import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import { numberWithCommas } from "../../../components/commonUtils";
import {
  DETAIL_MODAL_TOGGLE,
  PAYMENTREQUEST_LIST_REQUEST,
  UNIT_MODAL_TOGGLE,
  USER_DETAIL_MODAL_TOGGLE,
  PAYMENTREQUEST_COMPLETE_REQUEST,
} from "../../../reducers/paymentRequest";
import {
  AdminContent,
  GuideUl,
  GuideLi,
  Text,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import { useState } from "react";
import { MATERIAL_DETAIL_REQUEST } from "../../../reducers/material";

const AdminButton = styled(Button)`
  margin: 0 5px;
`;

const OrderRequestList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const {
    paymentRequest,
    detailModal,
    unitModal,
    userDetailModal,
    //
    st_paymentRequestCompleteDone,
    st_paymentRequestCompleteError,
  } = useSelector((state) => state.paymentRequest);
  const { material } = useSelector((state) => state.material);

  const router = useRouter();

  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);
  /////////////////////////////////////////////////////////////////////////

  ////// HOOKS //////

  const dispatch = useDispatch();

  const [searchTab, setSearchTab] = useState(1);
  const [isComplete, setIsComplete] = useState(1);

  const [paymentData, setPaymentData] = useState(null);

  const [userDetailData, setUserDetailData] = useState(null);

  const [payForm] = Form.useForm();
  const payFormRef = useRef();

  const [userForm] = Form.useForm();
  const userFormRef = useRef();

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: PAYMENTREQUEST_LIST_REQUEST,
      data: {
        type: searchTab,
        isComplete: isComplete,
      },
    });
  }, [searchTab, isComplete]);

  useEffect(() => {
    if (paymentData) {
      console.log(paymentData);
      dispatch({
        type: MATERIAL_DETAIL_REQUEST,
        data: {
          paymentRequestId: paymentData.id,
        },
      });
      onFill(paymentData);
    }
  }, [paymentData]);

  useEffect(() => {
    if (userDetailData) {
      onUserFill(userDetailData);
    }
  }, [userDetailData]);

  useEffect(() => {
    if (st_paymentRequestCompleteDone) {
      dispatch({
        type: PAYMENTREQUEST_LIST_REQUEST,
        data: {
          type: searchTab,
        },
      });

      return message.success("처리완료되었습니다.");
    }
  }, [st_paymentRequestCompleteDone]);
  useEffect(() => {
    if (st_paymentRequestCompleteError) {
      return message.error(st_paymentRequestCompleteError);
    }
  }, [st_paymentRequestCompleteError]);

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const detailMdoalToggle = useCallback(
    (data) => {
      if (data) {
        setUserDetailData(data);
      } else {
        setUserDetailData(null);
      }
      dispatch({
        type: USER_DETAIL_MODAL_TOGGLE,
      });
    },
    [userDetailModal]
  );

  const paymentDetailToggle = useCallback(
    (data) => {
      if (data) {
        setPaymentData(data);
      } else {
        setPaymentData(null);
      }
      dispatch({
        type: DETAIL_MODAL_TOGGLE,
      });
    },
    [detailModal, paymentData]
  );

  ////// HANDLER //////

  const tabChangeHandler = useCallback(
    (tab) => {
      setSearchTab(tab);
      if (tab === 3) {
        setIsComplete(tab);
      }
    },
    [searchTab, isComplete]
  );

  const completeChangeHandler = useCallback(
    (complete) => {
      setIsComplete(complete);
    },
    [isComplete]
  );

  const onFill = useCallback(
    (data) => {
      payFormRef.current.setFieldsValue({
        payment: data.payment,
        packVolumn: data.packVolumn,
        typeVolumn: data.typeVolumn,
        unitVolumn: data.unitVolumn,
        otherVolumn: data.otherVolumn,
      });
    },
    [payFormRef]
  );

  const onUserFill = useCallback(
    (data) => {
      userFormRef.current.setFieldsValue({
        userName: data.username,
        userNickName: data.nickname,
        userEmail: data.email,
        userMobile: data.mobile,
        userCompanyName: data.companyName,
        userCompanyNo: data.companyNo,
      });
    },
    [payFormRef]
  );

  const onComplete = useCallback((data) => {
    dispatch({
      type: PAYMENTREQUEST_COMPLETE_REQUEST,
      data: {
        paymentId: parseInt(data),
      },
    });
  }, []);

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "회원",
      dataIndex: "username",
    },
    {
      title: "회원 상세보기",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailMdoalToggle(data)}
        >
          회원 상세보기
        </Button>
      ),
    },
    {
      title: "종류",
      dataIndex: "typeVolumn",
    },
    {
      title: "포장",
      dataIndex: "packVolumn",
    },
    {
      title: "단위",
      dataIndex: "unitVolumn",
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => paymentDetailToggle(data)}
        >
          상세보기
        </Button>
      ),
    },
    {
      title: "주문일",
      dataIndex: "orderAt",
    },
    {
      title: "처리완료",
      render: (data) => (
        <Popconfirm
          title="처리하시겠습니까?"
          onConfirm={() => onComplete(data.id)}
          okText="처리완료"
          cancelText="취소"
        >
          <Button type="primary" size="small">
            처리완료
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["주문 관리", "약속처방 주문 관리"]}
        title={`약속처방 주문 관리`}
        subTitle={`약속처방에서 판매된 상품의 주문을 관리하는 시스템 입니다.`}
      />
      <AdminContent>
        <Text fontSize={`14px`} color={Theme.red_C} isImpo={true}>
          1개월 전 발생된 데이터가 필요한 경우 개발사로 요청해주세요. (1600 -
          4198)
        </Text>
        <Wrapper
          dr={`row`}
          ju={`space-between`}
          al={`flex-start`}
          margin={`20px 0 10px`}
        >
          <Wrapper dr={`row`} ju={`flex-start`}></Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <Wrapper dr={`row`} ju={`flex-start`}>
              <AdminButton
                size="small"
                type={searchTab === 1 && `primary`}
                onClick={() => tabChangeHandler(1)}
              >
                1주일
              </AdminButton>
              <AdminButton
                size="small"
                type={searchTab === 2 && `primary`}
                onClick={() => tabChangeHandler(2)}
              >
                1개월
              </AdminButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <AdminButton
                size="small"
                type={isComplete === 1 && `primary`}
                onClick={() => completeChangeHandler(1)}
              >
                미처리
              </AdminButton>
              <AdminButton
                size="small"
                type={isComplete === 2 && `primary`}
                onClick={() => completeChangeHandler(2)}
              >
                처리
              </AdminButton>
            </Wrapper>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <AdminButton
              size="small"
              type={searchTab === 3 ? `primary` : `dashed`}
              onClick={() => tabChangeHandler(3)}
            >
              전체보기
            </AdminButton>
            <AdminButton type="danger" size="small" onClick={unitModalToggle}>
              주의사항
            </AdminButton>
            <AdminButton size="small">전체 주문서 다운로드</AdminButton>
          </Wrapper>
        </Wrapper>
        <Table
          columns={columns}
          size="small"
          dataSource={paymentRequest ? paymentRequest : []}
        />
      </AdminContent>

      {/* UNIT MODAL */}

      <Modal
        title="주의사항"
        visible={unitModal}
        onCancel={unitModalToggle}
        footer={null}
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            1개월 전 발생된 데이터가 필요한 경우 개발사로 요청해주세요. (1600 -
            4198)
          </GuideLi>
          <GuideLi>
            속도개선을 위해 최근 발생한 데이터를 기준으로 조회됩니다.
          </GuideLi>
          <GuideLi>
            제품의 제작 및 배송이 완료된 경우 처리완료 버튼을 클릭해주세요.
          </GuideLi>
          <GuideLi>
            주문요청 건 별 [주문서 다운로드] 버튼을 통해 엑셀파일을 다운받을 수
            있습니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* USER DETAIL MODAL */}

      <Modal
        title="회원 상세보기"
        visible={userDetailModal}
        footer={null}
        width={`600px`}
        onCancel={() => detailMdoalToggle(null)}
      >
        <Form
          form={userForm}
          ref={userFormRef}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item label="회원이름" name="userName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="닉네임" name="userNickName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="이메일" name="userEmail">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="전화번호" name="userMobile">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="회사이름" name="userCompanyName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="회사번호" name="userCompanyNo">
            <Input readOnly />
          </Form.Item>
        </Form>
      </Modal>

      {/* PAYMENT DETAIL MODAL */}

      <Modal
        title="상세보기"
        visible={detailModal}
        onCancel={() => paymentDetailToggle(null)}
        footer={null}
        width={`700px`}
      >
        <Form
          form={payForm}
          ref={payFormRef}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item name="payment" label="가격">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="typeVolumn" label="종류">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="packVolumn" label="포장">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="unitVolumn" label="단위">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="otherVolumn" label="요구사항">
            <Input readOnly />
          </Form.Item>
          <Wrapper dr={`row`} ju={`flex-start`}>
            {material &&
              (material.length === 0 ? (
                <Empty>재료가 없습니다.</Empty>
              ) : (
                material.map((data) => {
                  return (
                    <Wrapper width={`calc(100% / 3 - 20px)`} margin={`10px`}>
                      <Wrapper dr={`row`} ju={`space-between`}>
                        <Text>이름</Text>
                        <Input
                          style={{ width: `80%` }}
                          value={data.Material.name}
                          readOnly
                        />
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`5px 0 0`}
                      >
                        <Text>가격</Text>
                        <Input
                          style={{ width: `80%` }}
                          value={data.payment}
                          readOnly
                        />
                      </Wrapper>
                      <Wrapper
                        dr={`row`}
                        ju={`space-between`}
                        margin={`5px 0 0`}
                      >
                        <Text>용량</Text>
                        <Input
                          style={{ width: `80%` }}
                          value={`${data.qnt}${data.unit}`}
                          readOnly
                        />
                      </Wrapper>
                    </Wrapper>
                  );
                })
              ))}
          </Wrapper>
        </Form>
      </Modal>
    </AdminLayout>
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
      type: PAYMENTREQUEST_LIST_REQUEST,
      data: {
        type: 1,
        isComplete: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default OrderRequestList;
