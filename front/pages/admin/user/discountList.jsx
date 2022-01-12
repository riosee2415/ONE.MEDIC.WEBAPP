import { Button, Table, Form, Modal, Input, message, Spin } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { END } from "redux-saga";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
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
  DISCOUNT_CREATE_REQUEST,
  DISCOUNT_UPDATE_REQUEST,
} from "../../../reducers/discount";
import { Text } from "../../../components/commonComponents";
import Theme from "../../../components/Theme";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

  const {
    discounts,
    cuModal,
    unitModal,
    //
    st_discountListLoading,
    //
    st_discountCreateDone,
    st_discountCreateError,
    //
    st_discountUpdateDone,
    st_discountUpdateError,
  } = useSelector((state) => state.discount);

  ////// HOOKS //////

  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const formRef = useRef();

  const [updateData, setUpdateData] = useState(null);

  const [seriesData, setSeriesData] = useState(null);

  const [chartConfig, setChartConfig] = useState(null);

  ////// USEEFFECT //////

  useEffect(() => {
    if (router.query) {
      dispatch({
        type: DISCOUNT_LIST_REQUEST,
      });
    }
  }, [router]);

  useEffect(() => {
    if (discounts) {
      setSeriesData(
        discounts && discounts.map((data) => parseFloat(data.userPercent))
      );
    }
  }, [discounts]);

  useEffect(() => {
    if (seriesData) {
      setChartConfig({
        series: seriesData,
        options: {
          labels: ["1번", "2번", "3번", "4번", " 5번"],

          dataLabels: {
            formatter: (val, opts) => {
              return `${opts.seriesIndex + 1}번 ${val}%`;
            },
            enabled: true,
          },
          stroke: {
            curve: "straight",
          },
          title: {
            text: "회원 분포율",
            align: "left",
          },
        },
      });
    }
  }, [seriesData]);

  useEffect(() => {
    if (st_discountCreateDone) {
      dispatch({
        type: DISCOUNT_LIST_REQUEST,
      });

      dispatch({
        type: CU_MODAL_TOGGLE,
      });
      form.resetFields();
      return message.success("혜택이 추가되었습니다.");
    }
  }, [st_discountCreateDone]);

  useEffect(() => {
    if (st_discountCreateError) {
      return message.error(st_discountCreateError);
    }
  }, [st_discountCreateError]);

  useEffect(() => {
    if (st_discountUpdateDone) {
      dispatch({
        type: DISCOUNT_LIST_REQUEST,
      });

      dispatch({
        type: CU_MODAL_TOGGLE,
      });
      form.resetFields();
      setUpdateData(null);
      return message.success("혜택이 수정되었습니다.");
    }
  }, [st_discountUpdateDone]);

  useEffect(() => {
    if (st_discountUpdateError) {
      return message.error(st_discountUpdateError);
    }
  }, [st_discountUpdateError]);

  useEffect(() => {
    if (updateData) {
      onFill(updateData);
    }
  }, [updateData]);

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const createModalToggle = useCallback(() => {
    if (discounts.length >= 5) {
      return message.info("혜택은 5개까지만 추가할 수 있습니다.");
    }
    dispatch({
      type: CU_MODAL_TOGGLE,
    });
  }, [cuModal]);

  const updateModalToggle = useCallback(
    (data) => {
      if (data) {
        setUpdateData(data);
      } else {
        form.resetFields();
        setUpdateData(null);
      }
      dispatch({
        type: CU_MODAL_TOGGLE,
      });
    },
    [cuModal, updateData]
  );

  ////// HANDLER //////

  const onFill = useCallback((data) => {
    formRef.current.setFieldsValue({
      value: data.value,
    });
  }, []);

  const onSubmit = useCallback((data) => {
    dispatch({
      type: DISCOUNT_CREATE_REQUEST,
      data: {
        value: data.value,
      },
    });
  }, []);

  const onUpdateSubmit = useCallback(
    (data) => {
      dispatch({
        type: DISCOUNT_UPDATE_REQUEST,
        data: {
          id: updateData.id,
          value: data.value,
        },
      });
    },
    [updateData]
  );

  ////// DATAVIEW //////
  const columns = [
    {
      title: "타입",
      dataIndex: "type",
      render: (data) => (
        <Text color={Theme.subTheme2_C} fontWeight={`bold`}>
          {data}
        </Text>
      ),
    },
    {
      title: "할인율",
      dataIndex: "discount",
      render: (data) => <div>{data}%</div>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => updateModalToggle(data)}
        >
          수정
        </Button>
      ),
    },
    {
      title: "회원수",
      dataIndex: "userCount",
      render: (data) => <div>{data}명</div>,
    },
    {
      title: "분포율",
      dataIndex: "userPercent",
      render: (data) => <div>{data}%</div>,
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

        {chartConfig &&
          (chartConfig.series ? (
            <Chart
              options={chartConfig.options}
              series={chartConfig.series}
              type="donut"
              height="450"
            />
          ) : (
            <Spin indicator={<LoadingOutlined />} />
          ))}
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
            회원의 운영레벨에 따라 각각의 타입의 할인율이 적용됩니다.
          </GuideLi>
          <GuideLi>사업자 승인된 회원에게만 적용됩니다.</GuideLi>
          <GuideLi>
            조작의 실수 및 기능문의는 (주)4LEAF SOFTWARE 1600-4198로
            연락바랍니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      <Modal
        title={updateData ? `회원 혜택 수정` : `회원 혜택 추가`}
        visible={cuModal}
        onCancel={
          updateData ? () => updateModalToggle(null) : createModalToggle
        }
        footer={null}
      >
        <Form
          form={form}
          ref={formRef}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
          onFinish={updateData ? onUpdateSubmit : onSubmit}
        >
          <GuideUl>
            <GuideLi isImpo={true}>
              할인율을 입력할 시 %는 제외하고 입력하셔야 합니다.
            </GuideLi>
          </GuideUl>
          <Form.Item
            label="할인율"
            name="value"
            rules={[{ required: true, message: "할인율을 입력해주세요." }]}
          >
            <Input type="number" />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button
              size="small"
              style={{ margin: `0 5px 0 0` }}
              onClick={
                updateData ? () => updateModalToggle(null) : createModalToggle
              }
            >
              취소
            </Button>
            <Button size="small" type="primary" htmlType="submit">
              {updateData ? "수정" : "추가"}
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
