import { Button, Table } from "antd";
import React from "react";
import styled from "styled-components";

import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";

const AdminContent = styled.div`
  padding: 20px;
`;

const companyQuestion = () => {
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
      dataIndex: "companyName",
    },
    {
      title: "상세보기",
      render: (data) => (
        <Button type="primary" size="small">
          상세보기
        </Button>
      ),
    },
    {
      title: "승인",
      render: (data) => (
        <Button type="primary" size="small">
          승인
        </Button>
      ),
    },
    {
      title: "거절",
      render: (data) => (
        <Button type="danger" size="small">
          거절
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
        <Table columns={columns} />
      </AdminContent>
    </AdminLayout>
  );
};

export default companyQuestion;
