import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Col,
  Modal,
  Row,
  Table,
  notification,
  Layout,
  Input,
  message,
} from "antd";
import {
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  QUESTION_UPDATE_REQUEST,
  QUESTION_DELETE_REQUEST,
  QUESTION_GET_REQUEST,
  QUESTION_TYPE_GET_REQUEST,
  GUIDE_MODAL_TOGGLE,
} from "../../../reducers/question";
import { LOAD_MY_INFO_REQUEST } from "../../../reducers/user";
import { useRouter } from "next/router";
import useInput from "../../../hooks/useInput";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  ColWrapper,
  RowWrapper,
  GuideLi,
  GuideUl,
  ModalBtn,
  Wrapper,
} from "../../../components/commonComponents";
import { saveAs } from "file-saver";
import Theme from "../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

const DangerModal = styled(ModalBtn)`
  margin-left: 0;
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const List = ({ location }) => {
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

  ////// HOOKS //////
  const dispatch = useDispatch();

  const [updateData, setUpdateData] = useState(null);

  const [deletePopVisible, setDeletePopVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const answer = useInput("");

  const {
    questions,
    types,
    updateModal,
    guideModal,

    st_questionUpdateDone,
    st_questionDeleteDone,

    st_questionUpdateError,
    st_questionDeleteError,
  } = useSelector((state) => state.question);

  ////// USEEFFECT //////
  useEffect(() => {
    const qs = router.query;

    dispatch({
      type: QUESTION_TYPE_GET_REQUEST,
    });

    dispatch({
      type: QUESTION_GET_REQUEST,
      data: { listType: qs.type ? qs.type : 3 },
    });
  }, [router.query]);

  useEffect(() => {
    if (st_questionUpdateDone) {
      const qs = router.query;

      dispatch({
        type: QUESTION_GET_REQUEST,
        data: { listType: qs.type ? qs.type : 3 },
      });

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });
    }
  }, [st_questionUpdateDone]);

  useEffect(() => {
    if (st_questionUpdateError) {
      return message.error(st_questionUpdateError);
    }
  }, [st_questionUpdateError]);

  useEffect(() => {
    if (st_questionDeleteDone) {
      const qs = router.query;

      dispatch({
        type: QUESTION_GET_REQUEST,
        data: { listType: qs.type ? qs.type : 3 },
      });
    }
  }, [st_questionDeleteDone]);

  useEffect(() => {
    if (st_questionDeleteError) {
      return message.error(st_questionDeleteError);
    }
  }, [st_questionDeleteError]);

  ////// TOGGLE //////

  const updateModalOpen = useCallback(
    (data) => {
      dispatch({
        type: UPDATE_MODAL_OPEN_REQUEST,
      });

      let type = "";

      for (let i = 0; i < types.length; i++) {
        if (data.QuestionTypeId === types[i].id) {
          type = types[i].value;
        }
      }

      answer.setValue(data.answer);
      setUpdateData({ ...data, type });
    },
    [updateModal, types]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: UPDATE_MODAL_CLOSE_REQUEST,
    });
    setUpdateData(null);
  }, [updateModal]);

  const deletePopToggle = useCallback(
    (id) => () => {
      setDeleteId(id);
      setDeletePopVisible((prev) => !prev);
    },
    [deletePopVisible, deleteId]
  );

  ////// HANDLER //////
  const onSubmitUpdate = useCallback(() => {
    if (!answer.value || answer.value.trim() === "") {
      return LoadNotification("ADMIN SYSTEM ERRLR", "문의 답변을 입력해주세요");
    }

    dispatch({
      type: QUESTION_UPDATE_REQUEST,
      data: {
        id: updateData.id,
        answer: answer.value,
        title: updateData.title,
        content: updateData.content,
      },
    });
  }, [updateData, answer]);

  const deleteQuestionHandler = useCallback(() => {
    if (!deleteId) {
      return LoadNotification(
        "ADMIN SYSTEM ERRLR",
        "일시적인 장애가 발생되었습니다. 잠시 후 다시 시도해주세요."
      );
    }

    dispatch({
      type: QUESTION_DELETE_REQUEST,
      data: { questionId: deleteId },
    });

    setDeleteId(null);
    setDeletePopVisible((prev) => !prev);
  }, [deleteId]);

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

  const guideModalToggle = useCallback(() => {
    dispatch({
      type: GUIDE_MODAL_TOGGLE,
    });
  }, [guideModal]);
  ////// DATAVIEW //////

  // Table
  const columns = [
    {
      title: "번호",
      render: (data) => <Wrapper>{data.id}</Wrapper>,
      width: "3%",
    },

    {
      title: "제목",
      render: (data) => <div>{data.title}</div>,
    },
    {
      title: "처리여부",
      render: (data) => <div>{data.isCompleted ? `완료` : `미완료`}</div>,
      width: "5%",
    },
    ,
    {
      title: "생성일",
      render: (data) => {
        return <div>{data.createdAt.substring(0, 10)}</div>;
      },
      width: "7%",
    },
    {
      title: "처리일",
      render: (data) => <div>{data.updatedAt.substring(0, 10)}</div>,
      width: "7%",
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => updateModalOpen(data)}
        >
          수정
        </Button>
      ),
      width: "5%",
    },
    {
      title: "삭제",
      render: (data) => (
        <Button type="danger" size="small" onClick={deletePopToggle(data.id)}>
          삭제
        </Button>
      ),
      width: "5%",
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["문의 관리", "문의 리스트"]}
        title={`문의 리스트`}
        subTitle={`홈페이지의 문의를 관리할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <RowWrapper margin={`0 0 10px 0`} gutter={5}>
          <Col>
            <Button
              size="small"
              onClick={() => moveLinkHandler(`/admin/question/list?type=3`)}
            >
              전체
            </Button>
          </Col>
          <Col>
            <Button
              size="small"
              onClick={() => moveLinkHandler(`/admin/question/list?type=2`)}
            >
              처리완료
            </Button>
          </Col>
          <Col>
            <Button
              size="small"
              onClick={() => moveLinkHandler(`/admin/question/list?type=1`)}
            >
              미처리
            </Button>
          </Col>
          <Col>
            <DangerModal type="danger" size="small" onClick={guideModalToggle}>
              주의사항
            </DangerModal>
          </Col>
        </RowWrapper>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={questions ? questions : []}
          size="middle"
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
          <GuideLi>
            문의사항은 사용자가 직접 관리자에게 문의하는 문의글 입니다.
          </GuideLi>
          <GuideLi isImpo={true}>
            삭제된 문의는 다시 복구할 수 없습니다. 신중한 작업을 필요로 합니다.
          </GuideLi>
          <GuideLi>
            수정버튼을 클릭 후 내용을 확인할 수 있으며, 처리완료버튼을 클릭시
            문의는 완료됨으로 처리됩니다.
          </GuideLi>
          <GuideLi isImpo={true}>
            메모를 적지 않으면 처리완료 할 수 없습니다.
          </GuideLi>
          <GuideLi>
            처리완료버튼을 누르지 않고 취소를 누를경우, 문의는 미처리 상태로
            남게 됩니다.
          </GuideLi>
          <GuideLi isImpo={true}>
            메모를 적어도 사용자에게 전달되지 않습니다.
          </GuideLi>
          <GuideLi>
            문의가 필요한 경우 (주)4LEAF SOFTWARE 1600-4198로 연락부탁드립니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* Update Modal */}
      <Modal
        visible={updateModal}
        width={`1000px`}
        title={`문의`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
        okText="처리완료"
        cancelText="취소"
      >
        <RowWrapper padding={`50px`}>
          <ColWrapper span={24}>
            {/*  */}
            <RowWrapper gutter={5} margin={`0 0 10px`}>
              <ColWrapper
                width={`120px`}
                height={`30px`}
                bgColor={Theme.basicTheme_C}
                height={`30px`}
                color={Theme.white_C}
              >
                문의 제목
              </ColWrapper>
              <ColWrapper>{updateData && updateData.title}</ColWrapper>
            </RowWrapper>
            {/*  */}
            <RowWrapper gutter={5} margin={`0 0 20px`}>
              <ColWrapper
                span={24}
                bgColor={Theme.basicTheme_C}
                color={Theme.white_C}
              >
                문의 내용
              </ColWrapper>
              <ColWrapper>{updateData && updateData.content}</ColWrapper>
            </RowWrapper>
          </ColWrapper>
          <ColWrapper span={24}>
            <ColWrapper
              bgColor={Theme.basicTheme_C}
              width={`100%`}
              color={Theme.white_C}
            >
              메모
            </ColWrapper>
            <Input.TextArea
              allowClear
              placeholder="Content..."
              autoSize={{ minRows: 10, maxRows: 10 }}
              {...answer}
            />
          </ColWrapper>
        </RowWrapper>
      </Modal>

      <Modal
        visible={deletePopVisible}
        onOk={() => deleteQuestionHandler()}
        onCancel={() => {}}
        title="Ask"
      ></Modal>
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default List;
