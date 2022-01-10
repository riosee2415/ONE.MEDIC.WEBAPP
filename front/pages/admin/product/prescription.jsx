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
  Popconfirm,
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
  CREATE_MODAL_TOGGLE,
  PRODUCT_TYPE_DELETE_REQUEST,
  PRODUCT_PACK_LIST_REQUEST,
  PRODUCT_PACK_ADD_REQUEST,
  PRODUCT_PACK_DELETE_REQUEST,
  PRODUCT_UNIT_LIST_REQUEST,
  PRODUCT_UNIT_ADD_REQUEST,
  PRODUCT_UNIT_DELETE_REQUEST,
  PREVIEW_IMAGE_UPLOAD_REQUEST1,
  PREVIEW_IMAGE_UPLOAD_REQUEST2,
  PREVIEW_IMAGE_UPLOAD_REQUEST3,
  PREVIEW_IMAGE_UPLOAD_REQUEST4,
  CLEAR_PREVIEW_IMAGE,
} from "../../../reducers/prescription";

const PreviewImageBox = styled(Image)`
  margin-bottom: 10px;
  object-fit: cover;
`;

const PreviewImageUploadButton = styled(Button)`
  width: 400px;
  margin-top: 5px;
`;

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
    packList,
    unitList,
    guideModal,
    typeModal,
    packModal,
    unitModal,
    createModal,
    previewImage1,
    previewImage2,
    previewImage3,
    previewImage4,
    st_productTypeAddDone,
    st_productTypeDeleteDone,
    st_productPackAddDone,
    st_productPackDeleteDone,
    st_productUnitAddDone,
    st_productUnitDeleteDone,
    st_previewImage1Loading,
    st_previewImage1Done,
    st_previewImage2Loading,
    st_previewImage2Done,
    st_previewImage3Loading,
    st_previewImage3Done,
    st_previewImage4Loading,
    st_previewImage4Done,
  } = useSelector((state) => state.prescription);

  const router = useRouter();
  const [typeCreateForm] = Form.useForm();
  const [packCreateForm] = Form.useForm();
  const [unitCreateForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const previewImageRef1 = useRef();
  const previewImageRef2 = useRef();
  const previewImageRef3 = useRef();
  const previewImageRef4 = useRef();

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

  useEffect(() => {
    if (st_productTypeDeleteDone) {
      message.success("종류가 삭제 되었습니다.");
      dispatch({
        type: PRODUCT_TYPE_LIST_REQUEST,
        data: { id: currentId },
      });

      typeCreateForm.resetFields();
    }
  }, [st_productTypeDeleteDone]);

  useEffect(() => {
    if (st_productPackAddDone) {
      message.success("포장 데이터가 추가 되었습니다.");
      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: { id: currentId },
      });

      packCreateForm.resetFields();
    }
  }, [st_productPackAddDone]);

  useEffect(() => {
    if (st_productUnitAddDone) {
      message.success("단위 데이터가 추가 되었습니다.");
      dispatch({
        type: PRODUCT_UNIT_LIST_REQUEST,
        data: { id: currentId },
      });

      unitCreateForm.resetFields();
    }
  }, [st_productUnitAddDone]);

  useEffect(() => {
    if (st_productPackDeleteDone) {
      message.success("포장 데이터가 삭제 되었습니다.");
      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: { id: currentId },
      });

      packCreateForm.resetFields();
    }
  }, [st_productPackDeleteDone]);

  useEffect(() => {
    if (st_productUnitDeleteDone) {
      message.success("단위 데이터가 삭제 되었습니다.");
      dispatch({
        type: PRODUCT_UNIT_LIST_REQUEST,
        data: { id: currentId },
      });

      unitCreateForm.resetFields();
    }
  }, [st_productUnitDeleteDone]);

  ////// HANDLER //////

  const typeDeleteClickHandler = useCallback((id) => {
    dispatch({
      type: PRODUCT_TYPE_DELETE_REQUEST,
      data: { typeId: id },
    });
  }, []);

  const packDeleteClickHandler = useCallback((id) => {
    dispatch({
      type: PRODUCT_PACK_DELETE_REQUEST,
      data: { typeId: id },
    });
  }, []);

  const unitDeleteClickHandler = useCallback((id) => {
    dispatch({
      type: PRODUCT_UNIT_DELETE_REQUEST,
      data: { typeId: id },
    });
  }, []);

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

  const packCreateFormHandler = useCallback(
    (data) => {
      dispatch({
        type: PRODUCT_PACK_ADD_REQUEST,
        data: {
          prescriptionId: currentId,
          name: data.name,
          addPrice: data.addPrice,
        },
      });
    },
    [currentId]
  );

  const unitCreateFormHandler = useCallback(
    (data) => {
      dispatch({
        type: PRODUCT_UNIT_ADD_REQUEST,
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

  const packModalToggle = useCallback(
    (id = null) => {
      if (id) {
        setCurrentId(id);
      }

      dispatch({
        type: PRODUCT_PACK_LIST_REQUEST,
        data: { id: id },
      });

      packCreateForm.resetFields();
      dispatch({
        type: PACK_MODAL_TOGGLE,
      });
    },
    [packModal]
  );

  const unitModalToggle = useCallback(
    (id = null) => {
      if (id) {
        setCurrentId(id);

        dispatch({
          type: PRODUCT_UNIT_LIST_REQUEST,
          data: { id: id },
        });
      }

      unitCreateForm.resetFields();
      dispatch({
        type: UNIT_MODAL_TOGGLE,
      });
    },
    [unitModal]
  );

  const createModalToggle = useCallback(() => {
    dispatch({
      type: CREATE_MODAL_TOGGLE,
    });

    if (!createModal) {
      dispatch({
        type: CLEAR_PREVIEW_IMAGE,
      });
    }
  }, [createModal]);

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

  ///////////////////////////////////// IMAGE HANDLE ////////////////////////////////////////

  const clickImageUpload1 = useCallback(() => {
    previewImageRef1.current.click();
  }, [previewImageRef1.current]);

  const onChangeImages1 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: PREVIEW_IMAGE_UPLOAD_REQUEST1,
      data: formData,
    });
  });

  const clickImageUpload2 = useCallback(() => {
    previewImageRef2.current.click();
  }, [previewImageRef2.current]);

  const onChangeImages2 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: PREVIEW_IMAGE_UPLOAD_REQUEST2,
      data: formData,
    });
  });

  const clickImageUpload3 = useCallback(() => {
    previewImageRef3.current.click();
  }, [previewImageRef3.current]);

  const onChangeImages3 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: PREVIEW_IMAGE_UPLOAD_REQUEST3,
      data: formData,
    });
  });

  const clickImageUpload4 = useCallback(() => {
    previewImageRef4.current.click();
  }, [previewImageRef4.current]);

  const onChangeImages4 = useCallback((e) => {
    const formData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      formData.append("image", file);
    });

    dispatch({
      type: PREVIEW_IMAGE_UPLOAD_REQUEST4,
      data: formData,
    });
  });

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
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => packModalToggle(data.id)}
        >
          포장 설정
        </Button>
      ),
    },

    {
      title: "선택단위",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => unitModalToggle(data.id)}
        >
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
        <Popconfirm
          placement="top"
          title={"정말 삭제하시겠습니까?"}
          onConfirm={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" size="small">
            상품삭제
          </Button>
        </Popconfirm>
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
        <Popconfirm
          placement="top"
          title={"정말 삭제하시겠습니까?"}
          onConfirm={() => typeDeleteClickHandler(data.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" size="small">
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const columnsPack = [
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
        <Popconfirm
          placement="top"
          title={"정말 삭제하시겠습니까?"}
          onConfirm={() => packDeleteClickHandler(data.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" size="small">
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const columnsUnit = [
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
        <Popconfirm
          placement="top"
          title={"정말 삭제하시겠습니까?"}
          onConfirm={() => unitDeleteClickHandler(data.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" size="small">
            삭제
          </Button>
        </Popconfirm>
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
          <ModalBtn type="primary" size="small" onClick={createModalToggle}>
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

      {/* PACK MODAL */}
      <Modal
        visible={packModal}
        width="600px"
        onOk={() => packModalToggle(null)}
        onCancel={() => packModalToggle(null)}
        title="상품 포장설정"
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
          form={packCreateForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 6 }}
          layout="inline"
          onFinish={packCreateFormHandler}
        >
          <Form.Item
            label="포장명"
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
          columns={columnsPack}
          dataSource={packList}
          size="small"
        />
      </Modal>

      {/* UNIT MODAL */}
      <Modal
        visible={unitModal}
        width="600px"
        onOk={() => unitModalToggle(null)}
        onCancel={() => unitModalToggle(null)}
        title="상품 단위설정"
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
          form={unitCreateForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 6 }}
          layout="inline"
          onFinish={unitCreateFormHandler}
        >
          <Form.Item
            label="포장명"
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
          columns={columnsUnit}
          dataSource={unitList}
          size="small"
        />
      </Modal>

      {/* CREATE MODAL */}
      <Modal
        visible={createModal}
        onCancel={createModalToggle}
        footer={null}
        width="1080px"
        title="새로운 약속처방 등록하기"
      >
        <Wrapper dr="row" margin="0px 0px 15px 0px" ju="space-around">
          <Wrapper width="400px" height="350px">
            <PreviewImageBox
              width="400px"
              height="300px"
              src={
                previewImage1
                  ? previewImage1
                  : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/4LEAFSOFTWARE/assets/images/KakaoTalk_Photo_2022-01-07-12-29-22.png"
              }
            />
            <input
              type="file"
              name="image"
              accept=".png, .jpg"
              // multiple
              hidden
              ref={previewImageRef1}
              onChange={onChangeImages1}
            />
            <PreviewImageUploadButton
              type="primary"
              onClick={clickImageUpload1}
              loading={st_previewImage1Loading}
              size="small"
            >
              상품 이미지 선택
            </PreviewImageUploadButton>
          </Wrapper>
          <Wrapper width="400px" height="350px">
            <PreviewImageBox
              width="400px"
              height="300px"
              src={
                previewImage2
                  ? previewImage2
                  : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/4LEAFSOFTWARE/assets/images/KakaoTalk_Photo_2022-01-07-12-29-22.png"
              }
            />
            <input
              type="file"
              name="image"
              accept=".png, .jpg"
              // multiple
              hidden
              ref={previewImageRef2}
              onChange={onChangeImages2}
            />
            <PreviewImageUploadButton
              type="primary"
              onClick={clickImageUpload2}
              loading={st_previewImage2Loading}
              size="small"
            >
              상품 이미지 선택
            </PreviewImageUploadButton>
          </Wrapper>
        </Wrapper>

        <Wrapper dr="row" margin="0px 0px 15px 0px" ju="space-around">
          <Wrapper width="400px" height="350px">
            <PreviewImageBox
              width="400px"
              height="300px"
              src={
                previewImage3
                  ? previewImage3
                  : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/4LEAFSOFTWARE/assets/images/KakaoTalk_Photo_2022-01-07-12-29-22.png"
              }
            />
            <input
              type="file"
              name="image"
              accept=".png, .jpg"
              // multiple
              hidden
              ref={previewImageRef3}
              onChange={onChangeImages3}
            />
            <PreviewImageUploadButton
              type="primary"
              onClick={clickImageUpload3}
              loading={st_previewImage3Loading}
              size="small"
            >
              상품 이미지 선택
            </PreviewImageUploadButton>
          </Wrapper>
          <Wrapper width="400px" height="350px">
            <PreviewImageBox
              width="400px"
              height="300px"
              src={
                previewImage4
                  ? previewImage4
                  : "https://4leaf-s3.s3.ap-northeast-2.amazonaws.com/4LEAFSOFTWARE/assets/images/KakaoTalk_Photo_2022-01-07-12-29-22.png"
              }
            />
            <input
              type="file"
              name="image"
              accept=".png, .jpg"
              // multiple
              hidden
              ref={previewImageRef4}
              onChange={onChangeImages4}
            />
            <PreviewImageUploadButton
              type="primary"
              onClick={clickImageUpload4}
              loading={st_previewImage4Loading}
              size="small"
            >
              상품 이미지 선택
            </PreviewImageUploadButton>
          </Wrapper>
        </Wrapper>

        <Form
          form={createForm}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <Form.Item
            label="상품명"
            name="title"
            rules={[{ required: true, message: "상품명은 필수 입니다." }]}
          >
            <Input size="small" />
          </Form.Item>

          <Form.Item
            label="상품가격"
            name="price"
            rules={[{ required: true, message: "판매금액은 필수 입니다." }]}
          >
            <Input size="small" type="number" />
          </Form.Item>
        </Form>
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
