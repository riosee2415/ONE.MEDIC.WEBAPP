import React from "react";
import styled from "styled-components";

import PageHeader from "../../../components/admin/PageHeader";
import AdminLayout from "../../../components/AdminLayout";

const AdminContent = styled.div`
  padding: 20px;
`;

const DiscountList = () => {
  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },
    {
      title: "할인율",
      dataIndex: "value",
      render: (data) => <p>{data}%</p>,
    },
    {
      title: "타입",
      dataIndex: "type",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "혜택 관리"]}
        title={`회사 신청 관리`}
        subTitle={`홈페이지에서 신청한 회사 신청 목록을 관리할 수 있습니다.`}
      />

      <AdminContent>
        <Table></Table>
      </AdminContent>
    </AdminLayout>
  );
};
