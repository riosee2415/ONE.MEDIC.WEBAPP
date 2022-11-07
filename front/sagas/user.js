import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  //
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAILURE,
  //
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  //
  USERLIST_REQUEST,
  USERLIST_SUCCESS,
  USERLIST_FAILURE,
  //
  USERLIST_UPDATE_REQUEST,
  USERLIST_UPDATE_SUCCESS,
  USERLIST_UPDATE_FAILURE,
  //
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  //
  KAKAO_LOGIN_REQUEST,
  KAKAO_LOGIN_SUCCESS,
  KAKAO_LOGIN_FAILURE,
  //
  COMPANY_LIST_REQUEST,
  COMPANY_LIST_SUCCESS,
  COMPANY_LIST_FAILURE,
  //
  COMPANY_SUBMIT_REQUEST,
  COMPANY_SUBMIT_SUCCESS,
  COMPANY_SUBMIT_FAILURE,
  //
  COMPANY_REFUSAL_REQUEST,
  COMPANY_REFUSAL_SUCCESS,
  COMPANY_REFUSAL_FAILURE,
  //
  COMPANY_APPROVAL_REQUEST,
  COMPANY_APPROVAL_SUCCESS,
  COMPANY_APPROVAL_FAILURE,
  //
  COMPANY_OPERATOR_REQUEST,
  COMPANY_OPERATOR_SUCCESS,
  COMPANY_OPERATOR_FAILURE,
  //
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  //
  CARD_PATCH_REQUEST,
  CARD_PATCH_SUCCESS,
  CARD_PATCH_FAILURE,
  //
  CARD_GET_REQUEST,
  CARD_GET_SUCCESS,
  CARD_GET_FAILURE,
  //
  CHECKCODE_REQUEST,
  CHECKCODE_SUCCESS,
  CHECKCODE_FAILURE,
  //
  FILE_UPLOAD_REQUEST,
  FILE_UPLOAD_SUCCESS,
  FILE_UPLOAD_FAILURE,
  //
  USER_EXIT_REQUEST,
  USER_EXIT_SUCCESS,
  USER_EXIT_FAILURE,
  //
  USER_BOUGHT_LIST_REQUEST,
  USER_BOUGHT_LIST_SUCCESS,
  USER_BOUGHT_LIST_FAILURE,
  //
  MODIFYPASS_REQUEST,
  MODIFYPASS_SUCCESS,
  MODIFYPASS_FAILURE,
  //
  MODIFYPASS_UPDATE_REQUEST,
  MODIFYPASS_UPDATE_SUCCESS,
  MODIFYPASS_UPDATE_FAILURE,
  //
  FIND_EMAIL_REQUEST,
  FIND_EMAIL_SUCCESS,
  FIND_EMAIL_FAILURE,
  //
  COMPANY_UPLOAD_REQUEST,
  COMPANY_UPLOAD_SUCCESS,
  COMPANY_UPLOAD_FAILURE,
  //
  LICENSENO_UPDATE_REQUEST,
  LICENSENO_UPDATE_SUCCESS,
  LICENSENO_UPDATE_FAILURE,
  //
  USER_ISPERMISSION_REQUEST,
  USER_ISPERMISSION_SUCCESS,
  USER_ISPERMISSION_FAILURE,
  //
  USER_ISSTOP_REQUEST,
  USER_ISSTOP_SUCCESS,
  USER_ISSTOP_FAILURE,
  //
  USER_DISCOUNT_UPDATE_REQUEST,
  USER_DISCOUNT_UPDATE_SUCCESS,
  USER_DISCOUNT_UPDATE_FAILURE,
  //
  USER_MONTHPAY_TOGGLE_REQUEST,
  USER_MONTHPAY_TOGGLE_SUCCESS,
  USER_MONTHPAY_TOGGLE_FAILURE,
} from "../reducers/user";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function loadMyInfoAPI(data) {
  return await axios.get("/api/user/signin", data);
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function signinPI(data) {
  return await axios.post(`/api/user/signin`, data);
}

function* signin(action) {
  try {
    const result = yield call(signinPI, action.data);
    yield put({
      type: LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function signinAdminPI(data) {
  return await axios.post(`/api/user/signin/admin`, data);
}

function* signinAdmin(action) {
  try {
    const result = yield call(signinAdminPI, action.data);
    yield put({
      type: LOGIN_ADMIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_ADMIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function signUpAPI(data) {
  return await axios.post(`/api/user/signup`, data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: SIGNUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGNUP_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userListAPI(data) {
  return await axios.post(`/api/user/list`, data);
}

function* userList(action) {
  try {
    const result = yield call(userListAPI, action.data);
    yield put({
      type: USERLIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userListUpdateAPI(data) {
  return await axios.patch(`/api/user/level/update`, data);
}

function* userListUpdate(action) {
  try {
    const result = yield call(userListUpdateAPI, action.data);
    yield put({
      type: USERLIST_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function kakaoLoginAPI() {
  return await axios.get(`/api/user/kakaoLogin`);
}

function* kakaoLogin() {
  try {
    const result = yield call(kakaoLoginAPI);

    yield put({
      type: KAKAO_LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: KAKAO_LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyListAPI(data) {
  return await axios.get(
    `/api/user/company/list/${data.type}${
      data.type === 2 ? `?name=${data.name}&email=${data.email}` : ""
    }`
  );
}

function* companyList(action) {
  try {
    const result = yield call(companyListAPI, action.data);

    yield put({
      type: COMPANY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyCreateAPI(data) {
  return await axios.patch(`/api/user/company/create`, data);
}

function* companyCreate(action) {
  try {
    const result = yield call(companyCreateAPI, action.data);

    yield put({
      type: COMPANY_SUBMIT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_SUBMIT_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyRefusalAPI(data) {
  return await axios.patch(`/api/user/company/refusal`, data);
}

function* companyRefusal(action) {
  try {
    const result = yield call(companyRefusalAPI, action.data);

    yield put({
      type: COMPANY_REFUSAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_REFUSAL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyApprovalAPI(data) {
  return await axios.patch(`/api/user/company/approval`, data);
}

function* companyApproval(action) {
  try {
    const result = yield call(companyApprovalAPI, action.data);

    yield put({
      type: COMPANY_APPROVAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_APPROVAL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyOperatorAPI(data) {
  return await axios.patch(`/api/user/company/operator`, data);
}

function* companyOperator(action) {
  try {
    const result = yield call(companyOperatorAPI, action.data);

    yield put({
      type: COMPANY_OPERATOR_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_OPERATOR_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function logoutAPI() {
  return await axios.get(`/api/user/logout`);
}

function* logout(action) {
  try {
    const result = yield call(logoutAPI, action.data);

    yield put({
      type: LOGOUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGOUT_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function cardCreateAPI(data) {
  return await axios.patch(`/api/user/card/create`, data);
}

function* cardCreate(action) {
  try {
    const result = yield call(cardCreateAPI, action.data);

    yield put({
      type: CARD_PATCH_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CARD_PATCH_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function cardGetAPI(data) {
  return await axios.get(`/api/user/card/detail`, data);
}

function* cardGet(action) {
  try {
    const result = yield call(cardGetAPI, action.data);

    yield put({
      type: CARD_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CARD_GET_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function checkCodeAPI(data) {
  return await axios.post(`/api/user/checkCode`, data);
}

function* checkCode(action) {
  try {
    const result = yield call(checkCodeAPI, action.data);

    yield put({
      type: CHECKCODE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CHECKCODE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function fileUploadAPI(data) {
  return await axios.post(`/api/user/file`, data);
}

function* fileUpload(action) {
  try {
    const result = yield call(fileUploadAPI, action.data);

    yield put({
      type: FILE_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: FILE_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function companyUploadAPI(data) {
  return await axios.post(`/api/user/file`, data);
}

function* companyUpload(action) {
  try {
    const result = yield call(companyUploadAPI, action.data);

    yield put({
      type: COMPANY_UPLOAD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_UPLOAD_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userExitAPI(data) {
  return await axios.patch(`/api/user/exit`, data);
}

function* userExit(action) {
  try {
    const result = yield call(userExitAPI, action.data);

    yield put({
      type: USER_EXIT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_EXIT_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userBoughtListAPI(data) {
  return await axios.post(`/api/user/bought/list`, data);
}

function* userBoughtList(action) {
  try {
    const result = yield call(userBoughtListAPI, action.data);

    yield put({
      type: USER_BOUGHT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_BOUGHT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userModifyPassAPI(data) {
  return await axios.post(`/api/user/modifypass`, data);
}

function* userModifyPass(action) {
  try {
    const result = yield call(userModifyPassAPI, action.data);

    yield put({
      type: MODIFYPASS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MODIFYPASS_FAILURE,
      error: err.response.data,
    });
  }
}
// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function userModifyPassUpdateAPI(data) {
  return await axios.patch(`/api/user/modifypass/update`, data);
}

function* userModifyPassUpdate(action) {
  try {
    const result = yield call(userModifyPassUpdateAPI, action.data);

    yield put({
      type: MODIFYPASS_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MODIFYPASS_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function findEmailAPI(data) {
  return await axios.post(`/api/user/findemail`, data);
}

function* findEmail(action) {
  try {
    const result = yield call(findEmailAPI, action.data);

    yield put({
      type: FIND_EMAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: FIND_EMAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function licenseNoUpdateAPI(data) {
  return await axios.post(`/api/user/licenseNo/update`, data);
}

function* licenseNoUpdate(action) {
  try {
    const result = yield call(licenseNoUpdateAPI, action.data);

    yield put({
      type: LICENSENO_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LICENSENO_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function permissionAPI(data) {
  return await axios.post(`/api/user/permission`, data);
}

function* permission(action) {
  try {
    const result = yield call(permissionAPI, action.data);

    yield put({
      type: USER_ISPERMISSION_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_ISPERMISSION_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function isStopUpdateAPI(data) {
  return await axios.post(`/api/user/stop/update`, data);
}

function* isStopUpdate(action) {
  try {
    const result = yield call(isStopUpdateAPI, action.data);

    yield put({
      type: USER_ISSTOP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_ISSTOP_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function discountUpdateAPI(data) {
  return await axios.post(`/api/user/discount/update`, data);
}

function* discountUpdate(action) {
  try {
    const result = yield call(discountUpdateAPI, action.data);

    yield put({
      type: USER_DISCOUNT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_DISCOUNT_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function monthPayToggleAPI(data) {
  return await axios.post(`/api/user/monthPay/toggle`, data);
}

function* monthPayToggle(action) {
  try {
    const result = yield call(monthPayToggleAPI, action.data);

    yield put({
      type: USER_MONTHPAY_TOGGLE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USER_MONTHPAY_TOGGLE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchSignin() {
  yield takeLatest(LOGIN_REQUEST, signin);
}

function* watchSigninAdmin() {
  yield takeLatest(LOGIN_ADMIN_REQUEST, signinAdmin);
}

function* watchSignUp() {
  yield takeLatest(SIGNUP_REQUEST, signUp);
}

function* watchUserList() {
  yield takeLatest(USERLIST_REQUEST, userList);
}

function* watchUserListUpdate() {
  yield takeLatest(USERLIST_UPDATE_REQUEST, userListUpdate);
}

function* watchKakaoLogin() {
  yield takeLatest(KAKAO_LOGIN_REQUEST, kakaoLogin);
}

function* watchCompanyList() {
  yield takeLatest(COMPANY_LIST_REQUEST, companyList);
}

function* watchCompanyCreate() {
  yield takeLatest(COMPANY_SUBMIT_REQUEST, companyCreate);
}

function* watchCompanyRefusal() {
  yield takeLatest(COMPANY_REFUSAL_REQUEST, companyRefusal);
}

function* watchCompanyApproval() {
  yield takeLatest(COMPANY_APPROVAL_REQUEST, companyApproval);
}

function* watchCompanyOperator() {
  yield takeLatest(COMPANY_OPERATOR_REQUEST, companyOperator);
}

function* watchUserLogout() {
  yield takeLatest(LOGOUT_REQUEST, logout);
}

function* watchUserCardCreate() {
  yield takeLatest(CARD_PATCH_REQUEST, cardCreate);
}

function* watchUserCardGet() {
  yield takeLatest(CARD_GET_REQUEST, cardGet);
}

function* watchUserCheckCode() {
  yield takeLatest(CHECKCODE_REQUEST, checkCode);
}

function* watchUserFileUpload() {
  yield takeLatest(FILE_UPLOAD_REQUEST, fileUpload);
}

function* watchUserExit() {
  yield takeLatest(USER_EXIT_REQUEST, userExit);
}

function* watchUserBoughtList() {
  yield takeLatest(USER_BOUGHT_LIST_REQUEST, userBoughtList);
}

function* watchUserModifyPass() {
  yield takeLatest(MODIFYPASS_REQUEST, userModifyPass);
}

function* watchUserModifyPassUpdate() {
  yield takeLatest(MODIFYPASS_UPDATE_REQUEST, userModifyPassUpdate);
}

function* watchFindEmail() {
  yield takeLatest(FIND_EMAIL_REQUEST, findEmail);
}

function* watchCompanyUpload() {
  yield takeLatest(COMPANY_UPLOAD_REQUEST, companyUpload);
}

function* watchLicenseNoUpdate() {
  yield takeLatest(LICENSENO_UPDATE_REQUEST, licenseNoUpdate);
}

function* watchPermission() {
  yield takeLatest(USER_ISPERMISSION_REQUEST, permission);
}

function* watchIsStopUpdate() {
  yield takeLatest(USER_ISSTOP_REQUEST, isStopUpdate);
}

function* watchDiscountUpdate() {
  yield takeLatest(USER_DISCOUNT_UPDATE_REQUEST, discountUpdate);
}

function* watchMonthPayToggle() {
  yield takeLatest(USER_MONTHPAY_TOGGLE_REQUEST, monthPayToggle);
}

//////////////////////////////////////////////////////////////
export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchSignin),
    fork(watchSigninAdmin),
    fork(watchSignUp),
    fork(watchUserList),
    fork(watchUserListUpdate),
    fork(watchKakaoLogin),
    fork(watchCompanyList),
    fork(watchCompanyCreate),
    fork(watchCompanyRefusal),
    fork(watchCompanyApproval),
    fork(watchCompanyOperator),
    fork(watchUserLogout),
    fork(watchUserCardCreate),
    fork(watchUserCardGet),
    fork(watchUserCheckCode),
    fork(watchUserFileUpload),
    fork(watchUserExit),
    fork(watchUserBoughtList),
    fork(watchUserModifyPass),
    fork(watchUserModifyPassUpdate),
    fork(watchFindEmail),
    fork(watchCompanyUpload),
    fork(watchLicenseNoUpdate),
    fork(watchPermission),
    fork(watchIsStopUpdate),
    fork(watchDiscountUpdate),
    fork(watchMonthPayToggle),
    //
  ]);
}
