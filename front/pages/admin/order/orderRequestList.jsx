import { Button, Modal, Table, Input } from "antd";
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
import {
  AdminContent,
  GuideUl,
  GuideLi,
  Text,
  Wrapper,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import { useState } from "react";

const AdminButton = styled(Button)`
  margin: 0 5px;
`;

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

  ////// HOOKS //////

  const dispatch = useDispatch();

  const [searchTab, setSearchTab] = useState(1);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: PAYMENTREQUEST_LIST_REQUEST,
      data: {
        type: searchTab,
      },
    });
  }, [searchTab]);

  ////// HANDLER //////

  const tabChangeHandler = useCallback(
    (tab) => {
      setSearchTab(tab);
    },
    [searchTab]
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
        <Button type="primary" size="small">
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
        <Button type="primary" size="small">
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
            <AdminButton type="danger" size="small">
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

      <Modal visible={detailModal}>
        <GuideUl>
          <GuideLi></GuideLi>
        </GuideUl>
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
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default OrderRequestList;
