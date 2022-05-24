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
  Text,
} from "../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST, USERLIST_REQUEST } from "../../../reducers/user";
import {
  SEARCH_MATERIAL_CREATE_REQUEST,
  SEARCH_MATERIAL_DELETE_REQUEST,
  SEARCH_MATERIAL_LIST_REQUEST,
  SEARCH_MATERIAL_MODAL_TOGGLE,
  SEARCH_RECIPE_CREATE_REQUEST,
  SEARCH_RECIPE_DELETE_REQUEST,
  SEARCH_RECIPE_LIST_REQUEST,
  SEARCH_RECIPE_MODAL_TOGGLE,
  SEARCH_RECIPE_UPDATE_REQUEST,
} from "../../../reducers/search";
import { MATERIAL_LIST_REQUEST } from "../../../reducers/material";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const CustomInputGroup = styled(Input.Group)`
  width: 100%;
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

  const {
    searchRecipe,
    searchMaterial,
    // MODAL
    recipeModal,
    materialModal,
    // RECIPE CREATE
    st_searchRecipeCreateLoading,
    st_searchRecipeCreateDone,
    st_searchRecipeCreateError,
    // RECIPE UPDATE
    st_searchRecipeUpdateLoading,
    st_searchRecipeUpdateDone,
    st_searchRecipeUpdateError,
    // RECIPE DELETE
    st_searchRecipeDeleteLoading,
    st_searchRecipeDeleteDone,
    st_searchRecipeDeleteError,
    // MATERIAL CREATE
    st_searchMaterialCreateLoading,
    st_searchMaterialCreateDone,
    st_searchMaterialCreateError,
    // MATERIAL DELETE
    st_searchMaterialDeleteLoading,
    st_searchMaterialDeleteDone,
    st_searchMaterialDeleteError,
  } = useSelector((state) => state.search);

  const { materials } = useSelector((state) => state.material);

  ////// HOOKS //////
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [materialData, setMaterialData] = useState(null);

  const [recipeForm] = Form.useForm();
  const [materialForm] = Form.useForm();

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
    if (materialData) {
      dispatch({
        type: SEARCH_MATERIAL_LIST_REQUEST,
        data: {
          recipeId: materialData.id,
        },
      });
    }
  }, [materialData]);

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

  useEffect(() => {
    if (st_searchRecipeUpdateDone) {
      dispatch({
        type: SEARCH_RECIPE_LIST_REQUEST,
        data: {
          search: "",
        },
      });

      recipeModalToggle(null);

      return message.success("레시피가 수정되었습니다.");
    }
  }, [st_searchRecipeUpdateDone]);

  useEffect(() => {
    if (st_searchRecipeUpdateError) {
      return message.error(st_searchRecipeUpdateError);
    }
  }, [st_searchRecipeUpdateError]);

  useEffect(() => {
    if (st_searchRecipeDeleteDone) {
      dispatch({
        type: SEARCH_RECIPE_LIST_REQUEST,
        data: {
          search: "",
        },
      });

      return message.success("레시피가 삭제되었습니다.");
    }
  }, [st_searchRecipeDeleteDone]);

  useEffect(() => {
    if (st_searchRecipeDeleteError) {
      return message.error(st_searchRecipeDeleteError);
    }
  }, [st_searchRecipeDeleteError]);

  useEffect(() => {
    if (st_searchMaterialCreateDone) {
      dispatch({
        type: SEARCH_MATERIAL_LIST_REQUEST,
        data: {
          recipeId: materialData.id,
        },
      });

      materialForm.resetFields();

      return message.success("레시피에 재료가 추가되었습니다.");
    }
  }, [st_searchMaterialCreateDone]);

  useEffect(() => {
    if (st_searchMaterialCreateError) {
      return message.error(st_searchMaterialCreateError);
    }
  }, [st_searchMaterialCreateError]);

  useEffect(() => {
    if (st_searchMaterialDeleteDone) {
      dispatch({
        type: SEARCH_MATERIAL_LIST_REQUEST,
        data: {
          recipeId: materialData.id,
        },
      });

      return message.success("레시피에 재료가 삭제되었습니다.");
    }
  }, [st_searchMaterialDeleteDone]);

  useEffect(() => {
    if (st_searchMaterialDeleteError) {
      return message.error(st_searchMaterialDeleteError);
    }
  }, [st_searchMaterialDeleteError]);

  ////// TOGGLE //////
  const recipeModalToggle = useCallback(
    (data) => {
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
    [updateData, recipeModal]
  );

  const materialModalToggle = useCallback(
    (data) => {
      if (data) {
        setMaterialData(data);
      } else {
        setMaterialData(null);
      }

      materialForm.resetFields();

      dispatch({
        type: SEARCH_MATERIAL_MODAL_TOGGLE,
      });
    },
    [materialData, materialModal]
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

  const recipeUpdateHanlder = useCallback(
    (data) => {
      dispatch({
        type: SEARCH_RECIPE_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          name: data.name,
        },
      });
    },
    [updateData]
  );

  const recipeDeleteHanlder = useCallback((data) => {
    dispatch({
      type: SEARCH_RECIPE_DELETE_REQUEST,
      data: {
        recipeId: data.id,
      },
    });
  }, []);

  const materialCreateHandler = useCallback(
    (data) => {
      dispatch({
        type: SEARCH_MATERIAL_CREATE_REQUEST,
        data: {
          qnt: data.qnt,
          unit: data.unit,
          materialId: data.materialId,
          searchRecipeId: materialData.id,
        },
      });
    },
    [materialData]
  );

  const materialDeleteHandler = useCallback((data) => {
    dispatch({
      type: SEARCH_MATERIAL_DELETE_REQUEST,
      data: {
        materialId: data.id,
      },
    });
  }, []);

  const materialSelectHandler = useCallback((data) => {
    const objectData = JSON.parse(data);

    materialForm.setFieldsValue({
      unit: objectData.unit,
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
      title: "레시피재료 관리",
      render: (data) => (
        <Button size="small" onClick={() => materialModalToggle(data)}>
          레시피재료 관리
        </Button>
      ),
    },

    {
      title: "레시피상세 정보",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => recipeModalToggle(data)}
          loading={st_searchRecipeUpdateLoading}
        >
          레시피 상세정보
        </Button>
      ),
    },

    {
      title: "레시피삭제",
      render: (data) => (
        <Popconfirm
          title="레시피를 삭제하시겠습니까?"
          okText="삭제"
          cancelText="취소"
          onConfirm={() => recipeDeleteHanlder(data)}
        >
          <Button
            size="small"
            type="danger"
            loading={st_searchRecipeDeleteLoading}
          >
            레시피삭제
          </Button>
        </Popconfirm>
      ),
    },

    {
      title: "생성일",
      render: (data) => data.createdAt.split("T")[0],
    },
  ];

  const column = [
    {
      title: "이름",
      render: (data) => data.Material.name,
    },
    {
      title: "사용재고",
      dataIndex: "qnt",
    },
    {
      title: "단위",
      dataIndex: "unit",
    },
    {
      title: "재료삭제",
      render: (data) => (
        <Popconfirm
          title="재료를 삭제하시겠습니까?"
          okText="삭제"
          cancelText="취소"
          onConfirm={() => materialDeleteHandler(data)}
        >
          <Button
            size="small"
            type="danger"
            loading={st_searchMaterialDeleteLoading}
          >
            재료삭제
          </Button>
        </Popconfirm>
      ),
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
            onClick={() => recipeModalToggle(null)}
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

      {/* RECIPE CREATE . UPDATE MODAL */}
      <Modal
        title={updateData ? "레시피 수정" : "레시피 추가"}
        width={`600px`}
        visible={recipeModal}
        footer={null}
        onCancel={() => recipeModalToggle(null)}
      >
        <Form
          form={recipeForm}
          onFinish={updateData ? recipeUpdateHanlder : recipeCreateHanlder}
        >
          <Form.Item
            label="레시피이름"
            name="name"
            rules={[{ required: true, message: "레시피이름을 입력해주세요." }]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <ModalBtn size="small" type="primary" htmlType="submit">
              {updateData ? "수정" : "추가"}
            </ModalBtn>
          </Wrapper>
        </Form>
      </Modal>

      {/* MATERAIL CREATE . UPDATE MODAL */}
      <Modal
        title="레시피재료 관리"
        width={`800px`}
        visible={materialModal}
        onCancel={() => materialModalToggle(null)}
        footer={null}
      >
        <GuideUl>
          <GuideLi isImpo={true}>사용재고는 숫자만 입력해주세요.</GuideLi>
          {/* <GuideLi isImpo={true}>
            단위는 g, kg, ml 등과 유사한 단위를 입력해주세요.
          </GuideLi> */}
        </GuideUl>
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          form={materialForm}
          onFinish={materialCreateHandler}
        >
          <Form.Item
            label="재료"
            name="materialId"
            rules={[{ required: true, message: "재료를 선택해주세요." }]}
          >
            <Select onChange={materialSelectHandler}>
              {materials &&
                materials.map((data) => (
                  <Select.Option value={JSON.stringify(data)}>
                    {data.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="사용재고"
            name="qnt"
            rules={[{ required: true, message: "사용재고를 입력해주세요." }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="단위"
            name="unit"
            rules={[{ required: true, message: "단위를 입력해주세요." }]}
          >
            <Input readOnly />
          </Form.Item>

          <Wrapper al={`flex-end`} margin={`0 0 50px`}>
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={st_searchMaterialCreateLoading}
            >
              + 재료추가
            </Button>
          </Wrapper>
        </Form>

        <Table
          rowKey={"id"}
          size="small"
          columns={column}
          dataSource={searchMaterial ? searchMaterial : []}
        />
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

    context.store.dispatch({
      type: MATERIAL_LIST_REQUEST,
      data: {
        name: "",
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
