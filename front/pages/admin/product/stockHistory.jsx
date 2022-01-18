import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Select, notification, message } from "antd";
import { useRouter, withRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import wrapper from "../../../store/configureStore";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
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
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  MATERIAL_HISTORY_LIST_REQUEST,
  HISTORY_UNIT_MODAL_TOGGLE,
} from "../../../reducers/material";
import Theme from "../../../components/Theme";

// 주의사항
// 실시간 주문이 발생된 재료의 소진 데이터 입니다.
// 실제와 다를 수 있으니 참고용 데이터로 확인해주세요.
// 재료 사용현황 데이터는 직접 제어할 수 없습니다.

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);
  const { materialsHistory, historyUnitModal } = useSelector(
    (state) => state.material
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

  const [type, setType] = useState(1);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: MATERIAL_HISTORY_LIST_REQUEST,
      data: {
        type,
      },
    });
  }, [type]);

  ////// TOGGLA //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: HISTORY_UNIT_MODAL_TOGGLE,
    });
  }, [historyUnitModal]);
  ////// HANDLER //////

  const typeChangeHandler = useCallback(
    (value) => {
      setType(value);
    },
    [type]
  );

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "재료이름",
      dataIndex: "materialName",
    },
    {
      title: "사용수량",
      dataIndex: "useQnt",
      render: (data) => `${data}`,
    },
    {
      title: "사용일",
      dataIndex: "useAt",
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
        <Text fontSize={`14px`} color={Theme.red_C} isImpo={true}>
          1개월 이후의 데이터를 보고싶으시면 개발사에 문의해주세요.
        </Text>
        <Wrapper margin="0px 0px 20px 0px" dr="row" ju={`space-between`}>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <ModalBtn
              type={type === 1 && "primary"}
              size="small"
              onClick={() => typeChangeHandler(1)}
            >
              1주일
            </ModalBtn>
            <ModalBtn
              type={type === 2 && "primary"}
              size="small"
              onClick={() => typeChangeHandler(2)}
            >
              1개월
            </ModalBtn>
          </Wrapper>

          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <ModalBtn
              type={type === 3 ? `primary` : "dashed"}
              size="small"
              onClick={() => typeChangeHandler(3)}
            >
              전체조회
            </ModalBtn>
            <ModalBtn type="danger" size="small" onClick={unitModalToggle}>
              주의사항
            </ModalBtn>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={materialsHistory ? materialsHistory : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={historyUnitModal}
        width="900px"
        footer={null}
        onCancel={unitModalToggle}
        title="주의사항"
      >
        <GuideUl>
          <GuideLi></GuideLi>
          <GuideLi isImpo={true}></GuideLi>
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
      type: MATERIAL_HISTORY_LIST_REQUEST,
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

export default withRouter(UserDeliAddress);
