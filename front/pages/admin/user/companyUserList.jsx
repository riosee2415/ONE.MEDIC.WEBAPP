import React, { useCallback, useEffect, useState, useRef } from "react";
import { Button, Form, Select, Table, Modal, message } from "antd";
import styled from "styled-components";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../../store/configureStore";
import {
  LOAD_MY_INFO_REQUEST,
  COMPANY_LIST_REQUEST,
  COMPANY_OPERATOR_REQUEST,
  OPERATOR_MODAL_TOGGLE,
  OPERATOR_UNIT_MODAL_TOGGLE,
} from "../../../reducers/user";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import {
  GuideLi,
  GuideUl,
  Wrapper,
} from "../../../components/commonComponents";

const AdminContent = styled.div`
  padding: 20px;
`;

const CompanyUserList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const {
    me,
    st_loadMyInfoDone,
    companyUserLists,
    operatorModal,
    operatorUnitModal,
    //
    st_companyOperatorDone,
    st_companyOperatorError,
  } = useSelector((state) => state.user);

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

  const [form] = Form.useForm();
  const formRef = useRef();

  ////// USEEFFECT //////

  useEffect(() => {
    if (updateData) {
      onFill(updateData);
    }
  }, [updateData]);

  useEffect(() => {
    if (st_companyOperatorDone) {
      dispatch({
        type: COMPANY_LIST_REQUEST,
        data: {
          type: 2,
        },
      });

      form.resetFields();

      dispatch({
        type: OPERATOR_MODAL_TOGGLE,
      });

      message.success("운영레벨이 변경되었습니다.");
    }
  }, [st_companyOperatorDone]);

  useEffect(() => {
    if (st_companyOperatorError) {
      return message.error(st_companyOperatorError);
    }
  }, [st_companyOperatorError]);

  ////// TOGGLE //////

  const operatorMdoalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
      } else {
        setUpdateData(null);
      }
      dispatch({
        type: OPERATOR_MODAL_TOGGLE,
      });
    },
    [operatorModal, updateData]
  );

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: OPERATOR_UNIT_MODAL_TOGGLE,
    });
  }, [operatorUnitModal]);

  ////// HANDLER //////

  const onFill = useCallback(() => {
    formRef.current.setFieldsValue({
      operatorLevel: updateData.operatorLevel,
    });
  }, [updateData]);

  const onSubmit = useCallback(
    (data) => {
      dispatch({
        type: COMPANY_OPERATOR_REQUEST,
        data: {
          id: updateData.id,
          operatorLevel: parseInt(data.operatorLevel),
        },
      });
    },
    [updateData]
  );

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "회원이름",
      dataIndex: "username",
    },
    {
      title: "이메일",
      dataIndex: "email",
    },
    {
      title: "전화번호",
      dataIndex: "mobile",
    },
    {
      title: "회사이름",
      dataIndex: "companyName",
    },
    {
      title: "사업자번호",
      dataIndex: "companyNo",
    },
    {
      title: "운영레벨",
      dataIndex: "operatorLevel",
    },
    {
      title: "운영레벨변경",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => operatorMdoalToggle(data)}
        >
          운영레벨변경
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "회사 회원 리스트"]}
        title={`회사 회원 리스트`}
        subTitle={`회사 승인되 회원의 리스트를 확인할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-end`} margin={`0 0 10px`}>
          <Button size="small" type="danger" onClick={unitModalToggle}>
            주의사항
          </Button>
        </Wrapper>

        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={companyUserLists ? companyUserLists : []}
        />
      </AdminContent>

      <Modal
        visible={operatorModal}
        title="운영레벨 변경"
        footer={null}
        onCancel={() => operatorMdoalToggle(null)}
      >
        <Form
          form={form}
          ref={formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onSubmit}
        >
          <Form.Item
            label="운영레벨"
            name="operatorLevel"
            rules={[{ required: true, message: "운영레벨을 선택해주세요." }]}
          >
            <Select>
              <Select.Option value="1">1</Select.Option>
              <Select.Option value="2">2</Select.Option>
              <Select.Option value="3">3</Select.Option>
              <Select.Option value="4">4</Select.Option>
              <Select.Option value="5">5</Select.Option>
            </Select>
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button size="small" style={{ margin: `0 5px 0 0` }}>
              취소
            </Button>
            <Button size="small" type="primary" htmlType="submit">
              변경
            </Button>
          </Wrapper>
        </Form>
      </Modal>

      <Modal
        title="주의사항"
        footer={null}
        onCancel={unitModalToggle}
        visible={operatorUnitModal}
      >
        <GuideUl>
          <GuideLi></GuideLi>
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
      type: COMPANY_LIST_REQUEST,
      data: {
        type: 2,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default CompanyUserList;
