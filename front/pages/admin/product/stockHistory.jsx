import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Select, notification, message } from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  AdminContent,
  SearchForm,
  SearchFormItem,
  ModalBtn,
  GuideUl,
  GuideLi,
} from "../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

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

  ////// USEEFFECT //////

  ////// HANDLER //////

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "생성일",
      dataIndex: "createdAt",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["상품 관리", "재료 사용현황"]}
        title={`재료 사용현황`}
        subTitle={`주문에 의해 사용된 재료들이 기록되며 데이터를 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper margin="0px 0px 20px 0px" dr="row" ju="flex-end">
          <ModalBtn type="dashed" size="small">
            전체조회
          </ModalBtn>
          <ModalBtn type="danger" size="small">
            주의사항
          </ModalBtn>
          <ModalBtn type="primary" size="small">
            + 추가
          </ModalBtn>
        </Wrapper>

        <Table rowKey="id" columns={columns} dataSource={[]} size="small" />
      </AdminContent>

      <Modal
        visible={false}
        width="900px"
        onOk={() => {}}
        onCancel={() => {}}
        title="주의사항"
      >
        <GuideUl>
          <GuideLi>asdfasdf</GuideLi>
          <GuideLi isImpo={true}>asdfasdf</GuideLi>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
