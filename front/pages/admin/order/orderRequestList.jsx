import { Button, Modal, Table, Input, Form, Empty } from "antd";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, withRouter } from "next/router";
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
  const { paymentRequest, detailModal, unitModal, userDetailModal } =
    useSelector((state) => state.paymentRequest);
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
      },
    });
  }, [searchTab]);

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
    },
    [searchTab]
  );

  const onFill = useCallback(
    (data) => {
      payFormRef.current.setFieldsValue({
        totalPayment: data.totalPayment,
        chup: data.chup,
        pack: data.pack,
        packVolumn: data.packVolumn,
        totalVolumn: data.totalVolumn,
        orderAt: data.orderAt,
        materialName: data.materialName,
        materialPrice: data.materialPrice,
      });
    },
    [payFormRef]
  );

  const onUserFill = useCallback(
    (data) => {
      userFormRef.current.setFieldsValue({
        questUserName: data.questUserName,
        questUserNickName: data.questUserNickName,
        questUserEmail: data.questUserEmail,
        questUserMobile: data.questUserMobile,
      });
    },
    [payFormRef]
  );

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "회원",
      dataIndex: "questUserName",
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
      title: "첩",
      dataIndex: "chup",
    },
    {
      title: "팩",
      dataIndex: "pack",
    },
    {
      title: "팩 용량",
      dataIndex: "packVolumn",
    },
    {
      title: "전체 용량",
      dataIndex: `totalVolumn`,
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
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["주문 관리", "주문 요청 관리"]}
        title={`주문 요청 관리`}
        subTitle={`탕전처방에서 판매된 주문을 관리하는 시스템 입니다.`}
      />
      <AdminContent>
        <Text fontSize={`14px`} color={Theme.red_C} isImpo={true}>
          1개월 이후의 데이터를 보고싶으시면 개발사에 문의해주세요.
        </Text>
        <Wrapper dr={`row`} ju={`space-between`} margin={`0 0 10px`}>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
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
          <GuideLi></GuideLi>
        </GuideUl>
      </Modal>

      {/* USER DETAIL MODAL */}

      <Modal
        title="회원 상세보기"
        visible={userDetailModal}
        footer={null}
        onCancel={() => detailMdoalToggle(null)}
      >
        <Form
          form={userForm}
          ref={userFormRef}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item label="회원이름" name="questUserName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="닉네임" name="questUserNickName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="이메일" name="questUserEmail">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="전화번호" name="questUserMobile">
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
          <Form.Item name="totalPayment" label="총 가격">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="chup" label="첩 수">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="pack" label="팩 수">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="packVolumn" label="팩 용량">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="totalVolumn" label="총 용량">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="orderAt" label="주문일">
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
        type: 3,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default OrderRequestList;
