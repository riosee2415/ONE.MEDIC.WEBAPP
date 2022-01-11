import React, { useCallback, useEffect } from "react";
import { Button, Table } from "antd";
import styled from "styled-components";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../../store/configureStore";
import {
  LOAD_MY_INFO_REQUEST,
  COMPANY_LIST_REQUEST,
} from "../../../reducers/user";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import { Wrapper } from "../../../components/commonComponents";

const AdminContent = styled.div`
  padding: 20px;
`;

const CompanyUserList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone, companyUserLists } = useSelector(
    (state) => state.user
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
      title: "회원이름",
      dataIndex: "username",
    },
    {
      title: "이메일",
      dataIndex: "email",
    },
    {
      title: "전화번호",
      dataIndex: "mobile",
    },
    {
      title: "회사이름",
      dataIndex: "companyName",
    },
    {
      title: "사업자번호",
      dataIndex: "companyNo",
    },
    {
      title: "운영레벨",
      dataIndex: "operatorLevel",
    },
    {
      title: "운영레벨변경",
      render: (data) => (
        <Button size="small" type="primary">
          운영레벨변경
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "회사 회원 리스트"]}
        title={`회사 회원 리스트`}
        subTitle={`회사 승인되 회원의 리스트를 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-end`} margin={`0 0 10px`}>
          <Button size="small" type="danger">
            주의사항
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={companyUserLists ? companyUserLists : []}
        />
      </AdminContent>
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
      type: COMPANY_LIST_REQUEST,
      data: {
        type: 2,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default CompanyUserList;
