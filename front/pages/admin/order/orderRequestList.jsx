import { Button, Modal, Table } from "antd";
import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, withRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import { PAYMENTREQUEST_LIST_REQUEST } from "../../../reducers/paymentRequest";
import { AdminContent } from "../../../components/commonComponents";

const OrderRequestList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const { paymentRequest, detailModal } = useSelector(
    (state) => state.paymentRequest
  );

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

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
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
        <Button type="primary" size="small">
          상세보기
        </Button>
      ),
    },
    {
      title: "주문일",
      dataIndex: "createdAt",
      render: (data) => data.split("T")[0],
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
        <Table
          columns={columns}
          size="small"
          dataSource={paymentRequest ? paymentRequest : []}
        />
      </AdminContent>

      <Modal></Modal>
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
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default OrderRequestList;
