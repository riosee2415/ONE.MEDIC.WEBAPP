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
  Input,
  Popconfirm,
  Form,
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
import {
  SEARCH_RECIPE_CREATE_REQUEST,
  SEARCH_RECIPE_LIST_REQUEST,
  SEARCH_RECIPE_MODAL_TOGGLE,
} from "../../../reducers/search";

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

  const {
    searchRecipe,
    recipeModal,
    // RECIPE CREATE
    st_searchRecipeCreateLoading,
    st_searchRecipeCreateDone,
    st_searchRecipeCreateError,
  } = useSelector((state) => state.search);

  ////// HOOKS //////
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const [recipeForm] = Form.useForm();

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: SEARCH_RECIPE_LIST_REQUEST,
      data: {
        search: searchInput ? searchInput : "",
      },
    });
  }, [router.query, searchInput]);

  useEffect(() => {
    if (updateData) {
      recipeForm.setFieldsValue({
        name: updateData.name,
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (st_searchRecipeCreateDone) {
      dispatch({
        type: SEARCH_RECIPE_LIST_REQUEST,
        data: {
          search: "",
        },
      });

      recipeModalToggle(null);

      return message.success("레시피가 추가되었습니다.");
    }
  }, [st_searchRecipeCreateDone]);

  useEffect(() => {
    if (st_searchRecipeCreateError) {
      return message.error(st_searchRecipeCreateError);
    }
  }, [st_searchRecipeCreateError]);

  ////// TOGGLE //////
  const recipeModalToggle = useCallback(
    (data) => () => {
      if (data) {
        setUpdateData(data);
      } else {
        setUpdateData(null);
      }

      recipeForm.resetFields();

      dispatch({
        type: SEARCH_RECIPE_MODAL_TOGGLE,
      });
    },
    [updateData]
  );

  ////// HANDLER //////

  const searchInputHandler = useCallback(
    (data) => {
      setSearchInput(data.search);
    },
    [searchInput]
  );

  const recipeCreateHanlder = useCallback((data) => {
    dispatch({
      type: SEARCH_RECIPE_CREATE_REQUEST,
      data: {
        name: data.name,
      },
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
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "레시피 재료추가",
      render: (data) => <Button size="small">레시피 재료추가</Button>,
    },
    {
      title: "레시피상세 정보",
      render: (data) => (
        <Button size="small" type="primary">
          레시피 상세정보
        </Button>
      ),
    },
    {
      title: "레시피삭제",
      render: (data) => (
        <Popconfirm>
          <Button size="small" type="danger">
            레시피삭제
          </Button>
        </Popconfirm>
      ),
    },

    {
      title: "생성일",
      dataIndex: "createdAt",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["상품 관리", "탕전처방 레시피 관리"]}
        title={`탕전처방 레시피 관리`}
        subTitle={`탕전처방에 검색되는 레시피를 관리할 수 있습니다.`}
      />

      <AdminContent>
        <SearchForm layout="inline" onFinish={searchInputHandler}>
          <SearchFormItem label="레시피이름" name="search">
            <Input size="small" />
          </SearchFormItem>

          <SearchFormItem>
            <Button size="small" type="primary" htmlType="submit">
              검색
            </Button>
          </SearchFormItem>
        </SearchForm>

        <Wrapper margin="0px 0px 20px 0px" dr="row" ju="flex-end">
          <ModalBtn type="dashed" size="small">
            전체조회
          </ModalBtn>
          <ModalBtn type="danger" size="small">
            주의사항
          </ModalBtn>
          <ModalBtn
            type="primary"
            size="small"
            onClick={recipeModalToggle(null)}
            loading={st_searchRecipeCreateLoading}
          >
            + 추가
          </ModalBtn>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={searchRecipe ? searchRecipe : []}
          size="small"
        />
      </AdminContent>

      {/* CREATE . UPDATE MODAL */}
      <Modal
        title={updateData ? "레시피 수정" : "레시피 추가"}
        width={`600px`}
        visible={recipeModal}
        footer={null}
        onCancel={recipeModalToggle(null)}
      >
        <Form form={recipeForm} onFinish={recipeCreateHanlder}>
          <Form.Item
            label="레시피이름"
            name="name"
            rules={[{ required: true, message: "레시피이름을 입력해주세요." }]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <ModalBtn size="small" onClick={recipeModalToggle(null)}>
              취소
            </ModalBtn>
            <ModalBtn size="small" type="primary" htmlType="submit">
              {updateData ? "수정" : "추가"}
            </ModalBtn>
          </Wrapper>
        </Form>
      </Modal>

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
