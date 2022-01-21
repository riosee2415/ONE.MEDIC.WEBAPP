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
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import {
  DETAIL_MODAL_TOGGLE,
  PAYMENTREQUEST_LIST_REQUEST,
  UNIT_MODAL_TOGGLE,
  USER_DETAIL_MODAL_TOGGLE,
  PAYMENTREQUEST_COMPLETE_REQUEST,
  DELIVERY_MODAL_TOGGLE,
  PAYMENTREQUEST_DELIVERY_REQUEST,
} from "../../../reducers/paymentRequest";
import {
  AdminContent,
  GuideUl,
  GuideLi,
  Text,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
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
    deliveryModal,
    //
    st_paymentRequestCompleteDone,
    st_paymentRequestCompleteError,
    //
    st_paymentRequestDeliveryDone,
    st_paymentRequestDeliveryError,
  } = useSelector((state) => state.paymentRequest);

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
  const [deliveryData, setDeliveryData] = useState(null);

  const [deliveryForm] = Form.useForm();
  const deliveryFormRef = useRef();

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
    if (deliveryData) {
      deliveryOnFill(deliveryData);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (st_paymentRequestCompleteDone) {
      dispatch({
        type: PAYMENTREQUEST_LIST_REQUEST,
        data: {
          type: searchTab,
          isComplete: isComplete,
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

  useEffect(() => {
    if (st_paymentRequestDeliveryDone) {
      dispatch({
        type: PAYMENTREQUEST_LIST_REQUEST,
        data: {
          type: searchTab,
          isComplete: isComplete,
        },
      });

      dispatch({
        type: DELIVERY_MODAL_TOGGLE,
      });

      deliveryForm.resetFields();

      return message.success("배송정보가 등록되었습니다.");
    }
  }, [st_paymentRequestDeliveryDone]);
  useEffect(() => {
    if (st_paymentRequestDeliveryError) {
      return message.error(st_paymentRequestDeliveryError);
    }
  }, [st_paymentRequestDeliveryError]);

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const detailModalToggle = useCallback(
    (data, type) => {
      if (data) {
        setPaymentData(data);
      } else {
        setPaymentData(null);
      }
      if (type === 1) {
        dispatch({
          type: DETAIL_MODAL_TOGGLE,
        });
      } else {
        dispatch({
          type: USER_DETAIL_MODAL_TOGGLE,
        });
      }
    },
    [detailModal, paymentData, userDetailModal]
  );

  const deliveryModalToggle = useCallback(
    (data) => {
      if (data) {
        setDeliveryData(data);
      } else {
        setDeliveryData(null);
        deliveryForm.resetFields();
      }

      dispatch({
        type: DELIVERY_MODAL_TOGGLE,
      });
    },
    [deliveryModal, deliveryData]
  );

  ////// HANDLER //////

  const deliveryOnFill = useCallback(
    (data) => {
      deliveryFormRef.current.setFieldsValue({
        deliveryNo: data.deliveryNo,
        deliveryCompany: data.deliveryCompany,
      });
    },
    [deliveryFormRef]
  );

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

  const onComplete = useCallback((data) => {
    dispatch({
      type: PAYMENTREQUEST_COMPLETE_REQUEST,
      data: {
        paymentId: parseInt(data),
      },
    });
  }, []);

  const onDeliverySubmit = useCallback(
    (data) => {
      dispatch({
        type: PAYMENTREQUEST_DELIVERY_REQUEST,
        data: {
          paymentId: deliveryData.id,
          deliveryNo: data.deliveryNo,
          deliveryCompany: data.deliveryCompany,
        },
      });
    },
    [deliveryData]
  );

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "주문일",
      dataIndex: "orderAt",
    },
    {
      title: "주문자",
      dataIndex: "username",
    },
    {
      title: "주문자 상세정보",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자 상세정보
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
      title: "주문상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
      ),
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
      title: "배송회사등록",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => deliveryModalToggle(data)}
        >
          배송회사등록
        </Button>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];
  const completeColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "처리일",
      dataIndex: "completedAt",
    },
    {
      title: "주문자",
      dataIndex: "username",
    },
    {
      title: "주문자 상세정보",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자 상세정보
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
      title: "주문상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
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
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <Wrapper dr={`row`} ju={`flex-start`}>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={searchTab === 1 && `primary`}
                onClick={() => tabChangeHandler(1)}
              >
                1주일
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={searchTab === 2 && `primary`}
                onClick={() => tabChangeHandler(2)}
              >
                1개월
              </AdminButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isComplete === 1 && `primary`}
                onClick={() => completeChangeHandler(1)}
              >
                미처리
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
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
          columns={
            isComplete === 2 || isComplete === 3 ? completeColumns : columns
          }
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
        title="주문자상세"
        visible={userDetailModal}
        footer={null}
        width={`650px`}
        onCancel={() => detailModalToggle(null, 2)}
      >
        <Wrapper border={`1px solid ${Theme.black_C}`}>
          <Wrapper dr={`row`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문자
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.username}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              닉네임
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.nickname}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              이메일
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.email}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              전화번호
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.mobile}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              회사이름
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.companyName}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              사업자번호
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.companyNo}
            </Text>
          </Wrapper>
        </Wrapper>
      </Modal>

      {/* PAYMENT DETAIL MODAL */}

      <Modal
        title="주문상세"
        visible={detailModal}
        onCancel={() => detailModalToggle(null, 1)}
        footer={null}
        width={`650px`}
      >
        <Wrapper border={`1px solid ${Theme.black_C}`}>
          <Wrapper dr={`row`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문자
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {paymentData && paymentData.username}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문일
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.orderAt}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              가격
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.payment}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              종류
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.typeVolumn}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              포장
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.packVolumn}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              단위
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.unitVolumn}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              추가요구사항
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.otherVolumn
                ? paymentData.otherVolumn
                : "추가요구사항이 없습니다."}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              배송회사
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.deliveryCompany
                ? paymentData.deliveryCompany
                : "배송회사가 등록되어있지 않습니다."}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              운송장번호
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {paymentData && paymentData.deliveryNo
                ? paymentData.deliveryNo
                : "운송장번호가 등록되어있지 않습니다."}
            </Text>
          </Wrapper>
        </Wrapper>
      </Modal>

      <Modal
        title="배송회사등록"
        visible={deliveryModal}
        onCancel={() => deliveryModalToggle(null)}
        footer={null}
        width={`600px`}
      >
        <Form
          form={deliveryForm}
          ref={deliveryFormRef}
          onFinish={onDeliverySubmit}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="운송장번호"
            name="deliveryNo"
            rules={[{ required: true, message: "운송장번호를 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="배송회사"
            name="deliveryCompany"
            rules={[{ required: true, message: "배송회사를 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
          <Wrapper dr={`row`} ju={`flex-end`}>
            <AdminButton size="small" onClick={() => deliveryModalToggle(null)}>
              취소
            </AdminButton>
            <AdminButton size="small" type="primary" htmlType="submit">
              등록
            </AdminButton>
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
