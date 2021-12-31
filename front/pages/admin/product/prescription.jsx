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
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_TYPE_ADD_REQUEST,
  GUIDE_MODAL_TOGGLE,
  TYPE_MODAL_TOGGLE,
  PACK_MODAL_TOGGLE,
  UNIT_MODAL_TOGGLE,
} from "../../../reducers/prescription";

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);
  const {
    products,
    typeList,
    guideModal,
    typeModal,
    packModal,
    unitModal,
    st_productTypeAddDone,
    st_productTypeAddError,
  } = useSelector((state) => state.prescription);

  const router = useRouter();
  const [typeCreateForm] = Form.useForm();

  const [currentId, setCurrentId] = useState(null);

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

  useEffect(() => {
    if (st_productTypeAddDone) {
      message.success("정상적으로 등록되었습니다.");
      dispatch({
        type: PRODUCT_TYPE_LIST_REQUEST,
        data: { id: currentId },
      });

      typeCreateForm.resetFields();
    }
  }, [st_productTypeAddDone]);

  ////// HANDLER //////

  const typeCreateFormHandler = useCallback(
    (data) => {
      dispatch({
        type: PRODUCT_TYPE_ADD_REQUEST,
        data: {
          prescriptionId: currentId,
          name: data.name,
          addPrice: data.addPrice,
        },
      });
    },
    [currentId]
  );

  const guideModalToggle = useCallback(() => {
    dispatch({
      type: GUIDE_MODAL_TOGGLE,
    });
  }, [guideModal]);

  const typeModalToggle = useCallback(
    (id = null) => {
      if (id) {
        setCurrentId(id);
        dispatch({
          type: PRODUCT_TYPE_LIST_REQUEST,
          data: { id },
        });
      }

      typeCreateForm.resetFields();
      dispatch({
        type: TYPE_MODAL_TOGGLE,
      });
    },
    [typeModal]
  );

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
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => typeModalToggle(data.id)}
        >
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
      title: "상세정보",
      render: () => (
        <Button type="primary" size="small">
          상품상세 정보
        </Button>
      ),
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

  const columnsType = [
    {
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "추가금액",
      dataIndex: "viewAddPrice",
    },

    {
      title: "삭제",
      render: (data) => (
        <Button type="danger" size="small">
          삭제
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
          <ModalBtn type="danger" size="small" onClick={guideModalToggle}>
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

      {/* GUIDE MODAL */}
      <Modal
        visible={guideModal}
        width="900px"
        onOk={guideModalToggle}
        onCancel={guideModalToggle}
        title="주의사항"
        footer={null}
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            삭제된 상품은 다시 복구할 수 없습니다. 신중한 작업을 필요로 합니다.
          </GuideLi>
          <GuideLi>
            이미지는 최대 4개 까지 등록이 가능합니다. 이미지 비율은 3:2 비율로
            등록해야 합니다.
          </GuideLi>
          <GuideLi>
            이미지 비율이 상이할 경우 화면에 이미지가 정상적으로 보이지 않을 수
            있습니다.
          </GuideLi>
          <GuideLi>
            문의가 필요한 경우 (주)4LEAF SOFTWARE 1600-4198로 연락부탁드립니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* TYPE MODAL */}
      <Modal
        visible={typeModal}
        width="600px"
        onOk={() => typeModalToggle(null)}
        onCancel={() => typeModalToggle(null)}
        title="상품 종류설정"
        footer={null}
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            결제금액의 소급적용을 방지하기 위해 데이터 수정은 불가능 합니다.
          </GuideLi>
          <GuideLi>
            이름을 기준으로 정렬됩니다. 구매자 화면에도 같은 순서로 보여지게
            됩니다.
          </GuideLi>
        </GuideUl>

        <Form
          form={typeCreateForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 6 }}
          layout="inline"
          onFinish={typeCreateFormHandler}
        >
          <Form.Item
            label="종류명"
            rules={[{ required: true, message: "필수 입력사항 입니다." }]}
            name="name"
          >
            <Input size="small" style={{ width: "140px" }} />
          </Form.Item>

          <Form.Item
            label="금액"
            rules={[{ required: true, message: "필수 입력사항 입니다." }]}
            name="addPrice"
          >
            <Input
              type="number"
              size="small"
              style={{ width: "140px" }}
              rules={[{ required: true }]}
            />
          </Form.Item>

          <Form.Item>
            <Button size="small" type="primary" htmlType="submit">
              등록
            </Button>
          </Form.Item>
        </Form>
        <br />
        {/*  */}
        <Table
          rowKey="id"
          columns={columnsType}
          dataSource={typeList}
          size="small"
        />
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
