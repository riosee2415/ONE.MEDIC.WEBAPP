import React, { useCallback, useEffect, useRef } from "react";
import { Button, Table, Form, Modal, Input } from "antd";
import styled from "styled-components";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import wrapper from "../../../store/configureStore";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  Wrapper,
  GuideUl,
  GuideLi,
} from "../../../components/commonComponents";
import {
  DISCOUNT_LIST_REQUEST,
  UNIT_MODAL_TOGGLE,
  CU_MODAL_TOGGLE,
} from "../../../reducers/discount";

const AdminContent = styled.div`
  padding: 20px;
`;

const DiscountList = () => {
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

  ////// GLOBAL STATE //////

  const { discounts, cuModal, unitModal } = useSelector(
    (state) => state.discount
  );

  ////// HOOKS //////

  const dispatch = useDispatch();

  const form = Form.useForm();
  const formRef = useRef();

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const createModalToggle = useCallback(() => {
    dispatch({
      type: CU_MODAL_TOGGLE,
    });
  }, [cuModal]);

  const updateModalToggle = useCallback(
    (data) => {
      dispatch({
        type: CU_MODAL_TOGGLE,
      });
    },
    [cuModal]
  );

  ////// DATAVIEW //////
  const columns = [
    {
      title: "타입",
      dataIndex: "id",
    },
    {
      title: "할인율",
      dataIndex: "value",
      render: (data) => <div>{data}%</div>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button size="small" type="primary">
          수정
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "회원 혜택 관리"]}
        title={`회원 혜택 관리`}
        subTitle={`회원의 혜택을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Wrapper dr={`row`} ju={`flex-end`} margin={`0 0 10px`}>
          <Button
            size="small"
            type="danger"
            style={{ margin: `0 5px 0 0` }}
            onClick={unitModalToggle}
          >
            주의사항
          </Button>
          <Button size="small" type="primary" onClick={createModalToggle}>
            + 추가
          </Button>
        </Wrapper>
        <Table
          rowKey="id"
          size="small"
          columns={columns}
          dataSource={discounts ? discounts : []}
        />
      </AdminContent>

      <Modal
        title="주의사항"
        visible={unitModal}
        onCancel={unitModalToggle}
        footer={null}
        width={`600px`}
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            회원의 운영레벨에 따라 각각의 타입의 할인율이 적용됩니다..
          </GuideLi>
          <GuideLi>
            조작의 실수 및 기능문의는 (주)4LEAF SOFTWARE 1600-4198로
            연락바랍니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      <Modal
        title="회원 혜택 추가"
        visible={cuModal}
        onCancel={createModalToggle}
        footer={null}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          form={form}
          ref={formRef}
        >
          <Form.Item
            label="할인율"
            name="value"
            rules={[{ required: true, message: "할인율을 입력해주세요." }]}
          >
            <Input />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button
              size="small"
              style={{ margin: `0 5px 0 0` }}
              onClick={createModalToggle}
            >
              취소
            </Button>
            <Button size="small" type="primary" htmlType="submit">
              추가
            </Button>
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
      type: DISCOUNT_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default DiscountList;
