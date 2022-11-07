import produce from "../util/produce";

export const initailState = {
  me: null,
  currentAdminMenu: [],
  users: null,
  cardInfo: null,
  filePath: null,
  companyFilePath: null,
  userBoughtList: null,
  email: null, // 이메일 찾기

  companyUserLists: null,

  secretCode: null,

  updateModal: false,
  unitModal: false,
  detailModal: false,

  operatorModal: false,
  operatorUnitModal: false,

  companyUnitModal: false,

  companyDetailModal: false,
  companyRefusalModal: false,

  //
  st_loginLoading: false,
  st_loginDone: false,
  st_loginError: null,
  //
  st_loginAdminLoading: false,
  st_loginAdminDone: false,
  st_loginAdminError: null,
  //
  st_logoutLoading: false,
  st_logoutDone: false,
  st_logoutError: null,
  //
  st_signUpLoading: false,
  st_signUpDone: false,
  st_signUpError: null,
  //
  st_userListLoading: false,
  st_userListDone: false,
  st_userListError: null,
  //
  st_userListUpdateLoading: false,
  st_userListUpdateDone: false,
  st_userListUpdateError: null,
  //
  st_loadMyInfoLoading: false, // 로그인 정보 가져오기 시도 중
  st_loadMyInfoDone: false,
  st_loadMyInfoError: null,
  //
  st_kakaoLoginLoading: false,
  st_kakaoLoginDone: false,
  st_kakaoLoginError: null,
  //
  st_companyListLoading: false,
  st_companyListDone: false,
  st_companyListError: null,
  //
  st_companyCreateLoading: false,
  st_companyCreateDone: false,
  st_companyCreateError: null,
  //
  st_companyRefusalLoading: false, // 회사 거절
  st_companyRefusalDone: false,
  st_companyRefusalError: null,
  //
  st_companyApprovalLoading: false, // 회사 승인
  st_companyApprovalDone: false,
  st_companyApprovalError: null,
  //
  st_companyOperatorLoading: false, // 회사 운영레벨 변경
  st_companyOperatorDone: false,
  st_companyOperatorError: null,
  //
  st_cardPatchLoading: false, // 카드 생성
  st_cardPatchDone: false,
  st_cardPatchError: null,
  //
  st_cardGetLoading: false, // 카드 데이터 가져오기
  st_cardGetDone: false,
  st_cardGetError: null,
  //
  st_checkCodeLoading: false, // 이메일 인증번호 보내기
  st_checkCodeDone: false,
  st_checkCodeError: null,
  //
  st_fileUploadLoading: false, // 첨부파일
  st_fileUploadDone: false,
  st_fileUploadError: null,
  //
  st_userExitLoading: false, // 회원탈퇴
  st_userExitDone: false,
  st_userExitError: null,
  //
  st_userBoughtListLoading: false, // 주문내역
  st_userBoughtListDone: false,
  st_userBoughtListError: null,
  //
  st_userModifyPassUpdateLoading: false, // 비밀번호 변경
  st_userModifyPassUpdateDone: false,
  st_userModifyPassUpdateError: null,
  //
  st_findEmailLoading: false, // 이메일 찾기
  st_findEmailDone: false,
  st_findEmailError: null,
  //
  st_companyFileUploadLoading: false, // 파일 업로드
  st_companyFileUploadDone: false, // 파일 업로드
  st_companyFileUploadError: null, // 파일 업로드
  //
  st_licenseNoUpdateLoading: false, // 면허번호
  st_licenseNoUpdateDone: false, // 면허번호
  st_licenseNoUpdateError: null, // 면허번호
  //
  st_userIspermissionLoading: false, // 회원승인
  st_userIspermissionDone: false,
  st_userIspermissionError: null,
  //
  st_userIsStopLoading: false, // 이용정지
  st_userIsStopDone: false,
  st_userIsStopError: null,
  //
  st_userDiscountUpdateLoading: false, // 회원별 할인 금액 수정
  st_userDiscountUpdateDone: false,
  st_userDiscountUpdateError: null,
  //
  st_userMonthPayToggleLoading: false, // 월말결제 토글
  st_userMonthPayToggleDone: false,
  st_userMonthPayToggleError: null,
};

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGIN_ADMIN_REQUEST = "LOGIN_ADMIN_REQUEST";
export const LOGIN_ADMIN_SUCCESS = "LOGIN_ADMIN_SUCCESS";
export const LOGIN_ADMIN_FAILURE = "LOGIN_ADMIN_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const USERLIST_REQUEST = "USERLIST_REQUEST";
export const USERLIST_SUCCESS = "USERLIST_SUCCESS";
export const USERLIST_FAILURE = "USERLIST_FAILURE";

export const USERLIST_UPDATE_REQUEST = "USERLIST_UPDATE_REQUEST";
export const USERLIST_UPDATE_SUCCESS = "USERLIST_UPDATE_SUCCESS";
export const USERLIST_UPDATE_FAILURE = "USERLIST_UPDATE_FAILURE";

export const LOAD_MY_INFO_REQUEST = "LOAD_MY_INFO_REQUEST";
export const LOAD_MY_INFO_SUCCESS = "LOAD_MY_INFO_SUCCESS";
export const LOAD_MY_INFO_FAILURE = "LOAD_MY_INFO_FAILURE";

export const KAKAO_LOGIN_REQUEST = "KAKAO_LOGIN_REQUEST";
export const KAKAO_LOGIN_SUCCESS = "KAKAO_LOGIN_SUCCESS";
export const KAKAO_LOGIN_FAILURE = "KAKAO_LOGIN_FAILURE";

export const COMPANY_LIST_REQUEST = "COMPANY_LIST_REQUEST";
export const COMPANY_LIST_SUCCESS = "COMPANY_LIST_SUCCESS";
export const COMPANY_LIST_FAILURE = "COMPANY_LIST_FAILURE";

export const COMPANY_SUBMIT_REQUEST = "COMPANY_SUBMIT_REQUEST";
export const COMPANY_SUBMIT_SUCCESS = "COMPANY_SUBMIT_SUCCESS";
export const COMPANY_SUBMIT_FAILURE = "COMPANY_SUBMIT_FAILURE";

export const COMPANY_UPLOAD_REQUEST = "COMPANY_UPLOAD_REQUEST";
export const COMPANY_UPLOAD_SUCCESS = "COMPANY_UPLOAD_SUCCESS";
export const COMPANY_UPLOAD_FAILURE = "COMPANY_UPLOAD_FAILURE";

export const COMPANY_REFUSAL_REQUEST = "COMPANY_REFUSAL_REQUEST";
export const COMPANY_REFUSAL_SUCCESS = "COMPANY_REFUSAL_SUCCESS";
export const COMPANY_REFUSAL_FAILURE = "COMPANY_REFUSAL_FAILURE";

export const COMPANY_APPROVAL_REQUEST = "COMPANY_APPROVAL_REQUEST";
export const COMPANY_APPROVAL_SUCCESS = "COMPANY_APPROVAL_SUCCESS";
export const COMPANY_APPROVAL_FAILURE = "COMPANY_APPROVAL_FAILURE";

export const COMPANY_OPERATOR_REQUEST = "COMPANY_OPERATOR_REQUEST";
export const COMPANY_OPERATOR_SUCCESS = "COMPANY_OPERATOR_SUCCESS";
export const COMPANY_OPERATOR_FAILURE = "COMPANY_OPERATOR_FAILURE";

export const CARD_PATCH_REQUEST = "CARD_PATCH_REQUEST";
export const CARD_PATCH_SUCCESS = "CARD_PATCH_SUCCESS";
export const CARD_PATCH_FAILURE = "CARD_PATCH_FAILURE";

export const CARD_GET_REQUEST = "CARD_GET_REQUEST";
export const CARD_GET_SUCCESS = "CARD_GET_SUCCESS";
export const CARD_GET_FAILURE = "CARD_GET_FAILURE";

export const CHECKCODE_REQUEST = "CHECKCODE_REQUEST";
export const CHECKCODE_SUCCESS = "CHECKCODE_SUCCESS";
export const CHECKCODE_FAILURE = "CHECKCODE_FAILURE";

export const FILE_UPLOAD_REQUEST = "FILE_UPLOAD_REQUEST";
export const FILE_UPLOAD_SUCCESS = "FILE_UPLOAD_SUCCESS";
export const FILE_UPLOAD_FAILURE = "FILE_UPLOAD_FAILURE";

export const USER_EXIT_REQUEST = "USER_EXIT_REQUEST";
export const USER_EXIT_SUCCESS = "USER_EXIT_SUCCESS";
export const USER_EXIT_FAILURE = "USER_EXIT_FAILURE";

export const USER_BOUGHT_LIST_REQUEST = "USER_BOUGHT_LIST_REQUEST";
export const USER_BOUGHT_LIST_SUCCESS = "USER_BOUGHT_LIST_SUCCESS";
export const USER_BOUGHT_LIST_FAILURE = "USER_BOUGHT_LIST_FAILURE";

export const MODIFYPASS_REQUEST = "MODIFYPASS_REQUEST";
export const MODIFYPASS_SUCCESS = "MODIFYPASS_SUCCESS";
export const MODIFYPASS_FAILURE = "MODIFYPASS_FAILURE";

export const MODIFYPASS_UPDATE_REQUEST = "MODIFYPASS_UPDATE_REQUEST";
export const MODIFYPASS_UPDATE_SUCCESS = "MODIFYPASS_UPDATE_SUCCESS";
export const MODIFYPASS_UPDATE_FAILURE = "MODIFYPASS_UPDATE_FAILURE";

export const FIND_EMAIL_REQUEST = "FIND_EMAIL_REQUEST";
export const FIND_EMAIL_SUCCESS = "FIND_EMAIL_SUCCESS";
export const FIND_EMAIL_FAILURE = "FIND_EMAIL_FAILURE";

export const LICENSENO_UPDATE_REQUEST = "LICENSENO_UPDATE_REQUEST";
export const LICENSENO_UPDATE_SUCCESS = "LICENSENO_UPDATE_SUCCESS";
export const LICENSENO_UPDATE_FAILURE = "LICENSENO_UPDATE_FAILURE";

export const USER_ISPERMISSION_REQUEST = "USER_ISPERMISSION_REQUEST";
export const USER_ISPERMISSION_SUCCESS = "USER_ISPERMISSION_SUCCESS";
export const USER_ISPERMISSION_FAILURE = "USER_ISPERMISSION_FAILURE";

export const USER_ISSTOP_REQUEST = "USER_ISSTOP_REQUEST";
export const USER_ISSTOP_SUCCESS = "USER_ISSTOP_SUCCESS";
export const USER_ISSTOP_FAILURE = "USER_ISSTOP_FAILURE";

export const USER_DISCOUNT_UPDATE_REQUEST = "USER_DISCOUNT_UPDATE_REQUEST";
export const USER_DISCOUNT_UPDATE_SUCCESS = "USER_DISCOUNT_UPDATE_SUCCESS";
export const USER_DISCOUNT_UPDATE_FAILURE = "USER_DISCOUNT_UPDATE_FAILURE";

export const USER_MONTHPAY_TOGGLE_REQUEST = "USER_MONTHPAY_TOGGLE_REQUEST";
export const USER_MONTHPAY_TOGGLE_SUCCESS = "USER_MONTHPAY_TOGGLE_SUCCESS";
export const USER_MONTHPAY_TOGGLE_FAILURE = "USER_MONTHPAY_TOGGLE_FAILURE";

export const UPDATE_MODAL_OPEN_REQUEST = "UPDATE_MODAL_OPEN_REQUEST";
export const UPDATE_MODAL_CLOSE_REQUEST = "UPDATE_MODAL_CLOSE_REQUEST";

export const CURRENT_ADMINMENU_STATUS = "CURRENT_ADMINMENU_STATUS";

export const COMPANY_DETAIL_TOGGLE = "COMPANY_DETAIL_TOGGLE";

export const COMPANY_REFUSAL_TOGGLE = "COMPANY_REFUSAL_TOGGLE";

export const DETAIL_MODAL_TOGGLE = "DETAIL_MODAL_TOGGLE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";

export const COMPANY_UNIT_MODAL_TOGGLE = "COMPANY_UNIT_MODAL_TOGGLE";

export const OPERATOR_MODAL_TOGGLE = "OPERATOR_MODAL_TOGGLE";

export const OPERATOR_UNIT_MODAL_TOGGLE = "OPERATOR_UNIT_MODAL_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOAD_MY_INFO_REQUEST:
        console.log("GET SERVER SIDE PROPS ACTION");

        draft.st_loadMyInfoLoading = true;
        draft.st_loadMyInfoError = null;
        draft.st_loadMyInfoDone = false;
        break;

      case LOAD_MY_INFO_SUCCESS:
        draft.st_loadMyInfoLoading = false;
        draft.st_loadMyInfoDone = true;
        draft.st_loadMyInfoError = null;
        draft.me = action.data;
        break;

      case LOAD_MY_INFO_FAILURE:
        draft.st_loadMyInfoLoading = false;
        draft.st_loadMyInfoDone = false;
        draft.st_loadMyInfoError = action.error;
        break;

      ///////////////////////////////////////////////////////

      case LOGIN_REQUEST: {
        draft.st_loginLoading = true;
        draft.st_loginDone = null;
        draft.st_loginError = false;
        break;
      }
      case LOGIN_SUCCESS: {
        draft.st_loginLoading = false;
        draft.st_loginDone = true;
        draft.me = action.data;
        break;
      }
      case LOGIN_FAILURE: {
        draft.st_loginLoading = false;
        draft.st_loginDone = false;
        draft.st_loginError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case LOGIN_ADMIN_REQUEST: {
        draft.st_loginAdminLoading = true;
        draft.st_loginAdminDone = null;
        draft.st_loginAdminError = false;
        break;
      }
      case LOGIN_ADMIN_SUCCESS: {
        draft.st_loginAdminLoading = false;
        draft.st_loginAdminDone = true;
        draft.me = action.data;
        break;
      }
      case LOGIN_ADMIN_FAILURE: {
        draft.st_loginAdminLoading = false;
        draft.st_loginAdminDone = false;
        draft.st_loginAdminError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case SIGNUP_REQUEST: {
        draft.st_signUpLoading = true;
        draft.st_signUpDone = null;
        draft.st_signUpError = false;
        break;
      }
      case SIGNUP_SUCCESS: {
        draft.st_signUpLoading = false;
        draft.st_signUpDone = true;
        break;
      }
      case SIGNUP_FAILURE: {
        draft.st_signUpLoading = false;
        draft.st_signUpDone = false;
        draft.st_signUpError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USERLIST_REQUEST: {
        draft.st_userListLoading = true;
        draft.st_userListDone = null;
        draft.st_userListError = false;
        break;
      }
      case USERLIST_SUCCESS: {
        draft.st_userListLoading = false;
        draft.st_userListDone = true;
        draft.users = action.data;
        break;
      }
      case USERLIST_FAILURE: {
        draft.st_userListLoading = false;
        draft.st_userListDone = false;
        draft.st_userListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USERLIST_UPDATE_REQUEST: {
        draft.st_userListUpdateLoading = true;
        draft.st_userListUpdateDone = null;
        draft.st_userListUpdateError = false;
        break;
      }
      case USERLIST_UPDATE_SUCCESS: {
        draft.st_userListUpdateLoading = false;
        draft.st_userListUpdateDone = true;
        break;
      }
      case USERLIST_UPDATE_FAILURE: {
        draft.st_userListUpdateLoading = false;
        draft.st_userListUpdateDone = false;
        draft.st_userListUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case KAKAO_LOGIN_REQUEST: {
        draft.st_kakaoLoginLoading = true;
        draft.st_kakaoLoginDone = null;
        draft.st_kakaoLoginError = false;
        break;
      }
      case KAKAO_LOGIN_SUCCESS: {
        draft.st_kakaoLoginLoading = false;
        draft.st_kakaoLoginDone = true;
        draft.st_kakaoLoginError = null;
        break;
      }
      case KAKAO_LOGIN_FAILURE: {
        draft.st_kakaoLoginLoading = false;
        draft.st_kakaoLoginDone = false;
        draft.st_kakaoLoginError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMPANY_LIST_REQUEST: {
        draft.st_companyListLoading = true;
        draft.st_companyListDone = null;
        draft.st_companyListError = false;
        break;
      }
      case COMPANY_LIST_SUCCESS: {
        draft.st_companyListLoading = false;
        draft.st_companyListDone = true;
        draft.st_companyListError = null;
        draft.companyUserLists = action.data;
        break;
      }
      case COMPANY_LIST_FAILURE: {
        draft.st_companyListLoading = false;
        draft.st_companyListDone = false;
        draft.st_companyListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMPANY_SUBMIT_REQUEST: {
        draft.st_companyCreateLoading = true;
        draft.st_companyCreateDone = null;
        draft.st_companyCreateError = false;
        break;
      }
      case COMPANY_SUBMIT_SUCCESS: {
        draft.st_companyCreateLoading = false;
        draft.st_companyCreateDone = true;
        draft.st_companyCreateError = null;
        break;
      }
      case COMPANY_SUBMIT_FAILURE: {
        draft.st_companyCreateLoading = false;
        draft.st_companyCreateDone = false;
        draft.st_companyCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMPANY_REFUSAL_REQUEST: {
        draft.st_companyRefusalLoading = true;
        draft.st_companyRefusalDone = null;
        draft.st_companyRefusalError = false;
        break;
      }
      case COMPANY_REFUSAL_SUCCESS: {
        draft.st_companyRefusalLoading = false;
        draft.st_companyRefusalDone = true;
        draft.st_companyRefusalError = null;
        break;
      }
      case COMPANY_REFUSAL_FAILURE: {
        draft.st_companyRefusalLoading = false;
        draft.st_companyRefusalDone = false;
        draft.st_companyRefusalError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMPANY_APPROVAL_REQUEST: {
        draft.st_companyApprovalLoading = true;
        draft.st_companyApprovalDone = null;
        draft.st_companyApprovalError = false;
        break;
      }
      case COMPANY_APPROVAL_SUCCESS: {
        draft.st_companyApprovalLoading = false;
        draft.st_companyApprovalDone = true;
        draft.st_companyApprovalError = null;
        break;
      }
      case COMPANY_APPROVAL_FAILURE: {
        draft.st_companyApprovalLoading = false;
        draft.st_companyApprovalDone = false;
        draft.st_companyApprovalError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case COMPANY_OPERATOR_REQUEST: {
        draft.st_companyOperatorLoading = true;
        draft.st_companyOperatorDone = null;
        draft.st_companyOperatorError = false;
        break;
      }
      case COMPANY_OPERATOR_SUCCESS: {
        draft.st_companyOperatorLoading = false;
        draft.st_companyOperatorDone = true;
        draft.st_companyOperatorError = null;
        break;
      }
      case COMPANY_OPERATOR_FAILURE: {
        draft.st_companyOperatorLoading = false;
        draft.st_companyOperatorDone = false;
        draft.st_companyOperatorError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case LOGOUT_REQUEST: {
        draft.st_logoutLoading = true;
        draft.st_logoutDone = null;
        draft.st_logoutError = false;
        break;
      }
      case LOGOUT_SUCCESS: {
        draft.st_logoutLoading = false;
        draft.st_logoutDone = true;
        draft.st_logoutError = null;
        break;
      }
      case LOGOUT_FAILURE: {
        draft.st_logoutLoading = false;
        draft.st_logoutDone = false;
        draft.st_logoutError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case CARD_PATCH_REQUEST: {
        draft.st_cardPatchLoading = true;
        draft.st_cardPatchDone = null;
        draft.st_cardPatchError = false;
        break;
      }
      case CARD_PATCH_SUCCESS: {
        draft.st_cardPatchLoading = false;
        draft.st_cardPatchDone = true;
        draft.st_cardPatchError = null;
        break;
      }
      case CARD_PATCH_FAILURE: {
        draft.st_cardPatchLoading = false;
        draft.st_cardPatchDone = false;
        draft.st_cardPatchError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case CARD_GET_REQUEST: {
        draft.st_cardGetLoading = true;
        draft.st_cardGetDone = null;
        draft.st_cardGetError = false;
        break;
      }
      case CARD_GET_SUCCESS: {
        draft.st_cardGetLoading = false;
        draft.st_cardGetDone = true;
        draft.st_cardGetError = null;
        draft.cardInfo = action.data;
        break;
      }
      case CARD_GET_FAILURE: {
        draft.st_cardGetLoading = false;
        draft.st_cardGetDone = false;
        draft.st_cardGetError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case CHECKCODE_REQUEST: {
        draft.st_checkCodeLoading = true;
        draft.st_checkCodeDone = null;
        draft.st_checkCodeError = false;
        break;
      }
      case CHECKCODE_SUCCESS: {
        draft.st_checkCodeLoading = false;
        draft.st_checkCodeDone = true;
        draft.st_checkCodeError = null;
        break;
      }
      case CHECKCODE_FAILURE: {
        draft.st_checkCodeLoading = false;
        draft.st_checkCodeDone = false;
        draft.st_checkCodeError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case FILE_UPLOAD_REQUEST: {
        draft.st_fileUploadLoading = true;
        draft.st_fileUploadDone = null;
        draft.st_fileUploadError = false;
        break;
      }
      case FILE_UPLOAD_SUCCESS: {
        draft.st_fileUploadLoading = false;
        draft.st_fileUploadDone = true;
        draft.st_fileUploadError = null;
        draft.filePath = action.data.path;
        break;
      }
      case FILE_UPLOAD_FAILURE: {
        draft.st_fileUploadLoading = false;
        draft.st_fileUploadDone = false;
        draft.st_fileUploadError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_EXIT_REQUEST: {
        draft.st_userExitLoading = true;
        draft.st_userExitDone = null;
        draft.st_userExitError = false;
        break;
      }
      case USER_EXIT_SUCCESS: {
        draft.st_userExitLoading = false;
        draft.st_userExitDone = true;
        draft.st_userExitError = null;
        break;
      }
      case USER_EXIT_FAILURE: {
        draft.st_userExitLoading = false;
        draft.st_userExitDone = false;
        draft.st_userExitError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case USER_BOUGHT_LIST_REQUEST: {
        draft.st_userBoughtListLoading = true;
        draft.st_userBoughtListDone = null;
        draft.st_userBoughtListError = false;
        break;
      }
      case USER_BOUGHT_LIST_SUCCESS: {
        draft.st_userBoughtListLoading = false;
        draft.st_userBoughtListDone = true;
        draft.st_userBoughtListError = null;
        draft.userBoughtList = action.data.list;
        break;
      }
      case USER_BOUGHT_LIST_FAILURE: {
        draft.st_userBoughtListLoading = false;
        draft.st_userBoughtListDone = false;
        draft.st_userBoughtListError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case MODIFYPASS_REQUEST: {
        draft.st_userModifyPassLoading = true;
        draft.st_userModifyPassDone = null;
        draft.st_userModifyPassError = false;
        break;
      }
      case MODIFYPASS_SUCCESS: {
        draft.st_userModifyPassLoading = false;
        draft.st_userModifyPassDone = true;
        draft.st_userModifyPassError = null;
        draft.secretCode = action.data.secretCode;
        break;
      }
      case MODIFYPASS_FAILURE: {
        draft.st_userModifyPassLoading = false;
        draft.st_userModifyPassDone = false;
        draft.st_userModifyPassError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case MODIFYPASS_UPDATE_REQUEST: {
        draft.st_userModifyPassUpdateLoading = true;
        draft.st_userModifyPassUpdateDone = null;
        draft.st_userModifyPassUpdateError = false;
        break;
      }
      case MODIFYPASS_UPDATE_SUCCESS: {
        draft.st_userModifyPassUpdateLoading = false;
        draft.st_userModifyPassUpdateDone = true;
        draft.st_userModifyPassUpdateError = null;
        break;
      }
      case MODIFYPASS_UPDATE_FAILURE: {
        draft.st_userModifyPassUpdateLoading = false;
        draft.st_userModifyPassUpdateDone = false;
        draft.st_userModifyPassUpdateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      case CURRENT_ADMINMENU_STATUS: {
        const exist = draft.currentAdminMenu.filter(
          (data) => data === action.data.key
        );

        if (exist.length > 0) {
          draft.currentAdminMenu = draft.currentAdminMenu.filter(
            (data) => data !== action.data.key
          );
        } else {
          draft.currentAdminMenu = [...draft.currentAdminMenu, action.data.key];
        }

        break;
      }

      //////////////////////////////////////////////

      case FIND_EMAIL_REQUEST: {
        draft.st_findEmailLoading = true;
        draft.st_findEmailDone = false;
        draft.st_findEmailError = null;
        break;
      }
      case FIND_EMAIL_SUCCESS: {
        draft.st_findEmailLoading = false;
        draft.st_findEmailDone = true;
        draft.st_findEmailError = null;
        draft.email = action.data.email;
        break;
      }
      case FIND_EMAIL_FAILURE: {
        draft.st_findEmailLoading = false;
        draft.st_findEmailDone = false;
        draft.st_findEmailError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case COMPANY_UPLOAD_REQUEST: {
        draft.st_companyFileUploadLoading = true;
        draft.st_companyFileUploadDone = false;
        draft.st_companyFileUploadError = null;
        break;
      }
      case COMPANY_UPLOAD_SUCCESS: {
        draft.st_companyFileUploadLoading = false;
        draft.st_companyFileUploadDone = true;
        draft.st_companyFileUploadError = null;
        draft.companyFilePath = action.data.path;
        break;
      }
      case COMPANY_UPLOAD_FAILURE: {
        draft.st_companyFileUploadLoading = false;
        draft.st_companyFileUploadDone = false;
        draft.st_companyFileUploadError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case LICENSENO_UPDATE_REQUEST: {
        draft.st_licenseNoUpdateLoading = true;
        draft.st_licenseNoUpdateDone = false;
        draft.st_licenseNoUpdateError = null;
        break;
      }
      case LICENSENO_UPDATE_SUCCESS: {
        draft.st_licenseNoUpdateLoading = false;
        draft.st_licenseNoUpdateDone = true;
        draft.st_licenseNoUpdateError = null;
        break;
      }
      case LICENSENO_UPDATE_FAILURE: {
        draft.st_licenseNoUpdateLoading = false;
        draft.st_licenseNoUpdateDone = false;
        draft.st_licenseNoUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_ISPERMISSION_REQUEST: {
        draft.st_userIspermissionLoading = true;
        draft.st_userIspermissionDone = false;
        draft.st_userIspermissionError = null;
        break;
      }
      case USER_ISPERMISSION_SUCCESS: {
        draft.st_userIspermissionLoading = false;
        draft.st_userIspermissionDone = true;
        draft.st_userIspermissionError = null;
        break;
      }
      case USER_ISPERMISSION_FAILURE: {
        draft.st_userIspermissionLoading = false;
        draft.st_userIspermissionDone = false;
        draft.st_userIspermissionError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_ISSTOP_REQUEST: {
        draft.st_userIsStopLoading = true;
        draft.st_userIsStopDone = false;
        draft.st_userIsStopError = null;
        break;
      }
      case USER_ISSTOP_SUCCESS: {
        draft.st_userIsStopLoading = false;
        draft.st_userIsStopDone = true;
        draft.st_userIsStopError = null;
        break;
      }
      case USER_ISSTOP_FAILURE: {
        draft.st_userIsStopLoading = false;
        draft.st_userIsStopDone = false;
        draft.st_userIsStopError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_DISCOUNT_UPDATE_REQUEST: {
        draft.st_userDiscountUpdateLoading = true;
        draft.st_userDiscountUpdateDone = false;
        draft.st_userDiscountUpdateError = null;
        break;
      }
      case USER_DISCOUNT_UPDATE_SUCCESS: {
        draft.st_userDiscountUpdateLoading = false;
        draft.st_userDiscountUpdateDone = true;
        draft.st_userDiscountUpdateError = null;
        break;
      }
      case USER_DISCOUNT_UPDATE_FAILURE: {
        draft.st_userDiscountUpdateLoading = false;
        draft.st_userDiscountUpdateDone = false;
        draft.st_userDiscountUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case USER_MONTHPAY_TOGGLE_REQUEST: {
        draft.st_userMonthPayToggleLoading = true;
        draft.st_userMonthPayToggleDone = false;
        draft.st_userMonthPayToggleError = null;
        break;
      }
      case USER_MONTHPAY_TOGGLE_SUCCESS: {
        draft.st_userMonthPayToggleLoading = false;
        draft.st_userMonthPayToggleDone = true;
        draft.st_userMonthPayToggleError = null;
        break;
      }
      case USER_MONTHPAY_TOGGLE_FAILURE: {
        draft.st_userMonthPayToggleLoading = false;
        draft.st_userMonthPayToggleDone = false;
        draft.st_userMonthPayToggleError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case UPDATE_MODAL_OPEN_REQUEST:
        draft.updateModal = true;
        break;

      case UPDATE_MODAL_CLOSE_REQUEST:
        draft.updateModal = false;
        break;

      case COMPANY_DETAIL_TOGGLE:
        draft.companyDetailModal = !draft.companyDetailModal;
        break;

      case COMPANY_REFUSAL_TOGGLE:
        draft.companyRefusalModal = !draft.companyRefusalModal;
        break;

      case DETAIL_MODAL_TOGGLE:
        draft.detailModal = !draft.detailModal;
        break;

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      case COMPANY_UNIT_MODAL_TOGGLE:
        draft.companyUnitModal = !draft.companyUnitModal;
        break;

      case OPERATOR_MODAL_TOGGLE:
        draft.operatorModal = !draft.operatorModal;
        break;

      case OPERATOR_UNIT_MODAL_TOGGLE:
        draft.operatorUnitModal = !draft.operatorUnitModal;
        break;

      default:
        break;
    }
  });

export default reducer;
