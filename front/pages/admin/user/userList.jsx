import React, { useCallback, useEffect, useRef, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import PageHeader from "../../../components/admin/PageHeader";
import AdminTop from "../../../components/admin/AdminTop";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  LOAD_MY_INFO_REQUEST,
  UPDATE_MODAL_CLOSE_REQUEST,
  UPDATE_MODAL_OPEN_REQUEST,
  USERLIST_REQUEST,
  USERLIST_UPDATE_REQUEST,
  DETAIL_MODAL_TOGGLE,
  UNIT_MODAL_TOGGLE,
  LICENSENO_UPDATE_REQUEST,
} from "../../../reducers/user";
import {
  Table,
  Button,
  Image,
  message,
  Modal,
  Select,
  notification,
  Input,
  Form,
  Switch,
} from "antd";
import useInput from "../../../hooks/useInput";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter, withRouter } from "next/router";
import wrapper from "../../../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import {
  Wrapper,
  GuideUl,
  GuideLi,
  ModalBtn,
} from "../../../components/commonComponents";
import { saveAs } from "file-saver";
import Theme from "../../../components/Theme";

const AdminContent = styled.div`
  padding: 20px;
`;

const AdminText = styled.span`
  margin: 0 0 0 10px;
  color: ${Theme.grey_C};
`;

const LoadNotification = (msg, content) => {
  notification.open({
    message: msg,
    description: content,
    onClick: () => {},
  });
};

const DownloadA = styled.a`
  font-size: 15px;
  margin: 0;
`;

const UserList = ({}) => {
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

  const {
    users,
    updateModal,
    detailModal,
    unitModal,
    //
    st_userListUpdateDone,
    st_userListError,
    st_userListUpdateError,
    //
    st_licenseNoUpdateDone,
    st_licenseNoUpdateError,
  } = useSelector((state) => state.user);

  const [updateData, setUpdateData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [companyFile, setCompanyFile] = useState(null);
  const [isCompany, setIsCompany] = useState(false);
  const [bFile, setBFile] = useState(null); // 자격증

  const [licenseModal, setLicenseModal] = useState(false); // 라이선스 모달
  const [licenseData, setLicenseData] = useState(false); // 라이선스 모달

  const inputName = useInput("");
  const inputEmail = useInput("");

  const inputSort = useInput("1");
  const inputLevel = useInput("");

  const [dForm] = Form.useForm();
  const dFormRef = useRef();

  const [licenseForm] = Form.useForm();

  ////// USEEFFECT //////
  useEffect(() => {
    const query = router.query;

    dispatch({
      type: USERLIST_REQUEST,
      data: {
        name: query.name ? query.name : ``,
        email: query.email ? query.email : ``,
        listType: query.sort,
      },
    });
  }, [router.query]);

  useEffect(() => {
    if (detailData) {
      onFill(detailData);
    }
  }, [detailData]);

  useEffect(() => {
    if (st_userListUpdateDone) {
      const query = router.query;

      dispatch({
        type: UPDATE_MODAL_CLOSE_REQUEST,
      });

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
        },
      });
    }
  }, [st_userListUpdateDone]);

  useEffect(() => {
    if (st_userListError) {
      return message.error(st_userListError);
    }
  }, [st_userListError]);

  useEffect(() => {
    if (st_userListUpdateError) {
      return message.error(st_userListUpdateError);
    }
  }, [st_userListUpdateError]);

  useEffect(() => {
    router.push(
      `/admin/user/userList?name=${inputName.value}&email=${inputEmail.value}&sort=${inputSort.value}`
    );
  }, [inputSort.value]);

  // 면허번호 등록

  useEffect(() => {
    if (st_licenseNoUpdateDone) {
      const query = router.query;

      dispatch({
        type: USERLIST_REQUEST,
        data: {
          name: query.name ? query.name : ``,
          email: query.email ? query.email : ``,
          listType: query.sort,
        },
      });

      licenseNoUpdateModal(false);

      return message.success("면허번호가 등록되었습니다.");
    }
  }, [st_licenseNoUpdateDone]);

  useEffect(() => {
    if (st_licenseNoUpdateError) {
      return message.error(st_licenseNoUpdateError);
    }
  }, [st_licenseNoUpdateError]);

  ////// TOGGLE //////
  const updateModalOpen = useCallback(
    (data) => {
      if (data.level !== 5) {
        dispatch({
          type: UPDATE_MODAL_OPEN_REQUEST,
        });

        setUpdateData(data);
        inputLevel.setValue(data.level);
      } else {
        return message.error("권한이 개발사인 회원은 수정할 수 없습니다.");
      }
    },
    [updateModal]
  );

  const updateModalClose = useCallback(() => {
    dispatch({
      type: UPDATE_MODAL_CLOSE_REQUEST,
    });
  }, [updateModal]);

  const detailModalToggle = useCallback(
    (data) => {
      if (data) {
        setDetailData(data);
      } else {
        setCompanyFile(null);
        setBFile(null);
        setDetailData(null);
        setIsCompany(false);
        dForm.resetFields();
      }
      dispatch({
        type: DETAIL_MODAL_TOGGLE,
      });
    },
    [detailData, companyFile, isCompany]
  );

  const unitModalToggle = useCallback(() => {
    dispatch({
      type: UNIT_MODAL_TOGGLE,
    });
  }, [unitModal]);

  const licenseNoUpdateModal = useCallback(
    (data) => {
      if (data) {
        setLicenseData(data);
      } else {
        setLicenseData(null);
        licenseForm.resetFields();
      }
      setLicenseModal((prev) => !prev);
    },
    [licenseModal, licenseData]
  );

  ////// HANDLER //////

  const fileDownloadHandler = useCallback(async (filePath) => {
    let blob = await fetch(filePath).then((r) => r.blob());

    const file = new Blob([blob]);

    const ext = filePath.substring(
      0,
      filePath.lastIndexOf(".") + 1,
      filePath.length
    );

    const originName = `첨부파일.${ext}`;
    saveAs(file, originName);
  });

  const onFill = useCallback(
    (data) => {
      dFormRef.current.setFieldsValue({
        username: data.username,
        nickname: data.nickname,
        email: data.email,
        mobile: data.mobile,
        level:
          data.level === 1
            ? "일반회원"
            : data.level === 2
            ? `비어있음`
            : data.level === 3
            ? `운영자`
            : data.level === 4
            ? `최고관리자`
            : `개발사`,
        createdAt: data.createdAt.split("T")[0],
        updatedAt: data.updatedAt.split("T")[0],
        companyName: data.companyName,
        companyNo: data.companyNo,
      });
      setIsCompany(data.isCompany);
      setCompanyFile(data.companyFile);
      setBFile(data.businessFile);
    },
    [dFormRef, companyFile, bFile]
  );

  const userAllViewHandler = useCallback(() => {
    router.push(`/admin/user/userList?name=&email=&sort=1`);
  }, []);

  const onSubmitUpdate = useCallback(() => {
    if (updateData.level === inputLevel.value) {
      return LoadNotification(
        "ADMIN SYSTEM ERRLR",
        "현재 사용자와 같은 레벨로 수정할 수 없습니다.."
      );
    }

    dispatch({
      type: USERLIST_UPDATE_REQUEST,
      data: {
        selectUserId: updateData.id,
        changeLevel: inputLevel.value,
      },
    });
  }, [inputLevel]);

  const licenseNoUpdateHandler = useCallback(
    (data) => {
      dispatch({
        type: LICENSENO_UPDATE_REQUEST,
        data: {
          id: licenseData.id,
          licenseNo: data.licenseNo,
        },
      });
    },
    [licenseData]
  );

  ////// DATAVIEW //////

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
    },

    {
      title: "이름",
      render: (data) => <div>{data.username}</div>,
    },
    {
      title: "닉네임",
      render: (data) => <div>{data.nickname}</div>,
    },
    {
      title: "이메일",
      render: (data) => <div>{data.email}</div>,
    },
    {
      title: "모바일",
      render: (data) => <div>{data.mobile}</div>,
    },
    {
      title: "권한",
      render: (data) => (
        <div>
          {data.level === 1
            ? "일반회원"
            : data.level === 2
            ? `비어있음`
            : data.level === 3
            ? `운영자`
            : data.level === 4
            ? `최고관리자`
            : `개발사`}
        </div>
      ),
    },
    {
      title: "회사승인",
      dataIndex: "isCompany",
      render: (data) => <Switch checked={data} disabled />,
    },
    {
      title: "권한수정",
      render: (data) => (
        <Button
          type="primary"
          onClick={() => updateModalOpen(data)}
          size="small"
        >
          권한수정
        </Button>
      ),
    },
    {
      title: "상세정보",
      render: (data) => (
        <Button
          type="primary"
          onClick={() => detailModalToggle(data)}
          size="small"
        >
          상세정보
        </Button>
      ),
    },
    {
      title: "면허번호 등록",
      render: (data) => (
        <Button
          type="primary"
          onClick={() => licenseNoUpdateModal(data)}
          size="small"
        >
          면허번호 등록
        </Button>
      ),
    },

    // {
    //   title: "DELETE",
    //   render: (data) => (
    //     <Button type="danger" onClick={deletePopToggle(data.id)}>
    //       DEL
    //     </Button>
    //   ),
    // },
  ];

  return (
    <AdminLayout>
      <PageHeader
        breadcrumbs={["회원 관리", "관리"]}
        title={`회원 리스트`}
        subTitle={`홈페이지에 가입한 회원를 확인할 수 있습니다.`}
      />
      {/* <AdminTop createButton={true} createButtonAction={() => {})} /> */}

      <AdminContent>
        <Wrapper dr={`row`} ju={`space-between`}>
          <Input.Group compact style={{ width: `90%`, margin: ` 0 0 10px 0` }}>
            <Select
              defaultValue="1"
              style={{ width: "10%" }}
              value={inputSort.value}
              onChange={(data) => inputSort.setValue(data)}
            >
              <Select.Option value="1">최근 가입일</Select.Option>
              <Select.Option value="2">이름순</Select.Option>
            </Select>
            <Input
              style={{ width: "20%" }}
              placeholder="사용자명"
              {...inputName}
            />
            <Input
              style={{ width: "20%" }}
              placeholder="이메일"
              {...inputEmail}
            />
            <Button
              onClick={() =>
                moveLinkHandler(
                  `/admin/user/userList?name=${inputName.value}&email=${inputEmail.value}`
                )
              }
            >
              <SearchOutlined />
              검색
            </Button>
          </Input.Group>
          <Wrapper width={`auto`} dr={`row`}>
            <Button type="dashed" size="small" onClick={userAllViewHandler}>
              전체조회
            </Button>
            <Button
              size="small"
              type="danger"
              style={{ margin: `0 0 0 5px` }}
              onClick={unitModalToggle}
            >
              주의사항
            </Button>
          </Wrapper>
        </Wrapper>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users ? users : []}
          size="small"
        />
      </AdminContent>

      {/* UPDATE MODAL */}

      <Modal
        visible={updateModal}
        width={`400px`}
        title={`사용자 권한 수정`}
        onCancel={updateModalClose}
        onOk={onSubmitUpdate}
      >
        <Wrapper padding={`10px`} al={`flex-start`}>
          <div>사용자 권한</div>
          <Select
            defaultValue="1"
            style={{ width: "100%" }}
            value={
              parseInt(inputLevel.value) === 1
                ? "일반회원"
                : parseInt(inputLevel.value) === 2
                ? `비어있음`
                : parseInt(inputLevel.value) === 3
                ? `운영자`
                : parseInt(inputLevel.value) === 4
                ? `최고관리자`
                : `개발사`
            }
            onChange={(data) => inputLevel.setValue(data)}
          >
            <Select.Option value="1">일반회원</Select.Option>
            <Select.Option value="3">운영자</Select.Option>
            <Select.Option value="4">최고관리자</Select.Option>
          </Select>
        </Wrapper>
      </Modal>

      {/* UNIT MODAL */}

      <Modal
        title="주의사항"
        width="600px"
        visible={unitModal}
        footer={null}
        onCancel={unitModalToggle}
      >
        <GuideUl>
          <GuideLi isImpo={true}>
            사용자의 정보의 경우 개인정보로 인해 관리자가 직접 수정이
            불가능합니다.
          </GuideLi>
          <GuideLi>현재 가입된 사용자의 정보를 확인할 수 있습니다.</GuideLi>
          <GuideLi>
            기능사용 문의 및 추가기능개발은 (주)4LEAF SOFTWARE 1600-4198로
            연락바랍니다.
          </GuideLi>
        </GuideUl>
      </Modal>

      {/* DETAIL MODAL */}

      <Modal
        width="1000px"
        title="상세정보"
        visible={detailModal}
        onCancel={() => detailModalToggle(null)}
        footer={null}
      >
        <Form
          form={dForm}
          ref={dFormRef}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 21 }}
        >
          <GuideUl>
            <GuideLi isImpo={true}>
              회원정보는 개인정보보호법에 의거하여 관리자가 임의로 수정할 수
              없습니다.
            </GuideLi>
          </GuideUl>
          <Form.Item name="username" label="이름">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="nickname" label="닉네임">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="email" label="이메일">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="mobile" label="전화번호">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="level" label="권한">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="createdAt" label="생성일">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="updatedAt" label="수정일">
            <Input readOnly />
          </Form.Item>

          {isCompany && (
            <>
              <Form.Item name="companyName" label="회사이름">
                <Input readOnly />
              </Form.Item>
              <Form.Item name="companyNo" label="사업자번호">
                <Input readOnly />
              </Form.Item>
              <Form.Item name="companyFile" label="사업첨부파일">
                <Button
                  size="small"
                  type="dashed"
                  onClick={() => fileDownloadHandler(companyFile)}
                >
                  첨부파일
                </Button>
                <AdminText>
                  * 첨부파일 클릭시 첨부파일이 다운로드 됩니다.
                </AdminText>
              </Form.Item>
            </>
          )}

          {bFile && (
            <Form.Item name="bFile" label="한의사면허증">
              <DownloadA href={bFile} download={bFile}>
                <Button size="small" type="dashed">
                  첨부파일
                </Button>
              </DownloadA>

              <AdminText>
                * 첨부파일 클릭시 첨부파일이 다운로드 됩니다.
              </AdminText>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        visible={licenseModal}
        footer={null}
        onOk={() => {}}
        onCancel={() => licenseNoUpdateModal(null)}
        title="면허번호 등록"
      >
        <Form form={licenseForm} onFinish={licenseNoUpdateHandler}>
          <Form.Item
            label={`면허번호 등록`}
            name={`licenseNo`}
            rules={[{ required: true, message: "면허번호를 입력해주세요." }]}
          >
            <Input placeholder="면허번호를 입력해주세요." />
          </Form.Item>

          <Wrapper dr={`row`} ju={`flex-end`}>
            <Button onClick={() => licenseNoUpdateModal(null)} size="small">
              취소
            </Button>
            <ModalBtn htmlType="submit" size="small" type="primary">
              등록
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

    // 구현부 종료
    context.store.dispatch(END);
    console.log("🍀 SERVER SIDE PROPS END");
    await context.store.sagaTask.toPromise();
  }
);

export default withRouter(UserList);
