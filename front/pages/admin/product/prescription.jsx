import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  Select,
  notification,
  message,
  Form,
  Input,
  Image,
} from "antd";

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
import { LOAD_MY_INFO_REQUEST, USERLIST_REQUEST } from "../../../reducers/user";
import { PRODUCT_LIST_REQUEST } from "../../../reducers/prescription";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.prescription);

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

  const allSearchHandler = useCallback((v) => {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
      data: { title: false },
    });
  }, []);

  const searchHandler = useCallback((v) => {
    dispatch({
      type: PRODUCT_LIST_REQUEST,
      data: { title: v.searchTitle },
    });
  }, []);

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "대표 이미지",
      render: (data) => (
        <Image src={data.imageURL1} width="150px" height="100px" />
      ),
    },

    {
      title: "상품명",
      dataIndex: "title",
    },

    {
      title: "상품가격",
      dataIndex: "viewPrice",
    },

    {
      title: "선택종류",
      render: () => (
        <Button size="small" type="primary">
          종류 설정
        </Button>
      ),
    },

    {
      title: "선택포장",
      render: () => (
        <Button size="small" type="primary">
          포장 설정
        </Button>
      ),
    },

    {
      title: "선택단위",
      render: () => (
        <Button size="small" type="primary">
          단위 설정
        </Button>
      ),
    },

    {
      title: "생성일",
      dataIndex: "createdAt",
    },

    {
      title: "삭제",
      render: () => (
        <Button type="danger" size="small">
          상품삭제
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["상품 관리", "약속처방 상품 관리"]}
        title={`약속처방 상품관리`}
        subTitle={`약속처방에서 판매되는 상품을 관리하는 전산시스템 입니다.`}
      />

      <AdminContent>
        <SearchForm layout="inline" onFinish={searchHandler}>
          <SearchFormItem label="상품명" name="searchTitle">
            <Input type="text" size="small" style={{ width: "220px" }} />
          </SearchFormItem>

          <SearchFormItem>
            <Button size="small" type="primary" htmlType="submit">
              검색
            </Button>
          </SearchFormItem>
        </SearchForm>

        <Wrapper margin="0px 0px 20px 0px" dr="row" ju="flex-end">
          <ModalBtn type="dashed" size="small" onClick={allSearchHandler}>
            전체조회
          </ModalBtn>
          <ModalBtn type="danger" size="small">
            주의사항
          </ModalBtn>
          <ModalBtn type="primary" size="small">
            + 추가
          </ModalBtn>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
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

    context.store.dispatch({
      type: PRODUCT_LIST_REQUEST,
      data: { title: false },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
