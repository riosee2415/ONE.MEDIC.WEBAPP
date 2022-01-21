import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Modal,
  notification,
  Popconfirm,
  Form,
  Input,
  message,
  Empty,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  AdminContent,
  GuideUl,
  GuideLi,
  Text,
} from "../../../components/commonComponents";
import Theme from "../../../components/Theme";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  DETAIL_MODAL_TOGLE,
  ISREFUSE_MODAL_TOGGLE,
  PPR_COMPLETE_REQUEST,
  PPR_LIST_REQUEST,
  PPR_REFUSE_REQUEST,
  UNIT_MODAL_TOGGLE,
  USER_DETAIL_MODAL_TOGGLE,
  PPR_DELIVERY_REQUEST,
  DELIVERY_MODAL_TOGGLE,
  REFUSE_DETAIL_MODAL_TOGGLE,
} from "../../../reducers/prescriptionPaymentRequest";
import { MATERIAL_DETAIL_REQUEST } from "../../../reducers/material";

const AdminButton = styled(Button)`
  margin: 0 5px;
`;

const UserDeliAddress = ({}) => {
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);
  const {
    pprs,
    //
    unitModal,
    userDetailModal,
    detailModal,
    refuseModal,
    deliveryModal,
    refuseDetailModal,
    //
    st_pprRefuseDone,
    st_pprRefuseError,
    //
    st_pprCompleteDone,
    st_pprCompleteError,
    //
    st_pprDeliveryDone,
    st_pprDeliveryError,
  } = useSelector((state) => state.prescriptionPaymentRequest);

  const { material } = useSelector((state) => state.material);

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

  const [searchTab, setSearchTab] = useState(1);
  const [isCondition, setIsCondition] = useState(1);

  const [detailData, setDetailData] = useState(null);
  const [refuseData, setRefuseData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);

  const [refuseForm] = Form.useForm();
  const refuseFormRef = useRef();

  const [deliveryForm] = Form.useForm();
  const deliveryFormRef = useRef();

  ////// USEEFFECT //////

  useEffect(() => {
    dispatch({
      type: PPR_LIST_REQUEST,
      data: {
        type: searchTab,
        isCondition,
      },
    });
  }, [searchTab, isCondition]);

  useEffect(() => {
    if (detailData) {
      detailOnFill(detailData);
    }
  }, [detailData]);

  useEffect(() => {
    if (deliveryData) {
      deliveryOnFill(deliveryData);
    }
  }, [deliveryData]);

  useEffect(() => {
    if (st_pprRefuseDone) {
      dispatch({
        type: PPR_LIST_REQUEST,
        data: {
          type: searchTab,
          isCondition,
        },
      });
      dispatch({
        type: ISREFUSE_MODAL_TOGGLE,
      });
      refuseForm.resetFields();
      return message.success("거절되었습니다.");
    }
  }, [st_pprRefuseDone]);
  useEffect(() => {
    if (st_pprRefuseError) {
      return message.error(st_pprRefuseError);
    }
  }, [st_pprRefuseError]);

  useEffect(() => {
    if (st_pprCompleteDone) {
      dispatch({
        type: PPR_LIST_REQUEST,
        data: {
          type: searchTab,
          isCondition,
        },
      });
      refuseForm.resetFields();
      return message.success("처리완료되었습니다.");
    }
  }, [st_pprCompleteDone]);
  useEffect(() => {
    if (st_pprCompleteError) {
      return message.error(st_pprCompleteError);
    }
  }, [st_pprCompleteError]);

  useEffect(() => {
    if (st_pprDeliveryDone) {
      dispatch({
        type: PPR_LIST_REQUEST,
        data: {
          type: searchTab,
          isCondition,
        },
      });
      dispatch({
        type: DELIVERY_MODAL_TOGGLE,
      });
      deliveryForm.resetFields();
      return message.success("배송회사가 등록되었습니다.");
    }
  }, [st_pprDeliveryDone]);
  useEffect(() => {
    if (st_pprDeliveryError) {
      return message.error(st_pprDeliveryError);
    }
  }, [st_pprDeliveryError]);

  ////// TOGGLE //////

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const detailModalToggle = useCallback(
    (data, type) => {
      if (data) {
        setDetailData(data);
      } else {
        setDetailData(null);
      }

      if (type === 1) {
        dispatch({
          type: DETAIL_MODAL_TOGLE,
        });
      } else if (type === 2) {
        dispatch({
          type: USER_DETAIL_MODAL_TOGGLE,
        });
      } else {
        dispatch({
          type: REFUSE_DETAIL_MODAL_TOGGLE,
        });
      }
    },
    [detailModal, refuseDetailModal, userDetailModal]
  );

  const refuseModalTogggle = useCallback(
    (data) => {
      if (data) {
        setRefuseData(data);
      } else {
        setRefuseData(null);
      }
      dispatch({
        type: ISREFUSE_MODAL_TOGGLE,
      });
    },
    [refuseModal, refuseData]
  );

  const deliveryModalTogggle = useCallback(
    (data) => {
      if (data) {
        setDeliveryData(data);
      } else {
        setDeliveryData(null);
      }
      dispatch({
        type: DELIVERY_MODAL_TOGGLE,
      });
    },
    [deliveryModal, deliveryData]
  );

  ////// HANDLER //////

  const detailOnFill = useCallback((data) => {
    dispatch({
      type: MATERIAL_DETAIL_REQUEST,
      data: {
        pprId: data.id,
      },
    });
  }, []);

  const deliveryOnFill = useCallback(
    (data) => {
      deliveryFormRef.current.setFieldsValue({
        deliveryNo: data.deliveryNo,
        deliveryCompany: data.deliveryCompany,
      });
    },
    [deliveryFormRef]
  );

  const tabChangeHandler = useCallback(
    (tab) => {
      setSearchTab(tab);
      if (tab === 4) {
        setIsCondition(tab);
      }
    },
    [searchTab, isCondition]
  );

  const conditionChangeHandler = useCallback(
    (condition) => {
      setIsCondition(condition);
    },
    [isCondition]
  );

  const onCompleteSubmit = useCallback((id) => {
    dispatch({
      type: PPR_COMPLETE_REQUEST,
      data: {
        pprId: id,
      },
    });
  }, []);

  const onRefuseSubmit = useCallback(
    (data) => {
      dispatch({
        type: PPR_REFUSE_REQUEST,
        data: {
          pprId: refuseData.id,
          refuseContent: data.refuseContent,
        },
      });
    },
    [refuseData]
  );

  const onDeliverySubmit = useCallback(
    (data) => {
      dispatch({
        type: PPR_DELIVERY_REQUEST,
        data: {
          pprId: deliveryData.id,
          deliveryNo: data.deliveryNo,
          deliveryCompany: data.deliveryCompany,
        },
      });
    },
    [deliveryData]
  );

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "주문일",
      dataIndex: "orderAt",
    },

    {
      title: "주문자",
      dataIndex: "username",
    },
    {
      title: "주문자상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자상세
        </Button>
      ),
    },
    {
      title: "주문상세",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
      ),
    },
    {
      title: "배송정보등록",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => deliveryModalTogggle(data)}
        >
          배송정보등록
        </Button>
      ),
    },
    {
      title: "처리완료",
      render: (data) => (
        <Popconfirm
          title="처리완료하시겠습니까?"
          onConfirm={() => onCompleteSubmit(data.id)}
          okText="처리완료"
          cancelText="취소"
        >
          <Button type="primary" size="small">
            처리완료
          </Button>
        </Popconfirm>
      ),
    },
    {
      title: "거절",
      render: (data) => (
        <Button
          type="danger"
          size="small"
          onClick={() => refuseModalTogggle(data)}
        >
          거절
        </Button>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];

  const refuseColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "주문일",
      dataIndex: "orderAt",
    },

    {
      title: "주문자",
      dataIndex: "username",
    },
    {
      title: "주문자상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자상세
        </Button>
      ),
    },
    {
      title: "주문상세",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
      ),
    },
    {
      title: "거절사유",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data, 3)}
        >
          거절사유
        </Button>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];

  const completeColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "처리일",
      dataIndex: "completedAt",
    },

    {
      title: "주문자",
      dataIndex: "username",
    },

    {
      title: "주문자상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자상세
        </Button>
      ),
    },
    {
      title: "주문상세",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
      ),
    },
    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];

  const allColumns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "주문일",
      dataIndex: "orderAt",
    },

    {
      title: "주문자",
      dataIndex: "username",
    },
    {
      title: "주문자상세",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => detailModalToggle(data, 2)}
        >
          주문자상세
        </Button>
      ),
    },
    {
      title: "주문상세",
      render: (data) => (
        <Button
          size="small"
          type="primary"
          onClick={() => detailModalToggle(data, 1)}
        >
          주문상세
        </Button>
      ),
    },
    {
      title: "거절사유",
      render: (data) => (
        <Button size="small" type="primary">
          거절사유
        </Button>
      ),
    },

    {
      title: "주문서 다운로드",
      render: (data) => <Button size="small">주문서 다운로드</Button>,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["주문 관리", "탕전처방 주문 관리"]}
        title={`탕전처방 주문 관리`}
        subTitle={`탕전처방 주문을 확인 및 출력할 수 있습니다.`}
      />

      <AdminContent>
        <Text fontSize={`14px`} color={Theme.red_C} isImpo={true}>
          1개월 전 발생된 데이터가 필요한 경우 개발사로 요청해주세요. (1600 -
          4198)
        </Text>
        <Wrapper
          dr={`row`}
          ju={`space-between`}
          al={`flex-start`}
          margin={`20px 0 10px`}
        >
          <Wrapper width={`50%`} dr={`row`} ju={`flex-start`}>
            <Wrapper dr={`row`} ju={`flex-start`}>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={searchTab === 1 && `primary`}
                onClick={() => tabChangeHandler(1)}
              >
                1주일
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={searchTab === 2 && `primary`}
                onClick={() => tabChangeHandler(2)}
              >
                1개월
              </AdminButton>
            </Wrapper>
            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isCondition === 1 && `primary`}
                onClick={() => conditionChangeHandler(1)}
              >
                미처리
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isCondition === 2 && `primary`}
                onClick={() => conditionChangeHandler(2)}
              >
                처리
              </AdminButton>
              <AdminButton
                style={{ width: `60px` }}
                size="small"
                type={isCondition === 3 && `primary`}
                onClick={() => conditionChangeHandler(3)}
              >
                거절
              </AdminButton>
            </Wrapper>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <AdminButton
              size="small"
              type={`dashed`}
              onClick={() => tabChangeHandler(4)}
            >
              전체보기
            </AdminButton>
            <AdminButton type="danger" size="small" onClick={unitModalToggle}>
              주의사항
            </AdminButton>
            <AdminButton size="small">전체 주문서 다운로드</AdminButton>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={
            isCondition === 1
              ? columns
              : isCondition === 2
              ? completeColumns
              : isCondition === 3
              ? refuseColumns
              : allColumns
          }
          dataSource={pprs ? pprs : []}
          size="small"
        />
      </AdminContent>

      {/* USER MODAL */}

      <Modal
        title="주문자상세"
        footer={null}
        width={`650px`}
        visible={userDetailModal}
        onCancel={() => detailModalToggle(null, 2)}
      >
        <Wrapper border={`1px solid ${Theme.black_C}`}>
          <Wrapper dr={`row`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문자이름
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {detailData && detailData.username}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              닉네임
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.nickname}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              이메일
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.email}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              전화번호
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.mobile}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              회사이름
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.companyName}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              사업자번호
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.companyNo}
            </Text>
          </Wrapper>
        </Wrapper>
      </Modal>

      {/* UNIT MODAL */}

      <Modal
        visible={unitModal}
        width="600px"
        footer={null}
        onCancel={unitModalToggle}
        title="주의사항"
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            1개월 전 발생된 데이터가 필요한 경우 개발사로 요청해주세요. (1600 -
            4198)
          </GuideLi>
          <GuideLi>
            속도개선을 위해 최근 발생한 데이터를 기준으로 조회됩니다.
          </GuideLi>
          <GuideLi>
            제품의 제작 및 배송이 완료된 경우 처리완료 버튼을 클릭해주세요.
          </GuideLi>
          <GuideLi>
            주문요청 건 별 [주문서 다운로드] 버튼을 통해 엑셀파일을 다운받을 수
            있습니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* PAYMENT MODAL */}

      <Modal
        title="주문상세"
        visible={detailModal}
        footer={null}
        width={`800px`}
        onCancel={() => detailModalToggle(null, 1)}
      >
        <Wrapper border={`1px solid ${Theme.black_C}`}>
          <Wrapper dr={`row`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문자
            </Text>
            <Text padding={`10px 0 `} width={`80%`} textAlign={"center"}>
              {detailData && detailData.username}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              주문일
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.orderAt}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              배송회사
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.deliveryCompany
                ? detailData.deliveryCompany
                : "배송회사가 등록되어있지 않습니다."}
            </Text>
          </Wrapper>
          <Wrapper dr={`row`} borderTop={`1px solid ${Theme.black_C}`}>
            <Text
              width={`20%`}
              textAlign={"center"}
              padding={`10px 0 `}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              운송장번호
            </Text>
            <Text width={`80%`} textAlign={"center"} padding={`10px 0 `}>
              {detailData && detailData.deliveryNo
                ? detailData.deliveryNo
                : "운송장번호가 등록되어있지 않습니다."}
            </Text>
          </Wrapper>
          <Wrapper
            dr={`row`}
            al={`flex-start`}
            borderTop={`1px solid ${Theme.black_C}`}
          >
            {material && (
              <>
                <Wrapper
                  width={`20%`}
                  height={`100%`}
                  ju={`flex-start`}
                  padding={`${
                    18 * (material.length === 0 ? 4 : material.length)
                  }px 0`}
                  color={Theme.white_C}
                  bgColor={Theme.black_C}
                >
                  <Text>주문재료목록</Text>
                </Wrapper>

                <Wrapper
                  width={`80%`}
                  dr={`row`}
                  ju={`space-between`}
                  padding={`10px 20px`}
                >
                  {material.length === 0 ? (
                    <Wrapper padding={`5px 0 0`}>
                      <Empty />
                    </Wrapper>
                  ) : (
                    material.map((data) => {
                      return (
                        <Wrapper
                          width={`calc(100% / 2 - 5px)`}
                          al={`flex-start`}
                          border={`1px solid ${Theme.black_C}`}
                        >
                          <Wrapper
                            dr={`row`}
                            borderBottom={`1px solid ${Theme.black_C}`}
                          >
                            <Text
                              width={`40%`}
                              textAlign={`center`}
                              padding={`5px 0`}
                              bgColor={Theme.black_C}
                              color={Theme.white_C}
                            >
                              재료이름
                            </Text>
                            <Text
                              width={`60%`}
                              textAlign={`center`}
                              padding={`5px 0`}
                            >
                              {data.Material.name}
                            </Text>
                          </Wrapper>
                          <Wrapper dr={`row`}>
                            <Text
                              width={`40%`}
                              textAlign={`center`}
                              padding={`5px 0`}
                              bgColor={Theme.black_C}
                              color={Theme.white_C}
                            >
                              용량
                            </Text>
                            <Text
                              width={`60%`}
                              textAlign={`center`}
                              padding={`5px 0`}
                            >
                              {data.qnt}
                              {data.unit}
                            </Text>
                          </Wrapper>
                        </Wrapper>
                      );
                    })
                  )}
                </Wrapper>
              </>
            )}
          </Wrapper>
        </Wrapper>
      </Modal>

      {/* REFUSE MODAL */}

      <Modal
        title="거절하기"
        visible={refuseModal}
        onCancel={() => refuseModalTogggle(null)}
        footer={null}
        width={`600px`}
      >
        <Form form={refuseForm} ref={refuseFormRef} onFinish={onRefuseSubmit}>
          <Form.Item
            label="거절사유"
            name="refuseContent"
            rules={[{ required: true, message: "거절사유를 입력해주세요." }]}
          >
            <Input.TextArea autoSize={{ minRows: 5, maxRows: 7 }} />
          </Form.Item>
          <Wrapper dr={`row`} ju={`flex-end`}>
            <AdminButton size="small" onClick={() => refuseModalTogggle(null)}>
              취소
            </AdminButton>
            <AdminButton size="small" type="primary" htmlType="submit">
              거절
            </AdminButton>
          </Wrapper>
        </Form>
      </Modal>

      <Modal
        title="거절사유"
        visible={refuseDetailModal}
        onCancel={() => detailModalToggle(null, 3)}
        footer={null}
        width={`600px`}
      >
        <Wrapper border={`1px solid ${Theme.black_C}`}>
          <Wrapper dr={`row`}>
            <Text
              padding={`10px 0 `}
              width={`20%`}
              textAlign={"center"}
              color={Theme.white_C}
              bgColor={Theme.black_C}
            >
              거절사유
            </Text>
            <Text padding={`10px `} width={`80%`}>
              {detailData && detailData.refuseContent}
            </Text>
          </Wrapper>
        </Wrapper>
      </Modal>

      {/* DELIVERY MODAL */}

      <Modal
        title="배송회사등록"
        visible={deliveryModal}
        onCancel={() => deliveryModalTogggle(null)}
        footer={null}
        width={`600px`}
      >
        <Form
          form={deliveryForm}
          ref={deliveryFormRef}
          onFinish={onDeliverySubmit}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="운송장번호"
            name="deliveryNo"
            rules={[{ required: true, message: "운송장번호를 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="배송회사"
            name="deliveryCompany"
            rules={[{ required: true, message: "배송회사를 입력해주세요." }]}
          >
            <Input />
          </Form.Item>
          <Wrapper dr={`row`} ju={`flex-end`}>
            <AdminButton
              size="small"
              onClick={() => deliveryModalTogggle(null)}
            >
              취소
            </AdminButton>
            <AdminButton size="small" type="primary" htmlType="submit">
              등록
            </AdminButton>
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
      type: PPR_LIST_REQUEST,
      data: {
        type: 1,
        isCondition: 1,
      },
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
