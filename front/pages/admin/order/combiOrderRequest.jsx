import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Select, notification, Popconfirm } from "antd";

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
import { PPR_LIST_REQUEST } from "../../../reducers/prescriptionPaymentRequest";

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
  const { pprs } = useSelector((state) => state.prescriptionPaymentRequest);

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
  const [isCondition, setIsCondition] = useState(1);

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: PPR_LIST_REQUEST,
      data: {
        type: searchTab,
        isCondition,
      },
    });
  }, [searchTab, isCondition]);

  ////// HANDLER //////

  const tabChangeHandler = useCallback(
    (tab) => {
      setSearchTab(tab);
      if (tab === 4) {
        setIsCondition(tab);
      }
    },
    [searchTab, isCondition]
  );

  const conditionChangeHandler = useCallback(
    (condition) => {
      setIsCondition(condition);
    },
    [isCondition]
  );

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

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
      title: "주문자상세",
      render: (data) => (
        <Button type="primary" size="small">
          주문자상세
        </Button>
      ),
    },

    // {
    //   title: "처리현황",
    //   dataIndex: "createdAt",
    // },

    // {
    //   title: "처리일자",
    //   dataIndex: "createdAt",
    // },

    {
      title: "주문상세",
      render: (data) => (
        <Button size="small" type="primary">
          주문상세
        </Button>
      ),
    },
    {
      title: "처리완료",
      render: (data) => (
        <Popconfirm
          title="처리완료하시겠습니까?"
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
      title: "거절",
      render: (data) => (
        <Popconfirm
          title="거절하시겠습니까?"
          okText="처리완료"
          cancelText="취소"
        >
          <Button type="danger" size="small">
            거절
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
    {
      title: "배송회사설정",
      render: (data) => (
        <Button type="primary" size="small">
          배송회사설정
        </Button>
      ),
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
                type={isCondition === 1 && `primary`}
                onClick={() => conditionChangeHandler(1)}
              >
                미처리
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isCondition === 2 && `primary`}
                onClick={() => conditionChangeHandler(2)}
              >
                처리
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isCondition === 3 && `primary`}
                onClick={() => conditionChangeHandler(3)}
              >
                거절
              </AdminButton>
            </Wrapper>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <AdminButton
              size="small"
              type={`dashed`}
              onClick={() => tabChangeHandler(4)}
            >
              전체보기
            </AdminButton>
            <AdminButton type="danger" size="small">
              주의사항
            </AdminButton>
            <AdminButton size="small">전체 주문서 다운로드</AdminButton>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={pprs ? pprs : []}
          size="small"
        />
      </AdminContent>

      <Modal
        visible={false}
        width="900px"
        onOk={() => {}}
        onCancel={() => {}}
        title="주의사항"
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
      type: PPR_LIST_REQUEST,
      data: {
        type: 1,
        isCondition: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
