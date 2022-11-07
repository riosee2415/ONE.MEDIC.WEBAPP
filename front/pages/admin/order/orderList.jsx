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
  Popconfirm,
  Form,
  Input,
} from "antd";

import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  AdminContent,
  ModalBtn,
  GuideUl,
  GuideLi,
  Text,
} from "../../../components/commonComponents";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import {
  BOUGHT_ADMIN_LIST_REQUEST,
  BOUGHT_COMPLETE_UPDATE_REQUEST,
  BOUGHT_DELIVERY_UPDATE_REQUEST,
  BOUGHT_DETAIL_REQUEST,
  BOUGHT_REFUSE_UPDATE_REQUEST,
} from "../../../reducers/boughtHistory";
import Theme from "../../../components/Theme";
import { CSVLink } from "react-csv";

const DownLoadBtn = styled(CSVLink)`
  font-size: 13px;
  border: 1px solid ${Theme.lightGrey_C};
  /* height: 25px; */
  padding: 2px 5px;
  transition: 0.5s;

  &:hover {
    background: ${Theme.lightGrey_C};
  }
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const UserDeliAddress = ({}) => {
  ////// GOLBAL STATE //////
  const { st_loadMyInfoDone, me } = useSelector((state) => state.user);

  const {
    adminBoughtList,
    boughtDetail,
    //
    st_boughtAdminListLoading,
    st_boughtAdminListError,
    //
    st_boughtDeliveryUpdateLoading,
    st_boughtDeliveryUpdateDone,
    st_boughtDeliveryUpdateError,
    //
    st_boughtCompleteUpdateLoading,
    st_boughtCompleteUpdateDone,
    st_boughtCompleteUpdateError,
    //
    st_boughtRefuseUpdateLoading,
    st_boughtRefuseUpdateDone,
    st_boughtRefuseUpdateError,
  } = useSelector((state) => state.boughtHistory);

  ////// HOOKS //////
  const router = useRouter();
  const dispatch = useDispatch();

  // 검색
  const [searchType, setSearchType] = useState(3);
  const [searchTab, setSearchTab] = useState(1);
  const [isComplete, setIsComplete] = useState(4);

  // 엑셀
  const [csvData, setCsvData] = useState([]);
  const [selectCsvData, setSelectCsvData] = useState([]);

  // 모델
  const [unitModal, setUnitModal] = useState(false);

  const [deliveryForm] = Form.useForm();
  const [deliveryData, setDeliveryData] = useState(null);
  const [deliveryModal, setDeliveryModal] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [orderDetailModal, setOrderDetailModal] = useState(false);

  const [refuseForm] = Form.useForm();
  const [refuseModal, setRefuseModal] = useState(false);

  ////// USEEFFECT //////

  // 로그인 조회
  useEffect(() => {
    if (st_loadMyInfoDone) {
      if (!me || parseInt(me.level) < 3) {
        moveLinkHandler(`/admin`);
      }
    }
  }, [st_loadMyInfoDone]);

  // 검색 조회
  useEffect(() => {
    dispatch({
      type: BOUGHT_ADMIN_LIST_REQUEST,
      data: {
        isComplete: isComplete,
        date: searchTab,
        type: searchType,
      },
    });
  }, [searchType, searchTab, isComplete]);

  useEffect(() => {
    if (st_boughtAdminListError) {
      return message.error(st_boughtAdminListError);
    }
  }, [st_boughtAdminListError]);

  // 배송정보 등록
  useEffect(() => {
    if (st_boughtDeliveryUpdateDone) {
      dispatch({
        type: BOUGHT_ADMIN_LIST_REQUEST,
        data: {
          isComplete: isComplete,
          date: searchTab,
          type: searchType,
        },
      });

      deliveryModalToggle(null);
      return message.success("배송회사가 등록되었습니다.");
    }
  }, [st_boughtDeliveryUpdateDone]);

  useEffect(() => {
    if (st_boughtDeliveryUpdateError) {
      return message.error(st_boughtDeliveryUpdateError);
    }
  }, [st_boughtDeliveryUpdateError]);

  // 처리완료
  useEffect(() => {
    if (st_boughtCompleteUpdateDone) {
      dispatch({
        type: BOUGHT_ADMIN_LIST_REQUEST,
        data: {
          isComplete: isComplete,
          date: searchTab,
          type: searchType,
        },
      });

      return message.success("처리완료되었습니다.");
    }
  }, [st_boughtCompleteUpdateDone]);

  useEffect(() => {
    if (st_boughtCompleteUpdateError) {
      return message.error(st_boughtCompleteUpdateError);
    }
  }, [st_boughtCompleteUpdateError]);

  // 거절
  useEffect(() => {
    if (st_boughtRefuseUpdateDone) {
      dispatch({
        type: BOUGHT_ADMIN_LIST_REQUEST,
        data: {
          isComplete: isComplete,
          date: searchTab,
          type: searchType,
        },
      });

      refuseModalToggle(null);
      return message.success("거절되었습니다.");
    }
  }, [st_boughtRefuseUpdateDone]);

  useEffect(() => {
    if (st_boughtRefuseUpdateError) {
      return message.error(st_boughtRefuseUpdateError);
    }
  }, [st_boughtRefuseUpdateError]);

  ////// TOGGLE //////

  // 주의사항
  const unitModalToggle = useCallback(() => {
    setUnitModal((prev) => !prev);
  }, [unitModal]);

  // 배송지 등록
  const deliveryModalToggle = useCallback(
    (data) => {
      if (data) {
        setDeliveryData(data);
      } else {
        setDeliveryData(null);
        deliveryForm.resetFields();
      }

      setDeliveryModal((prev) => !prev);
    },
    [deliveryModal, deliveryData]
  );

  // 주문 상세
  const orderDetailModalToggle = useCallback(
    (data) => {
      if (data) {
        setDetailData(data);

        dispatch({
          type: BOUGHT_DETAIL_REQUEST,
          data: {
            id: data.id,
          },
        });
      } else {
        setDetailData(null);
      }

      setOrderDetailModal((prev) => !prev);
    },
    [detailData, orderDetailModal]
  );

  // 거절
  const refuseModalToggle = useCallback(
    (data) => {
      if (data) {
        setDetailData(data);
      } else {
        setDetailData(null);
      }

      refuseForm.resetFields();

      setRefuseModal((prev) => !prev);
    },
    [detailData, refuseModal]
  );

  ////// HANDLER //////

  // 엑셀 다운로드

  const selectCsvHandler = useCallback((data) => {
    let arr = [];

    arr.push({
      viewCreatedAt: data.viewCreatedAt,
      name: data.username,
      email: data.email,
      mobile: data.mobile,
      companyName: data.companyName ? data.companyName : "X",
      companyNo: data.companyNo ? data.companyNo : "X",
      deliveryNo: data.deliveryNo ? data.deliveryNo : "X",
      deliveryCompany: data.deliveryCompany ? data.deliveryCompany : "X",
      viewPayInfo: data.viewPayInfo,
      viewDeliveryStatus: data.viewDeliveryStatus,
    });
    setSelectCsvData(arr);
  }, []);

  // 페이지 이동
  const moveLinkHandler = useCallback((link) => {
    router.push(link);
  }, []);

  // 검색
  const tabChangeHandler = useCallback(
    (tab) => {
      if (tab === 3) {
        setIsComplete(4);
        setSearchType(3);
        return;
      }
      setSearchTab(tab);
    },
    [searchTab, searchType, isComplete]
  );

  const completeChangeHandler = useCallback(
    (complete) => {
      setIsComplete(complete);
    },
    [isComplete]
  );

  const searchTypeHandler = useCallback(
    (type) => {
      setSearchType(type);
    },
    [searchType]
  );

  // 배송지 등록
  const onDeliverySubmit = useCallback(
    (data) => {
      dispatch({
        type: BOUGHT_DELIVERY_UPDATE_REQUEST,
        data: {
          id: deliveryData.id,
          deliveryNo: data.deliveryNo,
          deliveryCompany: data.deliveryCompany,
        },
      });
    },
    [deliveryData]
  );

  // 처리 완료
  const completeHandler = useCallback((data) => {
    dispatch({
      type: BOUGHT_COMPLETE_UPDATE_REQUEST,
      data: {
        id: data.id,
      },
    });
  }, []);

  // 거절
  const refuseHandler = useCallback(
    (data) => {
      dispatch({
        type: BOUGHT_REFUSE_UPDATE_REQUEST,
        data: {
          id: detailData.id,
          content: data.content,
        },
      });
    },
    [detailData]
  );

  ////// DATAVIEW //////

  ////// DATA COLUMNS //////

  const headers = [
    { label: "주문일", key: "viewCreatedAt" },
    { label: "주문자명", key: "name" },
    { label: "주문자이메일", key: "email" },
    { label: "전화번호", key: "mobile" },
    { label: "회사이름", key: "companyName" },
    { label: "사업자번호", key: "companyNo" },
    { label: "운송장번호", key: "deliveryNo" },
    { label: "배송회사", key: "deliveryCompany" },
    { label: "결제방법", key: "viewPayInfo" },
    { label: "배송상태", key: "viewDeliveryStatus" },
  ];

  const columns = [
    {
      key: 1,
      align: "center",
      width: "5%",
      title: "번호",
      dataIndex: "id",
    },
    {
      key: 2,
      align: "center",
      width: "5%",
      title: "유형",
      dataIndex: "viewType",
    },

    {
      key: 3,
      width: "16%",
      title: "상품명",
      dataIndex: "title",
    },

    {
      key: 4,
      width: "10%",
      title: "주문자",
      dataIndex: "username",
    },

    {
      key: 5,
      align: "center",
      width: "8%",
      title: "결제방법",
      dataIndex: "viewPayInfo",
    },

    {
      key: 6,
      align: "center",
      width: "8%",
      title: "결제상태",
      dataIndex: "viewDeliveryStatus",
    },

    {
      key: 8,
      align: "center",
      width: "7%",
      title: "상세정보",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => orderDetailModalToggle(data)}
        >
          상세정보
        </Button>
      ),
    },

    {
      key: 9,
      align: "center",
      width: "7%",
      title: "처리완료",
      render: (data) => (
        <Popconfirm
          title="처리완료하시겠습니까?"
          onConfirm={() => completeHandler(data)}
          okText="처리완료"
          cancelText="취소"
        >
          <Button
            type="primary"
            size="small"
            loading={st_boughtCompleteUpdateLoading}
          >
            처리완료
          </Button>
        </Popconfirm>
      ),
    },

    {
      key: 10,
      align: "center",
      width: "8%",
      title: "배송정보등록",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => deliveryModalToggle(data)}
        >
          배송정보등록
        </Button>
      ),
    },

    {
      key: 11,
      align: "center",
      width: "7%",
      title: "거절하기",
      render: (data) =>
        data.type === 2 ? (
          <Button
            type="danger"
            size="small"
            onClick={() => refuseModalToggle(data)}
          >
            거절하기
          </Button>
        ) : (
          "거절불가"
        ),
    },

    {
      key: 12,
      align: "center",
      width: "7%",
      title: "주문서 다운로드",
      render: (data) => (
        <DownLoadBtn
          filename={`주문서`}
          headers={headers}
          data={selectCsvData}
          onClick={() => selectCsvHandler(data)}
        >
          주문서 다운로드
        </DownLoadBtn>
      ),
    },

    {
      key: 13,
      width: "12%",
      title: "주문일",
      dataIndex: "viewCreatedAt",
    },
  ];
  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["주문 관리", "주문 리스트"]}
        title={`주문 리스트`}
        subTitle={`회원의 주문을 확인하고 관리할 수 있습니다.`}
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
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={searchType === 3 && `primary`}
                onClick={() => searchTypeHandler(3)}
              >
                전체
              </ModalBtn>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={searchType === 1 && `primary`}
                onClick={() => searchTypeHandler(1)}
              >
                약속처방
              </ModalBtn>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={searchType === 2 && `primary`}
                onClick={() => searchTypeHandler(2)}
              >
                탕전처방
              </ModalBtn>
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={isComplete === 4 && `primary`}
                onClick={() => completeChangeHandler(4)}
              >
                전체
              </ModalBtn>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={isComplete === 1 && `primary`}
                onClick={() => completeChangeHandler(1)}
              >
                미처리
              </ModalBtn>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={isComplete === 2 && `primary`}
                onClick={() => completeChangeHandler(2)}
              >
                처리
              </ModalBtn>

              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={isComplete === 3 && `primary`}
                onClick={() => completeChangeHandler(3)}
              >
                거절
              </ModalBtn>
            </Wrapper>

            <Wrapper dr={`row`} ju={`flex-start`} margin={`5px 0 0`}>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={searchTab === 1 && `primary`}
                onClick={() => tabChangeHandler(1)}
              >
                1주일
              </ModalBtn>
              <ModalBtn
                style={{ width: `70px`, padding: `0` }}
                size="small"
                type={searchTab === 2 && `primary`}
                onClick={() => tabChangeHandler(2)}
              >
                1개월
              </ModalBtn>
            </Wrapper>
          </Wrapper>
          <Wrapper width={`50%`} dr={`row`} ju={`flex-end`}>
            <ModalBtn size="small" onClick={() => tabChangeHandler(3)}>
              전체보기
            </ModalBtn>
            <ModalBtn type="danger" size="small" onClick={unitModalToggle}>
              주의사항
            </ModalBtn>
            {csvData && (
              <DownLoadBtn
                style={{ margin: `0 0 0 5px` }}
                headers={headers}
                data={csvData}
                filename={`전체 주문서 다운로드`}
              >
                전체 주문서 다운로드
              </DownLoadBtn>
            )}
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          loading={st_boughtAdminListLoading}
          columns={
            searchType !== 2
              ? isComplete !== 1
                ? columns.filter((data) => data.key !== 9 && data.key !== 11)
                : columns.filter((data) => data.key !== 11)
              : isComplete !== 1
              ? columns.filter((data) => data.key !== 9 && data.key !== 11)
              : columns
          }
          dataSource={adminBoughtList}
          size="small"
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

      {/* DETAIL MODAL */}
      <Modal
        width={`800px`}
        title={`상세정보`}
        visible={orderDetailModal}
        footer={null}
        onCancel={() => orderDetailModalToggle(null)}
      >
        {detailData && (
          <>
            {/* 주문자 정보 & 주문유형 */}
            <Text margin={`0 0 10px`} fontSize={`16px`} fontWeight={`600`}>
              주문자 정보
            </Text>
            <Wrapper
              dr={`row`}
              borderTop={`1px solid ${Theme.subTheme5_C}`}
              height={`50px`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  주문유형
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.viewType}
                </Wrapper>
              </Wrapper>
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  주문자
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.username}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              borderBottom={
                !detailData.companyNo && `1px solid ${Theme.subTheme5_C}`
              }
              height={`50px`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={
                    detailData.companyNo && `1px solid ${Theme.white_C}`
                  }
                >
                  이메일
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={
                    detailData.companyNo && `1px solid ${Theme.subTheme5_C}`
                  }
                >
                  {detailData.email}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={
                    detailData.companyNo && `1px solid ${Theme.white_C}`
                  }
                >
                  전화번호
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={
                    detailData.companyNo && `1px solid ${Theme.subTheme5_C}`
                  }
                >
                  {detailData.mobile}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            {/* 회사 정보 */}
            {detailData.companyNo && (
              <Wrapper dr={`row`} height={`50px`}>
                <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                  <Wrapper
                    width={`100px`}
                    height={`100%`}
                    bgColor={Theme.subTheme5_C}
                    color={Theme.white_C}
                    borderBottom={`1px solid ${Theme.white_C}`}
                  >
                    한의원 이름
                  </Wrapper>
                  <Wrapper
                    width={`calc(100% - 100px)`}
                    height={`100%`}
                    borderBottom={`1px solid ${Theme.subTheme5_C}`}
                  >
                    {detailData.companyName}
                  </Wrapper>
                </Wrapper>

                <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                  <Wrapper
                    width={`100px`}
                    height={`100%`}
                    bgColor={Theme.subTheme5_C}
                    color={Theme.white_C}
                    borderBottom={`1px solid ${Theme.white_C}`}
                  >
                    사업자번호
                  </Wrapper>
                  <Wrapper
                    width={`calc(100% - 100px)`}
                    height={`100%`}
                    borderBottom={`1px solid ${Theme.subTheme5_C}`}
                  >
                    {detailData.companyNo}
                  </Wrapper>
                </Wrapper>
              </Wrapper>
            )}

            {/* 주소 정보 */}
            <Text margin={`20px 0 10px`} fontSize={`16px`} fontWeight={`600`}>
              주소 정보 - 보내는 사람
            </Text>
            <Wrapper
              dr={`row`}
              borderTop={`1px solid ${Theme.subTheme5_C}`}
              height={`50px`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  이름
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.receiveUser}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  전화번호
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.receiveMobile}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              height={`50px`}
              borderBottom={`1px solid ${Theme.subTheme5_C}`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                >
                  주소
                </Wrapper>
                <Wrapper width={`calc(100% - 100px)`} height={`100%`}>
                  {detailData.receiveAddress}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                >
                  상세주소
                </Wrapper>
                <Wrapper width={`calc(100% - 100px)`} height={`100%`}>
                  {detailData.receiveDetailAddress}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Text margin={`20px 0 10px`} fontSize={`16px`} fontWeight={`600`}>
              주소 정보 - 받는 사람
            </Text>
            <Wrapper
              dr={`row`}
              borderTop={`1px solid ${Theme.subTheme5_C}`}
              height={`50px`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  이름
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.sendUser}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                  borderBottom={`1px solid ${Theme.white_C}`}
                >
                  전화번호
                </Wrapper>
                <Wrapper
                  width={`calc(100% - 100px)`}
                  height={`100%`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  {detailData.sendMobile}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Wrapper
              dr={`row`}
              height={`50px`}
              borderBottom={`1px solid ${Theme.subTheme5_C}`}
            >
              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                >
                  주소
                </Wrapper>
                <Wrapper width={`calc(100% - 100px)`} height={`100%`}>
                  {detailData.sendAddress}
                </Wrapper>
              </Wrapper>

              <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                <Wrapper
                  width={`100px`}
                  height={`100%`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                >
                  상세주소
                </Wrapper>
                <Wrapper width={`calc(100% - 100px)`} height={`100%`}>
                  {detailData.sendDetailAddress}
                </Wrapper>
              </Wrapper>
            </Wrapper>

            <Text margin={`20px 0 10px`} fontSize={`16px`} fontWeight={`600`}>
              주소 정보 - 배송시 요청사항
            </Text>
            <Wrapper
              dr={`row`}
              borderTop={`1px solid ${Theme.subTheme5_C}`}
              height={`100px`}
            >
              <Wrapper
                width={`100px`}
                height={`100%`}
                bgColor={Theme.subTheme5_C}
                color={Theme.white_C}
                borderBottom={`1px solid ${Theme.white_C}`}
              >
                요청사항
              </Wrapper>
              <Wrapper
                width={`calc(100% - 100px)`}
                height={`100%`}
                borderBottom={`1px solid ${Theme.subTheme5_C}`}
                padding={`10px`}
                ju={`flex-start`}
                al={`flex-start`}
              >
                {detailData.deliveryMessage}
              </Wrapper>
            </Wrapper>

            {/* 상품정보 */}
            <Text margin={`20px 0 10px`} fontSize={`16px`} fontWeight={`600`}>
              상품정보 - {detailData.viewType}처방
            </Text>
            {console.log(boughtDetail)}

            {boughtDetail && (
              <>
                {boughtDetail.lists.map((data) => {
                  return (
                    <Wrapper
                      key={data.id}
                      padding={`10px`}
                      border={`1px solid ${Theme.subTheme5_C}`}
                      al={`flex-start`}
                      margin={`0 0 10px`}
                    >
                      <Wrapper
                        dr={`row`}
                        borderTop={`1px solid ${Theme.subTheme5_C}`}
                        height={`50px`}
                      >
                        <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                          <Wrapper
                            width={`100px`}
                            height={`100%`}
                            bgColor={Theme.subTheme5_C}
                            color={Theme.white_C}
                            borderBottom={`1px solid ${Theme.white_C}`}
                          >
                            처방명
                          </Wrapper>
                          <Wrapper
                            width={`calc(100% - 100px)`}
                            height={`100%`}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            {data.title}
                          </Wrapper>
                        </Wrapper>

                        <Wrapper dr={`row`} width={`50%`} height={`100%`}>
                          <Wrapper
                            width={`100px`}
                            height={`100%`}
                            bgColor={Theme.subTheme5_C}
                            color={Theme.white_C}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            환자이름
                          </Wrapper>
                          <Wrapper
                            width={`calc(100% - 100px)`}
                            height={`100%`}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            {data.receiverName}
                          </Wrapper>
                        </Wrapper>
                      </Wrapper>

                      <Wrapper dr={`row`} height={`100px`}>
                        <Wrapper
                          width={`100px`}
                          height={`100%`}
                          bgColor={Theme.subTheme5_C}
                          color={Theme.white_C}
                          borderBottom={`1px solid ${Theme.white_C}`}
                        >
                          복약지도
                        </Wrapper>
                        <Wrapper
                          width={`calc(100% - 100px)`}
                          height={`100%`}
                          borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          padding={`10px`}
                          ju={`flex-start`}
                          al={`flex-start`}
                        >
                          {data.medication}
                        </Wrapper>
                      </Wrapper>

                      <Wrapper dr={`row`} height={`100px`}>
                        <Wrapper
                          width={`100px`}
                          height={`100%`}
                          bgColor={Theme.subTheme5_C}
                          color={Theme.white_C}
                          borderBottom={`1px solid ${Theme.white_C}`}
                        >
                          요청사항
                        </Wrapper>
                        <Wrapper
                          width={`calc(100% - 100px)`}
                          height={`100%`}
                          borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          padding={`10px`}
                          ju={`flex-start`}
                          al={`flex-start`}
                        >
                          {data.content}
                        </Wrapper>
                      </Wrapper>

                      <Text
                        margin={`20px 0 10px`}
                        fontSize={`16px`}
                        fontWeight={`600`}
                      >
                        상품정보
                      </Text>
                      {detailData.type === 1 ? (
                        <>
                          <Wrapper
                            dr={`row`}
                            bgColor={Theme.subTheme5_C}
                            color={Theme.white_C}
                            padding={`5px 0`}
                          >
                            <Wrapper width={`calc(100% / 3)`}>종류</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>수량</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>가격</Wrapper>
                          </Wrapper>

                          <Wrapper
                            height={`230px`}
                            overflowY={`auto`}
                            ju={`flex-start`}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            <Wrapper height={`auto`} ju={`flex-start`}>
                              {boughtDetail.items
                                .filter(
                                  (value) =>
                                    value.WishPaymentContainerId === data.id
                                )
                                .map((item) => {
                                  return (
                                    <Wrapper
                                      key={data.id}
                                      dr={`row`}
                                      padding={`5px 0`}
                                      borderBottom={`1px solid ${Theme.subTheme5_C}`}
                                    >
                                      <Wrapper width={`calc(100% / 3)`}>
                                        {item.pack}
                                        &nbsp;/&nbsp;
                                        {item.type}
                                        &nbsp;/&nbsp;
                                        {item.unit}
                                      </Wrapper>
                                      <Wrapper width={`calc(100% / 3)`}>
                                        {item.qnt}개
                                      </Wrapper>
                                      <Wrapper
                                        width={`calc(100% / 3)`}
                                        al={`flex-end`}
                                        padding={`0 5px 0 0`}
                                      >
                                        {item.viewPrice}
                                      </Wrapper>
                                    </Wrapper>
                                  );
                                })}
                            </Wrapper>
                          </Wrapper>
                        </>
                      ) : (
                        <>
                          <Wrapper
                            dr={`row`}
                            padding={`5px 0`}
                            bgColor={Theme.subTheme5_C}
                            color={Theme.white_C}
                          >
                            <Wrapper width={`calc(100% / 3)`}>이름</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>종류</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>가격</Wrapper>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            padding={`5px 0`}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            <Wrapper width={`calc(100% / 3)`}>종류</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>
                              {data.cheob}&nbsp;/&nbsp;
                              {data.pack}
                              &nbsp;/&nbsp;
                              {data.unit}
                            </Wrapper>
                            <Wrapper
                              width={`calc(100% / 3)`}
                              al={`flex-end`}
                              padding={`0 5px 0 0`}
                            >
                              {data.viewPackPrice}
                            </Wrapper>
                          </Wrapper>

                          <Wrapper
                            dr={`row`}
                            bgColor={Theme.subTheme5_C}
                            color={Theme.white_C}
                            padding={`5px 0`}
                          >
                            <Wrapper width={`calc(100% / 3)`}>재료명</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>수량</Wrapper>
                            <Wrapper width={`calc(100% / 3)`}>가격</Wrapper>
                          </Wrapper>

                          <Wrapper
                            height={`230px`}
                            overflowY={`auto`}
                            ju={`flex-start`}
                            borderBottom={`1px solid ${Theme.subTheme5_C}`}
                          >
                            <Wrapper height={`auto`} ju={`flex-start`}>
                              {boughtDetail.items
                                .filter(
                                  (value) =>
                                    value.WishPrescriptionItemId === data.id
                                )
                                .map((item) => {
                                  return (
                                    <Wrapper
                                      key={data.id}
                                      dr={`row`}
                                      padding={`5px 0`}
                                      borderBottom={`1px solid ${Theme.subTheme5_C}`}
                                    >
                                      <Wrapper width={`calc(100% / 3)`}>
                                        {item.name}
                                      </Wrapper>
                                      <Wrapper width={`calc(100% / 3)`}>
                                        {item.qnt}
                                        {item.unit}
                                      </Wrapper>
                                      <Wrapper
                                        width={`calc(100% / 3)`}
                                        al={`flex-end`}
                                        padding={`0 5px 0 0`}
                                      >
                                        {item.viewPrice}
                                      </Wrapper>
                                    </Wrapper>
                                  );
                                })}
                            </Wrapper>
                          </Wrapper>
                        </>
                      )}
                    </Wrapper>
                  );
                })}

                {/* 상품 가격 */}
                <Text
                  margin={`20px 0 10px`}
                  fontSize={`16px`}
                  fontWeight={`600`}
                >
                  상품가격
                </Text>
                <Wrapper
                  dr={`row`}
                  padding={`5px 0`}
                  bgColor={Theme.subTheme5_C}
                  color={Theme.white_C}
                >
                  <Wrapper width={`calc(100% / 2)`}>이름</Wrapper>
                  <Wrapper width={`calc(100% / 2)`}>가격</Wrapper>
                </Wrapper>

                {detailData.type === 2 && (
                  <>
                    <Wrapper
                      dr={`row`}
                      padding={`5px 0`}
                      borderBottom={`1px solid ${Theme.subTheme5_C}`}
                    >
                      <Wrapper width={`calc(100% / 2)`}>탕전</Wrapper>
                      <Wrapper
                        width={`calc(100% / 2)`}
                        al={`flex-end`}
                        padding={`0 5px 0 0`}
                      >
                        {detailData.viewTangjeonPrice}
                      </Wrapper>
                    </Wrapper>

                    <Wrapper
                      dr={`row`}
                      padding={`5px 0`}
                      borderBottom={`1px solid ${Theme.subTheme5_C}`}
                    >
                      <Wrapper width={`calc(100% / 2)`}>조제</Wrapper>
                      <Wrapper
                        width={`calc(100% / 2)`}
                        al={`flex-end`}
                        padding={`0 5px 0 0`}
                      >
                        {detailData.viewPharmacyPrice}
                      </Wrapper>
                    </Wrapper>
                  </>
                )}
                <Wrapper
                  dr={`row`}
                  padding={`5px 0`}
                  borderBottom={`1px solid ${Theme.subTheme5_C}`}
                >
                  <Wrapper width={`calc(100% / 2)`}>배송비</Wrapper>
                  <Wrapper
                    width={`calc(100% / 2)`}
                    al={`flex-end`}
                    padding={`0 5px 0 0`}
                  >
                    {detailData.viewDeliveryPrice}
                  </Wrapper>
                </Wrapper>

                <Wrapper
                  dr={`row`}
                  ju={`flex-end`}
                  margin={`20px 0 10px`}
                  fontSize={`18px`}
                >
                  <Text fontWeight={`600`}>합계 :&nbsp;</Text>
                  <Text fontWeight={`600`}>{detailData.viewTotalPrice}</Text>
                </Wrapper>
              </>
            )}
          </>
        )}
      </Modal>

      {/* DELIVERY MODAL */}
      <Modal
        title="배송회사등록"
        visible={deliveryModal}
        onCancel={() => deliveryModalToggle(null)}
        footer={null}
        width={`600px`}
      >
        <Form
          form={deliveryForm}
          onFinish={onDeliverySubmit}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label="배송회사"
            name="deliveryCompany"
            rules={[{ required: true, message: "배송회사를 입력해주세요." }]}
          >
            <Select placeholder={`배송회사를 선택해주세요.`}>
              <Select.Option value={`CJ대한통운`}>CJ대한통운</Select.Option>
              <Select.Option value={`한진택배`}>한진택배</Select.Option>
              <Select.Option value={`로젠택배`}>로젠택배</Select.Option>
              <Select.Option value={`롯데택배`}>롯데택배</Select.Option>
              <Select.Option value={`경동택배`}>경동택배</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="운송장번호"
            name="deliveryNo"
            rules={[{ required: true, message: "운송장번호를 입력해주세요." }]}
          >
            <Input placeholder="운송장번호를 입력해주세요." />
          </Form.Item>
          <Wrapper dr={`row`} ju={`flex-end`}>
            <ModalBtn size="small" onClick={() => deliveryModalToggle(null)}>
              취소
            </ModalBtn>
            <ModalBtn
              size="small"
              type="primary"
              htmlType="submit"
              loading={st_boughtDeliveryUpdateLoading}
            >
              등록
            </ModalBtn>
          </Wrapper>
        </Form>
      </Modal>

      {/* REFUSE MODAL */}
      <Modal
        title={`거절하기`}
        visible={refuseModal}
        footer={null}
        onCancel={() => refuseModalToggle(null)}
      >
        <GuideLi isImpo>
          한번 거절하면 수정또는 삭제가 안됨므로 신중한 작업을 필요로 합니다.
        </GuideLi>
        <Form form={refuseForm} onFinish={refuseHandler}>
          <Form.Item
            label={`사유`}
            name={`content`}
            rules={[{ required: true, message: "사유를 입력해주세요." }]}
          >
            <Input.TextArea placeholder="사유를 입력해주세요." />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <ModalBtn size="small" onClick={() => refuseModalToggle(null)}>
              취소
            </ModalBtn>
            <ModalBtn
              size="small"
              type="primary"
              htmlType="submit"
              loading={st_boughtRefuseUpdateLoading}
            >
              거절
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
      type: BOUGHT_ADMIN_LIST_REQUEST,
    });

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserDeliAddress);
