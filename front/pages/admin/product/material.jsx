import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table, Input, Modal, Form, Popconfirm, message } from "antd";
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
  GuideUl,
  GuideLi,
  ModalBtn,
  Text,
} from "../../../components/commonComponents";
import PageHeader from "../../../components/admin/PageHeader";
import {
  CU_MODAL_TOGGLE,
  MATERIAL_CREATE_REQUEST,
  MATERIAL_DELETE_REQUEST,
  MATERIAL_LIST_REQUEST,
  MATERIAL_UPDATE_REQUEST,
  UNIT_MODAL_TOGGLE,
} from "../../../reducers/material";

import { numberWithCommas } from "../../../components/commonUtils";
import {
  PP_CREATE_REQUEST,
  PP_GET_REQUEST,
  PP_MODAL_TOGGLE,
  PP_UPDATE_REQUEST,
} from "../../../reducers/prescriptionPrice";

const Material = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const { me, st_loadMyInfoDone } = useSelector((state) => state.user);
  const {
    materials,
    unitModal,
    cuModal,
    //
    st_materialListError,
    //
    st_materialCreateDone,
    st_materialCreateError,
    //
    st_materialUpdateDone,
    st_materialUpdateError,
    //
    st_materialDeleteDone,
    st_materialDeleteError,
  } = useSelector((state) => state.material);
  const {
    price,
    priceModal,
    //
    st_ppGetError,
    //
    st_ppUpdateLoading,
    st_ppUpdateDone,
    st_ppUpdateError,
    //
  } = useSelector((state) => state.prescriptionPrice);

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

  const [updateData, setUpdateData] = useState(null);

  const [priceForm] = Form.useForm();
  const [form] = Form.useForm();
  const formRef = useRef();

  ////// USEEFFECT //////

  useEffect(() => {
    if (updateData) {
      formRef.current.setFieldsValue({
        name: updateData.name,
        price: updateData.originPrice,
        stock: updateData.stock,
        unit: updateData.unit,
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (st_materialListError) {
      return message.error(st_materialListError);
    }
  }, [st_materialListError]);

  useEffect(() => {
    if (st_materialCreateDone) {
      form.resetFields();
      dispatch({
        type: CU_MODAL_TOGGLE,
      });

      dispatch({
        type: MATERIAL_LIST_REQUEST,
        data: {
          name: "",
        },
      });
      return message.success("재료가 추가되었습니다.");
    }
  }, [st_materialCreateDone]);

  useEffect(() => {
    if (st_materialCreateError) {
      return message.error(st_materialCreateError);
    }
  }, [st_materialCreateError]);

  useEffect(() => {
    if (st_materialUpdateDone) {
      form.resetFields();
      dispatch({
        type: CU_MODAL_TOGGLE,
      });

      dispatch({
        type: MATERIAL_LIST_REQUEST,
        data: {
          name: "",
        },
      });
      return message.success("재료가 수정되었습니다.");
    }
  }, [st_materialUpdateDone]);

  useEffect(() => {
    if (st_materialUpdateError) {
      return message.error(st_materialUpdateError);
    }
  }, [st_materialUpdateError]);

  useEffect(() => {
    if (st_materialDeleteDone) {
      dispatch({
        type: MATERIAL_LIST_REQUEST,
        data: {
          name: "",
        },
      });
      return message.success("재료가 삭제되었습니다.");
    }
  }, [st_materialDeleteDone]);

  useEffect(() => {
    if (st_materialDeleteError) {
      return message.error(st_materialDeleteError);
    }
  }, [st_materialDeleteError]);

  useEffect(() => {
    if (st_ppUpdateDone) {
      dispatch({
        type: PP_GET_REQUEST,
      });

      priceModalToggle(null);

      return message.success("가격이 수정되었습니다.");
    }
  }, [st_ppUpdateDone]);

  useEffect(() => {
    if (st_ppUpdateError) {
      return message.error(st_ppUpdateError);
    }
  }, [st_ppUpdateError]);

  useEffect(() => {
    if (st_ppGetError) {
      return message.error(st_ppGetError);
    }
  }, [st_ppGetError]);

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const createModalToggle = useCallback(
    (isToggle) => {
      if (!isToggle) {
        form.resetFields();
      }
      dispatch({
        type: CU_MODAL_TOGGLE,
      });
    },
    [cuModal, form]
  );

  const udpateModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
      } else {
        setUpdateData(null);
        form.resetFields();
      }
      dispatch({
        type: CU_MODAL_TOGGLE,
      });
    },
    [cuModal, updateData, form]
  );

  const priceModalToggle = useCallback(() => {
    priceForm.setFieldsValue({
      pharmacyPrice: price ? price.pharmacyPrice : 0,
      tangjeonPrice: price ? price.tangjeonPrice : 0,
      packPrice: price ? price.packPrice : 0,
      deliveryPrice: price ? price.deliveryPrice : 0,
    });

    dispatch({
      type: PP_MODAL_TOGGLE,
    });
  }, [priceModal, price]);

  ////// HANDLER //////

  const searchMaterialHandler = useCallback((data) => {
    dispatch({
      type: MATERIAL_LIST_REQUEST,
      data: {
        name: data.name,
      },
    });
  }, []);

  const getAllMaterialHandler = useCallback(() => {
    dispatch({
      type: MATERIAL_LIST_REQUEST,
      data: {
        name: "",
      },
    });
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch({
      type: MATERIAL_CREATE_REQUEST,
      data: {
        name: data.name,
        price: data.price,
        stock: Math.round(parseFloat(data.stock) * 100) / 100,
        unit: data.unit,
      },
    });
  }, []);

  const onUpdateSubmit = useCallback(
    (data) => {
      dispatch({
        type: MATERIAL_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          name: data.name,
          price: data.price,
          stock: Math.round(parseFloat(data.stock) * 100) / 100,
          unit: data.unit,
        },
      });
    },
    [updateData]
  );

  const onDeleteHandler = useCallback((materialId) => {
    dispatch({
      type: MATERIAL_DELETE_REQUEST,
      data: {
        materialId,
      },
    });
  }, []);

  const prcieHandler = useCallback(
    (data) => {
      dispatch({
        type: PP_UPDATE_REQUEST,
        data: {
          id: price && price.id,
          pharmacyPrice: data.pharmacyPrice,
          tangjeonPrice: data.tangjeonPrice,
          packPrice: data.packPrice,
          deliveryPrice: data.deliveryPrice,
        },
      });
    },
    [price]
  );

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
      title: "가격",
      dataIndex: "viewPrice",
    },
    {
      title: "재고",
      dataIndex: "stock",
    },
    {
      title: "단위",
      dataIndex: "unit",
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
    },
    {
      title: "재료상세 정보",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => udpateModalToggle(data)}
        >
          재료상세 정보
        </Button>
      ),
    },
    {
      title: "재료삭제",
      render: (data) => (
        <Popconfirm
          title="정말 삭제하시겠습니까?"
          okText="삭제"
          cancelText="취소"
          onConfirm={() => onDeleteHandler(data.id)}
        >
          <Button size="small" type="danger">
            재료삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["상품 관리", "탕전처방 재료/가격 관리"]}
        title={`탕전처방 재료/가격 관리`}
        subTitle={`탕전처방에서 판매되는 재료/가격을 관리하는 전산시스템 입니다.`}
      />

      <AdminContent>
        <SearchForm layout="inline" onFinish={searchMaterialHandler}>
          <SearchFormItem label="재료명" name="name">
            <Input type="text" size="small" style={{ width: "220px" }} />
          </SearchFormItem>

          <SearchFormItem>
            <Button size="small" type="primary" htmlType="submit">
              검색
            </Button>
          </SearchFormItem>
        </SearchForm>
        <Wrapper dr={`row`} ju={`flex-end`} margin={`0 0 10px`}>
          <Wrapper width={`50%`} ju={`flex-start`} dr={`row`}>
            {price && (
              <Text>
                조제료 :&nbsp;
                {price.viewPharmacyPrice}
              </Text>
            )}
            {price && (
              <Text margin={`0 0 0 20px`}>
                탕전료 :&nbsp;
                {price.viewTangjeonPrice}
              </Text>
            )}
            {price && (
              <Text margin={`0 0 0 20px`}>
                1팩 가격 :&nbsp;
                {price.viewPackPrice}
              </Text>
            )}
            {price && (
              <Text margin={`0 0 0 20px`}>
                배송비 :&nbsp;
                {price.viewDeliveryPrice}
              </Text>
            )}
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <ModalBtn
              size="small"
              type="dashed"
              onClick={getAllMaterialHandler}
            >
              전체조회
            </ModalBtn>
            <ModalBtn size="small" type="danger" onClick={unitModalToggle}>
              주의사항
            </ModalBtn>
            <ModalBtn
              size="small"
              onClick={priceModalToggle}
              loading={st_ppUpdateLoading}
            >
              가격설정
            </ModalBtn>

            <ModalBtn
              size="small"
              type="primary"
              onClick={() => createModalToggle(true)}
            >
              + 추가
            </ModalBtn>
          </Wrapper>
        </Wrapper>
        <Table
          size="small"
          columns={columns}
          dataSource={materials ? materials : []}
        />
      </AdminContent>

      {/* UNIT MODAL */}

      <Modal
        title="주의사항"
        visible={unitModal}
        onCancel={unitModalToggle}
        footer={null}
      >
        <GuideUl>
          <GuideLi isImpo={true}>팩가격은 1팩이 기준입니다.</GuideLi>
          <GuideLi isImpo={true}>
            재료의 가격은 처방할때 보여지는 1[단위]의 가격입니다.
          </GuideLi>
          <GuideLi isImpo={true}>
            삭제된 재료는 다시 복구할 수 없습니다. 신중한 작업을 필요로 합니다.
          </GuideLi>
          <GuideLi>
            문의가 필요한 경우 (주)4LEAF SOFTWARE 1600-4198로 연락부탁드립니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* CREATE . UPDATE MODAL */}

      <Modal
        title={updateData ? "재료상세 정보" : "재료 추가"}
        visible={cuModal}
        footer={null}
        onCancel={
          updateData
            ? () => udpateModalToggle(null)
            : () => createModalToggle(false)
        }
        width={`600px`}
      >
        <Form
          form={form}
          ref={formRef}
          onFinish={updateData ? onUpdateSubmit : onSubmit}
        >
          <Wrapper margin={`0 0 0 10px`}>
            <GuideUl>
              <GuideLi isImpo={true}>
                가격과 개수는 숫자만 입력해주세요.
              </GuideLi>
              <GuideLi isImpo={true}>
                0.01개수의 기준으로 가격을 입력해주세요
              </GuideLi>
              <GuideLi isImpo={true}>
                개수는 소수점 둘쨰자리까지 설정가능합니다.
              </GuideLi>
              <GuideLi isImpo={true}>
                단위는 g, kg, ml 등과 유사한 단위를 입력해주세요.
              </GuideLi>
            </GuideUl>
          </Wrapper>
          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "이름을 입력해주세요." }]}
          >
            <Input size="small" />
          </Form.Item>
          <Form.Item
            label="가격"
            name="price"
            rules={[{ required: true, message: "가격을 입력해주세요." }]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Form.Item
            label="재고"
            name="stock"
            rules={[{ required: true, message: "재고을 입력해주세요." }]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Form.Item
            label="단위"
            name="unit"
            rules={[{ required: true, message: "단위을 입력해주세요." }]}
          >
            <Input size="small" />
          </Form.Item>

          <Wrapper al={`flex-end`}>
            <Button size="small" type="primary" htmlType="submit">
              {updateData ? "정보수정" : "재료추가"}
            </Button>
          </Wrapper>
        </Form>
      </Modal>
      <Modal
        title="가격관리"
        visible={priceModal}
        onCancel={priceModalToggle}
        footer={null}
      >
        <Form form={priceForm} onFinish={prcieHandler}>
          <Wrapper margin={`0 0 0 10px`}>
            <GuideUl>
              <GuideLi isImpo={true}>가격은 숫자만 입력해주세요.</GuideLi>
              <GuideLi isImpo={true}>
                1팩의 기준으로 가격을 입력해주시기바랍니다.
              </GuideLi>
            </GuideUl>
          </Wrapper>
          <Form.Item
            label="조제료"
            name="pharmacyPrice"
            rules={[
              { required: true, message: "조제료를 입력해주시기 바랍니다." },
            ]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Form.Item
            label="탕전료"
            name="tangjeonPrice"
            rules={[
              { required: true, message: "탕전료를 입력해주시기 바랍니다." },
            ]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Form.Item
            label="1팩 가격"
            name="packPrice"
            rules={[
              { required: true, message: "1팩 가격을 입력해주시기 바랍니다." },
            ]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Form.Item
            label="배송비"
            name="deliveryPrice"
            rules={[
              { required: true, message: "배송비를 입력해주시기 바랍니다." },
            ]}
          >
            <Input size="small" type="number" />
          </Form.Item>
          <Wrapper al={`flex-end`}>
            <ModalBtn size="small" type="primary" htmlType="submit">
              가격 수정
            </ModalBtn>
          </Wrapper>
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
      type: MATERIAL_LIST_REQUEST,
      data: {
        name: "",
      },
    });

    context.store.dispatch({
      type: PP_GET_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(Material);
