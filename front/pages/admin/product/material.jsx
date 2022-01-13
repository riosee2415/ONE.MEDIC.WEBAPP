import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, withRouter } from "next/router";
import { END } from "redux-saga";
import axios from "axios";

import wrapper from "../../../store/configureStore";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import AdminLayout from "../../../components/AdminLayout";
import {
  AdminContent,
  Wrapper,
  SearchForm,
  SearchFormItem,
} from "../../../components/commonComponents";
import PageHeader from "../../../components/admin/PageHeader";

const Material = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);

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
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "상품",
      dataIndex: "price",
    },
    {
      title: "개수",
      dataIndex: "stock",
    },
    {
      title: "단위",
      dataIndex: "unit",
    },
    {
      title: "수정",
      render: (data) => (
        <Button size="small" type="primary">
          수정
        </Button>
      ),
    },
    {
      title: "삭제",
      render: (data) => (
        <Button size="small" type="danger">
          삭제
        </Button>
      ),
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["상품 관리", "탕전처방 재료 관리"]}
        title={`탕전처방 재료 관리`}
        subTitle={`탕전처방에서 판매되는 재료을 관리하는 전산시스템 입니다.`}
      />

      <AdminContent>
        <SearchForm layout="inline">
          <SearchFormItem label="재료명" name="searchName">
            <Input type="text" size="small" style={{ width: "220px" }} />
          </SearchFormItem>

          <SearchFormItem>
            <Button size="small" type="primary" htmlType="submit">
              검색
            </Button>
          </SearchFormItem>
        </SearchForm>
        <Wrapper dr={`row`} ju={`flex-end`}>
          <Button size="small" type="dashed">
            전체조회
          </Button>
          <Button size="small" style={{ margin: `0 5px` }} type="danger">
            주의사항
          </Button>
          <Button size="small" type="primary">
            추가
          </Button>
        </Wrapper>
        <Table columns={columns} />
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(Material);
