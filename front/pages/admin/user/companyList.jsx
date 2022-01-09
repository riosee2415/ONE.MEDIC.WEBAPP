import React, { useCallback, useState, useEffect, useRef } from "react";
import { Button, Table, message, Modal, Form, Input } from "antd";
import styled from "styled-components";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter, withRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";

import wrapper from "../../../store/configureStore";
import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";
import {
  LOAD_MY_INFO_REQUEST,
  COMPANY_LIST_REQUEST,
  COMPANY_REFUSAL_REQUEST,
  COMPANY_APPROVAL_REQUEST,
  COMPANY_DETAIL_TOGGLE,
} from "../../../reducers/user";
import Theme from "../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

const AdminTab = styled.div`
  margin: 0 0 10px;
`;

const AdminFileBtn = styled(Button)`
  width: 130px;
  height: 30px;
`;

const AdminText = styled.span`
  margin: 0 0 0 10px;
  color: ${Theme.grey_C};
`;

const companyList = () => {
  // LOAD CURRENT INFO AREA /////////////////////////////////////////////
  const {
    me,
    companyUserLists,
    companyDetailModal,
    //
    st_loadMyInfoDone,
    //
    st_companyRefusalDone,
    st_companyApprovalDone,
    //
    st_companyRefusalError,
    st_companyApprovalError,
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

  const [companyTab, setCompanyTab] = useState(1);

  const [detailData, setDetailData] = useState(null);

  const [detailFile, setDetailFile] = useState(null);

  const [dForm] = Form.useForm();
  const dFormRef = useRef();

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: COMPANY_LIST_REQUEST,
      data: {
        type: companyTab,
      },
    });
  }, [companyTab]);

  useEffect(() => {
    if (detailData) {
      setTimeout(() => {
        onFill(detailData);
      }, 500);
    }
  }, [detailData]);

  useEffect(() => {
    if (st_companyRefusalDone) {
      dispatch({
        type: COMPANY_LIST_REQUEST,
        data: {
          type: companyTab,
        },
      });

      return message.success("거절되었습니다.");
    }
  }, [st_companyRefusalDone]);

  useEffect(() => {
    if (st_companyApprovalDone) {
      dispatch({
        type: COMPANY_LIST_REQUEST,
        data: {
          type: companyTab,
        },
      });

      return message.success("승인되었습니다.");
    }
  }, [st_companyApprovalDone]);

  useEffect(() => {
    if (st_companyRefusalError) {
      return message.error(st_companyRefusalError);
    }
  }, [st_companyRefusalError]);

  useEffect(() => {
    if (st_companyApprovalError) {
      return message.error(st_companyApprovalError);
    }
  }, [st_companyApprovalError]);

  ////// TOGGLE //////

  const detailToggle = useCallback(
    (data) => {
      setDetailData(data);
      dispatch({
        type: COMPANY_DETAIL_TOGGLE,
      });
    },
    [companyDetailModal, detailData]
  );

  ////// HANDLER //////

  const tabChangeHandler = useCallback(
    (tab) => {
      setCompanyTab(tab);
    },
    [companyTab]
  );

  const onFill = useCallback(
    (data) => {
      dFormRef.current.setFieldsValue({
        username: data.username,
        mobile: data.mobile,
        email: data.email,
        companyName: data.companyName,
        companyNo: data.companyNo,
      });

      setDetailFile(data.companyFile);
    },
    [dFormRef, detailFile]
  );

  const approvalHandler = useCallback((id) => {
    dispatch({
      type: COMPANY_APPROVAL_REQUEST,
      data: {
        id,
      },
    });
  }, []);

  const refusalHandler = useCallback((id) => {
    dispatch({
      type: COMPANY_REFUSAL_REQUEST,
      data: {
        id,
      },
    });
  }, []);

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;

    saveAs(file, originName);
  }, []);

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
      title: "회사이름",
      dataIndex: "companyName",
    },
    {
      title: "사업자번호",
      dataIndex: "companyNo",
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button type="primary" size="small" onClick={() => detailToggle(data)}>
          상세보기
        </Button>
      ),
    },
    {
      title: "승인",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => approvalHandler(data.id)}
        >
          승인
        </Button>
      ),
    },
    {
      title: "거절",
      render: (data) => (
        <Button
          type="danger"
          size="small"
          onClick={() => refusalHandler(data.id)}
        >
          거절
        </Button>
      ),
    },
  ];

  const typeColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "회원이름",
      dataIndex: "username",
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
      title: "상세보기",
      render: (data) => (
        <Button type="primary" size="small" onClick={() => detailToggle(data)}>
          상세보기
        </Button>
      ),
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "회사 신청 리스트"]}
        title={`회원 신청 관리`}
        subTitle={`홈페이지에서 신청한 회사 신청 목록을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <AdminTab>
          <Button
            size="small"
            type={companyTab === 1 && "primary"}
            onClick={() => tabChangeHandler(1)}
          >
            미승인
          </Button>
          <Button
            size="small"
            type={companyTab === 2 && "primary"}
            onClick={() => tabChangeHandler(2)}
          >
            승인
          </Button>
          <Button
            size="small"
            type={companyTab === 3 && "primary"}
            onClick={() => tabChangeHandler(3)}
          >
            거절
          </Button>
        </AdminTab>
        <Table
          size="small"
          columns={companyTab === 1 ? columns : typeColumns}
          dataSource={companyUserLists ? companyUserLists : []}
        />
      </AdminContent>

      <Modal
        title="상세보기"
        visible={companyDetailModal}
        onCancel={() => detailToggle(null)}
        footer={null}
      >
        <Form
          form={dForm}
          ref={dFormRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item label="회원이름" name="username">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="전화번호" name="mobile">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="이메일" name="email">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="회사이름" name="companyName">
            <Input readOnly />
          </Form.Item>
          <Form.Item label="사업자번호" name="companyNo">
            <Input readOnly />
          </Form.Item>
          {/* <Form.Item label="운영레벨">
            <Input readOnly />
          </Form.Item> */}
          {detailFile && (
            <>
              <AdminFileBtn
                type="dashed"
                onClick={() => fileDownloadHandler(detailFile)}
              >
                첨부파일
              </AdminFileBtn>
              <AdminText>
                * 첨부파일 클릭시 첨부파일이 다운로드 됩니다.
              </AdminText>
            </>
          )}
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
      type: COMPANY_LIST_REQUEST,
      data: {
        type: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default companyList;
