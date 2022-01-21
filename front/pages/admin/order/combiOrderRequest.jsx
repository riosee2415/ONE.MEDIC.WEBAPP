import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Select, notification } from "antd";

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
  Text,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const AdminButton = styled(Button)`
  margin: 0 5px;
`;

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
      title: "주문일",
      dataIndex: "createdAt",
    },

    {
      title: "주문자",
      dataIndex: "createdAt",
    },

    {
      title: "처리현황",
      dataIndex: "createdAt",
    },

    {
      title: "처리일자",
      dataIndex: "createdAt",
    },

    {
      title: "주문상세",
      dataIndex: "createdAt",
    },

    {
      title: "주문서 다운로드",
      dataIndex: "createdAt",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["주문 관리", "탕전처방 주문 관리"]}
        title={`탕전처방 주문 관리`}
        subTitle={`탕전처방 주문을 확인 및 출력할 수 있습니다.`}
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
              <AdminButton style={{ width: `60px` }} size="small">
                1주일
              </AdminButton>
              <AdminButton style={{ width: `60px` }} size="small">
                1개월
              </AdminButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <AdminButton style={{ width: `60px` }} size="small">
                미처리
              </AdminButton>
              <AdminButton style={{ width: `60px` }} size="small">
                처리
              </AdminButton>
            </Wrapper>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <AdminButton size="small" type={`dashed`}>
              전체보기
            </AdminButton>
            <AdminButton type="danger" size="small">
              주의사항
            </AdminButton>
            <AdminButton size="small">전체 주문서 다운로드</AdminButton>
          </Wrapper>
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
